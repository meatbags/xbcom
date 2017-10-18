var XB =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Scene = __webpack_require__(1);

var _Scene2 = _interopRequireDefault(_Scene);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = {
  init: function init() {
    // three js
    App.renderer = new THREE.WebGLRenderer();
    App.renderer.setSize(960, 540);
    App.renderer.setClearColor(0xf9e5e2, 1);
    document.getElementById('wrapper').appendChild(App.renderer.domElement);

    // scene
    App.scene = new _Scene2.default(App.renderer.domElement);

    // events
    App.bindEvents();

    // wait
    App.loading();
  },

  bindEvents: function bindEvents() {
    window.onresize = App.resize;
    App.resize();
  },

  resize: function resize() {
    App.scene.resize();
  },

  loading: function loading() {
    if (!App.scene.isLoaded()) {
      requestAnimationFrame(App.loading);
    } else {
      App.time = new Date().getTime();
      App.loop();
    }
  },

  loop: function loop() {
    requestAnimationFrame(App.loop);

    var now = new Date().getTime();
    var delta = (now - App.time) / 1000.;
    App.time = now;
    App.scene.update(delta);
    App.renderer.render(App.scene.scene, App.scene.camera);
  }
};

window.onload = App.init;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Player = __webpack_require__(2);

var _Player2 = _interopRequireDefault(_Player);

var _Loader = __webpack_require__(4);

