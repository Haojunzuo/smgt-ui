<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px" class="queryClassTable" @submit.native.prevent>
      <el-form-item label="公告标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入公告标题"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="success"
              plain
              icon="el-icon-refresh"
              size="mini" @click="getNoticeList"
            >查询
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
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除
            </el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="noticeList"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="公告编号" align="center" prop="id"/>
      <el-table-column label="公告类型" align="center" prop="noticetype">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'type') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公告标题" align="center" prop="title"/>
      <el-table-column label="发布单位" align="center" prop="institution">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'institution') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发布人" align="center" prop="user.nickName"/>
      <el-table-column label="发布时间" align="center" prop="noticetime"/>
      <el-table-column label="紧急程度" align="center" prop="urgency">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'urgency') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <span>{{ showModel(scope.row, 'status') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==='0'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="publish(scope.row)"
          >发布
          </el-button>
          <el-button
            v-if="scope.row.status==='1'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleCheck(scope.row)"
          >查看
          </el-button>
          <el-button
            v-if="scope.row.status==='0'"
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改
          </el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
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
      @pagination="getNoticeList"
    />

    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题"/>
        </el-form-item>
        <el-form-item label="公告类型" prop="noticetype">
          <el-select v-model="form.noticetype" filterable placeholder="请选择">
            <el-option
              v-for="(key,value) in typeMap"
              :key="value"
              :label="key"
              :value="value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布单位" prop="institution">
          <el-select v-model="form.institution" filterable placeholder="请选择">
            <el-option
              v-for="(key,value) in institutionMap"
              :key="value"
              :label="key"
              :value="value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="公告内容" prop="content">
<!--          <el-input type="textarea" v-model="form.content" :autosize="{minRows:9, maxRows:18}" placeholder="请输入公告内容"/>-->
          <mavon-editor v-model="form.content"/>
        </el-form-item>
        <el-form-item label="是否紧急">
          <el-radio-group v-model="form.urgency">
            <el-radio :label="'0'">一般</el-radio>
            <el-radio :label="'1'">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="submitForm">保存</el-button>
        <el-button type="primary" @click="createAndPublish">发布</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listNotice, addNotice, delNotice, updateNotice, getNotice } from '@/api/admin/notice/notice'
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: 'SubSystem',
  components:{
    mavonEditor
  },
  data() {
    return {
      total:0,
      rules: {
        title: [
          {
            required: true,
            message: "标题不能为空",
            trigger: "blur",
          }
        ],
        content:[
          {
            required:true,
            message:"内容不能为空",
            trigger:"blu",
          }
        ]
      },
      form: {

      },
      title: '新增公告',
      open: false,
      typeMap: { '0': '考务信息', '1': '教学安排', '2': '事务公示' ,'3': '勤工助学'},
      urgencyMap: { '0': '一般', '1': '紧急' },
      statusMap: { '0': '草稿', '1': '已发布' },
      institutionMap: { '0': '教务办', '1': '学工办', '2': '党委' },
      loading: false,
      noticeList: [],
      multiple: true,
      ids:[],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null
      }
    }
  },
  created() {
    this.getNoticeList()
  },
  watch: {},

  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },

    publish(row){
      this.$confirm('是否发布编号为' + row.id + '的公告?', '警告', {
        confirmButtonClass: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        row.status = '1'
        return updateNotice(row)
      }).then(() => {
        this.getNoticeList()
        this.msgSuccess('发布成功')
      }).catch(() => {
      })
    },
    createAndPublish(){
      this.form.status = '1';
      this.submitForm();
    },
    submitForm() {
      this.$refs["form"].validate(valid=>{
        if (valid){
          if (this.form.id!=null){
            updateNotice(this.form).then(response=>{
              this.msgSuccess("修改成功");
              this.open = false;
              this.getNoticeList();
            })
          }else{
            // this.form.noticepublisher = store.geter
            addNotice(this.form).then(response=>{
              if (this.form.status==='0'){
                this.msgSuccess("已保存为草稿");
              }else {
                this.msgSuccess("已成功发布");
              }
              console.log(response)
              this.open = false;
              this.getNoticeList();
            })
          }
        }
      })

    },
    cancel() {
      this.reset();
      this.open = false;
    },
    handleQuery(){
      this.queryParams.pageNum = 1;
      this.getNoticeList();
    },
    getNoticeList() {
      this.loading = true;
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows
        this.total = response.total;
        this.loading = false;
        console.log(response)
        console.log(this.noticeList)
      })
    },
    showModel(row, str) {
      if (str === 'type') {
        return this.typeMap[row.noticetype]
      } else if (str === 'urgency') {
        return this.urgencyMap[row.urgency]
      } else if (str === 'status') {
        return this.statusMap[row.status]
      } else if (str === 'institution') {
        return this.institutionMap[row.institution]
      }
    },

    handleAdd() {
      const noticeId = -1
      this.$router.push({
        path:"/noticeEdit/"+noticeId,
        query:{
          check:'0'
        }
      })
      this.reset()
      this.open = true
    },

    handleUpdate(row) {
      const noticeId = row.id
      this.$router.push({
        path:"/noticeEdit/"+noticeId,
        query:{
          check:'0'
        }
      })
    },

    handleCheck(row) {
      const noticeId = row.id
      this.$router.push({
        path:"/noticeEdit/"+noticeId,
        query:{
          check:'1'
        }
      })
    },

    handleDelete(row) {
      const id = row.id || this.ids
      this.$confirm('是否确定编号为' + id + '的数据项?', '警告', {
        confirmButtonClass: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        return delNotice(id)
      }).then(() => {
        this.getNoticeList()
        this.msgSuccess('删除成功')
      }).catch(() => {
      })
    },

    reset() {
      this.form = {
        id: null,
        noticeno: null,
        title: null,
        content: null,
        publisher: null,
        noticetime: null,
        noticetype: '0',
        file: null,
        urgency: '0',
        status: '0',
        institution: '0'

      }
      this.resetForm('form')
    }
  }
}
</script>
<style>
.dialog-footer {
  align-items: center;
  align-content: center;
}
</style>
