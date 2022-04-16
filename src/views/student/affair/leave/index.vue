<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="审批状态" prop="staffCatCode">
        <el-select v-model="queryParams.status" placeholder="请选择">
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="报备事由" prop="staffCatCode">
        <el-select v-model="queryParams.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
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
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除
        </el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="info"-->
<!--          plain-->
<!--          icon="el-icon-upload2"-->
<!--          size="mini"-->
<!--          @click="importChange"-->
<!--        >导入</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button-->
<!--          type="warning"-->
<!--          plain-->
<!--          icon="el-icon-download"-->
<!--          size="mini"-->
<!--          @click="handleExport"-->
<!--        >导出-->
<!--        </el-button>-->
<!--      </el-col>-->
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="leaveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="报备事由" align="center" prop="type" width="100">
        <template slot-scope="scope">
          <span>{{typeString(scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="报备时间" align="center" prop="startTime">
        <template slot-scope="scope">
<!--          <span>{{parseTime(scope.row.startTime,'yyyy-MM-dd hh:mm')+'-'+parseTime(scope.row.endTime,'yyyy-MM-dd hh:mm')}}</span>-->
          <span>{{scope.row.startTime+' 至 '+scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地点" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCodeToText(scope.row.location)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === 1" size="medium" plain @click="getDialogData(scope.row)">审批中...</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === 3" size="medium" plain @click="getDialogData(scope.row)">审批通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">审批拒绝</el-button>
<!--          <span v-else>{{statusString(scope.row.status)}}</span>-->
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="userId" width="80">
        <template slot-scope="scope">
          <span>{{userString(scope.row.userId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批结果" align="center" prop="result">
        <template slot-scope="scope">
          <span>{{scope.row.result === null ? '无' : scope.row.result}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
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
      title="我是标题"
      :visible.sync="open"
      v-if="show"
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
                      王炳哲
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="学号: ">
  <!--                    <el-input label="2018201932" />-->
                      2018201932
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="所在学院: " >
  <!--                    <el-input label="计算机科学与技术学院"/>-->
                      计算机科学与技术学院
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="联系电话:" prop="phone">
                      <el-input v-model="form.phone" placeholder="请输入联系方式"/>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="报备事由:" prop="type">
                      <el-radio-group v-model="form.type">
                        <el-radio :label="1">公假</el-radio>
                        <el-radio :label="2">病假</el-radio>
                        <el-radio :label="3">事假</el-radio>
                        <el-radio :label="4">求职</el-radio>
                        <el-radio :label="5">实习</el-radio>
                        <el-radio :label="6">返家</el-radio>
                        <el-radio :label="7">其他</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="报备时间:" prop="startTime">
                      <el-date-picker
                        v-model="dateRange"
                        type="datetimerange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        clearable
                        style="width: 100%"
                        value-format="yyyy-MM-dd HH:mm:ss"
                      >
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="外出目的地:" prop="location">
                      <el-cascader
                        size="large"
                        :options="options"
                        v-model="selectedOptions"
                        style="width: 100%"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24" v-if="form.location !== null && form.location !== ''" >
                    <el-form-item label="" prop="detailLocation">
                      <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="填写详细地址"
                        v-model="form.detailLocation"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item label="报备理由:" prop="reason">
                      <el-input
                        type="textarea"
                        :rows="3"
                        placeholder="报备理由"
                        v-model="form.reason">
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </el-tab-pane>
            <!--      <el-tab-pane label="字段信息" name="cloum">字段信息</el-tab-pane>-->
          </el-tabs>
          <el-form label-width="100px">
            <el-form-item style="text-align: center;margin-left:-100px;margin-top:10px;">
              <el-button type="primary" @click="submitForm">确 定</el-button>
              <el-button @click="cancel">返回</el-button>
            </el-form-item>
          </el-form>
        </el-card>
    </el-drawer>

    <el-dialog title="审批详情" :visible.sync="dialogTableVisible" v-if="dialogTableVisible">
      <el-descriptions  title="提交信息" :column="3" :size="'medium'" border >
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            申请人
          </template>
          kooriookami
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            学号
          </template>
          2018201206
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          {{dialogData.phone}}
        </el-descriptions-item>

        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            所在学院
          </template>
          计算机科学与技术学院
        </el-descriptions-item>
        <el-descriptions-item >
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            年级
          </template>
          大四
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-tickets"></i>
            报备事由
          </template>
          <el-tag size="small">{{typeString(dialogData)}}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            报备时间
          </template>
          {{dialogData.startTime+' 至 '+dialogData.endTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label" >
            <i class="el-icon-location-outline"></i>
            目的地
          </template>
          {{getCodeToText(dialogData.location)+'-'+dialogData.detailLocation}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            报备理由
          </template>
          {{dialogData.reason}}
        </el-descriptions-item>
      </el-descriptions>
      <div style="margin: 20px 0">
        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">审批状态</div>
        <el-steps :space="600" :active="dialogData.status === 1? 1:3" finish-status="success" :align-center="true" :process-status="'finish'" simple>
          <el-step title="提交信息"></el-step>
          <el-step title="审批中"></el-step>
          <el-step title="审批完成"></el-step>
        </el-steps>
      </div>
      <el-descriptions  title="审批结果" :column="3" :size="'medium'" border class="margin-top" v-if="dialogData.status!==1">
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-user"></i>
            审批人
          </template>
          {{userString(dialogData.userId)}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            手机号
          </template>
          18100000000
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label">
            <i class="el-icon-mobile-phone"></i>
            审批时间
          </template>
          {{dialogData.checkTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-tickets"></i>
            审批结果
          </template>
          <div style="position: relative">
            <div style="float: left">审批通过</div>
            <div style="float: right">
            <el-button type="success" icon="el-icon-medal">审批通过</el-button></div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </div>
</template>

<script>
  import { listLeave, getLeave, delLeave, addLeave, updateLeave } from "@/api/student/leave";
  import Vue from 'vue';
  import Vodal from 'vodal';
  import "vodal/common.css";
  import "vodal/slide-right.css";
  import {getToken} from "@/utils/auth";
  import {regionData, CodeToText} from "element-china-area-data";
  Vue.component(Vodal.name, Vodal);
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
    name: "leave",
    data() {
      return {
        upload: {
          open: false,
          title: "",
          isUploading: false,
          updateSupport: 0,
          headers: { Authorization: "Bearer " + getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/hrm/leave/importData"
        },
        // 遮罩层
        loading: true,
        // 选中数组
        ids: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: false,
        // 总条数
        total: 0,
        // 报备类别表格数据
        leaveList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          orderBy: 'id asc',
          status: null,
          type: null,
          studentId: 1
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          phone: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            {
              pattern: /^((0\d{2,3}-\d{7,8})|(1\d{10}))$/,
              message: '请输入正确的手机号码或者座机号',
            },
          ],
          type: [
            { required: true, message: '请选择报备事由'}
          ],
          startTime: [
            { required: true, message: '请选择报备时间段'}
          ],
          location: [
            { required: true, message: '请选择外出目的地'}
          ],
          detailLocation: [
            { required: true, message: '请填写详细地址'}
          ],
          reason: [
            { required: true, message: '请填写报备详细信息'}
          ],
        },
        show:false,
        customStyles: {"left": "unset","padding":"unset"},
        windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
        windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
        activeName: 'basic',
        options: regionData,
        statusOptions: [
          {label:'审批中',value:1},
          {label:'审批拒绝',value:4},
          {label:'审批通过',value:3}
        ],
        typeOptions: [
          {label:'公假',value:1},
          {label:'病假',value:2},
          {label:'求职',value:3},
          {label:'实习',value:4},
          {label:'返家',value:5},
          {label:'其他',value:6}
        ],
        dialogTableVisible: false,
        dialogData: {}
      };
    },
    created() {
      this.getList();
    },
    watch:{
      queryParams:{
        deep:true,
        handler:"getList"
      }
    },
    computed: {
      dateRange: {
        get(){
          if(this.form.startTime === undefined || this.form.startTime === null || this.form.startTime === ''){
            return []
          }
          return [this.form.startTime,this.form.endTime]
        },
        set(data){
          if(data !== null){
            this.$set(this.form,'startTime',data[0])
            this.$set(this.form,'endTime',data[1])
          }else {
            this.$set(this.form,'startTime',null)
            this.$set(this.form,'endTime',null)
          }
        }
      },
      selectedOptions: {
        get(){
          if(this.form.location === undefined || this.form.location === null || this.form.location === ''){
            return []
          }
          return this.form.location.split(',')
        },
        set(data){
          this.form.location = data.join(',')
        }
      }
    },
    methods: {
      /** 查询报备类别列表 */
      getList() {
        this.loading = true;
        console.log(this.queryParams)
        listLeave(this.queryParams).then(response => {
          console.log(response)
          this.leaveList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.show = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          id: null,
          studentId: null,
          phone: null,
          type: null,
          startTime: null,
          endTime: null,
          location: null,
          detailLocation: null,
          reason: null,
          status: null,
          userId: null,
          file: null,
          result: null,
          checkTime: null
        };
        this.resetForm("form");
      },
      // 表单重置
      resetQueryParams() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          orderBy: 'id desc',
          status: null,
          type: null,
          studentId: 1
        };
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetQueryParams();
        this.getList();
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.id)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.show = true;
        this.open = true;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.id || this.ids
        getLeave(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.show = true;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            this.form.studentId = 1
            console.log(this.form)
            if (this.form.id != null) {
              updateLeave(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            } else {
                this.form.status = 1
                addLeave(this.form).then(response => {
                this.msgSuccess("新增成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.id || this.ids;
        this.$confirm('是否确认删除数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLeave(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleHid(){
        this.show = false
        this.open = false
      },
      typeString (value) {
        return typeList[value.type]
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
      userString(id){
        if(id === null) return '无'
        else return id
      },
      getDialogData(data){
        this.dialogTableVisible = true
        this.dialogData = data
      }
    }
  };
</script>
