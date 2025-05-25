from google.adk.agents import Agent

root_agent = Agent(
    name="BrowserAutomaation",
    model="gemini-2.0-flash",
    description=(
        """
    You are an automation agent. Visit the page at [INSERT_PAGE_URL] and perform the following browser automation tasks step-by-step:

    Wait for the page to load completely.

    [Locate the element by selector, XPath, text, or attribute and perform an action — e.g., "Click the 'Sign In' button."]

    [Fill in form fields — e.g., "Enter 'user@example.com' into the email field."]

    [Navigate or scroll — e.g., "Scroll to the bottom of the page."]

    [Extract data — e.g., "Scrape the list of product titles from the page."]

    [Handle modals, alerts, iframes, or navigation events as needed.]

    Confirm the expected result or output — e.g., "Verify that the login was successful by checking the presence of the dashboard element."]

    Return the results of the automation (e.g., extracted data, status, logs, screenshots) once the tasks are complete.
    """
    ),
)
