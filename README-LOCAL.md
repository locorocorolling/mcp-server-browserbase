# Local Browser Support

This branch adds local Chrome/Brave browser control to the BrowserBase MCP Server, enabling you to control your local browser through Claude Desktop instead of using cloud browsers.

## Quick Setup

### 1. Start Chrome with Remote Debugging

```bash
open -a "Google Chrome" --args --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug-profile
```

### 2. Configure Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "browserbase": {
      "command": "node",
      "args": ["/path/to/mcp-server-browserbase/cli.js"],
      "env": {
        "STAGEHAND_ENV": "LOCAL",
        "GEMINI_API_KEY": "your-gemini-api-key"
      }
    }
  }
}
```

### 3. Restart Claude Desktop

Quit and reopen Claude Desktop to load the MCP server.

## What You Can Do

- Navigate to websites using your local browser
- Click buttons, fill forms, submit data
- Extract content and data from web pages
- Take screenshots for analysis
- Run multiple browser sessions simultaneously

## Implementation Details

This implementation adds:

- **Local Mode Detection**: Via `STAGEHAND_ENV=LOCAL` environment variable
- **Chrome CDP Integration**: Direct connection to local Chrome debugging port
- **Dual Mode Support**: Seamlessly switch between local and cloud modes
- **Session Management**: Proper handling of local vs cloud browser sessions

## Configuration Options

- `STAGEHAND_ENV=LOCAL` - Enable local browser mode
- `cdpUrl` - CDP endpoint URL (default: `http://localhost:9222`)
- `localMode` - Alternative config-based local mode toggle

## Cloud Mode (Original)

To use the original Browserbase cloud mode, configure with:

```json
{
  "env": {
    "BROWSERBASE_API_KEY": "your-api-key",
    "BROWSERBASE_PROJECT_ID": "your-project-id",
    "GEMINI_API_KEY": "your-gemini-api-key"
  }
}
```

## Architecture

The implementation maintains full backward compatibility while adding local browser support through:

- Centralized local mode detection utility
- Conditional Stagehand configuration
- Mode-aware session validation
- Clean separation of local vs cloud logic

## Documentation

For detailed implementation notes, setup process, and troubleshooting, see:

- **Full Documentation**: [Local Browser Control Documentation Repository](https://github.com/yourusername/try-claude-stagehand)
- **Setup Guide**: Complete step-by-step instructions
- **Implementation Notes**: Technical details and architectural decisions

## Testing

Test the local browser functionality:

```bash
STAGEHAND_ENV=LOCAL GEMINI_API_KEY=your-key node test-mcp-local.js
```

## Compatibility

- **Node.js**: Tested with Node.js 20+
- **Browsers**: Chrome, Brave (any Chromium-based browser with CDP support)
- **Operating System**: macOS (Windows/Linux should work with appropriate browser launch commands)
- **Claude Desktop**: MCP-enabled versions

## Status

✅ **Production Ready** - Fully implemented and tested local browser control with comprehensive error handling and clean code architecture.
