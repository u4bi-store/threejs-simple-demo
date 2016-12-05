/* earth index.js*/

var container;
var camera, scene, renderer;
var earth;

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근함*/
  renderer = new THREE.CanvasRenderer(); /* 캔버스를 지원하는 렌더러 생성*/
  renderer.setClearColor( 0xffffff ); /* 렌더러 배경색 설정*/
  renderer.setPixelRatio( window.devicePixelRatio ); /* 현재 디스플레이 픽셀 반영함*/
  renderer.setSize(container.offsetWidth, container.offsetHeight); /* 렌더링할 공간 컨테이너란 id를 가진 div의 높이와 너비로 설정함*/
  container.appendChild( renderer.domElement ); /* 컨테이너에 렌더러란 돔을 주입함*/
  
  scene = new THREE.Scene(); /* 씬에 카메라 구성을 집어넣음*/
  camera = new THREE.PerspectiveCamera( 60, container.offsetWidth / container.offsetHeight, 0.1, 1000); /* 카메라 셋업함*/
  camera.position.z = 500; /* 카메라의 z값을 500으로 물체와의 간격 조정을 위함*/
  
  var loader = new THREE.TextureLoader(); /* 텍스쳐 로드 위한 클래스임*/
  /* https://threejs.org/docs/index.html#Reference/Loaders/TextureLoader */
  loader.load('images/earth.jpg', textureLoader);  /* 물체에 입힐 이미지 로드함*/
}
              
function textureLoader(texture){ /* 로드한 이미지 입히는 함수 정의함*/
  var geometry = new THREE.SphereGeometry(200, 20, 20);  /*구체형 기하체를 만듬 (radius, widthSegments, heightSegments)*/
  var material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5}); /*인자로 받은 이미지 즉 texture를 map에 입힘*/
  /* map만 씌우면 구체에 보이는 선형태 라인이 보임 이를 가리기 위해 overdraw 설정 오버드로우란 색상을 중첩하여 주어 진하게 보이게 하는거라고하는데 여기선 굴곡도를 주는듯*/
  /* earth.rotation.y 주석처리하고 오버드로우 100과 0 그리고 0.5 비교 */
  earth = new THREE.Mesh( geometry, material); /* earth에 위의 두 객체를 정의함*/
  scene.add(earth); /* 씬에 earth 객체를 넣어줌*/
}
  
function render() { /* 렌더링 내정의임 */
  requestAnimationFrame(render); /* 브라우저 탭을 이동하거나 할때 정지되게끔 해줌 브라우저 부담 줄임*/
  renderer.render(scene, camera); /* 컨테이너안에 입혀진 렌더러란 돔안의 씬과 카메라를 렌딩시킴*/
  earth.rotation.y += 0.01; /* earth의 좌표 y값을 회전시킴*/
}
  

