// Import required modules
// Note: When using the modules through npm, you would use:
// import * as Cesium from 'cesium';
// import * as THREE from 'three';
import CesiumThreeIntegration from "./cesium-three-integration.js";

// Load environment variables from .env file
// This will be handled by a bundler like webpack with dotenv plugin
// For demonstration, we'll use a function to get environment variables
function getEnvVariable(name) {
  // In production, this would use process.env or another secure method
  // For now, we'll fall back to looking for a global variable
  try {
    return window.ENV_VARIABLES && window.ENV_VARIABLES[name];
  } catch (e) {
    console.warn(`Environment variable ${name} not found`);
    return null;
  }
}

// Initialize Cesium Token - only get from environment variables, never hardcode
Cesium.Ion.defaultAccessToken = getEnvVariable("CESIUM_ION_TOKEN");

// Create imagery provider
const imageryProvider = new Cesium.IonImageryProvider({
  assetId: 2, // Bing Maps Aerial
});

// Create WGS84 Ellipsoid terrain provider
const wgs84EllipsoidTerrain = new Cesium.EllipsoidTerrainProvider();

// Cesium setup with Bing Maps Aerial and WGS84 Ellipsoid
const viewer = new Cesium.Viewer("cesiumContainer", {
  baseLayerPicker: true,
  geocoder: true,
  homeButton: true,
  infoBox: true,
  navigationHelpButton: true,
  sceneModePicker: true,
  selectionIndicator: true,
  timeline: true,
  animation: true,
  fullscreenButton: true,
  shadows: true,
  shouldAnimate: true,
  imageryProvider: imageryProvider,
  terrainProvider: wgs84EllipsoidTerrain,
});

// Enable terrain and atmosphere
viewer.scene.globe.enableLighting = true;
viewer.scene.globe.depthTestAgainstTerrain = true;
viewer.scene.globe.showGroundAtmosphere = true;
viewer.scene.skyAtmosphere.show = true;
viewer.scene.fog.enabled = true;

// Initialize Cesium-Three integration
const integration = new CesiumThreeIntegration(viewer);
integration.init();

// Initialize the application
function init() {
  // Set up initial view to a nice Earth location
  setupInitialView();

  // Add UI to help users navigate
  setupUIControls();
}

// Set up a proper initial view of the terrain
function setupInitialView() {
  // Fly to Grand Canyon (good for showing terrain features)
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(
      -112.8, // longitude (Grand Canyon)
      36.0, // latitude
      25000 // height in meters
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-45), // Look down at terrain
      roll: 0.0,
    },
  });
}

// Add UI controls to help users
function setupUIControls() {
  // Create a button to reset the view
  const resetViewButton = document.createElement("button");
  resetViewButton.textContent = "Reset View";
  resetViewButton.onclick = function () {
    setupInitialView();
  };

  // Add the button to the toolbar
  const toolbar = document.getElementById("toolbar");
  if (toolbar) {
    toolbar.appendChild(resetViewButton);
  }
}

// Start the app when the page is loaded
window.onload = init;
