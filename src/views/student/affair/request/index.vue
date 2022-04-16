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
      <el-form-item>
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
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="toRequestList" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="申请时间" align="center" prop="type" sortable>
        <template slot-scope="scope">
          <span>{{scope.row.requestTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="交通方式" align="center">
        <template slot-scope="scope">
          <span>{{toTypeString(scope.row.toType) + '-' +scope.row.toNum}}</span>
        </template>
      </el-table-column>
      <el-table-column label="预计到校时间" align="center" prop="startTime">
        <template slot-scope="scope">
          <span>{{scope.row.toTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="出发地" align="center" prop="location">
        <template slot-scope="scope">
          <span>{{getCodeToText(scope.row.location)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="审批状态" align="center" prop="status" >
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-loading" v-if="scope.row.status === '1'" size="medium" plain @click="getDialogData(scope.row)">审批中</el-button>
          <el-button type="warning" icon="el-icon-thumb" v-else-if="scope.row.status === '2'" size="medium" plain @click="getDialogData(scope.row)">待确认</el-button>
          <el-button type="success" icon="el-icon-medal" v-else-if="scope.row.status === '3' && scope.row.resultType === '1'" size="medium" plain @click="getDialogData(scope.row)">已通过</el-button>
          <el-button type="danger" icon="el-icon-warning" v-else size="medium" plain @click="getDialogData(scope.row)">已拒绝</el-button>
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
            v-if="scope.row.status === '1'"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.status === '1'"
          >删除</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-view"
            @click="getDialogData(scope.row)"
            v-if="scope.row.status !== '1'"
          >详情</el-button>
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
          <el-tab-pane label="进校申请" name="basic">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="申请人: ">
                    王炳哲
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="学号: ">
                    2018201932
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="所在学院: " >
                    计算机科学与技术学院
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="联系电话:" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入联系方式"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="交通方式:" prop="toType">
                    <el-radio-group v-model="form.toType">
                      <el-radio :label="1">飞机</el-radio>
                      <el-radio :label="2">高铁</el-radio>
                      <el-radio :label="3">火车</el-radio>
                      <el-radio :label="4">私家车</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item  prop="toNum">
                    <el-input v-model="form.toNum" placeholder="请输入班次信息"/>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="预计到达时间:" prop="toTime">
                    <el-date-picker
                      v-model="form.toTime"
                      type="datetime"
                      clearable
                      style="width: 100%"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      placeholder="选择预计到达时间"
                    >
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="出发地:" prop="location">
                    <el-cascader
                      size="large"
                      :options="options"
                      v-model="selectedOptions"
                      style="width: 100%"
                      clearable
                      placeholder="选择出发地"
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
                  <el-form-item label="详细行程:" prop="toDetail">
                    <el-input
                      type="textarea"
                      :rows="3"
                      placeholder="请填写详细行程信息"
                      v-model="form.toDetail">
                    </el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="附件" name="other">
            <el-form :model="form"  label-width="80px">
              <el-form-item label="图片:">
                <imageUpload :value="form.imgFile" :data="data" @input="changeImgFile($event)"/>
              </el-form-item>
              <el-form-item label="文件:">
                <fileUpload :value="form.textFile" :data="data" @input="changeTextFile($event)"/>
              </el-form-item>
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
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            申请时间
          </template>
          {{dialogData.requestTime}}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label" >
            <i class="el-icon-office-building"></i>
            出发地
          </template>
          {{getCodeToText(dialogData.location)+'-'+dialogData.detailLocation}}
        </el-descriptions-item>
        <el-descriptions-item>
          <template slot="label" >
            <i class="el-icon-location-outline"></i>
            交通方式
          </template>
          {{toTypeString(dialogData.toType) + '-' +dialogData.toNum}}
        </el-descriptions-item>
        <el-descriptions-item span="2">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            预计到校时间
          </template>
          {{dialogData.toTime}}
        </el-descriptions-item>
        <el-descriptions-item span="3">
          <template slot="label">
            <i class="el-icon-location-outline"></i>
            行程详细信息
          </template>
          {{dialogData.toDetail}}
        </el-descriptions-item>
      </el-descriptions>
<!--      <div style="margin: 20px 0" v-if="dialogData.imgFile!=='' && dialogData.imgFile!==null">-->
<!--        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">上传图片</div>-->
<!--        <el-upload-->
<!--          list-type="picture-card"-->
<!--          :file-list="getFile(dialogData.imgFile)"-->
<!--          action=""-->
<!--          :show-file-list="true"-->
<!--        />-->
<!--      </div>-->
<!--      <div style="margin: 20px 0" v-if="dialogData.textFile!=='' && dialogData.textFile!==null">-->
<!--        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">上传文件</div>-->

<!--      </div>-->
      <div style="margin: 20px 0">
        <div style="font-size: 16px;font-weight: bold;padding-bottom: 20px">审批状态</div>
        <el-steps :space="600" :active="getActive(dialogData.status)" finish-status="success" :align-center="true" :process-status="'finish'" simple>
          <el-step title="提交信息"></el-step>
          <el-step title="待审批"></el-step>
          <el-step title="待确定"></el-step>
          <el-step title="审批完成"></el-step>
        </el-steps>
      </div>
      <el-descriptions  title="审批结果" :column="3" :size="'medium'" border class="margin-top" v-if="dialogData.status!=='1'">
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
              <el-button type="primary" icon="el-icon-thumb" v-if="dialogData.status === '2'" @click="updateToRequestStatus(dialogData)">确认</el-button>
              <el-button type="success" icon="el-icon-medal" v-if="dialogData.status === '3' && dialogData.resultType === '1'">通过</el-button>
              <el-button type="danger" icon="el-icon-warning" v-if="dialogData.status === '3' && dialogData.resultType === '2'">拒绝</el-button>
            </div>
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

  </div>
</template>

<script>
  import { listToRequest, getToRequest, delToRequest, addToRequest, updateToRequest, updateToRequestStatus } from "@/api/student/toRequest";
  import {regionData, CodeToText} from "element-china-area-data";
  import {getName} from "@/api/file";
  export default {
    name: "request",
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
        toRequestList: [],
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
          toType: [
            { required: true, message: '请选择交通方式'}
          ],
          toNum: [
            { required: true, message: '请填写班次'}
          ],
          toTime: [
            { required: true, message: '请选择预计到达时间'}
          ],
          location: [
            { required: true, message: '请选择出发地'}
          ],
          detailLocation: [
            { required: true, message: '请填写详细地址'}
          ],
          toDetail: [
            { required: true, message: '请填写详细行程信息'}
          ],
        },
        show:false,
        windowWidth: document.documentElement.clientWidth,  //实时屏幕宽度
        windowHeight: document.documentElement.clientHeight,   //实时屏幕高度
        activeName: 'basic',
        options: regionData,
        toTypeList: ['','飞机','高铁','火车','私家车'],
        statusOptions: [
          {label:'审批中',value:'1'},
          {label:'待确认',value:'2'},
          {label:'审批完成',value:'3'}
        ],
        dialogTableVisible: false,
        dialogData: {},
        data: {
          bucket: 'student'
        },
        headUrl: "http://150.158.10.136:9000/"
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
        listToRequest(this.queryParams).then(response => {
          console.log(response)
          this.toRequestList = response.rows;
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
          toType: null,
          toNum: null,
          requestTime: null,
          toTime: null,
          location: null,
          detailLocation: null,
          toDetail: null,
          status: null,
          userId: null,
          file: null,
          resultType: null,
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
          resultType: null,
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
        getToRequest(id).then(response => {
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
              updateToRequest(this.form).then(response => {
                this.msgSuccess("修改成功");
                this.open = false;
                this.show = false;
                this.getList();
              });
            } else {
              this.form.status = '1'
              addToRequest(this.form).then(response => {
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
          return delToRequest(ids);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleHid(){
        this.show = false
        this.open = false
      },
      toTypeString (data) {
        return this.toTypeList[data]
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
        console.log(data)
        this.dialogTableVisible = true
        this.dialogData = data
      },
      changeImgFile(fileData){
        this.form.imgFile = fileData
      },
      changeTextFile(fileData){
        this.form.textFile = fileData
      },
      getActive(status){
        if(status === '1') return 1
        else if(status === '2') return 2
        else return 4
      },
      tableRowClassName({row, rowIndex}){
        if(row.status === '1'){
        }else if(row.status === '2'){
          return 'warning-row'
        }else if(row.status === '3' && row.resultType === '1'){
          return 'success-row'
        }else {
          return 'error-row'
        }
      },
      updateToRequestStatus(data){
        updateToRequestStatus(data.id,'3').then(res=>{
          this.msgSuccess('确认成功')
          this.dialogTableVisible = false
          this.getList()
        }).catch(error=>{
          console.log(error)
        })
      }
      // getFile(file){
      //   console.log(file)
      //   // 首先将值转为数组
      //   const list = Array.isArray(file) ? file : file.split(',');
      //   let fileList = []
      //   for(let i=0;i<list.length;i++){
      //     getName({bucketName:this.data.bucket,fileName:list[i]}).then(res=>{
      //       let item = {name: res.data.description, url: this.headUrl+this.data.bucket+"/"+list[i], id: list[i]}
      //       fileList.push(item)
      //       console.log(fileList)
      //     })
      //     if(i === list.length-1){
      //       return fileList
      //     }
      //   }
      //
      // }
    }
  };
</script>


<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #bef1a1;
  }

  .el-table .error-row {
    background: #efb4b4;
  }
</style>
