<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="学期" prop="semester">
        <el-select v-model="queryParams.semester" placeholder="请选择学期" style="width: 180px">
          <el-option value="2015-2016-1" label="2015-2016-1"/>
          <el-option value="2015-2016-2" label="2015-2016-2"/>
          <el-option value="2016-2017-1" label="2016-2017-1"/>
          <el-option value="2016-2017-2" label="2016-2017-2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" prop="scholarshipNo">
        <el-select v-model="queryParams.scholarshipNo" placeholder="请选择" style="width: 180px">
          <el-option
            v-for="item in scholarshipList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="审批状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择" filterable style="width: 180px">
          <el-option
            v-for="item in statusList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button icon="el-icon-refresh" size="medium" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-refresh"
          size="mini" @click="getList"
        >刷新
        </el-button>
      </el-col>
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

    </el-row>

    <el-table v-loading="loading" :data="scholarShipList">

      <el-table-column label="学期" align="center" prop="semester"/>
      <el-table-column label="奖学金名称" align="center" prop="scholarshipName"/>
      <el-table-column label="金额" align="center" prop="money"/>
      <el-table-column label="学号" align="center" prop="studentNo"/>
      <el-table-column label="姓名" align="center" prop="studentName"/>
      <el-table-column label="审核状态" align="center" prop="status">


        <template slot-scope="scope">
