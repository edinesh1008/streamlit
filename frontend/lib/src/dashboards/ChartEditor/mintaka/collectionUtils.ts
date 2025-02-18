/**
 * Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import includes from "lodash/includes"

import { PlainRecord } from "./typeUtil.js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function haveAnyElementsInCommon(arr1: any[], arr2: any[]): boolean {
  return arr1.some(el1 => includes(arr2, el1))
}

type MapFn<T> = ([k, v]: [string, T]) => [string, T]
type FilterFn<T> = ([k, v]: [string, T]) => boolean

export function objectFrom<T>(
  obj?: PlainRecord<T> | null,
  fn?: MapFn<T>
): PlainRecord<T> {
  if (!obj) return {}

  // Don't use spread operator, to maintain ordering.
  if (!fn) return Object.fromEntries(Object.entries(obj))

  const entries = Object.entries(obj)
    .map(fn)
    .filter(item => !!item)

  return Object.fromEntries(entries as Array<[string, T]>)
}

// This is like lodash's pickBy, but we guarantee original ordering.
export function objectFilter<T>(
  obj: PlainRecord<T>,
  fn: FilterFn<T>
): PlainRecord<T> {
  // Don't use spread operator, to maintain ordering.
  return Object.fromEntries(Object.entries(obj).filter(fn))
}

// Does not support cycles.
export function deepClone<T>(thing: T): T {
  if (Array.isArray(thing)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr = thing as Array<any>
    return arr.map(v => deepClone(v)) as T
  }

  // Don't use spread operator, to maintain ordering.
  if (thing instanceof Object) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj = thing as PlainRecord<any>
    return objectFrom(obj, ([k, v]) => [k, deepClone(v)]) as T
  }

  return thing
}
