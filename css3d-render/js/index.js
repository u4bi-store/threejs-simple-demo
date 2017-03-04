
var camera;
var scene2, renderer2;

var controls;
var container = document.getElementById('container');

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.set( 200, 200, 200 );
    controls = new THREE.TrackballControls( camera );
    scene2 = new THREE.Scene();

    var element = document.createElement( 'div' );
    element.innerHTML = '안녕하세요';
    element.style.width = '100px';
    element.style.height = '50px';
    element.style.opacity = 0.5;
    element.style.color = '#fff';
    element.style.background = 'red';

    var object = new THREE.CSS3DObject( element );
    object.position.x = 0;
    object.position.y = 0;
    object.position.z = 0;
    object.rotation.x = 0;
    object.rotation.y = 0;
    object.rotation.z = 0;
    object.scale.x = 1;
    object.scale.y = 1;
    scene2.add( object );

    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize( window.innerWidth, window.innerHeight );
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    container.appendChild( renderer2.domElement );

}

function animate() {
    requestAnimationFrame( animate );
    controls.update();
    renderer2.render( scene2, camera );

}