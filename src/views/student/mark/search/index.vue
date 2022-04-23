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
      <el-form-item>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-search"
              size="medium" @click="resetQuery"
            >重置
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
          <span v-if="scope.row.score!=='null'">{{scope.row.score}}</span>
          <span v-else-if="scope.row.score==='null'">未公布</span>
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
      student: {},
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
    }
  },
  created() {
    this.student = this.$store.getters.studentInfo
    this.queryParams.studentNo = this.student.studentNo;
    this.getScoreList();
    this.getCourseList();
  },
  watch: {
    queryParams:{
      deep:true,
      handler:"getScoreList"
    }
  },

  methods: {
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.semester = null;
      this.queryParams.courseno = null;
      this.handleQuery();
    },
    handleQuery(){
      this.queryParams.pageNum = 1;
      this.getScoreList();
    },
    getScoreList() {
      this.loading = true;
      listScore(this.queryParams).then(response => {
        let scores = response.rows
        this.total = response.total;
        for (let i=0; i<scores.length; i++){
          scores[i].score=scores[i].score===-1?'null':scores[i].score
        }
        this.scoreList = scores;
        this.loading = false;
        console.log("this.scoreList:",this.scoreList)
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
  }
}
</script>
<style>
.dialog-footer {
  align-items: center;
  align-content: center;
}
</style>
