<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学期" prop="semester">
        <el-select v-model="queryParams.semester" placeholder="请选择学期" style="width: 180px">
          <el-option value="2015-2016-1" label="2015-2016-1"/>
          <el-option value="2015-2016-2" label="2015-2016-2"/>
          <el-option value="2016-2017-1" label="2016-2017-1"/>
          <el-option value="2016-2017-2" label="2016-2017-2"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-plus" type="primary" size="medium" @click="handleWeight">计算加权学习成绩</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-edit" type="primary" size="medium" @click="handleImport">导入综测成绩</el-button>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" type="success" size="medium" @click="handleTotal">计算总成绩</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="weightList">

      <el-table-column label="学期" align="center" prop="semester"/>
      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="学业加权成绩" align="center" prop="weightScore"/>
      <el-table-column label="综测成绩" align="center" prop="reScore"/>
      <el-table-column label="总成绩" align="center" prop="totalScore"/>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">提示：仅允许导入“xls”或“xlsx”格式文件！</div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitImportCourse">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { weight, total, listWeight } from '@/api/instructor/compute'

export default {
  name: 'SubSystem',
  data() {
    return {
      weightList:[],
      total: 0,
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        semester: '2015-2016-1',
        studentNo: null,
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/compute/re"
      },
    }
  },
  created() {
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    }
  },

  methods: {
// 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitImportCourse() {
      this.$refs.upload.submit();
    },

    handleWeight(){
      console.log(this.queryParams.semester)
      weight(this.queryParams.semester).then(res=>{
        // console.log(res)
        this.getList();
      })
    },
    handleImport(){
      this.upload.open = true;
    },
    handleTotal(){
      console.log(this.queryParams.semester)
      total(this.queryParams.semester).then(res=>{
        console.log(res)
        this.getList();
      })
    },
    cancel() {
      this.reset()
      this.open = false
    },
    getList() {
      this.loading = true
      listWeight(this.queryParams).then(response => {
        this.weightList = response.rows
        console.log(response)
        this.total = response.total
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.semester = null
      this.queryParams.scholarshipNo = null
      this.queryParams.status = null
      this.queryParams.studentNo = null
      this.handleQuery()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },

    showModel(row, str) {
      let name = null
      if (str === 'status') {
        this.statusList.find((obj) => {
          if (obj.id === row.status) {
            name = obj.name
          }
        })
      } else if (str === 'nation') {
        this.nationList.find((obj) => {
          if (obj.id === row.nation) {
            name = obj.info
          }
        })
      } else if (str === 'stuType') {
        this.stuTypeList.find((obj) => {
          if (obj.id === row.stuType) {
            name = obj.info
          }
        })
      } else if (str === 'major') {
        this.majorList.find((obj) => {
          if (obj.id === row.major) {
            name = obj.info
          }
        })
      }
      return name
    }
  }
}
</script>


