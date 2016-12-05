/*bsic.js*/

/* 렌더링을 위한 오브젝트를 만들기 위해 세가지가 필요하다 함.
   scene, camera, renderer 장면 카메라 렌더러
*/

var scene, camera, renderer;
var geometry, material, cube;

init();

function init(){
  scene = new THREE.Scene(); /* 씬 객체를 생성함*/
  camera = new THREE.PerspectiveCamera(50, 400/300, 0.1, 1000);
  /* PerspectiveCamera(수직된 카메라의 시점, 종횡비의 값, 절투체와의 최소 간격, 절투체와의 최대 간격

  fov — 카메라 수직된 시점의 거리
  aspect — 가로 세로의 비율 종횡비의 값
  near — 카메라와 절투체의 가까운 간격
  far — 카메라와 절투체의 먼 간격
  */
  renderer = new THREE.WebGLRenderer();/* 웹GL을 지원하는 렌더러 생성*/

  renderer.setSize(400, 300); /* 렌더링할 공간 너비와 높이 설정*/
  document.body.appendChild(renderer.domElement); /* 렌더럴을 바디에 어펜드함 이 돔은 캔버스요소임라 함*/

  geometry = new THREE.BoxGeometry(1, 1, 1); /* 박스 기하체를 생성함 (X,Y,Z)*/
  material = new THREE.MeshBasicMaterial( { color : 0xFFFF00 } );
  /* 내부색을 채우는 함수가 여러가지 있지만 기본적인 베이직한거 사용 css나 포토샵 규칙과 동일하다함 */
  cube = new THREE.Mesh(geometry, material); /* cube에 geometry와 meterial란 재료를 주입하여 적용함*/
  
  scene.add(cube); /* scene에 cube를 에드함 추가로 xyz 값을 줘야하는데 현재 0,0,0 상태임*/
  camera.position.z = 3; /* 따라서 단순하게 카메라 좌표 z값 조절하여 큐브와 거리를 둬봄*/

  render(); /* 렌더링을 호출함*/  
}

function render() { /* 말그대로 루프가 도는 렌더임 렌더더란건 초당 fps60지원한다함*/ 
  requestAnimationFrame(render);
  /* 위 함수는 우리가 브라우저 탭을 이동하거나 할때 프레임을 정지시켜준다함 브라우저가 받는 부담과 배터리를 아껴줌*/
	renderer.render(scene, camera); /* 렌딩시킴*/
  
  /* 가벼운 애니메이션 넣어보겠음 즉 cube의 xy값을 0.1씩 쁠쁠해줌*/
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.1;
}