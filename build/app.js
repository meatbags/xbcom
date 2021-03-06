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
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Config = {
  Global: {
    fogColour: 0xf9e5e2,
    fogDensity: 0.009, //0.1
    timeDeltaMax: 0.05
  },
  Loader: {
    glassOpacity: 0.5,
    lightMapIntensity: 1
  },
  Area: {
    collision: {
      min: -125,
      max: 375
    },
    walk: {
      min: -125,
      max: 375
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
      normal: 9,
      slowed: 5,
      rotation: Math.PI * 0.75,
      jump: 13,
      fallTimerThreshold: 0.1
    },
    climb: {
      up: 1,
      down: 0.5,
      minPlaneYAngle: 0.55
    }
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
      maxRoll: 0.5
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
    gravity: 12,
    maxVelocity: 50
  },
  Adjust: {
    verySlow: 0.01,
    slow: 0.025,
    normal: 0.05,
    fast: 0.09,
    rapid: 0.12,
    veryFast: 0.2
  }
};

exports.default = Config;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var twoPi = Math.PI * 2;
var halfPi = Math.PI / 2;

var wrap = function wrap(value, min, max) {
  if (value < min) {
    value += max - min;
  } else if (value > max) {
    value -= max - min;
  }

  return value;
};

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

var yawBetween = function yawBetween(a, b) {
  var yaw = Math.atan2(b.x - a.x, b.z - a.z);

  return yaw;
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

exports.wrap = wrap;
exports.copyVector = copyVector;
exports.isVectorEqual = isVectorEqual;
exports.yawBetween = yawBetween;
exports.pitchBetween = pitchBetween;
exports.halfPi = halfPi;
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
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Scene = __webpack_require__(3);

var _Scene2 = _interopRequireDefault(_Scene);

var _Config = __webpack_require__(0);

var _Config2 = _interopRequireDefault(_Config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = {
  init: function init() {
    // three js
    App.renderer = new THREE.WebGLRenderer({ antialias: false });
    App.renderer.setClearColor(_Config2.default.Global.fogColour, 1);
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
    var w = window.innerWidth;
    var h = window.innerHeight;

    App.renderer.setSize(w, h);
    App.renderer.domElement.width = w;
    App.renderer.domElement.height = h;
    App.scene.resize();
  },

  loading: function loading() {
    if (!App.scene.isLoaded()) {
      requestAnimationFrame(App.loading);
    } else {
      App.removeLoadingScreen();
      App.hud();
      App.time = new Date().getTime();
      App.loop();
    }
  },

  showControls: function showControls() {
    if (App.scene.player.ship.active) {
      $('.hud__inner').removeClass('hidden');
    }
    $('.hud__button').removeClass('hidden');
  },

  hideControls: function hideControls() {
    if (!$('.hud__inner').hasClass('hidden')) {
      $('.hud__inner').addClass('hidden');
    }
    if (!$('.hud__button').hasClass('hidden')) {
      $('.hud__button').addClass('hidden');
    }
  },

  openMenu: function openMenu($menu) {
    App.closeMenu($('.hud-menu.active'));
    $menu.addClass('active');
    $menu.children('.hud-menu__row').each(function (i, e) {
      var $e = $(e);
      setTimeout(function () {
        $e.addClass('active');
      }, i * 100);
    });
  },

  closeMenu: function closeMenu($menu) {
    $menu.removeClass('active');
    $menu.children('.hud-menu__row').each(function (i, e) {
      var $e = $(e);
      setTimeout(function () {
        $e.removeClass('active');
      }, i * 100);
    });
  },

  toggleMenu: function toggleMenu($menu) {
    if ($menu.hasClass('active')) {
      App.closeMenu($menu);
    } else {
      App.openMenu($menu);
    }
  },

  hud: function hud() {
    App.navActive = true; // TODO: hide

    // nav
    $('.nav-projects').on('click', function () {
      App.aboutOpened = true;
      App.toggleMenu($('#menu-projects'));
    });
    $('.nav-about').on('click', function () {
      App.aboutOpened = true;
      App.toggleMenu($('#menu-about'));
    });
    $('.nav-explore').on('click', function () {
      App.exploreOpened = true;
      App.aboutOpened = true;
      var $menu = $('#menu-explore');
      if (App.scene.player.ship.active) {
        App.scene.player.ship.land();
        if (!$menu.hasClass('active')) {
          App.openMenu($menu);
        }
      } else {
        App.scene.player.ship.takeOff();
        if ($menu.hasClass('active')) {
          App.closeMenu($menu);
        }
      }
    });

    // menu close buttons
    $('.menu-close').on('click', function () {
      App.toggleMenu($(this).closest('.hud-menu'));
      App.showControls();
    });

    // landing button
    /*
    $('#hud-button').on('click', function(){
      if ($(this).hasClass('active')) {
        // take off
        App.scene.player.ship.takeOff();
          if (App.scene.player.ship.active) {
          // update HUD
            $(this).removeClass('active');
          $(this).removeClass('text-large');
          $(this).addClass('text-huge');
          $(this).find('.hud__button__inner').html('&darr;');
          $('.hud__inner').removeClass('hidden');
        }
      } else {
        // land ship
        App.scene.player.ship.land();
          if (!App.scene.player.ship.active) {
          // update HUD
            $('.hud__inner').removeClass('active-left');
          $('.hud__inner').removeClass('active-right');
          $('.hud__inner__grid').removeClass('active');
          $(this).removeClass('text-huge');
          $(this).addClass('text-large');
          $(this).addClass('active');
          $(this).find('.hud__button__inner').html('&uarr;');
          $('.hud__inner').addClass('hidden');
            // notify
          if (!App.notified) {
            setTimeout(function(){
              if (!App.notified) {
                $('.nav-controls').click();
              }
            }, 2000);
          }
        }
      }
    });
      // spaceship controls (left/ right)
    $('#hud-right').on('click', function() {
      $('.hud__inner').removeClass('active-left');
      $('.hud__inner').toggleClass('active-right');
      $('.hud__inner__grid').removeClass('active');
      if ($('.hud__inner').hasClass('active-right')) {
        $(this).addClass('active');
        App.scene.player.ship.setBank(-0.25);
      } else {
        App.scene.player.ship.setBank(0);
      }
    });
      $('#hud-left').on('click', function() {
      $('.hud__inner').removeClass('active-right');
      $('.hud__inner').toggleClass('active-left');
      $('.hud__inner__grid').removeClass('active');
      if ($('.hud__inner').hasClass('active-left')) {
        $(this).addClass('active');
        App.scene.player.ship.setBank(0.25);
      } else {
        App.scene.player.ship.setBank(0);
      }
    });
      // show HUD
    setTimeout(function() {
      App.showControls();
      App.navActive = true;
    }, 3000);
    */

    setTimeout(function () {
      if (!App.aboutOpened) {
        App.aboutOpened = true;
        App.toggleMenu($('#menu-about'));
      }
    }, 3000);
  },

  removeLoadingScreen: function removeLoadingScreen() {
    $('.loading-screen__inner').fadeOut(1000);
    $('.loading-screen').fadeOut(3000);
  },

  loop: function loop() {
    requestAnimationFrame(App.loop);

    var now = new Date().getTime();
    var delta = (now - App.time) / 1000.;
    App.time = now;
    App.scene.update(delta > _Config2.default.Global.timeDeltaMax ? _Config2.default.Global.timeDeltaMax : delta);
    App.renderer.render(App.scene.scene, App.scene.camera);
  }
};

window.onload = App.init;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Player = __webpack_require__(4);

var _Player2 = _interopRequireDefault(_Player);

var _Loader = __webpack_require__(7);

var _Loader2 = _interopRequireDefault(_Loader);

var _Config = __webpack_require__(0);

var _Config2 = _interopRequireDefault(_Config);

var _Bird = __webpack_require__(8);

var _Bird2 = _interopRequireDefault(_Bird);

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
    self.collider = {
      objects: new Collider.System(),
      ground: new Collider.System()
    };

    // load stuff
    self.loadMaps();
    self.loadExtras();
    self.loadLighting();
  },

  resize: function resize() {
    this.player.resizeCamera();
  },

  loadMaps: function loadMaps() {
    // load maps

    var self = this;
    self.toLoad = 3;

    // models async
    this.loader.loadOBJ('map').then(function (map) {
      var map2 = map.clone();
      var map3 = map.clone();
      var map4 = map.clone();
      var map5 = map.clone();
      var map6 = map.clone();
      var map7 = map.clone();
      var map8 = map.clone();
      var map9 = map.clone();
      var offset = _Config2.default.Area.walk.max - _Config2.default.Area.walk.min;

      map2.position.set(0, 0, offset);
      map3.position.set(0, 0, -offset);
      map4.position.set(offset, 0, 0);
      map5.position.set(-offset, 0, 0);
      map6.position.set(offset, 0, offset);
      map7.position.set(offset, 0, -offset);
      map8.position.set(-offset, 0, offset);
      map9.position.set(-offset, 0, -offset);

      self.scene.add(map, map2, map3, map4, map5, map6, map7, map8, map9);
      self.toLoad -= 1;
    }, function (err) {
      throw err;
    });

    // load ground collision map (async)
    self.loader.loadOBJ('collision_map_ground').then(function (map) {
      for (var i = 0; i < map.children.length; i += 1) {
        self.collider.ground.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.toLoad -= 1;
    }, function (err) {
      throw err;
    });

    // load ground collision map async
    self.loader.loadOBJ('collision_map_objects').then(function (map) {
      for (var i = 0; i < map.children.length; i += 1) {
        self.collider.objects.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.toLoad -= 1;
    }, function (err) {
      throw err;
    });
  },

  loadExtras: function loadExtras() {
    var self = this;
    self.birds = [];

    for (var i = 0; i < 20; i += 1) {
      var bird = new _Bird2.default();

      self.birds.push(bird);
      self.scene.add(bird.object);
    }
  },

  loadLighting: function loadLighting() {
    var self = this;

    // lighting
    self.lights = {
      a1: new THREE.AmbientLight(0xffffff, 0.25),
      d1: new THREE.DirectionalLight(0xffffff, 0.5)
      //p1: new THREE.PointLight(0xffffff, .5, 50, 1)
    };
    //self.lights.p1.position.set(0, 20, 0);
    self.scene.add(self.lights.a1, self.lights.d1
    //self.lights.p1
    );

    // fog
    self.scene.fog = new THREE.FogExp2(_Config2.default.Global.fogColour, _Config2.default.Global.fogDensity);
  },

  isLoaded: function isLoaded() {
    return this.toLoad <= 0;
  },

  update: function update(delta) {
    var self = this;

    self.player.update(delta, self.collider.ground, self.collider.objects);

    for (var i = 0; i < self.birds.length; i += 1) {
      self.birds[i].update(delta, self.player.position);
    }
  }
};

exports.default = Scene;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Maths = __webpack_require__(1);

var Maths = _interopRequireWildcard(_Maths);

var _Ship = __webpack_require__(5);

var _Ship2 = _interopRequireDefault(_Ship);

var _Config = __webpack_require__(0);

var _Config2 = _interopRequireDefault(_Config);

var _Logger = __webpack_require__(6);

var _Logger2 = _interopRequireDefault(_Logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Player = function Player(domElement) {
  this.domElement = domElement;
  this.position = new THREE.Vector3(_Config2.default.Player.position.x, _Config2.default.Player.position.y, _Config2.default.Player.position.z);
  this.rotation = {
    pitch: _Config2.default.Player.rotation.pitch,
    yaw: _Config2.default.Player.rotation.yaw,
    roll: _Config2.default.Player.rotation.roll
  };
  this.previous = {
    position: new THREE.Vector3(_Config2.default.Player.position.x, _Config2.default.Player.position.y, _Config2.default.Player.position.z)
  };
  this.movement = new THREE.Vector3(0, 0, 0);
  this.offset = {
    rotation: {
      pitch: 0,
      yaw: 0
    }
  };
  this.target = {
    position: new THREE.Vector3(_Config2.default.Player.position.x, _Config2.default.Player.position.y, _Config2.default.Player.position.z),
    rotation: {
      pitch: _Config2.default.Player.rotation.pitch,
      yaw: _Config2.default.Player.rotation.yaw,
      roll: _Config2.default.Player.rotation.roll
    },
    movement: new THREE.Vector3(0, 0, 0),
    offset: {
      rotation: {
        pitch: 0,
        yaw: 0,
        roll: 0
      }
    }
  };
  this.falling = false;
  this.fallTimer = 0;
  this.config = _Config2.default.Player;
  this.config.physics = _Config2.default.Physics;
  this.config.hud = _Config2.default.HUD;
  this.config.adjust = _Config2.default.Adjust;
  this.config.area = _Config2.default.Area;
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
    this.ship = new _Ship2.default();
    this.bindControls();
    this.resizeCamera();
    // this.logger = new Logger();
  },

  update: function update(delta, ground, objects) {
    // update controls & move ship
    this.handleInput(delta);
    this.ship.update(delta, this);

    if (!this.ship.active) {
      // handle key presses and move player
      this.target.rotation.roll = 0;
      this.checkCollisions(delta, ground, objects);
    } else {
      // lock to ship
      this.movement.y = 0;
      this.ship.target.rotation.yaw = this.target.rotation.yaw;
      //this.target.rotation.yaw = this.ship.rotation.yaw;
      //this.target.rotation.pitch = this.ship.rotation.pitch;
      this.target.rotation.roll = this.ship.rotation.roll;
      this.target.position.set(this.ship.position.x, this.ship.position.y, this.ship.position.z);
      this.position.set(this.ship.position.x, this.ship.position.y, this.ship.position.z);
    }

    //this.logger.print(this.ship.rotation.roll);

    this.move();
  },

  handleInput: function handleInput(delta) {
    // left/ right keys
    if (this.keys.left || this.keys.right) {
      var dir = (this.keys.left ? 1 : 0) + (this.keys.right ? -1 : 0);
      this.target.rotation.yaw += this.config.speed.rotation * delta * dir;
    }

    // up/ down keys
    if (this.keys.up || this.keys.down) {
      var _dir = (this.keys.up ? 1 : 0) + (this.keys.down ? -1 : 0);
      var yaw = this.rotation.yaw + this.offset.rotation.yaw;
      var dx = Math.sin(yaw) * this.config.speed.normal * _dir;
      var dz = Math.cos(yaw) * this.config.speed.normal * _dir;
      this.target.movement.x = dx;
      this.target.movement.z = dz;
    } else {
      this.target.movement.x = 0;
      this.target.movement.z = 0;
    }

    // jump
    if (!this.jumped) {
      this.jumped = 0;
    }

    if (this.keys.jump) {
      this.keys.jump = false;
      this.jumped += 1;

      // jump if not falling
      if (this.movement.y == 0 || this.fallTimer < this.config.speed.fallTimerThreshold) {
        this.movement.y = this.config.speed.jump;
      }
    }

    // set falling
    this.falling = this.movement.y != 0;

    if (this.falling) {
      this.fallTimer += delta;
    } else {
      this.fallTimer = 0;
    }

    // reduce movement if falling
    if (!this.falling) {
      this.movement.x = this.target.movement.x;
      this.movement.z = this.target.movement.z;
    } else {
      this.movement.x += (this.target.movement.x - this.movement.x) * this.config.adjust.slow;
      this.movement.z += (this.target.movement.z - this.movement.z) * this.config.adjust.slow;
    }
  },

  checkCollisions: function checkCollisions(delta, ground, objects) {
    // check next position for collision
    var next = Maths.addVector(Maths.scaleVector(this.movement, delta), this.target.position);

    // wrap collisions inside collision area
    var wrapx = Maths.wrap(next.x, this.config.area.collision.min, this.config.area.collision.max) - next.x;
    var wrapz = Maths.wrap(next.z, this.config.area.collision.min, this.config.area.collision.max) - next.z;
    next.x += wrapx;
    next.z += wrapz;

    // get collision map
    var collisions = objects.collisions(next);

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
      collisions = objects.collisions(next);
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
        collisions = objects.collisions(next);

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
    } else if (this.movement.y < 0) {
      // check if on downward slope
      var testUnder = Maths.copyVector(next);
      testUnder.y -= this.config.climb.down;

      // check ground
      if (!this.falling && ground.collision(testUnder)) {
        var _ceiling3 = ground.ceilingPlane(testUnder);

        // snap to slope if not too steep
        if (_ceiling3.plane.normal.y >= this.config.climb.minPlaneYAngle) {
          next.y = _ceiling3.y;
          this.movement.y = 0;
        }
      }

      // check objects
      if (this.movement.y != 0 && objects.collision(testUnder)) {
        var _ceiling4 = objects.ceilingPlane(testUnder);

        // snap to slope if not too steep
        if (_ceiling4.plane.normal.y >= this.config.climb.minPlaneYAngle) {
          next.y = _ceiling4.y;
          this.movement.y = 0;
        }
      }
    }

    // catch on floor
    if (this.movement.y != 0) {
      var absFloor = ground.ceiling(new THREE.Vector3(next.x, 0, next.z));

      // limit
      if (absFloor != null && next.y <= absFloor) {
        next.y = absFloor;
        this.movement.y = 0;
      } else if (next.y <= 0) {
        next.y = 0;
        this.movement.y = 0;
      }
    }

    // unwrap
    next.x -= wrapx;
    next.z -= wrapz;

    // set new target position
    this.target.position.x = next.x;
    this.target.position.y = next.y;
    this.target.position.z = next.z;
  },

  move: function move() {
    // store previous
    this.previous.position.x = this.target.position.x;
    this.previous.position.y = this.target.position.y;
    this.previous.position.z = this.target.position.z;

    // wrap inside play area
    this.wrapped = false;
    var wrapx = Maths.wrap(this.target.position.x, this.config.area.walk.min, this.config.area.walk.max);
    var wrapz = Maths.wrap(this.target.position.z, this.config.area.walk.min, this.config.area.walk.max);
    this.wrapped = wrapx != this.target.position.x || wrapz != this.target.position.z;

    if (this.wrapped) {
      this.position.x = wrapx + (this.position.x - this.target.position.x);
      this.position.z = wrapz + (this.position.z - this.target.position.z);
      this.target.position.x = wrapx;
      this.target.position.z = wrapz;
    }

    // move
    this.position.x += (this.target.position.x - this.position.x) * this.config.adjust.veryFast;
    this.position.y += (this.target.position.y - this.position.y) * this.config.adjust.rapid;
    this.position.z += (this.target.position.z - this.position.z) * this.config.adjust.veryFast;

    // rotate
    this.rotation.yaw += Maths.minAngleDifference(this.rotation.yaw, this.target.rotation.yaw) * this.config.adjust.fast;
    this.offset.rotation.yaw += (this.target.offset.rotation.yaw - this.offset.rotation.yaw) * this.config.adjust.normal;
    this.rotation.yaw += this.rotation.yaw < 0 ? Maths.twoPi : this.rotation.yaw > Maths.twoPi ? -Maths.twoPi : 0;
    this.rotation.pitch += (this.target.rotation.pitch - this.rotation.pitch) * this.config.adjust.normal;
    this.offset.rotation.pitch += (this.target.offset.rotation.pitch - this.offset.rotation.pitch) * this.config.adjust.normal;
    this.rotation.roll += (this.target.rotation.roll - this.rotation.roll) * this.config.adjust.fast;

    // set camera
    var pitch = this.rotation.pitch + this.offset.rotation.pitch;
    var yaw = this.rotation.yaw + this.offset.rotation.yaw;
    var height = this.position.y + this.config.height;

    // set up (roll)
    this.camera.up.z = -Math.sin(this.rotation.yaw) * this.rotation.roll;
    this.camera.up.x = Math.cos(this.rotation.yaw) * this.rotation.roll;

    // set position
    this.camera.position.set(this.position.x, height, this.position.z);

    // look
    this.camera.lookAt(new THREE.Vector3(this.position.x + Math.sin(yaw), height + Math.sin(pitch), this.position.z + Math.cos(yaw)));

    // set world object
    this.object.position.set(this.position.x, this.position.y, this.position.z);
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
      default:
        break;
    }
  },
  handleMouseDown: function handleMouseDown(e) {
    if (!this.mouse.locked) {
      var self = this;
      var bound = this.domElement.getBoundingClientRect();

      this.mouse.active = true;
      this.mouse.rotation.pitch = this.rotation.pitch;
      this.mouse.rotation.yaw = this.rotation.yaw;
      this.mouse.start.x = e.clientX / this.domElement.width * 2 - 1;
      this.mouse.start.y = (e.clientY - bound.y) / this.domElement.height * 2 - 1;
    }
  },
  handleMouseMove: function handleMouseMove(e) {
    if (this.mouse.active && !((this.keys.left || this.keys.right) && !this.ship.active)) {
      var bound = this.domElement.getBoundingClientRect();

      this.mouse.x = e.clientX / this.domElement.width * 2 - 1;
      this.mouse.y = (e.clientY - bound.y) / this.domElement.height * 2 - 1;
      this.mouse.delta.x = this.mouse.x - this.mouse.start.x;
      this.mouse.delta.y = this.mouse.y - this.mouse.start.y;

      // target rotation yaw
      this.target.rotation.yaw = this.mouse.rotation.yaw + this.mouse.delta.x;

      // target rotation pitch
      var pitch = this.mouse.rotation.pitch + this.mouse.delta.y;

      // if limit reached, reset start point
      if (pitch > this.config.rotation.maxPitch || pitch < this.config.rotation.minPitch) {
        pitch = Math.max(this.config.rotation.minPitch, Math.min(this.config.rotation.maxPitch, pitch));
        this.mouse.start.y = this.mouse.y;
        this.mouse.rotation.pitch = pitch;
      }

      this.target.rotation.pitch = pitch;
    }
  },
  handleMouseUp: function handleMouseUp(e) {
    this.mouse.active = false;
  },


  resizeCamera: function resizeCamera() {
    var w = this.domElement.width;
    var h = this.domElement.height;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  },

  bindControls: function bindControls() {
    var self = this;

    // keys
    self.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      jump: false
    };
    self.mouse = {
      x: 0,
      y: 0,
      start: {
        x: 0,
        y: 0
      },
      delta: {
        x: 0,
        y: 0
      },
      rotation: {
        pitch: 0,
        yaw: 0
      },
      locked: false,
      active: false
    };

    // mouse
    self.domElement.addEventListener('click', function (e) {
      //  console.log(self)
    }, false);
    self.domElement.addEventListener('mousedown', function (e) {
      self.handleMouseDown(e);
    }, false);
    self.domElement.addEventListener('mousemove', function (e) {
      self.handleMouseMove(e);
    }, false);
    self.domElement.addEventListener('mouseup', function (e) {
      self.handleMouseUp(e);
    }, false);
    self.domElement.addEventListener('mouseleave', function (e) {
      self.handleMouseUp(e);
    }, false);

    // keyboard
    document.addEventListener('keydown', function (e) {
      self.handleKeyDown(e);
    }, false);
    document.addEventListener('keyup', function (e) {
      self.handleKeyUp(e);
    }, false);
  }
};

