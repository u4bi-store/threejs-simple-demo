var container;
/* webgl이 표출할 공간 정의 */
var camera, scene, renderer;
/* 총 3가지 구성요소가 필요함.
   카메라, 씬, 렌더러
*/

var stone_flag =0; /* 스톤 컬러 플랙 */
var pos ={

    margin :{
        x : -45,
        y : -45,
    }
};

window.onload = init; /* 돔 생성시 초기화 구문 */

function init(){
    var container = document.getElementById('container');
    /* 컨테이너란 아이디를 가진 돔을 참조함 */

    scene = new THREE.Scene(); /* 모든 요소를 담을 씬을 생성함 */
    /* 관련 레퍼런스
        https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
        
        fov — Camera frustum vertical field of view.
        aspect — Camera frustum aspect ratio.
        near — Camera frustum near plane.
        far — Camera frustum far plane.
    */
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 1000);
    /* 화면을 가리킬 카메라를 정의함 */

    camera.position.x = 0;
    camera.position.y = 80;
    camera.position.z = 80; /* 카메라의 xyz 축을 지정함 */
    camera.lookAt(scene.position); /* 카메라의 앵글이 씬의 좌표를 가리킴 */

    renderer = new THREE.WebGLRenderer(); /* 랜더러를 WebGL로 생성함 */
    renderer.setClearColor(0xFFFFFF, 1.0); /* 랜딩되는 배경을 깔아줄 컬러 검은색 */
    renderer.setSize(window.innerWidth, window.innerHeight);

    /** 기하체를 넣은 공간 일단 잘되는지 테스트해보자 
    
    관련 레퍼런스
        https://threejs.org/docs/#Reference/Geometries/SphereGeometry
        
    */
    
    var stoneColor = [ 0x000000,0xFFFFFF ];

    for(var i=0; i < 19; i++){

        for(var k=0; k < 19; k++){
            var omokStoneGeometry = new THREE.SphereGeometry( 2, 4, 6); /* 원형 기하체 생성함 radius, widthSegments, heightSegments, */
            var omokStoneMaterial = new THREE.MeshBasicMaterial( {color: stoneColor[stone_flag]} );
            var omokMaterial = new THREE.MeshNormalMaterial(); /* 컬러 지정함 */
            var omokStone = new THREE.Mesh(omokStoneGeometry, omokStoneMaterial); /* 기하체와 컬러 주입해서 객체 나타냄 */
            
            omokStone.position.x = (i*5) + pos.margin.x;
            omokStone.position.z = (k*5) + pos.margin.y;
            omokStone.position.y = 2;

            scene.add(omokStone); /* 나타낸 객체 씬에 담음 */
            
            if(stone_flag)stone_flag = 0;
            else stone_flag =1;
        }
        
    }

    /* 오목판 */
    /*
    관련 레퍼런스
        https://threejs.org/docs/#Reference/Geometries/PlaneGeometry

        width — Width along the X axis.
        height — Height along the Y axis.
        widthSegments — Optional. Default is 1. 
        heightSegments — Optional. Default is 1.

    */
    omokBoardGeometry = new THREE.PlaneGeometry(100, 100);
    omokBoardGeometry.rotateX(- Math.PI / 2);
    omokBoardMaterial = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('images/omokBoard.jpg') } );

    omokBoard = new THREE.Mesh(omokBoardGeometry, omokBoardMaterial);
    omokBoard.rotation.x = 0;
    omokBoard.rotation.y = 0;

    scene.add(omokBoard);

    container.appendChild(renderer.domElement);/* 이 정의된 렌더러를 컨테이너에 주입함 */
    render(); /* 스크린 랜딩구문 */

}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera); /* 씬과 카메라를 주입받은 렌더러가 돈다 */   
}
