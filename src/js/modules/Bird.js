import Config from './Config';
import * as Maths from './Maths';

const Bird = function() {
  this.min = Config.Area.walk.min - (Config.Area.walk.max - Config.Area.walk.min);
  this.max = Config.Area.walk.max + (Config.Area.walk.max - Config.Area.walk.min);
  this.range = this.max - this.min;
  this.rangeHalf = this.range / 2;
  this.rotation = {pitch: 0, yaw: 0, roll: 0};
  this.age = 0;
  this.speed = 12;
  this.glide = false;
  this.glideTimer = 0;
  this.target = {
    age: 0,
    maxAge: 0,
    position: new THREE.Vector3(),
    rotation: {pitch: 0, yaw: 0, roll: 0}
  };
  this.init();
};

Bird.prototype = {
  init: function() {
    // make wing geometry
    const mat =  new THREE.MeshBasicMaterial({color: 0x888888, side: THREE.DoubleSide});
    const geo1 = new THREE.BufferGeometry();
    const geo2 = new THREE.BufferGeometry();
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

  newTarget: function() {
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

  update: function(delta, position) {
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
    this.rotation.yaw += Maths.minAngleDifference(this.rotation.yaw, this.target.rotation.yaw) * Config.Adjust.verySlow;
    this.rotation.pitch += Maths.minAngleDifference(this.rotation.pitch, this.target.rotation.pitch) * Config.Adjust.verySlow;
    this.object.rotation.y = this.rotation.yaw;

    // move
    this.position.x += Math.sin(this.rotation.yaw) * delta * this.speed;
    this.position.y += Math.sin(this.rotation.pitch) * delta * this.speed;
    this.position.z += Math.cos(this.rotation.yaw) * delta * this.speed;

    // limit
    const dx = this.position.x - position.x;
    const dz = this.position.z - position.z;
    
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

export default Bird;