exports.default = Player;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Config = __webpack_require__(0);

var _Config2 = _interopRequireDefault(_Config);

var _Maths = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Ship = function Ship() {
  this.active = true;
  this.position = new THREE.Vector3(_Config2.default.Ship.position.x, _Config2.default.Ship.position.y, _Config2.default.Ship.position.z);
  this.rotation = {
    pitch: _Config2.default.Ship.rotation.pitch,
    yaw: _Config2.default.Ship.rotation.yaw,
    roll: _Config2.default.Ship.rotation.roll
  };
  this.target = {
    position: new THREE.Vector3(_Config2.default.Ship.position.x, _Config2.default.Ship.position.y, _Config2.default.Ship.position.z),
    rotation: {
      pitch: _Config2.default.Ship.rotation.pitch,
      yaw: _Config2.default.Ship.rotation.yaw,
      roll: _Config2.default.Ship.rotation.roll
    },
    bank: 0,
    speed: _Config2.default.Ship.speed
  };
  this.bank = 0;
  this.speed = _Config2.default.Ship.speed;
  this.config = _Config2.default.Ship;
  this.config.area = _Config2.default.Area;
  this.config.adjust = _Config2.default.Adjust;
};

Ship.prototype = {
  update: function update(delta, player) {
    if (this.active) {
      // bank
      //this.bank += (this.target.bank - this.bank) * this.config.adjust.normal;
      //this.target.rotation.yaw += this.bank * delta;

      // accelerate
      this.speed += (this.target.speed - this.speed) * this.config.adjust.slow;

      // rotate
      var deltaYaw = this.config.adjust.slow * (0, _Maths.minAngleDifference)(this.rotation.yaw, this.target.rotation.yaw);
      this.rotation.yaw += deltaYaw;

      // set roll
      //this.target.rotation.roll = Math.min(.5, Math.max(-.5, deltaYaw * 100));
      //this.rotation.roll += (this.target.rotation.roll - this.rotation.roll) * this.config.adjust.fast;

      // move target
      this.target.position.x += this.speed * Math.sin(this.rotation.yaw) * delta;
      this.target.position.z += this.speed * Math.cos(this.rotation.yaw) * delta;

      // wrap
      var wrapx = (0, _Maths.wrap)(this.target.position.x, this.config.area.walk.min, this.config.area.walk.max);
      var wrapz = (0, _Maths.wrap)(this.target.position.z, this.config.area.walk.min, this.config.area.walk.max);
      this.position.x = wrapx + (this.position.x - this.target.position.x);
      this.position.z = wrapz + (this.position.z - this.target.position.z);
      this.target.position.x = wrapx;
      this.target.position.z = wrapz;

      // move
      this.position.x += (this.target.position.x - this.position.x) * this.config.adjust.veryFast;
      this.position.y += (this.target.position.y - this.position.y) * this.config.adjust.verySlow;
      this.position.z += (this.target.position.z - this.position.z) * this.config.adjust.veryFast;
    } else {
      // inactive, set to player
      this.target.position.x = this.position.x = player.position.x;
      this.target.position.y = this.position.y = player.position.y;
      this.target.position.z = this.position.z = player.position.z;
      this.target.rotation.yaw = this.rotation.yaw = player.rotation.yaw;
    }
  },

  takeOff: function takeOff() {
    this.active = true;
    this.target.speed = _Config2.default.Ship.speed;
    this.target.position.y = _Config2.default.Ship.position.y;
  },

  land: function land() {
    this.active = false;
    this.target.speed = this.speed = 0;
    this.setBank(0);
    this.rotation.roll = this.target.rotation.roll;
  },

  setBank: function setBank(value) {
    // this.target.bank = value;
    // this.target.rotation.roll = (value == 0) ? 0 : ((value > 0) ? this.config.rotation.maxRoll : -this.config.rotation.maxRoll);
  },

  toggle: function toggle() {
    this.active = this.active == false;
  }
};

