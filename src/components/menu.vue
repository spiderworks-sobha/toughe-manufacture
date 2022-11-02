<script>
  import {
    SimpleBar
  } from "simplebar-vue3";

  export default {
    components: {
      SimpleBar
    },
    data() {
      return {
        settings: {
          minScrollbarLength: 60,
        },
      };
    },
    watch: {
      $route: {
        handler: "onRoutechange",
        immediate: true,
        deep: true,
      },
    },

    mounted() {
      if (document.querySelectorAll(".navbar-nav .collapse")) {
        let collapses = document.querySelectorAll(".navbar-nav .collapse");
        collapses.forEach((collapse) => {
          // Hide sibling collapses on `show.bs.collapse`
          collapse.addEventListener("show.bs.collapse", (e) => {
            e.stopPropagation();
            let closestCollapse = collapse.parentElement.closest(".collapse");
            if (closestCollapse) {
              let siblingCollapses =
                closestCollapse.querySelectorAll(".collapse");
              siblingCollapses.forEach((siblingCollapse) => {
                if (siblingCollapse.classList.contains("show")) {
                  let aChild = siblingCollapse.parentNode.firstChild;
                  if (aChild.hasAttribute("aria-expanded")){
                    aChild.setAttribute("aria-expanded", "false");
                  }
                  siblingCollapse.classList.remove("show");
                }
              });
            } else {
              let getSiblings = (elem) => {
                // Setup siblings array and get the first sibling
                let siblings = [];
                let sibling = elem.parentNode.firstChild;
                // Loop through each sibling and push to the array
                while (sibling) {
                  if (sibling.nodeType === 1 && sibling !== elem) {
                    siblings.push(sibling);
                  }
                  sibling = sibling.nextSibling;
                }
                return siblings;
              };
              let siblings = getSiblings(collapse.parentElement);
              siblings.forEach((item) => {
                if (item.childNodes.length > 2)
                  item.firstElementChild.setAttribute("aria-expanded", "false");
                let ids = item.querySelectorAll("*[id]");
                ids.forEach((item1) => {
                  let aChild = item1.parentNode.firstChild;
                  if (aChild.hasAttribute("aria-expanded")){
                    aChild.setAttribute("aria-expanded", "false");
                  }
                  item1.classList.remove("show");
                  if (item1.childNodes.length > 2) {
                    let val = item1.querySelectorAll("ul li a");

                    val.forEach((subitem) => {
                      if (subitem.hasAttribute("aria-expanded"))
                        subitem.setAttribute("aria-expanded", "false");
                    });
                  }
                });
              });
            }
          });

          // Hide nested collapses on `hide.bs.collapse`
          collapse.addEventListener("hide.bs.collapse", (e) => {
            e.stopPropagation();
            let childCollapses = collapse.querySelectorAll(".collapse");
            childCollapses.forEach((childCollapse) => {
              let childCollapseInstance = childCollapse;
              childCollapseInstance.hide();
            });
          });
        });
      }
    },

    methods: {
      onRoutechange(ele) {
        this.initActiveMenu(ele.path);
        if (document.getElementsByClassName("mm-active").length > 0) {
          const currentPosition = document.getElementsByClassName("mm-active")[0].offsetTop;
          if (currentPosition > 500)
            if (this.$refs.isSimplebar)
              this.$refs.isSimplebar.value.getScrollElement().scrollTop = currentPosition + 300;
        }
      },

      initActiveMenu(ele) {
        setTimeout(() => {
          if (document.querySelector("#navbar-nav")) {
            let a = document.querySelector("#navbar-nav").querySelector('[href="' + ele + '"]');

            if (a) {
              a.classList.add("active");
              let parentCollapseDiv = a.closest(".collapse.menu-dropdown");
              if (parentCollapseDiv) {
                parentCollapseDiv.classList.add("show");
                parentCollapseDiv.parentElement.children[0].classList.add("active");
                parentCollapseDiv.parentElement.children[0].setAttribute("aria-expanded", "true");
                if (parentCollapseDiv.parentElement.closest(".collapse.menu-dropdown")) {
                  parentCollapseDiv.parentElement.closest(".collapse").classList.add("show");
                  if (parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling)
                    parentCollapseDiv.parentElement.closest(".collapse").previousElementSibling.classList.add(
                      "active");
                }
              }
            }
          }
        }, 0);
      },
    },
  };
</script>

<template>
  <div class="container-fluid">
    <div id="two-column-menu"></div>
      <ul class="navbar-nav h-100 mt-4" id="navbar-nav">
        <li class="nav-item">
          <router-link to="/work-orders" class="nav-link menu-link">
              <i class="ri-printer-fill"></i>
              <span data-key="t-widgets">Work Orders</span>
          </router-link>
        </li>
        <!-- end Dashboard Menu -->
      </ul>
  </div>
  <!-- Sidebar -->
</template>