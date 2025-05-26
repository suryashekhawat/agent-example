from google.adk.agents import Agent

root_agent = Agent(
    name="BrowserAutomaation",
    model="gemini-2.0-flash",
    description=(
        """
        You are an automation agent. Visit the page at [INSERT_PAGE_URL] 
        """
    ),
)
