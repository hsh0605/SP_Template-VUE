import Vue from 'vue'
import VueRouter from 'vue-router'
import ManagerView from '../views/ManagerView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import HomeView from "@/views/manager/HomeView.vue";
import UserView from "@/views/manager/UserView.vue";
import AuthView from "@/views/manager/AuthView.vue";
import Error404PageView from "@/views/Error404PageView.vue";
import PersonView from "@/views/manager/PersonView.vue";
import PasswordView from "@/views/manager/PasswordView.vue";
import RoadView from "@/views/manager/RoadView.vue";
import NoticeView from "@/views/manager/NoticeView.vue";

// 解决导航栏或者底部导航tabBar中的vue-router在3.0版本以上频繁点击菜单报错的问题。
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ManagerView',
    component: ManagerView,
    redirect:'/homeView',//重新定向主页
    children:[
      { path:'homeView',name:'HomeView',meta:{name:'系统首页'}, component: HomeView },
      { path: 'userView',name: 'UserView', meta:{name:'用户信息'}, component: UserView},
      {
        path: '403',
        name: 'AuthView',
        meta:{name:'无权限'},
        component: AuthView
      },
      {
        path: 'personView' ,
        name: 'PersonView',
        meta:{name:'个人信息'},
        component: PersonView
      },
      {
        path: 'passwordView',
        name: 'PasswordView',
        meta: {name:'修改密码'},
        component: PasswordView
      },
      {
        path: 'RoadView',
        name: 'RoadView',
        meta: {name:'路段信息'},
        component: RoadView
      },
      {
        path: 'NoticeView',
        name: 'NoticeVier',
        meta: {name: '发布公告'},
        component: NoticeView
      }
    ]
  },
  {
    path: '/LoginView',
    name: 'LoginView',
    meta:{name:'登录信息'},
    component: LoginView
  },
  {
    path: '/RegisterView',
    name: 'RegisterView',
    meta:{name:'注册信息'},
    component: RegisterView
  },
  {
    path: '*',
    name: 'Error404PageView',
    meta:{name:'404页面'},
    component: Error404PageView
  }

]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  // to 是到达的路由信息
  // from 是开源的路由信息
  // next 是帮助我们跳转路由的函数
  let adminPaths = ['/userView']
  let user = JSON.parse(localStorage.getItem('current-user') || '{}')

  if (user.role !== '0' && adminPaths.includes(to.path)) {
    // 如果当前登录的用户不是管理员，然后当前的到达的路径是管理员才有权限访问的路径，那这个时候我就让用户去到一个没有权限的页面，不让他访问实际的页面
    next('/403')
  } else {
    next()
  }
})


export default router
