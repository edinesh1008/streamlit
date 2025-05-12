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

import { createContext } from "react"

import { PageConfig } from "@streamlit/protobuf"

import { ThemeConfig } from "~lib/theme"
export interface SidebarContextProps {
  /**
   * The sidebar's default display state.
   * Set from the PageConfig protobuf.
   * Pulled from sidebarContext in Sidebar.
   * @see Sidebar
   */
  initialSidebarState: PageConfig.SidebarState

  /**
   * If non-zero, this is the number of pixels that the sidebar's
   * "chevron" icon is shifted. (If sidebarChevronDownshift is 0, then
   * the current theme's spacing is used.);
   * this is set from the host communication manager via host message.
   * Pulled from sidebarContext in ThemedSidebar
   * @see Sidebar (StyledSidebarOpenContainer)
   */
  sidebarChevronDownshift: number

  /**
   * Part of URL construction for an app page in a multi-page app;
   * this is set from the host communication manager via host message.
   * Pulled from sidebarContext in SidebarNav
   * @see SidebarNav
   */
  pageLinkBaseUrl: string

  /**
   * The currently active app theme.
   * Pulled from context in ThemedSidebar to create sidebar theme and pass to
   * theme provider. Pulled in Sidebar for StyledOpenSidebarButton
   * @see ThemedSidebar
   * @see Sidebar
   */
  activeTheme: ThemeConfig
}

/**
 * Initialize SidebarContext with a default value of null so downstream usages
 * will trigger runtime errors if context expected to exist but does not.
 */
export const SidebarContext = createContext<SidebarContextProps | null>(null)

// Set the conetxt display name for useRequiredContext error message
SidebarContext.displayName = "SidebarContext"
