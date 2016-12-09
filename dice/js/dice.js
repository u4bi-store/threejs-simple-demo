/* main dice.js*/

var container;
var camera, scene, renderer;
var dice, plane;


var dice_info = {
  targetPos:0,
  targetDown:0,
  mouseX:0,
  mouseXDown:0
};

var win = {
  fx:window.innerWidth / 2,
  fy:window.innerHeight / 2
};

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근할꺼임*/
  camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 1, 1000);/* 카메라 셋업함*/
  camera.position.y = 150;
  camera.position.z = 500;
  
  scene = new THREE.Scene();
  object_init();
  
  renderer = new THREE.CanvasRenderer();
  renderer.setClearColor(0xf0f0f0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  
  document.addEventListener('mousedown', mouseDown, false);
  document.addEventListener('touchstart', touchStart, false);
  document.addEventListener('touchmove', touchMove, false);
  window.addEventListener('resize', winResize, false);
}

function winResize(){
  win.fx = window.innerWidth / 2;
  win.fy = window.innerHeight / 2;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function mouseDown(e){
  event.preventDefault();
  document.addEventListener('mousemove', mouseMove, false);
  document.addEventListener('mouseup', mouseUp, false);
  document.addEventListener('mouseout', mouseOut, false);

  dice_info.mouseXDown = event.clientX - win.fx;
  dice_info.targetDown = dice_info.targetPos;
}
function mouseMove(e){
  dice_info.mouseX = event.clientX - win.fx;
  dice_info.targetPos = dice_info.targetDown + (dice_info.mouseX - dice_info.mouseXDown) * 0.5;
}
function mouseUp(e){
  clearMouse();
}
function mouseOut(e){
  clearMouse();
}
function clearMouse(){
  document.removeEventListener('mousemove', mouseMove, false);
  document.removeEventListener('mouseup', mouseUp, false);
  document.removeEventListener('mouseout', mouseOut, false);
}

function touchStart(e) {
  if(e.touches.length != 1) return;
    e.preventDefault();
    dice_info.mouseXDown = e.touches[0].pageX - win.fx;
    dice_info.targetDown = dice_info.targetPos;
}
function touchMove(e) {
  if(e.touches.length != 1) return;
    e.preventDefault();
    dice_info.mouseX = e.touches[0].pageX - win.fx;
    dice_info.targetPos = dice_info.targetDown + (dice_info.mouseX - dice_info.mouseXDown) * 0.5;
}

function render(){
  requestAnimationFrame(render);
  plane.rotation.y = dice.rotation.y += (dice_info.targetPos - dice.rotation.y) * 0.05;
  renderer.render(scene, camera);	
}

function object_init(){
  var geometry = new THREE.BoxGeometry(200, 200, 200);
  var materialArray = [];
  
  for (var i = 0; i < 6; i++) {
    materialArray.push(new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'images/dice_'+i+'.png' ), overdraw: 0.5 }));
  }
  var material = new THREE.MeshFaceMaterial(materialArray);
  dice = new THREE.Mesh(geometry, material);
  dice.position.y = 150;
  scene.add(dice);
  
  var geometry = new THREE.PlaneBufferGeometry(200, 200);
  geometry.rotateX(-Math.PI/2); /*rx값 조정*/
  var material = new THREE.MeshBasicMaterial({ color: 0xe0e0e0, overdraw: 0.5 }); /* color 설정 빛의굴곡도 0.5*/
  plane = new THREE.Mesh(geometry, material); /* plance에 위의 두 객체를 정의함*/
  scene.add(plane); /* 씬에 plane 객체를 넣어줌*/
}