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
    self.collider = {
      objects: new Collider.System(),
      ground: new Collider.System()
    };

    // load stuff
    self.loadMaps();
    self.loadLighting();
  },

  resize: function() {
    this.player.resizeCamera();
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
      const map5 = map.clone();
      const map6 = map.clone();
      const map7 = map.clone();
      const map8 = map.clone();
      const map9 = map.clone();
      const offset = Config.Area.walk.max - Config.Area.walk.min;

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
    }, function(err) {
      throw(err);
    });

    // load ground collision map async
    self.loader.loadOBJ('collision_map_ground').then(function(map) {
      for (let i=0; i<map.children.length; i+=1) {
        self.collider.ground.add(new Collider.Mesh(map.children[i].geometry));
      }
      self.toLoad -= 1;
    }, function(err) {
      throw(err);
    });

    // load ground collision map async
    self.loader.loadOBJ('collision_map_objects').then(function(map) {
      for (let i=0; i<map.children.length; i+=1) {
        self.collider.objects.add(new Collider.Mesh(map.children[i].geometry));
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
      d1: new THREE.DirectionalLight(0xffffff, 0.5),
      //p1: new THREE.PointLight(0xffffff, .5, 50, 1)
    };
    //self.lights.p1.position.set(0, 20, 0);
    self.scene.add(
      self.lights.a1,
      self.lights.d1
      //self.lights.p1
    );

    // fog
    self.scene.fog = new THREE.FogExp2(Config.Global.fogColour, Config.Global.fogDensity);
  },

  isLoaded: function() {
    return (this.toLoad <= 0);
  },

  update: function(delta) {
    const self = this;

    self.player.update(delta, self.collider.ground, self.collider.objects);
  },
};

export default Scene;
