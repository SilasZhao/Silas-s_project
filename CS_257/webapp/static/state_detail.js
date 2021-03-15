/*
 * chart-from-api.js
 * Jeff Ondich, 12 November 2020
 *
 * Script for a sample showing how to take data from an API
 * and build a bar chart with tooltips.
 *
 * Uses the Chartist library: https://gionkunz.github.io/chartist-js/
 * Copyright © 2019 Gion Kunz
 * Free to use under either the WTFPL license or the MIT license.
 *
 * Data from the COVID Tracking Project: https://covidtracking.com/data/api
 * The COVID Tracking Project at The Atlantic’s data and website content is
 * published under a Creative Commons CC BY 4.0 license, which requires users
 * to attribute the source and license type (CC BY 4.0) when sharing our data
 * or website content.
 */

window.onload = initialize;
//the state that this page describes about
var state_n = ""
    //initialize the function, get the state_n variable from the url using GetRequest();
function initialize() {
    var element = document.getElementById('state');
    let Request = new Object();
    Request = GetRequest();
    state_n = Request['state'];
    element.innerHTML = '<h1> Information about ' + state_n + ": " + '</h1>';
    methodSelector();
}
//get the parameter value in the url
function GetRequest() {
    const url = location.search;
    let theRequest = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substr(1);
        strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
//creating the dropdown list of methods and create the chart and table.
function methodSelector() {
    var stateSelector = document.getElementById('method-select');
    if (stateSelector) {
        // Populate it with states from the API
        var stateSelectorBody = '<option value="cases_increased">Number of increased covid cases</option>\n';
        stateSelectorBody += '<option value="cases">Number of total covid cases</option>\n';
        stateSelectorBody += '<option value="death">Number of deaths</option>\n';
        stateSelectorBody += '<option value="deathIncrease">Number of increased deaths</option>\n';
        stateSelectorBody += '<option value="hospitalized">Number of hospitalized people</option>\n';
        stateSelectorBody += '<option value="hospitalizedCurrently"> Number of currently hospitalized people</option>\n';
        stateSelectorBody += '<option value="hospitalizedIncrease">Number of increased hospitalized people</option>\n';
        stateSelector.innerHTML = stateSelectorBody;
        console.log(stateSelectorBody);
        // Set the new-selection handler
        stateSelector.onchange = onMethodSelectorChanged;

        // Start us out looking at selected.
        var methodname = stateSelector.value;
        createStateChart(methodname);
        changeCasesState(state_n);
        changeVaccinationsState(state_n);
        createStateTable();
    }
}
//create table by the given state name.
function createStateTable() {
    var url = getAPIBaseURL() + '/state_information?region_name=' + state_n;
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(info => {
            var listBody = '';
            if (info.length === 0) { listBody += "<th>No data</th>" } else {
                for (var k = 0; k < info.length; k++) {
                    var infos = info[k];
                    listBody += createTableStatement("Total covid cases:  ", infos["cases"]);
                    listBody += createTableStatement("People with one or more doses of the vaccination:  ", infos["people_with_1_or_more_doses"]);
                    listBody += createTableStatement("Deaths:  ", infos["death"]);
                    listBody += createTableStatement("Increased deaths:  ", infos["deathIncrease"]);
                    listBody += createTableStatement("Hospitalized:  ", infos["hospitalized"]);
                    listBody += createTableStatement("Currently hospitalized:  ", infos["hospitalizedCurrently"]);
                    listBody += createTableStatement("Increased hospitalized:  ", infos["hospitalizedIncrease"]);
                    listBody += createTableStatement("Increased covid cases:  ", infos["cases_increased"]);
                    listBody += createTableStatement("People with one or more doses of the vaccination per 100K:  ", infos["people_with_1_or_more_doses_per_100K"]);
                    listBody += createTableStatement("People with two doses of the vaccination:  ", infos["people_with_2_doses"]);
                    listBody += createTableStatement("People with two doses of the vaccination per 100K:  ", infos["people_with_2_doses_per_100K"]);
                }
            }

            console.log(listBody);
            document.getElementById('table').innerHTML = listBody;
            document.getElementById('tableInfo').innerHTML = "<h1>Newest data from " + state_n + ": </h1>";
        })
        .catch(function(error) {
            console.log(error);
        });
}
//changes the table content to HTML version
function createTableStatement(string1, string2) {
    s = "<tr> <td> " + string1 + "</td>" + "<td>" + string2 + "</td></tr>";
    return s;
}
//change the state information in the table
function changeCasesState(stateName) {
    var url = getAPIBaseURL() + '/total_cases?region_contains=' + stateName;
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(info => {
            var listBody = '';
            if (info.length === 0) { listBody += "No data" } else {
                for (var k = 0; k < info.length; k++) {
                    var infos = info[k];
                    let s = infos['region_name'] + '"'
                    listBody += '<h4>' + infos['region_name'] + " cases: " + infos['cases'] + '</h4>';
                }
            }
            document.getElementById('cases').innerHTML = listBody;

        })
        .catch(function(error) {
            console.log(error);
        });
}
//change the vaccination in the table
function changeVaccinationsState(stateName) {
    var url = getAPIBaseURL() + '/total_vaccinations?region_contains=' + stateName;
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(info => {
            var listBody = '';
            if (info.length === 0) { listBody += "No data" } else {
                for (var k = 0; k < info.length; k++) {
                    var infos = info[k];

                    listBody += '<h4>' + infos['region_name'] + " vaccinations: " + infos['vaccinations'] + '</h4>' + '</br>';
                }
            }


            document.getElementById('vaccinations').innerHTML = listBody;

        })
        .catch(function(error) {
            console.log(error);
        });
}
//get basic url
function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}
//update the data when choosing a new method
function onMethodSelectorChanged() {
    var stateSelector = document.getElementById('method-select');
    if (stateSelector) {
        var methodname = stateSelector.value;
        createStateChart(methodname);
        var element = document.getElementById('state');
        element.innerHTML = '<h1>' + methodname + "in" + stateName + ": " + '</h1>';
        changeCasesState(stateName);
        changeVaccinationsState(stateName);
    }
}
//create the chart by the given method name
function createStateChart(methodname) {
    // Set the title
    var stateSelector = document.getElementById('method-select');
    var stateTitle = document.getElementById('state-new-cases-title');
    if (stateTitle) {
        if (stateSelector) {
            var Name = stateSelector.options[stateSelector.selectedIndex].text
            stateTitle.innerHTML = '<h1>' + Name + " in " + state_n + '</h1>';
        }
    }

    // Create the chart

    var url = getAPIBaseURL() + "/state_information?region_name=" + state_n + "&historical_data=yes";

    fetch(url, { method: 'get' })

    .then((response) => response.json())

    .then(function(info) {
        // Use the API response (days), which is a list of dictionaries like this:
        //
        //   {date: '20200315', positiveIncrease: 2345, ... }
        //
        // to assemble the data my bar-chart will need. That data looks like a
        // list of dictionaries (newCasesData). Each dictionary in the list will look
        // like this:
        //
        //   {meta:'2020-03-15', value: 2345}
        //
        // Here, meta is the date, which Chartist will use in a popup window that appears
        // if you hover over a bar in the bar chart, and value is the number of new COVID
        // cases for that date, which will, of course, determine the height of the bar
        // in the bar chart.
        //
        // In this same loop, we're also creating a list (labels) of labels to be used
        // along the x-axis of the bar chart.
        // This code assumes results are sorted in descending order by date, which is
        // indeed how the API returns the data as of this writing.
        var labels = [];
        var newCasesData = [];
        for (var k = 0; k < info.length; k++) {
            // Assumes YYYYMMDD int
            var infos = info[k];
            var date = infos["day"];
            labels.push(date);
            newCasesData.push({ meta: date, value: infos[methodname] });
        }

        // We set some options for our bar chart. seriesBarDistance is the width of the
        // bars. axisX allows us to specify a bunch of options related to the x-axis.
        // The one we're picking is labelInterpolationFnc, which allows us to control
        // which bars have x-axis labels. Here, we're saying "write the date of the bar
        // on the x-axis every 7 days". Otherwise, the axis just gets too crowded.
        var options = {
            seriesBarDistance: 25,
            axisX: {
                labelInterpolationFnc: function(value, index) {
                    return index % 7 === 0 ? value : null;
                }
            },
        };

        // Here's the form in which Chartist expects its data to be specified. Not that
        // series is a list, since you might want to have two or more differently colored
        // sets of bars, or line graphs, etc. on the same chart.
        var data = { labels: labels, series: [newCasesData] };

        // Finally, we create the bar chart, and attach it to the desired <div> in our HTML.
        var chart = new Chartist.Bar('#state-new-cases-chart', data, options);

        // HERE COMES THE MESS THAT IS TOOLTIPS! FEEL FREE TO IGNORE!
        // Tooltips are those little sometimes-informative popups that give you a little
        // information about something your mouse is hovering over. We want them on this
        // bar chart so we can get the exact number of new cases on a particular day, not
        // just an estimate (which is what you'll get from just looking at the bar's height).
        //
        // I got a lot of help from here.
        // https://stackoverflow.com/questions/34562140/how-to-show-label-when-mouse-over-bar
        //
        // Note that all of this code uses jQuery notation. I wrote everything above here
        // in vanilla Javascript, but I don't feel like rewriting the following more complicated code.

        chart.on('created', function(bar) {
            var toolTipSelector = '#state-new-cases-tooltip';
            $('.chart-container .ct-bar').on('mouseenter', function(e) { // Set a "hover handler" for every bar in the chart
                var value = $(this).attr('ct:value'); // value and meta come ultimately from the newCasesData above
                var label = $(this).attr('ct:meta');
                var caption = '<b>Date:</b> ' + label + '<br><b>New cases (' + stateName + '):</b> ' + value;
                $(toolTipSelector).html(caption);
                $(toolTipSelector).parent().css({ position: 'relative' });
                // bring to front, https://stackoverflow.com/questions/3233219/is-there-a-way-in-jquery-to-bring-a-div-to-front
                $(toolTipSelector).parent().append($(toolTipSelector));

                var x = e.clientX;
                var y = e.clientY;
                $(toolTipSelector).css({ top: y, left: x, position: 'fixed', display: 'block' });
            });

            $('.state-new-cases-chart .ct-bar').on('mouseout', function() {
                $(toolTipSelector).css({ display: 'none' });
            });
        });
    })

    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
}

