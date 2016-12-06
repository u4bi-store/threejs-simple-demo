/* panorama index.js*/

var container;
var camera, scene, renderer ;
var geometry, material, mesh;

var info = {
  isUserInteracting : false,
  onMouseDownMouseX : 0,
  onMouseDownMouseY : 0,
  onMouseDownLon : 0,
  onMouseDownLat : 0,
  onPointerDownPointerX : 0,
  onPointerDownPointerY : 0,
  onPointerDownLon : 0,
  onPointerDownLat : 0,
  lon : 0,
  lat : 0,
  phi : 0,
  theta : 0
};

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근함*/
  renderer = new THREE.WebGLRenderer(); /* 웹GL을 지원하는 렌더러 생성*/
  renderer.setPixelRatio(window.devicePixelRatio); /* 현재 디스플레이 픽셀 반영함*/
  renderer.setSize(window.innerWidth, window.innerHeight); /* 렌더링할 공간임 컨테이너란 id를 가진 di=v의 높이와 너비를 설정함*/
  container.appendChild(renderer.domElement); /* 컨테이너에 렌더러란 돔을 주입함*/
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 1100); /* 카메라 셋업함*/
  camera.target = new THREE.Vector3(0,0,0); /* 3d 벡터 주입 (x y z)*/
  scene = new THREE.Scene(); /* 씬에 카메라 구성을 집어넣음*/
  
  geometry = new THREE.SphereGeometry(500, 60, 40); /* 구체형의 기하체를 만듬*/
  geometry.scale(-1, 1, 1); /*  기하체의 스케일값 조정*/
  
  var material_data = { map : new THREE.TextureLoader().load('images/panorama.jpg')}; /* 객체로 이미지 데이터 정보 정의*/
  material = new THREE.MeshBasicMaterial(material_data); /* 물체에 입힐 위의 이미지를 material에 로드함 */
  mesh = new THREE.Mesh(geometry, material); /* mesh에 geometry와 meterial란 객체를 주입하여 적용함*/
  
  scene.add(mesh); /* 씬에 mesh 객체를 넣어줌*/
  
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
function mouseMove(e){
  if(!info.isUserInteracting) return;
  
  info.lon = ( info.onPointerDownPointerX - e.clientX ) * 0.1 + info.onPointerDownLon;
  info.lat = ( e.clientY - info.onPointerDownPointerY ) * 0.1 + info.onPointerDownLat;
}
function mouseDown(e){
  e.preventDefault(); /* 핸들러내 기본동작을 중지하는 함수임*/
  info.isUserInteracting = true;
  
  info.onPointerDownPointerX = e.clientX;
  info.onPointerDownPointerY = e.clientY;
  
  info.onPointerDownLon = info.lon;
  info.onPointerDownLat = info.lat;
}

function render(){ /* 말 그대로 루프가 도는 렌더임 랜딩되는 요소들 모아놓음 정리*/
  requestAnimationFrame(render);
  /* 위 함수는 우리가 브라우저 탭을 이동하거나 할때 프레임을 정지시켜준다함 브라우저가 받는 부담과 배터리를 아껴줌*/
  
  if(info.isUserInteracting === false) info.lon += 0.1;

  info.lat = Math.max(-85, Math.min(85, info.lat));
  info.phi = THREE.Math.degToRad(90-info.lat);
  info.theta = THREE.Math.degToRad(info.lon);
  camera.target.x = 500 * Math.sin(info.phi) * Math.cos(info.theta);
  camera.target.y = 500 * Math.cos(info.phi);
  camera.target.z = 500 * Math.sin(info.phi) * Math.sin(info.theta);
  camera.lookAt(camera.target);

	renderer.render(scene, camera); /* 컨테이너안에 입혀진 렌더러란 돔 내부의 씬과 카메라를 렌딩시킴*/
}