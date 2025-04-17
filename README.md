# Wind Turbines Visualization

A 3D visualization of wind turbines overlaid on their real-world coordinates using Cesium.js and Three.js with WebXR support.

## Features

- Interactive 3D globe with real-world terrain
- Accurate positioning of wind turbines based on geographic coordinates
- 3D models of wind turbines with animated rotors
- WebXR support for virtual reality experiences on devices like Oculus Quest 3
- Cross-platform compatibility for desktop, mobile, and VR

## Demo

![Screenshot of the application](screenshots/demo.png)

## Requirements

- Node.js (v14+)
- npm (v6+)
- A Cesium Ion account for access token
- A modern web browser with WebGL and WebXR support (for VR features)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/wind-turbines-visualization.git
cd wind-turbines-visualization
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Cesium Ion access token:

```
CESIUM_ION_TOKEN=your_token_here
```

4. Start the development server:

```bash
npm start
```

5. Open your browser and navigate to `http://localhost:8080`

## Configuration

### Adding Wind Turbine Data

You can modify the wind turbine data in `js/app.js` by updating the `windTurbines` array:

```javascript
const windTurbines = [
  {
    id: 1,
    name: "Turbine 1",
    position: { longitude: -122.4194, latitude: 37.7749, height: 0 },
    height: 120, // meters
    rotorDiameter: 90, // meters
  },
  // Add more turbines as needed
];
```

## WebXR VR Mode

To use the VR features:

1. Use a compatible VR headset (Oculus Quest 3, HTC Vive, etc.)
2. Use a WebXR-compatible browser
3. Click the "Enter VR" button in the application
4. Put on your VR headset to experience the wind turbines in virtual reality

## Development

This project uses:

- [Cesium.js](https://cesium.com/) for globe and geospatial visualization
- [Three.js](https://threejs.org/) for 3D rendering
- WebXR API for virtual reality experiences

## License

MIT

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
