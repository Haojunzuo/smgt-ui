<template>
  <div class="container" style="background-color: #ebeef5;">
    <!-- 自定义布局项，不可拖拽与不可调整大小 -->
    <grid-layout v-if="role===1"
                 :layout.sync="layout"
                 :col-num="24"
                 :row-height="30"
                 :is-draggable="false"
                 :is-resizable="false"
                 :is-mirrored="false"
                 :vertical-compact="true"
                 :margin="[10, 10]"
                 :use-css-transforms="true"
    >
      <div v-if="role===1">
        <grid-item
          v-for="item in layout"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <notice v-if="item.name === '公告栏'" :panelSetIcon="true">
          </notice>
          <quick-operation
            v-if="item.name === '快捷操作'"
            :panelSetIcon="true"
            :role="role"
          ></quick-operation>
          <often-app
            v-if="item.name === '常用应用'"
            :panelSetIcon="true"
          ></often-app>
          <today-work
            v-if="item.name === '我的日程'"
            :panelSetIcon="true"
          ></today-work>
          <person
            v-if="item.name === '个人信息'"
            :panelSetIcon="true"
            @editDesktopEvent="editDesktop"
          ></person>
          <wait-matter
            v-if="item.name === '待办事项'"
            :panelSetIcon="true"
          ></wait-matter>
          <remind v-if="item.name === '督办提醒'" :panelSetIcon="true"></remind>
          <my-task v-if="item.name === '我的任务'" :panelSetIcon="true"></my-task>
        </grid-item>
      </div>
    </grid-layout>

    <grid-layout v-else
                 :layout.sync="layout2"
                 :col-num="24"
                 :row-height="30"
                 :is-draggable="false"
                 :is-resizable="false"
                 :is-mirrored="false"
                 :vertical-compact="true"
                 :margin="[10, 10]"
                 :use-css-transforms="true"
    >
      <div v-if="role===2 || role===3">
        <grid-item
          v-for="item in layout2"
          :x="item.x"
          :y="item.y"
          :w="item.w"
          :h="item.h"
          :i="item.i"
          :key="item.i"
        >
          <notice v-if="item.name === '公告栏'" :panelSetIcon="true">
          </notice>
          <quick-operation
            v-if="item.name === '快捷操作'"
            :panelSetIcon="true"
            :role="role"
          ></quick-operation>
          <today-work
            v-if="item.name === '我的日程'"
            :panelSetIcon="true"
          ></today-work>
          <person
            v-if="item.name === '个人信息'"
            :panelSetIcon="true"
            @editDesktopEvent="editDesktop"
          ></person>
          <wait-matter
            v-if="item.name === '待办事项'"
            :panelSetIcon="true"
          ></wait-matter>
          <remind v-if="item.name === '督办提醒'" :panelSetIcon="true"></remind>
          <my-task v-if="item.name === '我的任务'" :panelSetIcon="true"></my-task>
        </grid-item>
      </div>
    </grid-layout>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import notice from '@/components/Home/Notice'
import document from '@/components/Home/Document'
import quickOperation from '@/components/Home/quickOperation'
import oftenApp from '@/components/Home/oftenApp'
import oftenApply from '@/components/Home/OftenApply'
import todayWork from '@/components/Home/todayWork'
import Person from '@/components/Home/Person'
import waitMatter from '@/components/Home/WaitMatter'
import Remind from '@/components/Home/Remind'
import Meeting from '@/components/Home/Meeting'
import MyTask from '@/components/Home/MyTask'
import Process from '@/components/Home/Process'
import MyDocument from '@/components/Home/MyDocument'

import { initPanelsLayout } from '@/assets/js/layout'
import { getInfo } from '@/api/login'

const panelOptions = []
for (const attr in initPanelsLayout) {
  panelOptions.push(initPanelsLayout[attr].name)
}
export default {
  data() {
    return {
      layout: initPanelsLayout,
      panels: panelOptions,
      role: 1,
      layout1: [
        { x: 0, y: 0, w: 5, h: 5, i: 8, name: '个人信息', static: true },
        { x: 5, y: 10, w: 12, h: 10, i: 0, name: '公告栏' },
        { x: 0, y: 8, w: 17, h: 13, i: 1, name: '常用应用' },
        { x: 17, y: 8, w: 7, h: 13, i: 6, name: '我的日程' },
        { x: 17, y: 21, w: 7, h: 10, i: 11, name: '我的任务' },
        { x: 17, y: 0, w: 7, h: 5, i: 2, name: '督办提醒' },
        { x: 5, y: 0, w: 12, h: 5, i: 9, name: '待办事项' },
        { x: 0, y: 15, w: 1.5, h: 10, i: 7, name: '快捷操作' }
      ],
      layout2: [
        { x: 0, y: 0, w: 5, h: 6, i: 8, name: '个人信息', static: true },
        { x: 5, y: 6, w: 12, h: 11, i: 0, name: '公告栏' },
        { x: 17, y: 6, w: 7, h: 11, i: 6, name: '我的日程' },
        { x: 17, y: 0, w: 7, h: 6, i: 2, name: '督办提醒' },
        { x: 5, y: 0, w: 12, h: 6, i: 9, name: '待办事项' },
        { x: 0, y: 6, w: 1.55, h: 11, i: 7, name: '快捷操作' }
      ],
      layout3: [
        { x: 0, y: 0, w: 5, h: 5, i: 8, name: '个人信息', static: true },
        { x: 5, y: 10, w: 12, h: 10, i: 0, name: '公告栏' },
        { x: 0, y: 8, w: 17, h: 13, i: 1, name: '常用应用' },
        { x: 17, y: 8, w: 7, h: 13, i: 6, name: '我的日程' },
        { x: 17, y: 21, w: 7, h: 10, i: 11, name: '我的任务' },
        { x: 17, y: 0, w: 7, h: 5, i: 2, name: '督办提醒' },
        { x: 5, y: 0, w: 12, h: 5, i: 9, name: '待办事项' },
        { x: 0, y: 15, w: 1.5, h: 10, i: 7, name: '快捷操作' }
      ]
    }
  },
  methods: {
    // 初始化面板项
    initPanel() {
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (!layout) {
        this.checkPanelItem = this.panels
      }
    },
    // 页面加载完成，获取最新面板
    getNewPanels() {
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (layout) {
        this.layout = layout
      }
    },
    // 编辑界面跳转
    editDesktop() {
      this.$router.push('edit')
    }
  },
  created() {
    this.getNewPanels()
    this.initPanel()
    getInfo().then(res => {
      console.log('check res:', res)
      this.role = res.user.role
      console.log('role:', this.role)
    })
  },
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    notice,
    document,
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
</style>
