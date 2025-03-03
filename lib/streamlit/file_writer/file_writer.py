# Copyright (c) Streamlit Inc. (2018-2022) Snowflake Inc. (2022-2025)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import json
from typing import Any

import streamlit.proto.WriteFile_pb2 as WriteFileProto


def intro():
    return """import streamlit as st
import pandas as pd
import numpy as np
import json

"""


def data_views(views: Any):
    data_views_contents = ""
    view_ids = []
    for view in views:
        connection_name = view["connection_name"]
        view_type = view["type"]
        if view_type == "sql":
            sql = view["sql"]
            query_id = view["query_id"].replace("-", "_")
            friendly_name = view["friendly_name"].replace('"', '\\"')
            view_ids.append(query_id)
            data_views_contents += f"""@st.data_view(type="sql", connection_name="{connection_name}", friendly_name="{friendly_name}")
def {query_id}():
    return "{sql.replace('"', '\\"')}"

"""
        elif view["type"] == "python":
            # This will not work because we are not sure if the value is returned
            data_views_contents += f"""@st.data_view(type="python")
    {view["python"]}
    return pd.dataframe([])

"""
    # Call these data views immediately
    for view_id in view_ids:
        data_views_contents += f"{view_id}_df = {view_id}()\n"

    return data_views_contents + "\n\n"


def elements(all_elements: Any, indent=0):
    elements_running_contents = ""
    for block in all_elements:
        if block["type"] == "markdown":
            block_text = block["text"].replace('"', "\\").replace("\n", "\\n")
            elements_running_contents += f'{" " * indent}st.write("{block_text}")\n'
        elif block["type"] == "chart":
            view_id = block["view_id"]
            chart_spec_json = block["chart_spec"]
            elements_running_contents += f"{' ' * indent}st.vega_lite_chart({view_id}_df, json.loads('{chart_spec_json.replace("'", "\\'")}'))\n"
        elif block["type"] == "table":
            view_id = block["view_id"]
            elements_running_contents += f"{' ' * indent}st.dataframe({view_id}_df)\n"
        elif block["type"] == "horizontal-block":
            weights = block["weights"]
            col_names = ", ".join([f"col_{i}" for i in range(len(weights))])
            elements_running_contents += (
                f"{' ' * indent}{col_names} = st.columns({weights}):\n"
            )
            cols = block["columns"]
            for index, col in enumerate(cols):
                f"{' ' * indent}{col_names} with col_{index}:\n"
                elements_running_contents += elements(col, indent=indent + 4)
                elements_running_contents += "\n"

            elements_running_contents += "\n"
        elif block["type"] == "vertical-block":
            elements_running_contents += f"{' ' * indent}with st.container():\n"
            elements_running_contents += elements(block["elements"], indent=indent)
            elements_running_contents += "\n"


def write_file(file_path: str, write_file_proto: WriteFileProto):
    file_contents_info = json.loads(write_file_proto.data_json)
    running_file = ""
    running_file += intro()
    running_file += data_views(file_contents_info["data_views"])
    running_file += elements(file_contents_info["elements"])

    with open(file_path, "w") as f:
        f.write(running_file)
