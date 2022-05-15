<template>
  <div class="container" style="background-color: #ebeef5;">
    <!-- 自定义布局项，不可拖拽与不可调整大小 -->
    <grid-layout
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
      <grid-item
        v-for="item in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
      >
        <notice v-if="item.name === '公告栏'" :panelSetIcon="true"></notice>
        <quick-operation
          v-if="item.name === '快捷操作'"
          :panelSetIcon="true"
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

const panelOptions = []
for (const attr in initPanelsLayout) {
  panelOptions.push(initPanelsLayout[attr].name)
}
export default {
  data () {
    return {
      layout: initPanelsLayout,
      panels: panelOptions
    }
  },
  methods: {
    // 初始化面板项
    initPanel () {
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (!layout) {
        this.checkPanelItem = this.panels
      }
    },
    // 页面加载完成，获取最新面板
    getNewPanels () {
      const layout = JSON.parse(window.sessionStorage.getItem('layout'))
      if (layout) {
        this.layout = layout
      }
    },
    // 编辑界面跳转
    editDesktop () {
      this.$router.push('edit')
    }
  },
  created () {
    this.getNewPanels()
    this.initPanel()
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
