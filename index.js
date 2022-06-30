const LINK = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json";
const width = 1000;
const height = 600;

const svg = d3.select(".map").append("svg").attr("width", width).attr("height", height);
const projection = d3.geoEquirectangular();
const path = d3.geoPath(projection);
const g = svg.append("g");

let modal = document.getElementById("modal");
let exit = document.getElementById("exit")
let lmao;

// exit.addEventListener("click", e => modal.style.display = "none")
const MONTHS = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
}

async function getData() {
    let data = await d3.csv("./data/GlobalLandTemperaturesByCountry (Modified).csv")
    return data
}
document.getElementById("country").innerHTML = "Loading data. Please wait.";

getData().then((d) => {
    let tempData = d;
    async function firstTemp(country) {
        let i = 0;

        while (tempData[i].Country != country) {
            i++
        }

        return [i, tempData[i].AverageTemperature]
    }

    async function draw() {
        let d = await d3.json(LINK);
        const countries = topojson.feature(d, d.objects.countries);
        g.selectAll("path").data(countries.features).enter().append("path").attr("fill", "black").attr("id", (f => f.properties.name)).classed("country", true).attr("d", path);
    }

    function decolorMap() {
        let countries = document.getElementsByClassName("country");
        for (let i = 0; i < countries.length; i++) {
            countries[i].style.fill = "#99B898"
        }
    }



    function animate(isAnimated) {
        for (let i = 0; i < tempData.length; i++) {
            let country = tempData[i];
            let temp = country.AverageTemperature;

            if (isAnimated) {
                setTimeout(function () {
                    color(country, temp);
                }, 500)
        
            } else color(country, temp);
            
        }


    }
    function color(country, temp) {
        if (document.getElementById(country.Country) != null) {
            if (parseFloat(temp) < 3) {
                document.getElementById(country.Country).style.fill = "#0b315c";
            } else if (parseFloat(temp) < 6) {
                document.getElementById(country.Country).style.fill = "#4696f2";

            } else if (parseFloat(temp) < 9) {
                document.getElementById(country.Country).style.fill = "#37f0cb";
            } else if (parseFloat(temp) < 12) {
                document.getElementById(country.Country).style.fill = "#62f037";
            }
            else if (parseFloat(temp) < 15) {
                document.getElementById(country.Country).style.fill = "#b8f037";
            }
            else if (parseFloat(temp) < 18) {
                document.getElementById(country.Country).style.fill = "#bee366";
            } else if (parseFloat(temp) < 21) {
                document.getElementById(country.Country).style.fill = "#edde32";
            }
            else if (parseFloat(temp) < 24) {
                document.getElementById(country.Country).style.fill = "#edb832";
            }
            else if (parseFloat(temp) < 27) {
                document.getElementById(country.Country).style.fill = "#e38232";
            }
            else if (parseFloat(temp) < 30) {
                document.getElementById(country.Country).style.fill = "#e64210";
            }
            else if (parseFloat(temp) < 33) {
                document.getElementById(country.Country).style.fill = "#d62f27";
            }
            else if (parseFloat(temp) < 36) {
                document.getElementById(country.Country).style.fill = "#eb0909";
            }
            else if (parseFloat(temp) < 39) {
                document.getElementById(country.Country).style.fill = "#ff0055";
            }
            document.getElementById("date").innerHTML = "" + MONTHS[country.dt.split("-")[1]] + " " + country.dt.split("-")[0]
            document.getElementById("country").innerHTML = country.Country + " (" + parseInt(country.AverageTemperature) + "ºC)";
        }

    }
    function getMeanPerCountry(country) {
        let start = getFirstTemp(country)[0];
        let end = getLastTemp(country)[0];
        console.log(start, end)
        let sum = 0;
        for(let i = start; i < end + 1; i++){
            console.log(tempData[i].Country)
            if(tempData[i].AverageTemperature != ""){
                sum += parseFloat(tempData[i].AverageTemperature);
            }
        }
        return sum / (end - start);
    }
    function getCountries() {
        let countries = []
        for (let i = 0; i < tempData.length; i++) {
            if (countries.indexOf(tempData[i].Country) == -1)
                countries.push(tempData[i].Country);
        }
        return countries;
    }
    function getDetails(e,country) {
        let modal = document.getElementById("modal");
        let initTemp = getFirstTemp(country)[1]
        let finalTemp = getLastTemp(country)[1]
        let mean = getMeanPerCountry(country);
        console.log(initTemp)
        console.log(finalTemp)
        
        modal.style.display = "block";
        modal.style.position = "absolute";
        modal.style.left = (e.clientX - 200) + "px"
        modal.style.top = (e.clientY - 25) + "px"
        modal.style.backgroundColor = "#000000"
        
        document.getElementById("countryM").innerHTML = country;
        document.getElementById("initTemp").innerHTML = "Temp as of " + MONTHS[initTemp.dt.split("-")[1]] + " " + initTemp.dt.split("-")[0] + ": " + Math.round(initTemp.AverageTemperature * 100) / 100 + "ºC";
        document.getElementById("finalTemp").innerHTML = "Temp as of " + MONTHS[finalTemp.dt.split("-")[1]] + " " + finalTemp.dt.split("-")[0] +  ": " + Math.round(finalTemp.AverageTemperature*100)/100 + "ºC";
        document.getElementById("meanTemp").innerHTML = "Mean Temp: " + Math.round(parseFloat(mean)*100)/100 + "ºC";

        
    }
    function getFirstTemp(country){
        // let countries = tempData.filter(d => d.Country == country)
        // for(let i = 0; i < countries.length; i++){
        //     if(countries[i].AverageTemperature != "") return [i, countries[i]];
        // }
        for(let i = 0; i < tempData.length; i++){
            if(tempData[i].Country == country && tempData[i].AverageTemperature != ""){
                return [i, tempData[i]];
            }
        }
    }
    function getLastTemp(country){
        for(let i = tempData.length-1; i > -1; i--){
            if(tempData[i].Country == country && tempData[i].AverageTemperature != ""){
                return [i, tempData[i]];
            }
        }
    }
    draw().then(() => {
        animate(true)
        
        let countries = document.getElementsByClassName("country");
        for(let i = 0; i < countries.length; i++){

            countries[i].addEventListener("click", (e) => { 
                getDetails(e, countries[i].id);
            })
        }
    })

    // .then(() => {

    // })‰


})

    // .then(() => {
    //     let countries = document.getElementsByClassName("country");
    //     for (let i = 0; i < countries.length; i++) {
    //         countries[i].addEventListener("click", (e) => {

    //             modalAppear(e, countries[i].id);
    //         })
    //     }
    // });
// });