var _Loader2 = _interopRequireDefault(_Loader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Scene = function Scene(domElement) {
  this.domElement = domElement;
  this.init();
};

Scene.prototype = {
  init: function init() {
    var self = this;

    // setup scene
    self.loader = new _Loader2.default('./assets/');
    self.player = new _Player2.default(self.domElement);
    self.camera = self.player.camera;
    self.scene = new THREE.Scene();
    self.scene.add(self.player.object);
    self.collider = new Collider.System();
    self.loadMaps();
    self.loadLighting();
  },

  loadMaps: function loadMaps() {
    // load maps

    var self = this;
    self.toLoad = 2;

    // models (async)
    this.loader.loadOBJ('map').then(function (map) {
      self.scene.add(map);
      self.toLoad -= 1;
    }, function (err) {
      throw err;
    });

    // load collision map (async)
    self.loader.loadOBJ('collision_map').then(function (map) {
      for (var i = 0; i < map.children.length; i += 1) {
        self.collider.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.toLoad -= 1;
    }, function (err) {
      throw err;
    });
  },

  loadLighting: function loadLighting() {
    var self = this;

    self.lights = {
      a1: new THREE.AmbientLight(0xffffff, 0.25),
      p1: new THREE.PointLight(0xffffff, .5, 50, 1)
    };
    self.lights.p1.position.set(0, 20, 0);
    self.scene.add(self.lights.a1, self.lights.p1);
  },

  isLoaded: function isLoaded() {
    return this.toLoad <= 0;
  },

  update: function update(delta) {
    var self = this;

    self.player.update(delta, self.collider);
  },

  resize: function resize() {}
};

exports.default = Scene;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Maths = __webpack_require__(3);

var Maths = _interopRequireWildcard(_Maths);

var _Config = __webpack_require__(5);

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Player = function Player(domElement) {
  this.domElement = domElement;
  this.position = new THREE.Vector3(_Config2.default.Player.position.x, _Config2.default.Player.position.y, _Config2.default.Player.position.z);
  this.rotation = new THREE.Vector3(_Config2.default.Player.rotation.x, _Config2.default.Player.rotation.x, _Config2.default.Player.rotation.z);
  this.movement = new THREE.Vector3(0, 0, 0);
  this.offset = {
    rotation: new THREE.Vector3(0, 0, 0)
  };
  this.target = {
    position: new THREE.Vector3(_Config2.default.Player.position.x, _Config2.default.Player.position.y, _Config2.default.Player.position.z),
    rotation: new THREE.Vector3(_Config2.default.Player.rotation.x, _Config2.default.Player.rotation.x, _Config2.default.Player.rotation.z),
    movement: new THREE.Vector3(0, 0, 0),
    offset: {
      rotation: new THREE.Vector3(0, 0, 0)
    }
  };
  this.falling = false;
  this.config = _Config2.default.Player;
  this.config.physics = _Config2.default.Physics;
  this.config.hud = _Config2.default.HUD;
  this.config.adjust = _Config2.default.Adjust;
  this.camera = new THREE.PerspectiveCamera(_Config2.default.Camera.fov, _Config2.default.Camera.aspect, _Config2.default.Camera.near, _Config2.default.Camera.far);
  this.camera.up = new THREE.Vector3(0, 1, 0);
  this.object = new THREE.Group();
  this.init();
};

Player.prototype = {
  init: function init() {
    this.light = new THREE.PointLight(0xffffff, 0.5, 25, 2);
    this.light.position.set(0, 1, 0);
    this.object.add(this.light);
    this.bindControls();
    this.resizeCamera();
  },

  resizeCamera: function resizeCamera() {
    var w = this.domElement.width;
    var h = this.domElement.height;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  },

  bindControls: function bindControls() {
    var self = this;

    // mouse
    self.domElement.addEventListener('click', function (e) {
      self.handleClick(e);
    });
    self.domElement.addEventListener('mousemove', function (e) {
      self.handleMouseMove(e);
    }, false);
    self.domElement.addEventListener('mousedown', function (e) {
      self.handleMouseDown(e);
    }, false);

    // keyboard
    self.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false
    };
    document.addEventListener("keydown", function (e) {
      self.handleKeyDown(e);
    }, false);
    document.addEventListener("keyup", function (e) {
      self.handleKeyUp(e);
    }, false);
  },

  handleInput: function handleInput(delta) {
    // left/ right keys
    if (this.keys.left || this.keys.right) {
      var dir = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
      this.target.rotation.y += this.config.speed.rotation * delta * dir;
    }

    // up/ down keys
    if (this.keys.up || this.keys.down) {
      var _dir = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
      var yaw = this.rotation.y + this.offset.rotation.y;
      var dx = Math.sin(yaw) * this.config.speed.normal * _dir;
      var dz = Math.cos(yaw) * this.config.speed.normal * _dir;
      this.target.movement.x = dx;
      this.target.movement.z = dz;
    } else {
      this.target.movement.x = 0;
      this.target.movement.z = 0;
    }

    // jump
    if (this.keys.jump) {
      this.keys.jump = false;

      // jump if not falling
      if (this.movement.y == 0) {
        this.movement.y = this.config.speed.jump;
      }
    }

    // set falling
    this.falling = this.movement.y != 0;

    // reduce movement if falling
    if (!this.falling) {
      this.movement.x = this.target.movement.x;
      this.movement.z = this.target.movement.z;
    } else {
      this.movement.x += (this.target.movement.x - this.movement.x) * this.config.adjust.slow;
      this.movement.z += (this.target.movement.z - this.movement.z) * this.config.adjust.slow;
    }
  },

  checkCollisions: function checkCollisions(delta, collider) {
    // check next position for collision
    var next = Maths.addVector(Maths.scaleVector(this.movement, delta), this.target.position);
    var collisions = collider.collisions(next);

    // apply gravity
    this.movement.y = Math.max(this.movement.y - this.config.physics.gravity * delta, -this.config.physics.maxVelocity);

    if (collisions.length > 0) {
      // check for floor
      for (var i = 0; i < collisions.length; i += 1) {
        var ceiling = collisions[i].ceilingPlane(next);

        if (ceiling.y != null && ceiling.plane.normal.y >= this.config.climb.minPlaneYAngle && ceiling.y - this.target.position.y <= this.config.climb.up) {
          // ground
          this.movement.y = 0;

          // ascend
          if (ceiling.y >= next.y) {
            next.y = ceiling.y;
          }
        }
      }

      // check for walls
      collisions = collider.collisions(next);
      var walls = [];

      for (var _i = 0; _i < collisions.length; _i += 1) {
        var _ceiling = collisions[_i].ceilingPlane(next);

        if (_ceiling.y != null && (_ceiling.plane.normal.y < this.config.climb.minPlaneYAngle || _ceiling.y - this.target.position.y > this.config.climb.up)) {
          walls.push(collisions[_i]);
        }
      }

      // if inside a wall, extrude out
      if (walls.length > 0) {
        var extrude = Maths.copyVector(next);

        for (var _i2 = 0; _i2 < walls.length; _i2 += 1) {
          var mesh = walls[_i2];
          extrude = mesh.nearest2DIntersect(this.target.position, next);
        }

        next.x = extrude.x;
        next.z = extrude.z;

        // check extruded point for collisions
        var hits = 0;
        collisions = collider.collisions(next);

        for (var _i3 = 0; _i3 < collisions.length; _i3 += 1) {
          var _ceiling2 = collisions[_i3].ceilingPlane(next);

          if (_ceiling2.y != null && (_ceiling2.plane.normal.y < this.config.climb.minPlaneYAngle || _ceiling2.y - this.target.position.y > this.config.climb.up)) {
            hits += 1;
          }
        }

        // if contact with > 1 walls, stop motion
        if (hits > 1) {
          next.x = this.target.position.x;
          next.z = this.target.position.z;
        }
      }
    } else {
      // check if on downward slope
      var testUnder = Maths.copyVector(next);
      testUnder.y -= this.config.climb.down;

      if (!this.falling && collider.collision(testUnder)) {
        var _ceiling3 = collider.ceilingPlane(testUnder);

        // snap to slope if not too steep
        if (_ceiling3.plane.normal.y >= this.config.climb.minPlaneYAngle) {
          next.y = _ceiling3.y;
          this.movement.y = 0;
        }
      }
    }

    // set new position target
    this.target.position.x = next.x;
    this.target.position.y = next.y;
    this.target.position.z = next.z;
  },

  move: function move() {
    // move
    this.position.x += (this.target.position.x - this.position.x) * this.config.adjust.veryFast;
    this.position.y += (this.target.position.y - this.position.y) * this.config.adjust.veryFast;
    this.position.z += (this.target.position.z - this.position.z) * this.config.adjust.veryFast;

    // rotate
    this.rotation.y += Maths.minAngleDifference(this.rotation.y, this.target.rotation.y) * this.config.adjust.fast;
    this.offset.rotation.x += (this.target.offset.rotation.x - this.offset.rotation.x) * this.config.adjust.normal;
    this.offset.rotation.y += (this.target.offset.rotation.y - this.offset.rotation.y) * this.config.adjust.normal;
    this.rotation.y += this.rotation.y < 0 ? Maths.twoPi : this.rotation.y > Maths.twoPi ? -Maths.twoPi : 0;

    // set camera
    var yaw = this.rotation.y + this.offset.rotation.y;
    var pitch = this.rotation.x + this.offset.rotation.x;
    var height = this.position.y + this.config.height;

    this.camera.position.set(this.position.x, height, this.position.z);
    this.camera.lookAt(new THREE.Vector3(this.position.x + Math.sin(yaw), height + Math.sin(pitch), this.position.z + Math.cos(yaw)));

    // set world object
    this.object.position.set(this.position.x, this.position.y, this.position.z);
  },

  update: function update(delta, collider) {
    // handle key presses and move player

    this.handleInput(delta);
    this.checkCollisions(delta, collider);
    this.move();
  },

  handleClick: function handleClick(e) {
    // on click
  },
  handleKeyDown: function handleKeyDown(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        this.keys.up = true;
        break;
      case 37:
      case 65:
        this.keys.left = true;
        break;
      case 40:
      case 83:
        this.keys.down = true;
        break;
      case 39:
      case 68:
        this.keys.right = true;
        break;
      case 32:
        this.keys.jump = true;
        break;
      default:
        break;
    }
  },
  handleKeyUp: function handleKeyUp(e) {
    switch (e.keyCode) {
      case 38:
      case 87:
        this.keys.up = false;
        break;
      case 37:
      case 65:
        this.keys.left = false;
        break;
      case 40:
      case 83:
        this.keys.down = false;
        break;
      case 39:
      case 68:
        this.keys.right = false;
        break;
    }
  },
  handleMouseDown: function handleMouseDown(e) {
    var bound = this.domElement.getBoundingClientRect();
    var w = this.domElement.width;
    var x = (e.clientX - bound.left) / w;
    var t = this.config.hud.turnThreshold;

    // adjust camera
    if (x < t) {
      this.target.rotation.y = this.rotation.y + (t - x) / t * this.config.hud.maxYawRotation;
    } else if (x > 1 - t) {
      this.target.rotation.y = this.rotation.y + (x - (1 - t)) / t * -this.config.hud.maxYawRotation;
    } else {
      this.target.rotation.y = this.rotation.y;
    }
  },
  handleMouseMove: function handleMouseMove(e) {
    var bound = this.domElement.getBoundingClientRect();
    var w = this.domElement.width;
    var h = this.domElement.height;
    var x = (e.clientX - bound.left) / w;
    var y = (e.clientY - bound.top) / h;
    var t = this.config.hud.turnThreshold;

    // adjust camera
    if (x < t) {
      this.target.offset.rotation.y = (t - x) / t * this.config.hud.maxYawRotation;
    } else if (x > 1 - t) {
      this.target.offset.rotation.y = (x - (1 - t)) / t * -this.config.hud.maxYawRotation;
    } else {
      this.target.offset.rotation.y = 0;
    }

    if (y < t) {
      this.target.offset.rotation.x = (t - y) / t * this.config.hud.maxYawRotation;
    } else if (y > 1 - t) {
      this.target.offset.rotation.x = (y - (1 - t)) / t * -this.config.hud.maxYawRotation;
    } else {
      this.target.offset.rotation.x = 0;
    }
  }
};

