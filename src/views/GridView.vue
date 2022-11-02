<script>
import { Grid, h } from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import store from "@/state/store";

export default {
  components: {},
  props: {
    columns: {},
    url: '',
  },
  methods: {
    init_grid(){
        let title_columns = [];
        let sort_columns = [];

        this.columns.forEach((value, index) => {
            let item = {};
            item.name = value.name;
            if(typeof value.sort !== 'undefined' && value.sort == false)
                item.sort = false;
            
            if(typeof value.search !== 'undefined' && value.search == false)
                item.search = false;

            if(typeof value.hidden !== 'undefined' && value.hidden == true)
                item.hidden = true;

            if(typeof value.html !== 'undefined')
                item.formatter = true;

            title_columns.push(item);
            if(typeof value.sort === 'undefined' || value.sort == true)
                sort_columns.push(value.item);

           
            
        });

        const grid = new Grid({
            pagination: {
                enabled: true,
                limit: 10,
                server: {
                    url: (prev, page, limit) => {
                        if(prev.indexOf('?') === -1)
                            return `${prev}?limit=${limit}&page=${page+1}`;
                        else
                            return `${prev}&limit=${limit}&page=${page+1}`;
                    }
                }
            },
            search: {
                server: {
                    url: (prev, keyword) => {
                        if(prev.indexOf('?') === -1)
                            return `${prev}?search=${keyword}`;
                        else
                            return `${prev}&search=${keyword}`;
                    }
                }
            },
            sort: {
                multiColumn: false,
                server: {
                    url: (prev, columns) => {
                        if (!columns.length) return prev;
                
                        const col = columns[0];
                        const dir = col.direction === 1 ? 'asc' : 'desc';
                        let colName = sort_columns[col.index];

                        if(prev.indexOf('?') === -1)
                            return `${prev}?sort_field=${colName}&sort_order=${dir}`;
                        else
                            return `${prev}&sort_field=${colName}&sort_order=${dir}`;
                    }
                }
            },
            columns: title_columns.map(function(value){
                if(typeof value.formatter !== 'undefined')
                {
                    value.formatter = function(cell, row){
                        return h('button', {
                            className: 'btn btn-sm btn-primary',
                            onClick: () => render_btn()
                        }, 'Edit');
                    }
                    /*value.formatter = (cell, row) => {
                        return this.$gridjs.h('button', {
                            className: 'py-2 mb-4 px-4 border rounded-md text-white bg-blue-600',
                            onClick: () => alert(`Editing "${row.cells[0].data}" "${row.cells[1].data}"`)
                        } 'Edit');
                    };*/
                    //value.formatter = (cell) => h('div', 'message');
                }
                return value;
            }),
            server: {
                url: this.url,
                data: (opts) => {
                    return new Promise((resolve, reject) => {
                        const xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function() {
                        if (this.readyState === 4) {
                            
                            if (this.status === 200) {
                                const resp = JSON.parse(this.response);
                                var myArray = resp.data.data.map(function(value, index) {
                                    return Object.values(value);
                                });
                                resolve({
                                    data: resp.data.data.map(function(value, index) {
                                        if(typeof value.edit !== 'undefined')
                                        {
                                            value.edit = '<a data-href="/'+value.edit.url+'/create" v-on:click="render_btn" class="btn btn-sm btn-primary">'+value.edit.icon+'</a>';
                                        }
                                        return Object.values(value);
                                    }),
                                    total: resp.data.total,
                                });
                            } else {
                                reject();
                            }
                        }
                        };
                        xhttp.open("GET", opts.url, true);
                        xhttp.setRequestHeader('Authorization', 'Bearer '+store.getters["auth/user"].auth_token);
                        xhttp.send();
                    });
                }
            },
        });
        grid.render(this.$refs.wrapper);
    },
    render_btn(event){
        console.log('kkk')
    }
  },
  mounted(){
    this.init_grid();
  }
};
function render_btn()
{
    console.log('kkk')
}
</script>
<template>
  <div ref="wrapper"></div>
</template>
