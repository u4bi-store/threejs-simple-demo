/* particules index.js*/

var container = document.getElementById('container'); /* dom에 접근함*/

var renderer = new THREE.WebGLRenderer(); /* 웹GL을 지원하는 렌더러 생성*/
var scene = new THREE.Scene(); /* 씬 객체 생성*/
var camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 1, 10000); /* 카메라 셋업함*/
var distance = 500; /* cube간의 간격을 줌으로 거리를 두게 만듬*/
    
renderer.setSize(container.offsetWidth, container.offsetHeight); /* 렌더링할 공간 컨테이너란 id를 가진 div의 높이와 너비로 설정함*/
container.appendChild(renderer.domElement); /* 컨테이너에 렌더러란 돔을 주입함*/

scene.add(camera); /* 씬에 카메라 구성을 집어넣음*/

for(var i=0; i<500; i++){ /* 포문을 돌림 큐브 객체를 500개 만들꺼임 */
  var geometry = new THREE.CircleGeometry(1,32); /* 원형 기하게를 만듬 (radius,  segments)*/
  var material = new THREE.MeshBasicMaterial( { color : Math.random() * 0x808080 + 0x808080 } );/* 색감*/
  var cube = new THREE.Mesh(geometry, material); /* cube에 위의 두 객체를 정의함*/

  cube.position.x = Math.random() * distance * 2 - distance; /* cube 객체의 x,y,z값 설정*/
  cube.position.y = Math.random() * distance * 2 - distance; /* 랜덤값으로 주고 cube간의 간격을 조정*/
  cube.position.z = Math.random() * distance * 2 - distance; /**/

  cube.scale.x = cube.scale.y = Math.random() * 10 + 5; /* cube 객체의 스케일값 조정*/
  scene.add(cube); /*씬에 cube 객체를 넣어줌*/
} /*포문이 끝남*/

camera.position.z = 0; /* 카메라의 z값은 0으로 */
camera.lookAt(scene); /* 카메라의 시점은 씬을 마주보게*/

render();

function render(){ /* 말그대로 렌더링*/
  requestAnimationFrame(render); /* 브라우저 탭을 이동하거나 할때 정지되게끔 만듬 브라우저 부담을 줄여줌*/
  renderer.render(scene, camera); /* 렌더러란 돔안에 씬과 카메라를 렌딩시킴*/
  camera.rotation.x += 0.001; /* 카메라의 좌표 x값을 회전시킴*/
  camera.rotation.y += 0.001; /* 카메라의 좌표 x값을 회전시킴*/
  container.addEventListener('mousemove', mouseControoler, false); /* mousemove 핸들러를 컨테이너에 주입함*/
}

function mouseControoler(e){ /* 마우스 컨트롤 함수*/
  var mouseX = event.clientX - container.offsetWidth/2;
  var mouseY = event.clientY - container.offsetHeight/2;
  
  camera.position.x += (mouseX - camera.position.x) *0.05; /* 0.05  5.05*/
  camera.position.y += (mouseY - camera.position.y) *0.05;
  camera.position.z = distance;
  
  camera.lookAt(scene.position); /* 씬의 좌표값으로 시점을 조정함*/
  
}
