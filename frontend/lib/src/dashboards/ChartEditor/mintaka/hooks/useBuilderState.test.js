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
import { renderHook } from "@testing-library/react"

import * as configDefaults from "../configDefaults.js"

import { useBuilderState } from "./useBuilderState.js"
import { PRESETS } from "../presetDefaults.js"

describe("useBuilderState", () => {
  test("empty arguments", () => {
    const columnTypes = {}
    const config = {}
    const initialState = {}
    const presets = null

    const { result } = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof result.current.reset).toEqual("function")
    expect(typeof result.current.setPreset).toEqual("function")
    expect(typeof result.current.setMark).toEqual("function")
    expect(typeof result.current.setEncoding).toEqual("function")
    expect(typeof result.current.getMarkSetter).toEqual("function")
    expect(typeof result.current.getEncodingSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(PRESETS)[0])
    expect(result.current.mark).toEqual({})
    expect(result.current.encoding).toEqual({})
  })

  test("with config and column types", () => {
    const columnTypes = {
      temp1: { type: "temporal" },
      ord1: { type: "ordinal" },
      quant1: { type: "quantitative" },
      temp2: { type: "temporal" },
      ord2: { type: "ordinal" },
      nom1: { type: "nominal" },
      quant2: { type: "quantitative" },
      ord3: { type: "ordinal" },
      nom2: { type: "nominal" },
      quant3: { type: "quantitative" },
      temp3: { type: "temporal" },
      nom3: { type: "nominal" },
    }
    const config = configDefaults
    const initialState = {}
    const presets = null

    const { result } = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof result.current.reset).toEqual("function")
    expect(typeof result.current.setPreset).toEqual("function")
    expect(typeof result.current.setMark).toEqual("function")
    expect(typeof result.current.setEncoding).toEqual("function")
    expect(typeof result.current.getMarkSetter).toEqual("function")
    expect(typeof result.current.getEncodingSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(PRESETS)[0])
    expect(result.current.mark).toEqual({
      type: "point",
      tooltip: true,
    })
    expect(result.current.encoding).toEqual({
      x: { zero: false, field: "quant1" },
      y: { zero: false, field: "quant2" },
      color: { field: "ord1" },
    })
  })

  test("with config, initialState and column types", () => {
    const columnTypes = {
      temp1: { type: "temporal" },
      ord1: { type: "ordinal" },
      quant1: { type: "quantitative" },
      temp2: { type: "temporal" },
      ord2: { type: "ordinal" },
      nom1: { type: "nominal" },
      quant2: { type: "quantitative" },
      ord3: { type: "ordinal" },
      nom2: { type: "nominal" },
      quant3: { type: "quantitative" },
      temp3: { type: "temporal" },
      nom3: { type: "nominal" },
    }
    const config = configDefaults
    const initialState = {
      mark: { type: "areaFoo" },
    }
    const presets = null

    const { result } = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof result.current.reset).toEqual("function")
    expect(typeof result.current.setPreset).toEqual("function")
    expect(typeof result.current.setMark).toEqual("function")
    expect(typeof result.current.setEncoding).toEqual("function")
    expect(typeof result.current.getMarkSetter).toEqual("function")
    expect(typeof result.current.getEncodingSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(PRESETS)[0])
    expect(result.current.mark).toEqual({
      type: "areaFoo",
    })
    expect(result.current.encoding).toEqual({
      x: { zero: false, field: "quant1" },
      y: { zero: false, field: "quant2" },
      color: { field: "ord1" },
    })
  })

  test("with config, initialState 2 and column types", () => {
    const columnTypes = {
      temp1: { type: "temporal" },
      ord1: { type: "ordinal" },
      quant1: { type: "quantitative" },
      temp2: { type: "temporal" },
      ord2: { type: "ordinal" },
      nom1: { type: "nominal" },
      quant2: { type: "quantitative" },
      ord3: { type: "ordinal" },
      nom2: { type: "nominal" },
      quant3: { type: "quantitative" },
      temp3: { type: "temporal" },
      nom3: { type: "nominal" },
    }
    const config = configDefaults
    const initialState = {
      encoding: {
        x: { value: "x1" },
        y: { value: "y1" },
      },
    }
    const presets = null

    const { result } = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof result.current.reset).toEqual("function")
    expect(typeof result.current.setPreset).toEqual("function")
    expect(typeof result.current.setMark).toEqual("function")
    expect(typeof result.current.setEncoding).toEqual("function")
    expect(typeof result.current.getMarkSetter).toEqual("function")
    expect(typeof result.current.getEncodingSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(PRESETS)[0])
    expect(result.current.mark).toEqual({
      type: "point",
      tooltip: true,
    })
    expect(result.current.encoding).toEqual({
      x: { value: "x1" },
      y: { value: "y1" },
    })
  })

  test("with config, presets, and column types", () => {
    const columnTypes = {
      temp1: { type: "temporal" },
      ord1: { type: "ordinal" },
      quant1: { type: "quantitative" },
      temp2: { type: "temporal" },
      ord2: { type: "ordinal" },
      nom1: { type: "nominal" },
      quant2: { type: "quantitative" },
      ord3: { type: "ordinal" },
      nom2: { type: "nominal" },
      quant3: { type: "quantitative" },
      temp3: { type: "temporal" },
      nom3: { type: "nominal" },
    }
    const config = configDefaults
    const initialState = null
    const presets = {
      preset1: {
        findColumns: {
          xCol: { type: ["temporal"] },
          yCol: { type: ["nominal"] },
        },

        mark: {
          type: "foo",
        },

        ifColumn: {
          xCol: {
            encoding: { x: { field: "xCol" } },
          },
          yCol: {
            encoding: { y: { field: "yCol" } },
          },
        },
      },

      preset2: {
        findColumns: {
          xCol: { type: ["nominal"] },
          yCol: { type: ["ordinal"] },
        },

        mark: {
          type: "bar",
        },

        ifColumn: {
          xCol: {
            encoding: { x: { field: "xCol" } },
          },
          yCol: {
            encoding: { y: { field: "yCol" } },
          },
        },
      },
    }

    const { result } = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof result.current.reset).toEqual("function")
    expect(typeof result.current.setPreset).toEqual("function")
    expect(typeof result.current.setMark).toEqual("function")
    expect(typeof result.current.setEncoding).toEqual("function")
    expect(typeof result.current.getMarkSetter).toEqual("function")
    expect(typeof result.current.getEncodingSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(presets)[0])
    expect(result.current.mark).toEqual({
      type: "foo",
    })
    expect(result.current.encoding).toEqual({
      x: { field: "temp1" },
      y: { field: "nom1" },
    })
  })

  test("with config, initialState, presets, and column types", () => {
    const columnTypes = {
      temp1: { type: "temporal" },
      ord1: { type: "ordinal" },
      quant1: { type: "quantitative" },
      temp2: { type: "temporal" },
      ord2: { type: "ordinal" },
      nom1: { type: "nominal" },
      quant2: { type: "quantitative" },
      ord3: { type: "ordinal" },
      nom2: { type: "nominal" },
      quant3: { type: "quantitative" },
      temp3: { type: "temporal" },
      nom3: { type: "nominal" },
    }
    const config = configDefaults
    const initialState = {
      mark: {
        type: "bar",
      },
    }
    const presets = {
      preset1: {
        findColumns: {
          xCol: { type: ["temporal"] },
          yCol: { type: ["nominal"] },
        },

        mark: {
          type: "foo",
        },

        ifColumn: {
          xCol: {
            encoding: { x: { field: "xCol" } },
          },
          yCol: {
            encoding: { y: { field: "yCol" } },
          },
        },
      },

      preset2: {
        findColumns: {
          xCol: { type: ["nominal"] },
          yCol: { type: ["ordinal"] },
        },

        mark: {
          type: "bar",
        },

        ifColumn: {
          xCol: {
            encoding: { x: { field: "xCol" } },
          },
          yCol: {
            encoding: { y: { field: "yCol" } },
          },
        },
      },
    }

    const [num, state] = renderHook(() =>
      useBuilderState(columnTypes, config, initialState, presets)
    )

    expect(typeof state.reset).toEqual("function")
    expect(typeof state.getEncodingSetter).toEqual("function")
    expect(typeof state.getMarkSetter).toEqual("function")

    expect(result.current.preset).toEqual(Object.values(presets)[0])
    expect(result.current.mark).toEqual({
      type: "bar",
    })
    expect(result.current.encoding).toEqual({
      x: { field: "temp1" },
      y: { field: "nom1" },
    })
  })
})