exports.default = Ship;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var Logger = function Logger() {
  this.cvs = document.createElement('canvas');
  this.ctx = this.cvs.getContext('2d');
  this.init();
};

Logger.prototype = {
  init: function init() {
    document.body.append(this.cvs);
    this.setStyle();
  },

  setStyle: function setStyle() {
    this.cvs.style.position = 'fixed';
    this.cvs.width = window.innerWidth;
    this.cvs.style.pointerEvents = 'none';
    this.cvs.height = 400;
    this.cvs.style.zIndex = 10;
    this.cvs.style.top = 0;
    this.cvs.style.left = 0;
  },

  clear: function clear() {
    this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
  },

  print: function print() {
    this.clear();

    for (var i = 0; i < arguments.length; i += 1) {
      this.ctx.fillText(arguments[i], 20, 20 + i * 20);
    }
  }
};

exports.default = Logger;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Config = __webpack_require__(0);

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
      //console.log(meta);

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
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Config = __webpack_require__(0);

var _Config2 = _interopRequireDefault(_Config);

var _Maths = __webpack_require__(1);

var Maths = _interopRequireWildcard(_Maths);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Bird = function Bird() {
  this.min = _Config2.default.Area.walk.min - (_Config2.default.Area.walk.max - _Config2.default.Area.walk.min);
  this.max = _Config2.default.Area.walk.max + (_Config2.default.Area.walk.max - _Config2.default.Area.walk.min);
  this.range = this.max - this.min;
  this.rangeHalf = this.range / 2;
  this.rotation = { pitch: 0, yaw: 0, roll: 0 };
  this.age = 0;
  this.speed = 12;
  this.glide = false;
  this.glideTimer = 0;
  this.target = {
    age: 0,
    maxAge: 0,
    position: new THREE.Vector3(),
    rotation: { pitch: 0, yaw: 0, roll: 0 }
  };
  this.init();
};

