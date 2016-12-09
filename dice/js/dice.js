/* main dice.js*/

var container;
var camera, scene, renderer;

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근할꺼임*/
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);/* 카메라 셋업함*/
  scene = new THREE.Scene();
  
  renderer = new THREE.CanvasRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);	
}