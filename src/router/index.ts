import {createRouter, createWebHistory} from 'vue-router'
import type {RouteLocationNormalized, RouteRecordRaw} from 'vue-router'
import {useAuthStore} from "@/stores";

// 定义路由元信息接口
interface RouteMeta {
    requiresAuth?: boolean
    gradDir?: 'to top' | 'to bottom'
    visible?: boolean
}

// 定义扩展后的路由记录接口
type AppRouteRecordRaw = RouteRecordRaw & {
    meta?: RouteMeta
    children?: AppRouteRecordRaw[]
}

const routes: AppRouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('../layouts/FrontLayout/index.vue'),
        children: [
            {
                path: "", // 路径建议使用空字符串，与 path: '/' 组合成根路径
                name: "index",
                component: () => import('../views/front/index.vue')
            },
            {
                path: "/sort",
                name: "sort",
                component: () => import('../views/front/sort/index.vue')
            }, {
                path: "/article",
                name: "article",
                component: () => import('../views/front/article/index.vue')
            }, {
                path: "/moment",
                name: "weiYan",
                component: () => import('@/views/front/moment/index.vue')
            }, {
                path: "/love",
                name: "love",
                component: () => import('../views/front/love/index.vue')
            }, {
                path: "/favorite",
                name: "favorite",
                component: () => import('../views/front/favorite/index.vue'),
                children: [
                    {
                        path: "music",
                        name: "favMusic",
                        component: () => import('../views/front/music/index.vue')
                    }, {
                        path: "friend",
                        name: "favFriend",
                        component: () => import('../views/front/friend/index.vue')
                    }, {
                        path: "collect",
                        name: "favCollect",
                        component: () => import('../views/front/collect/index.vue')
                    },
                ]
            }, {
                path: "/travel",
                name: "travel",
                meta: {
                    gradDir: 'to top'   // gradientDirection 渐变方向 由下往上渐变；不写或写 'to bottom' 就是默认由上到下
                },
                component: () => import('../views/front/travel/index.vue')
            }, {
                path: "/message",
                name: "message",
                component: () => import('../views/front/message/index.vue')
            },
            // {
            //     path: "/friend",
            //     name: "friend",
            //     component: () => import('../views/front/friend/index.vue')
            // },
            {
                path: "/about",
                name: "about",
                component: () => import('../views/front/about/index.vue')
            }, {
                path: "/letter",
                name: "letter",
                component: () => import('../views/front/letter/index.vue')
            }
        ]
    },
    {
        path: "/user",
        name: "user",
        component: () => import('../views/front/user/index.vue')
    },
    {
        path: '/admin',
        redirect: '/admin/main',
        meta: {requiresAuth: true},
        component: () => import('../layouts/AdminLayout/index.vue'),
        children: [
            {
                path: 'welcome',
                name: 'welcome',
                component: () => import('../views/admin/dashboard/welcome.vue')
            },
            {
                path: 'main',
                name: 'main',
                component: () => import('../views/admin/dashboard/index.vue')
            }, {
                path: 'webEdit',
                name: 'webEdit',
                component: () => import('../views/admin/settings/WebEdit.vue')
            }, {
                path: 'userList',
                name: 'userList',
                component: () => import('../views/admin/user/List.vue')
            }, {
                path: 'postList',
                name: 'postList',
                component: () => import('../views/admin/post/List.vue')
            }, {
                path: 'postEdit',
                name: 'postEdit',
                component: () => import('../views/admin/post/Edit.vue')
            }, {
                path: 'categoryList',
                name: 'categoryList',
                component: () => import('../views/admin/category/List.vue')
            }, {
                path: 'commentList',
                name: 'commentList',
                component: () => import('../views/admin/comment/List.vue')
            }, {
                path: 'danmaku',
                name: 'danmaku',
                component: () => import('../views/admin/danmaku/List.vue')
            }, {
                path: 'resourceList',
                name: 'resourceList',
                component: () => import('../views/admin/resource/List.vue')
            }, {
                path: 'loveList',
                name: 'loveList',
                component: () => import('../views/admin/love/List.vue')
            }, {
                path: 'resourcePathList',
                name: 'resourcePathList',
                component: () => import('../views/admin/resource/PathList.vue')
            }
        ]
    },
    {
        path: '/verify',
        name: 'verify',
        component: () => import('../views/admin/login/index.vue')
    }
]

const router = createRouter({
    history: createWebHistory(), // 替代 mode: 'history'
    routes,
    scrollBehavior(to: RouteLocationNormalized, from: RouteLocationNormalized, savedPosition: any) {
        // 返回的位置对象形态略有不同，Vue Router 4 中通常返回 { top: 0, left: 0 }
        return {top: 0, left: 0} // 或者 return { top: 0 }
        // 如果需要更精细的滚动行为，可以在此实现

    }
})

// 全局前置守卫 注意：Vue Router 4 中，通过 return 来控制导航
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    if (to.matched.some(record => record.meta?.requiresAuth)) {
        const authStore = useAuthStore();
        if (!Boolean(authStore.adminToken)) {
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