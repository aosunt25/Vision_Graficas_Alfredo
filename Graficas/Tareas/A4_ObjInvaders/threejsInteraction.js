let container;
let camera, scene, raycaster, renderer;
let counter;
let mouse = new THREE.Vector2(), INTERSECTED, CLICKED;
let radius = 100, theta = 0;
let objectDestroy = 0;
let floorUrl = "../images/checker_large.gif";

let initAnim = true;
let runAnim = false;
let isPlay = false;



let startButton;
let resetButton;


//let resetButton = document.getElementByName( 'resetButtonId' );

// Start Button
function StartAnimation() {
    if (initAnim) {
     
        initAnim = false;
        runAnim = true;
        theta = 0;
    }
    // Start and Pause 
    if (runAnim) {
        document.getElementById("startButtonId").innerHTML = 'Pause';
        isPlay= true;
        runAnim = false;
        render();
    } 
    else {
        document.getElementById("startButtonId").innerHTML = 'Start';
        isPlay= false;
        runAnim = true;
    }
}

// Reset Button
 function ResetParameters() {
    isPlay = false;
    scene.children.forEach(obj =>{   
        let name = obj.name;
        if(name.charAt(0) == "C"){
            obj.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, -200, -200);
        }
    });
    for ( i = 0 ; i<10 ; i++){
        createObject();
    }    
    objectDestroy=0;
    document.getElementById ("contador").innerHTML = objectDestroy;

}

function createScene(canvas) 
{
    

    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(window.innerWidth, window.innerHeight);

    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
    console.log(camera.position);
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );
    
    let light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 );
    light.name = "light";
    scene.add( light );
    
    // floor

    let map = new THREE.TextureLoader().load(floorUrl);
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(8, 8);

    let floorGeometry = new THREE.PlaneGeometry( 2000, 2000, 100, 100 );
    let floor = new THREE.Mesh(floorGeometry, new THREE.MeshPhongMaterial({color:0xffffff, map:map, side:THREE.DoubleSide}));
    floor.rotation.x = -Math.PI / 2;
    scene.add( floor );

    let geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
    
    for (  counter = 0; counter < 10; counter ++ ) 
    {
        let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        object.name = 'Cube' + counter;
        object.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, -200);
        
        scene.add( object );
    }
    
    raycaster = new THREE.Raycaster();
        
    console.log(scene.children)
    document.addEventListener('mousedown', onDocumentMouseDown);
    document.getElementById("startButtonId").addEventListener("click", StartAnimation);
    document.getElementById("resetButtonId").addEventListener("click", ResetParameters);
    window.addEventListener( 'resize', onWindowResize);

    
}

function onWindowResize() 
{
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function createObject(){
    
    if(scene.children.length<=11){
        objectDestroy+=1;
        document.getElementById ("contador").innerHTML = objectDestroy;
        let geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
        let object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
        
        counter+=1;    
        object.name = 'Cube' + counter;
        object.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, -200);
        
        scene.add( object );
    }

    
}

function onDocumentMouseDown(event)
{
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    // find intersections
    raycaster.setFromCamera( mouse, camera );

    let intersects = raycaster.intersectObjects( scene.children );
    console.log(intersects);
    console.log("intersects", intersects);
    if ( intersects.length > 0 ) 
    {
        CLICKED = intersects[ intersects.length - 1 ].object;
        scene.remove(scene.getObjectByName(CLICKED.name));
        createObject();
    } 
    
}

function moveObjects(){
    
    scene.children.forEach(obj => {
        
        let dx = obj.position.x - camera.position.x;
        let dy = obj.position.y - camera.position.y;
        let dz = obj.position.z - camera.position.z;
        //Object moves X axes 
        if (obj.position.x > camera.position.x) {
            obj.position.x -= Math.min( 0.05, dx );    
        }
        else if(obj.position.x < camera.position.x){
            obj.position.x += Math.max( 0.05, dx );
        }
        //Object moves Y axes 
        if (obj.position.y > camera.position.y) {
            obj.position.y -= Math.min( 0.05, dy );
        }
        else if(obj.position.y < camera.position.y){
            obj.position.y += Math.max( 0.05, dy );
        }
        //Object moves Z axes  
        if(obj.position.z < camera.position.z){
            obj.position.z += Math.max( 0.1, dz );
        }
        if(obj.positionz == 0 && obj.position.y == 0 && obj.position.x == 0){
           
            scene.remove(scene.getObjectByName(obj.name));
            objectDestroy-=1;
            createObject();
        }
});
}

function run() 
{
    render();
    requestAnimationFrame(run);
    if(isPlay){
        moveObjects();
    } 
}

function render() 
{ 
    renderer.render( scene, camera );
}