// @AshwinSai
// Fall 2023

// document.getElementById("clickme_G").addEventListener("click", GenerateButton);
// document.getElementById("clickme_R").addEventListener("click", ResetButton);

function GenerateButton() 
  {    
    document.getElementById("card_option_box1").style.display="block";
    document.getElementById("card_option_box1").style.backgroundColor="darkcyan";
    document.getElementById("card_option_box1").innerHTML = document.getElementById("leftmeme_value").value;
    document.getElementById("card_option_box2").style.display="block";
    document.getElementById("card_option_box2").style.backgroundColor="darkcyan";
    document.getElementById("card_option_box2").innerHTML = document.getElementById("rightmeme_value").value;
  }

function ResetButton() 
  {    
    document.getElementById("card_option_box1").style.display="none";
    document.getElementById("card_option_box2").style.display="none";
    document.getElementById("rightmeme_value").value = "";
    document.getElementById("leftmeme_value").value = "";
    document.getElementById("leftmeme_value").focus();
    document.getElementById("leftmeme_value").select();
  }