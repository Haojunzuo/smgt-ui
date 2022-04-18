<template>
  <div class="edit-container">
    <!-- 添加任务栏 -->
    <div class="addPanel-position-box">
      <div class="addPanel-container">
        <div class="panel-text-box">
          <i class="iconfont icon-layout"></i>
          <span>面板 / </span>
          <span>{{ layout.length }}</span>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="add-panel-box" @click="addPanelDialog = true">
          <i class="el-icon-circle-plus"></i>
          <span>添加面板</span>
        </div>
        <div class="saveBtn-box">
          <el-button @click="exitEdit">退出编辑</el-button>
          <el-button class="save-btn" @click="saveLayoutData">保存</el-button>
        </div>
      </div>
    </div>
    <!-- 面板对话框 -->
    <el-dialog title="选择面板" :visible.sync="addPanelDialog" width="40%">
      <span>
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group
          v-model="checkPanelItem"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            :disabled="item === '个人信息'"
            v-for="(item, index) in panels"
            :label="item"
            :key="index"
            >{{ item }}</el-checkbox
          >
        </el-checkbox-group>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPanelDialog = false">取 消</el-button>
        <el-button @click="resetPanel">恢复默认设置</el-button>
        <el-button type="primary" @click="getPanelItem">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 自定义布局项 -->
    <grid-layout
      :layout.sync="layout"
      :col-num="24"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="true"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        :static="item.static"
      >
        <person
          v-if="item.name === '个人信息'"
          :editPersonStyle="true"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></person>
        <wait-matter
          v-if="item.name === '待办事项'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></wait-matter>
        <notice
          v-show='false'
          v-if="item.name === '公告栏'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></notice>
        <often-app
          v-if="item.name === '常用应用'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></often-app>
        <document
          v-show='false'
          v-if="item.name === '待办公文'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></document>
        <quick-operation
          v-show='false'
          v-if="item.name === '快捷操作'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></quick-operation>

        <often-apply
          v-if="item.name === '常用流程'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></often-apply>
        <today-work
          v-if="item.name === '我的日程'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></today-work>
        <remind
          v-if="item.name === '督办提醒'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></remind>
        <meeting
          v-if="item.name === '我的会议'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></meeting>
        <my-task
          v-if="item.name === '我的任务'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></my-task>
        <process
          v-if="item.name === '待办流程'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></process>
        <my-document
          v-if="item.name === '督办公文'"
          :id="item.i"
          @deletePanelItemEvent="deletePanelItem"
        ></my-document>
      </grid-item>
    </grid-layout>
  </div>
</template>

<script>
import notice from '@/components/Home/Notice'
import document from '@/components/Home/Document'
import quickOperation from '@/components/Home/quickOperation'
import oftenApp from '@/components/Home/oftenApp'
import oftenApply from '@/components/Home/OftenApply'
import todayWork from '@/components/Home/todayWork'
import VueGridLayout from 'vue-grid-layout'
import Person from '@/components/Home/Person'
import waitMatter from '@/components/Home/WaitMatter'
import Remind from '@/components/Home/Remind'
import Meeting from '@/components/Home/Meeting'
import MyTask from '@/components/Home/MyTask'
import Process from '@/components/Home/Process'
import MyDocument from '@/components/Home/MyDocument'

import { initPanelsLayout } from '@/assets/js/layout'

const layout = Array.from(initPanelsLayout)
const panelOptions = []
for (const attr in initPanelsLayout) {
  panelOptions.push(initPanelsLayout[attr].name)
}

