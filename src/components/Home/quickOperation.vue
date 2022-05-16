<template>
  <el-card class='el-card1'>
    <!-- 标题 -->
    <div slot="header">
      <span class="el-card-title">快捷操作</span>
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
    <!-- 新建按钮 -->
    <div class="often-control-box" v-if="role===1">
      <div class="often-control-item">
        <i class="iconfont icon-calendar-check"></i>
        <span @click="toLeave">报备申请</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-snippets"></i>
        <span @click="toRequest">进校申请</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-meeting"></i>
        <span @click="toSelect">选课</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-bell"></i>
        <span @click="toEnroll">学籍确认</span>
      </div>
    </div>

    <div class="often-control-box" v-else-if="role===2">
      <div class="often-control-item">
        <i class="iconfont icon-calendar-check"></i>
        <span @click="toScholarship">评奖审批</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-snippets"></i>
        <span @click="toHonor">评优审批</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-meeting"></i>
        <span @click="toPunish">违纪处分</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-bell"></i>
        <span @click="toLeaveCheck">报备审批</span>
      </div>
    </div>

    <div class="often-control-box" v-else-if="role===3">
      <div class="often-control-item">
        <i class="iconfont icon-calendar-check"></i>
        <span @click="toCourse">课程信息</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-snippets"></i>
        <span @click="toEnrollList">学籍列表</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-meeting"></i>
        <span @click="toScoreIn">成绩录入</span>
      </div>
      <div class="often-control-item">
        <i class="iconfont icon-bell"></i>
        <span @click="toNotice">公告信息</span>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: ['id', 'panelSetIcon', 'role'],
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
    },
    toLeave(){
      this.$router.push({path:"/affair/leave"})
    },
    toRequest(){
      this.$router.push({path:"/affair/request"})
    },
    toSelect(){
      this.$router.push({path:"/study/take_course"})
    },
    toEnroll(){
      this.$router.push({path:"/affair/enrollment"})
    },
    toScholarship(){
      this.$router.push({path:"/rp/scholarshipIns"})
    },
    toHonor(){
      this.$router.push({path:"/rp/honor"})
    },
    toPunish(){
      this.$router.push({path:"/rp/punish"})
    },
    toLeaveCheck(){
      this.$router.push({path:"/check/leaveCheck"})
    },
    toCourse(){
      this.$router.push({path:"/course/info"})
    },
    toEnrollList(){
      this.$router.push({path:"/enrollment/enrollmentInfo"})
    },
    toScoreIn(){
      this.$router.push({path:"/exam/score"})
    },
    toNotice(){
      this.$router.push({path:"/notice/infor"})
    },
  }
}
</script>

<style>
.el-card1 {
  height: 200px;
  width: 348%;

}
.el-icon-close {
  font-size: 1.2em;
  cursor: pointer;
}
.el-card-title {
  font-weight: bold;
}
.often-control-box {
  display: grid;
  grid-template-columns: repeat(2, 50%);
}
.often-control-box .often-control-item {
  height: 50px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #424e5c;
}
.often-control-item > i {
  color: #396aff;
  margin-right: 10px;
  font-size: 1.5em;
}
</style>
