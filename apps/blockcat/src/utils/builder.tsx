
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Method = (...any:any[])=>any;
export type AllowActions<Actions extends keyof Builder,Builder> = {[A in Actions]:Builder[A] extends Method?Builder[A]:never};
export type Methods<Builder> = {[A in keyof Builder]:Builder[A] extends Method?A:never}[keyof Builder];
export type ExceptMethods<Except extends keyof Builder,Builder> = {[key in  Exclude<Methods<Builder>,Except>]:Builder[key]};
export type DisallowActions<DisAllowed extends keyof Builder , Builder> = {[key in  Exclude<Methods<Builder>,DisAllowed>]:Builder[key] extends Method?Builder[key]:never};


