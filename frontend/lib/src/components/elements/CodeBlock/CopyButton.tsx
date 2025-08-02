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

import React, { memo, useEffect, useRef, useState } from "react"

import Clipboard from "clipboard"

import { DynamicIcon } from "~lib/components/shared/Icon"

import {
  StyledCopyButton,
  StyledCopyButtonContainer,
  StyledCopyFeedback,
} from "./styled-components"

const COPY_SUCCESS_TIMEOUT_MS = 2000

interface Props {
  text: string
}

const CopyButton: React.FC<Props> = ({ text }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const clipboardRef = useRef<Clipboard | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const node = buttonRef.current
    if (!node) return

    clipboardRef.current = new Clipboard(node, {
      container: node.parentElement ?? undefined,
    })

    clipboardRef.current.on("success", () => {
      setShowSuccess(true)
      timeoutRef.current = setTimeout(() => {
        setShowSuccess(false)
      }, COPY_SUCCESS_TIMEOUT_MS)
    })

    return () => {
      clipboardRef.current?.destroy()
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const iconProps = {
    size: "base" as const,
    color: "inherit" as const,
  }

  return (
    <StyledCopyButtonContainer showSuccess={showSuccess}>
      {showSuccess && (
        <>
          <DynamicIcon iconValue=":material/check:" {...iconProps} />
          <StyledCopyFeedback>Copied</StyledCopyFeedback>
        </>
      )}
      <StyledCopyButton
        showSuccess={showSuccess}
        data-testid="stCodeCopyButton"
        title="Copy to clipboard"
        ref={buttonRef}
        data-clipboard-text={text}
      >
        <DynamicIcon iconValue=":material/content_copy:" {...iconProps} />
      </StyledCopyButton>
    </StyledCopyButtonContainer>
  )
}

export default memo(CopyButton)
