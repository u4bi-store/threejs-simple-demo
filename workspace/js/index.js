if (!Detector.webgl)Detector.addGetWebGLMessage();
/* detector 모듈이 없을 시 호출 */

var container;
/* webgl이 표출할 공간 정의 */
var camera, scene, renderer;
/* 총 3가지 구성요소가 필요함.
   카메라, 씬, 렌더러
*/


init(); /* 돔 생성시 초기화 구문 */
render(); /* 스크린 랜딩구문 */

function init(){
    var container = ddocument.getElementById('container');
    /* 컨테이너란 아이디를 가진 돔을 참조함 */

}

function render(){

}
