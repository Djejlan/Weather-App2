let div1 = document.getElementsByClassName("navbar")[0];
let a1 = document.getElementById("stat");
let a2 = document.getElementById("Hourly");
let a3 = document.getElementById("about");
let button = document.getElementById("btn1");
let userInput = document.getElementsByTagName("input")[0];
let div2 = document.getElementById("two");
let body = document.getElementsByTagName("body")[0];

function DayStat(
  date,
  minTemp,
  maxTemp,
  coldestTime,
  warmestTime,
  minHumidity,
  maxHumidity,
  averageTemp,
  averageHumidity
) {
  this.date = date;
  this.minTemp = minTemp;
  this.maxTemp = maxTemp;
  this.coldestTime = coldestTime;
  this.warmestTime = warmestTime;
  this.minHumidity = minHumidity;
  this.maxHumidity = maxHumidity;
  this.averageTemp = averageTemp;
  this.averageHumidity = averageHumidity;
}


let info = {};

async function weather(url) {
  try {
    let response = await fetch(url);
    info = await response.json();
    //info = data;
    return info;
  } catch (error) {
    console.log("There is a delay. Please try again");
  }
}


a3.addEventListener("click", function () {
  div2.innerHTML = "";

  let h1 = document.createElement("h1");
  h1.innerText = "Created by Djejlan Mehmed \n February 2022";
  div2.appendChild(h1);
  h1.className = "h1";
});



