var container;
/* webgl이 표출할 공간 정의 */
var camera, scene, renderer;
/* 총 3가지 구성요소가 필요함.
   카메라, 씬, 렌더러
*/


window.onload = init; /* 돔 생성시 초기화 구문 */

function init(){
    var container = document.getElementById('container');
    /* 컨테이너란 아이디를 가진 돔을 참조함 */

    scene = new THREE.Scene(); /* 모든 요소를 담을 씬을 생성함 */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    /* 화면을 가리킬 카메라를 정의함 */

    camera.position.x = 15;
    camera.position.y = 16;
    camera.position.z = 13; /* 카메라의 xyz 축을 지정함 */
    camera.lookAt(scene.position); /* 카메라의 앵글이 씬의 좌표를 가리킴 */

    renderer = new THREE.WebGLRenderer(); /* 랜더러를 WebGL로 생성함 */
    renderer.setClearColor(0x000000, 1.0); /* 랜딩되는 배경을 깔아줄 컬러 검은색 */
    renderer.setSize(window.innerWidth, window.innerHeight);

    /** 기하체를 넣은 공간
     *
     * 
     * 
     * 일단 잘되는지 테스트해보자 
     */

    container.appendChild(renderer.domElement);/* 이 정의된 렌더러를 컨테이너에 주입함 */

    render(); /* 스크린 랜딩구문 */
}

function render(){

    renderer.render(scene, camera); /* 씬과 카메라를 주입받은 렌더러가 돈다 */
}