exports.default = Player;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var twoPi = Math.PI * 2;

var copyVector = function copyVector(vec) {
  var copied = new THREE.Vector3(vec.x, vec.y, vec.z);

  return copied;
};

var addVector = function addVector(a, b) {
  var c = new THREE.Vector3(a.x + b.x, a.y + b.y, a.z + b.z);

  return c;
};

var subtractVector = function subtractVector(a, b) {
  var c = new THREE.Vector3(a.x - b.x, a.y - b.y, a.z - b.z);

  return c;
};

var normalise = function normalise(a) {
  var mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);

  if (mag == 0) {
    return a;
  }

  var normal = new THREE.Vector3(a.x / mag, a.y / mag, a.z / mag);

  return normal;
};

var reverseVector = function reverseVector(a) {
  a.x *= -1;
  a.y *= -1;
  a.z *= -1;

  return a;
};

var distanceBetween = function distanceBetween(a, b) {
  var d = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2) + Math.pow(b.z - a.z, 2));

  return d;
};

var distanceBetween2D = function distanceBetween2D(a, b) {
  var dist = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.z - a.z, 2));

  return dist;
};

var pitchBetween = function pitchBetween(a, b) {
  var xz = distanceBetween2D(a, b);
  var y = b.y - a.y;
  var pitch = Math.atan2(y, xz);

  return pitch;
};

