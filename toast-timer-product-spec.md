### Summary

This proposal aims to enhance `st.toast` by introducing a `duration` parameter, allowing developers to control how long the toast message is displayed [prior conversation]. Currently, `st.toast` messages automatically disappear after a fixed four seconds [prior conversation]. The proposed feature will enable setting a specific display time in seconds (float or int) or choosing a special "always" option to keep the toast visible until the user explicitly dismisses it [prior conversation].

### Problem Statement

The current `st.toast` command provides brief, ephemeral notifications that vanish after a fixed four seconds [prior conversation]. This automatic dismissal, while suitable for quick alerts, creates limitations in several user experience scenarios:

- **Insufficient Reading Time**: Important or longer messages may disappear before users can fully read and understand their content [prior conversation].
- **Lack of Persistent Feedback**: For critical operations, ongoing status updates, or instructional messages, developers lack the ability to make a toast message persist until acknowledged by the user or a state change occurs [prior conversation].
- **Limited Customization**: The absence of a configurable duration parameter prevents developers from fine-tuning the notification behavior to align with the context and urgency of the message [prior conversation].

The need for this functionality is evidenced by existing community feedback, specifically GitHub Issue 7047, which is a feature request for an `st.toast` timer and has garnered 41 reactions [prior conversation].

### Proposed Solution

### API

A new optional parameter `duration` will be added to the `st.toast` function signature:

`st.toast(body, *, icon=None, duration=4.0)`

- **`duration`**: `float`, `int`, or `str`
  - **Numerical Value**: When a `float` or `int` (e.g., `10.0` or `10`) is provided, the toast will display for the specified number of seconds.
  - **"always" Option**: When the string `"always"` is provided (e.g., `st.toast("Upload complete!", duration="always")`), the toast will remain on screen indefinitely.
  - **Default Value**: The default value for `duration` will be `4.0` seconds, ensuring backward compatibility with the existing `st.toast` behavior [prior conversation].

### Behavior

- **Timed Dismissal**: If `duration` is set to a numerical value, the toast will automatically disappear after the specified time [prior conversation].
- **User Dismissal (for "always" mode)**: When `duration="always"`, the toast will persist until one of the following events occurs:
  - The user clicks on a dedicated close/dismiss icon (e.g., an "X" button) on the toast [prior conversation].
  - The Streamlit app reruns, which naturally clears all elements, including toasts [prior conversation].
- **Interaction with `icon`**: The `icon` parameter will continue to function as currently described in the documentation, accepting an emoji or icon string [prior conversation].
- **Caching Compatibility**: `st.toast` will remain incompatible with Streamlit's caching mechanisms and cannot be called within a cached function [prior conversation].
- **Stacking Order**: The toast message should always appear on top of other Streamlit elements, including `st.dialog`, ensuring its visibility and prominence (this addresses the problem described in Issue 10383) [prior conversation].

### Design

- For toasts with `duration="always"`, a clear and easily accessible close button (e.g., an "X" icon) will be prominently displayed on the toast, allowing users to manually dismiss it [prior conversation]. This aligns with standard UI patterns for persistent notifications.
- The overall visual appearance, positioning (top-right corner of the app), and existing styling of `st.toast` will be maintained to ensure consistency with the current Streamlit user interface [prior conversation].
