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

export const StyledUISelect = styled.div(({ theme }) => ({
  "span[aria-disabled='true']": {
    background: theme.colors.fadedText05,
  },
}))

export const StyledSelectAllButton = styled.div(({ theme }) => ({
  cursor: "pointer",
  padding: theme.spacing.threeXS,
  width: theme.sizes.clearIconSize,
  height: theme.sizes.clearIconSize,
  color: theme.colors.darkGray,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  ":hover": {
    color: theme.colors.bodyText,
  },
}))

export const StyledIconsContainer = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "row" as const,
  alignItems: "center",
  paddingRight: theme.spacing.sm,
}))
