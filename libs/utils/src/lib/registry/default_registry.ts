import { Registry } from "./registry";



export class DefaultNumberRegistry<Item extends Registry.Item<number>> implements Registry<number,Item>{
  items:Record<number,Item>={};
  register(item: Item,data?:any): this {
    if(this.items[item.id] == undefined){
      this.items[item.id] = item;
    }
    else{
      throw new Error("Dup Id");
    }
    return this;
  }
  unregister(id: number): this {
    if(this.items[id] != undefined){
      delete this.items[id];
    }
    return this;
  }
  maxId:number=0;
  generateId(){
    return this.maxId++;
  }
  traverse(traverse: Registry.traverseFn<number>,data?:any): this {
    for (const key in this.items) {
      if (Object.prototype.hasOwnProperty.call(this.items, key)) {
          const item = this.items[key];
          traverse(item,data);
      }
    }
    return this;
  }
  find(id: number): Registry.Item<number>[] {
    return [this.items[id]];
  }

}
