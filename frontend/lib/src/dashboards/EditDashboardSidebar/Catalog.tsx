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
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useRef,
} from "react"

import {
  BarChart,
  PieChart,
  ShowChart,
  TableView,
  TextFields,
} from "@emotion-icons/material-outlined"
import { EmotionIcon } from "@emotion-icons/emotion-icon"
import styled from "@emotion/styled"
import { transparentize } from "color2k"
import { useTheme } from "@emotion/react"
import { useDrag } from "react-dnd"

import {
  Arrow,
  ArrowNamedDataSet,
  ArrowVegaLiteChart,
  Element,
  ForwardMsgMetadata,
  Markdown,
  Styler,
} from "@streamlit/protobuf"

import Icon from "~lib/components/shared/Icon"
import { ElementNode } from "~lib/AppNode"
import { VEGA_LITE, VEGA_LITE_LINE_CHART } from "~lib/mocks/arrow"
import { EditModeElementsContext } from "../EditModeElementsContext"

const StyledListItem = styled.li(({ theme }) => ({
  padding: `${theme.spacing.lg} ${theme.spacing.sm}`,
  color: theme.colors.bodyText,
}))

const StyledListContainer = styled.ul(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  flexGrow: 1,
  marginTop: theme.spacing.twoXL,
  overflowY: "scroll",
  listItemStyleType: "none",
  [StyledListItem as any]: {
    borderBottom: `1px solid ${theme.colors.fadedText20}`,
    "&:last-of-type": {
      borderBottom: "none",
    },
  },
}))

const StyledListItemIcon = styled.div(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "center",
  color: theme.colors.bodyText,
}))

const StyledListItemLayout = styled.div(({ theme }) => ({
  display: "flex",
  gap: theme.spacing.lg,
}))

const StyledListItemContentLayout = styled.div(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing.xs,
  color: transparentize(theme.colors.bodyText, 0.2),
}))

const StyledListItemTitle = styled.div(({ theme }) => ({
  fontWeight: theme.fontWeights.bold,
  lineHeight: theme.lineHeights.tight,
}))

const StyledListItemDescription = styled.div(({ theme }) => ({
  fontSize: theme.fontSizes.sm,
  lineHeight: theme.lineHeights.tight,
  fontStyle: "italic",
}))

const fakeMetadata = new ForwardMsgMetadata({
  cacheable: false,
  deltaPath: [],
  activeScriptHash: "NO_ACTIVE_SCRIPT_HASH",
})

