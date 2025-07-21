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
import { keyframes } from "@emotion/react"

import { STALE_STYLES, STALE_TRANSITION_PARAMS } from "~lib/theme"
import { StyledSpinnerIcon } from "~lib/components/shared/Icon"

export interface StyledExpandableContainerProps {
  empty: boolean
  disabled: boolean
}

export const StyledExpandableContainer = styled.div({
  width: "100%",
})
interface StyledDetailsProps {
  isStale: boolean
}

export const BORDER_SIZE = 1 // px
export const StyledDetails = styled.details<StyledDetailsProps>(
  ({ isStale, theme }) => ({
    marginBottom: 0,
    marginTop: 0,
    width: "100%",
    borderStyle: "solid",
    borderWidth: theme.sizes.borderWidth,
    borderColor: theme.colors.borderColor,
    borderRadius: theme.radii.default,
    ...(isStale
      ? {
          borderColor: theme.colors.borderColorLight,
          transition: `border ${STALE_TRANSITION_PARAMS}`,
        }
      : {}),
  })
)

export const StyledSummaryHeading = styled.span(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.none, // Remove gap between icon and label
  alignItems: "center",
  flexGrow: 1,
}))

interface StyledSummaryProps {
  isStale: boolean
  expanded: boolean
}

export const StyledSummary = styled.summary<StyledSummaryProps>(
  ({ theme, isStale, expanded }) => ({
    position: "relative",
    display: "flex",
    width: "100%",
    "&:focus-visible": {
      outline: `${theme.sizes.borderWidth} solid ${theme.colors.primary}`,
      outlineOffset: `-${theme.sizes.borderWidth}`,
      borderRadius: theme.radii.default,
    },
    fontSize: "inherit", // Use normal font size instead of sm
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    paddingTop: theme.spacing.twoXS, // Match button SMALL size padding
    paddingBottom: theme.spacing.twoXS, // Match button SMALL size padding
    minHeight: theme.sizes.minElementHeight, // Standard button height
    alignItems: "center", // Center content vertically
    cursor: "pointer",
    listStyleType: "none",
    "&::-webkit-details-marker": {
      display: "none",
    },
    backgroundColor: expanded ? theme.colors.darkenedBgMix15 : "transparent",
    borderRadius: expanded
      ? `${theme.radii.default} ${theme.radii.default} 0 0` // Only top corners when expanded
      : theme.radii.default, // All corners when collapsed
    "&:hover": {
      backgroundColor: expanded
        ? theme.colors.darkenedBgMix25
        : theme.colors.darkenedBgMix15,
    },
    "&:active": {
      backgroundColor: expanded
        ? theme.colors.darkenedBgMix15
        : theme.colors.darkenedBgMix25,
    },
    ...(isStale && STALE_STYLES),
  })
)

export const StyledDetailsPanel = styled.div(({ theme }) => ({
  paddingTop: theme.spacing.lg,
  paddingBottom: theme.spacing.lg,
  paddingLeft: theme.spacing.lg,
  paddingRight: theme.spacing.lg,
  borderTop: `${theme.sizes.borderWidth} solid ${theme.colors.borderColor}`,
}))

export const StyledStatusSpinner = styled(StyledSpinnerIcon as any)(
  ({ theme }: any) => ({
    // TODO: Should probably use a different color here. The rest of the spinner
    // uses border color, so maybe a darkened version of that?
    borderTopColor: theme.colors.fadedText60, // Override only the color to gray
  })
)

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }
  100% {
    background-position: -100% 0;
  }
`

interface StyledStatusLabelProps {
  isRunning: boolean
}

export const StyledStatusLabel = styled.span<StyledStatusLabelProps>(
  ({ isRunning, theme }) => ({
    position: "relative",
    display: "inline-block",
    ...(isRunning && {
      // TODO: Setting the color here doesn't seem to work with colored text.
      background: `linear-gradient(
        to right,
        ${theme.colors.bodyText} 0%,
        ${theme.colors.bodyText} 30%,
        ${theme.colors.fadedText40} 50%,
        ${theme.colors.bodyText} 70%,
        ${theme.colors.bodyText} 100%
      )`,
      backgroundSize: "200% 100%",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      animation: `${shimmer} 1.1s linear infinite`,
    }),
  })
)
