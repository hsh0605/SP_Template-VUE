<template>
<!--  大盒子-->
<div style="height: 100vh; display: flex; align-items: center; justify-content: center; background-color:#0DA6E7FF;">
<div style="display: flex; background-color:white; width: 50%;border-radius: 5px;overflow: hidden">
  <div style="flex: 1">
    <img src="@/assets/dkb.jpg" alt="" style="width: 100%">
  </div>
  <div style="flex: 1;display: flex;align-items: center; justify-content: center">
    <el-form :model="user" style="width: 80%" :rules="rules" ref="registerRef">
      <div style="font-size: 20px;font-weight: bold ; text-align: center; margin-bottom: 20px">
        欢迎注册本系统
      </div>
<!--      账号-->
      <el-form-item prop="username">
        <el-input prefix-icon="el-icon-user" size="medium" placeholder="请输入账号" v-model="user.username">
        </el-input>
      </el-form-item>
<!--      密码-->
      <el-form-item prop="password">
        <el-input prefix-icon="el-icon-lock" size="medium" show-password placeholder="请输入密码" v-model="user.password">
        </el-input>
      </el-form-item>
<!--      确认密码-->
      <el-form-item prop="confirmPassword">
        <el-input prefix-icon="el-icon-lock" size="medium" show-password placeholder="请输入密码" v-model="user.confirmPassword">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-radio-group v-model="user.role">
          <el-radio label="1">用户</el-radio>
          <el-radio label="0">商家</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 100%" @click="login">
          注册
        </el-button>
      </el-form-item>
      <div style="display: flex">
        <div style="flex: 1">已经有账号?请<span style="color: dodgerblue; cursor: pointer" @click="$router.push('/LoginView')">登录</span></div>
      </div>
    </el-form>
  </div>
</div>
</div>
</template>

<script>


export default {
  name: "RegisterView",

  data(){

    //验证码校验
    const validatePassword = (rule, confirmPassword, callback) => {
      if (confirmPassword === '') {
        callback(new Error('请确认密码'));
      } else if (confirmPassword !== this.user.password){
        callback(new Error('两次输入密码不一致'));
      }else {
        callback();
      }
    };

    return{

      user:{
        username: '',
        password: '',
        confirmPassword:''
      },
      rules: {
        // 注意对应username
        username: [
          {required: true, message: '请输入账号', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
        ],
        confirmPassword: [
          {validator: validatePassword, trigger: 'blur'},
        ],
        role:[
          {
            required: true, message: '请选择身份',trigger:'blur',},
        ]
      }
    }
  },
  created() {

  },
  methods:{

    login(){
      this.$refs["registerRef"].validate((valid) => {
        if (valid) {
          //验证通过
          this.$request.post('/register',this.user).then(res => {
            if (res.code === '200'){
              this.$router.push('/LoginView')//登录成功跳转主页
              this.$message.success('注册成功')//提示信息
            }else {
              this.$message.error(res.msg);
            }
          })
        }
      })


    }

  }
}
</script>

<style scoped>

</style>
