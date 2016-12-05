/* particules index.js*/

var container = document.getElementById('container');

var renderer = new THREE.WebGLRenderer();
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 10000);
var distance = 500;
    
renderer.setSize(container.offsetWidth, container.offsetHeight);
container.appendChild(renderer.domElement);

scene.add(camera);

for(var i=0; i<500; i++){
  var geometry = new THREE.CircleGeometry(1,32);
  var material = new THREE.MeshBasicMaterial( { color : Math.random() * 0x808080 + 0x808080 } );
  var cube = new THREE.Mesh(geometry, material);

  cube.position.x = Math.random() * distance * 2 - distance;
  cube.position.y = Math.random() * distance * 2 - distance;
  cube.position.z = Math.random() * distance * 2 - distance;

  cube.scale.x = cube.scale.y = Math.random() * 10 + 5;
  scene.add(cube);
}

camera.position.z = 0;
camera.lookAt(scene);

render();

function render(){
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  camera.rotation.x += 0.001;
  camera.rotation.y += 0.001;
  container.addEventListener('mousemove', mouseControoler, false);
}

function mouseControoler(e){
  var mouseX = event.clientX - container.offsetWidth/2;
  var mouseY = event.clientY - container.offsetHeight/2;
  camera.position.x += (mouseX - camera.position.x) *0.05;
  camera.position.y += (mouseY - camera.position.y) *0.05;
  camera.position.z = distance;
  
  camera.lookAt(scene.position);
  
}
