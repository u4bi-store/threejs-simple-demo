var container;
var camera, scene, renderer;
var plane, cube;
var mouse, raycaster, isShiftDown = false;

var rollOverMesh, rollOverMaterial;
var objects = [];

var geo, mat;

init();
render();

function init() {

    var container = document.getElementById('container');
    /* 컨테이너란 아이디를 가진 돔을 참조함 */

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(500,800,1300);
    camera.lookAt( new THREE.Vector3() );

    scene = new THREE.Scene(); /* 씬 객체 선언 */

    /* 현재 어디를 가리키고 있는지를 알려줄 기하체 */
    geo = new THREE.BoxGeometry(50,50,50);
    mat = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
    mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // 좌표 지정 500개
    var size = 500, step = 50;
    var geoPositon = new THREE.Geometry();

    for (var i=-size; i<=size; i+=step){
        /* 
            i가 사이즈의 반전값임 -500
            i가 size와같거나 size가 더 클 때까지
            i에 50씩 더해준다

            좌표만큼 포문을 돌린다 */

        geoPositon.vertices.push( new THREE.Vector3( - size, 0, i ) );
        geoPositon.vertices.push( new THREE.Vector3(   size, 0, i ) );
        geoPositon.vertices.push( new THREE.Vector3( i, 0, - size ) );
        geoPositon.vertices.push( new THREE.Vector3( i, 0,   size ) );
    }

    /* 라인 그리기 */
    var matLine = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent:true} );
    var line = new THREE.LineSegments( geoPositon, matLine );
    scene.add(line);

    /* 바닥 객체 크기 지정 */
    var geoPlan = new THREE.PlaneBufferGeometry( 1000, 1000 );
    geoPlan.rotateX(-Math.PI/2);
    
    /* 바닥생성 */
    plane = new THREE.Mesh(geoPlan, new THREE.MeshBasicMaterial( { visible: true }));

    scene.add(plane); /* 씬에 담음 */

    objects.push(plane); /* 오브젝트 객체 담음 */
    
    raycaster = new THREE.Raycaster();
    /* 레이 케스트 */
    
    mouse = new THREE.Vector2();
    /* 마우스 벡터값 */

    /* 렌더러 */
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setClearColor( 0xf0f0f0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );


    container.appendChild( renderer.domElement ); /* 컨테이너에 넣음 */
    document.addEventListener( 'mousemove', boxMove, false );
    document.addEventListener( 'mousedown', boxDown, false );
    /* */
}

function boxDown(e){
    event.preventDefault();
    mouse.set((event.clientX / window.innerWidth ) * 2 - 1, - (event.clientY / window.innerHeight ) * 2 + 1);
    raycaster.setFromCamera(mouse, camera);
    
    var intersects = raycaster.intersectObjects( objects );
    if (intersects.length > 0) {
        
        var intersect = intersects[0];
        var voxel = new THREE.Mesh(geo, mat);

        voxel.position.copy(intersect.point).add(intersect.face.normal);
        voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        
        scene.add(voxel);
        
        objects.push(voxel);
        render();
    }
}

/* 마우스 무브할 시 */
function boxMove(e) {
    e.preventDefault();

    mouse.set((e.clientX/window.innerWidth)*2-1,-(e.clientY/window.innerHeight)*2+1);
    /* 클라이언트의 해상도에 따른 X값
        나누기
            브라우저의 너비 곱하기 2,

       클라이언트의 해상도에 따른 Y값
        나누기
            브라우저의 높이 곱하기 2,
    */
    raycaster.setFromCamera(mouse,camera);
    /* 따라서 마우스가 무브될때마다 레이저의 방면이 업데이트 됨 */
    
    /* .setFromCamera(coords, camera)
        
        레이저가 나아갈 방면 정의
        레이저의 지점을 업데이트함

        coords — 2D coordinates of the mouse, in normalized device coordinates (NDC)---X and Y components should be between -1 and 1.
        camera — camera from which the ray should originate
    */

    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0){/* 반환된값이 들어있다면 */

        /* .intersectObjects(objects,recursive)

            objects — 광선과의 교차가 있는지를 검사함
            recursive — 트루인 경우 객체의 하위단을 모두 검사함 (선택사항 기본값 false)
            
            레이저와 오브젝트 사이의 모든 교차점을 검사함
            교차점에서 가장 가까운 거리를 캐치해서 반홤함

            반환값이 가장 가까운 거리의 교차점임.
         */
        
        var intersect = intersects[0];
        /* 반환된 값의 0번째를 intersect에 담음
        */

        mesh.position.copy(intersect.point).add(intersect.face.normal);
        /*  즉 현재 intersect의 벡터를 position으로 지정하고
            intersect의 겉면 색을 주입함
        */

        mesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
        /* https://threejs.org/docs/api/math/Vector3.html
            
            : HACK
            
        */
        
    }

    renderer.render(scene, camera); /* 렌딩함 */
}