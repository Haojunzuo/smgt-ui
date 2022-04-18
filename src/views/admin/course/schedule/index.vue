<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="学期" prop="semester">
        <el-select v-model="queryParams.semester" placeholder="请选择学期">
          <el-option value="2015-2016-1" label="2015-2016-1"/>
          <el-option value="2015-2016-2" label="2015-2016-2"/>
          <el-option value="2016-2017-1" label="2016-2017-1"/>
          <el-option value="2016-2017-2" label="2016-2017-2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学院" prop="collegeNo">
        <el-select v-model="queryParams.collegeno" placeholder="请选择">
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
        <el-select v-model="queryParams.classno" placeholder="请选择" filterable>
          <el-option
            v-for="item in classList"
            :key="item.classno"
            :label="item.classno"
            :value="item.classno"
          >
          </el-option>
        </el-select>
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
      <el-col :span="1.5">
        <el-button
          :loading="scheduleLoading"
          type="danger"
          plain
          icon="el-icon-edit"
          size="mini" @click="schedule"
        >排课
        </el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="classTaskList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="学期" align="center" prop="semester"/>
      <el-table-column label="学院名称" align="center" prop="collegeno">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'collegeno') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程编号" align="center" prop="courseno"/>
      <el-table-column label="课程名称" align="center" prop="courseno">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'courseno') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程属性" align="center" prop="courseattr">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'courseattr') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="教师名称" align="center" prop="teacherno">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'teacherno') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="学生数量" align="center" prop="studentnumber"/>
      <el-table-column label="总周数" align="center" prop="weekssum"/>
      <el-table-column label="每周课时" align="center" prop="weeksnumber"/>
      <el-table-column label="时间是否固定" align="center" prop="isfix"/>
      <el-table-column label="上课时间" align="center" prop="classtime"/>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
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

    <el-drawer
      :visible.sync="drawer"
      :show-close="false"
      :direction="direction"
      :before-close="handleClose"
    >

      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="basicInfo">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="学期" prop="semester">
              <el-select v-model="form.semester" placeholder="请选择学期">
                <el-option value="2015-2016-1" label="2015-2016-1"/>
                <el-option value="2015-2016-2" label="2015-2016-2"/>
                <el-option value="2016-2017-1" label="2016-2017-1"/>
                <el-option value="2016-2017-2" label="2016-2017-2"/>
              </el-select>
            </el-form-item>
            <el-form-item label="学院" prop="collegeno">
              <el-select v-model="form.collegeno" placeholder="请选择" filterable>
                <el-option
                  v-for="item in collegeList"
                  :key="item.collegeno"
                  :label="item.collegename"
                  :value="item.collegeno"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" prop="classno">
              <el-select v-model="form.classno" placeholder="请选择" filterable>
                <el-option
                  v-for="item in classList"
                  :key="item.classno"
                  :label="item.classno"
                  :value="item.classno"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="课程" prop="courseno">
              <el-select v-model="form.courseno" placeholder="请选择" filterable>
                <el-option
                  v-for="item in courseList"
                  :key="item.courseno"
                  :label="item.coursename"
                  :value="item.courseno"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="学生数量" prop="studentnumber">
              <el-input v-model="form.studentnumber" placeholder="请输入学生数量"/>
            </el-form-item>

            <el-form-item label="教师" prop="teacherno">
              <el-select v-model="form.teacherno" placeholder="请选择" filterable>
                <el-option
                  v-for="item in teacherList"
                  :key="item.teacherno"
                  :label="item.teachername"
                  :value="item.teacherno"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="总周数" prop="weekssum">
              <el-input v-model="form.weekssum" placeholder="请输入总周数"/>
            </el-form-item>
            <el-form-item label="每周课时" prop="weeksnumber">
              <el-input v-model="form.weeksnumber" placeholder="请输入每周课时"/>
            </el-form-item>

            <el-form-item label="固定时间">
              <el-radio-group v-model="form.isfix">
                <el-radio :label="'2'">固定</el-radio>
                <el-radio :label="'1'">不固定</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="上课时间" prop="classtime" v-show="form.isfix==='2'">
              <el-input v-model="form.classtime" placeholder="请输入上课时间"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>


      <el-form label-width="100px" style="margin-top: 40px">
        <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
          <el-button class="button-submitForm" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">返回</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

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
import {
  listCollege,
  listClass,
  listClassTask,
  listTeacher,
  checkCourseExist,
  addClassTask,
  updateClassTask,
  getClassTask,
  delClassTask,
  schedule
} from '@/api/admin/course/schedule'
import { getToken } from '@/utils/auth'
import Select from '@/views/student/study/select'

