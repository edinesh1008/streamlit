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

import { useEffect, useState, useCallback, useMemo, useRef } from "react"

import { Config, ColumnTypes } from "../configTypes.js"

import { InitialState, StateValue } from "../stateTypes.js"
import { Presets } from "../presetTypes.js"

import { BuilderState } from "../BuilderState.js"

function useTrackedMemo(factory, dependencies, name = "useTrackedMemo") {
  const prevDependenciesRef = useRef([])

  const result = useMemo(() => {
    if (prevDependenciesRef.current.length > 0) {
      dependencies.forEach((dep, index) => {
        if (dep !== prevDependenciesRef.current[index]) {
          console.log(`[${name}] Dependency at index ${index} changed:`, {
            previous: prevDependenciesRef.current[index],
            current: dep,
          })
        }
      })
    }

    prevDependenciesRef.current = dependencies
    return factory()
  }, dependencies)

  return result
}

export function useBuilderState(
  columnTypes: ColumnTypes,
  config: Config,
  initialState?: InitialState,
  presets?: Presets
): [BuilderState, StateValue] {
  const [stateValue, setStateValue] = useState<StateValue>({
    layers: [],
    currentLayerIndex: 0,
    preset: null,
  })

  const state = useTrackedMemo(
    () =>
      new BuilderState(columnTypes, config, initialState, presets, v =>
        setStateValue(v)
      ),
    [columnTypes, config, initialState, presets, setStateValue]
  )

  return [state, stateValue]
}
