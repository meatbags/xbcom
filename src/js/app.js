import Scene from './modules/Scene';
import Config from './modules/Config';

const App = {
  init: function() {
    // three js
    App.renderer = new THREE.WebGLRenderer({antialias: false});
    App.renderer.setClearColor(Config.Global.fogColour, 1);
    document.getElementById('wrapper').appendChild(App.renderer.domElement);

    // scene
    App.scene = new Scene(App.renderer.domElement);

    // events
    App.bindEvents();

    // wait
    App.loading();
  },

  bindEvents: function() {
    window.onresize = App.resize;
    App.resize();
  },

  resize: function() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    App.renderer.setSize(w, h);
    App.renderer.domElement.width = w;
    App.renderer.domElement.height = h;
    App.scene.resize();
  },

  loading: function() {
    if (!App.scene.isLoaded()) {
      requestAnimationFrame(App.loading);
    } else {
      App.time = (new Date()).getTime();
      App.loop();
    }
  },

  loop: function() {
    requestAnimationFrame(App.loop);

    const now = (new Date()).getTime();
    const delta = (now - App.time) / 1000.;
    App.time = now;
    App.scene.update((delta > Config.Global.timeDeltaMax) ? Config.Global.timeDeltaMax : delta);
    App.renderer.render(App.scene.scene, App.scene.camera);
  }
};

window.onload = App.init;
