// Reviewing how Model Data is Fetched from Server
// var TodoItem = Backbone.Model.extend({urlRoot:'/todos/todos.json'}); //RESTful Web Service (Rails Flavor)
// Fetch todo with id = 1
// var todoItem = new TodoItem({todo:{id:1}});
// console.log(todoItem.fetch());

// Parsing non-standard JSON into your Models

var TodoItem = Backbone.Model.extend({
    // Default Backbone just returns response
    parse:function(response){
        // return response.todo;
        // Changing Attribute Names
        response = response.todo;
        response.description = response.desc;
        delete response.desc;
        return response;
    },
    //Overriding the toJSON Function
    toJSON:function(){
        // return {todo:_.clone(this.attributes)};
        // returns an object with only the ‘desc’ and ‘status’ properties
        var attrs = _.clone(this.attributes);
        attrs.desc = attrs.description;
        attrs = _.pick(attrs, 'desc', 'status');
        return {todo: attrs};
    },
    idAttribute: '_id'
});

// var todoItem = new TodoItem();

// console.log(todoItem.attributes);

// Instantiating Models doesn’t call Parse by Default
var todoItem = new TodoItem({
    todo:{ id:1, description: 'Pick up milk', status: 'incomplete' }},
    {parse:true}
);

console.log(todoItem.attributes);

//Sending JSON back to the Server
// todoItem.set({description:'Pick up cookies'});
todoItem.toJSON();
todoItem.save();

// Render View with Attributes
var TodoView = Backbone.View.extend({
    render:function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});
// Unconventional ID Attribute
var todoItem = new TodoItem({id:1});
todoItem.fetch();
todoItem.id;
