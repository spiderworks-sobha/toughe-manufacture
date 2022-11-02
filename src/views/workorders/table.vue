<script>
    import axios from 'axios';
    import Modal from "@/components/modal.vue";
    import AssignWorkOrder from "./Assign.vue";
    import ViewWorkOrder from "./Details.vue";
    import tableMixin from '../../services/mixins/tableMixin';
    import swalMixin from '../../services/mixins/swalMixin';
    import tableHeader from "@/components/table/header.vue";
    import tableFooter from "@/components/table/footer.vue";
    import Datepicker from 'vue3-datepicker'

    export default{
        mixins: [tableMixin, swalMixin],
        props: {
            users: {},
            vendor_id: null,
        },
        data(){
            return {
                adv_search: {
                    from: null,
                    to: null,
                    status: null,
                },
                date_from: null,
                date_to: null,
                vendors: {},
                columns: [
                    { 
                        id: 'id',
                        name: 'ID',
                        item: 'manufacture_work_orders.id',
                        sort: false
                    },
                    { 
                        id: 'title',
                        name: 'Title',
                        item: 'lead_work_orders.title'
                    },
                    { 
                        id: 'product',
                        name: 'Product',
                        item: 'products.product_name'
                    }, 
                    { 
                        id: 'quantity',
                        name: 'Quantity',
                        item: 'manufacture_work_orders.quantity'
                    },
                    { 
                        id: 'assigned_on',
                        name: 'Assigned On',
                        item: 'manufacture_work_orders.assigned_on'
                    },
                    { 
                        id: 'status',
                        name: 'Status',
                        item: 'manufacture_work_orders.status'
                    }
                ],
                url: this.base_url+'/manufactures/users/work-orders?manufactures_id='+localStorage.getItem('manufacture_id'),
            }
        },
        emits: ['onupdate'],
        methods: {
            badge(status){
                if(status == 'Assigned')
                    return 'badge bg-secondary';
                else if(status == 'Processing')
                    return 'badge bg-primary';
                else if(status == 'Shipped')
                    return 'badge bg-info';
                else if(status == 'Delivered')
                    return 'badge bg-success';
            },
            ReloadWorkOrder(event){
                this.$emit('onupdate', event);
            },
            handleDateFrom(modelValue){
                let month = parseInt(modelValue.getMonth())+1;
                this.adv_search.from = modelValue.getFullYear()+'-'+month+'-'+modelValue.getDate();
                if(this.adv_search.from && this.adv_search.to){
                    if(this.adv_search.from > this.adv_search.to){
                        this.adv_search.from = null;
                        this.date_from = null;
                        this.swal_alert('Invalid date range');
                    }
                }
            },
            handleDateTo(modelValue){
                let month = parseInt(modelValue.getMonth())+1;
                this.adv_search.to = modelValue.getFullYear()+'-'+month+'-'+modelValue.getDate();
                if(this.adv_search.from && this.adv_search.to){
                    if(this.adv_search.from > this.adv_search.to){
                        this.adv_search.to = null;
                        this.date_to = null;
                        this.swal_alert('Invalid date range');
                    }
                }
            }
        },
        components: {
            Modal, AssignWorkOrder, tableHeader, tableFooter, ViewWorkOrder, Datepicker
        },
        mounted(){
        },
    }
</script>

<template>
    <div class="card">
        <div class="card-header">
            Search
        </div>
        <div class="card-body">
            <div class="row g-3 mb-3">
                    <div class="col-md-3">
                        <label class="form-label">From</label>
                        <Datepicker v-model="date_from" @update:modelValue="handleDateFrom" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">To</label>
                        <Datepicker v-model="date_to" @update:modelValue="handleDateTo" />
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">Status</label>
                        <select class="form-select" v-model="adv_search.status">
                            <option value="Assigned">Assigned</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                        </select>
                    </div>
                    <div class="col-3">
                        <button type="submit" class="btn btn-primary" style="margin-top:25px;" @click="advanced_search">Search</button>
                        <button type="button" class="btn btn-light" style="margin-top:25px; margin-left:5px;" @click="clear_advanced_search">Clear</button>
                    </div>
            </div>
        </div>
    </div>
    
    <div>
        <tableHeader></tableHeader>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col" v-for="th in columns" :key="th.id">
                        <span>{{th.name}}</span>
                        <span v-if="typeof th.sort == 'undefined' || th.sort == true">
                            <span class="sort-asc" v-if="sortField == th.item && sortOrder == 'asc'" @click="sort(th.item, 'desc')"><i class="ri-arrow-down-s-fill"></i></span>
                            <span class="sort-desc" v-else-if="sortField == th.item && sortOrder == 'desc'" @click="sort(th.item, 'asc')"><i class="ri-arrow-up-s-fill"></i></span>
                            <span class="sort-nutral" v-else @click="sort(th.item, 'asc')"><i class="ri-arrow-up-down-line"></i></span>
                        </span>
                    </th>
                </tr>
            </thead>
            <tbody v-if="showProcessing == 0">
                <tr v-for="(item, index) in entries" :key="item.id" v-if="entries.length">
                    <td>{{showing.from+index}}</td>
                    <td>{{item.title}}</td>
                    <td>{{item.product_name}}</td>
                    <td>{{item.quantity}}</td>
                    <td>{{new Date(item.assigned_on).toLocaleString()}}</td>
                    <td>
                        <a href="#" data-bs-toggle="modal" :data-bs-target="'#viewWorkOrder'+item.id">
                            <span :class="badge(item.status)">{{item.status}}</span>
                        </a>
                        <Modal :modalid="'viewWorkOrder'+item.id" >
                            <ViewWorkOrder :work_order="item" @onupdate="ReloadWorkOrder($event)"></ViewWorkOrder>
                        </Modal>
                    </td>
                </tr>
                <tr v-else>
                    <td colspan="6"><p class="mt-3 text-center">No results found!</p></td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr>
                    <td colspan="6"><p class="mt-3 text-center">Processing...</p></td>
                </tr>
            </tbody>
        </table>
        <tableFooter :showing="showing" :havePagination="havePagination" :currentPage="currentPage" :lastPage="lastPage" :key="paginationKey"></tableFooter>
    </div>
</template>

<style>
  span.sort-nutral{
    margin-left: 5px;
    color:#ddd;
  }

  .v3dp__datepicker .v3dp__input_wrapper input[type=text]{
    display: block;
    width: 100%;
    padding: 0.5rem 0.9rem;
    font-size: 0.8125rem;
    font-weight: 400;
    line-height: 1.5;
    color: var(--vz-body-color);
    background-color: var(--vz-input-bg);
    background-clip: padding-box;
    border: 1px solid var(--vz-input-border);
    appearance: none;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }
</style>