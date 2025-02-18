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

import { Presets } from "./presetTypes"

export const PRESETS: Presets = {
  Scatter: {
    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    mark: {
      type: "point",
      tooltip: true,
    },

    encoding: {
      x: { zero: false },
      y: { zero: false },
    },

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } },
      },
      yCol: {
        encoding: { y: { field: "yCol" } },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  Line: {
    findColumns: {
      xCol: { type: ["quantitative", null] },
      yCol: { type: ["quantitative", null] },
      colorCol: { type: ["nominal", "ordinal", null], maxUnique: 20 },
    },

    mark: {
      type: "line",
      tooltip: true,
    },

    encoding: {},

    ifColumn: {
      xCol: {
        encoding: { x: { field: "xCol" } },
      },
      yCol: {
        encoding: { y: { field: "yCol" } },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },

  Bar: {
    findColumns: {
      xNom: { type: ["nominal", "ordinal"] },
      xQuant: { type: ["quantitative"] },
      colorCol: { type: ["nominal", "ordinal"], maxUnique: 20 },
    },

    mark: {
      type: "bar",
      tooltip: true,
    },

    encoding: {
      y: { stack: "mintaka-dodge" },
    },

    ifColumn: {
      xQuant: {
        encoding: {
          x: { field: "xQuant" },
          y: { field: "xQuant", aggregate: "sum" },
        },
      },
      xNom: {
        encoding: {
          x: { field: "xNom" },
          y: { field: "xNom", aggregate: "count" },
        },
      },
      colorCol: {
        encoding: { color: { field: "colorCol" } },
      },
    },
  },
}
