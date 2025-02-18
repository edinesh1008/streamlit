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

import { ReactNode, memo } from "react"

import { showSection, filterSection } from "../modeParser.js"

import { ChannelBuilder } from "./ChannelBuilder.js"
import { BuilderState } from "../BuilderState.js"
import {
  ColumnTypes,
  Config,
  NamedMode,
  EncodingConfig,
} from "../configTypes.js"
import { EncodingState, ChannelName } from "../stateTypes.js"
import { WithCustomState, UIComponents } from "../uiTypes.js"

export interface Props<S> extends WithCustomState<S> {
  columnTypes: ColumnTypes
  config: Config
  state: BuilderState
  encodingState: EncodingState
  ui: UIComponents<S>
  namedViewMode: NamedMode
}

function EncodingBuilderRaw<S>({
  columnTypes,
  config,
  state,
  encodingState,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const columnsLabelsToNames = {
    "": null,
    ...Object.fromEntries(Object.keys(columnTypes).map(c => [c, c])),
  }

  if (!showSection("encoding", namedViewMode)) {
    return null
  }

  const cleanedProps = filterSection("encoding", config, namedViewMode, name =>
    config.selectChannel(
      name as ChannelName,
      state.getCurrentLayer(),
      state.value
    )
  )

  if (!cleanedProps) return null

  const statePath = ["encoding"]

  return (
    <ui.EncodingContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >
      {Object.entries(cleanedProps as EncodingConfig).map(([label, name]) => (
        <ChannelBuilder
          channelName={name}
          channelLabel={label}
          config={config}
          state={state}
          channelState={encodingState?.[name]}
          statePath={statePath}
          ui={ui}
          columns={columnsLabelsToNames}
          namedViewMode={namedViewMode}
          customState={customState}
          setCustomState={setCustomState}
          key={name}
        />
      ))}
    </ui.EncodingContainer>
  )
}

export const EncodingBuilder = memo(
  EncodingBuilderRaw
) as typeof EncodingBuilderRaw
