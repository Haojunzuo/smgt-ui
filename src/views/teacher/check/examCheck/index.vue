<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item label="类型">
        <el-select v-model="queryParams.type" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeOptions"
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
      <el-form-item label="课程">
        <el-select v-model="queryParams.courseNo" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in courseList"
            :key="item.courseno"
            :label="item.coursename"
            :value="item.courseno">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examList" >
      <el-table-column label="申请人" align="center" prop="studentId" >
        <template slot-scope="scope">
          <span>{{getStudentName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" prop="type" >
        <template slot-scope="scope">
          <span>{{typeString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="time">
        <template slot-scope="scope">
          <span>{{scope.row.time}}</span>
        </template>
      </el-table-column>
      <el-table-column label="课程" align="center" prop="courseNo">
        <template slot-scope="scope">
          <span>{{getCourse(scope.row.courseNo)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">待审批</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '3'" size="medium" plain @click="getDialogData(scope.row)">审批通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">审批拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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
      <el-descriptions  title="申请信息" :column="3" :size="'medium'" border >
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
          {{this.dialogData.studentInfo.phoneNumber}}
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
        <el-descriptions-item span="2">
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            申请时间
          </template>
          {{dialogData.time}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            类型
          </template>
          <el-tag size="small">{{typeString(dialogData)}}</el-tag>
        </el-descriptions-item>

      </el-descriptions>
      <el-form ref="form" :model="form" :rules="rules">
       <el-descriptions  title="审批结果" :column="3" :size="'medium'" border style="margin-top: 20px">
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
              <el-radio :label="'3'">通过</el-radio>
              <el-radio :label="'2'">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-else>
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.status === '3'">审批通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.status === '2'">审批拒绝</el-button>
          </div>
        </el-descriptions-item>

      </el-descriptions>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { listLeave, updateLeave } from "@/api/student/leave";
import {CodeToText} from "element-china-area-data";
import {listStudent} from "../../../../api/student/student";
import { listCourse } from '@/api/admin/course/course'
import { listExam, getExam, delExam, addExam, updateExam } from "@/api/student/exam";

const typeList = {
  '1':'缓考',
  '2':'补考'
}
export default {
  name: "leaveCheck",
  data() {
    return {
      examList: [],
      courseList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        type: null,
        studentId: null,
        courseNo: null
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
      showSearch: true,
      // 总条数
      total: 0,
      studentList: [],
      dialogTableVisible: false,
      form: {},
      rules: {
        result: [
          { required: true, message: '请输入审批结果', trigger: 'blur' }
        ]
      },
      statusOptions: [
        {label:'待审批',value:'1'},
        {label:'审批拒绝',value:'2'},
        {label:'审批通过',value:'3'}
      ],
      typeOptions: [
        {label:'缓考',value:'1'},
        {label:'补考',value:'2'},
      ],
    }
  },
  created() {
    listStudent({pageNum: 1}).then(res=>{
      this.studentList = res.rows
    })
    listCourse().then(response=>{
        this.courseList = response.rows;
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
      listExam(this.queryParams).then(response => {
        console.log(response)
        this.examList = response.rows;
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
    typeString (value) {
      return typeList[value.type]
    },
    getCodeToText(codeStr) {
      let codeArray = codeStr.split(",")
      let area = "";
      switch (codeArray.length) {
        case 1:
          area += CodeToText[codeArray[0]];
          break;
        case 2:
          area += CodeToText[codeArray[0]] + "-" + CodeToText[codeArray[1]];
          break;
        case 3:
          area +=
            CodeToText[codeArray[0]] +
            "-" +
            CodeToText[codeArray[1]] +
            "-" +
            CodeToText[codeArray[2]];
          break;
        default:
          break;
      }
      return area;
    },
    userString(id){
      if(id === null) return '无'
      else return id
    },
    getDialogData(data){
      this.form = {
        id: data.id,
        checkId: this.$store.getters.userInfo.userId,
        status: '3'
      }
      this.dialogTableVisible = true
      this.dialogData = data
      this.dialogData.studentInfo = this.studentList.find(item=>item.id === data.studentId)
      console.log(this.dialogData)
    },
    getStudentName(data){
      let obj = this.studentList.find(item=>item.id === data.studentId)
      return obj.nickName
    },
    submitForm(){
      this.$refs["form"].validate(valid => {
        if(valid){
          console.log(this.form)
          updateExam(this.form).then(response => {
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
        type: null,
        studentId: null,
        courseNo: null
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryParams();
      this.getList();
    },
    getCourse(courseNo){
      let obj = this.courseList.find((item)=>item.courseno === courseNo)
      return obj.coursename
    }
  }
};
</script>
