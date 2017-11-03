import Config from './Config';
import { wrap, minAngleDifference } from './Maths';

const Ship = function() {
  this.active = true;
  this.position = new THREE.Vector3(Config.Ship.position.x, Config.Ship.position.y, Config.Ship.position.z);
  this.rotation = {
    pitch: Config.Ship.rotation.pitch,
    yaw: Config.Ship.rotation.yaw,
    roll: Config.Ship.rotation.roll,
  };
  this.target = {
    position: new THREE.Vector3(Config.Ship.position.x, Config.Ship.position.y, Config.Ship.position.z),
    rotation: {
      pitch: Config.Ship.rotation.pitch,
      yaw: Config.Ship.rotation.yaw,
      roll: Config.Ship.rotation.roll,
    },
    bank: 0,
    speed: Config.Ship.speed
  };
  this.bank = 0;
  this.speed = Config.Ship.speed;
  this.config = Config.Ship;
  this.config.area = Config.Area;
  this.config.adjust = Config.Adjust;
}

Ship.prototype = {
  update: function(delta, player) {
    if (this.active) {
      // bank
      this.bank += (this.target.bank - this.bank) * this.config.adjust.normal;
      this.target.rotation.yaw += this.bank * delta;

      // accelerate
      this.speed += (this.target.speed - this.speed) * this.config.adjust.slow;

      // rotate
      this.rotation.yaw += this.config.adjust.slow * minAngleDifference(this.rotation.yaw, this.target.rotation.yaw)
      this.rotation.roll += (this.target.rotation.roll - this.rotation.roll) * this.config.adjust.slow;

      // move target
      this.target.position.x += this.speed * Math.sin(this.rotation.yaw) * delta;
      this.target.position.z += this.speed * Math.cos(this.rotation.yaw) * delta;

      // wrap
      const wrapx = wrap(this.target.position.x, this.config.area.walk.min, this.config.area.walk.max);
      const wrapz = wrap(this.target.position.z, this.config.area.walk.min, this.config.area.walk.max);
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

  takeOff: function() {
    this.active = true;
    this.target.speed = Config.Ship.speed;
    this.target.position.y = Config.Ship.position.y;
  },

  land: function() {
    this.active = false;
    this.target.speed = this.speed = 0;
    this.setBank(0);
    this.rotation.roll = this.target.rotation.roll;
  },

  setBank: function(value) {
    this.target.bank = value;
    this.target.rotation.roll = (value == 0) ? 0 : ((value > 0) ? this.config.rotation.maxRoll : -this.config.rotation.maxRoll);
  },

  toggle: function() {
    this.active = (this.active == false);
  }
}

export default Ship;
