<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">

      <el-form-item label="企业" prop="companyNo">
        <el-select v-model="queryParams.companyNo" placeholder="请选择" style="width: 180px">
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" filterable style="width: 180px">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>
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
    </el-row>
    <el-table v-loading="loading" :data="jobList">

      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="申请时间" align="center" prop="applyTime"/>
      <el-table-column label="企业名称" align="center" prop="companyName"/>
      <el-table-column label="岗位" align="center" prop="postName"/>
      <el-table-column label="期望薪资" align="center" prop="salary"/>
      <el-table-column label="审核状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status==='0'" size="medium"
                     @click="getDialogData(scope.row)"
          >审批中...
          </el-button>
          <el-button type="success" icon="el-icon-medal" v-if="scope.row.status==='1'" size="medium"
                     @click="getDialogData(scope.row)"
          >审批通过
          </el-button>
          <el-button type="danger" icon="el-icon-warning" v-if="scope.row.status==='2'" size="medium"
                     @click="getDialogData(scope.row)"
          >审批拒绝
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status==='1'|| scope.row.status==='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            :disabled="scope.row.status==='1'|| scope.row.status==='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
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

    <el-dialog title="就业申请处理详情" :visible.sync="dialogTableVisible">
      <el-descriptions class="margin-top" :column="2" border title="申请信息">
        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-tickets"/>
            学号
          </template>
          {{ dialogData.studentNo }}
        </el-descriptions-item>

        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-user"/>
            姓名
          </template>
          {{ dialogData.studentName }}
        </el-descriptions-item>
        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-date">
              申请时间
            </i>
          </template>
          {{ dialogData.applyTime }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-box">
              申请企业
            </i>
          </template>
          {{ dialogData.companyName }}
        </el-descriptions-item>

        <el-descriptions-item :span="3">
          <template slot="label">
            <i class="el-icon-box">
              申请岗位
            </i>
          </template>
          {{ dialogData.postName }}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label" style="height: 500px">
            <i class="el-icon-reading"/>
            申请说明
          </template>
          {{ dialogData.reason }}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0">
        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">审批状态</div>
        <el-steps :space="600" :active="dialogData.status === '0'? 1:3" finish-status="success" :align-center="true"
                  :process-status="'finish'" simple
        >
          <el-step title="提交信息"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批完成"></el-step>
        </el-steps>
      </div>

      <el-descriptions title="审批结果" :column="3" :size="'medium'" border class="margin-top"
                       v-if="dialogData.status!=='0'"
      >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            处理人
          </template>
          {{ dialogData.instructorName }}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            处理状态
          </template>
          <div style="position: relative">
            <div style="float: left">{{ showModel(dialogData, 'status') }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            处理结果
          </template>
          <div style="position: relative">
            <div style="float: left">{{ dialogData.result }}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>


    <el-drawer
      title="修改奖学金申请"
      :visible.sync="drawer"
      :show-close="false"
      :with-header="false"
      :direction="direction"
      :before-close="handleClose"
      v-if="drawer"
    >
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="报备申请" name="basic">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="申请人: ">
                    {{ this.student.nickName }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="学号: ">
                    {{ this.student.studentNo }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="所在学院: ">
                    {{ this.student.collegeInfo.collegename }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="企业" prop="companyNo">
                    <el-select v-model="form.companyNo" placeholder="请选择企业">
                      <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="岗位" prop="postNo">
                    <el-select v-model="form.postNo" placeholder="请选择岗位">
                      <el-option
                        v-for="item in postList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="期望薪资" prop="salary">
                    <el-select v-model="form.salary" placeholder="请选择期望薪资">
                      <el-option
                        v-for="item in salaryList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="申请说明:" prop="reason">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="申请理由"
                      v-model="form.reason"
                    >
                    </el-input>
                  </el-form-item>
                </el-col>

              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="简历上传" name="other">
            <el-form :model="form" :rules="rules" label-width="80px">
              <el-form-item label="图片:">
                <image-upload :value="form.imgFile" :data="data" @input="changeImgFile($event)"/>
              </el-form-item>
              <el-form-item label="文件:">
                <file-upload :value="form.textFile" :data="data" @input="changeTextFile($event)"/>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>


        <el-form label-width="100px">
          <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">返回</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-drawer>

  </div>
</template>

<script>
import { listJob, checkJobExit, getJob, addJob, updateJob, delJob } from '@/api/student/job'
import { getUser2 } from '@/api/user'

export default {
  name: 'apply',
  data() {
    let checkJob = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('请选择要申请的企业！'))
      } else {
        console.log('this.form:', this.form)
        checkJobExit(this.form).then(res => {
          console.log(res)
          if (res === false) {
            callback(new Error('您已经申请了此企业，无需再次申请！'))
          } else {
            callback()
          }
        })
      }
    }
    return {
      direction:'rtl',
      data: {
        bucket: 'student'
      },
      student: {},
      drawer: false,
      activeName: 'basic',
      dialogTableVisible: false,
      dialogData: {},
      formLabelWidth: '70px',
      form: {},
      scholarship: {},
      companyList: [
        { id: '1', name: '字节跳动' },
        { id: '2', name: '腾讯' },
        { id: '3', name: '华为' },
        { id: '4', name: '阿里巴巴' },
        { id: '5', name: '美团' },
        { id: '6', name: '京东' }
      ],
      postList: [
        { id: '1', name: '后端开发岗' },
        { id: '2', name: '前端开发岗' },
        { id: '3', name: '运营岗' },
        { id: '4', name: '产品经理' },
        { id: '5', name: '算法岗' },
        { id: '6', name: '大数据岗' },
        { id: '7', name: '测试岗' }
      ],
      salaryList: [
        { id: '10000', name: '10000' },
        { id: '12000', name: '12000' },
        { id: '15000', name: '15000' },
        { id: '18000', name: '18000' },
        { id: '20000', name: '20000' },
        { id: '25000', name: '25000' },
        { id: '30000', name: '30000' }
      ],
      statusList: [
        { id: '0', name: '已提交' },
        { id: '1', name: '已通过' },
        { id: '2', name: '已拒绝' }
      ],
      jobList: [],
      instructorList: [],
      total: 0,
      single: true,
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
        companyNo: null,
        studentNo: null,
        status: null
      },

      rules: {
        companyNo: [
          { required: true, trigger: 'blur', validator: checkJob }
        ],
        postNo: [
          { required: true, trigger: 'blur', message: '请选择岗位' }
        ],
        salary: [
          { required: true, trigger: 'blur', message: '请选择期望薪资' }
        ],
        reason: [
          { required: true, message: '请填写申请原因', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.student = this.$store.getters.studentInfo
    this.queryParams.studentNo = this.student.studentNo
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    }
  },

  methods: {
    handleClose(done){
      this.form = {}
      done();
    },
    changeImgFile(fileData){
      this.form.imgFile = fileData
    },
    changeTextFile(fileData){
      this.form.textFile = fileData
    },

    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            console.log('form:', this.form)
            updateJob(this.form).then(res => {
              this.msgSuccess('修改成功')
              this.drawer = false
              this.getList()
            })
          } else {
            this.form.studentNo = this.student.studentNo
            this.form.status = '0'
            console.log('form:', this.form)
            addJob(this.form).then(res => {
              this.msgSuccess('新增成功')
              this.drawer = false
              this.getList()
            })
          }
        }
      })
    },
    showType(no) {
      let scholarshipName = null
      this.companyList.find((obj) => {
        if (obj.id === no) {
          scholarshipName = obj.name
        }
      })
      return scholarshipName
    },
    getDialogData(data) {
      const id = data.id
      getJob(id).then(response => {
        this.dialogData = response.data
        if (data.instructorId != null && data.instructorId !== '') {
          console.log("instructorId:",data.instructorId)
          getUser2(data.instructorId).then(res => {
            console.log("res:",res)
            this.dialogData.instructorName = res.data.nickName
          }).then(res => {
            console.log("this.dialogData:",this.dialogData)
            this.dialogTableVisible = true
          })
        } else {
          this.dialogTableVisible = true
        }
      })

    },

    cancel() {
      this.drawer = false
      this.reset()
    },

    getList() {
      this.loading = true
      listJob(this.queryParams).then(response => {
        this.jobList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.companyNo = null
      this.queryParams.status = null
      this.handleQuery()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.activeName = 'basic'
      this.reset()
      this.drawer = true
    },
    handleUpdate(row) {
      this.activeName = 'basic'
      this.reset()
      console.log('row:', row)
      const id = row.id
      getJob(id).then(res => {
        this.form = res.data
        this.drawer = true
      })
    },
    handleDelete(row) {
      const id = row.id
      this.$confirm('确定要删除编号为' + id + '的数据项？', '警告', {
        confirmButtonClass: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delJob(id)
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    // 表单重置
    reset() {
      this.form = {
        imgFile:null,
        textFile:null,
      }
      this.resetForm('form')
    },

    showModel(row, str) {
      let name = null
      if (str === 'status') {
        this.statusList.find((obj) => {
          if (obj.id === row.status) {
            name = obj.name
          }
        })
      }
      return name
    }
  }
}
</script>


