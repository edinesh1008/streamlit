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

import React, { MouseEvent, ReactElement, useCallback } from "react"

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
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      const button = event.currentTarget

      // Store the current hover state before any processing
      const wasHovered = button.matches(":hover")

      // Call the onClick handler immediately
      onClick()

      // Use requestAnimationFrame to ensure hover state is preserved
      // after any potential DOM updates from the onClick handler
      requestAnimationFrame(() => {
        if (button && wasHovered) {
          // Ensure the button maintains its hover appearance
          // by keeping it as the focused element without losing hover
          button.focus({ preventScroll: true })

          // Add a temporary class to force hover state if needed
          button.classList.add("force-hover-state")

          // Remove the temporary class after a short delay to allow
          // natural hover state to take over
          setTimeout(() => {
            button.classList.remove("force-hover-state")
          }, 100)
        }
      })
    },
    [onClick]
  )

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

            // Use requestAnimationFrame instead of setTimeout to better
            // coordinate with browser rendering and preserve hover state
            requestAnimationFrame((): void => {
              sendMessageToHost({
                type: "TOOLBAR_ITEM_CALLBACK",
                key,
              })
            })
          }}
        />
      ))}
    </StyledToolbarActions>
  )
}

export default ToolbarActions