var scaleVector = function scaleVector(v, scale) {
  var vec = new THREE.Vector3(v.x * scale, v.y * scale, v.z * scale);

  return vec;
};

var isVectorEqual = function isVectorEqual(a, b) {
  return a.x === b.x && a.y === b.y & a.z === b.z;
};

var crossProduct = function crossProduct(a, b) {
  var c = new THREE.Vector3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);

  return c;
};

var minAngleDifference = function minAngleDifference(a1, a2) {
  var angle = Math.atan2(Math.sin(a2 - a1), Math.cos(a2 - a1));

  return angle;
};

var dotProduct = function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

exports.copyVector = copyVector;
exports.isVectorEqual = isVectorEqual;
exports.pitchBetween = pitchBetween;
exports.twoPi = twoPi;
exports.distanceBetween = distanceBetween;
exports.distanceBetween2D = distanceBetween2D;
exports.minAngleDifference = minAngleDifference;
exports.dotProduct = dotProduct;
exports.addVector = addVector;
exports.subtractVector = subtractVector;
exports.scaleVector = scaleVector;
exports.crossProduct = crossProduct;
exports.reverseVector = reverseVector;
exports.normalise = normalise;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Config = __webpack_require__(5);

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Loader = function Loader(basePath) {
  this.basePath = basePath;
  this.init();
};

