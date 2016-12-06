/* character-controller index.js*/

if (! Detector.webgl) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var container, camera, scene, renderer;
var characters;
var nCharacters = 0;
var cameraControls;
var controls = {moveForward: false, moveBackward: false, moveLeft: false, moveRight: false};
var clock = new THREE.Clock(); /* 트랙 시간 클래스*/

init();
render();

function init() {
  container = document.getElementById('container'); /* dom에 접근함*/
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 4000); /*카메라 셋업함*/
  /* PerspectiveCamera(수직된 카메라의 시점, 종횡비의 값, 절투체와의 최소 간격, 절투체와의 최대 간격*/
  camera.position.set(0, 150, 1300); /* camera가 주시할 xyz초기화*/
  
  scene = new THREE.Scene(); /* 씬 객체 생성*/
  scene.fog = new THREE.Fog(0xffffff, 1000, 4000); /*안개 클래스 하늘의 배경이나 뿌옇게*/
  scene.add(camera); /* 씬에 카메라 구성을 집어넣음*/
  scene.add(new THREE.AmbientLight(0x222222)); /* 모든곳을 밝히는 클래스 (색상hex 0xFFFFFF)*/

  /*https://threejs.org/docs/index.html#Reference/Lights/DirectionalLight
  특정 방향이 아니라 특정 위치에서 빛나는 빛을 생성하는 클래스 */
  var light = new THREE.DirectionalLight(0xffffff, 2.25); /* (색상hex, 빛의 강도)*/
  light.position.set(200, 450, 500); /* xyz 빛이 정의될 좌표 설정*/
  light.castShadow = true; /* 쉐도우 그림자 효과 정의*/
  light.shadow.mapSize.width = 1024; /* 빛이 빛날 범위 폭*/
  light.shadow.mapSize.height = 512; /* 빛이 빛날 범위 너비*/
  light.shadow.camera.near = 10; /* 카메라 최소 */ 
  light.shadow.camera.far = 1200; /* 카메라 최대 */
  light.shadow.camera.left = -1000; /* 쉐도우 범위 left*/
  light.shadow.camera.right = 1000; /* 쉐도우 범위 right*/
  light.shadow.camera.top = 350; /* 쉐도우 범위 top*/
  light.shadow.camera.bottom = -350; /* 쉐도우 범위 bottom*/
  scene.add(light); /* 씬에 light 에드함*/
  // scene.add(new THREE.CameraHelper(light.shadow.camera)); /* 라인*/

  var gt = new THREE.TextureLoader().load("images/ground.jpg"); /* 바닥 이미지 로드*/
  var gg = new THREE.PlaneBufferGeometry(16000, 16000); /* 기하체 생성 (x, y)*/
  var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt }); /* 이미지 입히며 실색 정의*/
  var ground = new THREE.Mesh(gg, gm); /* ground에 위의 gg, gm 정의함*/
  ground.rotation.x = - Math.PI / 2; /* ground 객체의 각도 설정*/
  ground.material.map.repeat.set(64, 64); /* width, height 픽셀로 gg에 선언된 기하체의 크기만큼 반복*/
  ground.material.map.wrapS = THREE.RepeatWrapping; /* 반복 각도 wrapS*/
  ground.material.map.wrapT = THREE.RepeatWrapping; /* 반복 각도 wrapT*/
  ground.receiveShadow = true; /* ground에 쉐도우 그림자 효과 투영함*/
  scene.add(ground); /*씬에 ground 에드함*/

  renderer = new THREE.WebGLRenderer({ antialias: true }); /* 웹GL을 지원하는 렌더러 생성 안티알리어스 활성화*/
  renderer.setClearColor(scene.fog.color); /* 씬의 안개 색계열로 렌더러의 배경색을 정의함*/
  renderer.setPixelRatio(window.devicePixelRatio); /* 현재 디스플레이 픽셀 반영함*/
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); /* 렌더링할 공간의 사이즈 초기화*/
  container.appendChild(renderer.domElement); /* 컨테이너에 렌더러란 돔을 주입함*/

  renderer.gammaInput = true; /* 들어오는 감마색상 출력 활성화*/
  renderer.gammaOutput = true; /* 나가는 감마색상 출력 활성화*/
  renderer.shadowMap.enabled = true; /* 구성 요소의 그림자 매핑 활성화*/
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; /*쉐이더의 타입 정의*/
  /* 옵션 :
  THREE.BasicShadowMap 픽셀로 흝어짐
  THREE.PCFShadowMap
  THREE.PCFSoftShadowMap 젤부드러운듯
  
  쉐이더 속성들의 타입은 세가지가 있는데 기본 값은 THREE.PCFShadowMap 이라함
  */
  
  window.addEventListener('resize', onWindowResize, false); /* 화면의 사이즈가 조정될 때 호출*/
  document.addEventListener('keydown', onKeyDown, false); /* 키를 눌렀을 때 호출*/
  document.addEventListener('keyup', onKeyUp, false); /* 키를 땔 때 호출*/
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement); /* 카메라 컨트롤 클래스*/
  cameraControls.target.set(0, 50, 0); /* 컨트롤 지점의 앵글값 정의*/

  var configOgro = {
    baseUrl: "model/ogro/", body: "ogro.md2",skins: [ "grok.jpg"], weapons:  [ [ "weapon.md2", "weapon.jpg" ] ],
    animations: { move: "run", idle: "stand", jump: "jump", attack: "attack", crouchMove: "cwalk", crouchIdle: "cstand", crouchAttach: "crattack" },
    walkSpeed: 550, crouchSpeed: 175
  };/* 주입할 데이터 정보를 객체에 담음*/
  
  characters = new THREE.MD2CharacterComplex();  /* md2 모델파일을 불러오는 클래스*/
  characters.scale = 3; /* 스케일 정의*/
  characters.controls = controls; /* controls에 정의된 컨트롤러 감지 데이터를 주입*/
  
  var baseCharacter = new THREE.MD2CharacterComplex(); /* md2 모델파일을 불러오는 클래스*/
  baseCharacter.scale = 3; /* 스케일정의*/
  baseCharacter.onLoadComplete = function () {
    /* 로드된 md2 모델객체에 대한 속성정의*/
    var cloneCharacter = characters;
    cloneCharacter.shareParts(baseCharacter); /* 주입*/
    cloneCharacter.enableShadows(true); /* 쉐도우*/
    cloneCharacter.setWeapon(0); /* 바디에 붙을 오브젝트 무기*/
    cloneCharacter.setSkin(0); /* 데이터 정보에 주입된 스킨배열 넘버*/
    cloneCharacter.root.position.x = 150; /* 조정될 x값*/
    cloneCharacter.root.position.z = 250; /* 조정될 y값*/
    scene.add(cloneCharacter.root); /* 씬에 md2 모델을 에드함*/
    
    var gyro = new THREE.Gyroscope(); /* 카메라의 앵글 정의 클래스*/
    gyro.add(camera); /*gyro에 camera 에드함*/
    gyro.add(light, light.target); /* 라이트와 그의 벡터를 에드함*/
    characters.root.add(gyro); /* md2 모델 향해 어테치함*/
    
  };
  
  baseCharacter.loadParts(configOgro); /*정의된 속성들을 렌딩함*/
}

