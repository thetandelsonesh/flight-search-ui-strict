var url = "http://localhost:3000/";

function ajaxpost(url,data,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(null,this.responseText);
        }else{
            cb(true,null);
        }
    };
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type","application/json");
    xhttp.send(data);
}

function validateField(obj){
    if(obj){
        if(obj.value){
            obj.style.border = "1px solid #ccc";
            return true;
        }else{
            obj.style.border = "2px solid #d50000";
            return false;
        }
    }else{
        var bookingtype = document.forms["search-form"]["bookingtype"];
        if(bookingtype.value){
            document.getElementById("toggler").style.border = "1px solid transparent";
            if(bookingtype.value == 1){
                document.forms["search-form"]["returndate"].value = "21-01-2018";
                document.forms["search-form"]["returndate"].style.display = "none";
            }else{
                document.forms["search-form"]["returndate"].style.display = "block";
            }
            return true;
        }else{
            document.getElementById("toggler").style.border = "2px solid #d50000";
            return false;
        }
    }
}


function getTemplateResult(data, obj){

    document.getElementById("origin-result").innerHTML = obj.originName;
    document.getElementById("dest-result").innerHTML = obj.destinationName;
    document.getElementById("depart-result").innerHTML = "Departure : " + obj.departureDate;
    document.getElementById("return-result").innerHTML = data.bookingtype == 2 ? "Return : " + obj.arrivalDate : "";

    var departDetails = `<div class="mini-text">AI-${obj.flightNumber}</div>
                        <div class="maxi-text">${obj.origin} > ${obj.destination}</div>
                        <div class="mini-text">Depart : ${obj.departureTime}</div>
                        <div class="mini-text">Arrive : ${obj.arrivalTime}</div>`;

    var returnDetails = obj.return 
        ? `<div class="mini-text">AI-${obj.return.flightNumber}</div>
            <div class="maxi-text">${obj.destination} > ${obj.origin}</div>
            <div class="mini-text">Depart : ${obj.return.departureTime}</div>
            <div class="mini-text">Arrive : ${obj.return.arrivalTime}</div>`
        : ``;

    return `<div class="container-box">
                <div class="row">
                    <div class="col-100 maxi-text">₹${obj.price}</div>
                </div>
                <div class="row">
                    <div class="col-33-50">${departDetails}</div>
                    <div class="col-33-50">${returnDetails}</div>
                    <div class="col-33 pull-center">
                        <button>BOOK</button>
                    </div>
                </div>
            </div>`;
}

function getFormValues(){
    var form = document.forms["search-form"];
    var validity =  validateField(form["origin"])
    && validateField(form["dest"])
    && validateField(form["passanger"])
    && validateField()
    && validateField(form["departdate"])
    &&(form["bookingtype"].value == 1 || validateField(form["returndate"]));
 
    if(!validity){
        return;
    }

    var formData = {
        origin : form["origin"].value,
        dest : form["dest"].value,
        passanger : form["passanger"].value,
        bookingtype : form["bookingtype"].value,
        departdate : form["departdate"].value,
        returndate : form["returndate"].value,
    }

    ajaxpost(url + "getFlightData",JSON.stringify(formData), function(err, res){

        document.getElementsByClassName("result-container")[0].style.display = "block";
                
        if(!err){
            var resData = JSON.parse(res);
            var dataHTML = ""
            for(var i=0; i<resData.length;i++){
                dataHTML += getTemplateResult(formData,resData[i]);
            }
            document.getElementById("container-box-dump").innerHTML =dataHTML;
        }
    })
}
