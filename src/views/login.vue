<template>
  <div class="login">
    <div class="login-form">
      <h3 class="title">学生跟随系统</h3>
      <p :style="titleStyle">{{title}}</p>
      <el-menu
        :default-active="'1'"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="#ecf2ff"
        text-color="#333"
        style="text-align: center;font-size: 14px;"
      >
        <el-menu-item index="1" style="width: 33%">学生</el-menu-item>
        <el-menu-item index="2" style="width: 33%">辅导员</el-menu-item>
        <el-menu-item index="3" style="width: 33%">教务处</el-menu-item>
      </el-menu>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-body">
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" type="text" auto-complete="off" placeholder="账号">
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </el-input>
        </el-form-item>
        <el-form-item prop="code" v-if="captchaOnOff">
          <el-input
            v-model="loginForm.code"
            auto-complete="off"
            placeholder="验证码"
            style="width: 70%"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" />
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img"/>
          </div>
        </el-form-item>
        <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
        <el-form-item style="width:100%;">
          <el-button
            :loading="loading"
            size="medium"
            type="primary"
            :style = buttonStyle
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">登 录</span>
            <span v-else>登 录 中...</span>
          </el-button>
          <div style="float: right;" v-if="register">
            <router-link class="link-type" :to="'/register'">立即注册</router-link>
          </div>
        </el-form-item>
      </el-form>
    </div>

    <!--  底部  -->
    <div class="el-login-footer">
      <span >Copyright © 2022 哈尔滨工程大学.</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg,getInfo } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from '@/utils/jsencrypt'
import store from "../store";

export default {
  name: "Login",
  data() {
    return {
      buttonStyle: "width:100%;background: #2dd074",
      titleStyle: 'text-align: center;color: #2dd074;font-size: 20px',
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        userName: "admin",
        password: "admin123",
        rememberMe: false,
        role: 1,
        code: "",
        uuid: ""
      },
      loginRules: {
        userName: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: false,
      redirect: undefined,
      title: '学生端'
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    },
    loginForm : {
      deep: true,
      handler: function () {
        if(this.loginForm.role === 1){
          this.title = '学生端'
        }else if(this.loginForm.role  === 2){
          this.title = '辅导员端'
        }else {
          this.title = '教务端'
        }
      }
    }
  },
  created() {
    this.getCode();
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then(res => {
        this.captchaOnOff = res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          // this.loginForm.uuid = res.uuid;
        }
      });
    },
    getCookie() {
      const userName = Cookies.get("userName");
      const password = Cookies.get("password");
      const role = Cookies.get("role");
      const rememberMe = Cookies.get('rememberMe')
      this.loginForm = {
        userName: userName === undefined ? this.loginForm.userName : userName,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        role: role === undefined ? this.loginForm.role : role,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("userName", this.loginForm.userName, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set("role", this.loginForm.role, { expires: 30 });
            Cookies.set('rememberMe', this.loginForm.rememberMe, { expires: 30 });
          } else {
            Cookies.remove("userName");
            Cookies.remove("password");
            Cookies.remove("role");
            Cookies.remove('rememberMe');
          }
          console.log(this.loginForm)
          this.loading = false;
          this.$store.dispatch("Login", this.loginForm).then((res) => {
            if(res.token!==undefined){
              getInfo().then(res=>{

              })
              console.log("res.token:",res.token)
              this.msgSuccess(res.msg)

              this.$router.push({ path: this.redirect || "/" }).catch(()=>{});
            }else {
              this.msgError(res.msg)
              this.loading = false
              this.getCode()
            }

          }).catch(() => {
            this.loading = false;
            if (this.captchaOnOff) {
              this.getCode();
            }
          });
        }
      });
    },
    handleSelect(data) {
      this.getCode();
      this.loginForm.role = parseInt(data)
      if(data === "1"){
        this.buttonStyle = "width:100%;background: #2dd074";
        this.titleStyle = "text-align: center;color: #2dd074;font-size: 20px";
      }else if (data === "2") {
        this.buttonStyle = "width:100%;background: #ffbe43";
        this.titleStyle = "text-align: center;color: #ffbe43;font-size: 20px";
      } else {
        this.buttonStyle = "width:100%;background: #4e84f8";
        this.titleStyle = "text-align: center;color: #4e84f8;font-size: 20px";
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/images/login-background.jpg");
  background-size: cover;
}
.title {
  margin: 20px auto 20px auto;
  text-align: center;
  color: #707070;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  .login-body {
    padding: 25px 25px 5px 25px;
    .el-input {
      height: 38px;
      input {
        height: 38px;
      }
    }
    .input-icon {
      height: 39px;
      width: 14px;
      margin-left: 2px;
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 25%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
