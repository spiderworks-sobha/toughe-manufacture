<script>
    export default{
        props: {
            showing: {},
            havePagination: 0,
            currentPage: 0,
            lastPage: 0,
        },
        methods: {
            paginate(n){
                this.$parent.paginate(n);
            },
            next(){
                this.$parent.next(n);
            },
            prev(){
                this.$parent.prev(n);
            },
        },
    }
</script>
<template>
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
</template>