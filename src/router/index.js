import { createRouter, createWebHistory } from 'vue-router'
import store from "@/state/store";
import WorkOrderList from '../views/workorders/List.vue'
import toast from '../services/toast';
import axios from 'axios';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: to => {
        return { path: '/login'}
      },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/account/login.vue"),
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem('jwt')) {
          // Redirect to the home page instead
          next({ name: "work-orders" });
        } else {
          // Continue to the login page
          next();
        }
      },
      meta: {
        title: "Login",
      },
    },
    {
      path: "/logout",
      name: "logout",
      beforeEnter: (to, from, next) => {
        localStorage.removeItem("userdata");
        localStorage.removeItem("jwt");
        next({ name: "login" });
      }
    },
    {
      path: '/work-orders',
      name: 'work-orders',
      component: WorkOrderList,
      meta: { 
        title: "List Work Orders",
        authRequired: true,
      },
    },
    {
      path: '/:notFound(.*)',
      name: 'notfound',
      component: null
    },
  ]
});


// Before each route evaluates...
router.beforeEach(async (routeTo, routeFrom, next) => {
  const authRequired = routeTo.matched.some((route) => route.meta.authRequired)

  if (!authRequired) return next()

  axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('jwt') // for all requests
  let user_url = 'http://localhost/omnisellcrm-backend/api/manufactures/user';
  if(localStorage.getItem('manufacture_id'))
    user_url +='?manufacture_id='+localStorage.getItem('manufacture_id');
  await axios.get(user_url).then((data) => {
    if (data.data.status == 'error') {
      toast.error('You do not have the permission to access manufacture login. Please check with admin for more details.');
      next({ name: 'logout' });
    }
    else{
      localStorage.setItem('userdata', JSON.stringify(data.data.data));
      localStorage.setItem('manufacture_id', data.data.data.manufacture.id);
      next()
    }
  }).catch(() => {
    next({ name: 'login', query: { redirectFrom: routeTo.fullPath } })
  });
})

router.afterEach((to, from) => {
  document.title = to.meta.title || 'Toughie Admin';
})

export default router
