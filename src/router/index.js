import {createRouter, createWebHistory} from 'vue-router'


const routes = [
    {
        path: '/',
        component: () => import('../components/home.vue'),
        children: [
            {
                path: "", // 路径建议使用空字符串，与 path: '/' 组合成根路径
                name: "index",
                component: () => import('../components/index.vue')
            },
            {
                path: "/sort",
                name: "sort",
                component: () => import('../components/sort.vue')
            }, {
                path: "/article",
                name: "article",
                component: () => import('../components/article.vue')
            }, {
                path: "/weiYan",
                name: "weiYan",
                component: () => import('../components/weiYan.vue')
            }, {
                path: "/love",
                name: "love",
                component: () => import('../components/love.vue')
            }, {
                path: "/favorite",
                name: "favorite",
                component: () => import('../components/favorite.vue')
            }, {
                path: "/travel",
                name: "travel",
                component: () => import('../components/travel.vue')
            }, {
                path: "/message",
                name: "message",
                component: () => import('../components/message.vue')
            }, {
                path: "/friend",
                name: "friend",
                component: () => import('../components/friend.vue')
            }, {
                path: "/about",
                name: "about",
                component: () => import('../components/about.vue')
            }, {
                path: "/user",
                name: "user",
                component: () => import('../components/user.vue')
            }, {
                path: "/letter",
                name: "letter",
                component: () => import('../components/letter.vue')
            }
        ]
    },
    {
        path: '/admin',
        redirect: '/welcome',
        meta: {requiresAuth: true},
        component: () => import('../components/admin/admin.vue'),
        children: [
            {
                path: '/welcome', // 或者使用 path: 'welcome' 生成相对路径 /admin/welcome
                name: 'welcome',
                component: () => import('../components/admin/welcome.vue')
            },
            {
                path: '/main',
                name: 'main',
                component: () => import('../components/admin/main.vue')
            }, {
                path: '/webEdit',
                name: 'webEdit',
                component: () => import('../components/admin/webEdit.vue')
            }, {
                path: '/userList',
                name: 'userList',
                component: () => import('../components/admin/userList.vue')
            }, {
                path: '/postList',
                name: 'postList',
                component: () => import('../components/admin/postList.vue')
            }, {
                path: '/postEdit',
                name: 'postEdit',
                component: () => import('../components/admin/postEdit.vue')
            }, {
                path: '/sortList',
                name: 'sortList',
                component: () => import('../components/admin/sortList.vue')
            }, {
                path: '/commentList',
                name: 'commentList',
                component: () => import('../components/admin/commentList.vue')
            }, {
                path: '/treeHoleList',
                name: 'treeHoleList',
                component: () => import('../components/admin/treeHoleList.vue')
            }, {
                path: '/resourceList',
                name: 'resourceList',
                component: () => import('../components/admin/resourceList.vue')
            }, {
                path: '/loveList',
                name: 'loveList',
                component: () => import('../components/admin/loveList.vue')
            }, {
                path: '/resourcePathList',
                name: 'resourcePathList',
                component: () => import('../components/admin/resourcePathList.vue')
            }
        ]
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('../components/admin/verify.vue')
    }
]

const router = createRouter({

    history: createWebHistory(), // 替代 mode: 'history'
    routes: routes, // 属性简写可写为 routes
    scrollBehavior(to, from, savedPosition) {
        // 返回的位置对象形态略有不同，Vue Router 4 中通常返回 { top: 0, left: 0 }
        return {top: 0, left: 0} // 或者 return { top: 0 }
        // 如果需要更精细的滚动行为，可以在此实现

    }
})

// 全局前置守卫 注意：Vue Router 4 中，通过 return 来控制导航
router.beforeEach((to, from) => { // next 参数目前保留，但未来可能废弃，建议使用返回方式
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!Boolean(localStorage.getItem("adminToken"))) {
            return {
                path: '/verify',
                query: {redirect: to.fullPath}
            }

        } else {
            return true;
        }
    } else {
        return true;
    }
})

export default router