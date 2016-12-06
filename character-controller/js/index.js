/* character-controller index.js*/

if (! Detector.webgl) Detector.addGetWebGLMessage();

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var container, camera, scene, renderer;
var characters;
var nCharacters = 0;
var cameraControls;
var controls = {moveForward: false, moveBackward: false, moveLeft: false, moveRight: false};
var clock = new THREE.Clock();

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
  
  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
  cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  cameraControls.target.set(0, 50, 0);

  var configOgro = {
    baseUrl: "model/ogro/", body: "ogro.md2",skins: [ "grok.jpg"], weapons:  [ [ "weapon.md2", "weapon.jpg" ] ],
    animations: { move: "run", idle: "stand", jump: "jump", attack: "attack", crouchMove: "cwalk", crouchIdle: "cstand", crouchAttach: "crattack" },
    walkSpeed: 550, crouchSpeed: 175
  };
  
  characters = new THREE.MD2CharacterComplex();
  characters.scale = 3;
  characters.controls = controls;
  var baseCharacter = new THREE.MD2CharacterComplex();
  baseCharacter.scale = 3;
  baseCharacter.onLoadComplete = function () {
    var cloneCharacter = characters;
    cloneCharacter.shareParts(baseCharacter);
    cloneCharacter.enableShadows(true);
    cloneCharacter.setWeapon(0);
    cloneCharacter.setSkin(0);
    cloneCharacter.root.position.x = 150;
    cloneCharacter.root.position.z = 250;
    scene.add(cloneCharacter.root);
    
    var gyro = new THREE.Gyroscope();
    gyro.add(camera);
    gyro.add(light, light.target);
    characters.root.add(gyro);
    
  };
  
  baseCharacter.loadParts(configOgro);
}

function onWindowResize(event) {
  SCREEN_WIDTH = window.innerWidth;
  SCREEN_HEIGHT = window.innerHeight;
  renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
  camera.aspect = SCREEN_WIDTH/ SCREEN_HEIGHT;
  camera.updateProjectionMatrix();
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

function render() {
  requestAnimationFrame(render);
  var delta = clock.getDelta();
  cameraControls.update(delta);
  characters.update(delta);
  renderer.render(scene, camera);
}