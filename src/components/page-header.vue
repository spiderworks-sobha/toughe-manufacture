<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    show_add_btn: 0,
  },
};
</script>

<template>
  <!-- start page title -->
  <div class="row">
    <div class="col-12">
      <div
        class="page-title-box d-sm-flex align-items-center justify-content-between"
      >
        <h4 class="mb-sm-0">
          {{ title }}
          <router-link to="/manufactures/create" class="btn btn-sm btn-primary ms-3" v-if="show_add_btn==1">
            <i class="ri-add-line"></i> CREATE NEW
          </router-link>
        </h4>
        

        <div class="page-title-right">
          <ol class="breadcrumb m-0">
            <li
              class="breadcrumb-item"
              v-for="(item, index) in items"
              :key="index"
              :class="{ active: item[0] }"
            >
              <router-link :to="item.href">
                {{ item.text }}
              </router-link>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </div>
  <!-- end page title -->
</template>
