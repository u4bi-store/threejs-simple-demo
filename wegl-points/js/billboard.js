/* webgl-points billboard.js*/

if (!Detector.webgl)Detector.addGetWebGLMessage(); /*요소가 없을시 정보호출*/

var container;
var camera, scene, renderer;
var geometry, sprite, material, particles;
init();
render();

function init(){
  container = document.getElementById('container');
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, innerHeight);
  container.appendChild(renderer.domElement);
  
  camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 2, 2000);
  camera.position.z = 1000;
  
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.001); /* 말그대로 안개(hex컬러, density밀도)*/
  geometry = new THREE.Geometry();
  sprite = new THREE.TextureLoader().load('images/disc.png');
  
  for(i = 0; i< 10000; i++){
    var vertext = new THREE.Vector3();
    vertext.x = 2000 * Math.random(); -1000;
    vertext.y = 2000 * Math.random(); -1000;
    vertext.z = 2000 * Math.random(); -1000;
    
    geometry.vertices.push(vertext);
  }
  
  var meterial_data = {
    size: 35,
    sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.5,
    transparent: true
  };
  material = new THREE.PointsMaterial(meterial_data);
  material.color.setHSL(1.0, 0.3, 0.7);
  
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

function render(){
  requestAnimationFrame(render);
  camera.lookAt( scene.position);
  renderer.render(scene, camera);
}