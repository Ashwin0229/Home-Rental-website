function validateAndSubmit() {
    // Run validation
    if (!validateForm()) 
    {
        // If validation fails, return false to prevent form submission
        return false;
    }

    // If validation passes, submit the form
    var firstname = document.getElementById("login__first").value;
    var lastname  = document.getElementById("login__last").value;
    var username  = document.getElementById("login__username").value;
    var password  = document.getElementById("login__password").value;    

    var form = document.querySelector('.form.login');
    var formData = new FormData(form);
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://httpbin.org/post', true);
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            // Handle successful form submission
            console.log("Here");
            send_data(firstname,lastname,username,password);
            console.log(xhr.responseText);            
        } else {
            // Handle form submission error
            console.error(xhr.statusText);
        }
    };
    xhr.onerror = function () {
        // Handle network error
        console.error('Network error occurred');
    };
    xhr.send(formData);

    // Return false to prevent the default form submission
    return false;
}

function validateForm() {
    // Reset error messages
    document.getElementById("usernameError").innerHTML = "";
    document.getElementById("passwordError").innerHTML = "";

    // Get input values
    var username = document.getElementById("login__username").value;
    var password = document.getElementById("login__password").value;
    console.log(username);
    // Validate username (check if it's in email format)
    var emailFormat = /^\S+@\S+\.\S+$/;
    if (!emailFormat.test(username)) {

        document.getElementById("usernameError").innerHTML = "Please enter a valid email address as the username.";
        return false;
    }

    // Validate password (at least 8 characters, with uppercase, lowercase, number, and special symbol)
    var passwordFormat = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordFormat.test(password)) {
        document.getElementById("passwordError").innerHTML = "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special symbol.";
        return false;
    }

    // If everything is valid, return true
    return true;
}

function send_data(firstname,lastname,username,password)
    {
        var dataToSend = {
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'password': password
        };
        console.log("Data to Send : ",dataToSend);
        fetch('/register', {
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

                // if(data['message'] == "User already logged in!")
                //     {
                //         window.location.href = '/dashboard';
                //     }                
                if(data['message'] == "Account Created Successfully. OK")
                    {
                        // window.location.href = "/propertylist/home/"+username;
                        reload_function();
                    }
        })
        .catch(error => {
            console.error('Error : ',error);
        });

    }

function LoginFunction()
    {
       console.log("hey LoginFunction"); 
       var username  = document.getElementById("login__username1").value;
       var password  = document.getElementById("login__password1").value; 

       if(username == "")
            {
                alert("Please enter Username.");
            }
        if(password == "")
            {
                alert("Please enter Password.");
            }
        if(username !== "" && password != "")
                {
                    send_logindata(username,password);
                }  

    }

function send_logindata(name,pwd)
    {
        var dataToSend = {
                'name': name,
                'password': pwd
        };
        console.log("Data to Send : ",dataToSend);
        fetch('/validate?username='+name+'&password='+pwd, {
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

                if(data['message'].includes("OK"))
                    {
                        window.location.href = "/propertylist/home/"+name;
                        // alert("Please Login.");
                        console.log("OK");
                        // reload_function();
                    }               
        })
        .catch(error => {
            console.error('Error : ',error);
        });

    }

function reload_function()
    {
        window.location.reload();
    }
