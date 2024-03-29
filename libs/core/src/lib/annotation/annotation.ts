import { Registry, Scope } from "@linkcat/utils";
import { Context } from "../context";
import { DefaultMatcherFactory, DefaultMatcherProto, ExactMatcherFactory } from "../matcher";
import { Payload } from "../payload";
import { AnnotateService } from "../service";
import { Task } from "../task";
import { Plugin } from "../plugin"

export class Annotation {
  _value: Annotation.Value = ['true'];
  constructor(public key: string = "noop", public name: string) {
  }
  set value(val: string[] | string) {
    //TODO add prior check
    if (typeof val === "object") {
      this._value.push(...val)
    } else {
      this._value.push(val);
    }
  }
  get value() {
    return this.toString();
  }
  valueToString(): string {
    return this._value.join(',');
  }
  toString(): string {
    return `${this.name}=[${this.valueToString()}]`;
  }
}


export namespace Annotation {



  export class Definition {
    key = "";
    static Separator = '&';
    dependent?: [Resolver, DataProcessor][];
    aliases: string[] = [];
    dup = 0;
    _value: Definition[] = [];
    description = "";
    basic = false;
    isValue = false;
    constructor(key: string, name: string) {
      this.key = key;
      this.addAlias(name);
    }
    getKey() {
      return this.key;
    }
    addAlias(alias: string) {
      if (this.aliases.includes(alias)) {
        //TODO add warnning
        this.dup++;
        return;
      }
      this.aliases.push(alias);
    }
    value(type: BaseTypeDefinitions | Definition[] | Definition) {
      if (typeof type === "string") {
        this._value = [Annotation.BaseTypeDefinition[type]];
      }
      else if (type instanceof Array) {
        this._value = type;
      }
      else {
        this._value = [type];
      }
    }
    is(name: string) {
      return this.aliases.includes(name) || this.key == name;
    }
    generate(): Annotation {
      return new Annotation(this.key, this.aliases[0]);
    }
  }
  export class DataProcessor implements Task.DataProcessor<Context, Payload>{
    name = "";
    key = "";
    priority = 0;
    active = true;
    process: (ctx: Context, payload: Payload) => number = () => 0;
    constructor(public resolver: Resolver) { };
  }

  export class Resolver implements Registry.Item<number>{
    type: Resolver.Type = Resolver.Type.Filler;
    static defaultScope: Scope = new Scope();
    preparers?: DataProcessor[];
    priority = 0;
    filler: [Annotation.Definition, DataProcessor][] = [];
    finalizers?: DataProcessor[];
    scope: Scope = Resolver.defaultScope;
    constructor(public plugin: Plugin.Id, public id: number) {

    }
  }
  export namespace Resolver {()
    export enum Type {
      Filler,
      Decorator
    }
  }
  export type Value = string[];
  export namespace Value {
    export const RawText = new Annotation.Definition("RawText", "RawText");
    export const Url = new Annotation.Definition("Url", "Url");
    export const JSON = new Annotation.Definition("JSON", "JSON");
    export const MarkDown = new Annotation.Definition("MarkDown", "MarkDown");
    export const Number = new Annotation.Definition("Number", "Number");
    export const Boolean = new Annotation.Definition("Boolean", "Boolean");
    RawText.basic = true;
    Url.basic = true;
    JSON.basic = true;
    MarkDown.basic = true;
    Number.basic = true;
    Boolean.basic = true;
  }
  export interface BaseTypeDefinition {
    "RawText": Definition;
    "Url": Definition;
    "JSON": Definition;
    "MarkDown": Definition;
    "Number": Definition;
    "Boolean": Definition;
  }
  export const BaseTypeDefinition: BaseTypeDefinition = {
    "RawText": Value.RawText,
    "Url": Value.Url,
    "JSON": Value.JSON,
    "MarkDown": Value.MarkDown,
    "Number": Value.Number,
    "Boolean": Value.Boolean,
  };
  export type BaseTypeDefinitions = keyof BaseTypeDefinition;
  type RetrieveFirstAnnotationKey<Str> = Str extends string ? Str extends `${infer A};${string}` ? A : Str : never;
  type AnnotationsRetriever<AnnoStr extends string> = string extends AnnoStr
    ? AnnoStr :
    AnnoStr extends `${string};${infer Rest}` ?
    RetrieveFirstAnnotationKey<AnnoStr> | (
      AnnotationsRetriever<Rest>
    )
    : AnnoStr;

