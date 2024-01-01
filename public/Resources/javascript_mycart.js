// @AshwinSai
// Fall 2023

window.onload = updateHTMLPage;
console.log("hey cart");
var page_text_ = "";

function updateHTMLPage()
	{	
		var data;
		var user_ID = window.location.href.split("/")[5];
		console.log(user_ID);

		fetch('/mycart/'+user_ID,
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
					console.log("Cart Data");
					console.log(data);
					document.getElementById("demo1").innerHTML = "Hey, "+user_ID+" do you want to checkout now?"
					document.getElementById("user_name").innerHTML = user_ID;
					DisplayData(data);
			})
		.catch(error => console.error(error));
	}

function getCartRecordDetails(property_ID)
	{	
		var data;
		var user_ID = window.location.href.split("/")[5];
		console.log(user_ID);
		var prop_data;
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
					console.log("Property Data");
					console.log(data);
					table_data(data);
			})
		.catch(error => console.error(error));

		return prop_data;
	}

	
function DisplayData(data) 
	{
	  var i;
	  var filter_types = [];
	  var option = "";
	  
	  if(Object.keys(data) != 0)
	  		{
	  			for(var key in data)
			  		{
			  			property_data = getCartRecordDetails(data[key]);
			  		}	
			}
		else
			{
				document.getElementById("demo2").innerHTML += "Looks like its empty!, Cart is ready to take orders!"; 
			}
	    		
	}

function table_data(data)
	{
		var text_ = "";
		// text_ += "<table>";		

		// text_ += "<tr>";
		// text_ += "<td>";
		
		text_ += "<table style='border:2px solid black; margin: 10px; font:arial;'>";
		text_ += "<tr style='background: green; color: white;'><th>Title</th><th>Description</th></tr>"

		for(var i in data)
			{
				if("CurrentOwner" != i && "_id" != i &&  "pricing" != i && "amenities" != i && "description" != i)
					{
						text_ += "<tr style='border:2px solid black; padding: 10px;'>";
						if(i=="image")
							{
								text_ += "<td colspan='2'><img src='../../../images/"+data[i]['image1']+"' style='padding: 5px;'></img></td>";
								console.log('../../../../images/'+data[i]['image1']);
							}
						// text_ += "<td style='border:2px solid black; padding: 0px;'>"+i+"</td>";
						if(i=="image")
							{
								// text_ += "<td><img src='../../../images/"+data[i]['image1']+"'></img></td>";
								console.log('../../../../images/'+data[i]['image1']);
							}
						else
							{
								text_ += "<td style='border:2px solid black; padding: 0px;'>"+i.toUpperCase()+"</td>";
								text_ += "<td>"+data[i]+"</td>";
							}				
						text_ += "</tr>";
					}
			}

		text_ += "<tr><td colspan='2'>";
		text_ += '<button type="button" class="btn btn-info" style="width:100px; margin: 10px;" value="'+data["_id"]+'" onclick="contact_us(this)">Book slot</button>';
		id_val = data["_id"];		
		text_ += '<button type="button" class="btn btn-danger" style="width:100px; margin: 10px;" value="'+data["_id"]+'" onclick="remove_fromcart(this)">Remove</button>';
		text_ += "</td></tr>";

		text_ += "</table>";
		// text_ += "</td>";

		// text_ += "</tr>";
	  	// text_ += "</table>";
	  	text_ += "<br>";

	  	document.getElementById("demo2").innerHTML += text_;  

	}

function reload_function()
	{
		window.location.reload();
	}

function remove_fromcart(button)
	{
		console.log(button.value);
		console.log(window.location.href.split("/")[5]);

		delete_function(button.value);
	}

 function delete_function(id)
    {
        // console.log('Ashwin Sai');
        var ur = window.location.href;
        var userid = ur.split("/")[5];
        var data = {'_id':id,"username":userid};
        fetch('/delete/'+userid+'/'+id,
            {
                method: 'DELETE',
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
                alert(data['message']);
                reload_function();
        })
        .catch(error => {console.error(error); alert(data);});
    }

function contact_us(button)
	{
		console.log("Booking Appointment!");
		alert("Appointment Booked for a visit!")
		console.log(window.location.href.split("/")[5]);
		update_appointmnet(button.value,window.location.href.split("/")[5])
		delete_function(button.value);
	}

function update_appointmnet(property_ID,username)
    {
        var dataToSend = {
                'username': username,
                'propertyID': property_ID
        };
        console.log("Data to Send : ",dataToSend);
        fetch('/addappointment', {
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

                              
                if(data['message'] == "Updated appointment Profile Successfully.!")
                    {
                        reload_function();
                    }
        })
        .catch(error => {
            console.error('Error : ',error);
        });

    }

function user_profile()
		{
			// console.log(window.location.href.split("/")[5]);
			window.location.href = '/propertylist/profile/'+window.location.href.split("/")[5];
		}

function logout()
	{
		window.location.href = '/logout';
	}