<!--          <span>{{ showModel(scope.row, 'status') }}</span>-->
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '0'" size="medium" plain @click="getDialogData(scope.row)">审批中...</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">审批通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">审批拒绝</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            :disabled="scope.row.status==='1'|| scope.row.status==='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            :disabled="scope.row.status==='1'|| scope.row.status==='2'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleDelete(scope.row)"
          >删除
          </el-button>
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

    <el-dialog title="审批详情" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">

      <el-descriptions class="margin-top" :column="2" border title="申请信息">
        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-date"/>
            学期
          </template>
          {{ dialogData.semester }}
        </el-descriptions-item>

        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-box"/>
            奖学金类型
          </template>
          <template>
            {{showType(dialogData.scholarshipNo)}}
          </template>
        </el-descriptions-item>


        <el-descriptions-item :span="1">
          <template slot="label" >
            <i class="el-icon-tickets"/>
            学号
          </template>
          {{ dialogData.studentNo }}
        </el-descriptions-item>

        <el-descriptions-item :span="1">
          <template slot="label">
            <i class="el-icon-user"/>
            姓名
          </template>
          {{ dialogData.studentName }}
        </el-descriptions-item>
        <el-descriptions-item >
          <template slot="label" style="height: 500px">
            <i class="el-icon-reading"/>
            申请原因
          </template>
          {{ dialogData.reason }}
        </el-descriptions-item>

      </el-descriptions>



      <div style="margin: 20px 0">
        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">审批状态</div>
        <el-steps :space="600" :active="dialogData.status === '0'? 1:3" finish-status="success" :align-center="true" :process-status="'finish'" simple>
          <el-step title="提交信息"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批完成"></el-step>
        </el-steps>
      </div>

      <el-descriptions  title="审批结果" :column="3" :size="'medium'" border class="margin-top" v-if="dialogData.status!=='0'">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            审批人
          </template>
          {{dialogData.instructorName}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            审批结果
          </template>
          <div style="position: relative">
            <div style="float: left">{{ showModel(dialogData, 'status') }}</div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <el-drawer
      title="修改奖学金申请"
      :visible.sync="drawer"
      :direction="'rtl'"
      :with-header="false"
      :size="'36%'"
    >
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="报备申请" name="basic">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="申请人: ">
                    {{ this.student.nickName }}
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="学号: ">
                    {{ this.student.studentNo }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="所在学院: " >
                    {{ this.student.collegeInfo.collegename }}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="学期" prop="semester">
                    <el-select v-model="form.semester" placeholder="请选择学期">
                      <el-option value="2015-2016-1" label="2015-2016-1"/>
                      <el-option value="2015-2016-2" label="2015-2016-2"/>
                      <el-option value="2016-2017-1" label="2016-2017-1"/>
                      <el-option value="2016-2017-2" label="2016-2017-2"/>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="奖学金" prop="scholarshipNo">
                    <el-select v-model="form.scholarshipNo" placeholder="请选择奖学金类型">
                      <el-option v-for="item in scholarshipList" :key="item.id" :value="item.id" :label="item.name"/>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item label="申请理由:" prop="reason">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="申请理由"
                      v-model="form.reason">
                    </el-input>
                  </el-form-item>
                </el-col>

              </el-row>
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

  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { listScholarship, addScholarship, delScholarship, getScholarship, updateScholarship, checkScholarshipExit } from '@/api/instructor/scholarship'

export default {
  name: 'SubSystem',
  data() {
    let checkScholarship = (rule, value, callback)=>{
      if (value===''|| value===null){
        callback(new Error('请选择奖学金类型！'))
      }else if (this.form.semester===''||this.form.semester===null){
        callback()
      }else{
        checkScholarshipExit(this.form).then(res=>{
          console.log(res)
          if (res===false){
            callback(new Error('您已经申请了此奖学金，无需再次申请！'));
          }else{
            callback();
          }
        })
      }
    }
    return {
      dialogData:{},
      dialogTableVisible:false,
      student:{},
      activeName:'basic',
      drawer:false,
      formLabelWidth:'70px',
      form:{},
      scholarship:{},
      scholarshipList:[
        { id:'1',name:'国家奖学金', },
        { id:'2',name:'国家励志奖学金', },
        { id:'3',name:'校一等奖学金', },
        { id:'4',name:'校二等奖学金', },
        { id:'5',name:'校三等奖学金', },
      ],
      statusList:[
        {id:'0',name:'已提交'},
        {id:'1',name:'已通过'},
        {id:'2',name:'已拒绝'},
      ],
      scholarShipList: [],
      total: 0,
      single: true,
      ids: [],
      showSearch: false,
      // 遮罩层
      loading: true,
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        semester:'2015-2016-1',
        scholarshipNo: null,
        studentNo:null,
        status:null,
      },

      rules: {
        semester:[
          {required:true, message:"请选择学期", trigger:"blur"}
        ],
        scholarshipNo:[
          {required:true, trigger:"blur", validator: checkScholarship}
        ],
        reason:[
          {required:true, message:"请填写申请原因", trigger:"blur"}
        ]
      },
    }
  },
  created() {
    this.student = this.$store.getters.studentInfo
    console.log(this.student)
    this.queryParams.studentNo = this.student.studentNo
    this.getList()
  },
  watch: {
    queryParams: {
      deep: true,
      handler: 'getList'
    },
  },

  methods: {
    showType(no){
      let scholarshipName = null
      this.scholarshipList.find((obj)=>{
        if(obj.id===no){
          scholarshipName = obj.name;
        }
      })
      return scholarshipName;
    },
    getDialogData(data){
      this.dialogTableVisible = true
      this.dialogData = data
    },
    submitForm(){
      this.$refs["form"].validate(valid=>{
        if(valid){
          if (this.form.id!=null){
            updateScholarship(this.form).then(res=>{
              this.msgSuccess("修改成功");
              this.drawer = false;
              this.getList();
            })
          }else{
            this.form.studentNo = this.student.studentNo
            this.form.instructorId = this.student.instructorId
            console.log("this.form.instructorId",this.form.instructorId)
            this.form.status = '0'
            this.form.type = 1;
            addScholarship(this.form).then(res=>{
              this.msgSuccess("新增成功");
              this.drawer = false;
              this.getList();
            })
          }
        }
      })
    },
    cancel(){
      this.reset();
      this.drawer = false;
    },

    getList() {
      this.loading = true
      this.queryParams.type = '1';
      listScholarship(this.queryParams).then(response => {
        this.scholarShipList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.queryParams.semester = null
      this.queryParams.scholarshipNo = null
      this.queryParams.status = null
      this.handleQuery()
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    handleAdd() {
      this.reset()
      this.drawer = true
    },
    handleUpdate(row) {
      this.drawer = true;
      const id = row.id
      getScholarship(id).then(res=>{
        this.form = res.data
        console.log(res)
      })
    },
    handleDelete(row){
      const id = row.id;
      this.$confirm("确定要删除编号为" + id + "的数据项？", "警告", {
        confirmButtonClass:"确认",
        cancelButtonText:"取消",
        type:"warning",
      }).then(function() {
        return delScholarship(id);
      }).then(()=>{
        this.getList();
        this.msgSuccess("删除成功");
      }).catch(()=>{})

    },


    // 表单重置
    reset() {
      this.form = {
        id: null,
        semester: null,
        scholarshipNo: null,
        status : '0',
        type : 1,

      }
      this.resetForm('form')
    },

    showModel(row, str) {
      let name = null
      if (str === 'status') {
        this.statusList.find((obj) => {
          if (obj.id === row.status) {
            name = obj.name
          }
        })
      }
      else if (str === 'nation') {
        this.nationList.find((obj) => {
          if (obj.id === row.nation) {
            name = obj.info
          }
        })
      } else if (str === 'stuType') {
        this.stuTypeList.find((obj) => {
          if (obj.id === row.stuType) {
            name = obj.info
          }
        })
      } else if (str==='major'){
        this.majorList.find((obj)=>{
          if (obj.id===row.major){
            name = obj.info;
          }
        })
      }
      return name
    },
  }
}
</script>


