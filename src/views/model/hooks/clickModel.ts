import ThreeJS from "../index";
import * as THREE from "three"
import {CSS2DObject} from "three/addons/renderers/CSS2DRenderer.js"
import { Ref, ref } from 'vue'
import { Intersection, Object3D } from "three";
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'


export default class ClickModel extends ThreeJS{
    mouse: THREE.Vector2 | null = null;
    chosenModel: Intersection<Object3D> | null = null;
    isTagShow: Boolean = false;
    tagBorderRef = ref<InstanceType<typeof DvBorderBox8> | null>(null);


    // tag上显示的参数
    POIName:String | null = null;
    peopleNum:Number | null = null;
    temp:Number = 0;


    constructor() {
        super();
        this.mouse = new THREE.Vector2();
        window.addEventListener('click',this.onMouseClick, false)
    }

    // 使用 getter 方法来动态计算 tagText 的值。每当 POIName 或 peopleNum 发生变化时，tagText 将重新计算。
    get tagText(): string{
        return `名称：${this.POIName}<br/>
                实时人数：${this.peopleNum}人<br/>
                实时室温：${this.temp}°C`;
    }

    updateData(name: string, num: number, temp: number): void {
        this.POIName = name;
        this.peopleNum = num;
        this.temp = temp;
    }

    log(): void{
        console.log('this.mouse',this.mouse)
    }

    onMouseClick = ( event ): void => {

        //将鼠标点击位置的屏幕坐标转换成threejs中的标准坐标

        // 注意mouse.y这个负号
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

        //新建一个三维单位向量 假设z方向就是0.5
        //根据照相机，把这个向量转换到视点坐标系
        let vector = new THREE.Vector3(this.mouse?.x, this.mouse?.y,0.5).unproject(this.camera);

        //在视点坐标系中形成射线,射线的起点向量是照相机， 射线的方向向量是照相机到点击的点，这个向量应该归一标准化。
        let raycaster = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

        // 获取tag的dom节点
        const div = document.getElementById('tag');
        const divLabel = new CSS2DObject(div);

        // 判断是否存在上一次选中的模型，存在则重置模型样式
        if(this.chosenModel !== null){
            console.log('重新设置上一次选中的模型！');
            this.resetModel(this.chosenModel);
        }

        // recursive: 如果为true，它还检查所有后代。否则，它只检查与对象的交点。预设值为true。
        // 此处将recursive设置为false，仅获取与射线相交的最外层模型
        const intersects = raycaster.intersectObjects( this.group.children[0].children, false );
        console.log(intersects)

        // 如果射线与模型相交，即有选中任一模型
        if(intersects.length > 0){
            // 判断与射线相交的第一个模型是否为文本模型
            let isText: Boolean;
            let index: Number;
            isText = intersects[0].object.name.includes('文本')
            isText?index = intersects.length - 1: index = 0 // 是文本模型，则让index为最后一个与射线相交的模型的序号

            // 实际想要选中的模型，例如：用户点击了“前台-文本”，但实际想要选中的模型为“前台”，则让模型“前台”为实际选中的模型
            this.chosenModel = intersects[index];


            // 设置tag的文本内容
            if(this.chosenModel?.point && this.chosenModel?.object.name){
                const pos = this.chosenModel.object.geometry.attributes.position;

                // 设置tag的位置
                // const {x,y,z} = this.chosenModel.point; // 鼠标位置的坐标
                // 模型局部坐标系第0个顶点的坐标
                // const x = pos.getX(0);
                // const y = pos.getY(0);
                // const z = pos.getZ(0);

                // 模型的世界坐标
                let getWorldPosition = new THREE.Vector3()
                const {x,y,z} = this.chosenModel.object.getWorldPosition(getWorldPosition)

                // console.log('点击坐标：',{x,y,z});
                // console.log('模型局部坐标系第0个顶点的坐标',pos.getX(0),pos.getY(0),pos.getZ(0))
                // console.log('getWorldPosition',this.chosenModel.object.getWorldPosition(getWorldPosition))
                divLabel.position.set(x, y, z);
                //  由于在tag上绑定了v-show，会导致dvBorder8不能正常渲染，
                //  所以设置ref来获取dvBorder8，使用dvBorder8.value.initWH()方法来初始化边框的尺寸，
                this.tagBorderRef.value?.initWH();


                // 设置tag的文本内容
                this.updateData(this.chosenModel.object.name, 10,27);
                // 找到tag标签最里层的dom，因为有<br/>，所以用innerHTML
                // divLabel.element.firstChild.lastChild.innerHTML = this.tagText;
                document.getElementById('innerText').innerHTML = this.tagText;
                this.scene.add(divLabel);
                this.css2DRenderer.render(this.scene, this.camera)
            }

            //将实际选中的模型的颜色设置为黄色
            this.chosenModel.object.material = new THREE.MeshLambertMaterial({
                color:0xfff000,
                transparent:true,
                opacity:0.7,
            })
        }else {
            this.isTagShow = false;
        }
    }

    // 重置模型材质
    resetModel(model):void {
        model.object.material = new THREE.MeshLambertMaterial({
            color:'#1565C0',
            // wireframe:true,
            transparent:true,
            opacity:0.7,
        });
    }

    showAllTags(): void{
        this.tagBorderRef.value.initWH();
        const div = document.getElementById('allTags');
        const divLabel = new CSS2DObject(div);
        divLabel.position.set(0,0,0);
        this.scene.add(divLabel);
        this.css2DRenderer.render(this.scene, this.camera)
    }
}