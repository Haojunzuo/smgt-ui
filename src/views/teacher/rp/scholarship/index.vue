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
      <el-form-item label="类型" prop="scholarshipNo">
        <el-select v-model="queryParams.scholarshipNo" placeholder="请选择" style="width: 180px">
          <el-option
            v-for="item in scholarshipList"
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
        <el-input v-model="queryParams.studentNo" placeholder="请输入学号" style="width: 180px"/>
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
          :disabled=true
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

    </el-row>

    <el-table v-loading="loading" :data="scholarShipList">

      <el-table-column label="学期" align="center" prop="semester"/>
      <el-table-column label="奖学金名称" align="center" prop="scholarshipName"/>
      <el-table-column label="金额" align="center" prop="money"/>
      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="综合成绩" align="center" prop="totalScore"/>
      <el-table-column label="辅导员姓名" align="center" prop="instructorName"/>
      <el-table-column label="审核状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'status') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status==='1'|| scope.row.status==='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleReview(scope.row)"
          >审批
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
    <el-dialog title="奖学金审批" :visible.sync="open" width="60%">
      <el-form :model="form">
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item :span="1">
            <template slot="label">
              <i class="el-icon-date"/>
              学期
            </template>
            {{ form.semester }}
          </el-descriptions-item>

          <el-descriptions-item :span="1">
            <template slot="label">
              <i class="el-icon-box"/>
              奖学金类型
            </template>
            <template>
              {{showType(form.scholarshipNo)}}
            </template>
          </el-descriptions-item>


          <el-descriptions-item :span="1">
            <template slot="label" >
              <i class="el-icon-tickets"/>
              学号
            </template>
            {{ form.studentNo }}
          </el-descriptions-item>

          <el-descriptions-item :span="1">
            <template slot="label">
              <i class="el-icon-user"/>
              姓名
            </template>
            {{ form.studentName }}
          </el-descriptions-item>
          <el-descriptions-item >
            <template slot="label" style="height: 500px">
              <i class="el-icon-reading"/>
              申请原因
            </template>
            {{ form.reason }}
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
import { getToken } from '@/utils/auth'
import {
  listScholarship,
  addScholarship,
  delScholarship,
  getScholarship,
  updateScholarship
} from '@/api/instructor/scholarship'

export default {
  name: 'SubSystem',
  data() {
    return {
      formLabelWidth: '70px',
      form: {},
      scholarship: {},
      scholarshipList: [
        { id: '1', name: '国家奖学金' },
        { id: '2', name: '国家励志奖学金' },
        { id: '3', name: '校一等奖学金' },
        { id: '4', name: '校二等奖学金' },
        { id: '5', name: '校三等奖学金' }
      ],
      statusList: [
        { id: '0', name: '已提交' },
        { id: '1', name: '已批准' },
        { id: '2', name: '已拒绝' }
      ],
      scholarShipList: [],
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
        semester: '2015-2016-1',
        scholarshipNo: null,
        studentNo: null,
        status: null
      },

      rules: {}
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
    showType(no){
      let scholarshipName = null
      this.scholarshipList.find((obj)=>{
        if(obj.id===no){
          scholarshipName = obj.name;
        }
      })
      return scholarshipName;
    },
    cancel() {
      this.reset()
      this.open = false
    },
    approve() {
      this.form.status = '1'
      updateScholarship(this.form).then(res => {
        console.log('updateScholarship:', res)
        this.getList()
        this.open = false
        this.reset()
      })
    },

    reject() {
      this.form.status = '2'
      updateScholarship(this.form).then(res => {
        console.log('updateScholarship:', res)
        this.getList()
        this.open = false
        this.reset()
      })
    },
    getList() {
      this.loading = true
      this.queryParams.type = '1'
      console.log('this.queryParams:', this.queryParams)
      listScholarship(this.queryParams).then(response => {
        this.scholarShipList = response.rows
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
    handleAdd() {
      this.reset()
      this.drawer = true
    },
    handleUpdate(row) {
      const id = row.id
      this.$router.push({
        path: '/enrollment/detail',
        query: {
          id: id
        }
      })
    },
    handleReview(row) {
      const scholarshipId = row.id
      getScholarship(scholarshipId).then(res => {
        console.log(res)
        this.form = res.data
        this.open = true
      })
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        semester: null,
        status: null,
        studentNo: null,
        type: null

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


