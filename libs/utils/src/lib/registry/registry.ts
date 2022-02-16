


export namespace Registry{
  export interface Item<ID>{
    id:ID;
  }
  export namespace Item{
  }
  export type traverseFn<Item> = (item:Item,data:any)=>void;
}

export interface Registry<ID,I extends Registry.Item<ID>>{
  register(item:I):this;
  unregister(id:ID):this;
  traverse(traverse:Registry.traverseFn<I>):this;
  find(id:ID):Registry.Item<ID>[];
}



export namespace CRegistry{
  export interface Item<ID>{
    id:ID;
  }
}
