var todos = {   
    "total": 25,
    "per_page": 10,
    "page": 2,
    "todo": [
        {
            "id": 1,
            "description": "Pick up milk",
            "status": "complete"
        },
        {
            "id": 2,
            "description": "Pick up butter",
            "status": "complete"
        },
        {
            "id": 3,
            "description": "Do laundry",
            "status": "incomplete"
        },
        {
            "id": 4,
            "description": "Wash Car",
            "status": "incomplete"
        }
    ]
};



/*** Review Fetching Data from the Server ***/
// var TodoItems = Backbone.Collection.extend({
//     url: todos
// });//URL to get JSON data from

/* populate collection from server */
// var todoItems = new TodoItems();
// todoItems.fetch();
// console.log(todoItems.length);

/*** Handling non-standard Response from Server ***/

// var TodoItems = Backbone.Collection.extend({ 
//     parse: function(response){
//         return response;        //Wrong way
//     }
// });

// var todoItems = new TodoItems();
// todoItems.toJSON();
// console.log(todoItems.parse());

/* (cont...)Handling non-standard Response from Server */
var TodoItems = Backbone.Collection.extend({
    // Sorting Collections by Comparator
    // comparator:'status',
    // Sorting Collections by function
    comparator:function(todo1, todo2){
        return todo1.get('status') < todo2.get('status'); //Sort by status in reverse order
    },
    // Aggregate Values
    completedCount:function(){
        return this.where({status:'complete'}).length; // Returns filtered array of models
    },
    parse:function(response){
        this.perPage = response.per_page;
        this.page = response.page;
        this.total = response.total;
        return response.todos;
    },
    url:todos
});

// var todoItems = new TodoItems();
// todoItems.toJSON();
// todoItems.fetch();

/* Review our Collection View */
var TodoView = Backbone.View.extend({
    // Render the Next Link
    template:_.template('<a href="#/todos/p<%= page %>">next page</a>'),
    intialize:function(){
        this.collection.on('reset',this.render,this);
    },
    render:function(){
        this.addAll();
        // Render the Next Link
        this.$el.append(this.template({page: this.collection.page + 1}));
        return this;
    },
    addAll:function(){
        this.$el.empty();
        this.collection.forEach(this.addOne);
    },
    addOne:function(todoItem){
        var todoView = new TodoView({model:todoItems});
        this.$el.append(todoView.render().el);
    }
});

/* Review our Router */

var TodoApp = new (Backbone.Router.extend({
    routes:{
        // Implementing the Page Route
        "todos/todos.json/p:page":"page",
        "":"index"
    },
    // Implementing the Page Route
    page:function(page){
        this.todoItems.fetch({data:{page:page}});
    },
    intialize:function(){
        this.todoItems = new TodoItems();
        this.todoView = new TodoView({collection: this.todoItems});
        this.todoView.render();
        $('#app').append(this.todoView.el);
    },
    index:function(){
        this.todoItems.fetch();
    }
}))