<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="true" label-width="68px">
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

    <el-table v-loading="loading" :data="toRequestList" @selection-change="handleSelectionChange">
      <el-table-column label="申请人" align="center" prop="studentId" width="120">
        <template slot-scope="scope">
          <span>{{getStudentName(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" align="center" prop="type" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.requestTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交通方式" align="center">
        <template slot-scope="scope">
          <span>{{toTypeString(scope.row.toType) + '-' +scope.row.toNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计到校时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <span>{{scope.row.toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发地" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCodeToText(scope.row.location)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">待审批</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status !== '1' && scope.row.resultType === '1'" size="medium" plain @click="getDialogData(scope.row)">已通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">已拒绝</el-button>
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
        <el-descriptions-item>
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            申请时间
          </template>
          {{dialogData.requestTime}}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            出发地
          </template>
          {{getCodeToText(dialogData.location)+'-'+dialogData.detailLocation}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label" >
            <i class="el-icon-location-outline"></i>
            交通方式
          </template>
          {{toTypeString(dialogData.toType) + '-' +dialogData.toNum}}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            预计到校时间
          </template>
          {{dialogData.toTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            行程详细信息
          </template>
          {{dialogData.toDetail}}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0" v-if="(this.dialogData.imgFile!=='' && this.dialogData.imgFile!==null) || (this.dialogData.textFile!=='' && this.dialogData.textFile!==null)">
        <el-row>
          <el-col :span="12" v-if="this.dialogData.imgFile!=='' && this.dialogData.imgFile!==null">
            <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">上传图片</div>
            <imageUpload :value="this.dialogData.imgFile" :data="data" :isShowTip="false" :limit="1"/>
          </el-col>
          <el-col :span="12" v-if="this.dialogData.textFile!=='' && this.dialogData.textFile!==null">
            <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">上传文件</div>
            <fileUpload :value="this.dialogData.textFile" :data="data" :isShowTip="false" :limit="1" :isShowButton="false"/>
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
            <el-radio-group v-model="form.resultType">
              <el-radio :label="'1'">通过</el-radio>
              <el-radio :label="'2'">拒绝</el-radio>
            </el-radio-group>
          </el-form-item>
          <div v-else>
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.resultType === '1'">审批通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.resultType === '2'">审批拒绝</el-button>
          </div>
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            审批内容
          </template>
          <el-form-item  v-if="this.dialogData.status === '1'" prop="result">
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
import { listToRequest, updateToRequest } from "@/api/student/toRequest";
import {CodeToText} from "element-china-area-data";
import {listStudent} from "../../../../api/student/student";

export default {
  name: "requestCheck",
  data() {
    return {
      toRequestList: [],
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
      showSearch: false,
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
        {label:'审批完成',value:'2'}
      ],
      toTypeList: ['','飞机','高铁','火车','私家车'],
      data: {
        bucket: 'student'
      },
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
      listToRequest(this.queryParams).then(response => {
        console.log(response.rows)
        this.toRequestList = response.rows;
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
    toTypeString (data) {
      return this.toTypeList[data]
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
        status: '2',
        resultType: '1'
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
          updateToRequest(this.form).then(response => {
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
