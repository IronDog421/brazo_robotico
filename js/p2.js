var renderer, scene, camera;
var cameraControls;
var angulo = -0.01;

var gui;
var isAnimating = false;
var animStart = 0;
var animTotalMs = 0;
var startPose = null;
var endPose = null;

var controls = {
  giroBase: 0,
  giroBrazo: 0,
  giroAnteY: 0,
  giroAnteZ: 0,
  giroPinza: 0,
  apertura: 0,
  alambres: false,
  animSeconds: 6,
  Anima: function(){
    startPose = {
      giroBase:  controls.giroBase,
      giroBrazo: controls.giroBrazo,
      giroAnteY: controls.giroAnteY,
      giroAnteZ: controls.giroAnteZ,
      giroPinza: controls.giroPinza,
      apertura:  controls.apertura
    };
    endPose = {
      giroBase:  120,
      giroBrazo: 35,
      giroAnteY: 150,
      giroAnteZ: -70,
      giroPinza: 180,
      apertura:  12
    };
    isAnimating = true;
    animStart = performance.now();
    animTotalMs = Math.max(1, controls.animSeconds * 1000);
  }
};

var robotRef, baseRef, brazoRef, antebrazoRef, manoRef;
var pinzaIzRef, pinzaDeRef;
var pinzaY_L0 = 0, pinzaY_R0 = 0;

init();
loadScene();
setupGUI();
render();

function init()
{
  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setClearColor( new THREE.Color(0xFFFFFF) );
  document.getElementById('container').appendChild( renderer.domElement );

  scene = new THREE.Scene();

  var aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera( 50, aspectRatio , 0.1, 1000 );
  camera.position.set( 300, 300, 300 );

  cameraControls = new THREE.OrbitControls( camera, renderer.domElement );
  cameraControls.target.set( 0, 0, 0 );
  cameraControls.update();
  window.addEventListener('resize', updateAspectRatio );
}

function loadScene() {
    let blackMaterial = new THREE.MeshBasicMaterial({ color: 0x819efc });
    let yellowMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    let redMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    let blueMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    let greenMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    let transparentMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 1 });

    let floor = new THREE.Mesh(new THREE.BoxGeometry(1000, 0, 1000), blackMaterial);
    scene.add(floor);

    let robot = new THREE.Object3D();
    scene.add(robot);

    let base = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 15, 32), transparentMaterial);
    base.position.setY(7.5);
    robot.add(base);

    let brazo = new THREE.Object3D();
    base.add(brazo);

    let eje = new THREE.Mesh(new THREE.CylinderGeometry(20, 20, 18, 32), transparentMaterial);
    eje.rotateX(Math.PI / 2);
    brazo.add(eje);

    let esparrago = new THREE.Mesh(new THREE.BoxGeometry(18, 120, 12), blueMaterial);
    esparrago.position.setY(60);
    brazo.add(esparrago);

    let rotule = new THREE.Mesh(new THREE.SphereGeometry(20, 20, 20), transparentMaterial);
    rotule.position.setY(120)
    brazo.add(rotule)

    let antebrazo = new THREE.Object3D();
    antebrazo.position.setY(120);
    brazo.add(antebrazo);

    let disco = new THREE.Mesh(new THREE.CylinderGeometry(22, 22, 6, 32), transparentMaterial);
    antebrazo.add(disco);

    let nervio1 = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4), redMaterial);
    nervio1.position.set(8, 40, 8);
    antebrazo.add(nervio1);
    let nervio2 = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4), redMaterial);
    nervio2.position.set(-8, 40, 8);
    antebrazo.add(nervio2);
    let nervio3 = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4), redMaterial);
    nervio3.position.set(8, 40, -8);
    antebrazo.add(nervio3);
    let nervio4 = new THREE.Mesh(new THREE.BoxGeometry(4, 80, 4), redMaterial);
    nervio4.position.set(-8, 40, -8);
    antebrazo.add(nervio4);

    let mano = new THREE.Mesh(new THREE.CylinderGeometry(15, 15, 40, 32), greenMaterial);
    mano.rotateX(Math.PI / 2);
    mano.position.setY(80);
    antebrazo.add(mano);

    let paralelepipediz = new THREE.Mesh(new THREE.BoxGeometry(19, 4, 20), redMaterial)
    paralelepipediz.translateX(10)
    paralelepipediz.translateY(8)

    let geometry = new THREE.BufferGeometry();

    const vertices = new Float32Array([
        0, 0, 4,
        19, 2, 4,
        19, 18, 4,
        0, 20, 4,
        0, 0, 0,
        19, 2, 0,
        19, 18, 0,
        0, 20, 0,
    ]);

    const indices = [
      0, 1, 2,
      0, 2, 3,
      4, 6, 5,
      4, 7, 6,
      1, 5, 6,
      1, 6, 2,
      0, 3, 7,
      0, 7, 4,
      3, 2, 6,
      3, 6, 7,
      0, 4, 5,
      0, 5, 1
    ];

    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(indices);

    let pinzaiz = new THREE.Mesh(geometry, redMaterial);
    pinzaiz.rotateX(Math.PI/2)
    pinzaiz.translateX(9.5)
    pinzaiz.translateY(-10)
    pinzaiz.translateZ(-2)
    paralelepipediz.add(pinzaiz);
    mano.add(paralelepipediz);

    let paralelepipedde = paralelepipediz.clone();
    paralelepipedde.translateY(-20)
    mano.add(paralelepipedde);

    var axes = new THREE.AxesHelper( 200 );
    scene.add(axes);

    robotRef      = robot;
    baseRef       = base;
    brazoRef      = brazo;
    antebrazoRef  = antebrazo;
    manoRef       = mano;
    pinzaIzRef    = paralelepipediz;
    pinzaDeRef    = paralelepipedde;
    pinzaY_L0     = pinzaIzRef.position.y;
    pinzaY_R0     = pinzaDeRef.position.y;
}

