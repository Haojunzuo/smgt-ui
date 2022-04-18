<template>
  <div class="app-container">
    <el-form ref="form"  label-width="100px">
      <el-descriptions class="margin-top" title="学生基本信息" :column="3"  border>
        <template slot="extra">
          <el-button type="primary" size="small">提交</el-button>
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
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"/>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            民族
          </template>
          <el-select v-model="studentInfo.nation" filterable  class="add-nation-input" >
            <el-option v-for="item in nationList" :key="item.value" :label="item.info" :value="item.value"></el-option>
          </el-select>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            政治面貌
          </template>
          <el-select v-model="studentInfo.politicalStatus" filterable  class="add-nation-input" >
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
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"/>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            血型
          </template>
          <el-select v-model="studentInfo.bloodType" filterable  class="add-nation-input" >
            <el-option v-for="item in bloodList" :key="item.value" :label="item.info" :value="item.value"></el-option>
          </el-select>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            健康状况
          </template>
          <el-select v-model="studentInfo.healthStatus" filterable  class="add-nation-input" >
            <el-option v-for="item in healthList" :key="item.value" :label="item.info" :value="item.value"></el-option>
          </el-select>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            婚姻状态
          </template>
          <el-select v-model="studentInfo.maritalStatus" filterable  class="add-nation-input" >
            <el-option v-for="item in maritalList" :key="item.value" :label="item.info" :value="item.value"></el-option>
          </el-select>
        </el-descriptions-item>

        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            宗教信仰
          </template>
          <el-select v-model="studentInfo.religious" filterable  class="add-nation-input" >
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
            v-model="selectedAddressOptions"
            clearable
          />
          <el-input v-model="studentInfo.detailAddress" placeholder="请填写详细地址" style="padding-left: 20px;width: 50%"/>
        </el-descriptions-item>

        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            籍贯
          </template>
          <el-cascader
            size="large"
            :options="options"
            v-model="selectedResidenceOptions"
            clearable
          />
          <el-input v-model="studentInfo.detailResidence" placeholder="请填写详细地址" style="padding-left: 20px;width: 50%"/>
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="个人联系方式" :column="3"  border style="margin-top: 20px">
        <template slot="extra">
          <el-button type="primary" size="small">操作</el-button>
        </template>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          <el-input  placeholder="请输入联系方式"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            居住地
          </template>
          苏州市
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            备注
          </template>
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          江苏省苏州市吴中区吴中大道 1188 号
        </el-descriptions-item>
      </el-descriptions>
      <el-descriptions class="margin-top" title="在校信息" :column="3"  border style="margin-top: 20px">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            用户名
          </template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          <el-input  placeholder="请输入联系方式"/>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            居住地
          </template>
          苏州市
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            备注
          </template>
          <el-tag size="small">学校</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-office-building"></i>
            联系地址
          </template>
          江苏省苏州市吴中区吴中大道 1188 号
        </el-descriptions-item>
      </el-descriptions>
    </el-form>

  </div>
</template>

<script>
import {regionData, CodeToText} from "element-china-area-data";

export default {
  name: "select",
  data() {
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
    }
  },
  created() {
    this.studentInfo = this.$store.getters.studentInfo;
    console.log(this.studentInfo)
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
    // setForm(){
    //   this.form = {
    //     birth: this.$store.getters.studentInfo.birth,
    //   }
    // }
  }
};
</script>
