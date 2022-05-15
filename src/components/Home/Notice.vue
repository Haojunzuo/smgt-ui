<template>
  <el-card>
    <!-- 标题 -->
    <div slot="header">
      <span class="el-card-title">公告栏</span>
      <i
        v-show="!isPanelSetIcon"
        class="el-icon-close"
        style="float: right; padding: 3px 0"
        @click="deletePanelItem"
      ></i>
      <i
        v-show="isPanelSetIcon"
        class="iconfont icon-caret-right"
        style="float: right; padding: 3px 0"
      ></i>
    </div>
    <!-- 标签栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">

      <el-tab-pane class="notice-all-box" label="全部" name="first">
        <div class="all-box-1">
          <img src="@/assets/images/heu.png" alt="" style="height: 250px; width: 140px"/>
        </div>
        <!-- 内容列表 -->
        <div class="all-box-2">
          <div class="all-box-2-item" v-for="item in noticeList">
            <span class="title-item" @click="handleCheck(item)"
            >【{{ showModel(item, 'type') }}】{{ item.title }}</span>
            <span class="name-item">{{ item.user.nickName }}</span>
            <span class="time-item">{{ item.noticetime }}</span>
          </div>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[5]"
            @pagination="getNoticeList"
          />
        </div>
      </el-tab-pane>


      <el-tab-pane label="考务信息" name="second">
<!--        <div class="all-box-1">-->
<!--          <img src="@/assets/images/heu.png" alt="" style="height: 250px; width: 140px"/>-->
<!--        </div>-->
        <!-- 内容列表 -->
        <div class="all-box-2">


          <div class="all-box-2-item" v-for="item in noticeList1">
            <span class="title-item" @click="handleCheck(item)"
            >【{{ showModel(item, 'type') }}】{{ item.title }}</span>
            <span class="name-item">{{ item.user.nickName }}</span>
            <span class="time-item">{{ item.noticetime }}</span>
          </div>

          <pagination
            v-show="total>0"
            :total="total1"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[5]"
            @pagination="getNoticeList1"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="通知公告" name="third">
<!--        <div class="all-box-1">-->
<!--          <img src="@/assets/images/heu.png" alt="" style="height: 250px; width: 140px"/>-->
<!--        </div>-->
        <!-- 内容列表 -->
        <div class="all-box-2">


          <div class="all-box-2-item" v-for="item in noticeList2">
            <span class="title-item" @click="handleCheck(item)"
            >【{{ showModel(item, 'type') }}】{{ item.title }}</span>
            <span class="name-item">{{ item.user.nickName }}</span>
            <span class="time-item">{{ item.noticetime }}</span>
          </div>

          <pagination
            v-show="total>0"
            :total="total2"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[5]"
            @pagination="getNoticeList2"
          />
        </div>
      </el-tab-pane>

      <el-tab-pane label="教学安排" name="forth">
        <!--        <div class="all-box-1">-->
        <!--          <img src="@/assets/images/heu.png" alt="" style="height: 250px; width: 140px"/>-->
        <!--        </div>-->
        <!-- 内容列表 -->
        <div class="all-box-2">


          <div class="all-box-2-item" v-for="item in noticeList3">
            <span class="title-item" @click="handleCheck(item)"
            >【{{ showModel(item, 'type') }}】{{ item.title }}</span>
            <span class="name-item">{{ item.user.nickName }}</span>
            <span class="time-item">{{ item.noticetime }}</span>
          </div>

          <pagination
            v-show="total>0"
            :total="total3"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            :page-sizes="[5]"
            @pagination="getNoticeList3"
          />
        </div>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { mavonEditor } from 'mavon-editor'
import { addNotice, delNotice, listNotice, updateNotice } from '@/api/admin/notice/notice'
import { listUser } from '@/api/user'