function setupGUI(){
  gui = new dat.GUI();

  const f1 = gui.addFolder('rotaciones');
  f1.add(controls, 'giroBase',  -180, 180).name('Base Y').listen();
  f1.add(controls, 'giroBrazo',  -45,  45).name('Brazo Z').listen();
  f1.add(controls, 'giroAnteY', -180, 180).name('Antebrazo Y').listen();
  f1.add(controls, 'giroAnteZ',  -90,  90).name('Antebrazo Z').listen();
  f1.add(controls, 'giroPinza',  -40, 220).name('Mano Z').listen();
  f1.open();

  const f2 = gui.addFolder('Pinzas');
  f2.add(controls, 'apertura', -15, 15, 0.1).name('Apertura').listen();
  f2.open();

  const f3 = gui.addFolder('Varios');
  f3.add(controls, 'alambres').name('alambres');
  f3.add(controls, 'animSeconds', 1, 20, 1).name('Duración (s)');
  f3.add(controls, 'Anima').name('Anima');
  f3.open();
}

function updateAspectRatio()
{
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function degToRad(d){ return THREE.MathUtils.degToRad(d); }
function lerp(a,b,t){ return a + (b - a) * t; }
function lerpPose(a,b,t){
  return {
    giroBase:  lerp(a.giroBase,  b.giroBase,  t),
    giroBrazo: lerp(a.giroBrazo, b.giroBrazo, t),
    giroAnteY: lerp(a.giroAnteY, b.giroAnteY, t),
    giroAnteZ: lerp(a.giroAnteZ, b.giroAnteZ, t),
    giroPinza: lerp(a.giroPinza, b.giroPinza, t),
    apertura:  lerp(a.apertura,  b.apertura,  t),
  };
}
function applyPose(p){
  if (!robotRef) return;
  baseRef.rotation.y      = degToRad(p.giroBase);
  brazoRef.rotation.z     = degToRad(p.giroBrazo);
  antebrazoRef.rotation.y = degToRad(p.giroAnteY);
  antebrazoRef.rotation.z = degToRad(p.giroAnteZ);
  manoRef.rotation.z      = degToRad(p.giroPinza);
  pinzaIzRef.position.y   = pinzaY_L0 + p.apertura;
  pinzaDeRef.position.y   = pinzaY_R0 - p.apertura;
}

function update()
{
  cameraControls.update();

  if (!robotRef) return;

  if (isAnimating){
    const now = performance.now();
    let p = (now - animStart) / animTotalMs;
    if (p >= 1){
      isAnimating = false;
      p = 1;
    }
    let half = p < 0.5;
    let t = half ? (p*2) : (2*(1-p));
    t = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3) / 2;

    const pose = lerpPose(startPose, endPose, t);

    controls.giroBase  = pose.giroBase;
    controls.giroBrazo = pose.giroBrazo;
    controls.giroAnteY = pose.giroAnteY;
    controls.giroAnteZ = pose.giroAnteZ;
    controls.giroPinza = pose.giroPinza;
    controls.apertura  = pose.apertura;

    applyPose(pose);
  } else {
    applyPose(controls);
  }

  scene.traverse(function(obj){
    if (obj.isMesh){
      var mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (var i=0;i<mats.length;i++){
        mats[i].wireframe = !!controls.alambres;
      }
    }
  });
}

function render()
{
	requestAnimationFrame( render );
	update();
	renderer.render( scene, camera );
}
