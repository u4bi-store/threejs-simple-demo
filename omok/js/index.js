var container;
/* webgl이 표출할 공간 정의 */
var camera, scene, renderer;
/* 총 3가지 구성요소가 필요함.
   카메라, 씬, 렌더러
*/

var stone_flag =0; /* 스톤 컬러 플랙 */
var rotate_flag = false; /* 회전 유무 토클 */

var pos ={

    margin :{
        x : -45,
        y : -45
    },
    mouse :{
        x:0,
        y:0
    }
};

var posArray = [];

window.onload = init; /* 돔 생성시 초기화 구문 */
function init(){
    document.body.style.background = 'url("images/intro.jpg") fixed';
    document.body.style.backgroundSize ='100% 100%';
    
    var startButton = document.getElementById('startButton');
    var whiteStone = document.getElementsByClassName('notice white');
    var blackStone = document.getElementsByClassName('notice black');

    startButton.addEventListener('click', function(e){
        startButton.style.display = 'none';
        onOmokModeInit();

        var prop = 'inline-block'; 
        whiteStone[0].style.display = prop;
        blackStone[0].style.display = prop;
    });
}

function onOmokModeInit(){
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
            console.log(omokStone);

            scene.add(omokStone); /* 나타낸 객체 씬에 담음 */
            
            if(stone_flag)stone_flag = 0;
            else stone_flag =1;

            posArray.push({
                /* HACK : 조만간 처리
                   임시로 바둑돌의 좌표 x,y값 객체에 담음
                   추 후 바둑알 지정 위치 설정에 관한 고민중
                */
                id : omokStone.id,
                x : omokStone.position.x,
                y : omokStone.position.z
            });

        }
        
    }
    console.log(posArray); /* 총 361개의 돌자리가 잡힘 */
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
    
     document.addEventListener( 'mousemove', onMouseMove, false ); /* 마우스 움직일 때 호출*/
    // document.addEventListener( 'touchstart', touchStart, false ); /* 터치화면 누를 때 호출*/
    // document.addEventListener( 'touchmove', touchMove, false ); /* 터치화면을 움직일 때 호출*/
    document.addEventListener('keydown', function(e){ if(!rotate_flag)rotate_flag = true; });
    document.addEventListener('keyup', function(e){if(rotate_flag)rotate_flag = false; });
    document.addEventListener('wheel', function(e){  /* 마우스 휠로 줌을 표현 */
        camera.fov += e.deltaY * 0.05; /* 스크롤이 일어난 축적값에 따른 카메라 수직된 시점의 거리 조정*/
        camera.updateProjectionMatrix(); /* 랜딩되는 요소들 리사이징 업뎃함*/
    });

    render(); /* 스크린 랜딩구문 */
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera); /* 씬과 카메라를 주입받은 렌더러가 돈다 */

    if(rotate_flag){ /* 토클 활성화 시 카메라의 앵글값 변경*/
        camera.position.x += ( pos.mouse.x - camera.position.x)*0.05;
        camera.position.y += ( - pos.mouse.y - camera.position.y)*0.05;
    }
    camera.lookAt( scene.position);
    /* 카메라가 씬을 바라보게*/
}

function onMouseMove(e){
    /* 마우스가 움직이는 좌표를 향해 -window.innerWidth/2 만큼
       제외한 값으로 정의
    */
    pos.mouse.x = e.clientX - window.innerWidth / 2;
    pos.mouse.y = e.clientY - window.innerHeight / 2;
}