/* panorama index.js*/

var container;
var camera, scene, renderer;
var geometry, material, mesh;

init();
render();

function init(){
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0,0,0);
  scene = new THREE.Scene();
  
  geometry = new THREE.SphereGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);
  
  var material_data = { map : new THREE.TextureLoader().load('images/panorama.jpg')};
  material = new THREE.MeshBasicMaterial(material_data);
  mesh = new THREE.Mesh(geometry, material);
  
  scene.add(mesh);
}

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}