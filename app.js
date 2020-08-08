
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');


//Include the date.js module
// const date = require(__dirname+ "/date.js");

// Connect to mongoDB
mongoose.connect('mongodb+srv://jdog1010:Liftingislife123-@cluster0.px1dq.mongodb.net/todolistDB?retryWrites=true&w=majority', {useNewUrlParser: true});


const itemsSchema = new mongoose.Schema({name: String}); // Schema for home route input items
const Item = new mongoose.model('Item', itemsSchema); // Model for items

// Default items 
const item1 = new Item  ( {name: 'Welcome to your ToDoList'} ); 
const item2 = new Item ( {name: 'Hit the + button to aff a new item'} );
const item3 = new Item ( {name: '<-- Hit this to delete item'} );
const defaultItems = [item1, item2, item3]; // Array of the default items

// Schema for seperate URL's
const listSchema = mongoose.Schema({
    name:String,
    items: [itemsSchema]
});
const List = mongoose.model('List', listSchema); // Model for seperate URL's

app.use(bodyParser.urlencoded({extended:true})); // Parse user input
app.use(express.static("public")); // Serve static CSS File
app.set('view engine', 'ejs'); // Set EJS as Template Engine - static file

// Home route get function
app.get("/", (req, res)=>{
    
    Item.find({}, (err, foundItems)=>{  // find default items
        if(foundItems.length === 0){ // if list is null then create new default items
            Item.insertMany(defaultItems, (err)=>{ // Insert default items
                if(err){
                    console.log(err);  
                }
                else{ 
                    console.log('successful update'); 
                }
            });
            res.redirect('/'); // redirect items to home route
        }
        else{ // render EJS file 'list', display title and send list of defaults items
            res.render("list", {listTitle: 'Today', newListItems: foundItems});
        }
    });
});

app.post("/", (req,res) =>{ // Home direct post function

    const itemName = req.body.newItem; // User input item
    const listName = req.body.list; // list name where button is clicked
    const item = new Item({ // new item created for new collection
        name: itemName
    });

    if(listName === 'Today'){ // if title = home route, save items and redirect it to home route
        item.save();
        res.redirect('/');
    }
    else{
        List.findOne({name:listName}, (err,foundList)=>{ // find title name and store userinput in new route
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+ listName); // display in new route
        });
    }
});

app.get("/:customListName", (req,res)=>{ // New custom route by user input

    const customListName =_.capitalize(req.params.customListName); // get userinput from url subquery and auto cap

    List.findOne({name: customListName}, (err, foundList)=>{ // find custom URL name, if no list in custom route -- create a new list

        if(!err){
            if(!foundList)
            {
                const list = new List({    // Create a new List
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect('/' + customListName); // redirect items to custom URL
            }
            else
            {
                //Show an existing list
                res.render("list",  {listTitle: foundList.name, newListItems: foundList.items})
            }
        }

    });
});

// This post will push the items and redirect to the home direc app.post function 
app.post("/work", (req,res)=>{
    const item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});

app.get("/about", (req, res)=>{
    res.render("about");
});

app.post('/delete', (req,res)=>{ // delete items

    const checkedItemId = (req.body.checkbox); // checkbox validation
    const listName = req.body.listName; // get title name

    if(listName === 'Today'){ // if home route then delete items from there
        
    Item.deleteOne({_id: checkedItemId}, (err)=>{ // delete item
        if(err)
        {
            console.log(err)
        }
        else
        {
            console.log("Succesful Delete!");
            res.redirect('/'); // redirect // update deletion
        }
    });
}
else
{
    // find the title name // pull the item id thats been checked
    List.findOneAndUpdate({name:listName}, {$pull: {items: {_id:checkedItemId}}}, (err, foundList)=>{
        if(!err){
            res.redirect('/' + listName); // refresh new list
        }
        });

    }
});

app.listen(3000, ()=>{
    console.log("Started!");
}); 