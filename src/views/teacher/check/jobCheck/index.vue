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

      <el-form-item label="学号" prop="studentNo">
        <el-input v-model="queryParams.studentNo" placeholder="请输入学号" style="width: 180px"></el-input>
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
          disabled
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
      <el-table-column label="审核" align="center" prop="status">
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

    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-dialog title="就业申请处理详情" :visible.sync="dialogTableVisible">
      <el-form ref="dialogData" :model="dialogData" :rules="rules">
        <el-descriptions class="margin-top" :column="2" border title="申请信息">
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

          <el-descriptions-item>
            <template slot="label" style="height: 500px">
              <i class="el-icon-reading"/>
              申请说明
            </template>
            {{ dialogData.reason }}
          </el-descriptions-item>
        </el-descriptions>

        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">
          学生简历
          <el-row>
            <el-col :span="12">
              <div style="margin: 20px 0" v-if="dialogData.imgFile!=='' && dialogData.imgFile!==null">
                <div style="font-size: 14px;font-weight: bold;padding-bottom: 20px">简历图片</div>
                <image-upload :value="this.dialogData.imgFile" :data="data" :isShowTip="false" :limit="1"/>
              </div>
            </el-col>
            <el-col span="12">
              <div style="margin: 20px 0" v-if="dialogData.textFile!=='' && dialogData.textFile!==null">
                <div style="font-size: 14px;font-weight: bold;padding-bottom: 20px">简历文件</div>
                <file-upload :value="this.dialogData.textFile" :data="data" :isShowButton="false" :isShowTip="false" :limit="1"/>
              </div>
            </el-col>
          </el-row>




        </div>


        <el-descriptions title="审批结果" :column="3" :size="'medium'" border class="margin-top"
        >
          <el-descriptions-item v-if="dialogData.status!=='0'">
            <template slot="label">
              <i class="el-icon-user"></i>
              处理人
            </template>
            {{ dialogData.instructorName }}
          </el-descriptions-item>
          <el-descriptions-item span="3" v-if="dialogData.status!=='0'">
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
            <div style="position: relative; width: 600px">
              <el-form-item prop="result">
                <el-input v-model="dialogData.result" type="textarea" maxlength="80" show-word-limit
                          :autosize="{ minRows: 3, maxRows: 4}"
                />
              </el-form-item>
            </div>
          </el-descriptions-item>
        </el-descriptions>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="success" @click="approve">批准</el-button>
        <el-button type="info" @click="reject">拒绝</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { listJob, checkJobExit, getJob, addJob, updateJob, delJob } from '@/api/student/job'
import { getUser2 } from '@/api/user'

export default {
  name: 'SubSystem',
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
      data: {
        bucket: 'student'
      },
      userInfo: {},
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
        result: [
          { required: true, trigger: 'blur', message: '请填写处理结果' }
        ]
      }
    }
  },
  created() {
    this.userInfo = this.$store.getters.userInfo
    console.log('this.userInfo:', this.userInfo)
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    }
  },

  methods: {
    approve() {
      this.dialogData.instructorId = this.userInfo.userId
      this.dialogData.status = '1'
      this.$refs['dialogData'].validate(valid => {
        if (valid) {
          updateJob(this.dialogData).then(res => {
            this.msgSuccess('操作成功')
            this.dialogTableVisible = false
            this.getList()
          })
        }
      })
    },
    reject() {
      this.dialogData.instructorId = this.userInfo.userId
      this.dialogData.status = '2'
      this.$refs['dialogData'].validate(valid => {
        if (valid) {
          updateJob(this.dialogData).then(res => {
            this.msgSuccess('操作成功')
            this.dialogTableVisible = false
            this.getList()
          })
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
          getUser2(data.instructorId).then(res => {
            this.dialogData.instructorName = res.data.nickName
          }).then(res => {
            this.dialogTableVisible = true
          })
        } else {
          this.dialogTableVisible = true
        }
      })

    },

    cancel() {
      this.dialogData = {}
      this.dialogTableVisible = false
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
      console.log('row:', row)
      const id = row.id
      this.drawer = true
      getJob(id).then(res => {
        console.log(res)
        this.form = res.data
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
        id: null,
        status: '0'

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


