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

import { VlFieldType } from "./configTypes.js"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function simpleColumnTypeDetector(exampleValue: any): VlFieldType {
  switch (getTypeAsStr(exampleValue)) {
    case "number":
      return "quantitative"

    case "date":
      return "temporal"

    default:
      return "nominal"
  }
}

type TypeStr =
  | "object"
  | "date"
  | "unknown"
  | "bigint"
  | "boolean"
  | "function"
  | "number"
  | "string"
  | "symbol"
  | "undefined"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getTypeAsStr(obj: any): TypeStr {
  const simple_type = typeof obj
  if (simple_type != "object") return simple_type

  if (obj instanceof Date) return "date"
  if (obj instanceof Object) return "object"

  return "unknown"
}
