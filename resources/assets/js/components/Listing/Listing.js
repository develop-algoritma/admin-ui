module.exports = {
    data: function() {
        return {
            pagination : {
                state: {
                    per_page: 10,    // required
                    current_page: 1, // required
                    last_page: 1,    // required
                    from: 1,
                    to: 10           // required
                },
                options: {
                    alwaysShowPrevNext: true
                },
            },
            orderBy: {
                column: 'id',
                direction: 'asc',
            },
            filters: {},
            collection: null,
        }
    },
    props: {
       'url': {
           type: String,
           required: true
       },
       'data': {
           type: Object,
           default: function() {
               return null;
           }
       }
    },
    components: {
       'pagination': require('./Pagination.js'),
       'sortable-th': require('./SortableTh.js'),
    },

    created: function() {
        if (this.data != null){
            this.populateCurrentStateAndData(this.data);
        } else {
            this.loadData();
        }
    },

    methods: {

        sort(newColumn) {
            if (this.orderBy.column == newColumn) {
                this.orderBy.direction = this.orderBy.direction == 'asc' ? 'desc' : 'asc';
            } else {
                this.orderBy.column = newColumn;
                this.orderBy.direction = 'asc'; // I guess we do want to reset direction when changing column, but I'm not sure :)
            }
            this.loadData();
        },

        loadData (resetCurrentPage) {
            let options = {
                params: {
                    per_page: this.pagination.state.per_page,
                    page: this.pagination.state.current_page,
                    orderBy: this.orderBy.column,
                    orderDirection: this.orderBy.direction,
                }
            };

            if (resetCurrentPage === true) {
                options.params.page = 1;
            }

            Object.assign(options.params, this.filters);

            axios.get(this.url, options).then(response => this.populateCurrentStateAndData(response.data.data), error => {
                // TODO handle error
            });
        },

        filter(column, value) {
            if (value == '') {
                delete this.filters[column];
            } else {
                this.filters[column] = value;
            }
            // when we change filter, we must reset pagination, because the total items count may has changed
            this.loadData(true);
        },

        populateCurrentStateAndData(object) {
            // FIXME Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "collection" found in
            this.collection = object.data;
            this.pagination.state.current_page = object.current_page;
            this.pagination.state.last_page = object.last_page;
            this.pagination.state.total = object.total;
            this.pagination.state.per_page = object.per_page;
            this.pagination.state.to = object.to;
            this.pagination.state.from = object.from;
        }
    }

};