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
      App.removeLoadingScreen();
      App.hud();
      App.time = (new Date()).getTime();
      App.loop();
    }
  },

  hud: function() {
    $('#hud-button').on('click', function(){
      if ($(this).hasClass('active')) {
        App.scene.player.ship.takeOff();

        if (App.scene.player.ship.active) {
          $(this).removeClass('active');
          $(this).removeClass('text-large');
          $(this).addClass('text-huge');
          $(this).find('.hud__button__inner').html('&darr;');
          $('.hud__inner').removeClass('hidden');
        }
      } else {
        App.scene.player.ship.land();

        if (!App.scene.player.ship.active) {
          $(this).removeClass('text-huge');
          $(this).addClass('text-large');
          $(this).addClass('active');
          $(this).find('.hud__button__inner').html('&uarr;');
          $('.hud__inner').addClass('hidden');
        }
      }
    });
    $('#hud-right').on('click', function() {
      $('.hud__inner').removeClass('active-left');
      $('.hud__inner').toggleClass('active-right');
      $('.hud__inner__grid').removeClass('active');
      if ($('.hud__inner').hasClass('active-right')) {
        $(this).addClass('active');
        App.scene.player.ship.setBank(-0.25);
      } else {
        App.scene.player.ship.setBank(0);
      }
    });
    $('#hud-left').on('click', function() {
      $('.hud__inner').removeClass('active-right');
      $('.hud__inner').toggleClass('active-left');
      $('.hud__inner__grid').removeClass('active');
      if ($('.hud__inner').hasClass('active-left')) {
        $(this).addClass('active');
        App.scene.player.ship.setBank(0.25);
      } else {
        App.scene.player.ship.setBank(0);
      }
    });

    setTimeout(function() {
      $('.hud__inner').removeClass('hidden');
      $('.hud__button').removeClass('hidden');
    }, 2000);
  },

  removeLoadingScreen: function() {
    $('.loading-screen__inner').fadeOut(1000);
    $('.loading-screen').fadeOut(3000);
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
