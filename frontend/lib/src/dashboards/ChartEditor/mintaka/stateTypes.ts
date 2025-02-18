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

import { PartialRecord, json } from "./typeUtil.js"

import { Preset } from "./presetTypes.js"

export type MarkPropName =
  | "align"
  | "angle"
  | "color"
  | "dx"
  | "dy"
  | "filled"
  | "interpolate"
  | "line"
  | "opacity"
  | "orient"
  | "point"
  | "radius"
  | "radius2"
  | "shape"
  | "size"
  | "strokeDash"
  | "strokeWidth"
  | "tooltip"
  | "type"

export type ChannelName =
  | "angle"
  | "color"
  | "column"
  | "detail"
  | "facet"
  | "latitude"
  | "latitude2"
  | "longitude"
  | "longitude2"
  | "opacity"
  | "radius"
  | "radius2"
  | "row"
  | "shape"
  | "size"
  | "strokeDash"
  | "strokeWidth"
  | "text"
  | "theta"
  | "theta2"
  | "tooltip"
  | "url"
  | "x"
  | "x2"
  | "xOffset"
  | "y"
  | "y2"
  | "yOffset"

export type ChannelPropName =
  | "aggregate"
  | "bin"
  | "binStep"
  | "datum"
  | "domain"
  | "field"
  | "legend"
  | "maxBins"
  | "range"
  | "scaleType"
  | "scheme"
  | "sort"
  | "stack"
  | "timeUnit"
  | "title"
  | "type"
  | "value"
  | "zero"

export type MarkPropertyValueSetter = (value: json) => void
export type MarkPropertySetter = (
  propName: MarkPropName
) => MarkPropertyValueSetter

export type ChannelPropertyValueSetter = (value: json) => void
export type ChannelPropertySetter = (
  propName: ChannelPropName
) => ChannelPropertyValueSetter
export type EncodingSetter = (
  channelName: ChannelName
) => ChannelPropertySetter

export type MarkState = PartialRecord<MarkPropName, json>
export type EncodingState = PartialRecord<ChannelName, ChannelState>
export type ChannelState = PartialRecord<ChannelPropName, json>

export interface LayerState {
  mark: MarkState
  encoding: EncodingState
}

export interface InitialLayerState {
  mark?: MarkState
  encoding?: EncodingState
}

export interface InitialState {
  preset?: Preset
  layers?: InitialLayerState[]
}

export interface StateValue {
  layers: LayerState[]
  currentLayerIndex: number
  preset: Preset | undefined | null
}

export type PropertyValues = Record<string, json>
