<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="课程编号" prop="courseno">
        <el-input
          v-model="queryParams.courseno"
          placeholder="请输入课程编号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="课程名称" prop="courseno">
        <el-input
          v-model="queryParams.coursename"
          placeholder="请输入课程名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="课程属性" prop="courseno">
        <el-input
          v-model="queryParams.courseattr"
          placeholder="请输入课程属性"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="课程学分" prop="credit">
        <el-input
          v-model="queryParams.credit"
          placeholder="请输入课程学分"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
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
          size="mini" @click="getList">刷新</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini" @click="handleImport">导入</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="courseList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="课程编号" align="center" prop="courseno" />
      <el-table-column label="课程名称" align="center" prop="coursename" />
      <el-table-column label="课程属性" align="center" prop="courseattr">
        <template slot-scope="scope">
          <span>{{showModel(scope.row,"courseattr")}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" prop="status" width="110">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-value="1"
            inactive-value="0"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="课程学分" align="center" prop="credit" />
      <el-table-column label="课程学时" align="center" prop="totalhour" />
      <el-table-column label="备注" align="center" prop="description" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
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
      :before-close="handleClose">

      <el-tabs v-model="activeName">
        <el-tab-pane label="基本信息" name="basicInfo">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="课程编号" prop="courseno" class="el-form-courseno">
              <el-input v-model="form.courseno" placeholder="请输入课程编号" />
            </el-form-item>
            <el-form-item label="课程名称" prop="coursename">
              <el-input v-model="form.coursename" placeholder="请输入课程名称" />
            </el-form-item>
            <el-form-item label="课程性质" prop="courseattr">
              <el-select v-model="form.courseattr" placeholder="请选择课程性质">
                <el-option label="必修课" value="01"/>
                <el-option label="专修课" value="02"/>
                <el-option label="实验课" value="03"/>
                <el-option label="公选课" value="04"/>
              </el-select>
            </el-form-item>
            <el-form-item label="课程学分" prop="credit">
              <el-select v-model="form.credit" placeholder="请选择课程学分">
                <el-option label="1学分" value="1"/>
                <el-option label="2学分" value="2"/>
                <el-option label="3学分" value="3"/>
                <el-option label="4学分" value="4"/>
                <el-option label="5学分" value="5"/>
                <el-option label="6学分" value="6"/>
              </el-select>
            </el-form-item>
            <el-form-item label="课程学时" prop="totalhour">
              <el-select v-model="form.totalhour" placeholder="请选择课程学时">
                <el-option label="16学时" value="16"/>
                <el-option label="32学时" value="32"/>
                <el-option label="48学时" value="48"/>
                <el-option label="64学时" value="64"/>
                <el-option label="80学时" value="80"/>
              </el-select>
            </el-form-item>
            <el-form-item label="课程简介" prop="description">
              <el-input
                class="input-description"
                type="textarea"
                :autosize="{minRows:3, maxRows:6}"
                placeholder="请输入内容"
                v-model="form.description"
              />
            </el-form-item>
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="'1'">启用</el-radio>
                <el-radio :label="'0'">停用</el-radio>
              </el-radio-group>
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
import { listCourse, checkno, addCourse, updateCourse, getCourse, delCourse } from '@/api/admin/course/course'
import {getToken} from "@/utils/auth";

export default {
  name: "SubSystem",
  data(){
    let checkCourseno = (rule,value,callback)=>{
      if(value===""||value===null){
        callback(new Error("课程编号不能为空"))
      }else {
        checkno(this.form,value).then(response=>{
          if(response===false){
            callback(new Error("重复啦，换一个试试~"))
          }else{
            callback()
          }
        })
      }
    }
    return {
      courseattrList:{"01":"必修", "02":"选修", "03":"体育", "04":"实验"},
      activeName:'basicInfo',
      postData: {
        bucket: "test2"
      },
      drawer:false,
      direction:'rtl',
      total:0,
      single:true,
      multiple:true,
      ids:[],
      showSearch:false,
      courseList:[],
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coursename:null,
        courseno:null,
        courseattr:null,
        credit:null,
        totalhour:null,
      },
      // 表单参数
      form: {
        status:"1",
        courseattr:'01',
        credit:2,
        totalhour:32,
      },
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/course/importCourse"
      },
      rules: {
        courseno: [
          {
            required: true,
            trigger: "blur",
            validator:checkCourseno
          }
        ],
        coursename: [
          {
            required: true,
            message: "仓库名称不能为空",
            trigger: "blur",
          }
        ],
      },
    }
  },
  created(){
    this.getList();
  },
  watch:{
    queryParams:{
      deep:true,
      handler:"getList"
    }

  },
  methods:{
    outputFiles(data){
      this.form.warehouseDoc = data
      console.log("fileData:",data)
    },
    outputPics(data){
      this.form.warehousePic = data
      console.log("picData:",data)
    },
    getList() {
      this.loading = true;
      listCourse(this.queryParams).then(response=>{
        this.courseList = response.rows;
        this.total = response.total;
        this.loading = false;
        console.log(response)
        console.log(this.courseList)
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.credit = null;
      this.queryParams.courseno = null;
      this.queryParams.coursename = null;
      this.queryParams.courseattr = null;
      this.queryParams.totalhour = null;
      this.handleQuery();
    },
    handleQuery(){
      this.queryParams.pageNum = 1;
      this.getList();
    },
    handleAdd() {
      this.reset();
      this.drawer = true;
    },
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCourse(id).then(response=>{
        this.form = response.data;
        this.title = "修改课程";
        this.drawer = true;
      })
    },
    handleDelete(row){
      const id = row.id || this.ids;
      this.$confirm("是否确定课程编号为"+id+"的数据项?","警告",{
        confirmButtonClass:"确定",
        cancelButtonText:"取消",
        type:"warning",
      }).then(function(){
        return delCourse(id);
      }).then(()=>{
        this.getList();
        this.msgSuccess("删除成功")
      }).catch(()=>{})
    },

    handleExport(){
      this.download('/course/exportCourse',{
        ...this.queryParams
      },'course.xlsx')
    },
    handleImport(){
      this.upload.title = "导入";
      this.upload.open = true;
    },
    handleStatusChange(row) {
      let text = row.status === "0" ? "停用" : "启用";
      this.$confirm('确认要"' + text + '"'+'名称为'+'"' + row.coursename + '"的课程吗?', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(function() {
        updateCourse(row).then(response => {
        });
      }).then(()=>{
        this.msgSuccess(text+row.coursename+"课程成功");
      })
        .catch(function() {
        row.status = row.status === "0" ? "1" : "0";
      });
    },
    handleClose(done){
      this.form = {}
      done();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        courseno: null,
        coursename: null,
        courseattr: "01",
        credit: 2,
        totalhour: 32,
        description: null,
        status: '1',
      };
      this.resetForm("form");
    },
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.id!=null){
            updateCourse(this.form).then(response=>{
              this.msgSuccess("修改成功");
              this.drawer = false;
              this.getList();
            })
          }else{
            addCourse(this.form).then(response=>{
              this.msgSuccess("新增成功");
              console.log(response)
              this.drawer = false;
              this.getList();
            })
          }
        }
      })
    },
    cancel(){
      this.drawer = false;
      this.reset();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitImportCourse() {
      this.$refs.upload.submit();
    },
    showModel(row,str){
      let name = null;
      if(str==='courseattr'){
        for (const courseattr in this.courseattrList){
          if (row.courseattr===courseattr){
            name = this.courseattrList[courseattr];
            return name;
          }
        }
        name="其他"
      }
      return name;
    },
  },
};
</script>

<style>
 .el-tabs--top, .el-tabs--bottom, .el-tabs--top .el-tabs__item.is-top:nth-child(2), .el-tabs--top .el-tabs__item.is-bottom:nth-child(2), .el-tabs--bottom .el-tabs__item.is-top:nth-child(2), .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2){
  padding-left: 20px;
}
 .el-input{
   width: 95%;
 }
 .el-form-courseno{
   margin-top: 18px;
 }
 .button-submitForm{
   margin-right: 20px;
 }
 .input-description{
   width: 95%;
 }

</style>
