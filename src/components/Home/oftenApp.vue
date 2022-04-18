<template>
  <el-card>
    <!-- 标题 -->
    <div slot="header">
      <span class="el-card-title">课程表</span>
      <i
        v-show="!isPanelSetIcon"
        class="el-icon-close"
        style="float: right; padding: 3px 0"
        @click="deletePanelItem"
      ></i>
      <i
        v-show="isPanelSetIcon"
        class="iconfont icon-setting"
        style="float: right; padding: 3px 0"
      ></i>
    </div>
    <!-- 主体区域 -->
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
  font-size: 20px;
}
.el-card-subtitle{
  font-weight: bold;
  font-size: 15px;

}
.often-app-box {
  display: grid;
  grid-template-columns: repeat(8, 12.5%);
  cursor: pointer;
  justify-items: center;
  margin-top: 20px;
}
.often-app-box .often-app {
  display: flex;
  flex-direction: column;
  width: 100px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.often-app i {
  color: #fff;
  padding: 10px;
  font-size: 2em;
  border-radius: 4px;
}
.app-1 i {
  background: #29c814;
}
.app-2 i {
  background: #ffb339;
}
.app-3 i {
  background: #ff6b79;
}
.app-4 i {
  background: #00cde9;
}
.app-5 i {
  background: #39a0ff;
}
.app-title {
  margin-top: 10px;
}
</style>
