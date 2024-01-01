const express        = require('express');
const path           = require('path');
const monk           = require('monk');
const bp             = require('body-parser');
const app            = express();
const PORT           = process.env.PORT || 2023;
var db               = monk('mongodb://localhost:27017/RentBoys');
const gamecollection = db.get("Property");
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt         = require('bcrypt');
const passport       = require('passport');
const session        = require('express-session');
const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/RentBoys';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db1 = mongoose.connection;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });




app.use(session({
  secret: 'ashwin-key',
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bp.json());
const users = db.get('UserDB');

db.on('open',() => {
        console.log("Connected to Mongodb successfully.");
});

db.on('error',(err)=>{
        console.error("Error conencting to MongoDB: ",err);
});

app.get('/', (req, res) => {
    console.log(req.url);
    res.redirect("/home");
    console.log("hey here");
});

app.get('/home', async (req, res) => {
    console.log("hey!!");
    res.sendFile(path.join(__dirname, 'public', 'LandingPage_HTML.html'));    
});

app.get('/signup', async (req, res) => {
    if (req.isAuthenticated())
        {
            console.log("already authenticated");
        }
    else
        {
           console.log("hey sign uup!!");
           res.sendFile(path.join(__dirname, 'public', 'signup_page.html')); 
        }
        
});

passport.use(new LocalStrategy(function(username, password, done) 
  {
    users.findOne({ username: username.toLowerCase() }, function (err, user) 
    {
      if(user!=null)
        {
          if (err) 
              { return done(err); }
          
           bcrypt.compare(password, user.password, (err, result) => 
           {
              if (result === true) 
                {
                  return done(null, user, 'User & Password matches! OK');
                } 
              else 
                {
                  return done(null, false, 'Incorrect Password!');
                }
            });         
        }
      else
        {
          return done(null, false, "User does not exist!");
        }
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  users.findOne({ _id: id }, (err, user) => {
    done(err, user);
  });
});

app.post('/register', async (req, res) => {
  const newUser = {
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  };
  newUser['cart'] = {};
  newUser['address'] = "";
  newUser['Phone'] = "";
  newUser['currentStay'] = "";

  console.log(newUser['password'],newUser['username'],newUser['firstname'],newUser['lastname']);
  if (req.isAuthenticated()) 
    {
       console.log("User already authenticated!");
       // res.redirect('/dashboard');
       res.json({message:"User already logged in!"})
    }
  else 
    {
        const user_records = await users.find({username:newUser['username'].toLowerCase()});

        console.log("Same username exist : ",Object.keys(user_records).length);

        if(Object.keys(user_records).length == 0)
          {
            const hashedPassword = await bcrypt.hash(newUser['password'], 10);
            newUser['password'] = hashedPassword;
            newUser['username'] = newUser['username'].toLowerCase();

            users.insert(newUser, (err, user) => {
            if (err) 
              {
                console.error(err);
                res.json({message:'Error registering user!'});
              }
            // res.redirect('/dashboard');
              res.json({message:"Account Created Successfully."});
            });
          }
        else if(Object.keys(user_records).length != 0)
          {
            console.log("User "+newUser['username']+" already exists!");
            res.json({message:"User name already exists!"});
          }    
    }

});

app.post('/validate', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    req.logIn(user, (err) => 
      {
        console.log(info);
        if (err) 
          {
            // return res.redirect('/login');
            res.json({message:info});
          }
        else
          { 
            // return res.redirect('/dashboard');
            res.json({message:info});
          }
      });
  })(req, res, next);
});

app.get('/propertylist/home/:id', async (req, res) => {
        if (req.isAuthenticated()) 
            {
                console.log("hey!!");
                res.sendFile(path.join(__dirname, 'public', 'property_list.html'));
            } 
        else
            {
                console.log("Not logged IN");
            }       
     
});

app.get('/propertylist/profile/:id', async (req, res) => {
    if (req.isAuthenticated()) 
        {
            console.log("hey user profile here!!");
            res.sendFile(path.join(__dirname, 'public', 'user_profile.html'));     
        }
     else
        {
            console.log("Not logged IN");
        }  
   
});


app.get('/propertylist/search', async (req, res)=>
        {
            if (req.isAuthenticated())
                {

                    try
                        {
                            var data_dict = req.query;
                            console.log("Search option");
                            console.log(data_dict);
                            const games = await gamecollection.find({});
                            var games_filtered = {};                    
                            var filter_types = [];
                            var numBHK = [];

                            if(data_dict['bhk'] == 'No Filter' && data_dict['title'] == '' && data_dict['type'] == 'No Filter')
                                {
                                    console.log("Title & Type are empty");
                                    // res.json(games);
                                    var i = 0;
                                    games_filtered = JSON.parse(JSON.stringify(games));

                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                        }
                                }
                            if(data_dict['bhk'] == 'No Filter' && data_dict['title'] == '' && data_dict['type'] != 'No Filter')
                                {
                                    console.log('Type not empty!');
                                    var i = 0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            if(games[key]['type'].toLowerCase().includes(data_dict['type']))
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Type:");
                                    console.log(games_filtered);
                                }
                            if(data_dict['bhk'] == 'No Filter' && data_dict['title'] != '' && data_dict['type'] == 'No Filter')
                                {
                                    console.log('Title not empty!');
                                    var i=0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            if(games[key]['name'].toLowerCase().includes(data_dict['title'].toLowerCase()))
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Name:");
                                    console.log(games_filtered);
                                }
                            if(data_dict['bhk'] == 'No Filter' && data_dict['title'] != '' && data_dict['type'] != 'No Filter')
                                {
                                    console.log('Both not empty!');
                                    var i = 0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            val1 = games[key]['name'].toLowerCase().includes(data_dict['title'].toLowerCase());
                                            val2 = games[key]['type'].toLowerCase().includes(data_dict['type']);

                                            if(val1 && val2)
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Name & Type:");
                                    console.log(games_filtered);
                                }

                            if(data_dict['bhk'] != 'No Filter' && data_dict['title'] == '' && data_dict['type'] == 'No Filter')
                                {
                                    console.log("Title & Type are empty");
                                    // res.json(games);
                                    var i = 0;
                                    // games_filtered = JSON.parse(JSON.stringify(games));

                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            console.log(games[key]['BHK'],data_dict['bhk']);
                                            if(games[key]['BHK'] == data_dict['bhk'])
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                }
                            if(data_dict['bhk'] != 'No Filter' && data_dict['title'] == '' && data_dict['type'] != 'No Filter')
                                {
                                    console.log('Type not empty!');
                                    var i = 0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            if(games[key]['type'].toLowerCase().includes(data_dict['type']) && games[key]['BHK'] == data_dict['bhk'])
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Type:");
                                    console.log(games_filtered);
                                }
                            if(data_dict['bhk'] != 'No Filter' && data_dict['title'] != '' && data_dict['type'] == 'No Filter')
                                {
                                    console.log('Title not empty!');
                                    var i=0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            val3 = games[key]['BHK'].toLowerCase().includes(data_dict['bhk']);
                                            i++;
                                            if(games[key]['name'].toLowerCase().includes(data_dict['title'].toLowerCase()) && games[key]['BHK'] == data_dict['bhk'])
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Name:");
                                    console.log(games_filtered);
                                }
                            if(data_dict['bhk'] != 'No Filter' && data_dict['title'] != '' && data_dict['type'] != 'No Filter')
                                {
                                    console.log('Both not empty!');
                                    var i = 0;
                                    for(var key in games)
                                        {
                                            filter_types[i] = games[key]['type'].toLowerCase();
                                            numBHK[i] = games[key]['BHK'];
                                            i++;
                                            val1 = games[key]['name'].toLowerCase().includes(data_dict['title'].toLowerCase());
                                            val2 = games[key]['type'].toLowerCase().includes(data_dict['type']);
                                            val3 = games[key]['BHK'].toLowerCase().includes(data_dict['bhk']);

                                            if(val1 && val2 && games[key]['BHK'] == data_dict['bhk'])
                                                {
                                                    console.log(games[key]['name']);
                                                    games_filtered[Object.keys(games_filtered).length] = games[key];
                                                }

                                        }
                                    console.log("Filtered by Name & Type:");
                                    console.log(games_filtered);
                                }

                            var response_str = '';
                            
                            const unique_types = new Set(filter_types);
                            const unique_BHK   = new Set(numBHK);
                            unique_types.add("No Filter");
                            unique_BHK.add("No Filter");
                            BHK_array = Array.from(unique_BHK);

                            
                            response_str += '<link rel="stylesheet" href="../Resources/css_propertylist.css"></link> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"> <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script> <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script> <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"> <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"> <script src="https://code.jquery.com/jquery-2.2.4.min.js" type="text/javascript"></script>';
                            response_str += '<div id="Home_page">';
                            response_str += '<nav class="navbar navbar-light bg-light"><div class="container-fluid" style="display: flex; justify-content: flex-end;"><a class="navbar-brand" href="#"><i class="bi bi-cart-plus"></i>My Cart</a></button><button class="navbar-brand" style="border:none; background: whitesmoke;"><i class="bi bi-person-circle"></i></button><button class="navbar-brand" style="border:none; background: whitesmoke;" onclick="user_profile()" id="user_name">'+data_dict['uid']+'</button><button class="navbar-brand" style="border:none; background: whitesmoke;" onclick="logout()" id="logout_button">Logout</button></div></nav>';
                            response_str += '<div id="upper-part" style="float: left; width: 20%;">';
                            response_str += '<a href="/propertylist/home/'+data_dict['uid']+'" id="home_link">Home</a>';
                            response_str += '<h1> Property Page</h1>';
                            response_str += '<p>Search for your dream house.</p>';
                            response_str += '<form action="/game/new" method="GET">';
                            // response_str += '<button type="submit" class="btn btn-primary" id="add_button">Add new game</button>';
                            response_str += '</form>';
                            response_str += '<p><i>Name of Community:</i></p>';
                            response_str += '<input type="text" name="sampletext" id="search_box" placeholder="name" value='+data_dict['title']+'></input>';
                            response_str += '<p><i>House Type:</i></p>';
                            response_str += '<select name="type_filter" id="filter">';
                            unique_types.forEach(function(value)
                                    {           
                                        if(value == data_dict['type'])
                                                {
                                                    response_str += "<option value='"+value+"' selected>"+value+"</option>";
                                                }
                                        else
                                                {
                                                    response_str += "<option value='"+value+"'>"+value+"</option>";
                                                }
                                    }
                                )                
                            response_str += '</select>';
                            response_str += '<p><i>Bedrooms-Bathrooms:</i></p>';
                            response_str += '<select name="type_BHK" id="BHK_filter">';
                            BHK_array.sort().forEach(function(value)
                                    {           
                                        if(value == data_dict['bhk'])
                                                {
                                                    console.log("sel : "+value);
                                                    response_str += "<option value='"+value+"' selected>"+value+"</option>";
                                                }
                                        else
                                                {
                                                    response_str += "<option value='"+value+"'>"+value+"</option>";
                                                }
                                    }
                                )                
                            response_str += '</select>';
                            response_str += '<button type="button" onclick="search_function()" class="btn btn-info" style="margin: 10px;">Search</button>';
                            response_str += '</div>';
                            response_str += '<div class="grid-container" id="demo" style="float: right; width: 80%">';

                            for(var key in games_filtered)
                                        {
                                            console.log(key);
                                            console.log("in here");
                                            response_str += "<div id='div-content'><div class='grid-item'><img src='../"+games_filtered[key]['image']['path']+"' alt='"+games_filtered[key]['name']+"' width='200px;' height='200px;'></img></div><a href='/propertylist/"+data_dict['uid']+"/"+games_filtered[key]['_id']+"' >"+games_filtered[key]['name']+"</a></div>";                                    
                                        }

                            response_str += '</div>';
                            response_str += '</div>';
                            response_str += '<script type="text/javascript" src="../Resources/javascript_search.js"></script>';

                            res.send(response_str);

                        }
                    catch (err)
                    {
                        console.error("Error Searching from Mongodb: ",err);
                        res.status(500);
                    }
                }
            else
                {
                     console.log("Not logged IN");
                }
        }
    );

app.get('/propertylist/home/:id/mycart', async (req, res) => {
    if (req.isAuthenticated())
        {
           console.log("hey!! mycart");
           res.sendFile(path.join(__dirname, 'public', 'cart_page.html')); 
        }
    else
        {
            console.log("Not logged IN");
        }
        
});


app.get('/propertylist/:id/:id1', async (req, res)=> {

    if (req.isAuthenticated())
        {            
            console.log("here with id1!"); 
            try
            { 
                console.log(req.params.id);
                console.log(req.params.id1);
                const a = req.params.id1;
                const findone_content = await gamecollection.findOne({_id:a});
                console.log(findone_content);
                var details = "";    
                details += '<link rel="stylesheet" type="text/css" href="../../Resources/css_propertyview.css">';
                details += '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"><script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script><script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">';
                details += "<div id='point'></div>";        
                // details += "<div style='text-align: center;'></br><h2>"+findone_content['name']+"</h2> <img src='/"+findone_content['image']['path']+"' alt='"+findone_content['image']['description']+"' width=500px; height=500px; title='"+findone_content['image']['description']+"'></img>";
                // details += "<p>Name : "+findone_content['name']+"</p>";
                // details += "<p>Description : "+findone_content['description']+"</p>";
                // details += "<p>Type : "+findone_content['type']+"</p>";
                // details += "<p>BHK : "+findone_content['BHK']+"</p>";
                // details += "<p>Pricing (half-yearly) : "+findone_content['pricing']['half-yearly']+"</p>";
                // details += "<p>Pricing (yearly) : "+findone_content['pricing']['yearly']+"</p>";
                // details += "</br></br><div><a href='/propertylist/"+a+"/AddtoCart' style='background-color: orange; border: 2px Solid orange; padding: 10px; border-radius: 10px; text-decoration: none; color: black;'>AddtoCart</a>"
                // details += "</br></br><a href='/propertylist' style='text-decoration: none; color:blue;'>Back to List</a></div>"
                details += "<script type='text/javascript' src='../../Resources/javascript_propertyview.js'></script>"        
                
                console.log("hhh");
                console.log(req.url);
                res.send(details);
            }
            catch(e)
            {
                console.log(e);
                console.log("Crash!");
            }
        }
    else
        {
            console.log("Not logged IN");
        }

});

app.get('/readDB', async (req, res)=>
        {
            if (req.isAuthenticated())
                {
                    try
                        {
                            console.log("in readDB");
                            const games = await gamecollection.find({});
                            console.log('Fetched proprties:', games);
                            console.log("fetching from Mongodb");
                            res.json(games);
                        }
                    catch (err)
                    {
                        console.error("Error retrieving from Mongodb: ",err);
                        res.status(500);
                    }
                }
            else
                {
                    console.log("Not logged IN");
                }
        }
    );

app.get('/readDB/:id', async (req, res)=>
        {
            if (req.isAuthenticated())
                {
                    try
                        {
                            const a = req.params.id; 
                            const findone_content = await gamecollection.findOne({_id:a});
                            console.log(findone_content);
                            res.json(findone_content);
                        }
                    catch (err)
                    {
                        console.error("Error retrieving single record from Mongodb: ",err);
                        res.status(500);
                    }
                }
            else
                {
                     console.log("Not logged IN");
                }
        }
    );


app.post('/addcart', async (req, res) => {
  const cartdata = {
    username: req.body.username,
    property_ID: req.body.property
  }; 

    if (req.isAuthenticated())
        {
            const user_records = await users.find({username:cartdata['username'].toLowerCase()});


            console.log(user_records[0]['cart']);
            console.log("Cart length : "+user_records[0]['cart']);

            if(user_records[0]['cart'] == undefined || Object.keys(user_records[0]['cart']).length == 0)
                {
                    console.log("Cart Empty!")
                    const temp_data = {1:cartdata['property_ID']};
                    const result = await users.update(
                          { "username": cartdata['username'] },
                          { $set: { "cart": temp_data } }
                        );
                }
            else
                {
                    console.log("Cart else length : "+Object.keys(user_records[0]['cart']).length);
                    l = Object.keys(user_records[0]['cart']).length+1;
                    
                    var flag = 0;
                    for(var key in user_records[0]['cart'])
                        {
                            if(user_records[0]['cart'][key] == cartdata['property_ID'])
                            {   
                                console.log(user_records[0]['cart'][key]+" "+cartdata['property_ID']);
                                console.log("Already Present!");
                                flag = 1;

                                res.json({message:"Already Present in Cart"});
                            }
                        }
                    console.log(flag);
                    user_records[0]['cart'][l] = cartdata['property_ID'];
                    if(flag == 0)
                        {
                            const result = await users.update(
                                  { "username": cartdata['username'] },
                                  { $set: { "cart": user_records[0]['cart'] } }
                                );
                            res.json({message:"Added to Cart Successfully."});
                        }
                }  
        }
    else
        {
            console.log("Not logged IN");
        } 

});

app.get('/mycart/:id', async (req, res)=>
        {
            if (req.isAuthenticated())
                {
                    try
                        {
                            const a = req.params.id;       
                            const findone_content = await users.findOne({username:a});
                            
                            res.json(findone_content['cart']);
                        }
                    catch (err)
                    {
                        console.error("Error retrieving single record from Mongodb: ",err);
                        res.status(500);
                    }
                }
            else
                {
                    console.log("Not logged IN");
                }
        }
    );

app.delete('/delete/:id/:id1', async (req, res)=> {

    console.log("here with id4!"); 
    if (req.isAuthenticated())
        {
            try
            { 
                const uid = req.params.id;
                const id = req.params.id1;
                console.log(id);
                console.log(uid);
                console.log("delete");  
                const findone_content = await users.findOne({username:uid});
                var cart_dict = {};
                const cart_var = findone_content['cart'];
                for(key in cart_var)
                    {
                        if(cart_var[key] != id)
                            {
                                cart_dict[key] = cart_var[key];
                            }
                    }
                const result = await users.update(
                      { "username": uid },
                      { $set: { "cart":cart_dict } }
                    );
                res.json({message:"Removed from Cart Successfully.!"});

            }
            catch (err)
            {

                console.log("Crash while deleting!!");
                console.log("Error in server : ",err);
            }
        }
    else
        {
            console.log("Not logged IN");
        }

});

app.get('/getuserdata/:id', async (req, res)=>
        {
            if (req.isAuthenticated())
                {
                    try
                        {
                            const a = req.params.id; 
                            const findone_content = await users.findOne({username:a});
                            console.log(findone_content);
                            res.json(findone_content);
                        }
                    catch (err)
                    {
                        console.error("Error retrieving user single record from Mongodb: ",err);
                        res.status(500);
                    }
                }
            else
                {
                    console.log("Not logged IN");
                }
        }
    );

app.post('/updateUser', async (req, res)=> {

    if (req.isAuthenticated())
        {
            console.log("here with id4!"); 
            try
            { 
                const uid = req.body.username;
                console.log(uid);
                console.log("updating user data..");  
                const findone_content = await users.findOne({username:uid});

                const result = await users.update(
                      { "username": uid },
                      { $set: { "firstname":req.body.firstname,"lastname":req.body.lastname,"address":req.body.address,"Phone":req.body.phone } }
                    );
                res.json({message:"Updated User Profile Successfully.!"});

            }
            catch (err)
            {

                console.log("Crash while updating!!");
                console.log("Error in server : ",err);
            }
        }
    else
        {
            console.log("Not logged IN");
        }

});

app.post('/addappointment', async (req, res)=> {

    if (req.isAuthenticated())
        {
            console.log("here with id5!"); 
            try
            { 
                const uid = req.body.username;
                const pid = req.body.propertyID;
                console.log(uid);
                console.log("updating appointment data..");  
                const findone_content = await users.findOne({username:uid});
                const app_len = Object.keys(findone_content['appointments']).length + 1;
                console.log(app_len);
                // app_len += 1;
                // console.log(app_len);
                findone_content['appointments'][app_len] = pid;
                const result = await users.update(
                      { "username": uid },
                      // { $set: { "appointments":{app_len:pid} } }
                      { $set: { "appointments":findone_content['appointments'] } }
                    );
                res.json({message:"Updated Appointment Profile Successfully.!"});

            }
            catch (err)
            {

                console.log("Crash while updating!!");
                console.log("Error in server : ",err);
            }
        }
    else
        {
            console.log("Not logged IN");
        }

});

app.delete('/deleteapp/:id/:id1', async (req, res)=> {

    if (req.isAuthenticated())
        {
            console.log("here with id4!"); 
            try
            { 
                const uid = req.params.id;
                const id = req.params.id1;
                console.log(id);
                console.log(uid);
                console.log("delete");  
                const findone_content = await users.findOne({username:uid});
                var cart_dict = {};
                const cart_var = findone_content['appointments'];
                for(key in cart_var)
                    {
                        if(cart_var[key] != id)
                            {
                                cart_dict[key] = cart_var[key];
                            }
                    }
                const result = await users.update(
                      { "username": uid },
                      { $set: { "appointments":cart_dict } }
                    );
                res.json({message:"Removed from Appointments Successfully.!"});

            }
            catch (err)
            {

                console.log("Crash while deleting!!");
                console.log("Error in server : ",err);
            }
        }
    else
        {
            console.log("Not logged IN");
        }

});

app.get('/logout', function(req, res) {
    // Perform logout actions, such as destroying the session
  if (req.isAuthenticated()) 
    {       
      req.logout(function(err) {
          if (err) {
              // Handle error
              return res.status(500).send("Error during logout");
          }
          // Redirect or respond as needed after successful logout
          console.log("Successfully logging out!");
          // res.redirect('/');
          res.sendFile(path.join(__dirname, 'public', 'logout_page.html')); 
      });
    }
  else
    {
      res.send("<h2>Trying logout without login !</h2> </br><a href='/signup'>Login here</a>");
    }
});

app.post('/submitProperty', async (req, res) => {
    try {
        const formData = req.body;

        // Insert data into MongoDB using Monk
        const result = await users.insert(formData);

        res.json({ message: 'Form submitted successfully!', result });
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const propertySchema = new mongoose.Schema({
    name: String,
    description: String,
    type: String,
    BHK: String,
    Squareft: String,
    pricing: {
        min: String,
        max: String,
        floor_plan: {
            type: Map,
            of: {
                name: String, // Change from size to name
                size: String,
                Units: {
                    type: Map,
                    of: {
                        status: String,
                        price: String
                    }
                }
            }
        }
    },
    address: String,
    City: String,
    Country: String,
    State: String,
    images: {
        path: String,
        image1: String,
        image2: String,
        image3: String
    },
    CurrentOwner: String,
    ContactProperty: String,
    ContactOwner: String,
}, { collection: 'Property' });

const Property = mongoose.model('Property', propertySchema);
app.post('/submit-form', async (req, res) => {
    try {
      const newProperty = new Property(req.body);
      await newProperty.save();
      res.send('Form data submitted successfully!');
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });

app.delete('/deletePID/:id', async (req, res)=> {

    console.log("here with del!"); 
    try
    { 
        const id = req.params.id;
        console.log("delete");        
        gamecollection.remove({_id:id})
            .then(() => {
                    res.json({message: 'Record Deleted Successfully!'});
                })
            .catch((err)=>{
                console.error('Error in deleting the record: ',err);
                res.status(500).json({error: 'Internal Server Error!'});
            })            
    }
    catch (err)
    {

        console.log("Crash while deleting admin!!");
        console.log("Error in server : ",err);
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});