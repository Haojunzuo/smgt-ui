<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="true" label-width="68px">
      <el-form-item label="勤工助学">
        <el-select v-model="queryParams.noticeId" placeholder="请选择" clearable>
          <el-option
            v-for="item in noticeList"
            :key="item.id"
            :label="item.title"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学生姓名">
        <el-select v-model="queryParams.studentId" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in studentList"
            :key="item.id"
            :label="item.nickName"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="partTimeList" @selection-change="handleSelectionChange">
      <el-table-column label="申请职位" align="center" prop="noticeId" sortable>
        <template slot-scope="scope">
          <span>{{getNoticeTitle(scope.row.noticeId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" align="center" prop="studentId" sortable>
        <template slot-scope="scope">
          <span>{{getStudentName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="phone">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">待审批</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '2'" size="medium" plain @click="getDialogData(scope.row)">已通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">已拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getDialogData(scope.row)"
            v-if="scope.row.status === '1'"
          >审批</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getDialogData(scope.row)"
            v-else
          >详情</el-button>
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

    <el-dialog title="审批详情" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">
      <el-descriptions  title="提交信息" :column="3" :size="'medium'" border >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            申请人
          </template>
          {{this.dialogData.studentInfo.nickName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            学号
          </template>
          {{this.dialogData.studentInfo.studentNo}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{dialogData.phone}}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            所在学院
          </template>
          {{this.dialogData.studentInfo.collegeInfo.collegename}}
        </el-descriptions-item>
        <el-descriptions-item >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            班级
          </template>
          {{this.dialogData.studentInfo.classInfo.classname}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            个人介绍
          </template>
          {{dialogData.detail}}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0" v-if="this.dialogData.file!=='' && this.dialogData.file!==null">
        <el-row>
          <el-col :span="12" v-if="this.dialogData.file!=='' && this.dialogData.file!==null">
            <div style="font-size: 16px;font-weight: bold;">上传文件</div>
            <fileUpload :value="this.dialogData.file" :data="data" :isShowTip="false" :limit="1" :isShowButton="false"/>
          </el-col>
        </el-row>
      </div>
      <el-form ref="form" :model="form" :rules="rules">
      <el-descriptions  title="审批结果" :column="3" :size="'medium'" border class="margin-top" style="margin-top: 20px">
        <template slot="extra">
          <el-button type="primary" size="small" @click="submitForm()" v-if="this.dialogData.status === '1'">提交</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            审批人
          </template>
          {{this.$store.getters.nickName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{this.$store.getters.userInfo.phoneNumber}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            审批结果
          </template>
          <el-form-item style="margin: 0" v-if="this.dialogData.status === '1'">
            <el-radio-group v-model="form.status">
              <el-radio :label="'2'">通过</el-radio>
              <el-radio :label="'3'">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-else>
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.status === '2'">审批通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.status === '3'">审批拒绝</el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listPartTime, updatePartTime } from "@/api/student/partTime";
import {listStudent} from "../../../../api/student/student";
import {listNotice} from "../../../../api/admin/notice/notice";

export default {
  name: "partCheck",
  data() {
    return {
      partTimeList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        noticeId: null,
        studentId: null
      },
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: false,
      // 总条数
      total: 0,
      studentList: [],
      dialogTableVisible: false,
      form: {},
      statusOptions: [
        {label:'待审批',value:'1'},
        {label:'审批通过',value:'2'},
        {label:'审批拒绝',value:'3'}
      ],
      data: {
        bucket: 'student'
      },
      noticeList: [],
      params: {
        pageNum: 1,
        endTime: new Date(),
        noticetype: '3'
      },
    }
  },
  created() {
    listNotice(this.params).then(res=>{
      console.log(res)
      this.noticeList = res.rows
    })
    listStudent({pageNum: 1}).then(res=>{
      this.studentList = res.rows
    })
    this.getList();
  },
  watch:{
    queryParams:{
      deep:true,
      handler:"getList"
    }
  },
  methods: {
    /** 查询报备类别列表 */
    getList() {
      this.loading = true;
      listPartTime(this.queryParams).then(response => {
        console.log(response.rows)
        this.partTimeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    getDialogData(data){
      this.form = {
        id: data.id,
        userId: this.$store.getters.userInfo.userId,
        status: '2'
      }
      this.dialogTableVisible = true
      this.dialogData = data
      this.dialogData.studentInfo = this.studentList.find(item=>item.id === data.studentId)
    },
    getStudentName(data){
      let obj = this.studentList.find(item=>item.id === data.studentId)
      return obj.nickName
    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if(valid){
          updatePartTime(this.form).then(response => {
            this.msgSuccess("审批成功");
            this.dialogTableVisible = false;
            this.getList();
          });
        }
      })
    },
    // 表单重置
    resetQueryParams() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        status: null,
        studentId: null,
        noticeId: null
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryParams();
      this.getList();
    },
    getNoticeTitle(id){
      let obj = this.noticeList.find(item=>item.id === id)
      return obj.title
    }
  }
};
</script>
