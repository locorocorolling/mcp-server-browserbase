#!/bin/bash

# Chrome RDP Wrapper for BrowserBase MCP Server
# Ensures Chrome with Remote Debugging is running before starting MCP server

set -e

# Configuration
CHROME_DEBUG_PORT=9222
CHROME_USER_DATA_DIR="/tmp/chrome-debug-profile"
MCP_SERVER_PATH="$(dirname "$0")/cli.js"
LOG_PREFIX="[Chrome-RDP-Wrapper]"

# Functions
log() {
    echo "$LOG_PREFIX $1" >&2
}

check_chrome_rdp() {
    curl -s --connect-timeout 2 "http://localhost:$CHROME_DEBUG_PORT/json" >/dev/null 2>&1
}

start_chrome_rdp() {
    log "Starting Chrome with Remote Debugging on port $CHROME_DEBUG_PORT"
    
    # Kill any existing Chrome instances that might interfere
    pkill -f "remote-debugging-port=$CHROME_DEBUG_PORT" 2>/dev/null || true
    
    # Clean up previous profile
    rm -rf "$CHROME_USER_DATA_DIR" 2>/dev/null || true
    
    # Start Chrome with remote debugging
    open -a "Google Chrome" --args \
        --remote-debugging-port=$CHROME_DEBUG_PORT \
        --user-data-dir="$CHROME_USER_DATA_DIR" \
        --no-first-run \
        --no-default-browser-check \
        --disable-background-timer-throttling \
        --disable-backgrounding-occluded-windows \
        --disable-renderer-backgrounding
    
    # Wait for Chrome to be ready
    local max_attempts=10
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if check_chrome_rdp; then
            log "Chrome RDP ready on port $CHROME_DEBUG_PORT"
            return 0
        fi
        log "Waiting for Chrome to start (attempt $attempt/$max_attempts)..."
        sleep 1
        attempt=$((attempt + 1))
    done
    
    log "ERROR: Chrome failed to start with remote debugging"
    exit 1
}

cleanup() {
    log "Wrapper shutting down"
    # Note: We don't kill Chrome here as it may be used by other sessions
}

# Main execution
main() {
    log "Checking Chrome Remote Debugging status..."
    
    if check_chrome_rdp; then
        log "Chrome RDP already running on port $CHROME_DEBUG_PORT"
    else
        start_chrome_rdp
    fi
    
    # Set up cleanup trap
    trap cleanup EXIT INT TERM
    
    # Start the MCP server
    log "Starting BrowserBase MCP Server..."
    exec node "$MCP_SERVER_PATH" "$@"
}

# Run main function with all arguments
main "$@"
