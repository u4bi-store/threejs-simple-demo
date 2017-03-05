
var camera;
var scene, renderer;

var root;

var container = document.getElementById('container');

init();
render();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0,0,200);

    scene = new THREE.Scene();

    root = new THREE.Object3D();
    var element = document.createElement( 'div' );
    element.innerHTML = '안녕하세요';
    element.style.width = '100px';
    element.style.height = '50px';
    element.style.opacity = 0.5;
    element.style.color = '#fff';
    element.style.background = 'red';

    var object = new THREE.CSS3DObject(element);
    
    root.add(object);
    scene.add(root);

    renderer = new THREE.CSS3DRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild(renderer.domElement);
}

function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}