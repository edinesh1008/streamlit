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

import React, { memo } from "react"

import Icon from "~lib/components/shared/Icon"
import { FileSize, getSizeDisplay } from "~lib/util/FileHelper"
import { convertRemToPx } from "~lib/theme"

import {
  StyledFileDropzoneInstructions,
  StyledFileDropzoneInstructionsSubtext,
} from "./styled-components"

export interface Props {
  multiple: boolean
  acceptedExtensions: string[]
  maxSizeBytes: number
  disabled?: boolean
  width?: number
}

const FileDropzoneInstructions = ({
  multiple,
  acceptedExtensions,
  maxSizeBytes,
  disabled,
  width,
}: Props): React.ReactElement => {
  // Define width thresholds for showing different parts of text
  const SHOW_ALL_THRESHOLD = convertRemToPx("34rem")
  const SHOW_SIZE_AND_EXTENSIONS_THRESHOLD = convertRemToPx("23rem") // ~368px
  const SHOW_ONLY_EXTENSIONS_THRESHOLD = convertRemToPx("15rem") // ~240px

  const showDragDrop = !width || width >= SHOW_ALL_THRESHOLD
  const showSizeLimit = !width || width >= SHOW_SIZE_AND_EXTENSIONS_THRESHOLD
  const showExtensions = !width || width >= SHOW_ONLY_EXTENSIONS_THRESHOLD

  // Build the text dynamically based on what should be shown
  const parts: string[] = []

  if (showDragDrop) {
    parts.push("Or drag and drop here")
  }

  if (showSizeLimit) {
    parts.push(`${getSizeDisplay(maxSizeBytes, FileSize.Byte, 0)} per file`)
  }

  if (showExtensions && acceptedExtensions.length > 0) {
    parts.push(
      acceptedExtensions
        .map(ext => ext.replace(/^\./, "").toUpperCase())
        .join(", ")
    )
  }

  // Join with bullet separator
  const text = parts.join(" • ")

  return (
    <StyledFileDropzoneInstructions data-testid="stFileUploaderDropzoneInstructions">
      <StyledFileDropzoneInstructionsSubtext disabled={disabled}>
        {text}
      </StyledFileDropzoneInstructionsSubtext>
    </StyledFileDropzoneInstructions>
  )
}

export default memo(FileDropzoneInstructions)
