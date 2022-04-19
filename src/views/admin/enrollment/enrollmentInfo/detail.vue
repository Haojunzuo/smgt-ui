<template>
  <div class="app-container">


    <el-form ref="form" :inline-message="true" :model="studentInfo" :rules="rules" :inline="true">
      <el-descriptions class="margin-top" title="学生基本信息" :column="3"  border>
        <template slot="extra">
          <el-button type="info" size="small" @click="goBack">返回</el-button>
          <el-button type="primary" size="small" @click="submitForm">提交</el-button>
        </template>
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
          {{studentInfo.nickName}}
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            照片
          </template>
          <img v-bind:src="studentInfo.avatar" title="点击上传头像" class="img-circle img-lg" />
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            性别
          </template>
          <el-radio-group disabled v-model="studentInfo.sex">
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
          <el-form-item  prop="birth" style="margin: 0">
            <el-date-picker
              v-model="studentInfo.birth"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            民族
          </template>
          <el-form-item  prop="nation" style="margin: 0">
            <el-select v-model="studentInfo.nation" filterable  class="add-nation-input" >
              <el-option v-for="item in nationList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            政治面貌
          </template>
          <el-form-item  prop="politicalStatus" style="margin: 0">
            <el-select v-model="studentInfo.politicalStatus" filterable  class="add-nation-input" >
              <el-option v-for="item in politicalList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            入学时间
          </template>
          <el-form-item  prop="inTime" style="margin: 0">
            <el-date-picker
              v-model="studentInfo.inTime"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            预计毕业时间
          </template>
          <el-form-item  prop="expectedGradu" style="margin: 0">
            <el-date-picker
              v-model="studentInfo.expectedGradu"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"/>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            血型
          </template>
          <el-form-item  prop="bloodType" style="margin: 0">
            <el-select v-model="studentInfo.bloodType" filterable  class="add-nation-input" >
              <el-option v-for="item in bloodList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            健康状况
          </template>
          <el-form-item  prop="healthStatus" style="margin: 0">
            <el-select v-model="studentInfo.healthStatus" filterable  class="add-nation-input" >
              <el-option v-for="item in healthList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            婚姻状态
          </template>
          <el-form-item  prop="maritalStatus" style="margin: 0">
            <el-select v-model="studentInfo.maritalStatus" filterable  class="add-nation-input" >
              <el-option v-for="item in maritalList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            宗教信仰
          </template>
          <el-form-item  prop="religious" style="margin: 0">
            <el-select v-model="studentInfo.religious" filterable  class="add-nation-input" >
              <el-option v-for="item in religiousList" :key="item.value" :label="item.info" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            家庭地址
          </template>
          <el-form-item  prop="address" style="margin: 0">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedAddressOptions"
              clearable
            />
          </el-form-item>
          <el-form-item  prop="detailAddress" style="margin: 0;padding-left: 20px;">
            <el-input v-model="studentInfo.detailAddress" placeholder="请填写详细地址" />
          </el-form-item>
        </el-descriptions-item>

        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            户口所在地
          </template>
          <el-form-item  prop="residence" style="margin: 0">
            <el-cascader
              size="large"
              :options="options"
              v-model="selectedResidenceOptions"
              clearable
            />
          </el-form-item>
          <el-form-item  prop="detailResidence" style="margin: 0;padding-left: 20px">
            <el-input v-model="studentInfo.detailResidence" placeholder="请填写详细地址" />
          </el-form-item>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="个人联系方式" :column="2"  border style="margin-top: 20px">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            本人移动电话
          </template>
          <el-form-item  prop="phoneNumber" style="margin: 0">
            <el-input v-model="studentInfo.phoneNumber" placeholder="请输入联系电话"/>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            电子邮件
          </template>
          <el-form-item  prop="email" style="margin: 0">
            <el-input  placeholder="请输入邮箱" v-model="studentInfo.email"/>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            QQ号码
          </template>
          <el-form-item  prop="qq" style="margin: 0">
            <el-input  placeholder="请输入QQ号码" v-model="studentInfo.qq"/>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            微信号
          </template>
          <el-form-item  prop="wechat" style="margin: 0">
            <el-input  placeholder="请输入微信号" v-model="studentInfo.wechat"/>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            紧急联系人
          </template>
          <el-form-item  prop="contact" style="margin: 0">
            <el-input  placeholder="请输入紧急联系人" v-model="studentInfo.contact"/>
          </el-form-item>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            紧急联系人电话
          </template>
          <el-form-item  prop="contactPhone" style="margin: 0">
            <el-input  placeholder="请输入紧急联系人电话" v-model="studentInfo.contactPhone"/>
          </el-form-item>
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
          <el-form-item  prop="orgSchool" style="margin: 0">
            <el-input  placeholder="请输入原院校" v-model="studentInfo.orgSchool"/>
          </el-form-item>
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
    </el-form>

  </div>
