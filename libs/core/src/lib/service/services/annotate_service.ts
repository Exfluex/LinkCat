import { AsyncForEach, DefaultNumberRegistry } from "@linkcat/utils";
import { Annotation } from "../../annotation";
import { AnnotationDefinitionRegistry, annotationRegistry, Context, Next } from "../../context/context"
import { DefaultMatcherFactory, DefaultMatcherProto, ExactMatcherFactory, PathMatcherFactory } from "../../matcher";
import { Payload } from "../../payload/payload";
import { DefaultTask, DefaultTaskLoop } from "../../../index";
import { Task, TaskLoop } from "../../../index";
import { Service } from "../service";
import { MetaRetrieverPlugin } from "../../plugins";
import { ResourceOriginFillerPlugin } from "../../plugins/originfiller";






export interface AnnotateService {

}


export class AnnotateService extends Service implements TaskLoop<Context, Payload>{
  active: boolean = false;
  start(): void {
    this.active = true;
    this.loopUntilEmpty(this.app, new Payload(this.app), {});
  }
  stop(): void {
    this.active = false;
  }
  static middlewares: AnnotateService.Middleware[] = [];
  taskLoop: DefaultTaskLoop = new DefaultTaskLoop("annotateService");
  registry: AnnotationDefinitionRegistry = annotationRegistry;
  async apply(ctx: Context, payload: Payload, next: Next): Promise<number> {
    if (this.active) {
      await this.annotate(ctx, payload);
      next(1);
      return 0;
    }
    return -1;
  }
  async annotate(ctx: Context, payload: Payload): Promise<number> {
    this.pendByType("Add General Resolvers", { service: this });
    await this.loopUntilEmpty(ctx, payload);
    return 0;
  };
  resolve(ctx: Context): number {
    return 0;
  };
  constructor(ctx: Context) {
    super(ctx, "annotate");
    ctx.plugin(ResourceOriginFillerPlugin);
    ctx.plugin(MetaRetrieverPlugin);
  }
  id: string = "AnnotateService";
  async loopUntilEmpty(ctx: Context, payload: Payload, config?: any): Promise<Payload> {
    return await this.taskLoop.loopUntilEmpty(ctx, payload);
  }
  pendByType(taskType: string, data: any) {
    let taskFac = AnnotateService.TaskTypes[taskType];
    if (taskFac != undefined) {
      this.pend(taskFac(data));
    }
    //TODO throw error here
  }
  pend(task: Task<Context, Payload>): boolean {
    return this.taskLoop.pend(task);
  }
  length(): number {
    return this.taskLoop.length();
  }
  resolverRegistry: DefaultNumberRegistry<Annotation.Resolver> = new DefaultNumberRegistry<Annotation.Resolver>();
  GeneralResolvers: Annotation.Resolver[] = [];
  AnnotationDependents: {
    [key: string]: {
      factory: DefaultMatcherFactory<DefaultMatcherProto, DefaultMatcherProto.Config>;
      fillers: Annotation.DataProcessor[];
    }
  } = {};
  mount(resolver: Annotation.Resolver) {
    resolver.id = this.resolverRegistry.generateId();
    this.resolverRegistry.register(resolver);
    if (resolver.scope.count == 0) {
      this.GeneralResolvers.push(resolver);
    }
    for (const key in resolver.scope.pairs) {
      if (Object.prototype.hasOwnProperty.call(resolver.scope.pairs, key)) {
        if (this.AnnotationDependents[key] == undefined) {
          this.AnnotationDependents[key] = {
            factory: new ExactMatcherFactory(-1, { priority: 0, name: "default", goal: "_", resolver: -1 }),
            fillers: [],

          }
        }
        this.AnnotationDependents[key].factory.gen({ goal: resolver.scope.pairs[key], resolver: resolver.id, priority: 0, name: key,} as any);
      }
    }

    resolver.filler.forEach(([def, proc]) => {
      const { fillers } = this.AnnotationDependents[def.key];
      fillers.push(proc);
    })
  }
}





export namespace AnnotateService {
  export const GeneralResolvers = Symbol("*")
  export type Middleware = (ctx: Context, payload: Payload) => number;


  export type Env = { ctx: Context, payload: Payload };
  //TODO retrieve these as TemplateRegistry
  export let TaskTypes: {
    [type: string]: (data: any) => Task<Context, Payload>;
  } = {
    "Add General Resolvers": ({ service }: { service: AnnotateService } & Env) => {
      return new DefaultTask("Add General Resolvers", {
        process: (ctx, payload) => {

          service.GeneralResolvers.forEach(resolver => {
            service.pendByType("Add Resolver Execution", { resolver });
          })
        }
      })
    },
    "Add Resolver Execution": ({ resolver }: { resolver: Annotation.Resolver } & Env) => {
      return new DefaultTask("Add Resolver Executeion", {
        process: async (ctx, payload) => {
          if (resolver.preparers)
            await AsyncForEach<Annotation.DataProcessor>(resolver.preparers, async proc => await proc.process(ctx, payload));
          if (resolver.filler)
            await AsyncForEach<[Annotation.Definition, Annotation.DataProcessor]>(resolver.filler,
              async ([def, proc]) => {
                if (!def.isValue) {
                  await proc.process(ctx, payload);
                  ctx.services.annotate.pendByType("Add Matcher Check", { ctx, payload, def });
                }
              }
            );
          if (resolver.finalizers)
            await AsyncForEach<Annotation.DataProcessor>(resolver.finalizers, async proc => await proc.process(ctx, payload));
        }
      })
    },
    "Add Matcher Check": ({ def }: { def: Annotation.Definition } & Env) => {
      return new DefaultTask("Add Matcher Check", {
        process: (ctx, payload) => {
          ctx.services.annotate.AnnotationDependents[def.key].factory.match(payload.annotations[def.key], { ctx, payload });
        }
      })
    },
    "Fill Single Annotation": ({ def, fillers }: { def: Annotation.Definition, fillers: Annotation.DataProcessor[] } & Env) => {
      return new DefaultTask("Fill Single Annotation", {
        process: async (ctx, payload) => {
          if (fillers.length > 0) {
            let filler = fillers[0];
            let resolver = filler.resolver;
            if (resolver.preparers)
              await AsyncForEach<Annotation.DataProcessor>(resolver.preparers, async proc => await proc.process(ctx, payload));
            await filler.process(ctx, payload);
            if (resolver.finalizers)
              await AsyncForEach<Annotation.DataProcessor>(resolver.finalizers, async proc => await proc.process(ctx, payload));
            ctx.services.annotate.pendByType("Add Matcher Check", { ctx, payload, def });
          }
        }
      })
    }
  }
}
