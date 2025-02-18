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

import React, { FC } from "react"

import { ElementNode } from "~lib/AppNode"
import { VegaLiteChartElement } from "~lib/components/elements/ArrowVegaLiteChart"
import BaseButton, { BaseButtonKind } from "~lib/components/shared/BaseButton"

import { PropertyDefinition } from "./types"

interface TableEditorButtonProps
  extends PropertyDefinition<VegaLiteChartElement> {
  element: ElementNode
}

const TableEditorButton: FC<TableEditorButtonProps> = ({
  element,
  getValue,
  label,
  setValue: setPropertyValue,
}) => {
  return (
    <BaseButton kind={BaseButtonKind.PRIMARY} fluidWidth={true}>
      {label}
    </BaseButton>
  )
}

export default TableEditorButton
