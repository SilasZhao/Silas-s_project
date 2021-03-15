/*
 * map-sample-usa.js
 * Jeff Ondich
 * 11 November 2020
 *
 * Simple sample using the Datamaps library to show how to incorporate
 * a US map in your project.
 *
 * Datamaps is Copyright (c) 2012 Mark DiMarco
 * https://github.com/markmarkoh/datamaps
 */

window.onload = initialize;

// This is example data that gets used in the click-handler below. Also, the fillColor
// specifies the color those states should be. There's also a default color specified
// in the Datamap initializer below.

var extraStateInfo = {};

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}


function initialize() {
    initializeMap();
    getUSCovidAndVaccination();
    methodSelector();
}
//initialize the map
function initializeMap() {
    var url = getAPIBaseURL() + '/total_cases_and_vaccination';
    console.log(url);
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(function(info) {
            for (var k = 0; k < info.length; k++) {
                var infos = info[k];
                var state = {};
                state["vaccination"] = infos['vaccination'];
                state["cases"] = infos['cases'];
                extraStateInfo[infos["region_name"]] = state;
            }
        })
        .catch(function(error) {
            console.log(error);
        });
    var map = new Datamap({
        element: document.getElementById('map-container'), // where in the HTML to put the map
        scope: 'usa', // which map?
        projection: 'equirectangular', // what map projection? 'mercator' is also an option
        done: onMapDone, // once the map is loaded, call this function
        data: extraStateInfo, // here's some data that will be used by the popup template
        fills: { defaultFill: '#999999' },
        geographyConfig: {
            //popupOnHover: false, // You can disable the hover popup
            //highlightOnHover: false, // You can disable the color change on hover
            popupTemplate: hoverPopupTemplate, // call this to obtain the HTML for the hover popup
            borderColor: '#eeeeee', // state/country border color
            highlightFillColor: '#bbbbbb', // color when you hover on a state/country
            highlightBorderColor: '#000000', // border color when you hover on a state/country
        }
    });
}

// This gets called once the map is drawn, so you can set various attributes like
// state/country click-handlers, etc.
function onMapDone(dataMap) {
    dataMap.svg.selectAll('.datamaps-subunit').on('click', onStateClick);
}
//create the pop up template
function hoverPopupTemplate(geography, data) {
    var template = '<div class="hoverpopup"><strong>' + geography.properties.name + '</strong><br>\n';
    template += getStateInfo(geography.properties.name);
    template += '</div>';
    return template;

}
//create the HTML version of statename for pop up template 
function getStateInfo(statename) {
    var info = extraStateInfo[statename];
    var s = '<strong>Cases: </strong>' + info['cases'] + '<br>\n';
    s += '<strong>Vaccinations: </strong>' + info['vaccination'] + '<br>\n';
    return s;

}

window.onclick = function(event) {
    if (event.target.className.indexOf('dropbtn') == -1) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}

//create the HTML content under the search bar
function filterFunction() {
    var input = document.getElementById("myInput");
    var url = getAPIBaseURL() + '/total_cases?region_contains=' + input.value;
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(info => {
            var listBody = '';
            if (info.length === 0) { listBody += "No results!" } else {
                for (var k = 0; k < info.length; k++) {
                    var infos = info[k];
                    let s = infos['region_name'] + '"'
                    listBody += '<a href="/state_detail?state=' + s + 'class="home">' + infos['region_name'] + '</a>' + '</br>';
                }
            }
            document.getElementById('list_container').innerHTML = listBody;
            document.getElementsByClassName("dropdown-content_a")[0].style.display = "block";

        })
        .catch(function(error) {
            console.log(error);
        });
}

function getAPIBaseURL() {
    var baseURL = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/api';
    return baseURL;
}
//click a certain part of the map to enter the state_detail page
function onStateClick(geography) {
    var url = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/state_detail?state=' + geography.properties.name;
    window.location.href = url;

}

