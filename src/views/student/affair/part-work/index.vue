<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
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
      <el-form-item>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="partTimeList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请岗位" align="center" prop="noticeId" sortable>
        <template slot-scope="scope">
          <span>{{getNoticeName(scope.row.noticeId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="联系电话" align="center" prop="phone" >
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">审批中</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '2'" size="medium" plain @click="getDialogData(scope.row)">已通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">已拒绝</el-button>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="userId" >
        <template slot-scope="scope">
          <span>{{userString(scope.row.userId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
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
            icon="el-icon-view"
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
          <el-tab-pane label="进校申请" name="basic">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
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
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入联系方式"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="勤工助学:" prop="noticeId">
                    <el-select v-model="form.noticeId" placeholder="请选择" clearable>
                      <el-option
                        v-for="item in noticeList"
                        :key="item.id"
                        :label="item.title"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="个人介绍:" prop="detail">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请填写详细个人介绍"
                      v-model="form.detail">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="other">
            <el-form  label-width="80px">
              <el-form-item label="文件:">
                <fileUpload :value="form.file" :data="data" @input="changeTextFile($event)"/>
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
          {{dialogData.phone}}
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
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            个人介绍
          </template>
          {{dialogData.detail}}
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
          {{userString(dialogData.userId)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{phoneString(dialogData.userId)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            审批结果
          </template>
          <div >
            <el-button type="success" icon="el-icon-medal" v-if="this.dialogData.status === '2'">申请通过</el-button>
            <el-button type="danger" icon="el-icon-warning" v-if="this.dialogData.status === '3'">申请拒绝</el-button>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </div>
</template>

<script>
  import { listPartTime, getPartTime, delPartTime, addPartTime, updatePartTime, updatePartTimeStatus } from "@/api/student/partTime";
  import {listNotice} from "../../../../api/admin/notice/notice";
  import {listUser} from "../../../../api/user";

  export default {
    name: "request",
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
        showSearch: false,
        // 总条数
        total: 0,
        // 报备类别表格数据
        partTimeList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          status: null,
          studentId: this.$store.getters.studentInfo.id,
          noticeId: null
        },
        params: {
          pageNum: 1,
          endTime: new Date(),
          noticetype: '3'
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,
              message: '请输入正确的手机号码或者座机号',
            },
          ],
          detail: [
            { required: true, message: '请填写详细个人介绍'}
          ],
          noticeId: [
            { required: true, message: '请选择勤工助学'}
          ]
        },
        show:false,
        windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
        windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
        activeName: 'basic',
        statusOptions: [
          {label:'审批中',value:'1'},
          {label:'已通过',value:'2'},
          {label:'已拒绝',value:'3'}
        ],
        dialogTableVisible: false,
        dialogData: {},
        data: {
          bucket: 'student'
        },
        noticeList: [],
        userList: []
      };
    },
    created() {
      listUser({role: 2}).then(res=>{
        this.userList = res.data
      })
      listNotice(this.params).then(res=>{
        this.noticeList = res.rows
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
          console.log(response)
          this.partTimeList = response.rows;
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
          phone: null,
          noticeId: null,
          detail: null,
          status: null,
          userId: null,
          file: null,
        };
        this.resetForm("form");
      },
      // 表单重置
      resetQueryParams() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          status: null,
          studentId: this.$store.getters.studentInfo.id,
          noticeId: null
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
        getPartTime(id).then(response => {
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
              updatePartTime(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            } else {
              this.form.status = '1'
              addPartTime(this.form).then(response => {
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
          return delPartTime(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleHid(){
        this.show = false
        this.open = false
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
        console.log(data)
        this.dialogTableVisible = true
        this.dialogData = data
      },
      changeTextFile(fileData){
        this.form.file = fileData
      },
      getActive(status){
        if(status === '1') return 1
        else if(status === '2') return 2
        else return 4
      },
      tableRowClassName({row, rowIndex}){
        if(row.status === '1'){
        }else if(row.status === '2'){
          return 'success-row'
        } else {
          return 'error-row'
        }
      },
      getNoticeName(id){
        let obj = this.noticeList.find(item=> item.id === id)
        return obj.title
      },

    }
  };
</script>


<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #bef1a1;
  }

  .el-table .error-row {
    background: #efb4b4;
  }
</style>
