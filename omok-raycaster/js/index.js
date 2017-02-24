var
    container,
    camera, scene, renderer,
    pointer, boder, line,
    mouse, raycaster,
    client;

var omokArray = [];

window.onload = init;

function prop(){

    client = {
        camera : {
            pos : {
                x : 0,y : 0, flag : false
            }
        },
        pointer :{
            pos : {
                x : 0, y : 0
            },
            color : 0
        },
        raycaster : new THREE.Raycaster(),
        mouse     : new THREE.Vector2()
    }
}

function domset(){
    document.body.style.background = 'url("images/intro.jpg") fixed';
    document.body.style.backgroundSize ='100% 100%';
    
    notice = {
        start : document.getElementById('startButton'),
        white : document.getElementsByClassName('notice white'),
        black : document.getElementsByClassName('notice black'),
        prop  : 'inline-block'
    };

    startButton.addEventListener('click', function(e){
        notice.start.style.display = 'none'; 
        notice.white[0].style.display = notice.prop;
        notice.black[0].style.display = notice.prop;
        modeInit();
    });
}

function init() {
    prop();
    domset();
    render();
}

function modeInit(){
    divisionSetup();

    pointer = createStone(20, 4, 6);
    boder = boderLoader();
    omokArray.push(boder);
    line = lineLoader();

    scene.add(pointer);
    scene.add(boder);
    scene.add(line);

    modeEvent();
}

function modeEvent(){
    document.addEventListener( 'mousemove', pointerMove);
    document.addEventListener( 'mousemove', cameraControl);
    document.addEventListener( 'mousedown', dropStone);
    document.addEventListener('keydown', function(e){
        if(!client.camera.pos.flag)client.camera.pos.flag = true;
    });
    document.addEventListener('keyup', function(e){
        if(client.camera.pos.flag)client.camera.pos.flag = false;
    });
    document.addEventListener('wheel', function(e){
        camera.fov += e.deltaY * 0.05;
        camera.updateProjectionMatrix();
    });

    window.addEventListener('resize', windowResize,false);
}

function divisionSetup(){
    container = document.getElementById('container');
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0,900,900);
    camera.lookAt( new THREE.Vector3() );
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(0xFFFFFF);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    container.appendChild(renderer.domElement);
}

function createStone(x,y,z, col = 0, opa = 1, trans = false){
    var geo = new THREE.SphereGeometry(x, y, z);

    var mat = new THREE.MeshBasicMaterial({'color':col, 'opacity': opa, 'transparent': trans});
    return new THREE.Mesh(geo, mat);
}

function boderLoader(){
    var geo = new THREE.PlaneGeometry(1000, 1000);
    geo.rotateX(- Math.PI / 2);

    var mat = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture('images/omokBoard.jpg') } );
    return new THREE.Mesh(geo, mat);
}

function lineLoader(){
    var 
        size = 500,
        step = 50;

    var geo = new THREE.Geometry();

    for (var i=-size; i<=size; i+=step){
        geo.vertices.push(new THREE.Vector3(-size, 0, i));
        geo.vertices.push(new THREE.Vector3(size, 0, i));
        geo.vertices.push(new THREE.Vector3(i, 0, -size));
        geo.vertices.push(new THREE.Vector3(i, 0, size));
    }

    var mat = new THREE.LineBasicMaterial({color: 0xFF0000, opacity: 0.8, transparent:true});
    return new THREE.LineSegments(geo, mat);
}

function windowResize(){
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function cameraControl(e){
    if(!client.camera.pos.flag) return;
    e.preventDefault();

    client.camera.pos.x = e.clientX - window.innerWidth;
    client.camera.pos.y = e.clientY - window.innerHeight;

    camera.position.x += (client.camera.pos.x - camera.position.x)*0.95;
    camera.position.y += (-client.camera.pos.y - camera.position.y)*0.95;
    
    camera.lookAt(scene.position);
}
function pointerMove(e){
    client.pointer.pos.x = (e.clientX/window.innerWidth)*2-1;
    client.pointer.pos.y = -(e.clientY/window.innerHeight)*2+1;

    client.mouse.set(client.pointer.pos.x, client.pointer.pos.y);
    client.raycaster.setFromCamera(client.mouse, camera);

    var omoks = client.raycaster.intersectObjects(omokArray);
    if(!omoks.length)return;

    var omok = omoks[0];
    pointer.position.copy(omok.point).add(omok.face.normal);
    pointer.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    pointer.material.color.set(client.pointer.color);
}

function dropStone(e){
    var
        stoneColor = [0x000000,0xFFFFFF];
        
    (omokArray.length-1)%2 == 0 ? client.pointer.color = stoneColor[1] : client.pointer.color = stoneColor[0];
    console.log(omokArray.length);

    client.pointer.pos.x = (e.clientX/window.innerWidth)*2-1;
    client.pointer.pos.y = -(e.clientY/window.innerHeight)*2+1;

    client.mouse.set(client.pointer.pos.x, client.pointer.pos.y);
    client.raycaster.setFromCamera(client.mouse, camera);
    
    var omoks = client.raycaster.intersectObjects(omokArray);
    if(!omoks.length)return;

    var omok = omoks[0];
    console.log(omok);

    var stone = createStone(20, 4, 6, client.pointer.color);

    stone.position.copy(omok.point).add(omok.face.normal);
    stone.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    console.log('copy');

    scene.add(stone);
    omokArray.push(stone);
}

function render(){

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}