function onWindowResize(event) { /* 사이즈가 줄여질 떄 마다 카메라의  종횡비와 사이즈가 줄어듬*/
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT); /* 사이즈 설정*/
  camera.aspect = SCREEN_WIDTH/ SCREEN_HEIGHT; /* 종횡비 설정*/
  camera.updateProjectionMatrix();  /* 랜딩되는 요소들 리사이징 업뎃함*/
}

function onKeyDown (event) {
  event.stopPropagation();
  switch(event.keyCode) {
    case 38:
    case 87: controls.moveForward = true; break;
    case 40:
    case 83: controls.moveBackward = true; break;
    case 37:
    case 65: controls.moveLeft = true; break;
    case 39:
    case 68: controls.moveRight = true; break;
    case 67: controls.crouch = true; break;
    case 32: controls.jump = true; break;
    case 17: controls.attack = true; break;
  }
}

function onKeyUp (event) {
  event.stopPropagation();
  switch(event.keyCode) {
    case 38:
    case 87: controls.moveForward = false; break;
    case 40:
    case 83: controls.moveBackward = false; break;
    case 37:
    case 65: controls.moveLeft = false; break;
    case 39:
    case 68: controls.moveRight = false; break;
    case 67: controls.crouch = false; break;
    case 32: controls.jump = false; break;
    case 17: controls.attack = false; break;
  }
}

function render() { /* 렌딩함*/
  requestAnimationFrame(render);
  /* 위 함수는 우리가 브라우저 탭을 이동하거나 할때 프레임을 정지시켜준다함 브라우저가 받는 부담과 배터리를 아껴줌*/
  
  var delta = clock.getDelta(); /* 렌딩이후 경과 초 리턴*/
  cameraControls.update(delta); /* 카메라 앵글 빛계열 속성 시간 경과에 따른 변화*/
  characters.update(delta); /* md2모델 빛계열 속성 시간 경과에 따른 변화*/
  renderer.render(scene, camera); /* 컨테이너안에 입혀진 렌더러란 돔 내부의 씬과 카메라를 렌딩시킴*/
}