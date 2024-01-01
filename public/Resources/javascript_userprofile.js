// @AshwinSai
// Fall 2023

window.onload = updateHTMLPage;
console.log("hey user profile");
var page_text_ = "";

function updateHTMLPage()
	{	
		var data;
		var user_ID = window.location.href.split("/")[5];
		console.log(user_ID);

		fetch('/getuserdata/'+user_ID,
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
					DisplayData(data);
			})
		.catch(error => console.error(error));
	}
	
function DisplayData(data) 
	{
	  var i;
	  var filter_types = [];
	  var option = "";
	  var text_ = "";
	  var text2_ = "";

	  text_ += "<p>First Name : </p>";
	  text_ += "<input type='text' id='fname' value='"+data['firstname']+"' disabled></input>";
	  text_ += "<p>Last Name : </p>";
	  text_ += "<input type='text' id='lname' value='"+data['lastname']+"' disabled></input>";
	  text_ += "<p>Username : </p>";
	  text_ += "<input type='text' id='uname' value='"+data['username']+"' disabled></input>";
	  text_ += "<p>Address : </p>";
	  text_ += "<input type='text' id='addr' value='"+data['address']+"'></input>";
	  text_ += "<p>Phone : </p>";
	  text_ += "<input type='text' id='ph' value='"+data['Phone']+"'></input>";
	  text_ += "<p>CurrentPlace : </p>";
	  text_ += "<input type='text' id='ph' value='"+data['currentStay']+"' disabled></input>";

	  text2_ += '<button type="button" class="btn btn-secondary" onclick="savedata()">Save</button>';

	  document.getElementById("demo2").innerHTML = text_;
	  document.getElementById("demo3").innerHTML = text2_;
	  document.getElementById("user_name").innerHTML = data['username'];

	  console.log(data['appointments']);
	  for(key in data['appointments'])
	  	{
	  		getCartRecordDetails(data['appointments'][key]);
	  	}	  
	    		
	}

function reload_function()
	{
		window.location.reload();
	}

function savedata()
	{
		console.log(window.location.href.split("/")[5]);
		var fname = document.getElementById('fname').value;
		var lname = document.getElementById('lname').value;
		var uname = document.getElementById('uname').value;
		var addrr = document.getElementById('addr').value;
		var phone = document.getElementById('ph').value;

		update_userdata(fname,lname,uname,addrr,phone);
	}

function update_userdata(firstname,lastname,username,address,phone)
    {
        var dataToSend = {
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'address': address,
                'phone':phone
        };
        console.log("Data to Send : ",dataToSend);
        fetch('/updateUser', {
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

                              
                if(data['message'] == "Updated User Profile Successfully.!")
                    {
                        reload_function();
                    }
        })
        .catch(error => {
            console.error('Error : ',error);
        });

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
		id_val = data["_id"];		
		text_ += '<button type="button" class="btn btn-danger" style="width:100px; margin: 10px;" value="'+data["_id"]+'" onclick="remove_fromcart(this)">Cancel</button>';
		text_ += "</td></tr>";

		text_ += "</table>";
		// text_ += "</td>";

		// text_ += "</tr>";
	  	// text_ += "</table>";
	  	text_ += "<br>";

	  	document.getElementById("demo4").innerHTML += text_;  

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
        fetch('/deleteapp/'+userid+'/'+id,
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

function view_mycart()
	{
		console.log("Viewing my cart");

		window.location.href = "/propertylist/home/"+window.location.href.split("/")[5]+"/mycart";		
	}


function logout()
	{
		window.location.href = '/logout';
	}