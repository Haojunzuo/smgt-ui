<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="违纪学生" prop="staffCatCode">
        <el-select v-model="queryParams.studentId" placeholder="请选择" clearable filterable>
          <el-option
            v-for="item in studentList"
            :key="item.id"
            :label="item.nickName"
            :value="item.id">
            <span>{{ item.nickName + '-' + item.studentNo }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="违纪类型" prop="staffCatCode">
        <el-select v-model="queryParams.type" placeholder="请选择" clearable>
          <el-option
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="违纪状态" prop="staffCatCode">
        <el-select v-model="queryParams.status" placeholder="请选择" clearable>
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="违纪结果" prop="staffCatCode">
        <el-select v-model="queryParams.result" placeholder="请选择" clearable>
          <el-option
            v-for="item in resultOptions"
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

    <el-table v-loading="loading" :data="violationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学生姓名" align="center" prop="studentId" width="100">
        <template slot-scope="scope">
          <span>{{getStudentName(scope.row.studentId)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="违纪事项" align="center" prop="type">
        <template slot-scope="scope">
          <span>{{typeString(scope.row.type)}}</span>
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
            active-color="#ff4949"
            @change="handleStatus(scope.row)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="撤销时间" align="center" prop="dealTime">
        <template slot-scope="scope">
          <span>{{(scope.row.dealTime === null || scope.row.dealTime === '') ? '尚未撤销' : scope.row.dealTime}}</span>
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
          <el-tab-pane label="违纪信息" name="basic">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="违纪学生: " prop="studentId">
                    <el-select v-model="form.studentId" placeholder="请选择" clearable filterable>
                      <el-option
                        v-for="item in studentList"
                        :key="item.id"
                        :label="item.nickName"
                        :value="item.id">
                        <span>{{ item.nickName + '-' + item.studentNo }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="违纪事项: " prop="type">
                    <el-select v-model="form.type" placeholder="请选择" clearable filterable>
                      <el-option
                        v-for="item in typeOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="违纪结果: " prop="result">
                    <el-select v-model="form.result" placeholder="请选择" clearable filterable>
                      <el-option
                        v-for="item in resultOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="状态: " >
                    <el-switch
                      v-model="form.status === 1"
                      active-color="#ff4949"
                      @change="changeStatus(form)">
                    </el-switch>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="处理人: " >
                    {{this.$store.getters.userInfo.nickName}}
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="详细信息: " prop="description">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="填写详细信息"
                      v-model="form.description">
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
  import { listViolation, getViolation, delViolation, addViolation, updateViolation } from "@/api/instructor/violation";
  import {regionData, CodeToText} from "element-china-area-data";
  import {listStudent, getStudent} from "../../../../api/student/student";
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
    name: "punish",
    data() {
      return {
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
        violationList: [],
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
          studentId: null
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          type: [
            { required: true, message: '请选择违纪事项'}
          ],
          studentId: [
            { required: true, message: '请选择违纪学生'}
          ],
          result: [
            { required: true, message: '请选择违纪结果'}
          ],
          description: [
            { required: true, message: '请填写详细信息'}
          ]
        },
        show:false,
        customStyles: {"left": "unset","padding":"unset"},
        windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
        windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
        activeName: 'basic',
        options: regionData,
        statusOptions: [
          {label:'未撤销',value:1},
          {label:'已撤销',value:2},
        ],
        typeOptions: [
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
        dialogTableVisible: false,
        dialogData: {},
        studentList: [],
      };
    },
    created() {
      listStudent({pageNum:1,instructorId: this.$store.getters.userInfo.userId}).then(res=>{
        console.log(res)
        this.studentList = res.rows
      })
      this.getList();
    },
    watch:{
      queryParams:{
        deep:true,
        handler:"getList"
      }
    },
    computed: {
      studentNewName(item){
        return item.nickName + '-' + item.studentNo
      },
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
        listViolation(this.queryParams).then(response => {
          console.log(response)
          this.violationList = response.rows;
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
          type: null,
          time: null,
          dealTime: null,
          description: null,
          status: 1,
          userId: this.$store.getters.userInfo.userId,
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
          studentId: null
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
        getViolation(id).then(response => {
          this.form = response.data;
          this.open = true;
          this.show = true;
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            console.log(this.form)
            if (this.form.id != null) {
              updateViolation(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            } else {
              addViolation(this.form).then(response => {
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
          return delViolation(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleStatus(data){
        this.$confirm('是否确认修改该状态?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          data.status = data.status === 1? 2:1
          return updateViolation(data);
        }).then(() => {
          this.getList();
          this.msgSuccess("修改成功");
        }).catch(() => {});
      },
      handleHid(){
        this.show = false
        this.open = false
      },
      typeString (value) {
        let obj = this.typeOptions.find(item=>item.value === value)
        return obj.label
      },
      resultString(value){
        let obj = this.resultOptions.find(item=>item.value === value)
        return obj.label
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
      getDialogData(data){
        this.dialogTableVisible = true
        this.dialogData = data
      },
      getStudentName(id){
        let obj = this.studentList.find(item=>item.id === id)
        return obj.nickName
      },
      changeStatus(){
        this.form.status = this.form.status === 1? 2:1
      }
    }
  };
</script>
