<template>
  <el-card :class="{ panelBg: isPanelStyle }">
    <div class="personal-message-box">
      <div class="personal-top-box">
        <el-avatar :size="70" :src="src"></el-avatar>
        <div class="personal-content-box">
          <span class="user-title">{{name}}</span>
          <span>{{getRole(role)}}</span>
        </div>
      </div>
      <div class="btn-box">
        <span
          @click="exitEdit"
          v-show="isPanelStyle"
          :class="{ exitBtn: isPanelStyle }"
          >退出编辑</span>
        <span class="person-btn" v-show="!isPanelStyle">
          <router-link to="/user/profile">
            个人中心
          </router-link>
        </span>
        <span @click="editDesktop" v-show="!isPanelStyle" class="edit-btn"
          ><i style="margin-right: 5px;" class="iconfont icon-edit"></i
          >管理我的桌面
        </span>
      </div>
    </div>
  </el-card>
</template>

<script>
import {getInfo} from '@/api/login'
export default {
  props: ['id', 'editPersonStyle'],
  data () {
    return {
      panelId: this.id,
      isPanelStyle: this.editPersonStyle,
      src: '',
      name: '',
      role: ''
    }
  },
  created() {
    getInfo().then(res=>{
      const user = res.user
      this.src = user.avatar === "" ? require("@/assets/images/profile.jpg") : user.avatar;
      this.name = user.nickName
      this.role = user.role
    })
  },
  methods: {
    // 删除面板项发送事件
    deletePanelItem () {
      this.$emit('deletePanelItemEvent', this.panelId)
    },
    // 跳转管理界面事件
    editDesktop () {
      this.$emit('editDesktopEvent')
    },
    exitEdit () {
      this.$router.push('check')
    },
    getRole(role){
      console.log(role)
      if(role === 1) return '学生'
      else if(role === 2) return '辅导员'
      else return '教务处'
    }
  }
}
</script>

<style>
.el-card {
  height: 100%;
}
.personal-message-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.personal-message-box .personal-top-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.personal-message-box .personal-content-box {
  display: flex;
  margin-left: 10px;
  flex-direction: column;
}
.personal-message-box .user-title {
  margin-bottom: 10px;
  font-size: 1.5em;
  font-weight: bold;
}
.btn-box {
  display: flex;
  justify-content: center;
  width: 100%;
}
.btn-box .person-btn,
.edit-btn {
  flex: 0 0 50%;
  border: 1px solid #d7ddeb;
  border-radius: 4px;
  padding: 10px 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.9em;
}
.btn-box .person-btn {
  margin-right: 5px;
}
.btn-box .edit-btn {
  margin-left: 5px;
}
.panelBg {
  background-color: #d3d6dc !important;
  border: none !important;
}
.exitBtn {
  border: 1px solid #d7ddeb;
  border-radius: 4px;
  text-align: center;
  padding: 10px 50px;
  cursor: pointer;
  background-color: #fff;
}
</style>