  export class Builder {
    private _defs: Annotation.Definition[] = [];
    private _resolver: Resolver;
    private _service: AnnotateService;
    private _curdef: Annotation.Definition | null = null;
    constructor(private ctx: Context) {
      this._service = ctx.services.annotate;
      this._resolver = new Resolver((ctx.env as Plugin).id, -1);
    }
    prepare(preparer: Task.DataProcessorFn<Context, Payload>) {
      this._resolver.preparers ||= [];
      const processor = new DataProcessor(this._resolver);
      processor.process = preparer;
      this._resolver.preparers.push(processor);
      return this;
    }
    fill(key: string, name: string, filler?: Task.DataProcessorFn<Context, Payload>) {
      const def = this.ctx.services.annotate.registry.get(key)[0]
      if (def) {
        def.addAlias(name);
        this._resolver.filler ||= [];
        const processor = new DataProcessor(this._resolver);
        processor.process = filler ?? ((_ctx, payload) => { payload.annotations[key] = "true" });
        this._resolver.filler.push([def, processor]);

      }
      else {
        //TODO throw Error
      }
      return this;
    }
    priority(prior: number) {
      this._resolver.priority = prior;
    }

    define<Key extends string, Name extends string, Val extends string | Annotation.Definition>(key: Key, name: Name, valueTypes: Val,
      filler?: Task.DataProcessorFn<Context, Payload<Key, Val extends string ? AnnotationsRetriever<Val> : string>>, factory?: DefaultMatcherFactory<DefaultMatcherProto, DefaultMatcherProto.Config>) {
      let def;
      const service = this._service;
      if ((def = this.ctx.annotations.get(key)[0]) == undefined) {
        def = new Annotation.Definition(key, name);
      }
      def.addAlias(name);
      if (service.AnnotationDependents[def.key]) {
        if (factory && service.AnnotationDependents[def.key].factory.config.priority < factory.config.priority) {
          const pre = service.AnnotationDependents[def.key].factory;
          service.AnnotationDependents[def.key].factory = factory;
          pre.traverse(item => factory.gen(item.config));
        }
      }
      else {
        service.AnnotationDependents[def.key] = {
          factory: factory ?? new ExactMatcherFactory(-1, { priority: 0, name: "default", resolver: -1, goal: "*" }),
          fillers: []
        }
      }
      if (valueTypes instanceof Annotation.Definition) {
        def.value(valueTypes);
      } else {
        const dataProcessor: Task.DataProcessor<Context, Payload> = {
          process: () => {
            const annotation = this.ctx.services.annotate.registry.get(key)[0];
            const vals: Annotation.Definition[] = [];
            let val: Annotation.Definition;
            valueTypes.split(";").forEach(valuekey => {
              if (undefined != (val = this.ctx.services.annotate.registry.get(valuekey)[0])) {
                val.isValue = true;
                vals.push(val);
              }
            });
            annotation.value(vals);
            return 0;
          }
        }
        this._service.pend(new Task(`Annotation.DefValueResolve:[${key}]=${valueTypes.toString()}`, dataProcessor))
      }

      this._curdef = def;
      this._defs.push(def);
      this._resolver.filler ||= [];
      const processor = new DataProcessor(this._resolver);
      processor.key = def.key;
      processor.name = def.key
      processor.process = filler ?? ((_ctx, payload) => { payload.annotations[key] = "true" });
      this._resolver.filler.push([def, processor]);
      return this;
    }
    finalize(finalizer: Task.DataProcessorFn<Context, Payload>) {
      this._resolver.finalizers ||= [];
      const processor = new DataProcessor(this._resolver);
      processor.process = finalizer;
      this._resolver.finalizers.push(processor);
      return this;
    }
    matcher(factory: DefaultMatcherFactory<DefaultMatcherProto, DefaultMatcherProto.Config>) {
      if (this._curdef) {
        const def = this._curdef;
        const service = this._service;
        const pre = service.AnnotationDependents[def.key].factory;
        service.AnnotationDependents[def.key].factory = factory;
        pre.traverse(item => factory.gen((item as DefaultMatcherProto).config));
      }

      return this;
    }
    register() {
      this._resolver.scope = this.ctx.scope.clone();
      const service = this._service;
      service.mount(this._resolver);
      this._defs.forEach(def => {
        service.registry.register(def);
      });
    }
    alias(alias: string) {
      this._curdef?.addAlias(alias);
      return this;
    }
  }
}
export type AnnotationResolver = (ctx: Context, payload: Payload) => void;
