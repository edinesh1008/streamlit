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

import styled from "@emotion/styled"

interface StyledButtonProps {
  isSelected: boolean
}

const StyledButton = styled.button<StyledButtonProps>(
  ({ theme, isSelected }) => {
    return {
      backgroundColor: isSelected ? theme.colors.primary : "transparent",
      color: isSelected ? theme.colors.gray10 : theme.colors.bodyText,
      fontSize: theme.fontSizes.sm,
      padding: `${theme.spacing.twoXS} ${theme.spacing.lg}`,
      cursor: "pointer",
      border: `2px solid ${theme.colors.primary}`,
      "&:hover": {
        backgroundColor: theme.colors.primary,
        color: theme.colors.gray10,
      },
    }
  }
)

const StyledSegmentedButtonGroup = styled.div(({ theme }) => {
  return {
    display: "flex",
    borderRadius: theme.radii.xl,

    "& > button": {
      borderRadius: 0,
      borderRight: "none",
      "&:first-of-type": {
        borderTopLeftRadius: theme.radii.xl,
        borderBottomLeftRadius: theme.radii.xl,
      },
      "&:last-of-type": {
        borderTopRightRadius: theme.radii.xl,
        borderBottomRightRadius: theme.radii.xl,
        borderRight: `2px solid ${theme.colors.primary}`,
      },
    },
  }
})

interface SegmentedButtonProps {
  value: string
  onChange: (value: string) => void
}

export function SegmentedButtonGroup({
  value,
  onChange,
}: SegmentedButtonProps): ReactElement {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      const { target } = event
      if (target instanceof HTMLButtonElement) {
        const textContent = target.textContent ?? ""
        onChange(textContent.toLowerCase())
      }
    },
    [onChange]
  )

  return (
    <StyledSegmentedButtonGroup className="stSegBtnGroup">
      <StyledButton isSelected={value === "catalog"} onClick={handleClick}>
        Catalog
      </StyledButton>
      <StyledButton isSelected={value === "properties"} onClick={handleClick}>
        Properties
      </StyledButton>
      <StyledButton isSelected={value === "views"} onClick={handleClick}>
        Views
      </StyledButton>
    </StyledSegmentedButtonGroup>
  )
}
