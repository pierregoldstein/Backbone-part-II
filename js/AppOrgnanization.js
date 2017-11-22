// var todos = {   
//     "total": 25,
//     "per_page": 10,
//     "page": 2,
//     "todo": [
//         {
//             "id": 1,
//             "description": "Pick up milk",
//             "completed": true
//         },
//         {
//             "id": 2,
//             "description": "Pick up butter",
//             "completed": true
//         },
//         {
//             "id": 3,
//             "description": "Do laundry",
//             "completed": false
//         },
//         {
//             "id": 4,
//             "description": "Wash Car",
//             "completed": false
//         }
//     ]
// };

/*** Class naming ***/
/* Everything in the Global Scope */
// var TodoItem = Backbone.Model.extend({});
// var TodoItemView = Backbone.View.extend({});
// var TodoItems = Backbone.Collection.extend({});
// var TodoItemView = Backbone.View.extend({});
// var TodoRouter = Backbone.Routers.extend({});
/* 
- Leads to naming collisions

- Need to put “what kind of object” it
is in the name e.g. “TodoItemView”

- Maintainability doesn’t scale with
large applications 
*/

/*** Use a Global Object for Namespace ***/
/*App is now a View Class ===>*/
var App = new /* Handle Links Outside of Backbone Views */ (Backbone.View.extend({ //Handle Links Outside of Backbone Views
    Models: {},
    Views: {},
    Collection: {},
    events: { //Use View event handling for clicks
        /* Captures only the links we want it to */'click a[data-internal]':function(e){
            e.preventDefault();
            Backbone.history.navigate(e.target.pathname, {
                trigger: true
            });
        }
    },
    // events: { //Use View event handling for clicks
    //     /* Captures all link clicks */'click a':function(e){
    //         e.preventDefault();
    //         Backbone.history.navigate(e.target.pathname, {
    //             trigger: true
    //         });
    //     }
    // },
    /*** Handle Links Outside of Backbone Views ***/
    start: function (bootstrap) {
        /*** Object Initialization ***/
        var todos = new App.Collections.TodoItems(bootstrap.todos);
        var todosView = new App.Views.TodoItems({collection:todos});
        this.$el.append(todosView.render().el);
        todos.fetch(); //Ajax slows down initial render
        // $('a').click(function (e) {
        //     e.preventDefault();
        //     Backbone.history.navigate(e.target.pathname, {
        //         trigger: true
        //     });
        // });
        // Backbone.history.start({
        //     pushState: true
        // });
    },
    /*** Build Initial HTML ***/
    template: _.template('<h1>Todo List</h1>'+
                            '<div id="app"></div>'),
    render:function(){
        this.$el.html(this.template());
    }
}))({el: document.body});//Create instance without creating a class
/*Create a single global object
where everything is stored*/
App.Models.TodoItem = Backbone.Model.extend({});
App.Views.TodoItemView = Backbone.View.extend({});
App.Collection.TodoItems = Backbone.Collection.extend({});
App.Views.TodoItemView = Backbone.View.extend({});
App.TodoRouter = Backbone.Router.extend({}); //Store one-off objects on App

var todoItem = new App.Models.TodoItem({
    urlRoot: '/todos'
}); //Reference classes with the namespace