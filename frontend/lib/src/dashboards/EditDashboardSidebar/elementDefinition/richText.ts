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

import { Element, Markdown } from "@streamlit/protobuf"

import { ElementNode } from "~lib/AppNode"

export const richText = [
  {
    label: "Text",
    type: "text_area",
    getValue: (element: ElementNode): string => {
      const { markdown } = element.element

      return markdown?.body || ""
    },
    setValue: (element: ElementNode, value: string): ElementNode => {
      const { markdown } = element.element

      if (markdown) {
        const newElement = element.clone()
        // @ts-expect-error
        newElement.element = new Element({
          ...element.element,
          markdown: new Markdown({
            ...markdown,
            body: value,
          }),
        })
        return newElement
      }

      return element
    },
    props: {
      fillArea: true,
    },
  },
]
