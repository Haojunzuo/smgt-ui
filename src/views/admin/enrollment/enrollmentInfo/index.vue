<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学院" prop="collegeNo">
        <el-select v-model="queryParams.collegeNo" placeholder="请选择">
          <el-option
            v-for="item in collegeList"
            :key="item.collegeno"
            :label="item.collegename"
            :value="item.collegeno"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="班级" prop="classNo">
        <el-select v-model="queryParams.classNo" placeholder="请选择" filterable>
          <el-option
            v-for="item in classList"
            :key="item.classno"
            :label="item.classno"
            :value="item.classno"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="学号" prop="studentNo">
        <el-input v-model="queryParams.studentNo" placeholder="请输入学号" />
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-refresh"
          size="mini" @click="getList"
        >刷新
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini" @click="handleImport"
        >导入
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="studentList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="nickName"/>
      <el-table-column label="性别" align="center" prop="sex">
        <template slot-scope="scope">
          <span>{{ scope.row.sex==='0'?'男':'女' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="民族" align="center" prop="nation">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'nation') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生类别" align="center" prop="stuType">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'stuType') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="院系" align="center" prop="collegeNo">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'collegeNo') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专业" align="center" prop="major">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'major') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="班级" align="center" prop="classNo"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDetail(scope.row)"
          >详情
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
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
import { listCourse } from '@/api/admin/course/course'
import { listStudent, delStudent } from'@/api/student/student'
import { listCollege, } from '@/api/admin/course/schedule'
import { getToken } from '@/utils/auth'

