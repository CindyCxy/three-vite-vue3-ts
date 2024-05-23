import * as THREE from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {CSS2DRenderer} from "three/examples/jsm/renderers/CSS2DRenderer";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Object3D } from "three";

export default class ThreeJS {
    scene: THREE.Scene | null = null;
    camera: THREE.PerspectiveCamera | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    group: THREE.Group | null = null;
    ambientLight: THREE.AmbientLight | null = null;
    spotLight: THREE.SpotLight | null = null;
    controls: OrbitControls | null = null;
    css2DRenderer:CSS2DRenderer | null = null;
    planeGeometry: THREE.PlaneGeometry | null = null;
    meshLambertMaterial: THREE.MeshLambertMaterial | null = null;

    constructor() {
        this.init()
    }

    init(): void{
        // 第一步新建一个场景
        this.scene = new THREE.Scene();
        this.setCamera();
        this.setRenderer();
        this.group = new THREE.Group();
        this.setLight();
        this.setPlane();
        this.setControls();
        // this.setAxesHelper();
        // this.setGridHelper();
        this.setCSS2DRenderer();
        this.setGLTF();
        this.animate();
    }

    setCamera(): void{
        this.camera = new THREE.PerspectiveCamera(
            30,
            window.innerWidth / window.innerHeight,
            1,
            1000
        );
        this.camera.position.x = 40;
        this.camera.position.y = 40;
        this.camera.position.z = 80;
        this.camera.lookAt(0,0,0);
    }

    setRenderer(): void{
        this.renderer = new THREE.WebGLRenderer({antialias: true,precision:'highp',alpha:true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.body.appendChild(this.renderer.domElement);
    }

    setLight(): void{
        if(this.scene){
            this.ambientLight = new THREE.AmbientLight(0xffffff, 5);
            this.scene.add(this.ambientLight)

/*            this.spotLight = new THREE.SpotLight(0xfff000, 10,100,10);
            this.spotLight.position.set(100,100,100);
            this.spotLight.shadow.camera.near = 1;// 投影近点
            this.spotLight.shadow.camera.far = 8000;// 投影远点
            this.spotLight.shadow.camera.fov = 5000;// 视场有多大
            // this.spotLight.shadowCameraVisible = true;
            this.spotLight.lookAt(0,0,0);// 望向
            this.spotLight.castShadow = true; // 允许投射阴影
            this.spotLight.shadow.mapSize.width=2048;	// 阴影贴图宽度设置为2048像素
            this.spotLight.shadow.mapSize.height=2048;	// 阴影贴图高度设置为2048像素

            const helper = new THREE.CameraHelper( this.spotLight.shadow.camera );
            this.scene.add( helper );

            console.log(this.spotLight);

            this.scene.add(this.spotLight);*/
        }
    }

    setPlane(): void{
        this.planeGeometry = new THREE.PlaneGeometry(100, 80);
        //创建一个基本材质，并设置颜色
        const planeMaterial = new THREE.MeshBasicMaterial({color: 0xcccccc});
        //把两个对象合并到Mesh网格对象
        const plane = new THREE.Mesh(this.planeGeometry, planeMaterial);

        // 设置平面绕x轴旋转90度
        plane.rotation.x = -0.5 * Math.PI;
        // 设置平面的坐标位置
        plane.position.x = 0;
        plane.position.y = 0;
        plane.position.z = 0;

        plane.receiveShadow = true;

        // 将平面添加进场景
        this.scene?.add(plane);
    }

    render(): void{
        if(this.renderer && this.camera && this.scene){
            this.renderer.render(this.scene, this.camera);
        }
    }

    setControls(): void{
        if(this.camera && this.renderer){
            this.controls = new OrbitControls(this.camera, this.renderer.domElement);
            this.controls.maxPolarAngle = Math.PI/2; // 限制最大垂直旋转角度
            console.log('this.controls',this.controls)
        }
    }

    setAxesHelper(): void{
        const axesHelper = new THREE.AxesHelper(150);
        this.scene?.add(axesHelper);
    }

    setGridHelper(): void{
        const size = 100;
        const divisions = 50;
        const gridHelper = new THREE.GridHelper( size, divisions );
        this.scene?.add( gridHelper );
    }

    setCSS2DRenderer(): void{
        this.css2DRenderer = new CSS2DRenderer();

        this.css2DRenderer.setSize(window.innerWidth, window.innerHeight);
        this.css2DRenderer.domElement.style.position = 'absolute';
        this.css2DRenderer.domElement.style.top = '0px';
        this.css2DRenderer.domElement.style.pointerEvents = 'none';
        document.body.appendChild(this.css2DRenderer.domElement);
    }


    animate(): void{
        this.controls?.update();
        // 放到点击事件中渲染
        if (this.scene && this.camera && this.css2DRenderer) this.css2DRenderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate.bind(this));
        if(this.renderer && this.scene && this.camera) this.renderer.render(this.scene, this.camera);
    }

    //十六进制颜色随机
    color16(): string{
/*        let r = Math.floor(Math.random()*256);
        let g = Math.floor(Math.random()*256);
        let b = Math.floor(Math.random()*256);*/
        let {r, g, b} = Math.floor(Math.random()*256);
        let color = '#'+r.toString(16)+g.toString(16)+b.toString(16);
        return color;
    }


    setGLTF(): void{
        const loader = new GLTFLoader();
        loader.load('/static/model/model (2).glb',
            (gltf:GLTF)=>{
                console.log(gltf.scene)
                gltf.scene.traverse((child: Object3D) => {
                    if (child.isMesh) {
                        // child.material.emissive.setStyle('#ca14cb'); // 设置成紫色，支持css颜色值
                        child.frustumCulled = false;
                        //模型阴影
                        child.castShadow = true;
                        child.receiveShadow = true;
                        //模型材质

                        // console.log(child)


                        // 判断是否是模型中的标识文本模型，分别赋予不同的材质
                        if(child.name.includes('文本')){
                            child.material = new THREE.MeshLambertMaterial({
                                color:'#fff', // #1565C0
                            });
                        }else {
                            child.material = new THREE.MeshLambertMaterial({
                                color:'#1565C0',
                                // wireframe:true,
                                transparent:true,
                                opacity:0.7,
                            });

                            // 为模型添加线框
                            // 创建一个新的几何体
                            const edges = new THREE.EdgesGeometry(child.geometry);
                            const edgesMaterial = new THREE.LineBasicMaterial({
                                color:'#1590c0'
                            })
                            const line = new THREE.LineSegments(edges, edgesMaterial)
                            child.add(line)
                        }
                    }
                });

                this.group?.add(gltf.scene)
                this.scene?.add(this.group)

                // three.scene.add(gltf.scene)
                gltf.animations; // Array<THREE.AnimationClip>
                gltf.scene; // Object<THREE.Group> === gltf.scenes[0]
                gltf.scenes; // Array<THREE.Group>
                gltf.cameras; // Array<THREE.Camera>
                gltf.asset; // Object
            },
            (xhr)=>{
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
            },
            (err)=>{
                console.log(err)
            })
        this.render();
    }
}