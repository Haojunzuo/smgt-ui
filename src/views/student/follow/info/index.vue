<template>
  <div class="container">
    <el-tabs type="border-card" class="courseTab">
      <el-tab-pane label="学籍信息">
        <el-descriptions class="margin-top" title="学生基本信息" :column="3"  border>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              学号
            </template>
            {{studentInfo.studentNo}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              姓名
            </template>
            {{studentInfo.user.nickName}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              照片
            </template>
            <img v-bind:src="studentInfo.user.avatar" title="点击上传头像" class="img-circle img-lg" />
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              性别
            </template>
            <el-radio-group disabled v-model="studentInfo.user.sex">
              <el-radio label="0">男</el-radio>
              <el-radio label="1">女</el-radio>
            </el-radio-group>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              身份证号
            </template>
            {{studentInfo.identity}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              国籍
            </template>
            {{studentInfo.country}}
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              出生日期
            </template>
            <el-date-picker
              v-model="studentInfo.birth"
              disabled
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              民族
            </template>
              <el-select v-model="studentInfo.nation" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in nationList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              政治面貌
            </template>
              <el-select v-model="studentInfo.politicalStatus" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in politicalList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              入学时间
            </template>
              <el-date-picker
                v-model="studentInfo.inTime"
                disabled
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              预计毕业时间
            </template>
              <el-date-picker
                v-model="studentInfo.expectedGradu"
                disabled
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"/>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              血型
            </template>
              <el-select v-model="studentInfo.bloodType" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in bloodList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              健康状况
            </template>
              <el-select v-model="studentInfo.healthStatus" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in healthList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              婚姻状态
            </template>
              <el-select v-model="studentInfo.maritalStatus" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in maritalList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              宗教信仰
            </template>
              <el-select v-model="studentInfo.religious" filterable  class="add-nation-input" disabled>
                <el-option v-for="item in religiousList" :key="item.value" :label="item.info" :value="item.value"></el-option>
              </el-select>
          </el-descriptions-item>

          <el-descriptions-item span="3">
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              家庭地址
            </template>
              <el-cascader
                size="large"
                :options="options"
                disabled
                v-model="selectedAddressOptions"
                clearable
              />
          </el-descriptions-item>

          <el-descriptions-item span="3">
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              户口所在地
            </template>
              <el-cascader
                size="large"
                :options="options"
                disabled
                v-model="selectedResidenceOptions"
                clearable
              />
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" title="个人联系方式" :column="2"  border style="margin-top: 20px">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              本人移动电话
            </template>
              <el-input v-model="studentInfo.phoneNumber" placeholder="请输入联系电话" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              电子邮件
            </template>
              <el-input  placeholder="请输入邮箱" v-model="studentInfo.email" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-location-outline"></i>
              QQ号码
            </template>
              <el-input  placeholder="请输入QQ号码" v-model="studentInfo.qq" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-tickets"></i>
              微信号
            </template>
              <el-input  placeholder="请输入微信号" v-model="studentInfo.wechat" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              紧急联系人
            </template>
              <el-input  placeholder="请输入紧急联系人" v-model="studentInfo.contact" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-office-building"></i>
              紧急联系人电话
            </template>
              <el-input  placeholder="请输入紧急联系人电话" v-model="studentInfo.contactPhone" disabled/>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions class="margin-top" title="在校信息" :column="3"  border style="margin-top: 20px">
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              院系
            </template>
            <el-select v-model="studentInfo.collegeNo" disabled  class="add-nation-input" >
              <el-option v-for="item in collegeList" :key="item.collegeno" :label="item.collegename" :value="item.collegeno"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              班级
            </template>
            <el-select v-model="studentInfo.classNo" disabled  class="add-nation-input" >
              <el-option v-for="item in classList" :key="item.classno" :label="item.classname" :value="item.classno"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              专业
            </template>
            <el-select v-model="studentInfo.major" disabled  class="add-nation-input" >
              <el-option v-for="item in majorList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              计划类别
            </template>
            <el-select v-model="studentInfo.planType" disabled  class="add-nation-input" >
              <el-option v-for="item in planList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              学生类别
            </template>
            <el-select v-model="studentInfo.stuType" disabled  class="add-nation-input" >
              <el-option v-for="item in studentTypeList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              学制
            </template>
            <el-select v-model="studentInfo.length" disabled  class="add-nation-input" >
              <el-option v-for="item in lengthList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-mobile-phone"></i>
              原院校
            </template>
              <el-input  placeholder="请输入原院校" v-model="studentInfo.orgSchool" disabled/>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              学籍状态
            </template>
            <el-select v-model="studentInfo.status" disabled  class="add-nation-input" >
              <el-option v-for="item in statusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              <i class="el-icon-user"></i>
              在校状态
            </template>
            <el-select v-model="studentInfo.schoolStatus" disabled  class="add-nation-input" >
              <el-option v-for="item in schoolStatusList" :key="item.value" :label="item.name" :value="item.value"></el-option>
            </el-select>
          </el-descriptions-item>
        </el-descriptions>
      </el-tab-pane>
      <el-tab-pane label="成绩情况">
        <el-form :model="querySelectParams" ref="queryForm" :inline="true" label-width="68px" class="queryClassTable" @submit.native.prevent>
          <el-form-item label="学期" prop="semester">
            <el-select v-model="querySelectParams.semester" placeholder="请选择学期">
              <el-option value="2015-2016-1" label="2015-2016-1"/>
              <el-option value="2015-2016-2" label="2015-2016-2"/>
              <el-option value="2016-2017-1" label="2016-2017-1"/>
              <el-option value="2016-2017-2" label="2016-2017-2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="课程" prop="courseNo">
            <el-select v-model="querySelectParams.courseNo" placeholder="请选择">
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
          :page.sync="querySelectParams.pageNum"
          :limit.sync="querySelectParams.pageSize"
          @pagination="getScoreList"
        />
      </el-tab-pane>
      <el-tab-pane label="获奖情况">
        <el-form :model="queryShipParams" ref="queryShipForm" :inline="true" label-width="68px">
          <el-form-item label="学期" prop="semester">
            <el-select v-model="queryShipParams.semester" placeholder="请选择学期" style="width: 180px" clearable filterable>
              <el-option value="2015-2016-1" label="2015-2016-1"/>
              <el-option value="2015-2016-2" label="2015-2016-2"/>
              <el-option value="2016-2017-1" label="2016-2017-1"/>
              <el-option value="2016-2017-2" label="2016-2017-2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="scholarshipNo">
            <el-select v-model="queryShipParams.scholarshipNo" placeholder="请选择" style="width: 180px" clearable filterable>
              <el-option
                v-for="item in scholarshipList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

<!--          <el-form-item>-->
<!--            <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>-->
<!--          </el-form-item>-->
        </el-form>

        <el-table v-loading="loading" :data="scholarShipList">

          <el-table-column label="学期" align="center" prop="semester"/>
          <el-table-column label="奖学金名称" align="center" prop="scholarshipName"/>
          <el-table-column label="金额" align="center" prop="money"/>
          <el-table-column label="学号" align="center" prop="studentNo"/>
          <el-table-column label="姓名" align="center" prop="studentName"/>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryShipParams.pageNum"
          :limit.sync="queryShipParams.pageSize"
          @pagination="getShipList"
        />
      </el-tab-pane>
      <el-tab-pane label="荣誉情况">
        <el-form :model="queryHonorParams" ref="queryHonorForm" :inline="true" label-width="68px">
          <el-form-item label="学期" prop="semester">
            <el-select v-model="queryHonorParams.semester" placeholder="请选择学期" style="width: 180px">
              <el-option value="2015-2016-1" label="2015-2016-1"/>
              <el-option value="2015-2016-2" label="2015-2016-2"/>
              <el-option value="2016-2017-1" label="2016-2017-1"/>
              <el-option value="2016-2017-2" label="2016-2017-2"/>
            </el-select>
          </el-form-item>
          <el-form-item label="类型" prop="scholarshipNo">
            <el-select v-model="queryHonorParams.scholarshipNo" placeholder="请选择" style="width: 180px">
              <el-option
                v-for="item in honorList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

<!--          <el-form-item>-->
<!--            <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>-->
<!--          </el-form-item>-->
        </el-form>

        <el-table v-loading="loading" :data="honorDataList">

          <el-table-column label="学期" align="center" prop="semester"/>
          <el-table-column label="荣誉称号" align="center" prop="scholarshipName"/>
          <el-table-column label="学号" align="center" prop="studentNo"/>
          <el-table-column label="姓名" align="center" prop="studentName"/>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryHonorParams.pageNum"
          :limit.sync="queryHonorParams.pageSize"
          @pagination="getHonorList"
        />
      </el-tab-pane>
      <el-tab-pane label="违纪情况">
        <el-form :model="queryPunishParams" ref="queryPunishForm" :inline="true" label-width="68px">
          <el-form-item label="违纪类型" prop="staffCatCode">
            <el-select v-model="queryPunishParams.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in punishOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="违纪状态" prop="staffCatCode">
            <el-select v-model="queryPunishParams.status" placeholder="请选择" clearable>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="违纪结果" prop="staffCatCode">
            <el-select v-model="queryPunishParams.result" placeholder="请选择" clearable>
              <el-option
                v-for="item in resultOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="violationList">
          <el-table-column label="违纪事项" align="center" prop="type">
            <template slot-scope="scope">
              <span>{{punishString(scope.row.type)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="违纪时间" align="center" prop="time">
            <template slot-scope="scope">
              <span>{{scope.row.time}}</span>
            </template>
          </el-table-column>
          <el-table-column label="违纪结果" align="center" prop="result">
            <template slot-scope="scope">
              <span>{{resultString(scope.row.result)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status === 1"
                active-color="#ff4949">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="撤销时间" align="center" prop="dealTime">
            <template slot-scope="scope">
              <span>{{(scope.row.dealTime === null || scope.row.dealTime === '') ? '尚未撤销' : scope.row.dealTime}}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryPunishParams.pageNum"
          :limit.sync="queryPunishParams.pageSize"
          @pagination="getList"
        />

      </el-tab-pane>
      <el-tab-pane label="请假情况">
        <el-form :model="queryLeaveParams" ref="queryLeaveForm" :inline="true" label-width="68px">
          <el-form-item label="报备事由" prop="staffCatCode">
            <el-select v-model="queryLeaveParams.type" placeholder="请选择" clearable>
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="leaveList" >
          <el-table-column label="报备事由" align="center" prop="type" width="100">
            <template slot-scope="scope">
              <span>{{typeString(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="报备时间" align="center" prop="startTime">
            <template slot-scope="scope">
              <span>{{scope.row.startTime+' 至 '+scope.row.endTime}}</span>
            </template>
          </el-table-column>
          <el-table-column label="目的地点" align="center" prop="location">
            <template slot-scope="scope">
              <span>{{getCodeToText(scope.row.location)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="理由" align="center" prop="reason">
            <template slot-scope="scope">
              <span>{{scope.row.reason}}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryLeaveParams.pageNum"
          :limit.sync="queryLeaveParams.pageSize"
          @pagination="getLeaveList"
        />
      </el-tab-pane>
      <el-tab-pane label="助学情况">
        <el-form :model="queryPartParams" ref="queryPartForm" :inline="true" label-width="68px">
          <el-form-item label="勤工助学" prop="noticeId">
            <el-select v-model="queryPartParams.noticeId" placeholder="请选择" clearable>
              <el-option
                v-for="item in noticeList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-table v-loading="loading" :data="partTimeList">
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
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryPartParams.pageNum"
          :limit.sync="queryPartParams.pageSize"
          @pagination="getPartList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { isEntryStart, listScore, updateScore, updateEntryStart, insertScoreTable } from '@/api/admin/exam/score'
import { delCourse, listCourse } from '@/api/admin/course/course'
import { listScholarship, addScholarship, delScholarship, getScholarship, updateScholarship, checkScholarshipExit } from '@/api/instructor/scholarship'
import {CodeToText, regionData} from "element-china-area-data";
import { listLeave, getLeave, delLeave, addLeave, updateLeave } from "@/api/student/leave";
import { listPartTime, getPartTime, delPartTime, addPartTime, updatePartTime, updatePartTimeStatus } from "@/api/student/partTime";
import {listNotice} from "../../../../api/admin/notice/notice";
import {listClass, listCollege} from "../../../../api/admin/course/schedule";
import { listViolation, getViolation, delViolation, addViolation, updateViolation } from "@/api/instructor/violation";

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
  name: "takeCourse",
  data() {
    return {
      scoreList:[],
      courseList: [],
      scholarShipList: [],
      honorDataList: [],
      leaveList: [],
      partTimeList: [],
      violationList: [],
      total:0,
      student: {},
      studentInfo: {},
      scholarship:{},
      loading: false,
      querySelectParams: {
        pageNum: 1,
        pageSize: 10,
        semester:'2015-2016-1',
        courseNo:null,
        studentNo:null
      },
      queryShipParams: {
        pageNum: 1,
        pageSize: 10,
        semester:'2015-2016-1',
        scholarshipNo: null,
        studentNo:null,
        status:'1',
      },
      queryCourse: {
        pageNum: 1,
        pageSize: 500
      },
      queryHonorParams: {
        pageNum: 1,
        pageSize: 10,
        semester: '2015-2016-1',
        scholarshipNo: null,
        studentNo: null,
        status: '1'
      },
      queryLeaveParams: {
        pageNum: 1,
        pageSize: 10,
        status: 3,
        type: null,
        studentId: this.$store.getters.studentInfo.id
      },
      queryPartParams: {
        pageNum: 1,
        pageSize: 10,
        status: '2',
        studentId: this.$store.getters.studentInfo.id,
        noticeId: null
      },
      queryPunishParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        type: null,
        studentId: this.$store.getters.studentInfo.id
      },
      scholarshipList:[
        { id:'1',name:'国家奖学金', },
        { id:'2',name:'国家励志奖学金', },
        { id:'3',name:'校一等奖学金', },
        { id:'4',name:'校二等奖学金', },
        { id:'5',name:'校三等奖学金', },
      ],
      honorList: [
        { id: '6', name: '优秀共青团员荣誉称号' },
        { id: '7', name: '优秀共青团干部荣誉称号' },
        { id: '8', name: '三好学生荣誉称号' },
        { id: '9', name: '优秀共产党员荣誉称号' },
        { id: '10', name: '优秀共青团员标兵荣誉称号' },
        { id: '11', name: '优秀共青团干部标兵荣誉称号' }
      ],
      typeOptions: [
        {label:'公假',value:1},
        {label:'病假',value:2},
        {label:'求职',value:3},
        {label:'实习',value:4},
        {label:'返家',value:5},
        {label:'其他',value:6}
      ],
      noticeList: [],
      params: {
        pageNum: 1,
        endTime: new Date(),
        noticetype: '3'
      },
      majorList: [
        {
          value: '1',
          name: '计算机科学与技术'
        },
        {
          value: '2',
          name: '人工智能'
        },
        {
          value: '3',
          name: '数据科学和大数据技术'
        },
        {
          value: '4',
          name: '网络空间安全'
        },
        {
          value: '5',
          name: '软件工程'
        },
        {
          value: '6',
          name: '物联网工程'
        },
      ],
      planList: [
        {
          value: '1',
          name: '推荐免试'
        },
        {
          value: '2',
          name: '统招生'
        }
      ],
      studentTypeList: [
        {
          value: '1',
          name: '本科生'
        },
        {
          value: '2',
          name: '研究生'
        },
        {
          value: '3',
          name: '博士'
        }
      ],
      lengthList: [
        {
          value: 3.0,
          name: '3年'
        },
        {
          value: 4.0,
          name: '4年'
        },
        {
          value: 5.0,
          name: '5年'
        }
      ],
      statusList:[
        {
          value: '1',
          name: '在籍'
        },
        {
          value: '2',
          name: '已离校'
        },
        {
          value: '3',
          name: '保留学籍'
        },
        {
          value: '4',
          name: '休学'
        },
        {
          value: '5',
          name: '退学'
        }
      ],
      schoolStatusList:[
        {
          value: '1',
          name: '培养中'
        },
        {
          value: '2',
          name: '离校'
        }
      ],
      nationList: [
        {
          id: 1,
          info: "汉族",
          value: 1,
        },
        {
          id: 2,
          info: "壮族",
          value: 2,
        },
        {
          id: 3,
          info: "满族",
          value: 3,
        },
        {
          id: 4,
          info: "回族",
          value: 4,
        },
        {
          id: 5,
          info: "苗族",
          value: 5,
        },
        {
          id: 6,
          info: "维吾尔族",
          value: 6,
        },
        {
          id: 7,
          info: "土家族",
          value: 7,
        },
        {
          id: 8,
          info: "彝族",
          value: 8,
        },
        {
          id: 9,
          info: "蒙古族",
          value: 9,
        },
        {
          id: 10,
          info: "藏族",
          value: 10,
        },
        {
          id: 11,
          info: "布依族",
          value: 11,
        },
        {
          id: 12,
          info: "侗族",
          value: 12,
        },
        {
          id: 13,
          info: "瑶族",
          value: 13,
        },
        {
          id: 14,
          info: "朝鲜族",
          value: 14,
        },
        {
          id: 15,
          info: "白族",
          value: 15,
        },
        {
          id: 16,
          info: "哈尼族",
          value: 16,
        },
        {
          id: 17,
          info: "哈萨克族",
          value: 17,
        },
        {
          id: 18,
          info: "黎族",
          value: 18,
        },
        {
          id: 19,
          info: "傣族",
          value: 19,
        },
        {
          id: 20,
          info: "畲族",
          value: 20,
        },
        {
          id: 21,
          info: "傈僳族",
          value: 21,
        },
        {
          id: 22,
          info: "仡佬族",
          value: 22,
        },
        {
          id: 23,
          info: "东乡族",
          value: 23,
        },
        {
          id: 24,
          info: "高山族",
          value: 24,
        },
        {
          id: 25,
          info: "拉祜族",
          value: 25,
        },
        {
          id: 26,
          info: "水族",
          value: 26,
        },
        {
          id: 27,
          info: "佤族",
          value: 27,
        },
        {
          id: 28,
          info: "纳西族",
          value: 28,
        },
        {
          id: 29,
          info: "羌族",
          value: 29,
        },
        {
          id: 30,
          info: "土族",
          value: 30,
        },
        {
          id: 31,
          info: "仫佬族",
          value: 31,
        },
        {
          id: 32,
          info: "锡伯族",
          value: 32,
        },
        {
          id: 33,
          info: "柯尔克孜族",
          value: 33,
        },
        {
          id: 34,
          info: "达斡尔族",
          value: 34,
        },
        {
          id: 35,
          info: "景颇族",
          value: 35,
        },
        {
          id: 36,
          info: "毛南族",
          value: 36,
        },
        {
          id: 37,
          info: "撒拉族",
          value: 37,
        },
        {
          id: 38,
          info: "布朗族",
          value: 38,
        },
        {
          id: 39,
          info: "塔吉克族",
          value: 39,
        },
        {
          id: 40,
          info: "阿昌族",
          value: 40,
        },
        {
          id: 41,
          info: "普米族",
          value: 41,
        },
        {
          id: 42,
          info: "鄂温克族",
          value: 42,
        },
        {
          id: 43,
          info: "怒族",
          value: 43,
        },
        {
          id: 44,
          info: "京族",
          value: 44,
        },
        {
          id: 45,
          info: "基诺族",
          value: 45,
        },
        {
          id: 46,
          info: "德昂族",
          value: 46,
        },
        {
          id: 47,
          info: "保安族",
          value: 47,
        },
        {
          id: 48,
          info: "俄罗斯族",
          value: 48,
        },
        {
          id: 49,
          info: "裕固族",
          value: 49,
        },
        {
          id: 50,
          info: "乌孜别克族",
          value: 50,
        },
        {
          id: 51,
          info: "门巴族",
          value: 51,
        },
        {
          id: 52,
          info: "鄂伦春族",
          value: 52,
        },
        {
          id: 53,
          info: "独龙族",
          value: 53,
        },
        {
          id: 54,
          info: "塔塔尔族",
          value: 54,
        },
        {
          id: 55,
          info: "赫哲族",
          value: 55,
        },
        {
          id: 56,
          info: "珞巴族",
          value: 56,
        },
      ],
      politicalList: [
        {
          value: 1,
          info: '中共党员'
        },
        {
          value: 2,
          info: '中共预备党员'
        },
        {
          value: 3,
          info: '共青团员'
        },
        {
          value: 4,
          info: '群众'
        },
        {
          value: 5,
          info: '民革会员'
        },
        {
          value: 6,
          info: '民盟盟员'
        },
        {
          value: 7,
          info: '民建会员'
        },
        {
          value: 8,
          info: '民进会员'
        },
        {
          value: 9,
          info: '农工党党员'
        },
        {
          value: 10,
          info: '致公党党员'
        },
        {
          value: 11,
          info: '九三学社社员'
        },
        {
          value: 12,
          info: '台盟盟员'
        },
        {
          value: 13,
          info: '无党派民主人士'
        },
        {
          value: 14,
          info: '其他'
        }
      ],
      bloodList: [
        {
          value: 1,
          info: 'A型'
        },
        {
          value: 2,
          info: 'B型'
        },
        {
          value: 3,
          info: 'AB型'
        },
        {
          value: 4,
          info: 'O型'
        },
        {
          value: 5,
          info: '其他'
        },
      ],
      healthList: [
        {
          value: 1,
          info: '健康或良好'
        },
        {
          value: 2,
          info: '一般或较弱'
        },
        {
          value: 3,
          info: '有慢性病'
        },
        {
          value: 4,
          info: '残疾'
        }
      ],
      maritalList: [
        {
          value: 1,
          info: '已婚'
        },
        {
          value: 2,
          info: '未婚'
        },
        {
          value: 3,
          info: '其他'
        }
      ],
      religiousList: [
        {
          info: "无宗教信仰",
          value: 1,
        },
        {
          info: "佛教",
          value: 2,
        },
        {
          info: "喇嘛教",
          value: 3,
        },
        {
          info: "道教",
          value: 4,
        },
        {
          info: "天主教",
          value: 5,
        },
        {
          info: "基督教",
          value: 6,
        },
        {
          info: "正东教",
          value: 7,
        },
        {
          info: "伊斯兰教",
          value: 8,
        },
        {
          info: "其他",
          value: 9,
        },
      ],
      options: regionData,
      collegeList: [],
      classList: [],
      statusOptions: [
        {label:'未撤销',value:1},
        {label:'已撤销',value:2},
      ],
      punishOptions: [
        {label:'旷课',value:1},
        {label:'作弊',value:2},
        {label:'斗殴',value:3},
        {label:'偷窃',value:4},
        {label:'赌博',value:5},
        {label:'犯法',value:6}
      ],
      resultOptions: [
        {label:'警告',value:1},
        {label:'严重警告',value:2},
        {label:'记过',value:3},
        {label:'留校察看',value:4},
        {label:'开除学籍',value:5}
      ],
    }
  },
  created() {
    this.student = this.$store.getters.studentInfo
    this.studentInfo = this.$store.getters.studentInfo
    this.querySelectParams.studentNo = this.$store.getters.studentInfo.studentNo;
    this.queryShipParams.studentNo = this.$store.getters.studentInfo.studentNo;
    this.queryHonorParams.studentNo = this.$store.getters.studentInfo.studentNo;
    listNotice(this.params).then(res=>{
      this.noticeList = res.rows
    })
    listCollege().then(res=>{
      console.log(res)
      this.collegeList = res.rows
    })
    listClass().then(res=>{
      this.classList = res.rows
      console.log(res)
    })
    this.getScoreList();
    this.getCourseList();
    this.getShipList();
    this.getHonorList();
    this.getLeaveList();
    this.getPartList();
    this.getPunishList();
  },
  computed: {
    selectedAddressOptions: {
      get(){
        if(this.studentInfo.address === undefined || this.studentInfo.address === null || this.studentInfo.address === ''){
          return []
        }
        return this.studentInfo.address.split(',')
      },
      set(data){
        this.studentInfo.address = data.join(',')
      }
    },
    selectedResidenceOptions: {
      get(){
        if(this.studentInfo.residence === undefined || this.studentInfo.residence === null || this.studentInfo.residence === ''){
          return []
        }
        return this.studentInfo.residence.split(',')
      },
      set(data){
        this.studentInfo.residence = data.join(',')
      }
    }
  },
  watch:{
    querySelectParams:{
      deep:true,
      handler:"getScoreList"
    },
    queryShipParams:{
      deep:true,
      handler:"getShipList"
    },
    queryHonorParams:{
      deep:true,
      handler:"getHonorList"
    },
    queryLeaveParams:{
      deep:true,
      handler:"getLeaveList"
    },
    queryPunishParams:{
      deep:true,
      handler:"getPunishList"
    },
    queryPartParams:{
      deep:true,
      handler:"getPartList"
    },
  },
  methods: {
    getScoreList() {
      this.loading = true;
      listScore(this.querySelectParams).then(response => {
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
    getShipList() {
      this.loading = true
      this.queryShipParams.type = '1';
      listScholarship(this.queryShipParams).then(response => {
        this.scholarShipList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    getHonorList() {
      this.loading = true
      this.queryHonorParams.type = '2'
      listScholarship(this.queryHonorParams).then(response => {
        this.honorDataList = response.rows
        console.log(response)
        this.total = response.total
        this.loading = false
      })
    },
    getLeaveList() {
      this.loading = true;
      listLeave(this.queryLeaveParams).then(response => {
        this.leaveList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getPartList() {
      this.loading = true;
      listPartTime(this.queryPartParams).then(response => {
        this.partTimeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    getPunishList() {
      this.loading = true;
      listViolation(this.queryPunishParams).then(response => {
        this.violationList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.querySelectParams.semester = null;
      this.querySelectParams.courseno = null;
      this.handleQuery();
    },
    handleQuery(){
      this.querySelectParams.pageNum = 1;
      this.getScoreList();
    },
    typeString (value) {
      return typeList[value.type]
    },
    showModel(row, str) {
      const courseAttrMap = {'01':'必修','02':'选修','03':'实验','04':'体育',}
      if (str==='courseAttr'){
        return courseAttrMap[row.courseAttr];
      }
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
    getNoticeName(id){
      let obj = this.noticeList.find(item=> item.id === id)
      return obj.title
    },
    punishString (value) {
      let obj = this.punishOptions.find(item=>item.value === value)
      return obj.label
    },
    resultString(value){
      let obj = this.resultOptions.find(item=>item.value === value)
      return obj.label
    },
  }
}
</script>
<style scoped>
.courseTab {
  margin: 20px 20px;
  height: 100%;
}
</style>
