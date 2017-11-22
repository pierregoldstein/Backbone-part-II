/*** Using other template engines ***/
/* Views don’t care how you use templates */
var TodoItemView = Backbone.View.extend({
    banana: _.template("<span><%= description %></span" +
        "<em><%= assigned_to %></em>"), //underscore template

    banana: Mustache.compile("<span>{{ description }}</span" +
        "<em>{{ assigned_to }}</em>"), // {{mustache template}}, Mustache doesn’t allow arbitrary js

    render: function () {
        this.$el.html(this.banana(this.model.attributes));
    }
})

/*
Very easy to use other template libraries:

Mustache.js         handlebars
EJS                 Google Clojure      Templates
*/

/*** Using Mustache.js in Backbone View ***/

var MustacheItemView = Backbone.View.extend({
    template: Mustache.compile("<span>{{ description }}</span" +
        "<em>{{ assigned_to }}</em>"),
    render: function () {
        this.$el.hmtl(this.template(this.model.toJSON()));
    }
})

/* Mustache.compile() returns a function just like _.template() */

/*** Mustache.js templates ***/

var jsonObj = {
    "name": "Eric"
};

//underscore.js template
{ /* <li><%= name %></li> */ }

//mustache.js template
{ /* <li>{{name}}</li>   */ }

/* How would you render an array of names? */

/*** Mustache.js Sections ***/

var jsonObjs = {
    "name": ["Eric", "Nate", "Jacob"]
};

//undercore.js template
// <% _.each(names, function(name) { %>
//     <li><%= name %></li>
// <% }); %> <==== Strange and verbose

//mustahce.js template
// {{#names}}
// <li>{{.}}(“.” refers to each string in the array)</li>
// {{/names}}

/*** Mustache.js templates cont. ***/
var people = {
    "people": [{
            name: "Eric",
            haircolor: "brown"
        },
        {
            name: "Nate",
            haircolor: "blonde"
        },
        {
            name: "Jacob",
            haircolor: "blue"
        },
    ]
};

//Underscore.js
/* <% _.each(people, function(person) { %>
    <li><%= person.name %> has <%= person.hairColor %> hair</li>
<% }); %> */

//Mustache.js
/* {{#people}}
    <li>{{ name }} has {{ hairColor }} hair</li>
{{/people}} */

/*** More Mustache.js Sections ***/

// View                        Template                Output 
// ----                        --------                ------
// { "completed": false }      Are you done?           Are you done?
//                             {{#completed}}
//                             <em>Done!</em>
//                             {{/completed}}

// { "names": [] }             <ul>                    <ul></ul>
//                             {{#names}}
//                                 <li>{{.}}</li>
//                             {{/names}}
//                             </ul>

// { "completed": false }      Are you done?           Are you done?<em>Nope!</em>
//                             {{^completed}}
//                             <em>Nope!</em>
//                             {{/completed}}

/*** Mustache.js Function Sections ***/

//View

// {
//     name: "Eric",
//     header: function () {
//         return function (text, render) {
//             return "<h1>" + render(text) + "</h1>";
//         }
//     }
// }

// Template:               Output:

// {{#header}}             <h1>Hello Eric.</h1>
// Hello {{name}}.         
// {{/header}}             

/*** Default RESTful Persistence Strategy ***/

// var todoItem = new TodoItemView({id:1});

// Read
// todoItem.fetch();

// Update
// todoItem.save();

// Delete
// todoItem.destroy();

// Create
// (new TodoItemView({description: "Pickup Kids"})).save();

/*How do we make TodoItem read-only? */

/* Make Read-Only Model */

var TodoItem = Backbone.Model.extend({
    sync:function(method, model, options){
        if(method === "read"){
            Backbone.sync(method, model, options);
        }else{
            console.error("You can not "+ method + " the TodoItem model");
        }
    }
})

// method = "read","create","update", or "delete"
// todoItem.fetch();
// todoItem.save(); You can not update the TodoItem model

/*** Completely Replace Persistence Strategy ***/

var TodoItem = Backbone.Model.extend({
    sync:function(method, model, options){
        options || (options = {});

        switch(method){
            /*Implement the Create Method*/
            case 'create':
                var key = "TodoItem-"+model.id;
                localStorage.setItem(key, JSON.stringify(model));
            break;
            // case 'create':
            // break;
            /*** Implement the Read Method ***/
            case 'read':
                var key = "TodoItem-"+model.id;
                var result = localStorage.getItem(key);
                if(result){
                    result = JSON.parse(result);
                    options.success && options.success(result); 
                }else if(options.error){
                    options.error("Couldn't find TodoItem id=" + model.id);
                }
                break;
            // case 'read':
            // break;
            case 'update':
            break;
            case 'delete':
            break;
        }
    }
})

// (new TodoItem({id: 1, description: "Pickup Kids"})).save()
// Key: TodoItems-1 | Value:{id:1,"description":"Pick up the kids"} 

//How would we replace a server with localStorage?
/*** Persistent Key/Value Store for the Web ***/
// localStorage.setItem(<key>, <value>);
// localStorage.setItem("animal", "Dog");
// localStorage.getItem("animal") --->"Dog"
// localStorage.removeItem("animal")
// localStorage.getItem("animal") undefined
// /*Object Syntax*/
// localStorage["animal"] = "Cat"
// localStorage["animal"] --->"Cat"



