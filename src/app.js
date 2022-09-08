import * as THREE from 'three';
import * as SkeletonUtils from './libs/three/jsm/utils/SkeletonUtils.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from '../node_modules/three/examples/jsm/loaders/DRACOLoader.js';
import { LightProbeGenerator } from '../node_modules/three/examples/jsm/lights/LightProbeGenerator.js';
import { RGBELoader } from '../node_modules/three/examples/jsm/loaders/RGBELoader.js';
//CSS
import './style.scss';
//Humble Hamster Images 
import i1 from './Images/Design_1.png';
import i2 from './Images/Design_3.png';
import c1 from './Models/Castle/Castle.gltf';
import h1 from './Models/hamsterWalking.glb';
//Texture Images 
import iF from './Images/cloudy/bluecloud_ft.jpg';
import iB from './Images/cloudy/bluecloud_bk.jpg';
import iU from './Images/cloudy/bluecloud_up.jpg';
import iD from './Images/cloudy/bluecloud_dn.jpg';
import iR from './Images/cloudy/bluecloud_rt.jpg';
import iL from './Images/cloudy/bluecloud_lf.jpg';



var scene, camera, mediaQuery; 
var hemiLight, lightProbe;
// let mixer;
const mixers = [];
var player = { height:190.8, speed:0.2, turnSpeed:Math.PI * 0.02 };
//Loading Screen Variables 
var loadingManager = null, MODELS_LOADED = false;
var Clock, delta = 0, controls;
var timer = 0, flag = 0;
var renderer;
// Models index
var meshes = {};
var models = {
	Castle: {
		obj:c1,
		mesh: null,
		anim: null
	},
	Hamster: {
		obj:h1,
		mesh: null,
		anim: null
	}
};

var rotAngle = 0.01;
//Particle System
var sphere;
//Stars 
var starsGeometry = new THREE.BufferGeometry();
var starsCount = 500;
var starsPos = new Float32Array(starsCount * 3);
var starsMesh;

//New Page Selection Function 
var modelUP = 0;
//Document Elements 
var div2, info, abt, cnt, pp, hID, hImage, m1;
//Info Button 
var infoDiv, abtDiv, cntDiv, ppDiv, menuDiv;
//Information Element Inside 
var infoHeader, infoDesc;
var abtHeader, abtDesc;
var cntHeader, cntDesc;
var ppHeader, ppDesc;
//Back Button 
var back;
var innerBack;
//Current Page 
var recentDiv;
let CubeEnv;
var sphereRotationFlag = 0;

var loadingScreenImage;

