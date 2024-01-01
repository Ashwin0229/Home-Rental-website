// @AshwinSai
// Fall 2023

window.onload = callNodeFunction;
console.log("hey");

function callNodeFunction()
	{	
		var data;
		fetch('/readDB',
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
					// document.getElementById('demo').innerHTML = data;
			})
		.catch(error => console.error(error));
	}
		
function DisplayData(data) 
{
  var i;
  var grid = "";
  var filter_types = [];
  var numBHK = [];
  var option = "";
  var option_BHK = "";
  for (i = 0; i <data.length; i++) 
  { 

    grid += "<div id='div-content'><div class='grid-item'><img src='../../"+data[i]['image']['path']+"' alt='"+data[i]['name']+"' width='200px;' height='200px;'></img></div><a href='/propertylist/"+(window.location.href).split("/")[5]+"/"+data[i]['_id']+"' >"+data[i]['name']+"</a></div>";

    filter_types[i] = data[i]['type'].toLowerCase();
    numBHK[i] = data[i]['BHK'];
  }

  document.getElementById("user_name").innerHTML = (window.location.href).split("/")[5];


  const unique_types = new Set(filter_types);
  const unique_BHK = new Set(numBHK);
  unique_types.add("No Filter");
  unique_BHK.add("No Filter");
  BHK_array = Array.from(unique_BHK);

  unique_types.forEach(function(value)
  		{  			
  			if(value == "No Filter")
  					{
  						option += "<option value='"+value+"' selected>"+value+"</option>";
  					}
  			else
  					{
  						option += "<option value='"+value+"'>"+value+"</option>";
  					}
  		}
  	)  

  BHK_array.sort().forEach(function(value)
  		{  			
  			if(value == "No Filter")
  					{
  						option_BHK += "<option value='"+value+"' selected>"+value+"</option>";
  					}
  			else
  					{
  						option_BHK += "<option value='"+value+"'>"+value+"</option>";
  					}
  		}
  	)

  document.getElementById("filter").innerHTML = option;
  document.getElementById("BHK_filter").innerHTML = option_BHK;
  document.getElementById("demo").innerHTML = grid;  
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
	var bhk_val    = document.getElementById('BHK_filter').value;
	console.log(filter_output);
	console.log(name_val);
	console.log(bhk_val);
	console.log("hey here");
	window.location.href = "/propertylist/search?title="+name_val+"&type="+filter_output+"&bhk="+bhk_val+"&uid="+window.location.href.split("/")[5];
	url_ = "/propertylist/search?title="+name_val+"&type="+filter_output;
	var data;

}

function view_mycart()
	{
		console.log("Viewing my cart");

		window.location.href = "/propertylist/home/"+window.location.href.split("/")[5]+"/mycart";		
	}

function userprofile()
	{
		window.location.href = '/propertylist/profile/'+window.location.href.split("/")[5];
	}

function logout()
	{
		window.location.href = '/logout';
	}