Bird.prototype = {
  init: function init() {
    // make wing geometry
    var mat = new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide });
    var geo1 = new THREE.BufferGeometry();
    var geo2 = new THREE.BufferGeometry();
    geo1.addAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, -0.1, 0, 0, 0.1, 0.2, 0, 0]), 3));
    geo2.addAttribute('position', new THREE.BufferAttribute(new Float32Array([0, 0, -0.1, 0, 0, 0.1, -0.2, 0, 0]), 3));

    // set wings
    this.wing = {
      left: new THREE.Mesh(geo1, mat),
      right: new THREE.Mesh(geo2, mat)
    };

    // set object
    this.object = new THREE.Object3D();
    this.object.add(this.wing.left, this.wing.right);
    this.object.position.x = this.min + this.range * Math.random();
    this.object.position.y = Math.random() * 64;
    this.object.position.z = this.min + this.range * Math.random();

    // set position target
    this.position = this.object.position;

    // set target
    this.newTarget();
  },

  newTarget: function newTarget() {
    // timer
    this.target.age = 0;
    this.target.maxAge = 10 * Math.random();

    // position
    this.target.position.x = this.min + this.range * Math.random();
    this.target.position.y = -4 + 32 * Math.random();
    this.target.position.z = this.min + this.range * Math.random();

    // set rotation target
    this.target.rotation.yaw = Maths.yawBetween(this.position, this.target.position);
    this.target.rotation.pitch = Maths.pitchBetween(this.position, this.target.position);
  },

  update: function update(delta, position) {
    // set new target
    this.target.age += delta;

    if (this.target.age > this.target.maxAge) {
      this.newTarget();
    }

    // glide
    if (this.glide) {
      // rotate wings slow
      this.age += delta * 4;

      this.glideTimer -= delta;

      if (this.glideTimer < 0) {
        this.glide = false;
      }
    } else {
      // rotate wings fast
      this.age += Math.random() * delta * 8 + delta * 10;

      if (Math.random() < 0.005) {
        this.glide = true;
        this.glideTimer = Math.random() * 5;
      }
    }

    this.wing.left.rotation.z = Math.sin(this.age) * Maths.halfPi;
    this.wing.right.rotation.z = -Math.sin(this.age) * Maths.halfPi;

    // rotate
    this.rotation.yaw += Maths.minAngleDifference(this.rotation.yaw, this.target.rotation.yaw) * _Config2.default.Adjust.verySlow;
    this.rotation.pitch += Maths.minAngleDifference(this.rotation.pitch, this.target.rotation.pitch) * _Config2.default.Adjust.verySlow;
    this.object.rotation.y = this.rotation.yaw;

    // move
    this.position.x += Math.sin(this.rotation.yaw) * delta * this.speed;
    this.position.y += Math.sin(this.rotation.pitch) * delta * this.speed;
    this.position.z += Math.cos(this.rotation.yaw) * delta * this.speed;

    // limit
    var dx = this.position.x - position.x;
    var dz = this.position.z - position.z;

    if (dx > this.rangeHalf) {
      this.position.x -= this.range;
    } else if (dx < -this.rangeHalf) {
      this.position.x += this.range;
    }

    if (dz > this.rangeHalf) {
      this.position.z -= this.range;
    } else if (dz < -this.rangeHalf) {
      this.position.z += this.range;
    }
  }
};

exports.default = Bird;

/***/ })
/******/ ]);