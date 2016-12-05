/* earth index.js*/

var container;
var camera, scene, renderer;
var earth;

init();
render();

function init(){
  container = document.getElementById('container');
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor( 0xffffff );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  container.appendChild( renderer.domElement );
  
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 0.1, 1000 );
  camera.position.z = 500;
  
  var loader = new THREE.TextureLoader();
  loader.load('images/earth.jpg', textureLoader); 
}
              
function textureLoader(texture){
  var geometry = new THREE.SphereGeometry(200, 20, 20);
  var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5});
  earth = new THREE.Mesh( geometry, material);
  scene.add(earth);
}
  
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  earth.rotation.y += 0.01;
}
  

