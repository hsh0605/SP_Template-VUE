<template>
  <div>
    <div style="box-shadow: 0 0 10px rgba(0, 0, 0, .1); padding: 10px 20px; border-radius: 5px; margin-bottom: 10px;">
      日安,{{user.name}}大人,祝你有个愉快的一天
    </div>
    <div style="display: flex;">
      <el-card style="width: 100%;" >
        <div slot="header" class="clearfix">
          <span>编辑阶段文字二</span>
        </div>
        <div>
          编辑阶段三
          <div style="margin-top: 20px;">
            <div style="margin: 10px 0;">
              <strong>主题色</strong>

            </div>
            <el-button type="primary">按钮</el-button>
            <el-button type="success">按钮</el-button>
            <el-button type="info">按钮</el-button>
            <el-button type="warning">按钮</el-button>
            <el-button type="danger">按钮</el-button>
          </div>
        </div>
      </el-card>
    </div>
    <div style="display: flex; margin: 15px 0">
      <div style="width: 50%">
        <div style="margin-bottom: 15px">系统公告</div>
        <el-timeline style="padding: 0">
          <el-timeline-item v-for="item in notices" :key="item.id" :timestamp="item.time" placement="top">
            <el-card>
              <h4>{{ item.title}}</h4>
              <p>{{item.content}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "HomeView",
  data(){
    return{
      user:JSON.parse(localStorage.getItem('current-user') || '{}'),
      notices:[]
    }
  },
  created() {
    this.loadNotice()
  },methods:{
    loadNotice(){

      this.$request.get('notice/selectUserData').then(res =>{
        this.notices = res.data
      })
    }
  }
}
</script>


<style scoped>

</style>
