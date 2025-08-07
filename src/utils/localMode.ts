import type { Config } from "../../config.js";

/**
 * Determines if the server should run in local mode
 * Local mode uses local Chrome CDP connection instead of Browserbase cloud
 */
export function isLocalMode(config: Config): boolean {
  return process.env.STAGEHAND_ENV === "LOCAL" || config.localMode === true;
}
