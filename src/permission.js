import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单
const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

/*
* 任何路由都会经过这里,进行权限的验证
* */
router.beforeEach(async(to, from, next) => {
  // start progress bar,进度条开始
  NProgress.start()

  // set page title 获取到目标组件的标题
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in 校验用户是否登录了
  // 尝试从cookie中取出token
  const hasToken = getToken()

  // 有合法的token
  if (hasToken) {
    // 如果本地有用户的身份标识, 用户还想去登录页, 直接重定向到 home页面
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      // 如果已经登陆了,重定向到 home页
      next({ path: '/' })
      NProgress.done()
    } else {
      // 校验用户是否获取到了它的角色信息
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      alert('用户拥有角色吗? ' + hasRoles)
      if (hasRoles) {
        next() // 存在相关的角色信息, 就跳转到它想去的路径
      } else {
        try {
          // 如果没有角色信息, 就想后台发送请求, 重新拉取角色的信息, 注意, 角色必须是一个对象数组就像下面这样
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')
          alert('拉取到了用户的信息 roles ' + roles)
          // todo 根据角色的信息,生成指定的 可访问的路由列表
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          // 动态的生成可以访问的路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          // 如果上面的过程出错了, 就重定向到登录页, 重新拉取 token
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || '对不起, 您的身份认证已过期, 请重新登录...')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // 如果没合法的token, 并且访问的是登录, 权限认证这种白名单, 直接放行让他去访问
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 否者将用户导向去登录页面
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