export default {
  data () {
    return {
      initLayout: layout,
      layout,
      checkPanelItem: [],
      defaultCheckPanelItem: [],
      panels: panelOptions,
      addPanelDialog: false,
      checkAll: false,
      isIndeterminate: true
    }
  },
  methods: {
    // 初始化面板项
    initPanel () {
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (layout === null) {
        this.checkPanelItem = panelOptions
        this.layout = initPanelsLayout
      } else {
        this.layout = layout
        for (const attr in this.layout) {
          this.checkPanelItem[attr] = this.layout[attr].name
        }
      }
    },
    // 全选面板选项
    handleCheckAllChange (val) {
      this.checkPanelItem = val ? this.panels : ['个人信息']
      this.isIndeterminate = false
    },
    // 多选面板选项
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.panels.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.panels.length
    },
    // 添加面板
    getPanelItem () {
      const newLayout = []
      const panelName = []
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (layout) {
        for (const attr in layout) {
          this.checkPanelItem.filter(item => {
            if (item === layout[attr].name) {
              newLayout.push(layout[attr])
              panelName.push(layout[attr].name)
            }
          })
        }
        const addPanel = this.checkPanelItem
          .concat(panelName)
          .filter((item, i, arr) => {
            return arr.indexOf(item) === arr.lastIndexOf(item)
          })
        for (const attr in this.initLayout) {
          addPanel.filter(item => {
            if (item === this.initLayout[attr].name) {
              newLayout.push(this.initLayout[attr])
            }
          })
        }
        this.layout = newLayout
      } else {
        console.log(this.checkPanelItem)
        const result = []
        for (const attr in this.initLayout) {
          result.push(this.initLayout[attr].name)
          this.checkPanelItem.filter((item, index) => {
            if (item === this.initLayout[attr].name) {
              newLayout.push(this.initLayout[attr])
            }
          })
        }
        this.layout = newLayout
      }
      this.addPanelDialog = false
    },
    // 恢复默认设置面板
    resetPanel () {
      this.checkPanelItem = this.panels
    },
    // 保存最新面板布局参数
    saveLayoutData () {
      window.sessionStorage.setItem('layout', JSON.stringify(this.layout))
      if (window.sessionStorage.getItem('layout')) {
        this.$message.success({
          message: '保存成功',
          type: 'success',
          duration: 500
        })
        this.$router.push('check')
      }
    },
    // 根据面板id删除面板
    deletePanelItem (panelId) {
      const deleteName = []
      const layout = Array.from(this.layout)
      console.log(this.initLayout)
      for (const attr in layout) {
        if (layout[attr].i === panelId) {
          deleteName.push(layout[attr].name)
          delete layout[attr]
        }
      }
      this.layout = layout.filter(item => {
        if (item !== undefined) {
          return item
        }
      })
      console.log(this.initLayout)
      this.checkPanelItem = this.checkPanelItem
        .concat(deleteName)
        .filter((item, index, Arr) => {
          return Arr.indexOf(item) === Arr.lastIndexOf(item)
        })
    },
    // 退出编辑
    exitEdit () {
      this.$router.push('index')
    }
  },
  created () {
    this.initPanel()
  },
  components: {
    notice,
    document,
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    quickOperation,
    oftenApp,
    oftenApply,
    todayWork,
    Person,
    waitMatter,
    Remind,
    Meeting,
    MyTask,
    Process,
    MyDocument
  }
}
</script>

<style>
.edit-container {
  background-color: #ebeef5;
  background-image: radial-gradient(#ccc 4%, transparent 0);
  background-size: 45px 45px;
}
/* 头部添加面板区域 */
.addPanel-position-box {
  position: sticky;
  top: 0px;
  z-index: 100;
}
.addPanel-container {
  height: 56px;
  display: flex;
  align-items: center;
  font-size: 14px;
  position: relative;
  background: #ebeef5;
}
.el-icon-circle-plus {
  color: #396aff;
  margin-right: 10px;
  cursor: pointer;
}
.saveBtn-box {
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: absolute;
  right: 10px;
}
.save-btn {
  background-color: #396aff !important;
  color: #fff !important;
}
.icon-layout {
  margin-right: 10px;
}
.panel-text-box {
  padding: 5px 10px;
}
.add-panel-box {
  padding: 5px 10px;
  cursor: pointer;
}
.add-panel-box:hover {
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  color: #409eff;
}
/* 自定义布局项 */
.vue-grid-layout {
  width: 100%;
}
/* 多选框 */
.el-checkbox-group {
  display: flex;
  flex-direction: column;
}
.el-checkbox {
  margin-bottom: 10px;
}
</style>
