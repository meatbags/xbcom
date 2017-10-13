import Player from './Player';

const Scene = function(domElement) {
  this.domElement = domElement;
  this.init();
};

Scene.prototype = {
  init: function() {
    this.scene = new THREE.Scene();
    this.player = new Player(this.domElement);
    this.camera = this.player.camera;
    this.collider = new Collider.System();

    // load scenery
  },

  update: function(delta) {
    this.player.update(delta, this.collider);
  },

  resize: function() {

  }
};

export default Scene;
