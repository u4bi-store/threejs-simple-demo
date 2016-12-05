/*bsic.js*/

/* 렌더링을 위한 오브젝트를 만들기 위해 세가지가 필요하다 함.
   scene, camera, renderer 장면 카메라 렌더러
*/

var scene = new THREE.Scene(); /* 씬 객체를 생성함*/
var camera = new THREE.PerspectiveCamera(50, 400/300, 0.1, 1000);
/* PerspectiveCamera(수직된 카메라의 시점, 종횡비의 값, 절투체와의 최소 간격, 절투체와의 최대 간격

fov — 카메라 수직된 시점의 거리
aspect — 가로 세로의 비율 종횡비의 값
near — 카메라와 절투체의 가까운 간격
far — 카메라와 절투체의 먼 간격
*/
var renderer = new THREE.WebGLRenderer();/* 웹GL을 지원하는 렌더러 생성*/

renderer.setSize(400, 300); /* 렌더링할 공간 너비와 높이 설정*/
document.body.appendChild(renderer.domElement);
render();

function render() {
	renderer.render( scene, camera );
}