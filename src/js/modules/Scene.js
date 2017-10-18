import Player from './Player';
import Loader from './Loader';

const Scene = function(domElement) {
  this.domElement = domElement;
  this.init();
};

Scene.prototype = {
  init: function() {
    const self = this;

    // setup scene
    self.loader = new Loader('./assets/');
    self.player = new Player(self.domElement);
    self.camera = self.player.camera;
    self.scene = new THREE.Scene();
    self.collider = new Collider.System();
    self.loadMaps();
    self.loadLighting();
  },

  loadMaps: function() {
    // load maps

    const self = this;
    self.toLoad = 2;

    // models (async)
    this.loader.loadOBJ('map').then(function(map) {
      self.scene.add(map);
      self.toLoad -= 1;
    }, function(err) {
      throw(err);
    });

    // load collision map (async)
    self.loader.loadOBJ('collision_map').then(function(map) {
      for (let i=0; i<map.children.length; i+=1) {
        self.collider.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.toLoad -= 1;
    }, function(err) {
      throw(err);
    });
  },

  loadLighting: function() {
    const self = this;

    self.lights = {
      p1: new THREE.PointLight(0xffffff, 1)
    };
    self.lights.p1.position.set(0, 10, 0);
    self.scene.add(self.lights.p1);
  },

  isLoaded: function() {
    return (this.toLoad <= 0);
  },

  update: function(delta) {
    const self = this;

    self.player.update(delta, self.collider);
  },

  resize: function() {

  }
};

export default Scene;
