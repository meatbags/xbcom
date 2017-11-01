import Config from './Config';

const Ship = function() {
  this.active = true;
  this.position = new THREE.Vector3(Config.Ship.position.x, Config.Ship.position.y, Config.Ship.position.z);
}

Ship.prototype = {

}

export default Ship;
