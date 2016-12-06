/* webgl-points billboard.js*/

if (!Detector.webgl)Detector.addGetWebGLMessage(); /*요소가 없을시 정보호출*/

var container;
var camera, scene, renderer;
var geometry, sprite, material, particles;

var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
render();

function init(){
  container = document.getElementById('container'); /* 돔에 접근함*/
  renderer = new THREE.WebGLRenderer(); /* 웹GL을 지원하는 렌더러 생성*/
  renderer.setPixelRatio(window.devicePixelRatio); /* 현재 디스플레이 픽셀 반영함*/
  renderer.setSize(window.innerWidth, innerHeight); /* 렌더링할 공간임 컨테이너란 id를 가진 div의 높이와 너비를 설정함*/
  container.appendChild(renderer.domElement); /* 컨테이너에 렌더러란 돔을 주입함*/
  
  camera = new THREE.PerspectiveCamera(55, window.innerWidth/window.innerHeight, 2, 2000); /* 카메라 셋업함*/
  camera.position.z = 1000; /* 카메라의 z값을 500으로 물체와의 간격 조정을 위함*/
  
  scene = new THREE.Scene(); /* 씬에 카메라 구성을 집어넣음*/
  scene.fog = new THREE.FogExp2(0x000000, 0.001); /* 말그대로 안개(hex컬러, density밀도)*/
  geometry = new THREE.Geometry(); /* 기하체를 만듬*/
  sprite = new THREE.TextureLoader().load('images/disc.png'); /* 물체에 입힐 이미지를 로드함 단축식 클래스.load(url)*/
  
  for(i = 0; i< 10000; i++){ /* 포문을 돌리고 vector객체 10000개 만들꺼임 */
    var vertext = new THREE.Vector3();
    vertext.x = 2000 * Math.random() -1000; /* vector 객체의 x,y,z값 설정*/
    vertext.y = 2000 * Math.random() -1000; /* 랜덤값으로 주고 vector간의 간격을 조정*/
    vertext.z = 2000 * Math.random() -1000;
    
    geometry.vertices.push(vertext); /* 기하체의 vertices 그룹내에 밀어넣음*/
  }
  
  var meterial_data = { /* 객체로 데이터를 정의함*/
    size: 35,
    sizeAttenuation: false,
    map: sprite,
    alphaTest: 0.5,
    transparent: true
  };
  material = new THREE.PointsMaterial(meterial_data); /* 머티리얼 데이터 주입하여 초기화함*/
  material.color.setHSL(1.0, 0.3, 0.7); /* 컬러셋 particles에 주입되기위함*/
  
  particles = new THREE.Points(geometry, material); /* particles에 위의 두 객체를 정의함*/
  scene.add(particles); /* 씬에 파티클 객체를 넣어줌*/

  /* 이벤트 핸들러 정의*/
  document.addEventListener( 'mousemove', mouseMove, false ); /* 마우스 움직일 때 호출*/
  document.addEventListener( 'touchstart', touchStart, false ); /* 터치화면 누를 때 호출*/
  document.addEventListener( 'touchmove', touchMove, false ); /* 터치화면을 움직일 때 호출*/
  window.addEventListener( 'resize', resizeWindow, false ); /* 화면의 사이즈가 조정될 때 호출*/
}

function mouseMove(e){ /* 마우스가 움직이는 좌표를 향해 -window.innerWidth/2 만큼 제외한 값으로 정의*/
  mouseX = e.clientX - windowHalfX;
  mouseY = e.clientY - windowHalfY;
}
function touchStart(e){ /* 터치가 눌려진 -window.innerWidth/2 만큼 제외한 값으로 정의*/
  if(e.touches.length != 1) return;  
  event.preventDefault();
  mouseX = event.touches[0].pageX - windowHalfX;
  mouseY = event.touches[0].pageY - windowHalfY;

}
function touchMove(e){ /* 터치가 움직이는 좌표를 향해 -window.innerWidth/2 만큼 제외한 값으로 정의*/
  if(e.touches.length != 1) return;  
  event.preventDefault();
  mouseX = event.touches[0].pageX - windowHalfX;
  mouseY = event.touches[0].pageY - windowHalfY;

}
function resizeWindow(){ /* 사이즈가 줄여질 떄 마다 카메라의  종횡비와 사이즈가 줄어듬*/
  windowHalfX = window.innerWidth/2; /* 브라우저의 프레임이 줄어들거나 늘어났으니 windowHal(화면반절) 재정의함*/
  windowHalfY = window.innerHeight/2; /* 마우스 터치 핸들러들의 회전각 위함*/
  
  camera.aspect = window.innerWidth/window.innerHeight; /* 종횡비 조정*/
  
  camera.updateProjectionMatrix(); /* 랜딩되는 객체들 사이즈 업데이트시킴*/
  renderer.setSize(window.innerWidth, window.innerHeight); /* 사이즈 조정*/
}

function render(){ /* 말 그대로 루프가 도는 렌더임 랜딩되는 요소들 모아놓음 정리*/
  requestAnimationFrame(render);
  /* 위 함수는 우리가 브라우저 탭을 이동하거나 할때 프레임을 정지시켜준다함 브라우저가 받는 부담과 배터리를 아껴줌*/
  
  /* 객체 색상 변경위한 요소 date 객체정의*/
  var time = Date.now()*0.00005;
  
  camera.position.x += (mouseX - camera.position.x)*0.05; /*카메라의 앵글값 변경*/
  camera.position.y += ( - mouseY - camera.position.y)*0.05;
  camera.lookAt( scene.position); /* 카메라가 씬을 바라보게*/
  
  var h=(360*(1.0+time)%360)/360;
  material.color.setHSL(h,0.5,0.5); /* 랜딩되는 변수로 h값 색반영*/
  
  renderer.render(scene, camera); /* 컨테이너안에 입혀진 렌더러란 돔 내부의 씬과 카메라를 렌딩시킴*/
}