export default {
  name: 'SubSystem',
  components: { Select },
  data() {
    let checkCourse = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('课程不能为空'))
      } else {
        checkCourseExist(this.form).then(response => {
          console.log('response:', response)
          if (response === false) {
            callback(new Error('该班级已经选了本课程~'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      scheduleLoading: false,
      courseattrList: { '01': '必修', '02': '选修', '03': '体育', '04': '实验' },
      teacherList: [],
      classTaskList: [],
      classList: [],
      collegeList: [],
      activeName: 'basicInfo',
      postData: {
        bucket: 'test2'
      },
      drawer: false,
      direction: 'rtl',
      total: 0,
      single: true,
      multiple: true,
      ids: [],
      showSearch: false,
      courseList: [],
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
      queryTeacher: {
        pageNum: 1,
        pageSize: 500
      },
      queryCourse: {
        pageNum: 1,
        pageSize: 500
      },
      // 表单参数
      form: {
        semester: '2015-2016-1',
        collegeno: '01',
        classno: '2015010101',
        isfix: '1'
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: '',
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: 'Bearer ' + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + '/classTask/importClassTask'
      },
      rules: {
        semester: [
          {
            required: true,
            message: '学期不能为空',
            trigger: 'blur'
          }
        ],
        collegeno: [
          {
            required: true,
            message: '学院不能为空',
            trigger: 'blur'
          }
        ],
        classno: [
          {
            required: true,
            message: '班级不能为空',
            trigger: 'blur'
          }
        ],
        courseno: [
          {
            required: true,
            trigger: 'blur',
            validator: checkCourse
          }
        ],
        teacherno: [
          {
            required: true,
            message: '教师不能为空',
            trigger: 'blur'
          }
        ],
        studentnumber: [
          {
            required: true,
            message: '学生数量不能为空',
            trigger: 'blur'
          }
        ],
        weekssum: [
          {
            required: true,
            message: '总周数不能为空',
            trigger: 'blur'
          }
        ],
        weeksnumber: [
          {
            required: true,
            message: '每周课时不能为空',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCollegeList()
    this.getClassList()
    this.getCourseList()
    this.getTeacherList()
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    },
    'queryParams.collegeno': {
      handler(newCollegeno, oldCollegeno) {
        this.queryClass.collegeno = newCollegeno
        this.queryParams.classno = null
        this.getClassList(this.queryClass)
      }
    }
  },

  methods: {
    outputFiles(data) {
      this.form.warehouseDoc = data
      console.log('fileData:', data)
    },
    outputPics(data) {
      this.form.warehousePic = data
      console.log('picData:', data)
    },
    getList() {
      this.loading = true
      listClassTask(this.queryParams).then(response => {
        this.classTaskList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.collegeno = null
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
      this.reset()
      const id = row.id || this.ids
      getClassTask(id).then(response => {
        console.log(response)
        this.form = response.data
        this.title = '修改课程计划'
        this.drawer = true
      })
    },
    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('是否确定课程计划编号为' + id + '的数据项?', '警告', {
        confirmButtonClass: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delClassTask(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    handleExport() {
      this.download('/classTask/exportClassTask', {
        ...this.queryParams
      }, 'classTask.xlsx')
    },
    handleImport() {
      this.upload.title = '导入'
      this.upload.open = true
    },
    handleClose(done) {
      this.form = {}
      done()
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
    cancel() {
      this.drawer = false
      this.reset()
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
    getClassList() {
      listClass(this.queryClass).then(response => {
        this.classList = response.rows
      })
    },
    getCourseList() {
      listCourse().then(response => {
        this.courseList = response.rows
      })
    },
    getTeacherList() {
      listTeacher().then(response => {
        this.teacherList = response.rows
      })
    },
    showModel(row, str) {
      let name = null
      let attr = null
      if (str === 'collegeno') {
        this.collegeList.find((obj) => {
          if (obj.collegeno === row.collegeno) {
            name = obj.collegename
          }
        })
      } else if (str === 'courseno') {
        this.courseList.find((obj) => {
          if (obj.courseno === row.courseno) {
            name = obj.coursename
          }
        })
      } else if (str === 'teacherno') {
        this.teacherList.find((obj) => {
          if (obj.teacherno === row.teacherno) {
            name = obj.teachername
          }
        })
      } else if (str === 'courseattr') {
        this.courseList.find((obj) => {
          if (obj.courseno === row.courseno) {
            attr = obj.courseattr
          }
        })
        for (const courseattr in this.courseattrList) {
          if (courseattr === attr) {
            name = this.courseattrList[courseattr]
            return name
          }
        }
        name = '其他'
      }
      return name
    },
    schedule() {
      let that = this
      let semester = this.queryParams.semester
      this.$confirm('是否确定对' + semester + '学期进行排课', '警告', {
        confirmButtonClass: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        that.scheduleLoading = true
        return schedule(semester)
      }).then(() => {
        that.scheduleLoading = false
        this.msgSuccess('排课成功')
      }).catch(() => {
        console.log('catch')
      })
    }
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
