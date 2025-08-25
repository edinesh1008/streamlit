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

import React, { memo, useCallback } from "react"

import { Check as CheckIcon, Copy as CopyIcon } from "react-feather"

import {
  StreamlitMarkdown,
  useCopyToClipboard,
  convertRemToPx,
} from "@streamlit/lib"
import { useEmotionTheme } from "@streamlit/lib"

import {
  StyledCopyTextContainer,
  StyledCopyTextButton,
} from "./styled-components"

interface Props {
  /** The text to display and copy */
  text: string
  /** The text to copy to clipboard (if different from display text) */
  copyText?: string
  /** Whether to style the text as a caption */
  isCaption?: boolean
  /** Additional test id */
  "data-testid"?: string
}

const CopyText: React.FC<Props> = ({
  text,
  copyText,
  isCaption = false,
  "data-testid": testId,
}) => {
  const theme = useEmotionTheme()
  const { isCopied, copyToClipboard } = useCopyToClipboard()

  const handleCopy = useCallback(() => {
    copyToClipboard(copyText || text)
  }, [copyToClipboard, copyText, text])

  // Match icon size to text size
  const iconSize = isCaption
    ? convertRemToPx(theme.fontSizes.sm)
    : convertRemToPx(theme.fontSizes.md)

  return (
    <StyledCopyTextContainer data-testid={testId} onClick={handleCopy}>
      <StreamlitMarkdown
        source={text}
        allowHTML={false}
        isCaption={isCaption}
      />
      <StyledCopyTextButton
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation() // Prevent double triggering
          handleCopy()
        }}
        title="Copy text"
        data-testid={testId ? `${testId}CopyButton` : "stCopyTextButton"}
      >
        {isCopied ? (
          <CheckIcon size={iconSize} />
        ) : (
          <CopyIcon size={iconSize} />
        )}
      </StyledCopyTextButton>
    </StyledCopyTextContainer>
  )
}

export default memo(CopyText)
