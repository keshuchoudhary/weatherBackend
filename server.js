const { application, response } = require('express');
const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const app = express();

const cors = require('cors');

app.use(cors());



app.use(express.json()); // Add this line to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Add this line to parse URL-encoded bodies
app.use(bodyParser.json());


// app.get('/', (req,res)=>{
//     console.log("response!!!!");
//     res.send("<h1>This is response from server side!</h1>")
// })


app.get('/', (req,res)=>{
    const url='https://api.openweathermap.org/data/2.5/weather?q=Maksi&appid=78ece225fc825d0978d6d3b2484ceeac&units=metric';
    const apiKey='78ece225fc825d0978d6d3b2484ceeac'
    https.get(url, (response)=>{
        response.on('data',(data)=>{
            const weatherData = JSON.parse(data);
            // console.log("City Name :- ", weatherData.name);
            // console.log("Temperature (in degree Celsius) :- ", weatherData.main.temp);
            // console.log("Humidity :- ", weatherData.main.humidity);
        })
    })
    res.send('hello');
})


app.post('/', (req,res)=>{
    const cityName=req.body.cityName;
    const apiKey='78ece225fc825d0978d6d3b2484ceeac'

    const url='https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid='+apiKey+'&units=metric';

    https.get(url, (response)=>{
        try{

            response.on('data',(data)=>{
                const weatherData = JSON.parse(data);
                
                if(weatherData.cod=='404'){
                    // console.log("ERROR IN CITY NAME");
                    res.json({message : "Invalid City Name!"})
                    return;
                }

                const temperature = weatherData.main.temp;
                const humidity = weatherData.main.humidity;
                const weatherConditions = weatherData.weather[0].description;
                const city = weatherData.name;
    
                // console.log("City Name :- ", weatherData.name);
                // console.log("Temperature (in degree Celsius) :- ", weatherData.main.temp);
                // console.log("Humidity :- ", weatherData.main.humidity);
                // console.log("Weather Condition :- ", weatherData.weather[0].description);
    
                res.json({city, temperature, humidity, weatherConditions });
            })
        }
        catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }

    })


    
})

app.listen(5000, ()=>{
    console.log("server listening on port 5000");
})