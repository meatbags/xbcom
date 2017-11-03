const Config = {
  Global: {
    fogColour: 0xf9e5e2,
    fogDensity: 0.009, //0.1
    timeDeltaMax: 0.05
  },
  Loader: {
    glassOpacity: 0.5,
    lightMapIntensity: 1,
  },
  Area: {
    collision: {
      min: -125,
      max: 375,
    },
    walk: {
      min: -125,
      max: 375,
    }
  },
  Player: {
    height: 1.9,
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      pitch: 0,
      yaw: Math.PI * 0.29,
      roll: 0,
      maxPitch: Math.PI * 0.25,
      minPitch: Math.PI * -0.25
    },
    speed: {
      normal: 8,
      slowed: 4,
      rotation: Math.PI * 0.75,
      jump: 6,
      fallTimerThreshold: 0.1,
    },
    climb: {
      up: 1,
      down: 0.5,
      minPlaneYAngle: 0.55,
    },
  },
  Ship: {
    position: {
      x: 270,
      y: 32,
      z: 270
    },
    speed: 20,
    rotation: {
      pitch: 0,
      yaw: Math.PI * 0.29,
      roll: 0,
      maxRoll: 0.5,
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
    gravity: 12,
    maxVelocity: 50,
  },
  Adjust: {
    verySlow: 0.01,
    slow: 0.025,
    normal: 0.05,
    fast: 0.09,
    rapid: 0.15,
    veryFast: 0.2,
  }
};

export default Config;
