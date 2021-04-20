import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../views/Index.vue'
import Login from '../views/Login.vue'
Vue.use(VueRouter)

const routes = [{
		path: '/',
		name: 'Index',
		component: Index,
		children: [{
				path: '/suibian',
				name: 'SuiBian',
				component: () => import('../views/SuiBian.vue'),
			}, {
				path: '/user',
				name: 'user',
				component: () => import('../views/system/user/user.vue'),
			},
			{
				path: '/user-add',
				name: 'user-add',
				component: () => import('../views/system/user/user-add.vue'),
			},
			{
				path: '/user-edit',
				name: 'user-edit',
				component: () => import('../views/system/user/user-edit.vue'),
			},
			{
				path: '/menu',
				name: 'menu',
				component: () => import('../views/system/menu/menu.vue'),
			},
			{
				path: '/menu-add',
				name: 'menu-add',
				component: () => import('../views/system/menu/menu-add.vue'),
			},
			{
				path: '/menu-edit',
				name: 'menu-edit',
				component: () => import('../views/system/menu/menu-edit.vue'),
			},
			{
				path: '/menu-add-child',
				name: 'menu-add-child',
				component: () => import('../views/system/menu/menu-add-child.vue'),
			},
			{
				path: '/menu-edit-child',
				name: 'menu-edit-child',
				component: () => import('../views/system/menu/menu-edit-child.vue'),
			},
			{
				path: '/role',
				name: 'role',
				component: () => import('../views/system/role/role.vue'),
			},
			{
				path: '/role-add',
				name: 'role-add',
				component: () => import('../views/system/role/role-add.vue'),
			},
			{
				path: '/role-edit',
				name: 'role-edit',
				component: () => import('../views/system/role/role-edit.vue'),
			},
			{
				path: '/role-menu',
				name: 'role-menu',
				component: () => import('../views/system/role/role-menu.vue'),
			},
			{
				path: '/test-user',
				name: 'test-user',
				component: () => import('../views/test/user/test-user.vue'),
			}, {
				path: '/user-test',
				name: 'user-test',
				component: () => import('../views/test/user-test/user-test.vue'),
			}, {
				path: '/user66',
				name: 'user66',
				component: () => import('../views/yonghu66.vue'),
			},

		]
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	}
]

const router = new VueRouter({
	routes
})

export default router