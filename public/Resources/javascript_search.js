// @AshwinSai
// Fall 2023

console.log("hey search!");

function search_function()
{
	var filter_val = document.getElementById('filter');
	var filter_output = filter_val.options[filter_val.selectedIndex].value;
	
	var name_val   = document.getElementById('search_box').value;	
	var bhk_val    = document.getElementById('BHK_filter').value;
	console.log(filter_output);
	console.log(name_val);
	console.log(window.location.href.split("="));
	window.location.href = "/propertylist/search?title="+name_val+"&type="+filter_output+"&bhk="+bhk_val+"&uid="+window.location.href.split("=")[4];

}

function user_profile()
		{
			// console.log(window.location.href.split("/")[4]);
			window.location.href = '/propertylist/profile/'+window.location.href.split("=")[4];
		}

function logout()
	{
		window.location.href = '/logout';
	}