</template>

<script>
import {regionData} from "element-china-area-data";
import {listCollege, listClass} from "../../../../api/admin/course/schedule";
import { getStudent, updateStudent } from '@/api/student/student'

export default {
  name: "enrollmentStudent",
  props:['id'],

  data() {
    var validateAddress = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择家庭地址'));
      } else {
        callback();
      }
    };
    var validateResidence = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择户口所在地'));
      } else {
        callback();
      }
    };
    return {
      studentInfo: {},
      form: {},
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
      rules: {
        birth: [
          { required: true, message: '请选择出生日期', trigger: ['blur', 'change'] },
        ],
        nation: [
          { required: true, message: '请选择民族', trigger: ['blur', 'change'] },
        ],
        politicalStatus: [
          { required: true, message: '请选择政治面貌', trigger: ['blur', 'change'] },
        ],
        inTime: [
          { required: true, message: '请选择入学时间', trigger: ['blur', 'change'] },
        ],
        expectedGradu: [
          { required: true, message: '请选择预计毕业时间', trigger: ['blur', 'change'] },
        ],
        bloodType: [
          { required: true, message: '请选择血型', trigger: ['blur', 'change'] },
        ],
        healthStatus: [
          { required: true, message: '请选择健康状况', trigger: ['blur', 'change'] },
        ],
        maritalStatus: [
          { required: true, message: '请选择婚姻状态', trigger: ['blur', 'change'] },
        ],
        religious: [
          { required: true, message: '请选择宗教信仰', trigger: ['blur', 'change'] },
        ],
        address: [
          { required: true, validator: validateAddress, trigger: ['blur', 'change']},
        ],
        detailAddress: [
          { required: true, message: '请填写详细家庭地址', trigger: ['blur', 'change'] },
        ],
        residence: [
          { required: true, validator: validateResidence, trigger: ['blur', 'change']},
        ],
        detailResidence: [
          { required: true, message: '请填写详细户口所在地', trigger: ['blur', 'change'] },
        ],
        phoneNumber: [
          { required: true, message: '请填写电话号码', trigger: ['blur', 'change'] },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,
            message: '请输入正确的手机号码或者座机号',
          },
        ],
        email: [
          { required: true, message: '请填写邮箱地址', trigger: ['blur', 'change'] },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        qq: [
          { required: true, message: '请填写QQ号', trigger: ['blur', 'change'] },
        ],
        wechat: [
          { required: true, message: '请填写微信号', trigger: ['blur', 'change'] },
        ],
        contact: [
          { required: true, message: '请填写紧急联系人', trigger: ['blur', 'change'] },
        ],
        contactPhone: [
          { required: true, message: '请填写紧急联系人电话', trigger: ['blur', 'change'] },
          {
            pattern: /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,
            message: '请输入正确的手机号码或者座机号',
          },
        ],
        orgSchool: [
          { required: true, message: '请填写原院校', trigger: ['blur', 'change'] },
        ],
      }
    }
  },
  created() {
    // path: ':modelId',
    // this.$router.push("/tool/updateModel/" + modelId);
    // const modelId = this.$route.params && this.$route.params.modelId
    const studentId = this.$route.params && this.$route.params.studentId
    console.log("studentId:",studentId)

    getStudent(studentId).then(res=>{
      console.log("res",res)
      this.studentInfo = res.data;
    })
    this.studentInfo = this.$store.getters.studentInfo;
    listCollege().then(res=>{
      console.log(res)
      this.collegeList = res.rows
    })
    listClass().then(res=>{
      this.classList = res.rows
      console.log(res)
    })
    console.log(this.studentInfo)
  },
  mounted() {
    if(this.studentInfo.address === null || this.studentInfo.address === '' || this.studentInfo.address === undefined){
      this.studentInfo.address = '110000,110100,110101'
    }
    if(this.studentInfo.residence === null || this.studentInfo.residence === '' || this.studentInfo.residence === undefined){
      this.studentInfo.residence = '110000,110100,110101'
    }
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
  methods: {
    goBack() {
      this.$router.go(-1)// 返回
      //关闭子页面
      this.$store.state.tagsView.visitedViews.splice(this.$store.state.tagsView.visitedViews.findIndex(item => item.path === this.$route.path), 1)
      this.$router.push(this.$store.state.tagsView.visitedViews[this.$store.state.tagsView.visitedViews.length - 1].path)
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          updateStudent(this.studentInfo).then(response => {
            this.msgSuccess("提交成功");
            // this.$store.commit('SET_STUDENT_INFO',this.studentInfo)
            this.goBack();
          });
        }
      });
    },
  }
};
</script>
