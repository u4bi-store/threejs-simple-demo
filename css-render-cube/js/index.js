
var camera;
var scene, renderer;

var objects = [];
var root;

var container = document.getElementById('container');

init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0,0,1000);

    scene = new THREE.Scene();

    root = new THREE.Object3D();

    for(var i=6; i--;){
        var element = createElement('A'+i);
        
        objects[i] = new THREE.CSS3DObject(element);
        root.add(objects[i]);

        objects[i].position.x +=i*100;
    }

    scene.add(root);
    root.position.x = - 300;

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function createElement(text){
    var element = document.createElement( 'div' );
    element.innerHTML = text;

    element.style.width = '50px';
    element.style.height = '50px';
    element.style.opacity = 0.5;
    element.style.color = '#fff';
    element.style.background = 'red';

    return element;
}