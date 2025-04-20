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

import pathlib
import sys

import streamlit as st

# Add the parent directory of e2e_playwright to the Python path
# This is necessary so that the executed scripts can import modules
# from the root of the repository (e.g., shared utilities).
# We assume the script is executed from the repository root.
e2e_playwright_dir = pathlib.Path(__file__).parent.resolve()
root_dir = e2e_playwright_dir.parent
sys.path.insert(0, str(root_dir))

st.set_page_config(layout="wide")
st.title("E2E Script Previewer")


def find_scripts(root_dir: pathlib.Path) -> list[pathlib.Path]:
    """Recursively finds all non-test Python scripts."""
    scripts = []
    for path in root_dir.rglob("*.py"):
        # Exclude test files, conftest, and the preview app itself
        if (
            not path.name.endswith("_test.py")
            and path.name != "conftest.py"
            and path.name != "preview_app.py"
            and "__pycache__" not in str(path)
            and ".streamlit" not in str(path)  # Exclude config files
            and "test-results" not in str(path)  # Exclude test results
            and ".benchmarks" not in str(path)  # Exclude benchmarks
        ):
            scripts.append(path)
    return sorted(scripts)


all_scripts = find_scripts(e2e_playwright_dir)
# Display relative paths in the selectbox
script_options = [""] + [str(s.relative_to(e2e_playwright_dir)) for s in all_scripts]

selected_script_rel_path = st.selectbox(
    "Select an e2e script to run", options=script_options
)

if selected_script_rel_path:
    selected_script_path = e2e_playwright_dir / selected_script_rel_path

    st.markdown("---")
    st.subheader(f"Running: `{selected_script_rel_path}`")

    with st.expander("Source Code", expanded=False):
        try:
            source_code = selected_script_path.read_text(encoding="utf-8")
            st.code(source_code, language="python")
        except Exception as e:
            st.error(f"Error reading script: {e}")
            st.stop()

    st.markdown("---")
    st.subheader("App Output")

    # Execute the script
    try:
        # Store the original globals
        original_globals = dict(globals())

        # Define globals for the executed script.
        # '__file__' needs to be set to the path of the executed script
        # so that it can correctly resolve relative paths, if any.
        script_globals = {
            "__file__": str(selected_script_path),
            "__name__": "__main__",  # Ensure script runs as main
            # Copy necessary modules or objects if needed, but start minimal
        }

        # Combine with original globals, prioritizing script-specific ones if conflicts arise
        # Be cautious about which globals are truly needed or safe to expose.
        exec_globals = {**original_globals, **script_globals}

        exec(source_code, exec_globals)

    except Exception as e:
        st.error("An error occurred while executing the script:")
        st.exception(e)
        # Optionally display traceback details
        # tb_str = traceback.format_exc()
        # st.code(tb_str)
else:
    st.info("Select a script from the dropdown above to view and run it.")
