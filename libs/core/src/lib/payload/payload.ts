import { Context } from "../context";
import { AnnotateService } from "../service";
import { PageHelper } from "../service/services/page_service";








export class Payload<A extends string=any,V extends string=string> implements Payload.Scoped {
  set<Key extends A>(key: Key, value: V) {
    this.annotations[Payload.AnnotationSetter].call(this.annotations,key,value);
  }
  constructor(private ctx: Context) {
    this.annotations = new Payload.Annotations();

    this.data={};
    this.plugin={};
    //@ts-ignore
    this.global={

    };
  }
}
export interface Payload<A extends string,V extends string=string> extends Payload.Scoped {
  annotations: Payload.Annotations;
  origin: string;
  data: Payload.Pair<string,any>;
}

export namespace Payload {
  export const Count = Symbol("count");
  export interface Scoped {
    current:any;
    global: Pair<string,any> & {
      "$page": PageHelper;
    };
    plugin: Pair<string,any>;
  }

  export type Pair<K extends number|string|symbol, V> = {
    [k in K]: V;
  };
  export const AnnotateService = Symbol("AnnotateService");
  export const AnnotationSetter = Symbol("AnnotationSetter");

  export class Annotations implements Pair<string,string>{
    [AnnotationSetter]: ((key: string, val: string) => void) = (key, valkey) => {
      let ann;
      if ((ann = this[AnnotateService].registry.get(key)[0]) != undefined) {
        if (ann._value.length == 1 && ann._value[0].basic){
          this[key]=valkey;
          return;
        }
          ann._value.forEach(valr => {
            if (valr.key == valkey) {
              this[key] = valr.aliases[0];
              this[AnnotateService].pendByType("Fill Single Annotation",{def:valr,fillers:this[AnnotateService].AnnotationDependents[valr.key].fillers});
              return;
            }
          });

      }
    }
    [AnnotateService]: AnnotateService;
    constructor() {
      this[AnnotateService] = Context.services["annotate"] as AnnotateService;
    }
    [key:string]:string;
  }

}

