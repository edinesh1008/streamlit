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

import { FileSize, getSizeDisplay } from "~lib/util/FileHelper"
import { AcceptFileValue } from "~lib/util/utils"
import { getUploadDescription } from "~lib/components/widgets/ChatInput/fileUpload/fileUploadUtils"

import {
  StyledFileDropzoneInstructions,
  StyledFileDropzoneInstructionsContent,
  StyledFileDropzoneInstructionsSubtext,
  StyledFileDropzoneInstructionsText,
} from "./styled-components"

export interface Props {
  multiple: boolean
  acceptedExtensions: string[]
  maxSizeBytes: number
  acceptDirectory?: boolean
  disabled?: boolean
}

const FileDropzoneInstructions = ({
  multiple,
  acceptedExtensions,
  maxSizeBytes,
  acceptDirectory = false,
  disabled,
}: Props): React.ReactElement => {
  // Determine what type of content we're accepting using shared util
  const acceptFile: AcceptFileValue = acceptDirectory
    ? AcceptFileValue.Directory
    : multiple
      ? AcceptFileValue.Multiple
      : AcceptFileValue.Single

  const getFileTypeInfo = (): string | null => {
    if (acceptedExtensions.length) {
      return ` • ${acceptedExtensions
        .map(ext => ext.replace(/^\./, "").toUpperCase())
        .join(", ")}`
    }
    return null
  }

  const getSizeLimit = (): string => {
    return `${getSizeDisplay(maxSizeBytes, FileSize.Byte, 0)} per file`
  }

  return (
    <StyledFileDropzoneInstructions data-testid="stFileUploaderDropzoneInstructions">
      <StyledFileDropzoneInstructionsContent>
        <StyledFileDropzoneInstructionsText disabled={disabled}>
          {`Drag and drop ${getUploadDescription(acceptFile)} here`}
        </StyledFileDropzoneInstructionsText>
        <StyledFileDropzoneInstructionsSubtext disabled={disabled}>
          {getSizeLimit()}
          {getFileTypeInfo()}
        </StyledFileDropzoneInstructionsSubtext>
      </StyledFileDropzoneInstructionsContent>
    </StyledFileDropzoneInstructions>
  )
}

export default memo(FileDropzoneInstructions)
