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

import { Grouping, PlainRecord } from "./typeUtil.js"
import {
  MarkPropName,
  ChannelName,
  ChannelPropName,
  PropertyValues,
  LayerState,
  StateValue,
} from "./stateTypes.js"

export interface Mode {
  presets?: boolean
  layers?: boolean
  //coordinateSystem?: boolean,  // TODO
  mark?: boolean | Set<string>
  encoding?: boolean | Set<string>
  channelProperties?: boolean | Set<string>
  else?: boolean
}

export type NamedMode = [string, Mode]

export type ModeConfig = Grouping<Mode>
export type MarkConfig = PlainRecord<MarkPropName>
export type EncodingConfig = PlainRecord<ChannelName>
export type ChannelPropertiesConfig = PlainRecord<ChannelPropName>
export type MarkPropertyValuesConfig = Grouping<PropertyValues>
export type ChannelPropertyValuesConfig = Grouping<PropertyValues>

export type SelectMarkPropertyFunc = (
  name: string,
  layer: LayerState,
  stateValue: StateValue
) => boolean

export type SelectChannelFunc = (
  name: ChannelName,
  layer: LayerState,
  stateValue: StateValue
) => boolean

export type SelectChannelPropertyFunc = (
  name: ChannelPropName,
  channelName: ChannelName,
  layer: LayerState,
  stateValue: StateValue
) => boolean

export interface Config {
  modes: ModeConfig
  mark: MarkConfig
  encoding: EncodingConfig
  markPropertyValues: MarkPropertyValuesConfig
  channelProperties: ChannelPropertiesConfig
  channelPropertyValues: ChannelPropertyValuesConfig
  selectMarkProperty: SelectMarkPropertyFunc
  selectChannel: SelectChannelFunc
  selectChannelProperty: SelectChannelPropertyFunc
}

export type StructuralKey =
  | "modes"
  | "mark"
  | "encoding"
  | "channelProperties"
  | "markPropertyValues"
export type StructuralConfig =
  | ModeConfig
  | MarkConfig
  | EncodingConfig
  | ChannelPropertiesConfig
  | MarkPropertyValuesConfig

export type VlFieldType =
  | "quantitative"
  | "ordinal"
  | "nominal"
  | "temporal"
  | "geojson"

export interface ColumnType {
  type: VlFieldType
  unique?: number | null
}

export type ColumnTypes = PlainRecord<ColumnType>
