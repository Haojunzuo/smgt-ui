<template>
  <div class="app-container">

    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" :disabled="check"/>
        </el-form-item>

      <el-row>
        <el-col :span="8">
          <el-form-item label="公告类型" prop="noticetype">
            <el-select v-model="form.noticetype" filterable placeholder="请选择" :disabled="check">
              <el-option
                v-for="(key,value) in typeMap"
                :key="value"
                :label="key"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="发布单位" prop="institution">
            <el-select v-model="form.institution" filterable placeholder="请选择" :disabled="check">
              <el-option
                v-for="(key,value) in institutionMap"
                :key="value"
                :label="key"
                :value="value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="是否紧急">
            <el-radio-group v-model="form.urgency" :disabled="check">
              <el-radio :label="'0'">一般</el-radio>
              <el-radio :label="'1'">紧急</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="公告内容" prop="content">
        <mavon-editor v-model="form.content"  class="formContent" :editable="!check" :subfield="!check" defaultOpen="preview" :toolbarsFlag="!check" />
      </el-form-item>

    </el-form>

    <div slot="footer" class="dialog-footer">

        <el-button type="success" @click="submitForm" :disabled="check">保存</el-button>
        <el-button type="primary" @click="createAndPublish" :disabled="check">发布</el-button>
        <el-button @click="cancel">取 消</el-button>
<!--      测试findIndex方法-->
<!--      <el-button @click="test">取 消</el-button>-->
    </div>

  </div>
</template>

<script>
import { addNotice, updateNotice, getNotice } from '@/api/admin/notice/notice'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'SubSystem',
  components: {
    mavonEditor
  },
  data() {
    return {
      check:true,
      total: 0,
      rules: {
        title: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blu'
          }
        ]
      },
      form: {},
      title: '新增公告',
      open: false,
      typeMap: { '0': '考务信息', '1': '教学安排', '2': '事务公示' },
      urgencyMap: { '0': '一般', '1': '紧急' },
      statusMap: { '0': '草稿', '1': '已发布' },
      institutionMap: { '0': '教务办', '1': '学工办', '2': '党委' },
      loading: false,
      noticeList: [],
      multiple: true,
      ids: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null
      }
    }
  },
  created() {
    const noticeId = this.$route.params.noticeId;
    const check = this.$route.query.check;
    this.check  = check !== '0'
    console.log("this.check:",this.check)
    console.log("noticeId：",noticeId,"check:",check)
    if (noticeId==='-1'){
      this.reset()
    }else{
      getNotice(noticeId).then(res=>{
        console.log(res)
        this.form = res.data;
      })
    }
  },
  watch: {},

  methods: {
    // 测试findIndex方法
    // test(){
    //   const list = ['1','2','3','4','5'];
    //   const i = list.findIndex(item=>{
    //     if (item==='2'){
    //       return true;
    //     }
    //   })
    //   console.log('i:',i)
    // },
    goBack() {

      this.$router.go(-1)// 返回
      //关闭子页面
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    cancel() {
      this.reset();
      this.goBack();
    },
    createAndPublish() {
      this.form.status = '1'
      this.submitForm()
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNotice(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.goBack();
            })
          } else {
            addNotice(this.form).then(response => {
              if (this.form.status === '0') {
                this.msgSuccess('已保存为草稿')
              } else {
                this.msgSuccess('已成功发布')
              }
              console.log(response)
              this.goBack();
            })
          }
        }
      })
    },

    showModel(row, str) {
      if (str === 'type') {
        return this.typeMap[row.noticetype]
      } else if (str === 'urgency') {
        return this.urgencyMap[row.urgency]
      } else if (str === 'status') {
        return this.statusMap[row.status]
      } else if (str === 'institution') {
        return this.institutionMap[row.institution]
      }
    },

    handleAdd() {
      this.reset()
      this.open = true
    },

    handleUpdate(row) {
      this.reset()
      const id = row.id || this.ids
      getNotice(id).then(response => {
        this.form = response.data
        this.title = '修改课程'
        this.open = true
      })
    },

    reset() {
      this.form = {
        id: null,
        noticeno: null,
        title: null,
        content: null,
        publisher: null,
        noticetime: null,
        noticetype: '0',
        file: null,
        urgency: '0',
        status: '0',
        institution: '0'

      }
      this.resetForm('form')
    }
  }
}
</script>
<style>
.dialog-footer {
  margin-top: 20px;
  text-align: center;
}
.formContent{
  height: 470px;
}
</style>
