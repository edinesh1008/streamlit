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

import includes from "lodash/includes"
import merge from "lodash/merge"
import cloneDeep from "lodash/cloneDeep"

import { ColumnTypes } from "./configTypes.js"

import { EncodingState, MarkPropName, MarkState } from "./stateTypes.js"

import { FindColumnsSpec, Preset, PresetColumnFilter } from "./presetTypes.js"

import { Grouping, PlainRecord, json } from "./typeUtil.js"

import { objectFrom, deepClone } from "./collectionUtils.js"

export interface ParsedPreset {
  mark?: MarkState
  encoding?: EncodingState
}

export function parsePreset(
  presetSpec: Preset | null | undefined,
  columnTypes: ColumnTypes
): ParsedPreset {
  if (presetSpec == null) return {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const spec = deepClone(presetSpec as PlainRecord<any>)

  const columns = findColumns(spec.findColumns, columnTypes)
  followIfConditions(spec, columns)

  const mark = spec.mark as Grouping<Record<string, MarkPropName>>
  const encodingState = objectFrom(
    spec.encoding,
    ([name, channelSpec]: [string, PlainRecord<json>]) => [
      name,
      { ...channelSpec, field: columns[channelSpec.field as string] },
    ]
  )

  return {
    mark: { ...mark },
    encoding: cloneDeep(encodingState),
  }
}

function findColumns(
  findColsSpec: FindColumnsSpec,
  columnTypes: ColumnTypes
): PlainRecord<string> {
  if (!findColsSpec) return {}

  const columns: PlainRecord<string> = {}

  for (const [varName, filter] of Object.entries(findColsSpec)) {
    const col = findColumn(filter, columnTypes, Object.values(columns))

    if (col) columns[varName] = col
  }

  return columns
}

function findColumn(
  filterSpec: PresetColumnFilter,
  columnTypes: ColumnTypes,
  columnsAlreadyFound: string[]
): string | undefined {
  if (!filterSpec) return

  let candidateColsAndTypes = Object.entries(columnTypes)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, info]) => {
      let keep = true

      if (filterSpec.type) keep = keep && includes(filterSpec.type, info.type)
      if (filterSpec.maxUnique)
        keep = keep && (info.unique ?? 0) <= filterSpec.maxUnique

      return keep
    })

  if (
    candidateColsAndTypes.length == 0 &&
    filterSpec.type?.some(x => x == null)
  ) {
    candidateColsAndTypes = Object.entries(columnTypes)
  }

  const candidateCols = candidateColsAndTypes.map(([name]) => name)

  return candidateCols.find(name => !includes(columnsAlreadyFound, name))
}

function followIfConditions(spec: Preset, columns: PlainRecord<string>): void {
  const matchingIfSpecs = Object.entries(spec.ifColumn ?? {})
    .filter(([col]) => columns[col] != null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(([_, spec]) => spec)

  if (matchingIfSpecs) merge(spec, ...matchingIfSpecs)
}
