
var camera;
var scene, renderer;

var objects = [];
var root;

var pie = Math.PI,
    size = 50,
    margin = size/2;

var container = document.getElementById('container');

init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0,0,500);

    scene = new THREE.Scene();

    root = new THREE.Object3D();

    for(var i=6; i--;){
        var element = createElement('A'+i);
        
        objects[i] = new THREE.CSS3DObject(element);
        root.add(objects[i]);

        // objects[i].position.x +=i*100;
    }

    scene.add(root);
    // root.position.x = - 200;
    // ---------
    objects[0].rotation.x = pie /2;
    objects[1].rotation.y = pie /2;
    objects[2].rotation.x = pie /2;
    objects[3].rotation.y = pie /2;
    

    objects[0].position.y = margin;
    objects[2].position.y = -margin;


    objects[1].position.x += margin;
    objects[3].position.x += -margin;

    objects[4].position.z = margin;
    objects[5].position.z = -margin;
    

    // ---------

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    
    root.rotation.x+=0.05;
    root.rotation.y+=0.05;
}

function createElement(text){
    var element = document.createElement( 'div' );
    element.innerHTML = text;

    element.style.width = size+'px';
    element.style.height = size+'px';
    element.style.opacity = 0.5;
    element.style.color = '#fff';
    element.style.background = 'red';

    return element;
}