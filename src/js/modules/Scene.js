import Player from './Player';
import Loader from './Loader';

const Scene = function(domElement) {
  this.domElement = domElement;
  this.init();
};

Scene.prototype = {
  init: function() {
    const self = this;

    self.loader = new Loader('./assets/');
    self.scene = new THREE.Scene();
    self.player = new Player(self.domElement);
    self.camera = self.player.camera;
    self.collider = new Collider.System();
    self.loaded = 0;
    self.toLoad = 2;

    // load collision map
    self.loader.loadOBJ('collision_map').then(function(map){
      for (let i=0; i<map.children.length; i+=1) {
        self.collider.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.loaded += 1;
    }, self.error);

    // load map
    this.loader.loadOBJ('map').then(function(map) {
      self.scene.add(map);
      self.loaded += 1;
    }, self.error);

    // lights
    self.lights = {
      p1: new THREE.PointLight(0xffffff, 1)
    };
    self.lights.p1.position.set(0, 10, 0);
    self.scene.add(self.lights.p1);
  },

  error: function(err) {
    throw(err);
  },

  getStatus: function() {
    return (self.loaded === self.toLoad);
  },

  update: function(delta) {
    const self = this;

    self.player.update(delta, self.collider);
  },

  resize: function() {

  }
};

export default Scene;