//To initialize scene 
function init() {


		
	Clock = new THREE.Clock();
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
	camera.position.set(0, player.height, 1010);
	camera.lookAt(new THREE.Vector3(0,player.height,0));

	
	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setClearColor( '#24779F', 1);
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = 1;
	renderer.outputEncoding = THREE.sRGBEncoding;

	controls = new OrbitControls(camera, renderer.domElement);
	
	controls.enableDamping = true;
	controls.dampingFactor = 0.04;
	controls.rotateSpeed = 0.6;
	controls.zoomSpeed = 1;
	controls.target.set(0,160,920);

	//Before Model and Navbar Loading Image is created in center of canvas 
	loadingScreenImage  = document.getElementById("LoadingScreen");
	var MainOverlay = document.createElement("div");
	MainOverlay.id = "LoadingPageOverlay";
	MainOverlay.classList.add("overlayMainImage");
	loadingScreenImage.appendChild(MainOverlay);

	var MainImageDiv = document.createElement("div");
	MainImageDiv.id = "LPImage";
	MainImageDiv.classList.add("LoadingImageDiv");
	MainOverlay.appendChild(MainImageDiv);

	var img = document.createElement("img");
	img.src=i1;
	img.id="Main Image";
	img.width = 450;
	img.height = 450;
	MainImageDiv.appendChild(img);

	mediaQuery = window.matchMedia('(max-width: 1300px)');

	
	loadingManager = new THREE.LoadingManager();
	loadingManager.onLoad = function(){
		MODELS_LOADED = true;
	};
	
	//Hemisphere Light 
	hemiLight = new THREE.HemisphereLight( 0xffeeb1, 0x080820, 3 );
	scene.add( hemiLight );

	// probe
	lightProbe = new THREE.LightProbe();
	lightProbe.intensity = 4;
	scene.add( lightProbe );


	const urls = [iF, iB, iU, iD, iR, iL];

	new THREE.CubeTextureLoader().load( urls, function ( cubeTexture ) {
		cubeTexture.encoding = THREE.sRGBEncoding;
		scene.background = cubeTexture;
		lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeTexture ) );
		cubeTexture.mapping = THREE.CubeRefractionMapping;
		CubeEnv = cubeTexture;
	} );

	
	//Particle Objects 
	sphere = new THREE.Object3D();
	var particleCount = 500;
	for(var i = 0 ; i < particleCount; i++)
	{
		var sphereGeometry = new THREE.SphereGeometry( 3, 32, 16 );
		var sphereMaterial = new THREE.MeshPhongMaterial( { 
			color: 0xffffff,  
			shininess: 100 
		} );
		var sphereP = new THREE.Mesh( sphereGeometry, sphereMaterial );
		const x = 2000 * Math.random() - 1000;
		const y = 2000 * Math.random() - 1000;
		const z = 2000 * Math.random() - 1000;
		sphereP.position.set(x,y,z);
		sphere.add( sphereP );
	}
	scene.add(sphere);
	
	

	//Stars 
	var material = new THREE.PointsMaterial({
		size: 10,
		color: '#30D5C8'
	});

	var j = 1;
	for(let i=0;i<starsCount * 3;i++)
	{
		if(j == 3)
		{
			starsPos[i] = Math.random() * (-800 - (-1000)) + (-1000);
			j = 0;
		}
		else{
			starsPos[i] = Math.random() * (2000 - (-2000)) + (-2000);
		}
		j++;
	}

	starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos,3));
	starsMesh = new THREE.Points(starsGeometry, material);
	scene.add(starsMesh);
	
	//Saving Model Loaders in Models Variable
	for( var _key in models ){
		(function(key){
			var dracoLoader = new DRACOLoader();
			var gltfLoader = new GLTFLoader(loadingManager);
			console.log(h1);
			gltfLoader.setDRACOLoader( dracoLoader );
			gltfLoader.load(models[key].obj, function(gltf){
				gltf.scene.envMap = CubeEnv;
				gltf.scene.needsUpdate = true;
				models[key].mesh = gltf.scene;
				models[key].anim = gltf.animations;
			});
			
		})(_key);
	}


	
	


	document.body.appendChild(renderer.domElement);
	animate();
}

// Runs when all resources are loaded
function onResourcesLoaded(){

	addNavbar();

	meshes["Hamster"] = SkeletonUtils.clone(models.Hamster.mesh);
	meshes["Hamster"].anisotropy = 10;
	if(mediaQuery.matches == true){
		meshes["Hamster"].position.set(-10,359.5,930);
	}
	else{
		meshes["Hamster"].position.set(-10,359.5,950);
	}
	
	meshes["Hamster"].scale.set(0.5,0.5,0.5);
	meshes["Hamster"].rotation.set(0,1.5,0);
	scene.add(meshes["Hamster"]);
	
	var mixer = new THREE.AnimationMixer(meshes["Hamster"]);
	var clip = THREE.AnimationClip.findByName(models.Hamster.anim, 'Armature.001|mixamo.com|Layer0.001 Retarget');
    var action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);

	meshes["Castle"] = SkeletonUtils.clone(models.Castle.mesh);
	meshes["Castle"].anisotropy = 10;
	if(mediaQuery.matches == true){
		meshes["Castle"].position.set(0,300,900);
	}
	else{
		meshes["Castle"].position.set(0,300,920);
	}
	
	meshes["Castle"].scale.set(3,3,3);
	meshes["Castle"].rotation.set(0,0,0);
	scene.add(meshes["Castle"]);

	var mixer = new THREE.AnimationMixer(meshes["Castle"]);
	var clip = THREE.AnimationClip.findByName(models.Castle.anim, 'BezierCurve.003Action');
    var action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);

	mixer = new THREE.AnimationMixer(meshes["Castle"]);
	var clip = THREE.AnimationClip.findByName(models.Castle.anim, 'BezierCurve.003Action.002');
    var action = mixer.clipAction(clip);
    action.play();
    mixers.push(mixer);

	
}

