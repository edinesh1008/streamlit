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

import { describe, expect, test } from "vitest"

import { simpleColumnTypeDetector } from "./simpleColumnTypeDetector.js"

describe("simpleColumnTypeDetector", () => {
  test("quantitative columns", () => {
    const inputs = [0, 123, NaN, 10.2]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("quantitative")
    })
  })

  test("temporal columns", () => {
    const inputs = [new Date()]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("temporal")
    })
  })

  test("nominal columns", () => {
    const inputs = [
      "foo",
      true,
      false,
      null,
      undefined,
      { foo: 123 },
      [10, 11],
    ]
    inputs.forEach(v => {
      const out = simpleColumnTypeDetector(v)
      expect(out).toEqual("nominal")
    })
  })
})
