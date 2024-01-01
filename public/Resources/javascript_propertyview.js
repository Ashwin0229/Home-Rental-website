// @AshwinSai
// Fall 2023

window.onload = updateHTMLPage;
console.log("hey");

function updateHTMLPage()
	{	
		var data;
		var property_ID = window.location.href.split("/")[5];

		fetch('/readDB/'+property_ID,
				{
					method: 'GET',
					headers: 
						{
							'Content-Type': 'application/json'
						},
					body: JSON.stringify(data)
				}
			)
			.then(response => response.json())
			.then(data => {
					console.log(data);
					DisplayData(data);
					// document.getElementById('point').innerHTML = data['name'];
			})
		.catch(error => console.error(error));
	}
		
function DisplayData(data) 
{
  var i;
  var filter_types = [];
  var option = "";
  var text_ = "";

  text_ += '<nav class="navbar navbar-light bg-light"><div class="container-fluid" style="display: flex; justify-content: flex-end;"><button class="navbar-brand" style="border:none; background: whitesmoke;" onclick="view_mycart()"><i class="bi bi-cart-plus"></i>My Cart</button><button class="navbar-brand" style="border:none; background: whitesmoke;"><i class="bi bi-person-circle"></i></button><button class="navbar-brand" style="border:none; background: whitesmoke;" onclick="user_profile()" id="user_name">'+(window.location.href).split("/")[4]+'</button><button class="navbar-brand" style="border:none; background: whitesmoke;" onclick="logout()" id="logout_button">Logout</button></div></nav>';
  text_ += "<table id=image_row>";
  text_ += "<tr>";
  text_ += "<td><img src='../../images/"+data['image']['image1']+"' alt='photo1'></img></td>";
  text_ += "<td><img src='../../images/"+data['image']['image2']+"' alt='photo2'></img></td>";
  text_ += "<td><img src='../../images/"+data['image']['image3']+"' alt='photo3'></img></td>";
  text_ += "</tr>";
  text_ += "</table>";
  text_ += "</br></br><h2>"+data['name']+" <i class='bi bi-bag-heart' id='fav_icon'></i></h2>";
  text_ += "<p><i class='bi bi-geo-alt-fill'></i>"+data['address']+" "+data['City']+" "+data['Country']+"</p></br>";
  
  text_ += "<table id='table1'>";
  text_ += "<tr>";
  text_ += "<td>Type</br>"+data["type"]+"</td>";
  text_ += "<td> Bedrooms</br>"+data["BHK"]+"</td>";
  text_ += "<td> Bathrooms</br>"+data["BHK"]+"</td>";
  text_ += "<td> Sq ft</br>"+data["Square Ft"]+"</td>";
  text_ += "<td>"+data["pricing"]["min"]+" - "+data['pricing']['max']+"</td>";
  text_ += "</tr>"
  text_ += "</table>";

  text_ += "</br><h3>Amenities Available :</h3></br>";
  text_ += "<ul>";
  for(const key in data['amenities'])
  	{
  		text_ += "<li>"+data['amenities'][key]+"</li>";
  	}
  text_ += "</ul>";

  text_ += "</br>";
  text_ += "</br></br><h2>Floor Plans</h2>";
  text_ += "<table id='table1'>";

  for (const key in data['pricing']['floor_plan']) 
  		{
  			text_ += "<tr>";
  			text_ += "<td>Floor : "+key+"</td>";
  			text_ += "<td>Size : "+data['pricing']['floor_plan'][key]['size']+"</td>";
  			
  			text_ += "<td>";
  			text_ += "<table id='table1'>";

  			var avail_count = 0;
  			for(const unitid in data['pricing']['floor_plan'][key]['Units'])
  					{
  						if(data['pricing']['floor_plan'][key]['Units'][unitid]['status'] == "Open")
  							{
  								avail_count += 1;
  							}
  					}

  			text_ += "<th colspan='3'>"+avail_count+" available units</th>"; 
  			text_ += "<tr><th>Unit</th><th>Status</th><th>Price</th></tr>";  			
  			for(const unitid in data['pricing']['floor_plan'][key]['Units'])
	  			{
	  				text_ += "<tr>";
	  				text_ += "<td>"+unitid+"</td>";
	  				text_ += "<td>"+data['pricing']['floor_plan'][key]['Units'][unitid]['status']+"</td>";
	  				text_ += "<td>"+data['pricing']['floor_plan'][key]['Units'][unitid]['price']+"</td>";
	  				text_ += "</tr>";
	  			}
	  		text_ += "</table>";		
	  		text_ += "</td>";
  			text_ += "</tr>";
			}
  
  text_ += "</table>";
  text_ += "<p>--</p>";
  text_ += "<button type='button' onclick='add_to_cart()' style='margin: 10px;' class='btn btn-success'>Add to Cart</button>";


  document.getElementById("point").innerHTML = text_;  
}

function detail_page(obj_id)
{
	console.log("ashwin");
	console.log(obj_id);
	var data;
	fetch('/games/'+obj_id,
				{
					method: 'GET',
					headers: 
						{
							'Content-Type': 'application/json'
						},
					body: JSON.stringify(data)
				}
			)
			.then(response => response.json())
			.then(data => {
					console.log(data);
			})
		.catch(error => console.error(error));
}

function search_function()
{
	var filter_val = document.getElementById('filter');
	var filter_output = filter_val.options[filter_val.selectedIndex].value;
	
	var name_val   = document.getElementById('search_box').value;	
	console.log(filter_output);
	console.log(name_val);
	window.location.href = "/propertylist/search?title="+name_val+"&type="+filter_output;
	url_ = "/propertylist/search?title="+name_val+"&type="+filter_output;
	var data;

}

function add_to_cart()
{
	console.log("Clicked item to add to cart");
	var username = window.location.href.split("/")[4];
	var propertyID = window.location.href.split("/")[5];

	console.log(username);
	send_cartdata(username,propertyID);
}

function view_mycart()
	{
		console.log("Viewing my cart");
		window.location.href = "/propertylist/home/"+window.location.href.split("/")[4]+"/mycart";
	}

function send_cartdata(username,property_ID)
    {
        var dataToSend = {
                'username': username,
                'property': property_ID                
        };
        console.log("Data to Send : ",dataToSend);
        fetch('/addcart', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
                             },
            body: JSON.stringify(dataToSend)

        })
        .then(response => response.json())
        .then(data => {
                console.log("Server response :",data);
                alert(data['message']);
                              
                // if(data['message'] == "Account Created Successfully.")
                //     {
                //         window.location.href = "/propertylist/home/"+username;
                //     }
        })
        .catch(error => {
            console.error('Error : ',error);
        });

    }

function user_profile()
		{
			// console.log(window.location.href.split("/")[4]);
			window.location.href = '/propertylist/profile/'+window.location.href.split("/")[4];
		}

function logout()
	{
		window.location.href = '/logout';
	}