function methodSelector() {
    // create the the drop-down list with the list of states from the API.
    var stateSelector = document.getElementById('method-select');
    if (stateSelector) {
        // create the drop down list
        var stateSelectorBody = '<option value="increased_cases">increased cases in the US</option>\n';
        stateSelectorBody += '<option value="total_cases">total cases in the US</option>\n';
        stateSelectorBody += '<option value="people_with_1_or_more_doses">people with 1 or more doses in the US</option>\n';
        stateSelectorBody += '<option value="total_doses_administered_daily">total doses administered daily in the US</option>\n';
        stateSelectorBody += '<option value="people_with_2_doses">people with 2 doses in the US</option>\n';

        stateSelector.innerHTML = stateSelectorBody;

        // Set the new-selection handler
        stateSelector.onchange = onStateSelectorChanged;

        // Start us out looking at selected.
        var methodname = stateSelector.value;
        var name = stateSelector.options[stateSelector.selectedIndex].text
        var element = document.getElementById('state-new-cases-title');
        element.innerHTML = '<h1> Information about ' + name + '</h1>';
        createStateChart(methodname);
    }
}
//get the latest covid and vaccination data in the US
function getUSCovidAndVaccination() {
    console.log("yes");
    var url = getAPIBaseURL() + '/us_information';
    fetch(url, { method: 'get' })
        .then((response) => response.json())
        .then(info => {
            var covid_vaccination = ""
            for (var k = 0; k < info.length; k++) {
                var infos = info[k];
                if (infos["day"] == "2021-02-28") {
                    covid_vaccination = "<h3> Total cases: " + infos["total_cases"] + "</h3>" + "<h3>Total vaccinations: " + infos["people_with_1_or_more_doses"] + "</h3>";
                }
            }

            document.getElementById('CovidAndVaccination').innerHTML = covid_vaccination;
        })
        .catch(function(error) {
            console.log(error);
        });
}
//Create the title of the graph
function onStateSelectorChanged() {
    var stateSelector = document.getElementById('method-select');
    if (stateSelector) {
        var name = stateSelector.options[stateSelector.selectedIndex].text
        var methodname = stateSelector.value;
        createStateChart(methodname);
        var element = document.getElementById('state-new-cases-title');
        element.innerHTML = '<h1> Information about ' + name + '</h1>';
    }
}
//create the chart by a specific methodname
function createStateChart(methodname) {
    // Create the chart
    var url = getAPIBaseURL() + "/us_information";

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
        var data = {
            labels: labels,
            series: [newCasesData]
        };

        // Finally, we create the bar chart, and attach it to the desired <div> in our HTML.
        var chart = new Chartist.Line('#state-new-cases-chart', data, options);

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

        chart.on('created', function(line) {
            var toolTipSelector = '#state-new-cases-tooltip';
            $('.chart-container .ct-line').on('mouseenter', function(e) { // Set a "hover handler" for every bar in the chart
                var value = $(this).attr('ct:value'); // value and meta come ultimately from the newCasesData above
                var label = $(this).attr('ct:meta');
                var caption = '<b>Date:</b> ' + label + '<br><b>New cases:</b> ' + value;
                $(toolTipSelector).html(caption);
                $(toolTipSelector).parent().css({ position: 'relative' });
                // bring to front, https://stackoverflow.com/questions/3233219/is-there-a-way-in-jquery-to-bring-a-div-to-front
                $(toolTipSelector).parent().append($(toolTipSelector));

                var x = e.clientX;
                var y = e.clientY;
                $(toolTipSelector).css({ top: y, left: x, position: 'fixed', display: 'block' });
            });

            $('.state-new-cases-chart .ct-line').on('mouseout', function() {
                $(toolTipSelector).css({ display: 'none' });
            });
        });
    })

    // Log the error if anything went wrong during the fetch.
    .catch(function(error) {
        console.log(error);
    });
}