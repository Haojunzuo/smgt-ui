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
      <el-form-item label="报备事由">
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
      <el-form-item>
        <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>



    <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请人" align="center" prop="studentId" width="120">
        <template slot-scope="scope">
          <span>{{getStudentName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报备事由" align="center" prop="type" width="100">
        <template slot-scope="scope">
          <span>{{typeString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报备时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <!--          <span>{{parseTime(scope.row.startTime,'yyyy-MM-dd hh:mm')+'-'+parseTime(scope.row.endTime,'yyyy-MM-dd hh:mm')}}</span>-->
          <span>{{scope.row.startTime+' 至 '+scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地点" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCodeToText(scope.row.location)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === 1" size="medium" plain @click="getDialogData(scope.row)">待审批</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === 3" size="medium" plain @click="getDialogData(scope.row)">审批通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">审批拒绝</el-button>
          <!--          <span v-else>{{statusString(scope.row.status)}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getDialogData(scope.row)"
            v-if="scope.row.status === 1"
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
      <el-descriptions  title="报备信息" :column="3" :size="'medium'" border >
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
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            报备事由
          </template>
          <el-tag size="small">{{typeString(dialogData)}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            报备时间
          </template>
          {{dialogData.startTime+' 至 '+dialogData.endTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-location-outline"></i>
            目的地
          </template>
          {{getCodeToText(dialogData.location)+'-'+dialogData.detailLocation}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            报备理由
          </template>
          {{dialogData.reason}}
        </el-descriptions-item>
      </el-descriptions>
      <el-form ref="form" :model="form" :rules="rules">
       <el-descriptions  title="审批结果" :column="3" :size="'medium'" border style="margin-top: 20px">
        <template slot="extra">
          <el-button type="primary" size="small" @click="submitForm()" v-if="this.dialogData.status === 1">提交</el-button>
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
          <el-form-item style="margin: 0" v-if="this.dialogData.status === 1">
            <el-radio-group v-model="form.status">
              <el-radio :label="3">通过</el-radio>
              <el-radio :label="4">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-else>
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.status === 3">审批通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.status === 4">审批拒绝</el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            审批结果
          </template>
          <el-form-item  v-if="this.dialogData.status === 1" prop="result">
            <el-input type="textarea" v-model="form.result" ></el-input>
          </el-form-item>
          <div v-else>
            {{dialogData.result}}
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

const typeList = {
  1:'公假',
  2:'病假',
  3:'事假',
  4:'求职',
  5:'实习',
  6:'返家',
  7:'其他'
}
export default {
  name: "leaveCheck",
  data() {
    return {
      leaveList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        type: null,
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
        {label:'待审批',value:1},
        {label:'审批拒绝',value:4},
        {label:'审批通过',value:3}
      ],
      typeOptions: [
        {label:'公假',value:1},
        {label:'病假',value:2},
        {label:'求职',value:3},
        {label:'实习',value:4},
        {label:'返家',value:5},
        {label:'其他',value:6}
      ],
    }
  },
  created() {
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
      listLeave(this.queryParams).then(response => {
        this.leaveList = response.rows;
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
        userId: this.$store.getters.userInfo.userId,
        result: '审批通过',
        status: 3
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
          updateLeave(this.form).then(response => {
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
        studentId: null
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryParams();
      this.getList();
    },
  }
};
</script>