export default {
  name: 'SubSystem',
  data() {
    return {
      studentList: [],
      collegeList:[],
      classList:[],
      nationList: [
        {
          id: 1,
          info: "汉族",
          value: 1,
        },
        {
          id: 2,
          info: "壮族",
          value: 2,
        },
        {
          id: 3,
          info: "满族",
          value: 3,
        },
        {
          id: 4,
          info: "回族",
          value: 4,
        },
        {
          id: 5,
          info: "苗族",
          value: 5,
        },
        {
          id: 6,
          info: "维吾尔族",
          value: 6,
        },
        {
          id: 7,
          info: "土家族",
          value: 7,
        },
        {
          id: 8,
          info: "彝族",
          value: 8,
        },
        {
          id: 9,
          info: "蒙古族",
          value: 9,
        },
        {
          id: 10,
          info: "藏族",
          value: 10,
        },
        {
          id: 11,
          info: "布依族",
          value: 11,
        },
        {
          id: 12,
          info: "侗族",
          value: 12,
        },
        {
          id: 13,
          info: "瑶族",
          value: 13,
        },
        {
          id: 14,
          info: "朝鲜族",
          value: 14,
        },
        {
          id: 15,
          info: "白族",
          value: 15,
        },
        {
          id: 16,
          info: "哈尼族",
          value: 16,
        },
        {
          id: 17,
          info: "哈萨克族",
          value: 17,
        },
        {
          id: 18,
          info: "黎族",
          value: 18,
        },
        {
          id: 19,
          info: "傣族",
          value: 19,
        },
        {
          id: 20,
          info: "畲族",
          value: 20,
        },
        {
          id: 21,
          info: "傈僳族",
          value: 21,
        },
        {
          id: 22,
          info: "仡佬族",
          value: 22,
        },
        {
          id: 23,
          info: "东乡族",
          value: 23,
        },
        {
          id: 24,
          info: "高山族",
          value: 24,
        },
        {
          id: 25,
          info: "拉祜族",
          value: 25,
        },
        {
          id: 26,
          info: "水族",
          value: 26,
        },
        {
          id: 27,
          info: "佤族",
          value: 27,
        },
        {
          id: 28,
          info: "纳西族",
          value: 28,
        },
        {
          id: 29,
          info: "羌族",
          value: 29,
        },
        {
          id: 30,
          info: "土族",
          value: 30,
        },
        {
          id: 31,
          info: "仫佬族",
          value: 31,
        },
        {
          id: 32,
          info: "锡伯族",
          value: 32,
        },
        {
          id: 33,
          info: "柯尔克孜族",
          value: 33,
        },
        {
          id: 34,
          info: "达斡尔族",
          value: 34,
        },
        {
          id: 35,
          info: "景颇族",
          value: 35,
        },
        {
          id: 36,
          info: "毛南族",
          value: 36,
        },
        {
          id: 37,
          info: "撒拉族",
          value: 37,
        },
        {
          id: 38,
          info: "布朗族",
          value: 38,
        },
        {
          id: 39,
          info: "塔吉克族",
          value: 39,
        },
        {
          id: 40,
          info: "阿昌族",
          value: 40,
        },
        {
          id: 41,
          info: "普米族",
          value: 41,
        },
        {
          id: 42,
          info: "鄂温克族",
          value: 42,
        },
        {
          id: 43,
          info: "怒族",
          value: 43,
        },
        {
          id: 44,
          info: "京族",
          value: 44,
        },
        {
          id: 45,
          info: "基诺族",
          value: 45,
        },
        {
          id: 46,
          info: "德昂族",
          value: 46,
        },
        {
          id: 47,
          info: "保安族",
          value: 47,
        },
        {
          id: 48,
          info: "俄罗斯族",
          value: 48,
        },
        {
          id: 49,
          info: "裕固族",
          value: 49,
        },
        {
          id: 50,
          info: "乌孜别克族",
          value: 50,
        },
        {
          id: 51,
          info: "门巴族",
          value: 51,
        },
        {
          id: 52,
          info: "鄂伦春族",
          value: 52,
        },
        {
          id: 53,
          info: "独龙族",
          value: 53,
        },
        {
          id: 54,
          info: "塔塔尔族",
          value: 54,
        },
        {
          id: 55,
          info: "赫哲族",
          value: 55,
        },
        {
          id: 56,
          info: "珞巴族",
          value: 56,
        },
      ],
      stuTypeList:[
        { id: '1' , info:'本科生'},
        { id: '2' , info:'硕士研究生'},
        { id: '3' , info:'博士研究生'},
      ],
      majorList:[
        {id:'1',info:'软件工程'},
        {id:'2',info:'计算机科学与技术'},
        {id:'3',info:'信息安全'},
      ],
      total: 0,
      single: true,
      multiple: true,
      ids: [],
      showSearch: false,
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
        classno: null
      },
      queryCollege: {
        pageNum: 1,
        pageSize: 30
      },
      queryClass: {
        pageNum: 1,
        pageSize: 30
      },
      // 表单参数
      form: {
        collegeno: '01',
        classno: '2015010101',
        isfix: '1'
      },
      rules: {
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
        url: process.env.VUE_APP_BASE_API + "/student/importStudent"
      },
    }
  },
  created() {
    this.getCollegeList()
    this.getCourseList()
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    },
  },

  methods: {
    getList() {
      this.loading = true
      listStudent(this.queryParams).then(response => {
        this.studentList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.collegeNo = null
      this.queryParams.classNo = null
      this.queryParams.studentNo = null
      this.handleQuery()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.reset()
      this.drawer = true
    },
    handleUpdate(row) {
      const id = row.id
      this.$router.push({
        path:'/enrollment/detail',
        query:{
          id:id,
        }
      })

    },
    handleDetail(row){
      const studentId = row.id
      this.$router.push({
        path:'/enroll/'+studentId,
        // query:{
        //   id:id,
        // }
      })
    },
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('是否确定删除编号为' + id + '的学生?', '警告', {
        confirmButtonClass: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        console.log(id)
        return delStudent(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    handleExport() {
      this.download('/student/exportStudent', {
        ...this.queryParams
      }, 'student.xlsx')
    },
    handleImport() {
      this.upload.title = '导入'
      this.upload.open = true
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        semester: '2015-2016-1',
        collegeno: '01',
        classno: '2015010101',
        studentnumber: null,
        teacherno: null,
        weekssum: null,
        weeksnum: null,
        isfix: '1'
      }
      this.resetForm('form')
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log('this.form', this.form)
            updateClassTask(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.drawer = false
              this.getList()
            })
          } else {
            addClassTask(this.form).then(response => {
              this.msgSuccess('新增成功')
              console.log(response)
              this.drawer = false
              this.getList()
            })
          }
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert(response.msg, '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitImportCourse() {
      this.$refs.upload.submit()
    },

    getCollegeList() {
      listCollege(this.queryCollege).then(response => {
        this.collegeList = response.rows
      })
    },
    getCourseList() {
      listCourse().then(response => {
        this.courseList = response.rows
      })
    },

    showModel(row, str) {
      let name = null
      let attr = null
      if (str === 'collegeNo') {
        this.collegeList.find((obj) => {
          if (obj.collegeno === row.collegeNo) {
            name = obj.collegename
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
      } else if (str==='major'){
        this.majorList.find((obj)=>{
          if (obj.id===row.major){
            name = obj.info;
          }
        })
      }
      return name
    },
  }
}
</script>

<style>
.el-tabs--top, .el-tabs--bottom, .el-tabs--top .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
  padding-left: 20px;
}

.el-input {
  width: 95%;
}

.el-form-courseno {
  margin-top: 18px;
}

.button-submitForm {
  margin-right: 20px;
}

.input-description {
  width: 95%;
}

</style>
