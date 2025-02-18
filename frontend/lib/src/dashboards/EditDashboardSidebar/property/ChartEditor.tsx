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

import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react"

import zip from "lodash/zip"

import { ElementNode } from "~lib/AppNode"
import { VegaLiteChartElement } from "~lib/components/elements/ArrowVegaLiteChart"
import {
  ArrowType,
  isDatetimeType,
  isDateType,
  isNumericType,
  isTimeType,
} from "~lib/dataframes/arrowTypeUtils"
import { EditModeElementsContext } from "~lib/dashboards/EditModeElementsContext"

import { Mintaka, VLSpec } from "../../ChartEditor/mintaka"
import {
  ChannelContainer,
  EmptyBlock,
  EncodingContainer,
  GenericPickerWidget,
  LayerBuilder,
  LayerPicker,
  MarkContainer,
  MegaToolbar,
  MintakaContainer,
  PresetsContainer,
} from "./ui"
import { PropertyDefinition } from "./types"

interface ChartEditorProps extends PropertyDefinition<VegaLiteChartElement> {
  element: ElementNode
}

type ColumnType = "nominal" | "quantitative" | "temporal"
function simpleColumnTypeDetector(
  arrowType: ArrowType | undefined
): ColumnType {
  if (
    isDatetimeType(arrowType) ||
    isTimeType(arrowType) ||
    isDateType(arrowType)
  ) {
    return "temporal"
  }
  if (isNumericType(arrowType)) {
    return "quantitative"
  }

  return "nominal"
}

const ChartEditor: FC<ChartEditorProps> = ({
  element,
  getValue,
  setValue: setPropertyValue,
}) => {
  const { replaceElement } = useContext(EditModeElementsContext)
  const vegaLiteElement = getValue(element)

  const baseSpec = useMemo(() => {
    const spec = JSON.parse(vegaLiteElement.spec)
    if (!spec.layer) {
      spec.layer = []
      spec.layer.push({ mark: spec.mark, encoding: spec.encoding })

      delete spec.mark
      delete spec.encoding
    }

    return spec
    // Deliberate skip: we want this to run only once on initialization
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const layer = useMemo(
    () => ({
      layers: baseSpec.layer,
    }),
    // Deliberate skip: The column types do not change in this view....TODO for now
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseSpec]
  )

  const columnTypes = useMemo(() => {
    const data = vegaLiteElement.datasets[0].data
    const cols = zip(data.columnNames[0], data.columnTypes).map(
      ([colName, colType]) => {
        const newColName =
          colName || colType?.type !== "index" ? colName : "(index)"
        return [
          newColName,
          { type: simpleColumnTypeDetector(colType), unique: null },
        ]
      }
    )
    return Object.fromEntries(cols)
    // Deliberate skip: The column types do not change in this view....TODO for now
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleReplace = useRef((_: VLSpec) => {})
  useEffect(() => {
    handleReplace.current = (value: VLSpec) => {
      replaceElement(
        element,
        setPropertyValue(element, {
          ...vegaLiteElement,
          spec: JSON.stringify(value),
        })
      )
    }
  }, [element, replaceElement, setPropertyValue, vegaLiteElement])

  const setGeneratedSpec = useCallback((value: VLSpec) => {
    handleReplace.current(value)
  }, [])

  return (
    <Mintaka
      columnTypes={columnTypes} // <-- Tell us what your data looks like
      setGeneratedSpec={setGeneratedSpec}
      baseSpec={baseSpec}
      initialState={layer}
      ui={{
        MintakaContainer,
        ChannelContainer,
        EncodingContainer,
        GenericPickerWidget,
        LayerBuilder,
        LayerPicker,
        MarkContainer,
        PresetsContainer,
        TopUtilBlock: EmptyBlock,
        BottomUtilBlock: MegaToolbar,
      }}
      presets={{}}
    />
  )
}

export default ChartEditor