var textRndFlag = 0;
var textRndTimer = 0;
var loadingScreenBody;
var loaded = 0;
function textRendering()
{
	if(textRndFlag == 0)
	{
		loadingScreenImage.remove();
		
		loadingScreenBody = document.getElementById("LoadingScreenText");
		
		var startP = document.createElement("div");
		startP.classList.add("overlay2");
		startP.setAttribute("id","startPara");
		loadingScreenBody.appendChild(startP);

		var loadingStartPara = document.createElement("div");
		loadingStartPara.classList.add("LoadingParaDiv");
		loadingStartPara.setAttribute("id","startParaText");
		startP.appendChild(loadingStartPara);
		
		var header = document.createElement("h");
		header.innerText = "Get ready for";
		header.style.color = "#20c6b6";
		loadingStartPara.appendChild(header);

		var header2 = document.createElement("h");
		header2.innerText = " Humble Hamster";
		header2.style.color = "rgb(255, 255, 255)";
		loadingStartPara.appendChild(header2);

		var header2 = document.createElement("h");
		header2.innerText = " Experience";
		header2.style.color = "#20c6b6";
		loadingStartPara.appendChild(header2);

		textRndFlag = 1;
	}
	else if(textRndTimer == 400 && textRndFlag == 1){
			loadingScreenBody.remove();
			onResourcesLoaded();
			loaded = 1;
			flag = 0;
	}
	else if(textRndTimer == 50 && textRndFlag == 1){
		document.getElementById("startParaText").classList.toggle("LoadingParaDiv--show");
	}
	else if(textRndTimer == 180 && textRndFlag == 1){
		document.getElementById("startParaText").classList.toggle("LoadingParaDiv--hide");
	}
	else if(textRndTimer == 200 && textRndFlag == 1){
		document.getElementById("startPara").remove();
		loadingScreenBody = document.getElementById("LoadingScreenText");
		
		var startP = document.createElement("div");
		startP.classList.add("overlay2");
		startP.setAttribute("id","startPara");
		loadingScreenBody.appendChild(startP);

		var loadingStartPara = document.createElement("div");
		loadingStartPara.classList.add("LoadingParaDiv");
		loadingStartPara.setAttribute("id","startParaText");
		startP.appendChild(loadingStartPara);
		
		var header = document.createElement("h");
		header.innerText = "There is a place,";
		header.style.color = "#20c6b6";
		loadingStartPara.appendChild(header);

		var header2 = document.createElement("h");
		header2.innerText = " above the world,";
		header2.style.color = "rgb(255, 255, 255)";
		loadingStartPara.appendChild(header2);

		var header2 = document.createElement("h");
		header2.innerText = " floating and timeless";
		header2.style.color = "#20c6b6";
		loadingStartPara.appendChild(header2);
	}
	else if(textRndTimer == 250 && textRndFlag == 1){
		document.getElementById("startParaText").classList.toggle("LoadingParaDiv--show");
	}
	else if(textRndTimer == 380 && textRndFlag == 1){
		document.getElementById("startParaText").classList.toggle("LoadingParaDiv--hide");
	}
}


function animate(){

	
 
	if(modelUP == 1)
	{
		if(meshes["Castle"].position.y < 300){
			meshes["Castle"].position.y += 1;
			meshes["Hamster"].position.y += 1;
			meshes["Castle"].rotation.y += rotAngle;
			meshes["Hamster"].rotation.y += rotAngle;
		}
		else
		{
			modelUP = 0;
		}
	}

	if(modelUP == -1)
	{
		if(mediaQuery.matches == true){
			if(meshes["Castle"].position.y > 90){
				meshes["Castle"].position.y -= 1;
				meshes["Hamster"].position.y -= 1;
				meshes["Castle"].rotation.y -= rotAngle;
				meshes["Hamster"].rotation.y -= rotAngle;
			}
			else
			{
				modelUP = 0;
			}
		}

		if(mediaQuery.matches == false){
			if(meshes["Castle"].position.y > 110){
				meshes["Castle"].position.y -= 1;
				meshes["Hamster"].position.y -= 1;
				meshes["Castle"].rotation.y -= rotAngle;
				meshes["Hamster"].rotation.y -= rotAngle;
			}
			else
			{
				modelUP = 0;
			}
		}
	}

	if(loaded == 1)
	{
		if(mediaQuery.matches == true){
			if(meshes["Castle"].position.y > 90){
				meshes["Castle"].position.y -= 1;
				meshes["Hamster"].position.y -= 1;
				// meshes["Castle"].rotation.y -= rotAngle;
				// meshes["Hamster"].rotation.y -= rotAngle;
			}
			if(meshes["Castle"].position.y <= 90){
				loaded = 0;
			}
		}

		if(mediaQuery.matches == false){
			if(meshes["Castle"].position.y > 110){
				meshes["Castle"].position.y -= 1;
				meshes["Hamster"].position.y -= 1;
				// meshes["Castle"].rotation.y -= rotAngle;
				// meshes["Hamster"].rotation.y -= rotAngle;
			}
			if(meshes["Castle"].position.y <= 110){
				loaded = 0;
			}
		}
		
	}
	sphere.rotation.x += 0.001;
	sphere.rotation.y += 0.001;
	if(sphereRotationFlag == 1){
		delta = Clock.getDelta();
		mixers.forEach(function(mixer) {
			mixer.update(delta);
		});
		
	}

	// Play the loading screen until resources are loaded.
	if( MODELS_LOADED == false ){
		requestAnimationFrame(animate);
		return;
	}
	else if(MODELS_LOADED == true && flag == 1)
	{
		textRendering();
		if(textRndTimer < 400){
			textRndTimer++;
		}
		else if (textRndTimer == 400){
			//Remove Text
			//document.getElementById("startParaText").remove();
		}
	}
	requestAnimationFrame(animate);

	

	if(timer < 100)
	{
		timer++;
		if(timer == 100)
		{
			flag = 1;
			sphereRotationFlag = 1;
		}
		else if(timer == 50)
		{
			document.getElementById("LoadingPageOverlay").classList.toggle("overlayMainImage--hidden");
		}
	}
	controls.update();
	renderer.render(scene, camera);
}

