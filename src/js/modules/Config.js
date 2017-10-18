const Config = {
  Loader: {
    glassOpacity: 0.5,
    lightMapIntensity: 1,
  },
  Player: {
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      x: 0,
      y: Math.PI,
      z: 0,
    },
    height: 2,
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