export default {
  props: ['id', 'panelSetIcon'],
  name: 'SubSystem',
  components: {
    mavonEditor
  },
  data() {
    return {
      panelId: this.id,
      activeName: 'first',
      isPanelSetIcon: this.panelSetIcon,
      total: 0,
      rules: {
        title: [
          {
            required: true,
            message: '标题不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '内容不能为空',
            trigger: 'blu'
          }
        ]
      },
      form: {},
      title: '新增公告',
      open: false,
      typeMap: { '0': '考务信息', '1': '教学安排', '2': '事务公示', '3': '勤工助学' },
      urgencyMap: { '0': '一般', '1': '紧急' },
      statusMap: { '0': '草稿', '1': '已发布' },
      institutionMap: { '0': '教务办', '1': '学工办', '2': '党委' },
      loading: false,
      noticeList: [],
      noticeList1: [],
      noticeList2: [],
      noticeList3: [],
      total1: 0,
      total2: 0,
      total3: 0,
      multiple: true,
      ids: [],
      queryParams: {
        pageNum: 1,
        pageSize: 5,
        title: null,
        noticetype: null
      }
    }
  },
  created() {
    this.getNoticeList()
    this.getNoticeList1()
    this.getNoticeList2()
    this.getNoticeList3()
  },
  watch: {},

  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 删除面板项
    deletePanelItem() {
      this.$emit('deletePanelItemEvent', this.panelId)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },

    publish(row) {
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
    createAndPublish() {
      this.form.status = '1'
      this.submitForm()
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateNotice(this.form).then(response => {
              this.msgSuccess('修改成功')
              this.open = false
              this.getNoticeList()
            })
          } else {
            // this.form.noticepublisher = store.geter
            addNotice(this.form).then(response => {
              if (this.form.status === '0') {
                this.msgSuccess('已保存为草稿')
              } else {
                this.msgSuccess('已成功发布')
              }
              console.log(response)
              this.open = false
              this.getNoticeList()
            })
          }
        }
      })

    },
    cancel() {
      this.reset()
      this.open = false
    },
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getNoticeList()
    },
    getNoticeList() {
      this.loading = true
      listNotice(this.queryParams).then(response => {
        this.noticeList = response.rows
        this.total = response.total
        this.loading = false
        console.log(response)
        console.log(this.noticeList)
      })
    },
    getNoticeList1() {
      this.loading = true
      this.queryParams.noticetype = '0'
      listNotice(this.queryParams).then(response => {
        this.noticeList1 = response.rows
        this.total1 = response.total
        this.loading = false
        console.log(response)
        console.log(this.noticeList)
      })
    },
    getNoticeList2() {
      this.loading = true
      this.queryParams.noticetype = '2'
      listNotice(this.queryParams).then(response => {
        this.noticeList2 = response.rows
        this.total2 = response.total
        this.loading = false
        console.log(response)
        console.log(this.noticeList)
      })
    },
    getNoticeList3() {
      this.loading = true
      this.queryParams.noticetype = '1'
      listNotice(this.queryParams).then(response => {
        this.noticeList3 = response.rows
        this.total3 = response.total
        this.loading = false
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
        path: '/noticeEdit/' + noticeId,
        query: {
          check: '0'
        }
      })
      this.reset()
      this.open = true
    },

    handleUpdate(row) {
      const noticeId = row.id
      this.$router.push({
        path: '/noticeEdit/' + noticeId,
        query: {
          check: '0'
        }
      })
    },

    handleCheck(row) {
      const noticeId = row.id
      this.$router.push({
        path: '/noticeEdit/' + noticeId,
        query: {
          check: '1'
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
.el-card {
  height: 100%;
}

.el-icon-close {
  font-size: 1.2em;
  cursor: pointer;
}

.el-card-title {
  font-weight: bold;
}

.notice-all-box {
  display: flex;
}

.all-box-1 {
  flex: 0 0 25%;
}

.all-box-1 img {
  width: 100%;
  height: 150px;
}

.all-box-2 {
  flex: 1;
  font-size: 14px;
  margin-left: 5px;
}

.all-box-2 .all-box-2-item {
  display: grid;
  grid-template-columns: 4fr 1fr 2fr;
  height: 40px;
  line-height: 40px;
  cursor: pointer;
}

.all-box-2-item .name-item {
  text-align: center;
}

.all-box-2-item .title-item,
.time-item,
.name-item {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
