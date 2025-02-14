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
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react"

import { ChevronLeft, ChevronRight } from "@emotion-icons/material-outlined"
import { Resizable } from "re-resizable"

import { localStorageAvailable } from "@streamlit/utils"

import BaseButton, { BaseButtonKind } from "~lib/components/shared/BaseButton"
import Icon from "~lib/components/shared/Icon"
import { LibContext } from "~lib/components/core/LibContext"
import ThemeProvider from "~lib/components/core/ThemeProvider"
import { createTheme, ThemeConfig } from "~lib/theme"

import {
  RESIZE_HANDLE_WIDTH,
  StyledCollapseSidebarButton,
  StyledOpenSidebarButton,
  StyledResizeHandle,
  StyledSidebar,
  StyledSidebarContent,
  StyledSidebarHeaderContainer,
  StyledSidebarOpenContainer,
  StyledSidebarUserContent,
} from "./styled-components"

export interface SidebarProps {
  children?: ReactNode
}

const MIN_WIDTH = "336"

const createSidebarTheme = (theme: ThemeConfig): ThemeConfig => {
  return createTheme(
    "Sidebar",
    {
      ...theme.themeInput,
      secondaryBackgroundColor: theme.emotion.colors.bgColor,
      backgroundColor: theme.emotion.colors.secondaryBg,
    },
    theme,
    // inSidebar
    true
  )
}

const EditDashboardSidebar: React.FC<SidebarProps> = ({ children }) => {
  const sidebarRef = useRef<HTMLDivElement>(null)

  const cachedSidebarWidth = localStorageAvailable()
    ? window.localStorage.getItem("editDashboardSidebarWidth")
    : undefined

  const [sidebarWidth, setSidebarWidth] = useState<string>(
    cachedSidebarWidth || MIN_WIDTH
  )
  const [isCollapsed, setIsCollapsed] = useState(false)

  const initializeSidebarWidth = useCallback((width: number): void => {
    const newWidth = width.toString()

    setSidebarWidth(newWidth)

    if (localStorageAvailable()) {
      window.localStorage.setItem("editDashboardSidebarWidth", newWidth)
    }
  }, [])

  const onResizeStop = useCallback(
    (_e: any, _direction: any, _ref: any, d: any) => {
      const newWidth = parseInt(sidebarWidth, 10) + d.width
      initializeSidebarWidth(newWidth)
    },
    [initializeSidebarWidth, sidebarWidth]
  )

  function resetSidebarWidth(event: any): void {
    // Double clicking on the resize handle resets sidebar to default width
    if (event.detail === 2) {
      setSidebarWidth(MIN_WIDTH)
      if (localStorageAvailable()) {
        window.localStorage.setItem("editDashboardSidebarWidth", MIN_WIDTH)
      }
    }
  }

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed)
  }, [isCollapsed])

  const { activeTheme } = useContext(LibContext)
  const sidebarTheme = createSidebarTheme(activeTheme)

  // The tabindex is required to support scrolling by arrow keys.
  return (
    <>
      <StyledSidebarOpenContainer
        data-testid="stSidebarCollapsedControl"
        isCollapsed={isCollapsed}
      >
        <StyledOpenSidebarButton>
          <BaseButton
            kind={BaseButtonKind.HEADER_NO_PADDING}
            onClick={toggleCollapse}
          >
            <Icon content={ChevronLeft} size="xl" />
          </BaseButton>
        </StyledOpenSidebarButton>
      </StyledSidebarOpenContainer>
      <ThemeProvider
        theme={sidebarTheme.emotion}
        baseuiTheme={sidebarTheme.basewebTheme}
      >
        <Resizable
          className="stEditDashboardSidebar"
          data-testid="stEditDashboardSidebar"
          aria-expanded={!isCollapsed}
          enable={{
            top: false,
            right: false,
            bottom: false,
            left: true,
          }}
          handleStyles={{
            left: {
              width: RESIZE_HANDLE_WIDTH,
              left: "-6px",
            },
          }}
          handleComponent={{
            left: <StyledResizeHandle onClick={resetSidebarWidth} />,
          }}
          size={{
            width: sidebarWidth,
            height: "auto",
          }}
          as={StyledSidebar}
          onResizeStop={onResizeStop}
          // Props part of StyledSidebar, but not Resizable component
          // @ts-expect-error
          isCollapsed={isCollapsed}
          sidebarWidth={sidebarWidth}
        >
          <StyledSidebarContent
            data-testid="stSidebarContent"
            ref={sidebarRef}
          >
            <StyledSidebarHeaderContainer data-testid="stSidebarHeader">
              <StyledCollapseSidebarButton data-testid="stSidebarCollapseButton">
                <BaseButton
                  kind={BaseButtonKind.HEADER_NO_PADDING}
                  onClick={toggleCollapse}
                >
                  <Icon content={ChevronRight} size="xl" />
                </BaseButton>
              </StyledCollapseSidebarButton>
            </StyledSidebarHeaderContainer>
            <StyledSidebarUserContent data-testid="stSidebarUserContent">
              {children}
            </StyledSidebarUserContent>
          </StyledSidebarContent>
        </Resizable>
      </ThemeProvider>
    </>
  )
}

export default EditDashboardSidebar
