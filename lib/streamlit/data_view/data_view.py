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

from typing import Literal

from streamlit.runtime.connection_factory import connection_factory

# A data view is a function decorator that can take an optional argument
# that specifies the data view's type (sql or python). If the type is not
# specified, the data view is assumed to be of type python.


# TODO consider threading as an option here. We would likely need to handle
#      some logic of ensuring all items are ready at the end of the script.
def data_view(data_view_type: Literal["sql", "python"], connection_name: str):
    def decorator(func):
        if data_view_type == "sql":
            # In this case, we expect the data to produce a string that we use to query
            # the database.
            sql_statement = func()
            connection = connection_factory(connection_name)
            return connection.query(sql_statement)
        elif data_view_type == "python":
            # in this case, it's just a function that returns a DataFrame
            return func()

        raise ValueError(f"Invalid data view type: {data_view_type}")

    return decorator


# Example usage:

# @data_view("sql", "my_connection")
# def my_sql_data_view():
#     return "SELECT * FROM my_table"

# @data_view("python")
# def my_python_data_view():
#     return pd.DataFrame({"a": [1, 2, 3], "b": [4, 5, 6]})
