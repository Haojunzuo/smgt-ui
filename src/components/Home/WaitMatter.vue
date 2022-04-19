<template>
  <el-card>
    <div slot="header">
      <span class="el-card-title">待办事项</span>
      <i
        v-show="!isPanelSetIcon"
        class="el-icon-close"
        style="float: right; padding: 3px 0"
        @click="deletePanelItem"
      ></i>
    </div>
    <div class="wait-matter-box">
      <div class="left-box">
        <span class="wait-total-title">待办总数</span>
        <span class="wait-total-num">56</span>
      </div>
      <div class="right-box">
        <div class="right-box-item">
          <i class="iconfont icon-gongwen right-box-icon-1"></i>
          <div class="item-box">
            <span>待提交</span>
            <span>10</span>
          </div>
        </div>
        <div class="right-box-item">
          <i class="iconfont icon-apartment right-box-icon-2"></i>
          <div class="item-box">
            <span>待确认</span>
            <span>10</span>
          </div>
        </div>
        <div class="right-box-item">
          <i class="iconfont icon-snippets right-box-icon-3"></i>
          <div class="item-box">
            <span>待查看</span>
            <span>10</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ['id', 'panelSetIcon'],
  data () {
    return {
      panelId: this.id,
      isPanelSetIcon: this.panelSetIcon
    }
  },
  methods: {
    // 删除面板项发送事件
    deletePanelItem () {
      this.$emit('deletePanelItemEvent', this.panelId)
    }
  }
}
</script>

<style>
.el-card {
  height: 100%;
}
.el-icon-close {
  font-size: 1.2em;
  cursor: pointer;
}
.el-card-title {
  font-weight: bold;
}
.wait-matter-box {
  display: grid;
  grid-template-columns: 1fr 3fr;
}
/* 左区域 */
.wait-matter-box .left-box {
  display: flex;
  flex-direction: column;
  border-right: 1px solid #D7DDEB;
  align-items: center;
}
.wait-matter-box .left-box .wait-total-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.wait-matter-box .left-box .wait-total-num {
  font-size: 36px;
  font-weight: bold;
}
/* 右区域 */
.wait-matter-box .right-box {
  display: grid;
  grid-template-columns: repeat(3, 33.3%);
}
.wait-matter-box .right-box .right-box-item {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.wait-matter-box .right-box-item .item-box {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}
.item-box span:nth-child(1) {
  font-size: 14px;
  margin-bottom: 5px;
}
.item-box span:nth-child(2) {
  font-size: 24px;
  font-weight: bold;
}
.wait-matter-box .right-box i {
  background-color: #F2F4F7;
  font-size: 1.5em;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  line-height: 40px;
  text-align: center;
}
.right-box-item .right-box-icon-1 {
  color: #FF394C;
}
.right-box-item .right-box-icon-2 {
  color: #396AFF;
}
.right-box-item .right-box-icon-3 {
  color: #39A0FF;
}
</style>
