import { json } from '@remix-run/node';

export const badRequest = <T>(data: T) => json<T>(data, { status: 400 })
// <T> = generic function, 
// type T is determined by the caller of the function at the time of invocation.