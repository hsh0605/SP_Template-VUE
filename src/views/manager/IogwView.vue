<template>
<div>
  <div>
    <el-input style="width: 200px" placeholder="查询洒水时间" v-model="optime"></el-input>
    <el-button type="primary" @click="load(1)">查询</el-button>
    <el-button type="info" @click="reset">重置</el-button>
  </div>
  <div style="margin: 10px 0">
    <el-button type="primary" plain @click="handleAdd">新增</el-button>
    <el-button type="danger" plain @click="delBatch">批量删除</el-button>
    <el-button type="info" plain @click="exportData">批量导出</el-button>
    <el-upload action="http://localhost:8080/iogw/import" :headers="{token: user.token}" :on-success="handleImport" style="display: inline-block; margin-left: 10px" :show-file-list="false">
      <el-button type="primary" plain @click="importData">批量导入</el-button>
    </el-upload>
  </div>
  <el-table :data="tableData" stripe :header-cell-style="{ backgroundColor: 'aliceblue', color:'#666'}" @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="70" align="center"></el-table-column><!-- 多选框-->
    <el-table-column prop="id" label="序号" width="55" align="center"></el-table-column>
    <el-table-column prop="optime" label="洒水日期" align="center"></el-table-column>
    <el-table-column prop="forwv" label="绿化洒水车次" align="center"></el-table-column>
    <el-table-column prop="aowufgs" label="绿化洒水量" align="center"></el-table-column>
    <el-table-column prop="nopd" label="出动人次" align="center"></el-table-column>
    <el-table-column prop="authorid" label="发布人ID" align="center"></el-table-column>
    <el-table-column prop="time" label="发布时间" align="center"></el-table-column>
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

  <el-dialog title="绿化修建" :visible.sync="fromVisible" width="60%" @close="closeDialog">
    <el-form :model="form" label-width="80px" style="padding-right: 20px" :rules="rules" ref="formRef">

      <el-form-item label="洒水日期" prop="optime">
        <el-input v-model="form.optime" placeholder="洒水日期"></el-input>
      </el-form-item>
      <el-form-item label="绿化洒水车次" prop="forwv">
        <el-input v-model="form.forwv" placeholder="绿化洒水车次"></el-input>
      </el-form-item>
      <el-form-item label="绿化洒水量" prop="aowufgs">
        <el-input v-model="form.aowufgs" placeholder="绿化洒水量"></el-input>
      </el-form-item>
      <el-form-item label="出动人次" prop="nopd">
        <el-input v-model="form.nopd" placeholder="出动人次"></el-input>
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
// import E from "wangeditor"
export default {
  name: "IogwView",
  data(){
    return{
      tableData:[], //所有数据
      pageNum:1, //当前页码
      pageSize:5, //每页显示个数
      username:'',
      title:'',
      optime:'',
      forwv:'',
      aowufgs:'',
      nopd:'',
      total:0,
      fromVisible: false,
      form:{},
      user: JSON.parse(localStorage.getItem('current-user') || '{}'),
      rules:{//校验
        optime:[{
          required: true , message: '请输入洒水时间', trigger: 'blur'
        },],
        forwv:[{
          required: true , message: '请输入绿化洒水车次', trigger: 'blur'
        },],
        aowufgs:[{
          required: true , message: '请输入绿化洒水量', trigger: 'blur'
        },],
        nopd:[{
          required: true , message: '请输入出动人次', trigger: 'blur'
        },]

      },
      ids:[],
      editor: null,
      content:'',
      fromVisible1:false
    }
  },
  created() {
    this.load()
  },
  methods:{
    handleImport(res){
      if (res.code === '200') {
        this.$message.success("操作成功")
        this.load(1)
      } else {
        this.$message.error(res.msg)
      }
    },
    exportData(){ //批量导出数据
      if(!this.ids.length){ //没有选择行的时候,全部导出,或者根据我的搜索条件导出
        window.open('http://localhost:8080/iogw/export?token='+this.user.token)
      }
    },
    closeDialog(){
      // 销毁编辑器
      this.editor.destroy()
      this.editor = null

    },

    delBatch(){
      if (!this.ids.length){
        this.$message.warning('请选择数据')
        return
      }
      this.$confirm('您确认批量删除吗？', '确认删除', {type: "warning"}).then(() => {
        this.$request.delete('/iogw/delete/batch', {data : this.ids}).then(res => {
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
        this.$request.delete('/iogw/delete/' + id).then(res => {
          if (res.code === '200') {   // 表示操作成功
            this.$message.success('删除成功')
            this.load(1)
          } else {
            this.$message.error(res.msg)  // 弹出错误的信息
          }
        })
      }).catch(() => {})
    },
    // setRichText(){//富文本图片上传与视频上传
    //   this.$nextTick(()=>{
    //     this.editor = new E(`#editor`)
    //     this.editor.config.uploadImgServer = 'http://localhost:8080/file/editor/upload'
    //     this.editor.config.uploadFileName = 'file'
    //     this.editor.config.uploadImgHeaders = {
    //       token:this.user.token
    //     }
    //     this.editor.config.uploadImgParams = {
    //       type: 'img',
    //     }
    //
    //     this.editor.config.uploadVideoServer = 'http://localhost:8080/file/editor/upload'
    //     this.editor.config.uploadVideoName = 'file'
    //     this.editor.config.uploadVideoHeaders = {
    //       token: this.user.token
    //     }
    //     this.editor.config.uploadVideoParams = {
    //       type: 'video',
    //     }
    //
    //
    //     this.editor.create()  // 创建
    //   })
    //
    // },
    handleEdit(row){ //编辑数据
      this.form = JSON.parse(JSON.stringify(row)) //给form对象赋值 注意要深拷贝数据
      this.fromVisible = true //打开视窗
      // this.setRichText()
      // setTimeout(()=>{
      //   this.editor.txt.html(row.content)//设置富文本内容
      // },0)

    },

    handleAdd(){ //新增数据
      this.form = {} //新增数据的时候清空数据 默认身份用户
      this.fromVisible = true //打开视窗
      // this.setRichText()

    },
    save(){ //保持按钮触发的逻辑 它会触发新增或者更新
      this.$refs.formRef.validate((valid)=>{
        if (valid) {
          // //获取编辑框的内容
          // let content = this.editor.txt.html()   // 设置html
          // this.form.content = content


          this.$request({
            url:this.form.id ? '/iogw/update' : '/iogw/add',
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
        }
      })
    },
    reset(){ //重置
     this.optime = ''

      this.load()
    },
    load(pageNum){ //分页查询
      if (pageNum){
        this.pageNum = pageNum
      }
      this.$request.get('/iogw/selectByPage', {
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          optime:this.optime

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


<style scoped>

</style>
