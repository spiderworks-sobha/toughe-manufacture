import axios from 'axios';
const tableMixin = {
    data(){
        return {
            showProcessing: 0,
            currentEntry: 10,
            havePagination: 0,
            showing: {
                form: null,
                to: null,
                total: null,
            },
            entries: [],
            currentPage: 1,
            lastPage: 1,
            keyword: '',
            sortField: '',
            sortOrder: '',
            paginationKey: 0,
            fields: [],
            is_searched: 0,
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
        advanced_search(){
            this.is_searched = 1;
            this.currentPage = 1;
            this.fetchData();
        },
        clear_advanced_search(){
            if(typeof this.adv_search !== 'undefined'){
                for (var key in this.adv_search) {
                    if (this.adv_search.hasOwnProperty(key)) {
                        this.adv_search[key] = null;
                    }
                }
                if(typeof this.date_from !== 'undefined')
                    this.date_from = null;
                if(typeof this.date_to !== 'undefined')
                    this.date_to = null;
                if(this.is_searched){
                    this.is_searched = 0;
                    this.currentPage = 1;
                    this.fetchData();
                }
            }
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
            this.currentPage = 1;
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
            if(typeof this.adv_search !== 'undefined'){
                for (var key in this.adv_search) {
                    if (this.adv_search.hasOwnProperty(key)) {
                        if(this.adv_search[key]){
                            get_url = get_url+'&'+key+'='+this.adv_search[key];
                        }
                    }
                }
            }
            this.showProcessing = 1;
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
                this.paginationKey += 1;
                this.showProcessing = 0;
             });   
        },
    },
    mounted(){
       this.initTable();
    },
};

export default tableMixin;