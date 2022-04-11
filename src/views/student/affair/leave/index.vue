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
      <el-form-item label="请假事由" prop="staffCatCode">
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
      <el-table-column label="请假事由" align="center" prop="type" width="100">
        <template slot-scope="scope">
          <span>{{typeString(scope)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请假时间" align="center" prop="startTime">
        <template slot-scope="scope">
<!--          <span>{{parseTime(scope.row.startTime,'yyyy-MM-dd hh:mm')+'-'+parseTime(scope.row.endTime,'yyyy-MM-dd hh:mm')}}</span>-->
          <span>{{scope.row.startTime+'-'+scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="目的地点" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCodeToText(scope.row.location)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" width="120">
        <template slot-scope="scope">
          <span>{{statusString(scope.row.status)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批人" align="center" prop="userId">
        <template slot-scope="scope">
          <span>{{userString(scope.row.userId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批结果" align="center" prop="result">
        <template slot-scope="scope">
          <span>{{scope.row.result === null ? '无' : scope.row.result}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
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

    <vodal :show="show" v-if="open" animation="slideRight"  :height="windowHeight"  :width="600" class-name="my-dialog" @hide="handleHid" :customStyles="customStyles" :closeOnEsc="true">
      <el-card>
        <el-tabs v-model="activeName">
          <el-tab-pane label="请假申请" name="basic">
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
                  <el-form-item label="请假事由:" prop="type">
                    <el-radio-group v-model="form.type">
                      <el-radio :label="1">病假</el-radio>
                      <el-radio :label="2">事假</el-radio>
                      <el-radio :label="3">其他</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="请假时间:" prop="startTime">
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
                    >
                    </el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="请假理由:" prop="reason">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请假理由"
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
    </vodal>


  </div>
</template>

<script>
  import { listLeave, getLeave, delLeave, addLeave, updateLeave } from "@/api/student/leave/leave";
  import Vue from 'vue';
  import Vodal from 'vodal';
  import "vodal/common.css";
  import "vodal/slide-right.css";
  import {getToken} from "@/utils/auth";
  import {regionData, CodeToText} from "element-china-area-data";
  Vue.component(Vodal.name, Vodal);
  const typeList = {
    1:'病假',
    2:'事假',
    3:'其他'
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
        // 请假类别表格数据
        leaveList: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
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
            { required: true, message: '请选择请假事由'}
          ],
          startTime: [
            { required: true, message: '请选择请假时间段'}
          ],
          location: [
            { required: true, message: '请选择外出目的地'}
          ],
          reason: [
            { required: true, message: '请填写请假详细信息'}
          ],
        },
        show:false,
        customStyles: {"left": "unset","padding":"unset"},
        windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
        windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
        activeName: 'basic',
        options: regionData,
        statusOptions: [
          {label:'审批中',value:0},
          {label:'审核完成',value:1},
        ],
        typeOptions: [
          {label:'病假',value:1},
          {label:'事假',value:2},
          {label:'其他',value:3},
        ],
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
      /** 查询请假类别列表 */
      getList() {
        this.loading = true;
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
          reason: null,
          status: null,
          userId: null,
          file: null,
          result: null
        };
        this.resetForm("form");
      },
      // 表单重置
      resetQueryParams() {
        this.queryParams = {
          pageNum: 1,
          pageSize: 10,
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
                this.form.status = 0
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
        return typeList[value.row.type]
      },
      getCodeToText(codeStr) {
        let codeArray = codeStr.split(",")
        let area = "";
        switch (codeArray.length) {
          case 1:
            area += CodeToText[codeArray[0]];
            break;
          case 2:
            area += CodeToText[codeArray[0]] + "/" + CodeToText[codeArray[1]];
            break;
          case 3:
            area +=
              CodeToText[codeArray[0]] +
              "/" +
              CodeToText[codeArray[1]] +
              "/" +
              CodeToText[codeArray[2]];
            break;
          default:
            break;
        }
        return area;
      },
      statusString(status){
        if(status === 0){
          return '审批中...'
        }else{
          return '审批完成'
        }
      },
      userString(id){
        if(id === null) return '无'
        else return id
      }
    }
  };
</script>
