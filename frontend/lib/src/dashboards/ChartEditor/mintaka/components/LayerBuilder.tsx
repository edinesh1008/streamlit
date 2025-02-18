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

import { ReactNode, memo, useCallback } from "react"

import { BuilderState } from "../BuilderState.js"
import { ColumnTypes, Config, NamedMode } from "../configTypes.js"
import { UIComponents, WithCustomState } from "../uiTypes.js"
import { EncodingBuilder } from "./EncodingBuilder.js"
import { MarkBuilder } from "./MarkBuilder.js"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes
  config: Config
  state: BuilderState
  ui: UIComponents<S>
  namedViewMode: NamedMode
}

function LayerBuilderRaw<S>({
  columnTypes,
  config,
  state,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const setCurrentLayer = useCallback(
    (newIndex: number) => {
      state.selectLayer(newIndex)
    },
    [state]
  )

  const addLayer = useCallback(() => {
    state.createNewLayerAndSetAsCurrent()
  }, [state])

  const removeLayer = useCallback(() => {
    state.removeCurrentLayer()
  }, [state])

  const moveLayer = useCallback(
    (newIndex: number) => {
      state.moveCurrentLayer(newIndex)
    },
    [state]
  )

  return (
    <ui.LayerBuilder>
      {namedViewMode[1].layers && (
        <ui.LayerPicker
          setCurrentLayer={setCurrentLayer}
          addLayer={addLayer}
          removeLayer={removeLayer}
          moveLayer={moveLayer}
          layers={state.value.layers}
          currentLayerIndex={state.value.currentLayerIndex}
        />
      )}

      <MarkBuilder
        config={config}
        state={state}
        markState={state.getCurrentLayer().mark}
        ui={ui}
        namedViewMode={namedViewMode}
        customState={customState}
        setCustomState={setCustomState}
      />

      <EncodingBuilder
        columnTypes={columnTypes}
        config={config}
        state={state}
        encodingState={state.getCurrentLayer().encoding}
        namedViewMode={namedViewMode}
        ui={ui}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.LayerBuilder>
  )
}

export const LayerBuilder = memo(LayerBuilderRaw) as typeof LayerBuilderRaw
