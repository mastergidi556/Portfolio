document.getElementById("sendMessage").addEventListener("click", SendMessage);

let fname = document.forms["Form"]["fname"].value;
let lname =  document.forms["Form"]["lname"].value;
let email =  document.forms["Form"]["email"].value;
let message =  document.forms["Form"]["message"].value;


function SendMessage()
{
    if(fname == null || fname == "" || lname == null || lname == "" || email == null || email == "" || message == null || message == "")
    {
        return false;
    }
    else
    {
        alert("Message sent")
    }
   
}