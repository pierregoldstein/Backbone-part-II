/*** Convert to using Backbone ***/
var TodoItem = Backbone.Model.extend({
    urlRoot:'/todos'
});
var todoItems = new TodoItem({
    description:"What do you need to do?"
});
todoItems.save({description:"Picking up the kids"});

/*** What about the form? ***/

/*** Build Form with Backbone View ***/

var TodoForm = Backbone.View.extend({
    template:_.template('<form>' +
    '<input name=description value="<%= description %>" />' +
    '<button>Save</button></form>'),
    /*** Capture Button Click to Save Model ***/
    events:{
        'click button':'save',
        submit:'save' //How do we save when pressing enter?
        /*Will call save on either click or
        pressing Enter/Return*/
    },
    
    save:function(e){
        e.preventDefault(e);
        var newDescription = this.$('input[name=description').val();
        this.model.save({description:newDescription},{
            success:function(model, response, options){
                Backbone.history.navigate('',{trigger:true});
            },
            /*** Alert User to save error ***/
            error:function(model,xhr,options){
                var errors = JSON.parse(xhr.responseText).errors;
                alert('opps! Something went wrong with TodoItem: '+errors);
            }
        }); //POST /todos => { description: 'Pickup Kids.' }
        /*** Get Back to the List after saving ***/
        //Backbone.history.navigate('',{trigger:true}); // <==== We should only call this if the model saved successfully
    },
    render:function(){
        this.$el.html(this.template(this.model.attributes));
        return this;
    }
});

var todoForm = new TodoForm({
    model:todoItem
});
$('#app').html(todoForm.render().el);

/*** Reusing Form to Edit existing TodoItem ***/
var todoItem = todoItems.get(1);//Get existing TodoItem from already fetched collection
var editTodoForm = new TodoForm({model:todoItem});//Pass in existing model
$('#app').html(editTodoForm.render().el);//Replace #app with the HTML of the form

/*** Review of our App’s Router ***/
var TodoApp = new (Backbone.Router.extend({
    routes:{
        "":"index",
        "todos/:id/edit":"edit", //Add Route to render New Form
        "todos/new":"newTodo" //Add Route to render New Form
    },
    initialize:function(){
        this.todoItems = new TodoItems();
        this.todosView = new TodoView({collection:this.todoItems});
    },
    index:function(){
        this.todoItems.fetch();
        $('#app').html(this.todosView.render().el);
    },
    edit:function(id){
        var todoForm = new TodoForm({model:todoItem.get(id)});
        $('#app').html(todoForm.render().el);//Add Route to render New Form
    },
    newTodo:function(){
        var todoItem = new TodoItem({description:"What do you need to do?"});
        var todoForm = new TodoForm({model:todoItem});
        $('#app').append(todoForm.render().el);//Add Route to render New Form
    }
}));
/* Let’s add a route to render the
TodoForm with an existing TodoItem */

/******************************************/


