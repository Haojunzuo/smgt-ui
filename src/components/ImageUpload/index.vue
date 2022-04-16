<template>
  <div class="component-upload-image">
    <!--    {{fileList}}-->
    <el-upload
      :action="uploadImgUrl"
      :data="data"
      list-type="picture-card"
      :on-success="handleUploadSuccess"
      :before-upload="handleBeforeUpload"
      :limit="limit"
      :on-error="handleUploadError"
      :on-exceed="handleExceed"
      name="file"
      multiple
      :on-remove="handleRemove"
      :show-file-list="true"
      :headers="headers"
      :file-list="fileList"
      :on-preview="handlePictureCardPreview"
      :class="{hide: this.fileList.length >= this.limit}"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      的文件
    </div>

    <el-dialog
      :visible.sync="dialogVisible"
      title="预览"
      width="800"
      append-to-body
    >
      <img
        :src="dialogImageUrl"
        style="display: block; max-width: 100%; margin: 0 auto"
      />
    </el-dialog>
  </div>
</template>

<script>
  import { getToken } from "@/utils/auth";
  import { delFile, getName} from "@/api/file";

  export default {
    props: {
      data: {
        type: Object,
        default: {}
      },
      value: [String, Object, Array],
      // 图片数量限制
      limit: {
        type: Number,
        default: 5,
      },
      // 大小限制(MB)
      fileSize: {
        type: Number,
        default: 50,
      },
      // 文件类型, 例如['png', 'jpg', 'jpeg']
      fileType: {
        type: Array,
        default: () => ["png", "jpg", "jpeg"],
      },
      // 是否显示提示
      isShowTip: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        dialogImageUrl: "",
        dialogVisible: false,
        hideUpload: false,
        uploadImgUrl: process.env.VUE_APP_BASE_API + "/file/upload", // 上传的图片服务器地址
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
            let item = {name: res.data.description, url: this.headUrl+this.data.bucket+"/"+list[i], id: list[i]}
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
      // 删除图片
      handleRemove(file, fileList) {
        delFile([this.data.bucket+"_"+file.id]).then(res=>{
          const findex = this.fileList.map(f => f.name).indexOf(file.name);
          this.fileList.splice(findex, 1);
          this.$emit("input", this.listToString(this.fileList));
        })
      },
      // 上传成功回调
      async handleUploadSuccess(res, file) {
        await setTimeout(() => {
          let temp = 1;
          let date = new Date().getTime() + temp++;
          this.fileList.push({ name: file.name, url: this.headUrl+this.data.bucket+"/"+res.msg, id: res.msg, uid: date});
          this.$emit("input", this.listToString(this.fileList));
        }, 500);
        this.loading.close();
      },
      // 上传前loading加载
      handleBeforeUpload(file) {
        let isImg = false;
        if (this.fileType.length) {
          let fileExtension = "";
          if (file.name.lastIndexOf(".") > -1) {
            fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
          }
          isImg = this.fileType.some(type => {
            if (file.type.indexOf(type) > -1) return true;
            if (fileExtension && fileExtension.indexOf(type) > -1) return true;
            return false;
          });
        } else {
          isImg = file.type.indexOf("image") > -1;
        }

        if (!isImg) {
          this.$message.error(
            `文件格式不正确, 请上传${this.fileType.join("/")}图片格式文件!`
          );
          return false;
        }
        if (this.fileSize) {
          const isLt = file.size / 1024 / 1024 < this.fileSize;
          if (!isLt) {
            this.$message.error(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
            return false;
          }
        }
        this.loading = this.$loading({
          lock: true,
          text: "上传中",
          background: "rgba(0, 0, 0, 0.7)",
        });
      },
      // 文件个数超出
      handleExceed() {
        this.$message.error(`上传文件数量不能超过 ${this.limit} 个!`);
      },
      // 上传失败
      handleUploadError() {
        this.$message({
          type: "error",
          message: "上传失败",
        });
        this.loading.close();
      },
      // 预览
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
        // console.log(file)
        // let a = document.createElement('a');
        // let event = new MouseEvent('click');
        // a.download = file.name;
        // a.href = file.url;
        // a.dispatchEvent(event);
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
  // .el-upload--picture-card 控制加号部分
  ::v-deep.hide .el-upload--picture-card {
    display: none;
  }
  // 去掉动画效果
  ::v-deep .el-list-enter-active,
  ::v-deep .el-list-leave-active {
    transition: all 0s;
  }

  ::v-deep .el-list-enter, .el-list-leave-active {
    opacity: 0;
    transform: translateY(0);
  }
</style>

