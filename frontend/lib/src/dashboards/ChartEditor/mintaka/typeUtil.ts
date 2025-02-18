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

export type json =
  | string
  | number
  | boolean
  | null
  | undefined // Not quite JSON, but convertible to null, so OK.
  | json[]
  | { [key: string]: json }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>
export type PlainRecord<T> = Record<string, T>
export type JsonRecord = PlainRecord<json>
export type Grouping<T> = PlainRecord<T>

export type JsonSetter = (value: json) => void

export type ValueOf<T> = T[keyof T]
