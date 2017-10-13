
import Scene from './modules/Scene';

const App = {
  init: function() {
    App.renderer = new THREE.WebGLRenderer();
    App.renderer.setSize(960, 540);
    App.renderer.setClearColor(0xf9e5e2, 1);
    document.getElementById('wrapper').appendChild(App.renderer.domElement);

    // scene
    App.scene = new Scene(App.renderer.domElement);

    // events
    window.onresize = App.resize;

    // wait
    App.loading();
  },

  resize: function() {
    App.scene.resize();
  },

  loading: function() {
    if (!App.scene.getStatus()) {
      requestAnimationFrame(App.loading);
    } else {
      // run
      App.time = (new Date()).getTime();
      App.loop();
    }
  },

  loop: function() {
    requestAnimationFrame(App.loop);

    const now = (new Date()).getTime();
    const delta = (now - App.time) / 1000.;
    App.time = now;
    App.scene.update(delta);
    App.renderer.render(App.scene.scene, App.scene.camera);
  }
};

window.onload = App.init;
