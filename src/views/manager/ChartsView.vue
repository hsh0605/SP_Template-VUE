<template>
<div><!--el-row,el-col分层分区-->
  <el-row :gutter="10">
    <el-col :span="12">
      <el-card>
        <div style="width: 100%;height: 400px" id="line">

        </div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card></el-card>
    </el-col>
  </el-row>
</div>
</template>
<script>
export default {
  name:"ChartsView",
  data(){
    return{}
  },
  created() {
  },
  methods:{

  }
}

</script>
<style scoped>

</style>