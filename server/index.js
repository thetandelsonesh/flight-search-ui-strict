let express = require("express");
let bodyParser = require("body-parser");

let fs = require("fs");

let app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.listen(3000,function(){
    console.log("Server running http://localhost:3000");
})

app.post("/getFlightData",function(req,res){
    fs.readFile(process.cwd()+"/server/files/flightDetails.json", function(err, data){
        if(err) throw err;    
        var data = JSON.parse(data);
        var result = [];
        for(var i=0;i<data.length;i++){
            var row = data[i];

            if(!(req.body.origin == row.origin && req.body.destination == row.dest)){
                continue;
            }
            if(req.body.bookingtype == 2){
                if(row.return){
                    if(row.departureDate == req.body.departdate && row.return.departureDate == req.body.returndate){
                        result.push(row);
                    }
                }
            }else{
                if(!row.return){
                    if(row.departureDate == req.body.departdate){
                        result.push(row);
                    }
                }
            }
        }
        res.send(result);        
    });
})