/*
For reference, this is what the "day" dictionaries returned by the COVID API look like.

{
    "date":20200607,
    "state":"MN",
    "positive":27886,
    "negative":316317,
    "pending":null,
    "hospitalizedCurrently":450,
    "hospitalizedCumulative":3367,
    "inIcuCurrently":199,
    "inIcuCumulative":1044,
    "onVentilatorCurrently":null,
    "onVentilatorCumulative":null,
    "recovered":22992,
    "dataQualityGrade":"A",
    "lastUpdateEt":"6/6/2020 17:00",
    "dateModified":"2020-06-06T17:00:00Z",
    "checkTimeEt":"06/06 13:00",
    "death":1197,
    "hospitalized":3367,
    "dateChecked":"2020-06-06T17:00:00Z",
    "fips":"27",
    "positiveIncrease":385,
    "negativeIncrease":10334,
    "total":344203,
    "totalTestResults":344203,
    "totalTestResultsIncrease":10719,
    "posNeg":344203,
    "deathIncrease":16,
    "hospitalizedIncrease":31,
    "hash":"5f4eb67ca77d3ebc7d7b111b20fbd5476b182a45",
    "commercialScore":0,
    "negativeRegularScore":0,
    "negativeScore":0,
    "positiveScore":0,
    "score":0,
    "grade":""
}
*/

function abbrState(input, to) {

    var states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr') {
        input = input.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        for (i = 0; i < states.length; i++) {
            if (states[i][0] == input) {
                return (states[i][1]);
            }
        }
    } else if (to == 'name') {
        input = input.toUpperCase();
        for (i = 0; i < states.length; i++) {
            if (states[i][1] == input) {
                return (states[i][0]);
            }
        }
    }
}