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

import { Element } from "@streamlit/protobuf"

import { ElementNode } from "~lib/AppNode"
import { Quiver } from "~lib/dataframes/Quiver"

export const table = [
  {
    type: "table_editor",
    label: "Edit Table...",
    getValue: (element: ElementNode): Quiver => {
      return element.quiverElement
    },
    setValue: (element: ElementNode, value: Quiver): ElementNode => {
      const { arrowDataFrame } = element.element

      if (arrowDataFrame) {
        const newElement = element.clone()

        // @ts-expect-error
        newElement.element = new Element({
          ...element.element,
          arrowDataFrame: {
            ...arrowDataFrame,
            data: value.bytes,
          },
        })
        return newElement
      }

      return element
    },
  },
]
