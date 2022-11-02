<script>
    import axios from 'axios';
    export default{
        props: {
            columns: {},
            url: null,
        },
        data(){
            return {
                showEntries: [10, 25, 50, 75, 100],
                currentEntry: 10,
                havePagination: 0,
                showing: {
                    form: null,
                    to: null,
                    total: null,
                },
                entries: [],
                fields: [],
                currentPage: 1,
                lastPage: 1,
                keyword: '',
                sortField: '',
                sortOrder: '',
            }
        },
        methods: {
            paginateEntries(){
                this.currentPage = 1;
                this.fetchData();
            },
            search(){
                this.currentPage = 1;
                this.fetchData();
            },
            paginate(n){
                this.currentPage = n;
                this.fetchData();
            },
            next(){
                if(this.currentPage != this.lastPage){
                    this.currentPage = this.currentPage+1;
                    this.fetchData();
                }
            },
            prev(){
                if(this.currentPage > 1){
                    this.currentPage = this.currentPage-1;
                    this.fetchData();
                }
            },
            sort(field, order){
                this.sortField = field;
                this.sortOrder = order;
                this.fetchData();
            },
            redirect(url, id){
                this.$router.push({ name: `${url}`, params: { id: id } })
            },
            initTable(){
                
                this.columns.forEach((value, index) => {
                    var data_field = {};
                    data_field.id = value.id;
                    if(typeof value.icon != 'undefined')
                        data_field.icon = value.icon;
                    else
                        data_field.icon = false;
                    if(typeof value.url != 'undefined')
                        data_field.url = value.url;
                    else
                        data_field.url = false;
                    this.fields.push(data_field);
                });
                this.fetchData();
            },
            fetchData(){
                let get_url;
                if(this.url.indexOf('?') === -1)
                    get_url = this.url+"?page="+this.currentPage+"&limit="+this.currentEntry
                else
                    get_url = this.url+"&page="+this.currentPage+"&limit="+this.currentEntry
                
                if(this.keyword != '')
                    get_url = get_url+'&search='+this.keyword;
                if(this.sortField != '' && this.sortOrder != '')
                    get_url = get_url+'&sort_field='+this.sortField+'&sort_order='+this.sortOrder;

                axios.get(get_url)
                 .then((result) => {
                    let data = result.data.data;
                    this.currentPage = data.current_page;
                    this.lastPage = data.last_page;
                    if(data.last_page>1)
                        this.havePagination = 1;
                    else
                        this.havePagination = 0;
                    if(data.total>0)
                    {
                        this.showing.from = data.from;
                        this.showing.to = data.to;
                        this.showing.total = data.total;
                    }
                    this.entries = data.data;
                    this.entries.map(function(value, index) {
                        if(typeof value.edit !== 'undefined')
                        {
                            return Object.values(value);
                        }
                        else
                            return value;
                        
                    })
                 });   
            },
        },
        mounted(){
           this.initTable();
        },
    }
</script>

<template>
    <div>
        <div class="float-start">
            <span>Show</span>
            <select v-model="currentEntry" @change="paginateEntries">
                <option v-for="entry in showEntries" :id="entry" :value="entry">{{entry}}</option>
            </select>
            <span>Entries</span>
        </div>
        <div class="float-end">
            <input type="text" class="form-control" v-model="keyword" @keyup="search" />
        </div>
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th scope="col" v-for="th in columns" :key="th.id">
                        <span>{{th.name}}</span>
                        <span class="sort-asc" v-if="sortField == th.item && sortOrder == 'asc'" @click="sort(th.item, 'desc')"><i class="ri-arrow-down-s-fill"></i></span>
                        <span class="sort-desc" v-else-if="sortField == th.item && sortOrder == 'desc'" @click="sort(th.item, 'asc')"><i class="ri-arrow-up-s-fill"></i></span>
                        <span class="sort-nutral" v-else @click="sort(th.item, 'asc')"><i class="ri-arrow-up-down-line"></i></span>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in entries" :key="item.id">
                    <th v-for="key in fields" :key="key" >
                        <span v-if="!key.icon">{{item[key.id]}}</span>
                        <a v-else href="#" @click="redirect(key.url, item.id)" v-html="key.icon"></a>
                    </th>
                </tr>
            </tbody>
        </table>
        <div>
            <div class="float-start">
                Showing <b>{{showing.from}}</b> to <b>{{showing.to}}</b> of <b>{{showing.total}}</b> entries
            </div>
            <nav aria-label="Page navigation example" v-if="havePagination == 1">
                <ul class="pagination justify-content-end">
                    <li class="page-item" v-if="currentPage!=1">
                        <a class="page-link" @click="prev" href="#">Previous</a>
                    </li>
                    <li class="page-item" v-for="n in lastPage" :key="n"><a  href="#" class="page-link" @click="paginate(n)">{{n}}</a></li>
                    <li class="page-item" v-if="currentPage != lastPage">
                        <a class="page-link" @click="next" href="#">Next</a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
  span.sort-nutral{
    margin-left: 5px;
    color:#ddd;
  }
</style>