export type Awaitable<T> = Promise<T> | T;
export type Next = () => Awaitable<void>;

export interface MiddlwareEntry<T, D, R> {
  use(...middlwares: Middleware<T, D, R>[]): void;
  dispatch(ctx: T, payload: D): R;
}
export type Middleware<T, D, R> = (
  ctx: T,
  payload: D,
  next: Next
) => R | void;

export async function AsyncForEach<T>(
  array: Array<T>,
  callback: (item: T, index: number, array: Array<T>) => void
) {
  let res;
  for (let index = 0; index < array.length; index++) {
    res = await callback(array[index], index, array);
    if (res !== undefined) return res;
  }
}

export class MiddlwareEntry<T, D, R> implements MiddlwareEntry<T, D, R> {
  private middlwares: Middleware<T, D, R>[];
  constructor() {
    this.middlwares = [];
  }
  prepend(...middlewares: Middleware<T, D, R>[]): MiddlwareEntry<T, D, R> {
    this.middlwares.unshift(...middlewares);
    return this;
  }
  use(...middlwares: Middleware<T, D, R>[]): MiddlwareEntry<T, D, R> {
    this.middlwares.push(...middlwares);
    return this;
  }

  dispatch(
    ctx: T,
    payload: D,
    callback?: (ctx: T, payload: D, result: R) => R
  ): R {
    return callback
      ? callback(
          ctx,
          payload,
          _invokeMiddlewares(ctx, payload, this.middlwares)
        )
      : _invokeMiddlewares(ctx, payload, this.middlwares);
  }
}
function _invokeMiddlewares<T, D, R>(
  ctx: T,
  payload: D,
  middlewares: Middleware<T, D, R>[]
): R {
  const length = middlewares.length;
  if (!length) return;
  let next = false;
  let res;
  for (let i = 0; i < length; i++) {
    // eslint-disable-next-line no-loop-func
    next=false;
    res = middlewares[i](ctx, payload, () => {
      next = true;
    });
    if (!next && res !== undefined) return res;
  }
}


export interface AbstractDragEvent{
  type:"DropBettwen"|"DropIn",
  dragged:number;
  target:number;
}
export interface DropInCompDragEvent extends AbstractDragEvent{
  type:"DropIn",
  target:number;
}
export interface DropBettwenDragEvent extends AbstractDragEvent{
  type:"DropBettwen",
  parent:number;
  position:"Down"|"Up",
}
export type SimpleDragEvent = DropInCompDragEvent|DropBettwenDragEvent
