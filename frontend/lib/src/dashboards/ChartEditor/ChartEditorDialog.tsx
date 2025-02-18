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

import React, { ReactElement, useCallback, useMemo, useState } from "react"

import zip from "lodash/zip"
import { Vega, VisualizationSpec } from "react-vega"
import { useTheme } from "@emotion/react"

import { ElementNode } from "~lib/AppNode"
import Modal, { ModalBody, ModalHeader } from "~lib/components/shared/Modal"
import { VegaLiteChartElement } from "~lib/components/elements/ArrowVegaLiteChart"
import {
  ArrowType,
  isDatetimeType,
  isDateType,
  isNumericType,
  isTimeType,
} from "~lib/dataframes/arrowTypeUtils"
import { getDataArrays } from "~lib/components/elements/ArrowVegaLiteChart/arrowUtils"
import { applyStreamlitTheme } from "~lib/components/elements/ArrowVegaLiteChart/CustomTheme"

import { Mintaka, VLSpec } from "./mintaka"
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
import styles from "./ChartEditorDialog.module.css"

export interface ChartEditorDialogProps {
  element: ElementNode
  onClose: (el: VegaLiteChartElement) => void
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

export function ChartEditorDialog({
  element,
  onClose,
}: ChartEditorDialogProps): ReactElement {
  const theme = useTheme()
  const handleCallback = useCallback(() => {
    onClose(element.element.arrowVegaLiteChart as VegaLiteChartElement)
  }, [element, onClose])

  const { spec: originalSpec, datasets } = element.vegaLiteChartElement
  const baseSpec = useMemo(() => {
    const spec = JSON.parse(originalSpec)
    if (!spec.layer) {
      spec.layer = []
      spec.layer.push({ mark: spec.mark, encoding: spec.encoding })

      delete spec.mark
      delete spec.encoding
    }
    spec.config = applyStreamlitTheme(spec.config, theme)

    return spec
  }, [originalSpec, theme])

  const [spec, setSpec] = useState(baseSpec)

  const layer = useMemo(() => {
    return {
      layers: baseSpec.layer,
    }
  }, [baseSpec])

  const columnTypes = useMemo(() => {
    const data = datasets[0].data
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
  }, [datasets])

  const setGeneratedSpec = useCallback((generatedSpec: VLSpec) => {
    setSpec(generatedSpec)
  }, [])

  const data = useMemo(() => {
    return getDataArrays(datasets)
  }, [datasets])

  const presets = useMemo(() => ({}), [])

  return (
    <Modal isOpen={true} closeable={true} onClose={handleCallback} size="auto">
      <div onClick={e => e.stopPropagation()}>
        <ModalHeader>Chart Editor</ModalHeader>
        <ModalBody>
          <div className={styles.BuilderWrapper}>
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
              presets={presets}
            />
            <Vega
              className={styles.PreviewPane}
              spec={spec as VisualizationSpec}
              // @ts-expect-error
              data={data}
            />
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}
