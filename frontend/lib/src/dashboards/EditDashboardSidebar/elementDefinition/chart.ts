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
import { VegaLiteChartElement } from "~lib/components/elements/ArrowVegaLiteChart"

export const chart = [
  {
    type: "chart_editor",
    label: "Edit Chart...",
    getValue: (element: ElementNode): VegaLiteChartElement => {
      return element.vegaLiteChartElement
    },
    setValue: (
      element: ElementNode,
      value: VegaLiteChartElement
    ): ElementNode => {
      const { arrowVegaLiteChart } = element.element

      if (arrowVegaLiteChart) {
        // I hate this but we mutate the state cause we want the element
        // to be the same reference
        // @ts-expect-error
        element.element = new Element({
          ...element.element,
          arrowVegaLiteChart: {
            ...arrowVegaLiteChart,
            spec: value.spec,
          },
        })
      }

      return element
    },
  },
]
