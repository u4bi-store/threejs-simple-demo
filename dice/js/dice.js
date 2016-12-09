/* main dice.js*/

var container;
var camera, scene, renderer;
var dice;

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근할꺼임*/
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);/* 카메라 셋업함*/
  camera.position.y = 150;
  camera.position.z = 500;
  
  scene = new THREE.Scene();
  
  var geometry = new THREE.BoxGeometry(200, 200, 200);
  var materialArray = [];
  
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dice_'+i+'.png' ), overdraw: 0.5 }));
  }
  var material = new THREE.MeshFaceMaterial(materialArray);
  dice = new THREE.Mesh(geometry, material);
  dice.position.y = 150;
  scene.add(dice);
  
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
}

function render(){
  requestAnimationFrame(render);
  dice.rotation.x += .2;
  dice.rotation.y += .2;
  renderer.render(scene, camera);	
}