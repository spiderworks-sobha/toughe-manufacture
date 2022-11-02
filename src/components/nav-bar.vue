<script>
  import { SimpleBar } from "simplebar-vue3";
  import axios from 'axios';
  import toast from '../services/toast';
  import store from "@/state/store";
  import { useRoute } from 'vue-router';

  /**
   * Nav-bar Component
   */
  export default {
    setup () {
        const route = useRoute();
        return { route }
    },
    data() {
      return {
        manufactures: {},
        current_manufacture: null,
        user: {},
      };
    },
    components: {
      SimpleBar
    },
    methods: {
      toggleMenu() {
        this.$parent.toggleMenu();
      },
      toggleHamburgerMenu() {
        var windowSize = document.documentElement.clientWidth;

        if (windowSize > 767)
          document.querySelector(".hamburger-icon").classList.toggle("open");

        //For collapse horizontal menu
        if (
          document.documentElement.getAttribute("data-layout") === "horizontal"
        ) {
            document.body.classList.contains("menu") ?
            document.body.classList.remove("menu") :
            document.body.classList.add("menu");
        }
        //For collapse vertical menu
        if (document.documentElement.getAttribute("data-layout") === "vertical") {
        
          if (windowSize < 1025 && windowSize > 767) {
            document.body.classList.remove("vertical-sidebar-enable");
            document.documentElement.getAttribute("data-sidebar-size") == "sm" ?
              document.documentElement.setAttribute("data-sidebar-size", "") :
              document.documentElement.setAttribute("data-sidebar-size", "sm");
          } else if (windowSize > 1025) {
            document.body.classList.remove("vertical-sidebar-enable");
            document.documentElement.getAttribute("data-sidebar-size") == "lg" ?
              document.documentElement.setAttribute("data-sidebar-size", "sm") :
              document.documentElement.setAttribute("data-sidebar-size", "lg");
          } else if (windowSize <= 767) {
            document.body.classList.add("vertical-sidebar-enable");
            document.documentElement.setAttribute("data-sidebar-size", "lg");
          }
        }

        //Two column menu
        if (document.documentElement.getAttribute("data-layout") == "twocolumn") {
          document.body.classList.contains("twocolumn-panel") ?
            document.body.classList.remove("twocolumn-panel") :
            document.body.classList.add("twocolumn-panel");
        }
      },
      initFullScreen() {
        document.body.classList.toggle("fullscreen-enable");
        if (
          !document.fullscreenElement &&
          /* alternative standard method */
          !document.mozFullScreenElement &&
          !document.webkitFullscreenElement
        ) {
          // current working methods
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(
              Element.ALLOW_KEYBOARD_INPUT
            );
          }
        } else {
          if (document.cancelFullScreen) {
            document.cancelFullScreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
          }
        }
      },
      async get_manufactures(){
        let that = this;
        await axios.get(this.base_url+'/manufactures/list-manufactures?users_id='+this.user.id)
        .then(result => {
            if (result.data.status == 'success') {
              this.manufactures = result.data.data;
            }
            else{
              toast.error(result.data.message);
            }
        })
      },
      change_manufacture(event){
        let selected_manufacture = event.target.value;
        console.log(selected_manufacture);
        localStorage.setItem('manufacture_id', selected_manufacture);
        this.$router.go(this.$router.currentRoute)
      },
      get_user(){
        this.user = JSON.parse(localStorage.getItem('userdata'));
      },
      logout(){
        localStorage.removeItem("userdata");
        localStorage.removeItem("jwt");
        this.$router.push({ name: 'login'})
      }
    },
    computed: {},
    created(){
      this.get_user();
      this.get_manufactures();
      this.current_manufacture = localStorage.getItem('manufacture_id');
    },
    mounted() {
      document.addEventListener("scroll", function () {
        var pageTopbar = document.getElementById("page-topbar");
        if (pageTopbar) {
          document.body.scrollTop >= 50 || document.documentElement.scrollTop >= 50 ? pageTopbar.classList.add(
            "topbar-shadow") : pageTopbar.classList.remove("topbar-shadow");
        }
      });
      if (document.getElementById("topnav-hamburger-icon"))
        document
        .getElementById("topnav-hamburger-icon")
        .addEventListener("click", this.toggleHamburgerMenu);

    },
  };
</script>

<template>
  <header id="page-topbar">
    <div class="layout-width">
      <div class="navbar-header">
        <div class="d-flex">
          <!-- LOGO -->
          <button type="button" class="
              btn btn-sm
              px-3
              fs-16
              header-item
              vertical-menu-btn
              topnav-hamburger
            " id="topnav-hamburger-icon">
            <span class="hamburger-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <div class="ms-1 header-item d-sm-flex" v-if="manufactures.length>1">
            <select class="form-select rounded-pill" @change="change_manufacture($event)" v-model="current_manufacture">
              <option v-for="(item, index) in manufactures" :value="item.id" :key="index">{{item.name}}</option>
            </select>
          </div>
        </div>

        <div class="d-flex align-items-center">

          <div class="ms-1 header-item d-none d-sm-flex">
            <button type="button" class="btn btn-icon btn-topbar btn-ghost-secondary rounded-circle"
              data-toggle="fullscreen" @click="initFullScreen">
              <i class="bx bx-fullscreen fs-22"></i>
            </button>
          </div>
          <div class="dropdown ms-sm-3 header-item topbar-user">
            <button type="button" class="btn" id="page-header-user-dropdown" data-bs-toggle="dropdown"
              aria-haspopup="true" aria-expanded="false">
              <span class="d-flex align-items-center">
                <img class="rounded-circle header-profile-user" src="@/assets/images/users/user-dummy-img.jpg"
                  alt="Header Avatar" />
                <span class="text-start ms-xl-2">
                  <span class=" d-none d-xl-inline-block ms-1 fw-medium user-name-text">{{user.name}}</span>
                  <span class="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">{{user.email}}</span>
                </span>
              </span>
            </button>
            <div class="dropdown-menu dropdown-menu-end">
              <a class="dropdown-item" @click="logout"><i class="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                <span class="align-middle" data-key="t-logout">Logout</span></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>