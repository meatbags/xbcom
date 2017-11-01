import Player from './Player';
import Loader from './Loader';
import Config from './Config';

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
    self.scene.add(self.player.object);
    self.collider = new Collider.System();

    // load stuff
    self.loadMaps();
    self.loadLighting();
  },

  loadMaps: function() {
    // load maps

    const self = this;
    self.toLoad = 2;

    // models async
    this.loader.loadOBJ('map').then(function(map) {
      const map2 = map.clone();
      const map3 = map.clone();
      const map4 = map.clone();
      map2.position.set(0, 0, 100)
      map3.position.set(100, 0, 0)
      map4.position.set(100, 0, 100)
      self.scene.add(map, map2, map3, map4);
      self.toLoad -= 1;
    }, function(err) {
      throw(err);
    });

    // load collision map async
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

    // lighting
    self.lights = {
      a1: new THREE.AmbientLight(0xffffff, 0.25),
      d1: new THREE.DirectionalLight(0xffffff, 1),
      p1: new THREE.PointLight(0xffffff, .5, 50, 1)
    };
    self.lights.p1.position.set(0, 20, 0);
    self.scene.add(
      self.lights.a1,
      self.lights.d1
      //self.lights.p1
    );

    // fog
    self.scene.fog = new THREE.FogExp2(Config.Global.fogColour, 0.015);
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
