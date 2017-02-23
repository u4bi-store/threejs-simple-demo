var setup = {
    width : window.innerWidth, /* 너비 */
    height : window.innerHeight, /* 높이 */
    aspect : window.innerWidth/window.innerHeight, /* 종횡비 */
    angle : 45, /* 벡터 앵글 */
    near : .1, /* 근처 */
    far : 10000, /* 두 지점 상의 거리 */
    mouse : { x: 0, y: 0}
};

var 
    contianer, renderer,
    camera, scene;

var box = []; /* 대망의 박스 */

var mouseVector = new THREE.Vector2();
var ray = new THREE.Raycaster();

function init() {

    /* 컨테이너 돔 */
    container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer(); /* web gl 로드 */

    renderer.setSize(setup.width, setup.height);
    container.appendChild(renderer.domElement);

    /* 카메라 관점 구성 */
    camera = new THREE.PerspectiveCamera(
        setup.angle,
        setup.aspect,
        setup.near,
        setup.far
    );
    
    camera.position.z = 400;

    /* 씬 정의 */
    scene = new THREE.Scene();
    scene.add(camera);
    
    /* 대망의 박스 3개 원소를 만들어 테스트해보기 */
    box[0] = createBox(20,20,20);
    box[0].position.x = 0;
    
    box[1] = createBox(20,20,20, 0xFF0000);
    box[1].position.x = 25;

    box[2] = createBox(20,20,20, 0xFFFF00);
    box[2].position.x = 50;

    for(var i =0; i<box.length; i++)scene.add(box[i]);

    /* 렌더러되는 돔 마우스 다운 이벤트 리스너 주입 */
    renderer.domElement.addEventListener( 'mousedown', onMouseDown );
}

/* 렌더 */
function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

/* 리스너 콜백 */
function onMouseDown(e) {
    e.preventDefault(); /* 해당 콜백이 울릴 시 다른 이벤트가 호출되지 않게 함 */
    
    /* 마우스의 좌표를 벡터3d로 정의 */
    setup.mouse.x = (e.clientX/window.innerWidth) * 2 - 1;
    setup.mouse.y = -(e.clientY/window.innerHeight) * 2 + 1;
    
    ray.setFromCamera(setup.mouse, camera);
    
    /* 포인터가 특정 오브젝트를 비춘 경우 */
    var intersects = ray.intersectObjects(scene.children);

    if(!intersects.length)return; /* 반환된 값이 없으면 리턴 */
    alert('대망의 박스 번호 : '+ intersects[0].object.id);
    console.log(intersects);
    /*  Array[1]
        0:Object
        distance: 393.56271689164174
        face: Face3
        faceIndex : 7~9
        object : Mesh
        point : Vector3
        uv : Vector2
    */
}


function createBox(x,y,z, col = 0xFFFFFF, opa = 1, trans = false){

    /* 기하체 구성 */
    var mat = new THREE.MeshBasicMaterial({'color':col, 'opacity': opa, 'transparent': trans});
    var geo = new THREE.BoxGeometry(x, y, z);

    /* 반환 */
    return new THREE.Mesh(geo, mat);
}

init();
render();