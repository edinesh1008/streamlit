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

import { createContext } from "react"

import { Arrow } from "@streamlit/protobuf"

import { AppRoot, ElementNode } from "~lib/AppNode"
import { VegaLiteChartElement } from "~lib/components/elements/ArrowVegaLiteChart"

export interface EditModeElementsContextValue {
  elements: AppRoot
  updateElements: (elements: AppRoot) => void
  selectedElement: ElementNode | null
  setSelectedElement: (node: ElementNode | null) => void
  replaceElement: (from: ElementNode, to: ElementNode) => void
  openChartEditor: (
    element: ElementNode,
    onClose: (newElement: VegaLiteChartElement) => void
  ) => void
  openDataExplorer: (element: ElementNode, onClose: () => void) => void
  dataQueryRegistry: Record<string, Arrow>
}

export const EditModeElementsContext =
  createContext<EditModeElementsContextValue>({
    elements: AppRoot.empty("FAKE"),
    updateElements: () => {},
    selectedElement: null,
    setSelectedElement: () => {},
    replaceElement: () => {},
    openChartEditor: () => {},
    openDataExplorer: () => {},
    dataQueryRegistry: {},
  })
