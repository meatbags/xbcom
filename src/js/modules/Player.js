import * as Maths from './Maths';
import Config from './Config';

const Player = function(domElement) {
  this.domElement = domElement;
  this.position = new THREE.Vector3(Config.Player.position.x, Config.Player.position.y, Config.Player.position.z);
  this.rotation = {
    pitch: Config.Player.rotation.pitch,
    yaw: Config.Player.rotation.yaw,
    roll: Config.Player.rotation.roll
  };
  this.movement = new THREE.Vector3(0, 0, 0);
  this.offset = {
    rotation: {
      pitch: 0,
      yaw: 0,
    }
  };
  this.target = {
    position: new THREE.Vector3(Config.Player.position.x, Config.Player.position.y, Config.Player.position.z),
    rotation: {
      pitch: Config.Player.rotation.pitch,
      yaw: Config.Player.rotation.yaw
    },
    movement: new THREE.Vector3(0, 0, 0),
    offset: {
      rotation: {
        pitch: 0,
        yaw: 0,
      }
    }
  };
  this.falling = false;
  this.config = Config.Player;
  this.config.physics = Config.Physics;
  this.config.hud = Config.HUD;
  this.config.adjust = Config.Adjust;
  this.config.area = Config.Area;
  this.camera = new THREE.PerspectiveCamera(Config.Camera.fov, Config.Camera.aspect, Config.Camera.near, Config.Camera.far);
  this.camera.up = new THREE.Vector3(0, 1, 0);
  this.object = new THREE.Group();
	this.init();
};

Player.prototype = {
	init: function() {
    this.light = new THREE.PointLight(0xffffff, 0.5, 25, 2);
    this.light.position.set(0, 1, 0);
    this.object.add(this.light);
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
    self.domElement.addEventListener('click', function(e){
    //  console.log(self)
    }, false);
    self.domElement.addEventListener('mousedown', function(e){
      self.handleMouseDown(e);
    }, false);
    self.domElement.addEventListener('mousemove', function(e){
      self.handleMouseMove(e);
    }, false);
    self.domElement.addEventListener('mouseup', function(e){
      self.handleMouseUp(e);
    }, false);
    self.domElement.addEventListener('mouseleave', function(e){
      self.handleMouseUp(e);
    }, false);

    // keyboard
		document.addEventListener('keydown', function(e) {
      self.handleKeyDown(e);
    }, false);
		document.addEventListener('keyup', function(e) {
      self.handleKeyUp(e);
		}, false);
	},

  handleInput: function(delta) {
    // left/ right keys
    if (this.keys.left || this.keys.right) {
      const dir = ((this.keys.left) ? 1 : 0) + ((this.keys.right) ? -1 : 0);
      this.target.rotation.yaw += this.config.speed.rotation * delta * dir;
    }

    // up/ down keys
    if (this.keys.up || this.keys.down) {
      const dir = ((this.keys.up) ? 1 : 0) + ((this.keys.down) ? -1 : 0);
      const yaw = this.rotation.yaw + this.offset.rotation.yaw;
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

    // wrap collisions inside collision area
    const wrapx = Maths.wrap(next.x, this.config.area.collision.min, this.config.area.collision.max) - next.x;
    const wrapz = Maths.wrap(next.z, this.config.area.collision.min, this.config.area.collision.max) - next.z;
    next.x += wrapx;
    next.z += wrapz;

    // get collision map
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

    // unwrap
    next.x -= wrapx;
    next.z -= wrapz;

    // set new target position
    this.target.position.x = next.x;
    this.target.position.y = next.y;
    this.target.position.z = next.z;
  },

  move: function() {
    // wrap inside play area
    const wrapx = Maths.wrap(this.target.position.x, this.config.area.walk.min, this.config.area.walk.max);
    const wrapz = Maths.wrap(this.target.position.z, this.config.area.walk.min, this.config.area.walk.max);
    this.position.x = wrapx + (this.position.x - this.target.position.x);
    this.position.z = wrapz + (this.position.z - this.target.position.z);
    this.target.position.x = wrapx;
    this.target.position.z = wrapz;

    // move
    this.position.x += (this.target.position.x - this.position.x) * this.config.adjust.veryFast;
    this.position.y += (this.target.position.y - this.position.y) * this.config.adjust.veryFast;
    this.position.z += (this.target.position.z - this.position.z) * this.config.adjust.veryFast;

    // rotate
    this.rotation.yaw += Maths.minAngleDifference(this.rotation.yaw, this.target.rotation.yaw) * this.config.adjust.fast;
    this.offset.rotation.yaw += (this.target.offset.rotation.yaw - this.offset.rotation.yaw) * this.config.adjust.normal;
    this.rotation.yaw += (this.rotation.yaw < 0) ? Maths.twoPi : ((this.rotation.yaw > Maths.twoPi) ? -Maths.twoPi : 0);
    this.rotation.pitch += (this.target.rotation.pitch - this.rotation.pitch) * this.config.adjust.normal;
    this.offset.rotation.pitch += (this.target.offset.rotation.pitch - this.offset.rotation.pitch) * this.config.adjust.normal;

    // set camera
    const pitch = this.rotation.pitch + this.offset.rotation.pitch;
    const yaw = this.rotation.yaw + this.offset.rotation.yaw;
    const height = this.position.y + this.config.height;

    this.camera.position.set(this.position.x, height, this.position.z);
    this.camera.lookAt(new THREE.Vector3(
      this.position.x + Math.sin(yaw),
      height + Math.sin(pitch),
      this.position.z + Math.cos(yaw)
    ));

    // set world object
    this.object.position.set(this.position.x, this.position.y, this.position.z);
  },

	update: function(delta, collider) {
    // handle key presses and move player

    this.handleInput(delta);
    this.checkCollisions(delta, collider);
    this.move();
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
    if (!this.mouse.locked) {
      const self = this;
      const bound = this.domElement.getBoundingClientRect();

      this.mouse.active = true;
      this.mouse.rotation.pitch = this.rotation.pitch;
      this.mouse.rotation.yaw = this.rotation.yaw;
      this.mouse.start.x = (e.clientX / this.domElement.width) * 2 - 1;
      this.mouse.start.y = ((e.clientY - bound.y) / this.domElement.height) * 2 - 1;
    }
  },

  handleMouseMove(e) {
    if (this.mouse.active) {
      const bound = this.domElement.getBoundingClientRect();

      this.mouse.x = (e.clientX / this.domElement.width) * 2 - 1;
      this.mouse.y = ((e.clientY - bound.y) / this.domElement.height) * 2 - 1;
      this.mouse.delta.x = this.mouse.x - this.mouse.start.x;
      this.mouse.delta.y = this.mouse.y - this.mouse.start.y;

      // target rotation yaw
      this.target.rotation.yaw = this.mouse.rotation.yaw + this.mouse.delta.x;

      // target rotation pitch
      let pitch = this.mouse.rotation.pitch + this.mouse.delta.y;

      // if limit reached, reset start point
      if (pitch > this.config.rotation.maxPitch || pitch < this.config.rotation.minPitch) {
        pitch = Math.max(
          this.config.rotation.minPitch,
          Math.min(
            this.config.rotation.maxPitch,
            pitch
          )
        );
        this.mouse.start.y = this.mouse.y;
        this.mouse.rotation.pitch = pitch;
      }

      this.target.rotation.pitch = pitch;
    }
  },

  handleMouseUp(e) {
    this.mouse.active = false;
  }
};

export default Player;
