<template>
  <div>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside
        :width="asideWidth"
        style="min-height: 100vh; background-color: #001529"
      >
        <div
          style="
            height: 60px;
            line-height: 60px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          <img
            src="@/assets/lion.jpg"
            alt=""
            style="width: 40px; height: 40px"
          />
          <transition name="el-fade-in">
            <span style="margin-left: 5px; font-size: 20px" v-show="!isCollapse"
              >vue模板系统</span
            >
          </transition>
        </div>
        <el-menu
          :collapse="isCollapse"
          :default-openeds="['info']"
          :collapse-transition="false"
          router
          background-color="#001529"
          text-color="rgba(255,255,255,0.65)"
          active-text-color="#fff"
          style="border: none"
          :default-active="$route.path"
        >
          <el-menu-item index="/homeView">
            <i class="el-icon-s-house"></i>
            <span slot="title">系统首页</span>
          </el-menu-item>
          <el-submenu index="info" v-if="user.role === '0'"> <!--v-if‘’控制访问权限-->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户信息管理</span>
            </template>
            <el-menu-item index="/userView"> 用户信息 </el-menu-item>
          </el-submenu>
          <el-submenu index="info2" v-if="user.role === '0'"> <!--v-if‘’控制访问权限-->
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>公告栏管理</span>
            </template>
            <el-menu-item index="/noticeView"> 系统公告 </el-menu-item>
          </el-submenu>
          <el-submenu index="info1" >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>路段信息管理</span>
            </template>
            <el-menu-item index="/roadView"> 路段信息 </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 头部区域 -->
        <el-header>
          <i
            :class="collapseIcon"
            style="font-size: 26px"
            @click="handleCollapse"
          ></i>
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            style="margin-left: 20px"
          >
            <el-breadcrumb-item :to="{ path: '/' }">系统首页</el-breadcrumb-item>
            <!--跟随系统去修改到达的页面-->
            <el-breadcrumb-item :to="{ path: $route.path }"
              >{{ $route.meta.name }}</el-breadcrumb-item
            >
          </el-breadcrumb>

          <div
            style="
              flex: 1;
              width: 0;
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <el-dropdown placement="bottom">
              <div style="display: flex; align-items: center; cursor: default;">
                <i class="el-icon-full-screen" style="font-size: 26px;" @click="handleFulls"></i>
                <img
                :src="user.avatar"
                alt=""
                style="width: 40px; height: 40px; margin: 0 5px; border-radius: 50%"
              />
              <span>{{user.name}}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="$router.push('/personView')">个人信息</el-dropdown-item>
                <el-dropdown-item @click.native="$router.push('/passwordView')">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-header>
        <!-- 主体区域 -->
        <el-main>
          <router-view @update:user="updateUser"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "HomeView",
  data() {
    return {
      isCollapse: false, //不收缩
      asideWidth: "200px",
      collapseIcon: "el-icon-s-fold",
      user:JSON.parse(localStorage.getItem('current-user') || '{}'),
    }
  },
  mounted(){//页面加载完成后触发

  },
  methods: {
    updateUser(user){ //获取子组件传过来的数据,更新当前页面的数据
      this.user = JSON.parse(JSON.stringify(user)) //让父级的对象跟子级的对象毫无关联
    },
    logout(){
      localStorage.removeItem('current-user')  //清除当前的token和用户数据
      this.$router.push('/LoginView')
    },
    handleFulls(){
      document.documentElement.requestFullscreen()
    },
    handleCollapse() {
      this.isCollapse = !this.isCollapse;
      this.asideWidth = this.isCollapse ? "64px" : "200px";
      this.collapseIcon = this.isCollapse
        ? "el-icon-s-unfold"
        : "el-icon-s-fold";
    },
  },
}
</script>
<style>
* {
  padding: 0;
  margin: 0;
}
.el-menu--inline {
  background-color: #000c17 !important;
}
.el-menu--inline .el-menu-item {
  background-color: #000c17 !important;
  padding-left: 49px !important;
}
.el-menu-item:hover,
.el-submenu__title:hover {
  color: #fff !important;
}
.el-submenu__title:hover i {
  color: #fff !important;
}
.el-menu-item.is-active {
  background-color: #1890ff !important;
  border-radius: 5px !important;
  width: calc(100% - 8px);
  margin-left: 4px;
}
.el-menu-item {
  margin: 4px !important;
  height: 40px !important;
  line-height: 40px !important;
}
.el-submenu__title {
  height: 40px !important;
  line-height: 40px !important;
  margin: 4px !important;
}
/* .el-submenu__icon-arrow{
  margin-top: -5px;
} */

/* .el-menu--inline .el-menu-item.is-active{
  padding-left: 49px !important;
 } */
.el-aside {
  transition: width 0.3s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
.el-header {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  display: flex;
  align-items: center;
}
</style>
