<template>
  <el-card>
    <!-- 标题 -->
    <div slot="header">
      <span class="el-card-title">课程表</span>
      <i
        v-show="!isPanelSetIcon"
        class="el-icon-close"
        style="float: right; padding: 3px 0"
        @click="deletePanelItem"
      ></i>
      <i
        v-show="isPanelSetIcon"
        class="iconfont icon-setting"
        style="float: right; padding: 3px 0"
      ></i>
    </div>
    <!-- 主体区域 -->
    <el-table :data="coursePlan" border :header-cell-style="{background:'#e4fcfc',color:'#2ca29e', 'line-height':'10px'}" class="classTable" size="small" :row-style="{height:'60px'}">
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
<!--          {{scope.row['length0']}}<br/>-->
        </template>
      </el-table-column>
      <el-table-column label="周二" align="center" prop="represent1">
        <template slot-scope="scope">
          {{scope.row['courseName1']}}<br/>
          {{scope.row['teacher1']}}<br/>
          {{scope.row['location1']}}<br/>
<!--          {{scope.row['length1']}}<br/>-->
        </template>
      </el-table-column>
      <el-table-column label="周三" align="center" prop="represent2">
        <template slot-scope="scope">
          {{scope.row['courseName2']}}<br/>
          {{scope.row['teacher2']}}<br/>
          {{scope.row['location2']}}<br/>
<!--          {{scope.row['length2']}}<br/>-->
        </template>
      </el-table-column>
      <el-table-column label="周四" align="center" prop="represent3">
        <template slot-scope="scope">
          {{scope.row['courseName3']}}<br/>
          {{scope.row['teacher3']}}<br/>
          {{scope.row['location3']}}<br/>
<!--          {{scope.row['length3']}}<br/>-->
        </template>
      </el-table-column>
      <el-table-column label="周五" align="center" prop="represent4">
        <template slot-scope="scope">
          {{scope.row['courseName4']}}<br/>
          {{scope.row['teacher4']}}<br/>
          {{scope.row['location4']}}<br/>
<!--          {{scope.row['length4']}}<br/>-->
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import { getCoursePlan, listCollege, listTeacher } from '@/api/admin/course/schedule'
import { addStudentElCourse, delStudentElCourse, getStudentElCourse } from '@/api/student/studentElCourse'
import { listCourse } from '@/api/admin/course/course'
import { listElCourse } from '@/api/admin/course/elCourse'

export default {
  props: ['id', 'panelSetIcon'],
  data() {
    return {
      panelId: this.id,
      isPanelSetIcon: this.panelSetIcon,
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
        classno: this.$store.getters.studentInfo.classNo === undefined?'2015010101':this.$store.getters.studentInfo.classNo,
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
    // 删除面板项发送事件
    deletePanelItem () {
      this.$emit('deletePanelItemEvent', this.panelId)
    },
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
                  obj["teacher"+j] = teacherName+'[1-'+courseRoom+']';
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

<style>
.el-card {
  height: 100%;
}
.el-icon-close {
  font-size: 1.2em;
  cursor: pointer;
}
.el-card-title {
  font-weight: bold;
  font-size: 20px;
}
.el-card-subtitle{
  font-weight: bold;
  font-size: 15px;

}
.often-app-box {
  display: grid;
  grid-template-columns: repeat(8, 12.5%);
  cursor: pointer;
  justify-items: center;
  margin-top: 20px;
}
.often-app-box .often-app {
  display: flex;
  flex-direction: column;
  width: 100px;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}
.often-app i {
  color: #fff;
  padding: 10px;
  font-size: 2em;
  border-radius: 4px;
}
.app-1 i {
  background: #29c814;
}
.app-2 i {
  background: #ffb339;
}
.app-3 i {
  background: #ff6b79;
}
.app-4 i {
  background: #00cde9;
}
.app-5 i {
  background: #39a0ff;
}
.app-title {
  margin-top: 10px;
}

.el-table__header tr, .el-table__header th {
  padding: 0;
  height: 60px;
  line-height: 60px;
}
.el-table__body tr, .el-table__body td {
  padding: 0;
  height: 75px;
  line-height: 60px;
}
</style>
