import Vue from 'vue'
import VueRouter from 'vue-router'

import layout from '@/layout/layout'
Vue.use(VueRouter)

export let constantRouterMap = [{
    path: '/login',
    component: () => import('@/view/login/login'),
    hidden: true
  },
  {
    path: '/register',
    component: () => import('@/view/register/Register'),
    hidden: true
  },
  {
    path: '/',
    component: () => import('@/view/404/404'),
    hidden: true
  }, {
    path: '/',
    component: layout,
    redirect: '/home',
    meta: {
      title: '首页',
      icon: 'el-icon-s-home'
    },
    children: [{
      path: '/home',
      // name: 'home',
      component: () => import('@/view/home/home'),
      meta: {
        title: '首页',
        icon: 'el-icon-s-home'
      }
    }, ]
  },
  {
    path: '/',
    component: layout,
    redirect: '/appointDoctor',
    meta: {
      title: '患者预约',
      icon: 'el-icon-user'
    },
    children: [{
      path: '/appointDoctor',
      component: () => import('@/view/patientAppointment/Appoint'),
      meta: {
        title: '预约挂号',
        icon: 'el-icon-s-claim'
      }
    }, {
      path: '/appointRecord',
      component: () => import('@/view/patientAppointment/AppointRecord'),
      meta: {
        title: '挂号记录',
        icon: 'el-icon-document-copy'
      },
    }, {
      path: '/visitRecord',
      component: () => import('@/view/patientAppointment/VisitRecord'),
      meta: {
        title: '就诊记录',
        icon: 'el-icon-star-on'
      },
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

export default new VueRouter({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
