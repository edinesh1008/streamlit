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

import {
  Config,
  StructuralConfig,
  StructuralKey,
  Mode,
  NamedMode,
} from "./configTypes.js"

import { PlainRecord } from "./typeUtil.js"

import { objectFilter } from "./collectionUtils.js"

export function showSection(
  sectionName: keyof Mode,
  namedMode: NamedMode
): boolean {
  if (!namedMode) return true

  const modeSpec = namedMode[1]
  const sectionMode = modeSpec[sectionName] ?? modeSpec.else != false

  return !!sectionMode
}

type FilterFn = (str: string) => boolean

export function filterSection(
  sectionName: StructuralKey,
  configSpec: Config,
  namedMode: NamedMode,
  filterFn: FilterFn
): StructuralConfig | null {
  let sectionItems: Set<string>
  const currConfig: StructuralConfig = configSpec[sectionName]

  if (namedMode) {
    const modeSpec = namedMode[1]
    const sectionMode =
      modeSpec[sectionName as keyof Mode] ?? modeSpec.else != false

    if (!sectionMode) return null

    sectionItems =
      sectionMode instanceof Set
        ? sectionMode
        : new Set(Object.values(currConfig))
  } else {
    sectionItems = new Set(Object.values(currConfig))
  }

  return objectFilter(
    currConfig as PlainRecord<string>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ([_, name]: [string, string]) => sectionItems.has(name) && filterFn(name)
  ) as StructuralConfig
}
