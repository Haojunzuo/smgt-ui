<template>
  <div class="upload-file">
    <!--    {{fileList}}-->
    <el-upload
      :action="uploadFileUrl"
      :before-upload="handleBeforeUpload"
      :file-list="fileList"
      :limit="limit"
      multiple
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      :on-success="handleUploadSuccess"
      :show-file-list="false"
      :headers="headers"
      class="upload-file-uploader"
      ref="upload"
      :data="data"
    >
      <!-- 上传按钮 -->
      <el-button size="mini" type="primary">选取文件</el-button>
      <!-- 上传提示 -->
      <div class="el-upload__tip" slot="tip" v-if="showTip">
        请上传
        <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
        <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
        的文件
      </div>
    </el-upload>

    <!-- 文件列表 -->
    <transition-group class="upload-file-list el-upload-list el-upload-list--text" name="el-fade-in-linear" tag="ul">
      <li :key="file.uid" class="el-upload-list__item ele-upload-list__item-content" v-for="(file, index) in fileList">
        <el-link :href="file.url" :underline="false" target="_blank">
          <!--          <span class="el-icon-document"> {{ getFileName(file.name) }} </span>-->
          <span class="el-icon-document"> {{ file.name }} </span>
        </el-link>
        <div class="ele-upload-list__item-content-action">
          <el-link :underline="false" @click="handleDownload(index)" type="success">下载</el-link>
          <el-link :underline="false" @click="handleDelete(index)" type="danger">删除</el-link>
        </div>
      </li>
    </transition-group>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  import { delFile, downloadFile, getName} from "@/api/file";

  export default {
    name: "FileUpload",
    props: {
      data: {
        type: Object,
        default: {}
      },
      // 值
      value: [String, Object, Array],
      // 数量限制
      limit: {
        type: Number,
        default: 5,
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 5,
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ["doc", "xls", "ppt", "txt", "pdf"],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        uploadFileUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
        headers: {
          Authorization: "Bearer " + getToken(),
        },
        fileList: [],
        headUrl: "http://150.158.10.136:9000/"
      };
    },
    created() {
      if(this.value){
        let temp = 1;
        // 首先将值转为数组
        const list = Array.isArray(this.value) ? this.value : this.value.split(',');
        this.fileList = []
        for(let i=0;i<list.length;i++){
          getName({bucketName:this.data.bucket,fileName:list[i]}).then(res=>{
            console.log(res)
            let item = {name: res.data.description, url: this.headUrl+this.data.bucket+"/"+list[i], id: list[i]}
            item.uid = res.uid || new Date().getTime() + temp++;
            this.fileList.push(item)
          })
        }
      }else {
        this.fileList = [];
        return [];
      }
    },
    computed: {
      // 是否显示提示
      showTip() {
        return this.isShowTip && (this.fileType || this.fileSize);
      },
    },
    methods: {
      // 上传前校检格式和大小
      handleBeforeUpload(file) {
        // 校检文件类型
        if (this.fileType) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          const isTypeOk = this.fileType.some((type) => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
          if (!isTypeOk) {
            this.$message.error(`文件格式不正确, 请上传${this.fileType.join("/")}格式文件!`);
            return false;
          }
        }
        // 校检文件大小
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$message.error(`上传文件大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        return true;
      },
      // 文件个数超出
      handleExceed() {
        this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
      },
      // 上传失败
      handleUploadError(err) {
        this.$message.error("上传失败, 请重试");
      },
      // 上传成功回调
      handleUploadSuccess(res, file) {
        // this.$message.success("上传成功");
        setTimeout(() => {
          let temp = 1;
          let date = new Date().getTime() + temp++;
          this.fileList.push({ name: file.name, url: this.headUrl+this.data.bucket+"/"+res.msg, id: res.msg, uid: date});
          this.$emit("input", this.listToString(this.fileList));
        }, 500);
        this.$message.success("上传成功");
      },
      // 删除文件
      handleDelete(index) {
        delFile([this.data.bucket+"_"+this.fileList[index].id]).then(res=>{
          this.fileList.splice(index, 1);
          this.$emit("input", this.listToString(this.fileList));
        })
      },
      //下载文件
      handleDownload(index){
        downloadFile([this.data.bucket+"_"+this.fileList[index].id]).then(res=>{
          let blob = new Blob([res], {
            type: 'application/octet-stream;charset=utf-8'
          })
          // let objectUrl = URL.createObjectURL(blob);
          // window.location.href = objectUrl;
          const elink = document.createElement('a')
          elink.download = this.fileList[index].name
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        })
      },
      // 获取文件名称
      getFileName(name) {
        if (name.lastIndexOf("/") > -1) {
          return name.slice(name.lastIndexOf("/") + 1).toLowerCase();
        } else {
          return "";
        }
      },
      // 对象转成指定字符串分隔
      listToString(list, separator) {
        let strs = "";
        separator = separator || ",";
        for (let i in list) {
          strs += list[i].id + separator;
        }
        return strs !== '' ? strs.substr(0, strs.length - 1) : '';
      }
    }
  };
</script>

<style scoped lang="scss">
  .upload-file-uploader {
    margin-bottom: 5px;
  }
  .upload-file-list .el-upload-list__item {
    border: 1px solid #e4e7ed;
    line-height: 2;
    margin-bottom: 10px;
    position: relative;
  }
  .upload-file-list .ele-upload-list__item-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: inherit;
  }
  .ele-upload-list__item-content-action .el-link {
    margin-right: 10px;
  }
</style>
