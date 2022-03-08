const express = require("express")
const bodyParser = require("body-parser")
const https = require("https")
const app = express()

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function(req, res){
    // console.log(req.body.city);
    const apiKey = "a8b0468328cc28361d9f2decd6a89ebb";
    let city = req.body.city;
    let units = "metric";
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
    
    https.get(url, function(response){
        console.log(response)
        if(response.statusCode==404){
            res.write(`<p>City Not Found...</p>`);
            res.write(`<a href="/">Go back.</a>`)
            res.send();
        }else{
            response.on("data", function(data){
                let weatherData = JSON.parse(data);
                console.log(weatherData)
                let temperature = weatherData.main.temp;
                let description = weatherData.weather[0].description;
                let icon = weatherData.weather[0].icon;
    
                res.write(`<p>The weathe is currently ${description}</p>`);
                res.write(`<h1>Current temperature in ${city} is ${temperature} degrees celcius.</h1>`);
                res.write(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png" >`);
                res.write(`<a href="/">Go back.</a>`)
                res.send()
            })
        }
    })



})

app.listen(8080, function(){
    console.log("Server is running at http://localhost:8080");
})