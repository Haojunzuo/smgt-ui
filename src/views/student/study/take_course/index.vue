<template>
  <div class="container">
    <el-tabs type="border-card" class="courseTab">
      <el-tab-pane label="我的课程表">
        <span slot="label"><i class="el-icon-date"></i> 我的课程表</span>
        <el-table :data="coursePlan" border :header-cell-style="{background:'#e4fcfc',color:'#2ca29e', 'line-height':'45px'}" class="classTable">
          <el-table-column label="时间" align="center" prop="classNo">
            <template slot-scope="scope">
              {{scope.row['classNo']}}<br/>
              {{scope.row['time']}}
            </template>
          </el-table-column>
          <el-table-column label="周一" align="center" prop="represent0" >
            <template slot-scope="scope">
              {{scope.row['courseName0']}}<br/>
              {{scope.row['teacher0']}}<br/>
              {{scope.row['location0']}}<br/>
              {{scope.row['length0']}}<br/>
            </template>
          </el-table-column>
          <el-table-column label="周二" align="center" prop="represent1">
            <template slot-scope="scope">
              {{scope.row['courseName1']}}<br/>
              {{scope.row['teacher1']}}<br/>
              {{scope.row['location1']}}<br/>
              {{scope.row['length1']}}<br/>
            </template>
          </el-table-column>
          <el-table-column label="周三" align="center" prop="represent2">
            <template slot-scope="scope">
              {{scope.row['courseName2']}}<br/>
              {{scope.row['teacher2']}}<br/>
              {{scope.row['location2']}}<br/>
              {{scope.row['length2']}}<br/>
            </template>
          </el-table-column>
          <el-table-column label="周四" align="center" prop="represent3">
            <template slot-scope="scope">
              {{scope.row['courseName3']}}<br/>
              {{scope.row['teacher3']}}<br/>
              {{scope.row['location3']}}<br/>
              {{scope.row['length3']}}<br/>
            </template>
          </el-table-column>
          <el-table-column label="周五" align="center" prop="represent4">
            <template slot-scope="scope">
              {{scope.row['courseName4']}}<br/>
              {{scope.row['teacher4']}}<br/>
              {{scope.row['location4']}}<br/>
              {{scope.row['length4']}}<br/>
            </template>
          </el-table-column>

        </el-table>

      </el-tab-pane>
      <el-tab-pane label="已选课程">
        <span slot="label"><i class="el-icon-date"></i> 已选课程</span>
        <el-table v-loading="loading" :data="haveTake">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column label="课程名称" align="center" prop="courseno">
            <template slot-scope="scope">
              <span>{{getCourseName(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="授课教师" align="center" prop="teacherno">
            <template slot-scope="scope">
              <span>{{getTeacher(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="学时" align="center" prop="length">
            <template slot-scope="scope">
              <span>{{getLength(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="学分" align="center" prop="score">
            <template slot-scope="scope">
              <span>{{getScore(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="课程类型" align="center" prop="type">
            <template slot-scope="scope">
              <span>{{getType(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
            <template slot-scope="scope" >
              <div v-if="scope.row.classno === undefined">
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-edit"
                  @click="handleBack(scope.row)"
                >退课</el-button>
                <el-button
                  size="mini"
                  type="text"
                  icon="el-icon-delete"
                >抽签</el-button>
              </div>
              <span v-else>暂无操作</span>

            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="选课">
        <span slot="label"><i class="el-icon-date"></i> 选课</span>
        <el-form :model="queryParamsSelect" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="开课学院" prop="staffCatCode">
            <el-select v-model="queryParamsSelect.collegeNo" placeholder="请选择开课学院" filterable clearable>
              <el-option
                v-for="item in collegeList"
                :key="item.collegeno"
                :label="item.collegename"
                :value="item.collegeno">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程名称" prop="staffCatCode">
            <el-select v-model="queryParamsSelect.courseNo" placeholder="请选择课程名称" filterable clearable>
              <el-option
                v-for="item in courseList"
                :key="item.courseno"
                :label="item.coursename"
                :value="item.courseno">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="教师名称" prop="staffCatCode">
            <el-select v-model="queryParamsSelect.teacherNo" placeholder="请选择教师名称" filterable clearable>
              <el-option
                v-for="item in teacherList"
                :key="item.teacherno"
                :label="item.teachername"
                :value="item.teacherno">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="courseLoading" :data="elCourseList">
          <el-table-column label="课程名称" align="center" prop="courseNo">
            <template slot-scope="scope">
              <span>{{getCourseName(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="开课学院" align="center" prop="collegeNo">
            <template slot-scope="scope">
              <span>{{getCollegeName(scope.row.collegeNo)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="授课教师" align="center" prop="teacherNo">
            <template slot-scope="scope">
              <span>{{getTeacher(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="学时" align="center" prop="length">
            <template slot-scope="scope">
              <span>{{getLength(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="学分" align="center" prop="score">
            <template slot-scope="scope">
              <span>{{getScore(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="上课时间" align="center" prop="courseTime">
            <template slot-scope="scope">
              <span>{{getTime(scope.row.courseTime)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="周次" align="center" prop="weeks">
            <template slot-scope="scope">
              <span>{{scope.row.weeks}}</span>
            </template>
          </el-table-column>
          <el-table-column label="限制人数" align="center" prop="limitation">
            <template slot-scope="scope">
              <span>{{scope.row.limitation}}</span>
            </template>
          </el-table-column>
          <el-table-column label="已选人数" align="center" prop="studentNumber">
            <template slot-scope="scope">
              <span>{{scope.row.studentNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleSelect(scope.row)"
              >选课</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParamsSelect.pageNum"
          :limit.sync="queryParamsSelect.pageSize"
          @pagination="getElCourse"
        />

      </el-tab-pane>
<!--      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>-->
    </el-tabs>
  </div>
</template>

<script>
import { getCoursePlan, listClass, listCollege, listTeacher } from '@/api/admin/course/schedule'
import { listCourse } from '@/api/admin/course/course'
import { getStudentElCourse, addStudentElCourse, delStudentElCourse} from "../../../../api/student/studentElCourse";
import {listElCourse, } from "../../../../api/admin/course/elCourse";

export default {
  name: "takeCourse",
  data() {
    return {
      courseList:[],
      collegeList:[],
      elCourseList:[],
      teacherList: [],
      coursePlan:[],
      constTakeList: [],
      takeList: [],
      haveTime: [],
      courseMap:{},
      teacherMap:{},
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        semester:"2015-2016-1",
        classno:this.$store.getters.studentInfo.classNo,
      },
      loading: false,
      courseLoading: false,
      // 查询参数
      queryParamsSelect: {
        pageNum: 1,
        pageSize: 10,
        collegeNo: null,
        courseNo: null,
        teacherNo: null
      },
      queryCollege:{
        pageNum: 1,
        pageSize: 30,
      },
      // 显示搜索条件
      showSearch: true,
      total: 0
    }
  },
  created() {
    this.getCoursePlanList();
    this.getCourseList();
    this.getTeacherList();
    this.getElCourse();
    this.getCollege();
  },
  computed: {
    haveTake(){
      const courseList = this.constTakeList
      console.log(courseList.concat(this.takeList))
      return courseList.concat(this.takeList)
    }
  },
  watch:{
    queryParamsSelect:{
      deep:true,
      handler:"getElCourse"
    }
  },
  methods: {
    getCoursePlanList(){
      getCoursePlan(this.queryParams).then(response=>{
        let coursePlan = [];
        let coursePlanList = response.rows;
        this.constTakeList = this.arrUnique(response.rows);
        let timess = [['01','06','11','16','21'], ['02','07','12','17','22'], ['03','08','13','18','23'],
          ['04','09','14','19','24'], ['05','10','15','20','25']]
        this.takeList = []
        this.haveTime = []
        getStudentElCourse(this.$store.getters.studentInfo.studentNo).then(res=>{
          console.log(res)
          if(res.data !== undefined){
            for(let item of res.data){
              coursePlanList.push(item.elCourses)
              this.takeList.push(item.elCourses)
            }
          }

          for (let i=0; i<timess.length; i++){
            let obj = {};
            switch (i) {
              case 0:
                obj["classNo"] = "第一节课";
                obj["time"] = "（8:00-9:35）"
                break;
              case 1:
                obj["classNo"] = "第二节课";
                obj["time"] = "（9:55-11:30）"
                break;
              case 2:
                obj["classNo"] = "第三节课";
                obj["time"] = "（13:30-15:05）"
                break;
              case 3:
                obj["classNo"] = "第四节课";
                obj["time"] = "（15:25-15:00）"
                break;
              case 4:
                obj["classNo"] = "第五节课";
                obj["time"] = "（18:30-20:05）"
                break;
            }

            let times = timess[i];
            for (let j=0; j<times.length; j++){
              for (let k=0; k<coursePlanList.length; k++){
                const course = coursePlanList[k];
                let allTime = course.classtime || course.courseTime
                if (times[j]===allTime){
                  this.haveTime.push(allTime)
                  const courseName = this.courseMap[course['courseno']] || this.courseMap[course['courseNo']]
                  const teacherName = this.teacherMap[course['teacherno']] || this.teacherMap[course['teacherNo']]
                  const classroomNo = course['classroomno'] || course['classroomNo'];
                  const courseRoom = course['weekssum'] || course['weeks']
                  obj["courseName"+j] = courseName;
                  obj["teacher"+j] = teacherName;
                  obj["location"+j] = '地点：' + classroomNo + '教室';
                  obj["length"+j] = '周次：1-' + courseRoom;
                }
              }
            }
            coursePlan.push(obj);
          }
          console.log(coursePlan);
          console.log(this.haveTime)
          this.coursePlan = coursePlan;
        })

      });
    },
    getCourseList(){
      listCourse().then(response=>{
        let courseList = response.rows;
        this.courseList = response.rows;
        let courseMap = {};
        for (let i=0; i<courseList.length; i++){
          courseMap[courseList[i].courseno] = courseList[i].coursename;
        }
        this.courseMap = courseMap;
      })
    },
    getTeacherList(){
      listTeacher().then(response=>{
        let teacherList = response.rows;
        this.teacherList = response.rows;
        let teacherMap = {};
        for (let i=0; i<teacherList.length; i++){
          teacherMap[teacherList[i].teacherno] = teacherList[i].teachername;
        }
        this.teacherMap = teacherMap;
      })
    },
    getElCourse(){
      this.courseLoading = true;
      listElCourse(this.queryParamsSelect).then(res=>{
        this.elCourseList = res.rows
        this.total = res.total;
        this.courseLoading = false;
      })
    },
    getCollege(){
      listCollege(this.queryCollege).then(res=>{
        this.collegeList = res.rows;
      })
    },
    getCourseName(row){
      let courseNo = row.courseno || row.courseNo
      return this.courseMap[courseNo]
    },
    getTeacher(row){
      let teacherNo = row.teacherno || row.teacherNo
      return this.teacherMap[teacherNo]
    },
    getLength(row){
      let courseNo = row.courseno || row.courseNo
      let obj = this.courseList.find(item=>item.courseno === courseNo)
      return obj.totalhour
    },
    getScore(row){
      let courseNo = row.courseno || row.courseNo
      let obj = this.courseList.find(item=>item.courseno === courseNo)
      return obj.credit
    },
    getType(row){
      let courseNo = row.courseno || row.courseNo
      let obj = this.courseList.find(item=>item.courseno === courseNo)
      if(obj.courseattr === '01'){
        return '必修课'
      }else {
        return '选修课'
      }
    },
    getCollegeName(collegeNo){
      let obj = this.collegeList.find(item=>item.collegeno === collegeNo)
      return obj.collegename
    },
    getTime(time){
      function checkAdult(num) {
        return num === time;
      }
      let timess = [['01','06','11','16','21'], ['02','07','12','17','22'], ['03','08','13','18','23'],
        ['04','09','14','19','24'], ['05','10','15','20','25']]
      let i = 0;
      let j = 0;
      for(;i<5;i++){
        let times = timess[i]
        j = times.findIndex(checkAdult)
        if(j!== -1) break
      }
      let zhou = null;
      let day  = null
      switch (j) {
        case 0:
          zhou = '星期一'
          break;
        case 1:
          zhou = '星期二'
          break;
        case 2:
          zhou = '星期三'
          break;
        case 3:
          zhou = '星期四'
          break;
        case 4:
          zhou = '星期五'
          break;
      }
      switch (i) {
        case 0:
          day = "第一节课"
          break;
        case 1:
          day = "第二节课";
          break;
        case 2:
          day = "第三节课";
          break;
        case 3:
          day = "第四节课";
          break;
        case 4:
          day = "第五节课";
          break;
      }
      return zhou + '   ' + day
    },
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
    // 表单重置
    resetQueryParams() {
      this.queryParamsSelect = {
        pageNum: 1,
        pageSize: 10,
        collegeNo: null,
        courseNo: null,
        teacherNo: null
      };
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetQueryParams();
      this.getElCourse();
    },
    handleSelect(row){
      if(this.haveTime.includes(row.courseTime)){
        this.msgError("所选课程与已选课程冲突！")
      }else {
        let data = {
          studentNo: this.$store.getters.studentInfo.studentNo,
          elCourse: row.id
        }
        addStudentElCourse(data).then(res=>{
          this.msgSuccess("选课成功！")
          this.getCoursePlanList();
          this.getElCourse();
        })
      }
    },
    handleBack(row){
      let data = {
        studentNo: this.$store.getters.studentInfo.studentNo,
        elCourse: row.id
      }
      this.loading = true;
      delStudentElCourse(data).then(res=>{
        this.msgSuccess("退课成功！")
        this.getCoursePlanList();
        this.getElCourse();
        this.loading = false;
      })
    }
  }
}
</script>
<style scoped>
.courseTab {
  margin: 20px 20px;
  height: 100%;
}
</style>
