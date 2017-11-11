/*** Real Routes ***/
/* Optional RoutesSearch route with query and optional page parameter */
var TodoRouter = new (Backbone.Router.extend({
    routes:{
        'search/:query':'search',
        'search/:query/p:page':'search' //Duplicate routes
    },
    search: function(query,page){
        page = page || 0;
        console.log(query);
        console.log(page);
    }
}));

TodoRouter.navigate('search/milk',{trigger: true});
TodoRouter.navigate('search/milk/p2',{trigger: true});

/*** Optional Routes ***/

var TodoRouter = new (Backbone.Router.extend({
    routes: {
        'search/:query(/p:page)(/)':'search', //Optional trailing slash
    },
    search:function(query,page){
        page = page || 0;
        console.log(query);
        console.log(page);
    }
}));

TodoRouter.navigate('search/milk/p2',{trigger: true});

/*** URI with Spaces Gotcha ***/

var TodoRouter = new (Backbone.Router.extend({
    routes: {
        'search/:query(/p:page)':'search',
    },
    search:function(query, page){
        page = page || 0;
        query = decodeURIComponent(query);
        console.log(query);
        console.log(page);
    }
}));

TodoRouter.navigate('search/Hello%20World/p2',{trigger: true});

/*** Regex in Routes ***/
/* Restrict parameter to numeric input */
var TodoRouter = new (Backbone.Router.extend({
    // routes:{
    //     'todos/:id':'show'
    // },
    intialize:function(){
        this.route(/^todos\/(\d+)$/, 'show');// Keep routes inside the router
    },
    show:function(id){
        console.log("id = "+id);
    }
}));

TodoRouter.route(/^todos\/(\d+)$/, 'show'); // Each Regex Capture Group becomes a param
TodoRouter.navigate('todos/2',{trigger:true});
TodoRouter.navigate('todos/notanid',{trigger:true});

/*** Advanced Regex Routes ***/

console.log("http://www.regexper.com/");

/*** Catch-all Routes ***/
/* Alert user when no route matches */

var TodoRouter = Backbone.Router.extend({
    routes:{
        '*path':'notFound'
    },
    notFound: function(path){
        alert('Sorry, no content here!');
    }
});

TodoRouter.navigate("nothinghere",{trigger:true});

/*** File Path Route ***/

var TodoRouter = new (Backbone.Router.extend({
    routes:{
        'file/*path':'file'
    },
    file:function(path){
        var parts = path.split("/");
        console.log(parts);
    }
}));
TodoRouter.navigate("file/this/is/a/file.txt", {trigger: true});