<script>
import axios from 'axios';
import toast from '../../services/toast';

export default {
    setup () {
    },
    components: {},
    props: {
        work_order: {},
    },
    data(){
        return {
            button_status: 'enabled',
        }
    },
    methods: {
        change_status(event){
            this.current_status = event.target.value;
        },
        save_status(){
            this.button_status = 'processing';
            var action_url = this.base_url+'/manufactures/work-orders/update';
            axios.post(action_url, {id: this.work_order.id, status: this.current_status })
                 .then((result) => {
                    if (result.data.status == 'error') {
                        toast.error(result.data.message);
                    }
                    else{
                        toast.success(result.data.message);
                        this.$refs.Close.click();
                        this.$emit('onupdate', 'updated');
                    }
                    this.button_type = 'enabled';
                 });
        }
    },
    emits: ['onupdate'],
    created(){
        this.current_status = this.work_order.status;
    }
};
</script>
<template>
    <div class="modal-header">
                    <h5 class="modal-title">Work Order Details</h5>
                    <button ref="Close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                    <div class="row">
                        <div class="col-6 p-2"> 
                            Work Order: 
                        </div>
                        <div class="col-6 p-2">
                            {{work_order.title}}
                        </div>
                        <hr class="w-100 m-0" />
                        <div class="col-6 p-2">
                            Product:
                        </div>
                        <div class="col-6 p-2">
                            {{work_order.product_name}}
                        </div>
                        <hr class="w-100 m-0" />
                        <div class="col-6 p-2">
                            Assigned Quantity:
                        </div>
                        <div class="col-6 p-2">
                            {{work_order.quantity}}
                        </div>
                        <hr class="w-100 m-0" />
                        <div class="col-6 p-2">
                            Assigned On:
                        </div>
                        <div class="col-6 p-2">
                            {{new Date(work_order.assigned_on).toLocaleString()}}
                        </div>
                        <hr class="w-100 m-0" />
                        <div class="col-6 p-2">
                            Current Status:
                        </div>
                        <div class="col-6 p-2">
                            <select class="form-select" v-model="current_status" @change="change_status">
                                <option value="Assigned">Assigned</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" :disabled="button_status != 'enabled'" @click="save_status">{{(button_status == 'enabled')?'Change Status':'Processing...'}}</button>
                </div>
</template>