<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item">
                <svg-icon icon-class="user" />用户名称
                <div class="pull-right">{{ user.nickName }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="phone" />手机号码
                <div class="pull-right">{{ user.phoneNumber }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="email" />用户邮箱
                <div class="pull-right">{{ user.email }}</div>
              </li>
              <li class="list-group-item" v-if="dept !== undefined && dept !== null && dept !== ''">
                <svg-icon icon-class="tree" />所属学院
                <div class="pull-right" >{{ dept}}</div>
              </li>
              <li class="list-group-item" v-if="className !== undefined && className !== null && className !== ''">
                <svg-icon icon-class="peoples" />所属班级
                <div class="pull-right">{{ className }}</div>
              </li>
              <li class="list-group-item">
                <svg-icon icon-class="date" />创建日期
                <div class="pull-right">{{ user.createTime }}</div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>基本资料</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane label="基本资料" name="userinfo">
              <userInfo :user="user" @refresh="getUser"/>
            </el-tab-pane>
            <el-tab-pane label="修改密码" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from "./userAvatar";
import userInfo from "./userInfo";
import resetPwd from "./resetPwd";
import { getInfo } from "@/api/login";
import { getStudent } from '@/api/student/student'

export default {
  name: "Profile",
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      dept: '',
      className: '',
      activeTab: "userinfo"
    };
  },
  created() {
    this.getUser();
  },
  methods: {
    getUser() {
      getInfo().then(response => {
        console.log(response.user)
        this.user = response.user;
        this.user.avatar === "" ? require("@/assets/images/profile.jpg") : this.user.avatar;
        if(this.user.role === 1){
          getStudent(this.user.userId).then(res=>{
            this.dept = res.data.collegeInfo.collegename
            this.className = res.data.classInfo.classname
          })
        }
      });
    }
  }
};
</script>
