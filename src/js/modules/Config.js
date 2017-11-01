const Config = {
  Global: {
    fogColour: 0xf9e5e2,
    fogDensity: 0.018,
    timeDeltaMax: 0.05
  },
  Loader: {
    glassOpacity: 0.5,
    lightMapIntensity: 1,
  },
  Area: {
    collision: {
      min: -125,
      max: 125,
    },
    walk: {
      min: 0,
      max: 250,
    }
  },
  Player: {
    height: 2,
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      pitch: 0,
      yaw: 0,
      roll: 0,
      maxPitch: Math.PI * 0.25,
      minPitch: Math.PI * -0.25
    },
    speed: {
      normal: 8,
      slowed: 4,
      rotation: Math.PI * 0.75,
      jump: 6,
    },
    climb: {
      up: 1,
      down: 0.5,
      minPlaneYAngle: 0.5,
    },
  },
  Ship: {
    position: {
      x: 0,
      y: 20,
      z: 0
    },
    speed: 15,
    rotation: {
      pitch: 0,
      yaw: Math.PI * 0.3
    }
  },
  HUD: {
    turnThreshold: 0.4,
    maxYawRotation: Math.PI * 0.3,
  },
  Camera: {
    fov: 58,
    aspect: 1,
    near: 0.1,
    far: 10000,
  },
  Physics: {
    gravity: 10,
    maxVelocity: 50,
  },
  Adjust: {
    slow: 0.025,
    normal: 0.05,
    fast: 0.09,
    veryFast: 0.2,
  }
};

export default Config;
