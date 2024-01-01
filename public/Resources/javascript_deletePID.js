// @AshwinSai
// Fall 2023

console.log("hey del");

function reload_function()
	{
		window.location.reload();
	}


 function delete_function()
    {
        // console.log('Ashwin Sai');
        var id = document.getElementById("delete_ID").value;
        var data = {'_id':id};

        console.log(data);
        fetch('/deletePID/'+id,
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
        })
        .catch(error => {console.error(error); alert(data);});
    }