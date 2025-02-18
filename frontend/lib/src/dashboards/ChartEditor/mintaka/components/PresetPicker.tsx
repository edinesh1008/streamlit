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

import { Preset, Presets } from "../presetTypes.js"

import { UIComponents, WithCustomState } from "../uiTypes.js"

import { NamedMode } from "../configTypes.js"

import { showSection } from "../modeParser.js"
import { BuilderState } from "../BuilderState.js"

export interface Props<S> extends WithCustomState<S> {
  state: BuilderState
  presets?: Presets
  preset?: Preset | null
  ui: UIComponents<S>
  namedViewMode: NamedMode
}

function PresetPickerRaw<S>({
  state,
  presets,
  preset,
  ui,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const setPreset = useCallback(
    (newPreset: Preset) => {
      state.setPreset(newPreset)
    },
    [state]
  )

  if (
    !presets ||
    Object.keys(presets).length == 0 ||
    !showSection("presets", namedViewMode)
  ) {
    return null
  }

  const statePath = ["presets"]

  return (
    <ui.PresetsContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >
      <ui.GenericPickerWidget
        statePath={statePath}
        widgetHint={"select"}
        label={"Preset"}
        value={preset}
        setValue={setPreset}
        items={presets}
        viewMode={namedViewMode?.[0]}
        customState={customState}
        setCustomState={setCustomState}
      />
    </ui.PresetsContainer>
  )
}

export const PresetPicker = memo(PresetPickerRaw) as typeof PresetPickerRaw
