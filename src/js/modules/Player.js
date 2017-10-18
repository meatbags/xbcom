import * as Maths from './Maths';
import Config from './Config';

const Player = function(domElement) {
  this.domElement = domElement;
  this.position = new THREE.Vector3(Config.Player.position.x, Config.Player.position.y, Config.Player.position.z);
  this.rotation = new THREE.Vector3(Config.Player.rotation.x, Config.Player.rotation.x, Config.Player.rotation.z);
  this.movement = new THREE.Vector3(0, 0, 0);
  this.offset = {
    rotation: new THREE.Vector3(0, 0, 0)
  };
  this.target = {
    position: new THREE.Vector3(Config.Player.position.x, Config.Player.position.y, Config.Player.position.z),
    rotation: new THREE.Vector3(Config.Player.rotation.x, Config.Player.rotation.x, Config.Player.rotation.z),
    movement: new THREE.Vector3(0, 0, 0),
    offset: {
      rotation: new THREE.Vector3(0, 0, 0)
    }
  };
  this.falling = false;
  this.config = Config.Player;
  this.config.physics = Config.Physics;
  this.config.hud = Config.HUD;
  this.config.adjust = Config.Adjust;

  /*
  this.attributes = {
    speed: {
      normal: Config.Player.speed.normal,
      slowed: Config.Player.speed.slowed,
      rotation: Config.Player.speed.
    }
    speedWhileJumping: 4,
    height: 1.8,
    rotation: Math.PI * 0.75,
    fov: 58,
    cameraThreshold: 0.4,
    maxRotationOffset: Math.PI * 0.3,
    falling: false,
    adjust: {
      slow: 0.02,
      normal: 0.05,
      fast: 0.09,
      veryFast: 0.2,
    },
    climb: {
      up: 1,
      down: 0.5,
      minYNormal: 0.5
    },
    gravity: {
      accel: 10,
      maxVelocity: 50,
      jumpVelocity: 5,
    }
  };
  */
  this.camera = new THREE.PerspectiveCamera(Config.Camera.fov, Config.Camera.aspect, Config.Camera.near, Config.Camera.far);
  this.camera.up = new THREE.Vector3(0, 1, 0);
	this.init();
};