Loader.prototype = {
  init: function init() {
    this.materialLoader = new THREE.MTLLoader();
    this.objectLoader = new THREE.OBJLoader();
    this.materialLoader.setPath(this.basePath);
    this.objectLoader.setPath(this.basePath);
  },

  process: function process(obj, materials) {
    // fix materials

    for (var i = 0; i < obj.children.length; i += 1) {
      var child = obj.children[i];
      var meta = materials.materialsInfo[child.material.name];

      // set material
      child.material = materials.materials[child.material.name];

      // load lightmaps
      if (meta.map_ka) {
        var uvs = child.geometry.attributes.uv.array;
        var src = meta.map_ka;
        var tex = new THREE.TextureLoader().load(self.basePath + src);

        child.material.lightMap = tex;
        child.material.lightMapIntensity = _Config2.default.Loader.lightMapIntensity;
        child.geometry.addAttribute('uv2', new THREE.BufferAttribute(uvs, 2));
      }

      // make glass translucent
      if (child.material.map) {
        // if textured, set full colour
        child.material.color = new THREE.Color(0xffffff);

        // set transparent for .png
        if (child.material.map.image.src.indexOf('.png') !== -1) {
          child.material.transparent = true;
          child.material.side = THREE.DoubleSide;
        }

        // for glass
        if (child.material.map.image.src.indexOf('glass') != -1) {
          child.material.transparent = true;
          child.material.opacity = _Config2.default.Loader.glassOpacity;
        }
      } else {
        // no texture, set colour
        //child.material.emissive = child.material.color;
      }
    }
  },

  loadOBJ: function loadOBJ(filename) {
    var self = this;

    return new Promise(function (resolve, reject) {
      try {
        self.materialLoader.load(filename + '.mtl', function (materials) {
          materials.preload();
          //self.objectLoader.setMaterials(materials);
          self.objectLoader.load(filename + '.obj', function (obj) {
            self.process(obj, materials);
            resolve(obj);
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }
};

exports.default = Loader;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Config = {
  Loader: {
    glassOpacity: 0.5,
    lightMapIntensity: 1
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
      z: 0
    },
    height: 2,
    speed: {
      normal: 8,
      slowed: 4,
      rotation: Math.PI * 0.75,
      jump: 6
    },
    climb: {
      up: 1,
      down: 0.5,
      minPlaneYAngle: 0.5
    }
  },
  HUD: {
    turnThreshold: 0.4,
    maxYawRotation: Math.PI * 0.3
  },
  Camera: {
    fov: 58,
    aspect: 1,
    near: 0.1,
    far: 10000
  },
  Physics: {
    gravity: 10,
    maxVelocity: 50
  },
  Adjust: {
    slow: 0.025,
    normal: 0.05,
    fast: 0.09,
    veryFast: 0.2
  }
};

exports.default = Config;

/***/ })
/******/ ]);