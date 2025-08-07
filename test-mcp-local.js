import { createStagehandInstance } from "./dist/stagehandStore.js";

async function testMCPLocal() {
  try {
    console.log("Testing MCP server with local browser...");

    // Simulate config that would come from MCP client
    const config = {
      localMode: true,
      cdpUrl: "http://localhost:9222",
      browserbaseApiKey: "dummy-key", // Required by type but not used in local mode
      browserbaseProjectId: "dummy-project", // Required by type but not used in local mode
      viewPort: {
        browserWidth: 1024,
        browserHeight: 768,
      },
      modelName: "google/gemini-2.0-flash",
      modelApiKey: process.env.GEMINI_API_KEY || "dummy-gemini-key",
    };

    const sessionId = "test-session-123";

    console.log("Creating Stagehand instance...");
    const stagehand = await createStagehandInstance(config, {}, sessionId);

    console.log("Stagehand instance created successfully!");
    console.log("Testing navigation...");

    await stagehand.page.goto("https://google.com");

    const title = await stagehand.page.title();
    console.log(`Page title: ${title}`);

    await stagehand.close();
    console.log("MCP local browser test completed successfully!");
  } catch (error) {
    console.error("MCP local browser test failed:", error.message);
  }
}

testMCPLocal();