function onWindowResize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

//To create navbar and add up in top
function addNavbar()
{
	//After Model is Loaded then the navbar is added to the scene 
	var div1 = document.getElementById("Navbar");
	
	div2 = document.createElement("div");
	div2.id = "navbarInner"
	div2.classList.add("overlay1");

	
	//Home Page Image 
	hID = document.createElement("div");
	hID.classList.add("navbar5");
	div2.appendChild(hID);

	hImage = document.createElement("img");
	hImage.src=i2;
	hImage.id="Main Image";
	if(mediaQuery == false){
		hImage.width = 150;
		hImage.height = 150;
	}
	else{
		hImage.width = 200;
		hImage.height = 200;
	}
	hID.appendChild(hImage);
	
	//Hamburger Menu
	m1 = document.createElement("p");
	m1.addEventListener("click", menuClicked);
	m1.textContent += "MENU";
	m1.classList.add("navbar6");
	div2.appendChild(m1);

	div1.appendChild(div2);
}
//-------------------------------------------------------------------

//To create new page once a button is selection
function newPage()
{
	document.getElementById("navbarInner").remove();
	modelUP = 1;
}
//Recreate Home Page after returning from some other page 
function recreateHomePage()
{
	document.getElementById("Navbar").appendChild(div2);
	modelUP = -1;
}
//On Back 
function onBackPressed()
{
	if(menuDiv != null){
		menuDiv.remove();
		recreateHomePage();
		menuDiv = null;
	}
}
function renderBackButton()
{
	if(back == null)
	{
		back = document.createElement("div");
		back.classList.add("backButton");
		back.textContent += "BACK";
		back.addEventListener("click", onBackPressed);
		menuDiv.appendChild(back);
	}
	else
	{
		menuDiv.appendChild(back);
	}
}
//-------------------------------------------------------------------
//To create new page once a button is selection
function newMenuPage()
{
	menuDiv.remove();
}
//Recreate Menu Page After Comming Back from Menu Options
function recreateMenuPage()
{
	document.getElementById("NavbarElements").appendChild(menuDiv);
}
//On Inner Back 
function onInnerBackPressed()
{
	if(recentDiv != null){
		recentDiv.remove();
		recreateMenuPage();
		recentDiv = null;
	}
}
function renderInnerBackButton()
{
	if(innerBack == null)
	{
		innerBack = document.createElement("div");
		innerBack.classList.add("backButton");
		innerBack.textContent += "BACK";
		innerBack.addEventListener("click", onInnerBackPressed);
		recentDiv.appendChild(innerBack);
	}
	else
	{
		recentDiv.appendChild(innerBack);
	}
}


//On Clicking Elements in Navbar 