const DEFAULT_ELEMENT: Record<string, ElementNode> = {
  table: new ElementNode(
    new Element({
      arrowDataFrame: new Arrow({
        data: VEGA_LITE,
        styler: new Styler({
          uuid: "",
          caption: "I am a caption",
          styles: "",
          displayValues: VEGA_LITE,
        }),
        width: 0,
        height: 0,
        useContainerWidth: true,
        id: "",
        columns: "",
        editingMode: Arrow.EditingMode.READ_ONLY,
        disabled: false,
        formId: "",
        columnOrder: [],
        selectionMode: [],
      }),
    }),
    fakeMetadata,
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
  line_chart: new ElementNode(
    new Element({
      arrowVegaLiteChart: new ArrowVegaLiteChart({
        spec: JSON.stringify({
          layer: [
            {
              mark: { type: "line" },
              encoding: {
                color: {
                  field: "color--p5bJXXpQgvPz6yvQMFiy",
                  legend: { titlePadding: 5, offset: 5, orient: "bottom" },
                  title: " ",
                  type: "nominal",
                },
                tooltip: [
                  {
                    field: "index--p5bJXXpQgvPz6yvQMFiy",
                    title: "index",
                    type: "quantitative",
                  },
                  {
                    field: "value--p5bJXXpQgvPz6yvQMFiy",
                    title: "value",
                    type: "quantitative",
                  },
                  {
                    field: "color--p5bJXXpQgvPz6yvQMFiy",
                    title: "color",
                    type: "nominal",
                  },
                ],
                x: {
                  axis: { grid: false, tickMinStep: 1 },
                  field: "index--p5bJXXpQgvPz6yvQMFiy",
                  scale: {},
                  title: "",
                  type: "quantitative",
                },
                y: {
                  axis: { grid: true },
                  field: "value--p5bJXXpQgvPz6yvQMFiy",
                  scale: {},
                  title: "",
                  type: "quantitative",
                },
              },
              name: "view_1",
            },
            {
              mark: { type: "point", filled: true, size: 65 },
              encoding: {
                color: {
                  field: "color--p5bJXXpQgvPz6yvQMFiy",
                  legend: { titlePadding: 5, offset: 5, orient: "bottom" },
                  title: " ",
                  type: "nominal",
                },
                opacity: {
                  condition: { param: "param_1", value: 1, empty: false },
                  value: 0,
                },
                tooltip: [
                  {
                    field: "index--p5bJXXpQgvPz6yvQMFiy",
                    title: "index",
                    type: "quantitative",
                  },
                  {
                    field: "value--p5bJXXpQgvPz6yvQMFiy",
                    title: "value",
                    type: "quantitative",
                  },
                  {
                    field: "color--p5bJXXpQgvPz6yvQMFiy",
                    title: "color",
                    type: "nominal",
                  },
                ],
                x: {
                  axis: { grid: false, tickMinStep: 1 },
                  field: "index--p5bJXXpQgvPz6yvQMFiy",
                  scale: {},
                  title: "",
                  type: "quantitative",
                },
                y: {
                  axis: { grid: true },
                  field: "value--p5bJXXpQgvPz6yvQMFiy",
                  scale: {},
                  title: "",
                  type: "quantitative",
                },
              },
              name: "view_2",
            },
          ],
          config: { legend: { symbolType: "stroke" } },
          data: { name: "6290951a31799f716d6c2394a119dc9e" },
          height: 0,
          params: [
            {
              name: "param_1",
              select: {
                type: "point",
                clear: "pointerout",
                fields: ["index--p5bJXXpQgvPz6yvQMFiy"],
                nearest: true,
                on: "pointerover",
              },
              views: ["view_2"],
            },
            {
              name: "param_2",
              select: { type: "interval", encodings: ["x", "y"] },
              bind: "scales",
              views: ["view_1"],
            },
          ],
          width: 0,
          $schema: "https://vega.github.io/schema/vega-lite/v5.20.1.json",
          autosize: { type: "fit", contains: "padding" },
        }),
        data: null,
        datasets: [
          new ArrowNamedDataSet({
            name: "6290951a31799f716d6c2394a119dc9e",
            hasName: true,
            data: new Arrow({
              data: VEGA_LITE_LINE_CHART,
              columnOrder: [],
              selectionMode: [],
            }),
          }),
        ],
        useContainerWidth: true,
        theme: "streamlit",
        id: "",
        selectionMode: [],
        formId: "",
      }),
    }),
    fakeMetadata,
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
  bar_chart: new ElementNode(
    new Element({
      arrowVegaLiteChart: new ArrowVegaLiteChart({
        spec: JSON.stringify({
          data: { name: "727773f79f9629478a4df97976e3d656" },
          mark: { type: "bar" },
          encoding: {
            color: {
              field: "color--p5bJXXpQgvPz6yvQMFiy",
              legend: { titlePadding: 5, offset: 5, orient: "bottom" },
              title: " ",
              type: "nominal",
            },
            tooltip: [
              {
                field: "index--p5bJXXpQgvPz6yvQMFiy",
                title: "index",
                type: "quantitative",
              },
              {
                field: "value--p5bJXXpQgvPz6yvQMFiy",
                title: "value",
                type: "quantitative",
              },
              {
                field: "color--p5bJXXpQgvPz6yvQMFiy",
                title: "color",
                type: "nominal",
              },
            ],
            x: {
              axis: { grid: false, tickMinStep: 1 },
              field: "index--p5bJXXpQgvPz6yvQMFiy",
              scale: {},
              title: "",
              type: "ordinal",
            },
            y: {
              axis: { grid: true },
              field: "value--p5bJXXpQgvPz6yvQMFiy",
              scale: {},
              title: "",
              type: "quantitative",
            },
          },
          height: 0,
          params: [
            {
              name: "param_1",
              select: { type: "interval", encodings: ["x", "y"] },
              bind: "scales",
            },
          ],
          width: 0,
          $schema: "https://vega.github.io/schema/vega-lite/v5.20.1.json",
          autosize: { type: "fit", contains: "padding" },
        }),
        data: null,
        datasets: [
          new ArrowNamedDataSet({
            name: "727773f79f9629478a4df97976e3d656",
            hasName: true,
            data: new Arrow({
              data: VEGA_LITE_LINE_CHART,
              columnOrder: [],
              selectionMode: [],
            }),
          }),
        ],
        useContainerWidth: true,
        theme: "streamlit",
        id: "",
        selectionMode: [],
        formId: "",
      }),
    }),
    fakeMetadata,
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
  pie_chart: new ElementNode(
    new Element({
      arrowVegaLiteChart: new ArrowVegaLiteChart({
        spec: JSON.stringify({
          data: { name: "727773f79f9629478a4df97976e3d656" },
          mark: { type: "arc" },
          encoding: {
            color: {
              field: "color--p5bJXXpQgvPz6yvQMFiy",
              legend: { titlePadding: 5, offset: 5, orient: "bottom" },
              title: " ",
              type: "nominal",
            },
            theta: {
              field: "value--p5bJXXpQgvPz6yvQMFiy",
              type: "quantitative",
              aggregate: "sum",
            },
          },
          height: 0,
          width: 0,
          $schema: "https://vega.github.io/schema/vega-lite/v5.20.1.json",
          autosize: { type: "fit", contains: "padding" },
        }),
        data: null,
        datasets: [
          new ArrowNamedDataSet({
            name: "727773f79f9629478a4df97976e3d656",
            hasName: true,
            data: new Arrow({
              data: VEGA_LITE_LINE_CHART,
              columnOrder: [],
              selectionMode: [],
            }),
          }),
        ],
        useContainerWidth: true,
        theme: "streamlit",
        id: "",
        selectionMode: [],
        formId: "",
      }),
    }),
    fakeMetadata,
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
  rich_text: new ElementNode(
    new Element({
      markdown: {
        body: "# I am a heading\nI am some text",
        allowHtml: false,
        isCaption: false,
        elementType: Markdown.Type.NATIVE,
        help: "",
      },
    }),
    fakeMetadata,
    "NO_SCRIPT_RUN_ID",
    "NO_ACTIVE_SCRIPT_HASH"
  ),
}

interface ListItemProps {
  description?: string
  icon: EmotionIcon
  elementType: keyof typeof DEFAULT_ELEMENT
  children: ReactNode
}

function ListItem({
  icon,
  description,
  elementType,
  children,
}: ListItemProps): ReactElement {
  const { setSelectedElement } = useContext(EditModeElementsContext)
  const theme = useTheme()
  const defaultElements = useRef(DEFAULT_ELEMENT)

  const [{ isDragging }, dragRef] = useDrag({
    type: "element",
    item: () => {
      return DEFAULT_ELEMENT[elementType]
    },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
    end: () => {
      // Make a new element to produce a different reference
      const currentElement = defaultElements.current[elementType]
      defaultElements.current[elementType] = currentElement.clone()
    },
  })

  useEffect(() => {
    if (isDragging) {
      setSelectedElement(null)
    }
  })

  return (
    <StyledListItem ref={dragRef}>
      <StyledListItemLayout>
        <StyledListItemIcon>
          <Icon
            content={icon}
            size="threeXL"
            color={transparentize(theme.colors.bodyText, 0.2)}
          />
        </StyledListItemIcon>
        <StyledListItemContentLayout>
          <StyledListItemTitle>{children}</StyledListItemTitle>
          <StyledListItemDescription>
            {description ?? ""}
          </StyledListItemDescription>
        </StyledListItemContentLayout>
      </StyledListItemLayout>
    </StyledListItem>
  )
}

export function Catalog(): ReactElement {
  return (
    <StyledListContainer>
      <ListItem
        icon={TableView}
        description="Great for showing raw tabular data"
        elementType="table"
      >
        Table
      </ListItem>
      <ListItem
        icon={ShowChart}
        description="Ideal for visualizing trends over time or continuous data"
        elementType="line_chart"
      >
        Line Chart
      </ListItem>
      <ListItem
        icon={BarChart}
        description="Best for comparing categorical data with distinct groups"
        elementType="bar_chart"
      >
        Bar Chart
      </ListItem>
      <ListItem
        icon={PieChart}
        description="Useful for showing proportions and percentage distributions"
        elementType="pie_chart"
      >
        Pie Chart
      </ListItem>
      <ListItem
        icon={TextFields}
        description="Allows for formatted text with styling, links, and media"
        elementType="rich_text"
      >
        Rich Text
      </ListItem>
    </StyledListContainer>
  )
}
