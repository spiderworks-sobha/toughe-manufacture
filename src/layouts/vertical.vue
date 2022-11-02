<script>
import router from "@/router";
import { SimpleBar } from "simplebar-vue3";

import NavBar from "@/components/nav-bar.vue";
import Menu from "@/components/menu.vue";
import Footer from "@/components/footer.vue";
localStorage.setItem('hoverd',false);

/**
 * Vertical layout
 */
export default {
  components: { NavBar, Footer, SimpleBar, Menu },
  data() {
    return {
      isMenuCondensed: false,
    };
  },
  created: () => {
    document.documentElement.setAttribute('data-layout-mode', 'light');
    document.documentElement.setAttribute('data-sidebar', 'dark');
    document.documentElement.setAttribute('data-layout-style', 'default');
    document.documentElement.setAttribute('data-layout-position', 'fixed');
    document.documentElement.setAttribute('data-sidebar-size', 'lg');
    document.documentElement.setAttribute('data-topbar', 'light');
    document.documentElement.setAttribute('data-layout-width', 'fluid');
    document.documentElement.setAttribute('data-layout', 'vertical');
  },
  methods: {
    initActiveMenu() {
            if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover') {
                localStorage.setItem('hoverd',true)
                document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
            } else if (document.documentElement.getAttribute('data-sidebar-size') === 'sm-hover-active') {
                localStorage.setItem('hoverd',false)
                document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
            } else {
                document.documentElement.setAttribute('data-sidebar-size', 'sm-hover');
            }
    },
    toggleMenu() {
      document.body.classList.toggle("sidebar-enable");

      if (window.screen.width >= 992) {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
          document.body.classList.remove("vertical-collpsed");
        });
        document.body.classList.toggle("vertical-collpsed");
      } else {
        // eslint-disable-next-line no-unused-vars
        router.afterEach((routeTo, routeFrom) => {
          document.body.classList.remove("sidebar-enable");
        });
        document.body.classList.remove("vertical-collpsed");
      }
      this.isMenuCondensed = !this.isMenuCondensed;
    },
  },
  mounted() {
    if(localStorage.getItem('hoverd')=='true'){
       document.documentElement.setAttribute('data-sidebar-size', 'sm-hover-active');
    }
    document.getElementById('overlay').addEventListener('click',()=>{
      document.body.classList.remove('vertical-sidebar-enable')
    })

  },
};
</script>

<template>
  <div id="layout-wrapper">
    <NavBar />
    <div>
      <!-- ========== Left Sidebar Start ========== -->
      <!-- ========== App Menu ========== -->
      <div class="app-menu navbar-menu">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <!-- Light Logo-->
          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo.jpg" alt="" height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo.jpg" alt="" height="100" />
            </span>
          </router-link>
          <button type="button" class="btn btn-sm p-0 fs-20 header-item float-end btn-vertical-sm-hover" id="vertical-hover" @click="initActiveMenu">
            <i class="ri-record-circle-line"></i>
          </button>
        </div>

        <SimpleBar id="scrollbar" class="h-100" ref="scrollbar">
          <Menu></Menu>
        </SimpleBar>
      </div>
      <!-- Left Sidebar End -->
      <!-- Vertical Overlay-->
      <div class="vertical-overlay" id="overlay"></div>
    </div>
    <!-- ============================================================== -->
    <!-- Start Page Content here -->
    <!-- ============================================================== -->

    <div class="main-content">
      <div class="page-content">
        <!-- Start Content-->
        <div class="container-fluid">
          <slot />
        </div>
      </div>
      <Footer />
    </div>
  </div>
</template>