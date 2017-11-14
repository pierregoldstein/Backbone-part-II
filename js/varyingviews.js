var TodoItem = Backbone.Model.extend({
    parse: function (response) {
        response = response.todo;
        response.description = response.desc;
        delete response.desc;
        return response;
    },
    toJSON: function () {
        var attrs = _.clone(this.attributes);
        attrs.desc = attrs.description;
        attrs = _.pick(attrs, 'desc', 'status');
        return {
            todo: attrs
        };
    },
    idAttribute: '_id',
    url: 'todos/todos.json'
});

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
    url:'todos/todos.json'
});

var collection = new TodoItem();
var todoItem = new TodoItem();
var todoList = new TodoItems();

/*** View Initialization Options Review ***/
/* Pass in the model */
// var todoView = new TodoView({
//     model : todoItem //todoView.model == todoItems
// });

// or the collection
// var todoView  = new TodoView({
//     collection: todoItems //todoView.collection == todoItems
// });

/* What other options
can you pass into View
initialization? */

/* Using Existing DOM Elements */

// var TodoView  = Backbone.View.extend({
//     template: _.template("<%= description = %>"),
//     render: function(){
//         this.$el.hmtl(this.template(this.model.attributes)); // var todoView = new TodoView({model:todoItem, el: $('.todo)});
//         return this;
//     },
//     // Access extra options in initialize
//     initialize: function(options){
//         this.user = options.user;
//     }
// });

// var todoView = new TodoView({model:todoItem});
// $('.todo').html(todoView.render().el);

// var todoView = new TodoView({model:todoItem, el: $('.todo')});
// todoView.render();

/* Custom Initialization Options */
// Pass in an extra option

var todoView = new TodoView({
    model: todoItem,
    user: currentUser
});

todoView.render();

/* Escaping User Content */
// Rendering user supplied strings can lead to XSS attack

var TodoView = Backbone.View.extend({
    // Rendering user supplied strings can lead to XSS attack
    // template: _.template('<%= description %>'),
    // template: _.template('<%= model.escape("description") %>'),
    template: _.template('<span><%= description %><span>'),
    initialize: function(){
        this.model.on('change:description', this.change, this);
    },
    render: function(){
        this.$el.html(this.template(this.model.attributes/*{model:this.model}*/));
        // return this;
    },
    // Passing extra options to event handlers
    change:function(model, value, options){
        this.$('span').html(value);
        // this.$el.effect("highlight",{},1000);
        // How do we stop just the highlight from happening?
        if(options.highlight !== false){
            this.$el.effect("highlight",{},1000);
        }
    }
});

var todoView = new TodoView({model:todoItem});

todoItem.set('description', "<script src='attack.js");
todoView.render().el;

todoItem.set({description:"Pickup Kids"});
//How do make a change without firing off events?
todoItem.set({description:"Pickup Kids"}, {silent:true});

todoItem.setZ({description:"Pickup Kids"}, {highlight})

/* View Event Cleanup */
var TodoView = Backbone.View.extend({
    initialize: function(){
        this.model.on('change',this.number, this);
    }
});
todoView.remove(); // X Model still holds reference to view

var TodoView = Backbone.View.extend({
    remove:function(){
        Backbone.View.prototype.remove.apply(this,arguments);
        this.model.off(null,null,this);
    }
});

// View “listens to” a model
var TodoView = Backbone.View.extend({
    initialize: function(){
        this.listenTo(this.model,'change',this.render);
    }
});

// Stop all listeners for this view
todoView.stopListening();

// Will automatically call stopListening()
todoView.remove();