button.addEventListener("click", function () {
  div2.innerHTML = "";
  body.appendChild(div2);
  //Check input value and inform user about it
  if (userInput.value === "" || isNaN(parseInt(userInput.value)) === false) {
    let newHeader = document.createElement("h1");
    newHeader.innerText += "You entered invalid city. Please try again";
    newHeader.style.color = "red";
    newHeader.style.textAlign = "center";
    div2.appendChild(newHeader);
    userInput.value = "";
  } else {
    let cityInput = userInput.value;
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&units=metric&APPID=1635ad59093c83a74f3b59fdd5133467`;

    weather(url).then(function () {
      if (info.message) {
        //If input had the wrong or missing city name, inform user
        let newHeader = document.createElement("h1");
        newHeader.innerText += info.message;
        newHeader.style.color = "blue";
        newHeader.style.textAlign = "center";
        div2.appendChild(newHeader);
        userInput.value = "";
      } else {
        //   City is correct
        a1.style.display = "inline"
        a2.style.display = "inline"
        let header2 = document.createElement("h2");
        header2.innerText += `Current Weather - ${info.city.name}, ${info.city.country} `;
        header2.className = "h2";
        div2.appendChild(header2);

        //Get the brief weather info
        let picCode = info.list[0].weather[0].icon;
        let weatherDesc = info.list[0].weather[0].description;
        weatherDesc =
          weatherDesc.charAt(0).toUpperCase() + weatherDesc.slice(1);
        let feelsLike = Math.round(info.list[0].main.feels_like);
        let currentTemp = Math.round(info.list[0].main.temp);
        let urlPic = `http://openweathermap.org/img/w/${picCode}.png`;

        //Display the brief weather info for the user

        let div3 = document.createElement("div");
        div3.className = "div3";
        let weatherPic = document.createElement("img");
        weatherPic.src = urlPic;
        div3.appendChild(weatherPic);
        let p1 = document.createElement("p");
        p1.innerText = `${weatherDesc} Feels like ${feelsLike}° Current Temperature ${currentTemp}°`;
        div3.appendChild(p1);
        div2.appendChild(div3);
        let p2 = document.createElement("p");
        p2.className = "paragraph2";
        p2.innerText =
          "For more information, please, select Statistic or Hourly section";
        div2.appendChild(p2);

        //EventListener for Statistic section

        let dailyStat = []; // array of days

        a1.addEventListener("click", function () {
          dailyStat = [];
          div2.innerHTML = "";
          statsHeader = document.createElement("h2");
          statsHeader.className = "h2";
          statsHeader.innerText = `Weather statistics for the following days in ${info.city.name}, ${info.city.country}`;
          div2.appendChild(statsHeader);
          div3.innerHTML = "";

          //getting data per date and creating array of days
          let i = 0;
          do {
            let date = info.list[i].dt_txt.slice(0, 10);
            function allOneDayEntries(record) {
              return record.dt_txt.slice(0, 10) === date;
            }
            let entireDay = info.list.filter(allOneDayEntries);
            dailyStat.push(entireDay);
            i += entireDay.length;
          } while (i < info.list.length);

          //Calculating statistic per day

          let averageDaysStat = []; // array of average statistic per day

          for (let currentDay of dailyStat) {
            let date = currentDay[0].dt_txt.slice(0, 10);
            //MINIMUM TEMPERATURE OF THE DAY
            function getRecMinTemp(record) {
              return record.main.temp_min;
            }
            let minTemp = Math.min(...currentDay.map(getRecMinTemp));
            let indexMinTemp = currentDay.map(getRecMinTemp).indexOf(minTemp);
            minTemp = Math.round(minTemp);
            let coldestTime = currentDay[indexMinTemp].dt_txt.slice(11, 16);
            if (indexMinTemp == 7) {
              coldestTime = coldestTime + " - 00:00";
            }
            if (indexMinTemp >= 0 && indexMinTemp <= 6) {
              coldestTime =
                coldestTime +
                " - " +
                currentDay[indexMinTemp + 1].dt_txt.slice(11, 16);
            }

            //MAXIMUM TEMPERATURE OF THE DAY
            function getRecMaxTemp(record) {
              return record.main.temp_max;
            }
            let maxTemp = Math.max(...currentDay.map(getRecMaxTemp));
            let indexMaxTemp = currentDay.map(getRecMaxTemp).indexOf(maxTemp);
            maxTemp = Math.round(maxTemp);
            let warmestTime = currentDay[indexMaxTemp].dt_txt.slice(11, 16);
            if (indexMaxTemp == 7) {
              warmestTime = warmestTime + " - 00:00";
            }
            if (indexMaxTemp >= 0 && indexMaxTemp <= 6) {
              warmestTime =
                warmestTime +
                " - " +
                currentDay[indexMaxTemp + 1].dt_txt.slice(11, 16);
            }

            //AVERAGE LOWEST TEMPERATURE
            function averageSum(sum, value) {
              return (sum += value);
            }
            let averageColdestTemp = Math.round(
              currentDay.map(getRecMinTemp).reduce(averageSum, 0) /
                currentDay.length
            );

            //AVERAGE HIGHEST TEMP
            let averageHighestTemp = Math.round(
              currentDay.map(getRecMaxTemp).reduce(averageSum, 0) /
                currentDay.length
            );


            let averageTemp = (averageHighestTemp + averageColdestTemp) / 2;

            //HUMIDITY
            //MINIMUM HUMIDITY OF THE DAY
            function getRecHumid(record) {
              return record.main.humidity;
            }
            let minHumidity = Math.min(...currentDay.map(getRecHumid));

            //MAXIMUM HUMIDITY OF THE DAY
            let maxHumidity = Math.max(...currentDay.map(getRecHumid));

            //AVERAGE HUMIDITY
            let averageHumidity = Math.round(
              currentDay.map(getRecHumid).reduce(averageSum, 0) /
                currentDay.length
            );

            let oneDayAverageStat = new DayStat(
              date,
              minTemp,
              maxTemp,
              coldestTime,
              warmestTime,
              minHumidity,
              maxHumidity,
              averageTemp,
              averageHumidity
            );

            averageDaysStat.push(oneDayAverageStat);
          }
          for (day of averageDaysStat) {
            let p1 = document.createElement("p");
            p1.innerText = `${day.date} 
            Lowest temperature: ${day.minTemp}°   Highest Temperature: ${day.maxTemp}°   Average Temperature: ${day.averageTemp}° 
            Lowest Humidity: ${day.minHumidity}%  Highest Humidity: ${day.maxHumidity}%  Average Humidity: ${day.averageHumidity}% 
            Warmest Time: ${day.warmestTime}      Coldest Time: ${day.coldestTime} \n`;
            p1.className = "par1"
            div2.appendChild(p1);
          }
        });
        a2.addEventListener("click", function () {
          div2.innerHTML = "";
          statsHeader = document.createElement("h2");
          statsHeader.className = "h2";
          statsHeader.innerText = `Hourly Weather statistics in ${info.city.name}, ${info.city.country}`;
          div2.appendChild(statsHeader);
          div3.innerHTML = "";
          div3.className = ""
          
          //BUILDING TABLE FOR THE HOURLY STAT
          let table = document.createElement("table");
          //table.style.borderCollapse = "collapse";
          let theader = table.createTHead();
          let tbody = table.createTBody();
          let row = theader.insertRow(0);

          let titleHeader = [
            " ",
            "Description",
            "Date and Time",
            "Temperature ( ℃ )",
            "Humidity ( % )",
            "Wind Speed ( m/s )",
          ];

          for (i = 0; i < 6; i++) {
            let cell = row.insertCell(i);
            cell.innerText += titleHeader[i];
            cell.className = "cell"         
            row.appendChild(cell);
          }
          table.appendChild(theader);
          for(j = 0; j < info.list.length; j++) {
            let newRow = tbody.insertRow(j)
            let newCell1 = newRow.insertCell(0)
            let picCode1 = info.list[j].weather[0].icon
            let urlPic1 = `http://openweathermap.org/img/w/${picCode1}.png`;
            let weatherPic1 = document.createElement("img")
            weatherPic1.src = urlPic1
            newCell1.appendChild(weatherPic1)
            let newCell2 = newRow.insertCell(1)
            newCell2.innerText = info.list[j].weather[0].description
            newRow.appendChild(newCell2)
            let newCell3 = newRow.insertCell(2)
            newCell3.innerText = info.list[j].dt_txt
            let newCell4 = newRow.insertCell(3)
            newCell4.innerText = Math.round(info.list[j].main.temp)
            let newCell5 = newRow.insertCell(4)
            newCell5.innerText = info.list[j].main.humidity
            let newCell6 = newRow.insertCell(5)
            newCell6.innerText = info.list[j].wind.speed

            //change class of cells
            for (k = 0; k < 6; k ++) {
              newRow.children[k].className = "cell1"
            }

            tbody.appendChild(newRow)
          }
          table.appendChild(tbody)
          div3.appendChild(table);
          div2.appendChild(div3)
        });
        
        // a3.addEventListener("click", function() {
        //   div2.innerHTML = ""

        //   let h1 = document.createElement("h1")
        //   h1.innerText = "Created by Djejlan Mehmed \n February 2022"
        //   div2.appendChild(h1)
        //   h1.className = "h1"
        // })
      }
    });
  }
});
