var url = "http://localhost:3000/";

function ajax(method,url,cb){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            cb(null,this.responseText);
        }else{
            cb(true,null);
        }
    };
    xhttp.open(method, url, true);
    xhttp.send();
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
    obj.departure = new Date(obj.departure);
    obj.departure = obj.departure.toLocaleDateString("en-US",{hour:"2-digit", minute:"2-digit", second:"2-digit"});
    obj.departure = obj.departure.substring(1+obj.departure.indexOf(','));
    obj.arrival = new Date(obj.arrival);   
    obj.arrival =obj.arrival.toLocaleDateString("en-US",{hour:"2-digit", minute:"2-digit", second:"2-digit"});
    obj.arrival = obj.arrival.substring(1+obj.arrival.indexOf(','));

    var departDetails = `<div class="mini-text">AI-${obj.flightNumber}</div>
                        <div class="maxi-text">${obj.origin} > ${obj.destination}</div>
                        <div class="mini-text">Depart : ${obj.departure}</div>
                        <div class="mini-text">Arrive : ${obj.arrival}</div>`;

    var returnDetails = data.bookingtype == 2 
        ? `<div class="mini-text">AI-${obj.flightNumber}</div>
            <div class="maxi-text">${obj.destination} > ${obj.origin}</div>
            <div class="mini-text">Depart : ${obj.arrival}</div>
            <div class="mini-text">Arrive : ${obj.departure}</div>`
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
        departdata : form["departdate"].value,
        returndate : form["returndate"].value,
    }

    ajax("GET", url + "getFlightData", function(err, res){

        document.getElementsByClassName("result-container")[0].style.display = "block";
        document.getElementById("origin-result").innerHTML = formData.origin;
        document.getElementById("dest-result").innerHTML = formData.dest;
        document.getElementById("depart-result").innerHTML = "Departure : " + formData.departdata;
        document.getElementById("return-result").innerHTML = formData.bookingtype == 2 ? "Return : " + formData.returndate : "";
        
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
