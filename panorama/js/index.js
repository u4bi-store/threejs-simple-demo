/* panorama index.js*/

var container;
var camera, scene, renderer;
var geometry, material, mesh;

var info = {
  isUserInteracting : false,
  onMouseDownMouseX : 0,
  onMouseDownMouseY : 0,
  onMouseDownLon : 0,
  onMouseDownLat : 0,
  lon : 0,
  lat : 0,
  phi : 0,
  theta : 0
};

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
  
  document.addEventListener('mousedown', mouseDown, false);
  document.addEventListener('mousemove', mouseMove,false);
  document.addEventListener('mouseup', mouseUp,false);
  document.addEventListener('wheel', mouseWheel,false);
  window.addEventListener('resize', windowResize,false);
}

function windowResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseWheel(e){
  camera.fov += e.deltaY * 0.05;
  camera.updateProjectionMatrix();
}
function mouseUp(e){
  info.isUserInteracting = false;
}
function mouseMove(e){}
function mouseDown(e){
  e.preventDefault(); /* 핸들러내 기본동작을 중지하는 함수임*/
  info.isUserInteracting = true;
}

function render(){
  requestAnimationFrame(render);

  if(info.isUserInteracting === false) info.lon += 0.1;

  info.lat = Math.max(-85, Math.min(85, info.lat));
  info.phi = THREE.Math.degToRad(90-info.lat);
  info.theta = THREE.Math.degToRad(info.lon);
  camera.target.x = 500 * Math.sin(info.phi) * Math.cos(info.theta);
  camera.target.y = 500 * Math.cos(info.phi);
  camera.target.z = 500 * Math.sin(info.phi) * Math.sin(info.theta);
  camera.lookAt(camera.target);

renderer.render(scene, camera);
}