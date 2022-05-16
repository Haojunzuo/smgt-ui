<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审批状态" prop="staffCatCode">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="staffCatCode">
        <el-select v-model="queryParams.type" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="课程" prop="courseNo">
        <el-select v-model="queryParams.courseNo" placeholder="请选择" clearable>
          <el-option
            v-for="item in myCourseList"
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="examList">
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
      <el-table-column label="课程" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCourse(scope.row.courseNo)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">审批中...</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '3'" size="medium" plain @click="getDialogData(scope.row)">审批通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">审批拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="userId">
        <template slot-scope="scope">
          <span>{{userString(scope.row.checkId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-if="scope.row.status === '1'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status === '1'"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="getDialogData(scope.row)"
            v-if="scope.row.status !== '1'"
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

    <el-drawer
      title="我是标题"
      :visible.sync="open"
      v-if="show"
      :direction="'rtl'"
      :with-header="false"
      :size="'36%'"
      >
        <el-card>
          <el-tabs v-model="activeName">
            <el-tab-pane label="申请" name="basic">
              <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="申请人: ">
                      {{this.$store.getters.nickName}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="学号: ">
                      {{this.$store.getters.studentInfo.studentNo}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="所在学院: " >
                      {{this.$store.getters.studentInfo.collegeInfo.collegename}}
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="课程:" prop="courseNo">
                      <el-select v-model="form.courseNo" placeholder="请选择" clearable>
                        <el-option
                          v-for="item in myCourseList"
                          :key="item.courseno"
                          :label="item.coursename"
                          :value="item.courseno">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="类型:" prop="type">
                      <el-radio-group v-model="form.type">
                        <el-radio label="1">缓考</el-radio>
                        <el-radio label="2">补考</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
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

    <el-dialog title="审批详情" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">
      <el-descriptions  title="提交信息" :column="3" :size="'medium'" border >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            申请人
          </template>
          {{this.$store.getters.nickName}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            学号
          </template>
          {{this.$store.getters.studentInfo.studentNo}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{this.$store.getters.studentInfo.phoneNumber}}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            所在学院
          </template>
          {{this.$store.getters.studentInfo.collegeInfo.collegename}}
        </el-descriptions-item>
        <el-descriptions-item >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            班级
          </template>
          {{this.$store.getters.studentInfo.classInfo.classname}}
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
            申请类型
          </template>
          <el-tag size="small">{{typeString(dialogData)}}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0">
        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">审批状态</div>
        <el-steps :space="600" :active="dialogData.status === '1'? 1:3" finish-status="success" :align-center="true" :process-status="'finish'" simple>
          <el-step title="提交信息"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批完成"></el-step>
        </el-steps>
      </div>
      <el-descriptions  title="审批结果" :column="3" :size="'medium'" border class="margin-top" v-if="dialogData.status!=='1'">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            审批人
          </template>
          {{userString(dialogData.checkId)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{phoneString(dialogData.checkId)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            审批结果
          </template>
          <div>
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.status === '3'">审批通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.status === '2'">审批拒绝</el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </div>
</template>

<script>
  import { listExam, getExam, delExam, addExam, updateExam } from "@/api/student/exam";
  import {getUser, listUser} from "../../../../api/user";
  import { getCoursePlan} from '@/api/admin/course/schedule'
  import { getStudentElCourse} from "../../../../api/student/studentElCourse";
  import { listCourse } from '@/api/admin/course/course'
  const typeList = {
    '1':'缓考',
    '2':'补考'
  }
  export default {
    name: "exam",
    data() {
      return {
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
        // 报备类别表格数据
        examList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          courseNo: null,
          status: null,
          type: null,
          studentId: this.$store.getters.studentInfo.id
        },
        // 表单参数
        form: {},
        activeName: 'basic',
        // 表单校验
        rules: {
          type: [
            { required: true, message: '请选择报备事由'}
          ],
          courseNo: [
            { required: true, message: '请选择课程'}
          ],
        },
        show:false,
        statusOptions: [
          {label:'审批中',value:'1'},
          {label:'审批拒绝',value:'2'},
          {label:'审批通过',value:'3'}
        ],
        typeOptions: [
          {label:'缓考',value:'1'},
          {label:'补考',value:'2'},
        ],
        dialogTableVisible: false,
        dialogData: {},
        userList: [],
        constTakeList: [],
        takeList: [],
        haveTime: [],
        myCourseList: [],
        courseList: [],
        courseMap: {}
      };
    },
    created() {
      listUser({role: 2}).then(res=>{
        this.userList = res.data
      })
      this.getList();
      this.getCoursePlanList();
    },
    watch:{
      queryParams:{
        deep:true,
        handler:"getList"
      }
    },
    methods: {
      arrUnique(list) {
        let newArr = [];
        let arrId = [];
        for(let item of list){
          if(arrId.indexOf(item['courseno']) === -1){
            arrId.push(item['courseno']);
            newArr.push(item);
          }else {

          }
        }
        return newArr;
      },
      getCoursePlanList(){
        listCourse().then(response=>{
          let courseList = response.rows;
          this.courseList = response.rows;
          let courseMap = {};
          for (let i=0; i<courseList.length; i++){
            courseMap[courseList[i].courseno] = courseList[i];
          }
          this.courseMap = courseMap;

        getCoursePlan({
          pageNum: 1,
          semester:"2015-2016-1",
          classno:this.$store.getters.studentInfo.classNo,
        }).then(response=>{
          this.constTakeList = this.arrUnique(response.rows);
          getStudentElCourse(this.$store.getters.studentInfo.studentNo).then(res=>{
            console.log(res)
            if(res.data !== undefined){
              for(let item of res.data){
                this.constTakeList.push(item.elCourses)
              }
            }
          })
          this.myCourseList = []
          for (let i=0; i<this.constTakeList.length; i++){
            let courseNo = this.constTakeList[i].courseno || this.constTakeList[i].courseNo
            console.log(this.courseMap)
            this.myCourseList.push(this.courseMap[courseNo])
          }
          console.log(this.myCourseList)
        });
        })
      },
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
      // 取消按钮
      cancel() {
        this.open = false;
        this.show = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          studentId: null,
          type: '1',
          time: null,
          status: null,
          checkId: null,
          courseNo: null
        };
        this.resetForm("form");
      },
      // 表单重置
      resetQueryParams() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          courseNo: null,
          status: null,
          type: null,
          studentId: this.$store.getters.studentInfo.id
        };
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetQueryParams();
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.show = true;
        this.open = true;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getExam(id).then(response => {
          console.log(response.data)
          this.form = response.data;
          this.open = true;
          this.show = true;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.studentId = this.$store.getters.studentInfo.id
            console.log(this.form)
            if (this.form.id != null) {
              updateExam(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            } else {
                this.form.status = '1'
                addExam(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delExam(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleHid(){
        this.show = false
        this.open = false
      },
      typeString (value) {
        return typeList[value.type]
      },
      userString(id){
        if(id === null) return '无'
        else {
          let obj = this.userList.find(item=>item.userId === id)
          return obj.nickName
        }
      },
      phoneString(id){
        if(id === null) return '无'
        else {
          let obj = this.userList.find(item=>item.userId === id)
          return obj.phoneNumber
        }
      },
      getDialogData(data){
        this.dialogTableVisible = true
        this.dialogData = data
      },
      getCourse(courseNo){
        return this.courseMap[courseNo].coursename
      }
    }
  };
</script>
