// This file handles the integration between Cesium and Three.js for WebXR
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.151.0/build/three.module.js";

class CesiumThreeIntegration {
  constructor(cesiumViewer) {
    this.viewer = cesiumViewer;
    this.three = {
      scene: null,
      camera: null,
      renderer: null,
    };
    this.initialized = false;
  }

  init() {
    // Set up Three.js
    const threeContainer = document.createElement("div");
    threeContainer.style.position = "absolute";
    threeContainer.style.top = "0";
    threeContainer.style.left = "0";
    threeContainer.style.width = "100%";
    threeContainer.style.height = "100%";
    threeContainer.style.pointerEvents = "none";
    document.body.appendChild(threeContainer);

    // Initialize THREE components
    this.three.scene = new THREE.Scene();

    // The camera and renderer will be updated based on Cesium's camera
    this.three.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );

    // Configure renderer with WebXR support
    this.three.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.three.renderer.setSize(window.innerWidth, window.innerHeight);
    this.three.renderer.setPixelRatio(window.devicePixelRatio);
    this.three.renderer.xr.enabled = true;
    threeContainer.appendChild(this.three.renderer.domElement);

    // Add some lighting to the THREE scene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.three.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0);
    this.three.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Set up the render loop
    this.viewer.scene.preRender.addEventListener(
      this.onCesiumPreRender.bind(this)
    );

    this.initialized = true;
    return this;
  }

  onWindowResize() {
    if (!this.initialized) return;

    this.three.camera.aspect = window.innerWidth / window.innerHeight;
    this.three.camera.updateProjectionMatrix();
    this.three.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onCesiumPreRender() {
    if (!this.initialized) return;

    // Update THREE camera based on Cesium camera
    const cesiumCamera = this.viewer.camera;

    // Get camera position and direction in world coordinates
    const position = cesiumCamera.position;
    const direction = cesiumCamera.direction;

    // Convert to THREE coordinates
    const threePosition = new THREE.Vector3(position.x, position.y, position.z);
    const threeDirection = new THREE.Vector3(
      direction.x,
      direction.y,
      direction.z
    );

    this.three.camera.position.copy(threePosition);
    this.three.camera.lookAt(threePosition.clone().add(threeDirection));

    // Update projection matrix based on Cesium camera frustum
    this.three.camera.fov = (cesiumCamera.frustum.fovy * 180) / Math.PI;
    this.three.camera.near = cesiumCamera.frustum.near;
    this.three.camera.far = cesiumCamera.frustum.far;
    this.three.camera.updateProjectionMatrix();

    // Render THREE scene
    this.three.renderer.render(this.three.scene, this.three.camera);
  }

  // Method to add a 3D turbine model using Three.js
  addTurbineModel(position, options = {}) {
    if (!this.initialized) this.init();

    const defaults = {
      height: 120,
      rotorDiameter: 90,
      color: 0xffffff,
      rotationSpeed: 0.01,
    };

    const config = { ...defaults, ...options };

    // Create a simple turbine model if no external model is provided
    const turbineGroup = new THREE.Group();

    // Tower
    const towerGeometry = new THREE.CylinderGeometry(2, 4, config.height, 12);
    const towerMaterial = new THREE.MeshStandardMaterial({
      color: config.color,
    });
    const tower = new THREE.Mesh(towerGeometry, towerMaterial);
    tower.position.y = config.height / 2;
    turbineGroup.add(tower);

    // Nacelle
    const nacelleGeometry = new THREE.BoxGeometry(10, 5, 5);
    const nacelleMaterial = new THREE.MeshStandardMaterial({
      color: config.color,
    });
    const nacelle = new THREE.Mesh(nacelleGeometry, nacelleMaterial);
    nacelle.position.y = config.height + 2.5;
    turbineGroup.add(nacelle);

    // Rotor and blades
    const rotorGroup = new THREE.Group();
    rotorGroup.position.y = config.height;
    rotorGroup.position.z = 3;

    // Hub
    const hubGeometry = new THREE.SphereGeometry(2, 16, 16);
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    rotorGroup.add(hub);

    // Blades
    const bladeShape = new THREE.Shape();
    bladeShape.moveTo(0, 0);
    bladeShape.bezierCurveTo(
      1,
      config.rotorDiameter / 6,
      2,
      config.rotorDiameter / 3,
      1,
      config.rotorDiameter / 2
    );
    bladeShape.bezierCurveTo(
      0,
      config.rotorDiameter / 2 + 5,
      -1,
      config.rotorDiameter / 2,
      -1,
      config.rotorDiameter / 2
    );
    bladeShape.bezierCurveTo(
      -2,
      config.rotorDiameter / 3,
      -1,
      config.rotorDiameter / 6,
      0,
      0
    );

    const extrudeSettings = {
      steps: 1,
      depth: 0.5,
      bevelEnabled: false,
    };

    const bladeGeometry = new THREE.ExtrudeGeometry(
      bladeShape,
      extrudeSettings
    );
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(bladeGeometry, bladeMaterial);
      blade.rotation.z = ((Math.PI * 2) / 3) * i;
      rotorGroup.add(blade);
    }

    // Add animation logic
    rotorGroup.userData.rotationSpeed = config.rotationSpeed;
    rotorGroup.userData.animate = function (delta) {
      this.rotation.z += this.userData.rotationSpeed * delta;
    };

    turbineGroup.add(rotorGroup);

    // Position the turbine
    turbineGroup.position.set(position.x, position.y, position.z);

    // Add to THREE scene
    this.three.scene.add(turbineGroup);

    return turbineGroup;
  }

  // Setup WebXR button
  setupVRButton() {
    const vrButton = document.getElementById("vrButton");

    if (vrButton && this.three.renderer) {
      const VRButton = {
        createButton: function (renderer) {
          vrButton.onclick = function () {
            if (renderer.xr.isPresenting) {
              renderer.xr.end();
            } else {
              renderer.xr.setReferenceSpaceType("local-floor");
              renderer.xr.setSession(
                navigator.xr.requestSession("immersive-vr", {
                  requiredFeatures: ["local-floor"],
                })
              );
            }
          };

          return vrButton;
        },
      };

      VRButton.createButton(this.three.renderer);
    }
  }
}

export default CesiumThreeIntegration;
