"""
E2E test for query params functionality in st.page_link and st.switch_page.
"""

import pytest
from playwright.sync_api import Page, expect


def test_page_link_query_params(themed_app: Page):
    """Test st.page_link with query_params parameter."""
    # Wait for the app to load
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Test external link with query_params
    external_link = themed_app.get_by_test_id("stPageLink").filter(
        has_text="External with query_params"
    ).get_by_test_id("stPageLink-NavLink")
    
    # Verify the href includes the query parameters
    href = external_link.get_attribute("href")
    assert "https://httpbin.org/get" in href
    assert "source=streamlit" in href
    assert "test=page_link" in href


def test_page_link_url_params(themed_app: Page):
    """Test st.page_link with query params in the URL string."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Test external link with URL params
    url_link = themed_app.get_by_test_id("stPageLink").filter(
        has_text="External with URL params"
    ).get_by_test_id("stPageLink-NavLink")
    
    href = url_link.get_attribute("href")
    assert "https://httpbin.org/get" in href
    assert "url_param=true" in href
    assert "existing=value" in href


def test_page_link_precedence(themed_app: Page):
    """Test that query_params parameter takes precedence over URL params."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Test precedence
    precedence_link = themed_app.get_by_test_id("stPageLink").filter(
        has_text="Both methods (precedence test)"
    ).get_by_test_id("stPageLink-NavLink")
    
    href = precedence_link.get_attribute("href")
    assert "https://httpbin.org/get" in href
    # The explicit query_params should override URL params
    assert "override=new" in href  # Should be overridden
    assert "keep=this" in href     # Should be kept from URL
    assert "add=extra" in href     # Should be added from query_params


def test_switch_page_query_params(themed_app: Page):
    """Test st.switch_page with query_params."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Initially should have no query params
    expect(themed_app.get_by_text("No query parameters set")).to_be_visible()
    
    # Click button to set query params
    themed_app.get_by_role("button", name="Set query params").click()
    
    # Wait for page to reload with new query params
    expect(themed_app.get_by_text("Current query parameters:")).to_be_visible()
    expect(themed_app.get_by_text("test: internal")).to_be_visible()
    expect(themed_app.get_by_text("value: 123")).to_be_visible()


def test_switch_page_url_params(themed_app: Page):
    """Test st.switch_page with query params in URL string."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Click button to set URL params
    themed_app.get_by_role("button", name="URL params").click()
    
    # Wait for page to reload with URL query params
    expect(themed_app.get_by_text("Current query parameters:")).to_be_visible()
    expect(themed_app.get_by_text("method: url")).to_be_visible()
    expect(themed_app.get_by_text("count: 456")).to_be_visible()


def test_clear_query_params(themed_app: Page):
    """Test clearing query parameters."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # First set some params
    themed_app.get_by_role("button", name="Set query params").click()
    expect(themed_app.get_by_text("Current query parameters:")).to_be_visible()
    
    # Then clear them
    themed_app.get_by_role("button", name="Clear params").click()
    expect(themed_app.get_by_text("No query parameters set")).to_be_visible()


def test_iterable_values(themed_app: Page):
    """Test that iterable query param values use the last value."""
    expect(themed_app.get_by_text("Query Params Test App")).to_be_visible()
    
    # Test iterable values link
    iterable_link = themed_app.get_by_test_id("stPageLink").filter(
        has_text="Test iterable values"
    ).get_by_test_id("stPageLink-NavLink")
    
    href = iterable_link.get_attribute("href")
    assert "https://httpbin.org/get" in href
    assert "string=simple_value" in href
    assert "list=last" in href  # Should use last value from list
    assert "empty_list=" in href  # Should be empty string
    assert "number=42" in href  # Should be converted to string