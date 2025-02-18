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

import { filterSection } from "../modeParser.js"
import { BuilderState } from "../BuilderState.js"
import { Config, NamedMode, MarkConfig } from "../configTypes.js"
import { MarkState, MarkPropName } from "../stateTypes.js"
import { PlainRecord } from "../typeUtil.js"
import { WithCustomState, UIComponents, WidgetHint } from "../uiTypes.js"

export interface Props<S> extends WithCustomState<S> {
  config: Config
  ui: UIComponents<S>
  state: BuilderState
  markState: MarkState
  namedViewMode: NamedMode
}

function MarkBuilderRaw<S>({
  config,
  ui,
  state,
  markState,
  namedViewMode,
  customState,
  setCustomState,
}: Props<S>): ReactNode {
  const uiParams: PlainRecord<UIParam> = {
    align: { widgetHint: "select" },
    baseline: { widgetHint: "select" },
    filled: { widgetHint: "toggle" },
    interpolate: { widgetHint: "select" },
    line: { widgetHint: "toggle" },
    orient: { widgetHint: "select" },
    point: { widgetHint: "toggle" },
    shape: { widgetHint: "select" },
    strokeDash: { widgetHint: "json" },
    type: { widgetHint: "select" },
    tooltip: { widgetHint: "toggle" },
  }

  const cleanedProps = filterSection("mark", config, namedViewMode, name =>
    config.selectMarkProperty(
      name as MarkPropName,
      state.getCurrentLayer(),
      state.value
    )
  )

  if (!cleanedProps) return null

  const statePath = ["mark"]

  return (
    <ui.MarkContainer
      statePath={statePath}
      viewMode={namedViewMode?.[0]}
      customState={customState}
      setCustomState={setCustomState}
    >
      {Object.entries(cleanedProps as MarkConfig).map(
        ([label, name]: [string, MarkPropName]) => (
          <ui.GenericPickerWidget
            statePath={[...statePath, name]}
            widgetHint={uiParams[name]?.widgetHint ?? "json"}
            label={label}
            value={markState[name]}
            setValue={state.getMarkSetter(name)}
            items={config?.markPropertyValues?.[name]}
            viewMode={namedViewMode?.[0]}
            customState={customState}
            setCustomState={setCustomState}
            key={name}
          />
        )
      )}
    </ui.MarkContainer>
  )
}

interface UIParam {
  widgetHint: WidgetHint
}

export const MarkBuilder = memo(MarkBuilderRaw) as typeof MarkBuilderRaw
