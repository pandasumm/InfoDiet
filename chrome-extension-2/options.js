document.getElementById("setGoal").addEventListener("click",
    function() {
        var key = "news";
        value = 120;
        chrome.storage.local.set({[key]: value}, function() {
          console.log('Value is set to ' + value);
        });
    });

document.getElementById("getGoal").addEventListener("click",
    function() {
        key = "news";
        chrome.storage.local.get([key], function(result) {
          console.log("key: ", key);
          console.log(result);
          console.log('Value currently is ' + result.news);
        });
    });

document.getElementById("clearGoal").addEventListener("click",
    function() {
        chrome.storage.local.remove(["news"], function(){
            console.log("remove ", "news");
        });
        // chrome.storage.local.clear();
    });

    // var ctx = document.getElementById("myChart").getContext('2d');
    // var myDoughnutChart = new Chart(ctx, {
    //   type: 'doughnut',
    //   data: data,
    //   options: options
    // });

Chart.defaults.global.legend.position = 'bottom';
Chart.defaults.global.legend.labels.usePointStyle = true;
Chart.defaults.global.legend.labels.boxWidth = 15;
Chart.defaults.global.tooltips.backgroundColor = '#000';

isArray = Array.isArray ?
    function (obj) {
      return Array.isArray(obj);
    } :
    function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };

getValueAtIndexOrDefault = (value, index, defaultValue) => {
    if (value === undefined || value === null) {
      return defaultValue;
    }

    if (this.isArray(value)) {
      return index < value.length ? value[index] : defaultValue;
    }

    return value;
  };

  var backgroundColors = [
                            'rgba(255, 99, 132)',
                            'rgba(54, 162, 235)',
                            'rgba(255, 206, 86)',
                            'rgba(75, 192, 192)',
                            'rgba(153, 102, 255)',
                            'rgba(255, 159, 64)'
                        ];

  var borderColors = [
                            'rgba(255,99,132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(153, 102, 255, 1)',
                            'rgba(255, 159, 64, 1)'
                        ];

  var dataSet = [12, 19, 3, 5, 2, 3];
  var categoryLabels = ["Arts & Entertainment", 
                        "Society", 
                        "Business", 
                        "Law, Government, & Politics", 
                        "News / Weather / Information", 
                        "Non-standard Content"];

    var ctx = document.getElementById("myChart").getContext('2d');
    var myDoughnutChart = new Chart(ctx,{
        type: 'doughnut',
        data: {
            labels: categoryLabels,
                    datasets: [{
                        label: '# of Votes',
                        data: dataSet,
                        backgroundColor: backgroundColors,
                        borderColor: borderColors, 
                        borderWidth: 1
                    }]
        },
        options: {
          legend: {
            labels: {
              fontColor: "white",
              fontSize: 18,
              boxWidth: 50,
              padding: 10
            }
          },
          layout: {

          }
        }
    });
