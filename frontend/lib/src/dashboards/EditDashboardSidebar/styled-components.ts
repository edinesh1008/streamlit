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

import styled from "@emotion/styled"

import { hasLightBackgroundColor } from "~lib/theme"

export const StyledCollapseSidebarButton = styled.div(({ theme }) => {
  return {
    transition: "left 300ms",
    transitionDelay: "left 300ms",
    color: hasLightBackgroundColor(theme)
      ? theme.colors.fadedText60
      : theme.colors.bodyText,
    lineHeight: "0",

    [`@media print`]: {
      display: "none",
    },

    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      display: "inline",
    },
  }
})

export const StyledDataSourcesButton = styled.div(({ theme }) => {
  return {
    color: hasLightBackgroundColor(theme)
      ? theme.colors.fadedText60
      : theme.colors.bodyText,
    lineHeight: "0",
  }
})

export interface StyledSidebarProps {
  isCollapsed: boolean
  sidebarWidth: string
}

export const StyledSidebar = styled.section<StyledSidebarProps>(
  ({ theme, isCollapsed, sidebarWidth }) => {
    const minWidth = isCollapsed ? 0 : Math.min(244, window.innerWidth)
    const maxWidth = isCollapsed ? 0 : Math.min(550, window.innerWidth * 0.9)

    return {
      position: "relative",
      top: theme.sizes.headerHeight,
      backgroundColor: theme.colors.bgColor,
      zIndex: theme.zIndices.header + 1,
      borderRadius: theme.radii.xxl,
      marginRight: isCollapsed ? 0 : theme.spacing.md,

      minWidth,
      maxWidth,
      transform: isCollapsed
        ? `translateX(calc(${sidebarWidth}px + ${theme.spacing.md}))`
        : "none",
      transition: "transform 300ms, min-width 300ms, max-width 300ms",

      "&:focus": {
        outline: "none",
      },

      [`@media (max-width: ${theme.breakpoints.md})`]: {
        boxShadow: `-2rem 0 2rem 2rem ${
          isCollapsed ? "transparent" : "#00000029"
        }`,
      },

      [`@media print`]: {
        display: "none",
      },
    }
  }
)

export const StyledSidebarUserContent = styled.div(({ theme }) => ({
  paddingTop: theme.sizes.twoXL,
  paddingBottom: theme.sizes.twoXL,
  paddingLeft: theme.spacing.twoXL,
  paddingRight: theme.spacing.twoXL,
  flexGrow: 1,
}))

export const StyledSidebarContent = styled.div(({}) => ({
  position: "relative",
  width: "100%",
  height: "100%",
  overflow: ["auto", "overlay"],
  display: "flex",
  flexDirection: "column",
}))

export const RESIZE_HANDLE_WIDTH = "8px"

export const StyledResizeHandle = styled.div(({ theme }) => ({
  position: "absolute",
  width: RESIZE_HANDLE_WIDTH,
  height: "100%",
  cursor: "col-resize",
  zIndex: theme.zIndices.sidebarMobile,

  "&:hover": {
    backgroundImage: `linear-gradient(to right, transparent 20%, ${theme.colors.fadedText20} 28%, transparent 36%)`,
  },
}))

export const StyledSidebarHeaderContainer = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "start",
  padding: theme.spacing.lg,
}))

interface StyledSidebarOpenContainerProps {
  isCollapsed: boolean
}

export const StyledSidebarOpenContainer =
  styled.div<StyledSidebarOpenContainerProps>(({ theme, isCollapsed }) => ({
    position: "fixed",
    right: theme.spacing.md,
    top: `calc(${theme.sizes.headerHeight} + ${theme.spacing.md})`,
    zIndex: theme.zIndices.header,
    display: isCollapsed ? "flex" : "none",
    justifyContent: "center",
    alignItems: "center",

    [`@media print`]: {
      position: "absolute",
      right: 0,
      top: 0,
      marginTop: 0,
    },
  }))

export const StyledOpenSidebarButton = styled.div(({ theme }) => {
  return {
    zIndex: theme.zIndices.header,
    color: hasLightBackgroundColor(theme)
      ? theme.colors.fadedText60
      : theme.colors.bodyText,
    marginTop: theme.spacing.twoXS,

    button: {
      "&:hover": {
        backgroundColor: theme.colors.darkenedBgMix25,
      },
    },

    [`@media print`]: {
      display: "none",
    },
  }
})
