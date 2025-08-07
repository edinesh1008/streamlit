# Python application code:
import contextlib
import time
from collections.abc import Iterator

import numpy as np
from js_component import js_component

import streamlit as st


@contextlib.contextmanager
def lazy_expander(label: str, key: str, expanded: bool = False) -> Iterator[bool]:
    with st.expander(label, expanded=expanded):
        isOpen = js_component(
            f"""(
            (() => {{
                const target = window.parent.document.querySelector('.st-key-{key}');
                if (!target) return;

                const detailsParent = target.closest('details');
                if (!detailsParent) return;

                let loaded = false;

                const observer = new MutationObserver(mutations => {{
                    for (const mutation of mutations) {{
                        if (mutation.type === 'attributes' && mutation.attributeName === 'open') {{
                            const isNowOpen = detailsParent.hasAttribute('open');
                            if (loaded || !isNowOpen) continue;
                            loaded |= isNowOpen;
                            Streamlit.setComponentValue(loaded);
                        }}
                    }}
                }});
                observer.observe(detailsParent, {{ attributes: true, attributeFilter: ['open'] }});

                return function(event) {{
                    // onRender function. Nothing to do here.
                }}
            }})()
        )""",
            key=key,
            default=False,
        )
        yield isOpen


@st.cache_data
def my_function(input: int):
    time.sleep(2)
    return input


my_value = my_function(np.random.randint(0, 100))

for i in range(10):
    with lazy_expander(
        "Test",
        key=str(i),
        expanded=False,
    ) as is_open:
        if is_open:
            st.markdown(f"{i}isOpen")
