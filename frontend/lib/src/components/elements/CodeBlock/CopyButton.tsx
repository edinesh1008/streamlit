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

interface Props {
  text: string
}

const CopyButton: React.FC<Props> = ({ text }) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const clipboardRef = useRef<Clipboard | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [wasCopySuccessful, setWasCopySuccessful] = useState(false)

  useEffect(() => {
    const node = buttonRef.current

    if (node !== null) {
      clipboardRef.current = new Clipboard(node, {
        // Set the container so that copying also works in dialogs.
        // Otherwise, the copy event is swallowed somehow.
        container: node.parentElement ?? undefined,
      })

      // Listen for successful copy events
      clipboardRef.current.on("success", () => {
        // Clear any existing timeout
        if (timeoutRef.current !== null) {
          clearTimeout(timeoutRef.current)
        }

        setWasCopySuccessful(true)
        timeoutRef.current = setTimeout(() => {
          setWasCopySuccessful(false)
        }, 2000)
      })
    }

    return () => {
      if (clipboardRef.current !== null) {
        clipboardRef.current.destroy()
      }
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <StyledCopyButtonContainer wasCopySuccessful={wasCopySuccessful}>
      {wasCopySuccessful && (
        <>
          <DynamicIcon
            iconValue=":material/check:"
            size="base"
            color="inherit"
          />
          <StyledCopyFeedback>Copied</StyledCopyFeedback>
        </>
      )}
      <StyledCopyButton
        hidden={wasCopySuccessful}
        data-testid="stCodeCopyButton"
        title="Copy to clipboard"
        ref={buttonRef}
        data-clipboard-text={text}
      >
        <DynamicIcon
          iconValue=":material/content_copy:"
          size="base"
          color="inherit"
        />
      </StyledCopyButton>
    </StyledCopyButtonContainer>
  )
}

export default memo(CopyButton)
