<template>
  <el-card>
    <div slot="header">
      <span class="el-card-title">督办提醒</span>
      <i
        v-show="!isPanelSetIcon"
        class="el-icon-close"
        style="float: right; padding: 3px 0"
        @click="deletePanelItem"
      ></i>
    </div>
    <div class="remind-box">
      <div class="remind-box-item">
        <div class="remind-content-box">
          <span class="remind-title">未超期</span>
          <span class="remind-num">8</span>
        </div>
        <el-progress
            class="line-progress"
            color="#E4E7ED"
            :show-text="false"
            :percentage="30"
            :stroke-width="8"
          ></el-progress>
      </div>
      <div class="remind-box-item">
        <div class="remind-content-box">
          <span class="remind-title">超期1天</span>
          <span class="remind-num">2</span>
        </div>
        <el-progress
            class="line-progress"
            color="#396AFF"
            :show-text="false"
            :percentage="20"
            :stroke-width="8"
          ></el-progress>
      </div>
      <div class="remind-box-item">
        <div class="remind-content-box">
          <span class="remind-title">超期2天</span>
          <span class="remind-num">4</span>
        </div>
        <el-progress
            class="line-progress"
            color="#FFB339;"
            :show-text="false"
            :percentage="30"
            :stroke-width="8"
          ></el-progress>
      </div>
      <div class="remind-box-item">
        <div class="remind-content-box">
          <span class="remind-title">超期3天</span>
          <span class="remind-num">6</span>
        </div>
        <el-progress
            class="line-progress"
            color="#FF394C"
            :show-text="false"
            :percentage="60"
            :stroke-width="8"
          ></el-progress>
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
.remind-box {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.remind-box .remind-box-item {
  margin-bottom: 15px;
}
.remind-box-item .line-progress{
  width: 80%;
}
.remind-box-item .remind-content-box {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.remind-box-item .remind-title {
  font-size: 14px;
  color: #8C8C8C;
}
.remind-box-item .remind-num {
  font-size: 18px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.85);
  margin-left: 10px;
}
</style>
