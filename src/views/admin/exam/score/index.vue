<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" class="queryClassTable" @submit.native.prevent>
      <el-form-item label="学期" prop="semester">
        <el-select v-model="queryParams.semester" placeholder="请选择学期">
          <el-option value="2015-2016-1" label="2015-2016-1"/>
          <el-option value="2015-2016-2" label="2015-2016-2"/>
          <el-option value="2016-2017-1" label="2016-2017-1"/>
          <el-option value="2016-2017-2" label="2016-2017-2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程" prop="courseNo">
        <el-select v-model="queryParams.courseNo" placeholder="请选择">
          <el-option
            v-for="item in courseList"
            :key="item.courseno"
            :label="item.coursename"
            :value="item.courseno"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="学号" prop="title" >
        <el-input
          v-model="queryParams.studentNo"
          placeholder="请输入学生学号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              size="mini" @click="getScoreList"
            >查询
            </el-button>
          </el-col>

          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-upload2"
              size="mini" @click="handleImport"
            >导入
            </el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-download"
              size="mini" @click="handleExport"
            >导出
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="scoreList">
      <el-table-column label="学期" align="center" prop="semester"/>
      <el-table-column label="课程编号" align="center" prop="courseNo"/>
      <el-table-column label="课程名称" align="center" prop="courseName"/>
      <el-table-column label="课程属性" align="center" prop="courseAttr">
        <template slot-scope="scope">
          <span>{{showModel(scope.row,'courseAttr')}}</span>
        </template>
      </el-table-column>
      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="分数" align="center" prop="score">
        <template slot-scope="scope">
          <span v-if="scope.row.score!==-1&&scope.row.isEditOps===false">{{scope.row.score}}</span>
          <el-input v-model="scope.row.score" v-else-if="scope.row.isEdit" type="number"></el-input>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="primary"
            icon="el-icon-edit"
            circle
            @click="varUpdate(scope.$index)"
            v-show="!scope.row.isEditOps && scope.row.id"
          ></el-button>
          <el-button
            size="small"
            type="success"
            icon="el-icon-check"
            @click="varCheck(scope)"
            circle
            v-show="scope.row.isEditOps"
          ></el-button>
          <el-button
            size="small"
            type="info"
            icon="el-icon-close"
            circle
            @click="varCancelCheck(scope.$index)"
            v-show="scope.row.isEditOps"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getScoreList"
    />
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
import { isEntryStart, listScore, updateScore, updateEntryStart, insertScoreTable } from '@/api/admin/exam/score'
import { delCourse, listCourse } from '@/api/admin/course/course'
import { getToken } from '@/utils/auth'

export default {
  name: 'SubSystem',
  data() {
    return {
      scoreList:[],
      courseList: [],
      total:0,
      form: {
      },
      loading: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        semester:'2015-2016-1',
        courseNo:null,
        studentNo:null
      },
      queryCourse: {
        pageNum: 1,
        pageSize: 500
      },
      cancelUpdate:{},
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
        url: process.env.VUE_APP_BASE_API + "/score/importScore"
      },
    }
  },
  created() {
    this.checkEntryStart();
  },
  watch: {},

  methods: {
    handleImport(){
      this.upload.title = "导入学生成绩"
      this.upload.open = true;
    },
    handleExport(){
      this.download('/score/exportScore',{
        ...this.queryParams
      },'score.xlsx')
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
      this.getScoreList();
    },
    // 提交上传文件
    submitImportCourse() {
      this.$refs.upload.submit();
    },
    checkEntryStart(){
      isEntryStart("2015-2016-1").then(res=>{
        if (res.data===false){
          this.$confirm("是否开启2015-2016-1学期的成绩录入工作","警告",{
            confirmButtonClass:"确定",
            cancelButtonText:"取消",
            type:"warning",
          }).then(function(){
            return updateEntryStart('2015-2016-1');
          }).then(()=>{
            return insertScoreTable('2015-2016-1');
          }).then(()=>{
            this.getScoreList()
            this.getCourseList()
            this.msgSuccess("开启成功")
          }).catch(()=>{})
        }else {
          this.getScoreList()
          this.getCourseList()
        }
      })
    },


    varUpdate(index){
      this.cancelUpdate = JSON.parse(JSON.stringify(this.scoreList[index]));
      this.scoreList[index].isEditOps = true;
      this.scoreList[index].isEdit = true;

    },
    varCheck(scope){
      let varCheckData = this.scoreList[scope.$index];
      varCheckData.isEdit = undefined
      varCheckData.isEditOps = undefined
      console.log(varCheckData.score)
      if (varCheckData.score===null||varCheckData.score===''){
        alert("请输入分数")
      }else{
        updateScore(varCheckData).then(res=>{
          this.msgSuccess(res.msg);
          this.$set(this.scoreList[scope.$index],'isEdit',false)
          this.$set(this.scoreList[scope.$index],'isEditOps',false);
          this.cancelUpdate = {};
        }).catch(Error=>{
          this.$set(this.scoreList, scope.index, JSON.parse(JSON.stringify(this.cancelUpdate)))
          console.log(Error)
        })
      }

    },
    varCancelCheck(index){
      this.$set(this.scoreList, index, JSON.parse(JSON.stringify(this.cancelUpdate)));
      this.cancelUpdate = {};
    },
    cancel(){
      this.reset();
    },
    handleQuery(){
      this.queryParams.pageNum = 1;
      this.getNoticeList();
    },
    getScoreList() {
      this.loading = true;
      listScore(this.queryParams).then(response => {
        let scores = response.rows
        this.total = response.total;
        for (let i=0; i<scores.length; i++){
          this.$set(scores[i],'isEdit',false);
          this.$set(scores[i],'isEditOps',false);
          scores[i].score=scores[i].score===-1?null:scores[i].score
        }
        this.scoreList = scores;
        this.loading = false;
      })
    },
    getCourseList() {
      listCourse().then(response => {
        this.courseList = response.rows
      })
    },

    showModel(row, str) {
      const courseAttrMap = {'01':'必修','02':'选修','03':'实验','04':'体育',}
      if (str==='courseAttr'){
        return courseAttrMap[row.courseAttr];
      }
    },

    handleUpdate(row) {
      this.reset()
      const id = row.id
    },

    reset() {
      this.form = {
        id: null,
        noticeno: null,
        title: null,
        content: null,
        publisher: null,
        noticetime: null,
        noticetype: '0',
        file: null,
        urgency: '0',
        status: '0',
        institution: '0'

      }
      this.resetForm('form')
    }
  }
}
</script>
<style>
.dialog-footer {
  align-items: center;
  align-content: center;
}
</style>
