import { asyncRoutes, constantRoutes } from '@/router'

/**
 *  Use meta.role to determine if the current user has permission
 * 根据 router 中的 mate 信息 ,判断访问这个路由是否需要角色信息
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    // ES6的语法糖,组装对象
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  // 根据不同的角色动态生成路由信息
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      // 如果用户的角色信息中包含 admin, 让他可以访问 router 路由表中定义的 asyncRouters 模块
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        // 如果没有admin的权限, 根据它现有的角色再去动态的过滤路由
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
