<script>
import { useVuelidate } from '@vuelidate/core'
import { required, email, minValue, helpers } from '@vuelidate/validators'
import axios from 'axios';
import toast from '../../services/toast';

export default {
    setup () {
        return { v$: useVuelidate() }
    },
    components: {},
    props: {
        vendors: {},
        is_edit: {},
        lead_work_orders_id: 0,
        work_order: {},
    },
    data(){
        return {
            form: {
                manufactures_id: null,
                split_type: 0,
                quantity: 0,
            },
            split_type_options: {
                over_selling: true,
                split_assignment: true,
                stock_available: true,
            },
            button_type: 'disabled',
            show_details: 0,
            assign_stock_readonly: true,
            available_stock: 0,
        }
    },
    validations () {
        return {
            form: {
                manufactures_id: { required: helpers.withMessage('Please select vendor to be assigned', required) },
                quantity: { minValue: minValue(1)},
            }
        }
    },
    methods: {
        allow_stock_edit(event){
            let split_type_val = event.target.value;
            if(split_type_val == 0){
                this.form.quantity = this.work_order.quantity;
                this.assign_stock_readonly = true;
            }
            else{
                if(split_type_val == 1){
                    this.form.quantity = this.work_order.quantity;
                }
                else{
                    if(this.available_stock > this.work_order.quantity){
                        this.form.quantity = 0;
                    }
                    else{
                        this.form.quantity = this.available_stock;
                    }
                }
                this.assign_stock_readonly = false;
            }
        },
        async get_details(event){
            let manufactures_id = event.target.value;
            await axios.get(this.base_url+'/manufactures/view', { params: { id: manufactures_id } })
            .then(result => {
                if (result.data.status == 'error') {
                    toast.error(result.data.message);
                    return false;
                }
                this.available_stock = result.data.data.available_stock;
                if(this.available_stock > this.work_order.quantity){
                    this.split_type_options.over_selling = false;
                    this.split_type_options.stock_available = true;
                    this.split_type_options.split_assignment = true;
                    this.form.quantity = this.work_order.quantity;
                    this.form.split_type = 0;
                    this.assign_stock_readonly = true;
                }
                else{
                    if(this.available_stock <=0){
                        this.split_type_options.stock_available = false;
                        this.split_type_options.split_assignment = false;
                        this.split_type_options.over_selling = true;
                        this.form.quantity = this.work_order.quantity;
                        this.form.split_type = 1;
                    }
                    else{
                        this.split_type_options.stock_available = false;
                        this.split_type_options.split_assignment = true;
                        this.split_type_options.over_selling = true;
                        this.form.quantity = this.available_stock;
                        this.form.split_type = 2;
                    }
                    this.assign_stock_readonly = false;
                }
                this.show_details = 1;
                this.button_type = 'enabled';
            })
        },
        checkQuantity(event){
            let quantity = event.target.value;
            if(this.form.split_type == 1){
                if(quantity>this.work_order.quantity){
                    toast.error('Maximum quantity you can assign is: '+this.work_order.quantity);
                    this.form.quantity = this.work_order.quantity;
                }
            }
            else if(this.form.split_type == 2){
                if(quantity == this.available_stock){
                    this.form.split_type = 0;
                    this.assign_stock_readonly = true;
                }
                else if(quantity>this.available_stock){
                    toast.error('Maximum quantity you can assign is: '+this.available_stock);
                    this.form.quantity = this.available_stock;
                    this.form.split_type = 0;
                    this.assign_stock_readonly = true;
                }
            }
        },
        assignVendor(){
            this.v$.$validate() // checks all inputs      
            if (!this.v$.$error) {
                this.button_type = 'processing';
                if(this.is_edit != 'null' && this.is_edit)
                {
                    var action_url = this.base_url+'/manufactures/work-orders/update';
                    this.form.id = this.is_edit.id;
                }
                else{
                    var action_url = this.base_url+'/manufactures/work-orders/store';
                    this.form.lead_work_orders_id = this.work_order.id;
                    this.form.type = this.work_order.type;
                }
                axios.post(action_url, this.form)
                 .then((result) => {
                    if (result.data.status == 'error') {
                        toast.error(result.data.message);
                    }
                    else{
                        toast.success(result.data.message);
                        this.$refs.Close.click();
                        this.$emit('onupdate', 'updated');
                        this.form.lead_work_orders_id = null;
                        this.form.manufactures_id = null;
                        this.form.split_type = 0;
                        this.form.quantity = 0;
                        this.form.type = null;
                    }
                    this.button_type = 'enabled';
                 });   
            }
        }
    },
    mounted(){
        if(this.is_edit != 'null' && this.is_edit)
        {
            this.form.manufactures_id = this.is_edit.manufactures_id;
        }
    }
};
</script>
<template>
    <div class="modal-header">
                    <h5 class="modal-title">Assign Work Order to Manufacturer</h5>
                    <button ref="Close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-start">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3">
                                <label for="vendor" class="form-label">Select manufacture</label>
                                <select class="form-select" v-model="form.manufactures_id" @change="get_details">
                                    <option v-for="vendor in vendors" :key="vendor.id" :value="vendor.id">{{vendor.name}}</option>
                                </select>
                                <span class="error" v-if="v$.form.manufactures_id.$error"> {{ v$.form.manufactures_id.$errors[0].$message }} </span>
                            </div>
                        </div>
                        <div class="col-12" v-if="show_details">
                            <div class="mb-3">
                                <div class="form-check form-check-inline" v-if="split_type_options.over_selling">
                                    <input v-model="form.split_type" @click="allow_stock_edit" class="form-check-input me-1" type="radio" id="over_selling"  value="1">
                                    <label class="form-check-label" for="over_selling">Allow over selling</label>
                                </div>
                                <div class="form-check form-check-inline" v-if="split_type_options.split_assignment">
                                    <input v-model="form.split_type" @click="allow_stock_edit" class="form-check-input me-1" type="radio" id="split_quantity" value="2">
                                    <label class="form-check-label" for="split_quantity">Split quantity</label>
                                </div>
                                <div class="form-check form-check-inline" v-if="split_type_options.stock_available">
                                    <input v-model="form.split_type" @click="allow_stock_edit" class="form-check-input me-1" type="radio" id="available_stock" value="0">
                                    <label class="form-check-label" for="available_stock">Available stock</label>
                                </div>
                            </div>
                        </div>
                        <div class="col-12" v-if="show_details">
                            <div class="mb-3">
                                <label for="vendor" class="form-label">Quantity</label>
                                <input v-model="form.quantity" @keyup="checkQuantity" type="number" :readonly="assign_stock_readonly" class="form-control" placeholder="Enter quantity to be assigned">
                                <div class="form-text"> Available quantity for this manufacturer is: <span>{{available_stock}}</span>. </div>
                                <span class="error" v-if="v$.form.quantity.$error"> {{ v$.form.quantity.$errors[0].$message }} </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" @click="assignVendor()" :disabled="button_type != 'enabled'">{{(button_type == 'processing')?'Processing...':'Save'}}</button>
                </div>
</template>