<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" class="queryClassTable">
      <el-form-item label="学期" prop="semester">
        <el-select v-model="queryParams.semester" placeholder="请选择学期">
          <el-option value="2015-2016-1" label="2015-2016-1"/>
          <el-option value="2015-2016-2" label="2015-2016-2"/>
          <el-option value="2016-2017-1" label="2016-2017-1"/>
          <el-option value="2016-2017-2" label="2016-2017-2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="学院" prop="collegeNo">
        <el-select v-model="queryParams.collegeno" placeholder="请选择">
          <el-option
            v-for="item in collegeList"
            :key="item.collegeno"
            :label="item.collegename"
            :value="item.collegeno">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="班级" prop="classNo">
        <el-select v-model="queryParams.classno" placeholder="请选择" filterable>
          <el-option
            v-for="item in classList"
            :key="item.classno"
            :label="item.classno"
            :value="item.classno">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form >

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
          {{scope.row['info0']}}
        </template>
      </el-table-column>
      <el-table-column label="周二" align="center" prop="represent1">
        <template slot-scope="scope">
          {{scope.row['courseName1']}}<br/>
          {{scope.row['info1']}}
        </template>
      </el-table-column>
      <el-table-column label="周三" align="center" prop="represent2">
        <template slot-scope="scope">
          {{scope.row['courseName2']}}<br/>
          {{scope.row['info2']}}
        </template>
      </el-table-column>
      <el-table-column label="周四" align="center" prop="represent3">
        <template slot-scope="scope">
          {{scope.row['courseName3']}}<br/>
          {{scope.row['info3']}}
        </template>
      </el-table-column>
      <el-table-column label="周五" align="center" prop="represent4">
        <template slot-scope="scope">
          {{scope.row['courseName4']}}
          {{scope.row['info4']}}
        </template>
      </el-table-column>

    </el-table>
  </div>
</template>

<script>
import { listCourse } from '@/api/admin/course/course'
import { getCoursePlan, listClass, listCollege, listTeacher } from '@/api/admin/course/schedule'


export default {
  name: "SubSystem",
  data(){
    return {
      coursePlan:[],
      courseMap:{},
      teacherMap:{},
      coursePlanList:[],
      classTaskList:[],
      classList:[],
      collegeList:[],
      queryParams: {
        pageNum: 1,
        pageSize: 30,
        semester:"2015-2016-1",
        classno:'2015010101',
      },
      queryCollege:{
        pageNum: 1,
        pageSize: 30,
      },
      queryClass:{
        pageNum:1,
        pageSize:30,
      },
      queryTeacher:{
        pageNum:1,
        pageSize:500,
      },
      queryCourse:{
        pageNum:1,
        pageSize:500,
      },
    }
  },
  created(){
    this.getCollegeList();
    this.getClassList();
    this.getCourseList();
    this.getTeacherList();
    this.getCoursePlanList();
  },
  watch:{
    //这两个监视是对一个对象进行监视，但是先执行的是queryParams后执行'queryParams.collegeno'
    queryParams:{
      deep:true,
      handler(){
        if (this.queryParams.classno!=null&&this.queryParams.classno!==""){
          console.log(this.queryParams.classno)
          this.getCoursePlanList();
        }
      }
    },
    'queryParams.collegeno':{
      handler(newCollegeno,oldCollegeno){
        this.queryClass.collegeno = newCollegeno;
        this.queryParams.classno = null;
        this.getClassList(this.queryClass)
      }
    }
  },
  methods:{
    header({row,rowIndex}){
      if (rowIndex===0){
        return "warning-row";
      }
      return 'success-row';
    },

    getCoursePlanList(){
      getCoursePlan(this.queryParams).then(response=>{
        let coursePlan = [];
        let coursePlanList = response.rows;
        console.log(coursePlanList)
         let timess = [['01','06','11','16','21'], ['02','07','12','17','22'], ['03','08','13','18','23'],
           ['04','09','14','19','24'], ['05','10','15','20','25']]

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
              if (times[j]===course.classtime){
                const courseName = this.courseMap[course['courseno']]
                const teacherName = this.teacherMap[course['teacherno']]
                const classroomNo = course['classroomno'];
                obj["courseName"+j] = courseName;
                obj["info"+j] = "[" + classroomNo +"教室"+ "--" + teacherName + "]";
              }
            }
          }
          coursePlan.push(obj);
        }
        console.log(coursePlan);
        this.coursePlan = coursePlan;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.queryParams.collegeno = null;
      this.handleQuery();
    },
    handleQuery(){
      this.queryParams.pageNum = 1;
    },
    getCollegeList(){
      listCollege(this.queryCollege).then(response=>{
        this.collegeList = response.rows;
      });
    },
    getClassList(){
      listClass(this.queryClass).then(response=>{
        this.classList = response.rows;
      })
    },
    getCourseList(){
      listCourse().then(response=>{
        let courseList = response.rows;
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
        let teacherMap = {};
        for (let i=0; i<teacherList.length; i++){
          teacherMap[teacherList[i].teacherno] = teacherList[i].teachername;
        }
        this.teacherMap = teacherMap;
      })
    },
  },
};
</script>

<style>
.column1{
background:#7af8f8;
color:#2ca29e
}
.classTable, .queryClassTable{
  margin-top: 15px;
}
</style>
