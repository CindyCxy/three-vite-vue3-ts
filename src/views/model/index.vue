<template>
  <div class="container">
    <div id="tag" class="tag" v-show="isTagShow">
      <dv-border-box8 class="dataVBorder" ref="dvBorder8">
        <span id="innerText">办公室</span>
      </dv-border-box8>
      <div class="arrow">
        <div class="line"></div>
        <div class="circle"></div>
      </div>
    </div>
    <button class="clickbutton" @click="clickModel.showAllTags">显示所有标签</button>
  </div>
</template>

<script lang="ts" setup>
import { BorderBox8 as DvBorderBox8 } from '@kjgl77/datav-vue3'
import ThreeJS from "./index";
import ClickModel from "./hooks/clickModel"
import { ref, onMounted, nextTick } from "vue";
let isTagShow = ref(false);

let clickModel: ClickModel | null = null;

//  由于在tag上绑定了v-show，会导致dvBorder8不能正常渲染，
//  所以设置ref来获取dvBorder8，使用dvBorder8.value.initWH()方法来初始化边框的尺寸，
//  该方法写在了clickModel类里面
let dvBorder8 = ref<InstanceType<typeof DvBorderBox8> | null>(null)
onMounted(() => {
  clickModel = new ClickModel();
  isTagShow.value = clickModel.isTagShow

  clickModel.tagBorderRef = dvBorder8;
});




</script>
<style scoped lang="scss">
.tag{
  height: 100px;
  width: 150px;
  background-color: rgba(35,95,167,0.8);
  border-radius: 5px;

  position: absolute;
  top: -160px;

  color: white;

}
.arrow{
  display: flex;
  flex-direction: column;
  align-items: center;
  .line{
    height: 70px;
    width: 2px;
    background-color: #4fd2dd;
  }
  .circle{
    width: 10px;
    height: 10px;
    background-color: #4fd2dd;
    border-radius: 50%;
  }
}
/*vue样式穿透*/
::v-deep .border-box-content{
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: "STZhongsong";

}
.clickbutton{
  width: 100px;
  height: 30px;
  background-color: #535bf2;
  color: white;
  position: absolute;
  top: 0px;
}
</style>