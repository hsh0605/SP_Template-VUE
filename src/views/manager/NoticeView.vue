<template>
<div>
  <div>
    <el-input style="width: 200px" placeholder="查询标题" v-model="title"></el-input>
    <el-button type="primary" @click="load(1)">查询</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </div>
  <div style="margin: 10px 0">
    <el-button type="primary" plain @click="handleAdd">新增</el-button>
    <el-button type="danger" plain @click="delBatch">批量删除</el-button>
<!--    <el-button type="info" plain @click="exportData">批量导出</el-button>-->
<!--    <el-upload action="http://localhost:8080/notice/import" :headers="{token: road.token}" :on-success="handleImport" style="display: inline-block; margin-left: 10px" :show-file-list="false">-->
<!--      <el-button type="primary" plain @click="importData">批量导入</el-button>-->
<!--    </el-upload>-->
  </div>
  <el-table :data="tableData" stripe :header-cell-style="{ backgroundColor: 'aliceblue', color:'#666'}" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="70" align="center"></el-table-column><!-- 多选框-->
    <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
    <el-table-column prop="title" label="标题" align="center"></el-table-column>
    <el-table-column prop="content" label="内容" align="center" show-overflow-tooltip></el-table-column>
    <el-table-column prop="userid" label="发布人ID" align="center"></el-table-column>
    <el-table-column prop="time" label="发布时间" align="center"></el-table-column>
    <el-table-column  label="是否公开" align="center">
      <template v-slot="scope">
        <el-switch v-model="scope.row.open" @change="changeOpen(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="180">
      <template v-slot="scope">
        <el-button type="primary" size="mini" plain @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="mini" plain @click="del(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div style="margin: 10px 0">
    <el-pagination
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="total">
    </el-pagination>
  </div>

  <el-dialog title="公告信息" :visible.sync="fromVisible" width="40%" :close-on-click-modal="false">
    <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">

      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="标题"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="description">
        <el-input type="textarea" v-model="form.content" placeholder="简介"></el-input>
      </el-form-item>

<!--      <el-form-item label="发布人ID" prop="authorid">-->
<!--        <el-input v-model="form.authorid" placeholder="内容"></el-input>-->
<!--      </el-form-item>-->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="fromVisible = false">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </div>
  </el-dialog>




</div>
</template>
<script>
export default {
  name: "NoticeView",
  data(){
    return{
      tableData:[], //所有数据
      pageNum:1, //当前页码
      pageSize:5, //每页显示个数
      username:'',
      title:'',
      total:0,
      fromVisible: false,
      form:{},
      user: JSON.parse(localStorage.getItem('current-user') || '{}'),
      rules:{
        title:[{
          required: true , message: '请输入标题', trigger: 'blur'
        },],
        content:[{
          required: true , message: '请输入内容', trigger: 'blur'
        },]
      },
      ids:[],
      content:'',
    }
  },
  created() {
    this.load()
  },
  methods:{
    // handleImport(res){
    //   if (res.code === '200') {
    //     this.$message.success("操作成功")
    //     this.load(1)
    //   } else {
    //     this.$message.error(res.msg)
    //   }
    // },
    // exportData(){ //批量导出数据
    //   if(!this.ids.length){ //没有选择行的时候,全部导出,或者根据我的搜索条件导出
    //     window.open('http://localhost:8080/notice/export?token='+this.road.token)
    //   }
    // },

    changeOpen(form){
      //调用更新接口到数据库
      this.form = JSON.parse(JSON.stringify(form))
      this.sendSaveRequest()//直接发请求
    },

    delBatch(){
      if (!this.ids.length){
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确认批量删除吗？', '确认删除', {type: "warning"}).then(() => {
        this.$request.delete('/notice/delete/batch', {data : this.ids}).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('删除成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {})
    },
    handleSelectionChange(rows){  //当前选择的所有行数据

      this.ids = rows.map(v => v.id)

    },
    del(id) {
      this.$confirm('您确认删除吗？', '确认删除', {type: "warning"}).then(() => {
        this.$request.delete('/notice/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('删除成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {})
    },
    handleEdit(row){ //编辑数据
      this.form = JSON.parse(JSON.stringify(row)) //给form对象赋值 注意要深拷贝数据
      this.fromVisible = true //打开视窗

    },

    handleAdd(){ //新增数据
      this.form = {} //新增数据的时候清空数据 默认身份用户
      this.fromVisible = true //打开视窗

    },
    save(){ //保持按钮触发的逻辑 它会触发新增或者更新
      this.$refs.formRef.validate((valid)=>{
        if (valid) {
          this.sendSaveRequest()


        }
      })
    },
    sendSaveRequest(){
      this.$request({
        url:this.form.id ? '/notice/update' : '/notice/add',
        method:this.form.id ? 'PUT': 'POST',
        data:this.form
      }).then(res => {
        if (res.code === '200'){ //表示成功
          this.$message.success('保存成功')
          this.load(1)
          this.fromVisible = false
        }else {
          this.$message.error(res.msg)//弹出错误
        }
      })
    },
    reset(){ //重置
      this.title = ''
      // this.roadname = ''
      this.load()
    },
    load(pageNum){ //分页查询
      if (pageNum){
        this.pageNum = pageNum
      }
      this.$request.get('/notice/selectByPage', {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          title:this.title
        }
      }).then(res => {
        this.tableData = res.data.list
        this.total = res.data.total
          }
      )
    },
    handleCurrentChange(pageNum){
      //this.pageNum = pageNum
      this.load(pageNum)
    },
  },
}
</script>


<style>
.el-tooltip__popper{max-width: 200px !important;}
</style>
