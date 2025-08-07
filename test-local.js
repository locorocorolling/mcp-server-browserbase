import { Stagehand } from "@browserbasehq/stagehand";

async function testLocalStagehand() {
  try {
    console.log("Testing Stagehand with LOCAL env...");

    // First test - try with env: "LOCAL"
    const stagehand = new Stagehand({
      env: "LOCAL",
      localBrowserLaunchOptions: {
        cdpUrl: "http://localhost:9222",
        viewport: {
          width: 1024,
          height: 768,
        },
      },
      modelName: "google/gemini-2.0-flash",
      modelClientOptions: {
        apiKey: process.env.GEMINI_API_KEY || "dummy-key",
      },
      logger: (logLine) => {
        console.log(`Stagehand: ${logLine.message}`);
      },
    });

    console.log("Stagehand instance created successfully!");
    console.log("Attempting to initialize...");

    await stagehand.init();
    console.log("Stagehand initialized successfully!");

    // Try basic navigation
    await stagehand.page.goto("https://example.com");
    console.log("Navigation to example.com successful!");

    await stagehand.close();
    console.log(
      "Test completed successfully! Stagehand works with LOCAL env + CDP!",
    );
  } catch (error) {
    console.error("Error testing LOCAL mode:", error.message);
    console.log(
      "This confirms that modifications are needed for local browser support",
    );
  }
}

testLocalStagehand();
