// This script loads environment variables from .env file
// and makes them available to the application

(function () {
  // In a production environment, this would be handled by a bundler
  // For now, we'll implement a basic .env loader
  async function loadEnvVariables() {
    try {
      const response = await fetch("/.env");
      if (!response.ok) {
        console.warn("Could not load .env file");
        // Return empty object instead of hardcoded fallbacks
        return {};
      }

      const text = await response.text();
      const variables = {};

      // Parse .env file
      text.split("\n").forEach((line) => {
        // Skip comments and empty lines
        if (line.trim().startsWith("#") || !line.trim()) return;

        // Split by first equals sign
        const equalIndex = line.indexOf("=");
        if (equalIndex > 0) {
          const key = line.substring(0, equalIndex).trim();
          const value = line.substring(equalIndex + 1).trim();
          // Remove quotes if present
          variables[key] = value.replace(/^["']|["']$/g, "");
        }
      });

      return variables;
    } catch (error) {
      console.error("Error loading environment variables");
      // Don't log the actual error as it might contain sensitive info
      return {};
    }
  }

  // Load environment variables and attach to window
  loadEnvVariables().then((variables) => {
    window.ENV_VARIABLES = variables;
    // Dispatch event to notify app that variables are loaded
    window.dispatchEvent(new CustomEvent("env-variables-loaded"));
  });
})();
