# Query Parameter Widget Binding

This prototype implements automatic synchronization between Streamlit widgets and URL query parameters.

## Overview

Widgets with keys starting with `?` are automatically bound to URL query parameters. This enables:

- Deep linking to specific app states
- Shareable URLs that preserve widget values
- Browser back/forward navigation support

## Usage

Simply prefix your widget key with `?`:

```python
import streamlit as st

# This widget is bound to the "name" query parameter
name = st.text_input("Enter your name", key="?name")

# This widget is bound to the "age" query parameter
age = st.number_input("Enter your age", key="?age")

# This widget is bound to the "subscribe" query parameter
subscribe = st.checkbox("Subscribe to newsletter", key="?subscribe")
```

When users interact with these widgets:

1. The URL automatically updates with the new values
2. The URL can be bookmarked or shared
3. Opening the URL restores the widget states

## Example URLs

- `https://myapp.streamlit.app/?name=John&age=25&subscribe=true`
- `https://myapp.streamlit.app/?color=blue&size=large`

## Supported Widget Types

The prototype supports basic value types:

- **String**: Text inputs, selectboxes, etc.
- **Integer**: Number inputs, sliders with integer values
- **Float**: Number inputs, sliders with decimal values
- **Boolean**: Checkboxes, toggles

## Implementation Details

### Backend (Python)

1. **Serialization Module** (`lib/streamlit/runtime/state/auto_qs.py`):

   - `serialize_value()`: Converts Python values to URL-safe strings
   - `deserialize_value()`: Converts URL strings back to Python values
   - `parse_query_string()`: Parses query strings into dictionaries

2. **SessionState Integration** (`lib/streamlit/runtime/state/session_state.py`):

   - Tracks widgets with `?` prefix keys
   - Maps query param names to widget IDs
   - Provides hydration on app startup

3. **AppSession Updates** (`lib/streamlit/runtime/app_session.py`):
   - Stores initial query string from browser
   - Triggers hydration on first script run

### Frontend (TypeScript)

1. **Widget State Manager** (`frontend/lib/src/WidgetStateManager.ts`):

   - Placeholder for building query strings from widget state
   - Will track widgets bound to query params

2. **URL Updates**:
   - Uses `history.replaceState()` to update URL without navigation
   - Debounced to avoid excessive updates

## Architecture Flow

1. **Initial Load**:

   - Browser sends initial query string to backend
   - Backend hydrates widgets from query params
   - Widgets display with URL-specified values

2. **User Interaction**:

   - Widget value changes trigger state update
   - Frontend builds new query string
   - URL updates via `history.replaceState()`

3. **Sharing/Bookmarking**:
   - Current URL contains all widget states
   - Opening URL restores exact app state

## Limitations (Prototype)

- Single-page apps only (multipage support deferred)
- Basic types only (no complex objects, dataframes, files)
- No browser history navigation (uses replaceState)
- Manual testing only (automated tests deferred)

## Future Enhancements

- Support for complex types (lists, dates, times)
- Multipage app support
- Browser history integration
- Automated test suite
- Usage metrics
- Enhanced error handling
