
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

    // run
    App.ready = true;
    App.time = (new Date()).getTime();
    //App.loop();
  },

  resize: function() {
    App.scene.resize();
  },

  loop: function() {
    requestAnimationFrame(App.loop);

    const now = (new Date()).getTime();
    const delta = (now - App.time) / 1000.;
    App.time = now;

    if (App.ready) {
      App.scene.update(delta);
      App.renderer.render(App.scene.scene, App.scene.camera);
    }
  }
};

window.onload = App.init;
