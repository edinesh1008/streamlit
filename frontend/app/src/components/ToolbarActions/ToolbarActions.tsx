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

import React, { MouseEvent, ReactElement } from "react"

import {
  BaseButton,
  BaseButtonKind,
  IGuestToHostMessage,
  IToolbarItem,
} from "@streamlit/lib"
import { MetricsManager } from "@streamlit/app/src/MetricsManager"

import {
  StyledActionButtonContainer,
  StyledActionButtonIcon,
  StyledToolbarActions,
} from "./styled-components"

export interface ActionButtonProps {
  label?: string
  icon?: string
  onClick: () => void
}

export function ActionButton({
  label,
  icon,
  onClick,
}: ActionButtonProps): ReactElement {
  const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
    // Prevent default behavior that might interfere with hover state
    event.preventDefault()

    // Call the onClick handler immediately
    onClick()

    // Prevent the event from bubbling up which could cause focus changes
    event.stopPropagation()

    // Ensure the button doesn't lose focus/hover state by preventing blur
    // We do this by keeping the button as the active element
    event.currentTarget.focus()
  }

  return (
    <div className="stToolbarActionButton" data-testid="stToolbarActionButton">
      <BaseButton onClick={handleClick} kind={BaseButtonKind.HEADER_BUTTON}>
        <StyledActionButtonContainer>
          {icon && (
            <StyledActionButtonIcon
              data-testid="stToolbarActionButtonIcon"
              icon={icon}
            />
          )}
          {label && (
            <span data-testid="stToolbarActionButtonLabel">{label}</span>
          )}
        </StyledActionButtonContainer>
      </BaseButton>
    </div>
  )
}

export interface ToolbarActionsProps {
  sendMessageToHost: (message: IGuestToHostMessage) => void
  hostToolbarItems: IToolbarItem[]
  metricsMgr: MetricsManager
}

function ToolbarActions({
  sendMessageToHost,
  hostToolbarItems,
  metricsMgr,
}: ToolbarActionsProps): ReactElement {
  return (
    <StyledToolbarActions
      className="stToolbarActions"
      data-testid="stToolbarActions"
    >
      {hostToolbarItems.map(({ key, label, icon }) => (
        <ActionButton
          key={key}
          label={label}
          icon={icon}
          onClick={(): void => {
            metricsMgr.enqueue("menuClick", {
              label: key,
            })

            // Send the message immediately but use setTimeout to ensure
            // it doesn't interfere with the current event handling
            setTimeout((): void => {
              sendMessageToHost({
                type: "TOOLBAR_ITEM_CALLBACK",
                key,
              })
            }, 0)
          }}
        />
      ))}
    </StyledToolbarActions>
  )
}

export default ToolbarActions