function menuClicked()
{
	newPage();
	if(menuDiv == null){
		var nE = document.getElementById("NavbarElements");
		menuDiv = document.createElement("div");
		menuDiv.classList.add("overlay3");
		nE.appendChild(menuDiv);

		//Info
		info = document.createElement("p");
		info.addEventListener("click", infoClicked);
		info.textContent += "INFO";
		info.classList.add("navbar1");
		menuDiv.appendChild(info);
		//About Us
		abt = document.createElement("p");
		abt.addEventListener("click", abtClicked);
		abt.textContent += "ABOUT US";
		abt.classList.add("navbar2");
		menuDiv.appendChild(abt);
		//Contact US
		cnt = document.createElement("p");
		cnt.addEventListener("click", cntClicked);
		cnt.textContent += "CONTACT US";
		cnt.classList.add("navbar3");
		menuDiv.appendChild(cnt);
		//Privacy Policy
		pp = document.createElement("p");
		pp.addEventListener("click", ppClicked);
		pp.textContent += "PRIVACY POLICY";
		pp.classList.add("navbar4");
		menuDiv.appendChild(pp);


		}
	else
	{
		var nE = document.getElementById("NavbarElements");
		nE.appendChild(menuDiv);
		recentDiv = menuDiv;
	}
	renderBackButton();

}


function infoClicked()
{
	newMenuPage();
	if(infoDiv == null){
		var nE = document.getElementById("NavbarElements");
		infoDiv = document.createElement("div");
		infoDiv.classList.add("overlay3");
		nE.appendChild(infoDiv);
		recentDiv = infoDiv;


		//Info Header
		infoHeader = document.createElement("h1");
		infoHeader.textContent += "INFORMATION";
		infoHeader.classList.add("navbarInnerHeader");
		infoDiv.appendChild(infoHeader);

		//Info Description
		infoDesc = document.createElement("p");
		infoDesc.textContent += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		infoDesc.classList.add("container");
		infoDiv.appendChild(infoDesc);

	}
	else
	{
		var nE = document.getElementById("NavbarElements");
		nE.appendChild(infoDiv);
		recentDiv = infoDiv;
	}
	renderInnerBackButton();

}

function abtClicked()
{
	newMenuPage();
	if(abtDiv == null){
		var nE = document.getElementById("NavbarElements");
		abtDiv = document.createElement("div");
		abtDiv.classList.add("overlay3");
		nE.appendChild(abtDiv);
		recentDiv = abtDiv;

		abtHeader = document.createElement("h1");
		abtHeader.textContent += "ABOUT US";
		abtHeader.classList.add("navbarInnerHeader");
		abtDiv.appendChild(abtHeader);

		abtDesc = document.createElement("p");
		abtDesc.textContent += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		abtDesc.classList.add("container");
		abtDiv.appendChild(abtDesc);
	}
	else
	{
		var nE = document.getElementById("NavbarElements");
		nE.appendChild(abtDiv);
		recentDiv = abtDiv;
	}
	renderInnerBackButton();

}

function cntClicked()
{
	newMenuPage();
	if(cntDiv == null){
		var nE = document.getElementById("NavbarElements");
		cntDiv = document.createElement("div");
		cntDiv.classList.add("overlay3");
		nE.appendChild(cntDiv);
		recentDiv = cntDiv;

		cntHeader = document.createElement("h1");
		cntHeader.textContent += "CONTACT US";
		cntHeader.classList.add("navbarInnerHeader");
		cntDiv.appendChild(cntHeader);

		//
		cntDesc = document.createElement("p");
		cntDesc.textContent += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		cntDesc.classList.add("container");
		cntDiv.appendChild(cntDesc);
	}
	else
	{
		var nE = document.getElementById("NavbarElements");
		nE.appendChild(cntDiv);
		recentDiv = cntDiv;
	}
	renderInnerBackButton();

}

function ppClicked()
{
	newMenuPage();
	if(ppDiv == null){
		var nE = document.getElementById("NavbarElements");
		ppDiv = document.createElement("div");
		ppDiv.classList.add("overlay3");
		nE.appendChild(ppDiv);
		recentDiv = ppDiv;

		ppHeader = document.createElement("h1");
		ppHeader.textContent += "PRIVACY POLICY";
		ppHeader.classList.add("navbarInnerHeader");
		ppDiv.appendChild(ppHeader);

		//
		ppDesc = document.createElement("p");
		ppDesc.textContent += "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		ppDesc.classList.add("container");
		ppDiv.appendChild(ppDesc);
	}
	else
	{
		var nE = document.getElementById("NavbarElements");
		nE.appendChild(ppDiv);
		recentDiv = ppDiv;
	}
	renderInnerBackButton();

}

window.addEventListener( 'resize', onWindowResize, false );
window.onload = init;




