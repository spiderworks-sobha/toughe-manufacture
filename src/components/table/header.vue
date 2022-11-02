<script>
    export default{
        data(){
            return {
                showEntries: [10, 25, 50, 75, 100],
                currentEntry: 10,
                keyword: '',
            }
        },
        methods: {
            paginateEntries(){
                this.$parent.currentEntry = this.currentEntry;
                this.$parent.paginateEntries();
            },
            search(){
                this.$parent.keyword = this.keyword;
                this.$parent.search();
            },
        },
    }
</script>
<template>
    <div class="mb-2 clearfix">
        <div class="float-start">
            <span>Show </span>
            <select v-model="currentEntry" @change="paginateEntries">
                <option v-for="entry in showEntries" :id="entry" :value="entry">{{entry}}</option>
            </select>
            <span> Entries</span>
        </div>
        <div class="float-end">
            <input type="text" class="form-control" v-model="keyword" @keyup="search" placeholder="Search Here..." style="width:200px" />
        </div>
    </div>
</template>