<script>
  import Layout from "../../layouts/main.vue";
  import PageHeader from "@/components/page-header.vue";
  import TableBase from "./table.vue";

  export default {
    page: {
      title: "Manufactures",
      meta: [{
        name: "description",
        content: "meta description"
      }],
    },
    data() {
      return {
        title: "Work Orders",
        workOrderKey: 0,
        items: [{
            text: "Home",
            href: "/",
          },
          {
            text: "Work Orders",
            href: '',
            active: true,
          },
        ],
      };
    },
    components: {
      Layout,
      PageHeader,
      TableBase
    },
    methods: {
      ReloadWorkOrder(event){
        this.workOrderKey +=1;
      }
    },
  };
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="card card-body">
        <div class="card-body">
          <div class="table-responsive table-card">
            <TableBase :key="workOrderKey" @onupdate="ReloadWorkOrder($event)"></TableBase>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>