Player.prototype = {
	init: function() {
		this.bindControls();
    this.resizeCamera();
	},

  resizeCamera: function() {
    const w = this.domElement.width;
    const h = this.domElement.height;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  },

	bindControls: function() {
		const self = this;

    // mouse
    self.domElement.addEventListener('click', function(e){
      self.handleClick(e);
    });
    self.domElement.addEventListener('mousemove', function(e){
      self.handleMouseMove(e);
    }, false);
    self.domElement.addEventListener('mousedown', function(e){
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
		document.addEventListener("keydown", function(e) {
      self.handleKeyDown(e);
    }, false);
		document.addEventListener("keyup", function(e) {
      self.handleKeyUp(e);
		}, false);
	},

  handleInput: function(delta) {
    // left/ right keys
    if (this.keys.left || this.keys.right) {
      const dir = ((this.keys.left) ? 1 : 0) + ((this.keys.right) ? -1 : 0);
      this.target.rotation.y += this.config.speed.rotation * delta * dir;
    }

    // up/ down keys
    if (this.keys.up || this.keys.down) {
      const dir = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
      const yaw = this.rotation.y + this.offset.rotation.y;
      const dx = Math.sin(yaw) * this.config.speed.normal * dir;
      const dz = Math.cos(yaw) * this.config.speed.normal * dir;
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
    this.falling = (this.movement.y != 0);

    // reduce movement if falling
    if (!this.falling) {
      this.movement.x = this.target.movement.x;
      this.movement.z = this.target.movement.z;
    } else {
      this.movement.x += (this.target.movement.x - this.movement.x) * this.config.adjust.slow;
      this.movement.z += (this.target.movement.z - this.movement.z) * this.config.adjust.slow;
    }
  },

  checkCollisions: function(delta, collider) {
    // check next position for collision
    let next = Maths.addVector(Maths.scaleVector(this.movement, delta), this.target.position);
    let collisions = collider.collisions(next);

    // apply gravity
    this.movement.y = Math.max(this.movement.y - this.config.physics.gravity * delta, -this.config.physics.maxVelocity);

    if (collisions.length > 0) {
      // check for floor
      for (let i=0; i<collisions.length; i+=1) {
        const ceiling = collisions[i].ceilingPlane(next);

        if (
          ceiling.y != null &&
          ceiling.plane.normal.y >= this.config.climb.minPlaneYAngle &&
          (ceiling.y - this.target.position.y) <= this.config.climb.up
        ) {
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
      let walls = [];

      for (let i=0; i<collisions.length; i+=1) {
        const ceiling = collisions[i].ceilingPlane(next);

        if (ceiling.y != null && (
          ceiling.plane.normal.y < this.config.climb.minPlaneYAngle ||
          (ceiling.y - this.target.position.y) > this.config.climb.up)
        ){
          walls.push(collisions[i]);
        }
      }

      // if inside a wall, extrude out
      if (walls.length > 0) {
        let extrude = Maths.copyVector(next);

        for (let i=0; i<walls.length; i+=1) {
          const mesh = walls[i];
          extrude = mesh.nearest2DIntersect(this.target.position, next);
        }

        next.x = extrude.x;
        next.z = extrude.z;

        // check extruded point for collisions
        let hits = 0;
        collisions = collider.collisions(next);

        for (let i=0; i<collisions.length; i+=1) {
          const ceiling = collisions[i].ceilingPlane(next);

          if (
            ceiling.y != null &&
            (ceiling.plane.normal.y < this.config.climb.minPlaneYAngle ||
            (ceiling.y - this.target.position.y) > this.config.climb.up)
          ) {
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
      const testUnder = Maths.copyVector(next);
      testUnder.y -= this.config.climb.down;

      if (!this.falling && collider.collision(testUnder)) {
        const ceiling = collider.ceilingPlane(testUnder);

        // snap to slope if not too steep
        if (ceiling.plane.normal.y >= this.config.climb.minPlaneYAngle) {
          next.y = ceiling.y;
          this.movement.y = 0;
        }
      }
    }

    // set new position target
    this.target.position.x = next.x;
    this.target.position.y = next.y;
    this.target.position.z = next.z;
  },

  move: function() {
    // move
    this.position.x += (this.target.position.x - this.position.x) * this.config.adjust.veryFast;
    this.position.y += (this.target.position.y - this.position.y) * this.config.adjust.veryFast;
    this.position.z += (this.target.position.z - this.position.z) * this.config.adjust.veryFast;

    // rotate
    this.rotation.y += Maths.minAngleDifference(this.rotation.y, this.target.rotation.y) * this.config.adjust.fast;
    this.offset.rotation.x += (this.target.offset.rotation.x - this.offset.rotation.x) * this.config.adjust.normal;
    this.offset.rotation.y += (this.target.offset.rotation.y - this.offset.rotation.y) * this.config.adjust.normal;
    this.rotation.y += (this.rotation.y < 0) ? Maths.twoPi : ((this.rotation.y > Maths.twoPi) ? -Maths.twoPi : 0);

    // set camera
    const yaw = this.rotation.y + this.offset.rotation.y;
    const pitch = this.rotation.x + this.offset.rotation.x;
    const height = this.position.y + this.config.height;

    this.camera.position.set(this.position.x, height, this.position.z);
    this.camera.lookAt(new THREE.Vector3(
      this.position.x + Math.sin(yaw),
      height + Math.sin(pitch),
      this.position.z + Math.cos(yaw)
    ));
  },

	update: function(delta, collider) {
    // handle key presses and move player

    this.handleInput(delta);
    this.checkCollisions(delta, collider);
    this.move();
	},

  handleClick(e) {
    // on click
  },

  handleKeyDown(e) {
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

  handleKeyUp(e) {
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

  handleMouseDown(e) {
    const bound = this.domElement.getBoundingClientRect();
    const w = this.domElement.width;
    const x = (e.clientX - bound.left) / w;
    const t = this.config.hud.turnThreshold;

    // adjust camera
    if (x < t) {
      this.target.rotation.y = this.rotation.y + ((t - x) / t) * this.config.hud.maxYawRotation;
    } else if (x > 1 - t) {
      this.target.rotation.y = this.rotation.y + ((x - (1 - t)) / t) * -this.config.hud.maxYawRotation;
    } else {
      this.target.rotation.y = this.rotation.y;
    }
  },

  handleMouseMove(e) {
    const bound = this.domElement.getBoundingClientRect();
    const w = this.domElement.width;
    const h = this.domElement.height;
    const x = (e.clientX - bound.left) / w;
    const y = (e.clientY - bound.top) / h;
    const t = this.config.hud.turnThreshold;

    // adjust camera
    if (x < t) {
      this.target.offset.rotation.y = ((t - x) / t) * this.config.hud.maxYawRotation;
    } else if (x > 1 - t) {
      this.target.offset.rotation.y = ((x - (1 - t)) / t) * -this.config.hud.maxYawRotation;
    } else {
      this.target.offset.rotation.y = 0;
    }

    if (y < t) {
      this.target.offset.rotation.x = ((t - y) / t) * this.config.hud.maxYawRotation;
    } else if (y > (1 - t)) {
      this.target.offset.rotation.x = ((y - (1 - t)) / t) * -this.config.hud.maxYawRotation;
    } else {
      this.target.offset.rotation.x = 0;
    }
  }
};

export default Player;
