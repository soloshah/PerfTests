/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.99, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)  ", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "GETDashboard"], "isController": false}, {"data": [0.96, 500, 1500, "POSTlogin"], "isController": false}, {"data": [1.0, 500, 1500, "GET/newComp?personId=1"], "isController": false}, {"data": [0.92, 500, 1500, "GETlogin"], "isController": false}, {"data": [1.0, 500, 1500, "GETsearch"], "isController": false}, {"data": [1.0, 500, 1500, "GET/viewCustomer?personId=00001&personIdC=00001"], "isController": false}, {"data": [1.0, 500, 1500, "Debug Sampler"], "isController": false}, {"data": [1.0, 500, 1500, "GET/searchresults?firstName=TEST&lastName=&postcode="], "isController": false}, {"data": [1.0, 500, 1500, "POST/saveComplaint"], "isController": false}, {"data": [1.0, 500, 1500, "GEThome"], "isController": false}, {"data": [1.0, 500, 1500, "POSTlogout"], "isController": false}, {"data": [1.0, 500, 1500, "GET/login?logout"], "isController": false}, {"data": [0.99, 500, 1500, "GET/viewCustomer?personId=1&personIdC=1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 650, 0, 0.0, 180.4246153846155, 0, 1789, 379.9, 407.44999999999993, 590.4800000000005, 15.69252311629367, 689.1715979288888, 12.10889403925545], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "90th pct", "95th pct", "99th pct", "Throughput", "Received", "Sent"], "items": [{"data": ["GETDashboard", 50, 0, 0.0, 137.18000000000006, 99, 264, 172.0, 201.94999999999996, 264.0, 2.301601914932793, 171.30378016537009, 1.1103431113054687], "isController": false}, {"data": ["POSTlogin", 50, 0, 0.0, 332.84, 272, 620, 403.7, 587.2999999999997, 620.0, 2.2820629849383844, 170.80176182393885, 3.1110936786855317], "isController": false}, {"data": ["GET/newComp?personId=1", 50, 0, 0.0, 200.51999999999998, 52, 390, 265.9, 322.8499999999997, 390.0, 2.0311992200194995, 90.42406996465714, 1.0909761435651608], "isController": false}, {"data": ["GETlogin", 50, 0, 0.0, 476.54000000000013, 372, 1789, 543.5, 1303.6499999999978, 1789.0, 2.0083547557840618, 143.37770123714654, 2.6065463578486505], "isController": false}, {"data": ["GETsearch", 50, 0, 0.0, 42.800000000000004, 35, 187, 45.9, 53.94999999999995, 187.0, 2.3522770041400074, 7.520854405814829, 1.1370870283684607], "isController": false}, {"data": ["GET/viewCustomer?personId=00001&personIdC=00001", 50, 0, 0.0, 191.98, 97, 370, 298.79999999999995, 346.74999999999983, 370.0, 2.252049364922079, 154.7988356904783, 1.2755748356003962], "isController": false}, {"data": ["Debug Sampler", 50, 0, 0.0, 0.2, 0, 6, 0.8999999999999986, 1.0, 6.0, 1.5109848599317035, 0.7534856531987549, 0.0], "isController": false}, {"data": ["GET/searchresults?firstName=TEST&lastName=&postcode=", 50, 0, 0.0, 112.94000000000001, 35, 222, 195.5, 205.14999999999998, 222.0, 2.234137622877569, 9.924894576630921, 1.1890673871760502], "isController": false}, {"data": ["POST/saveComplaint", 50, 0, 0.0, 334.9, 172, 474, 447.0, 456.79999999999995, 474.0, 1.5241114430287144, 110.47027649286717, 2.3308188669755534], "isController": false}, {"data": ["GEThome", 50, 0, 0.0, 183.84000000000006, 122, 358, 291.2, 342.84999999999997, 358.0, 1.5093428321308902, 119.6961633920216, 0.7782548978174902], "isController": false}, {"data": ["POSTlogout", 50, 0, 0.0, 102.87999999999998, 66, 337, 210.8, 218.94999999999996, 337.0, 1.5052986512524085, 3.8896681945447975, 1.8272326401433043], "isController": false}, {"data": ["GET/login?logout", 50, 0, 0.0, 77.57999999999998, 65, 199, 87.8, 116.24999999999997, 199.0, 1.506114826194349, 3.6211471700102416, 1.4766985209952406], "isController": false}, {"data": ["GET/viewCustomer?personId=1&personIdC=1", 50, 0, 0.0, 151.32000000000002, 87, 925, 201.2, 365.1999999999998, 925.0, 1.5233220607500837, 109.82116675044938, 0.8062896063735795], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Percentile 1
            case 8:
            // Percentile 2
            case 9:
            // Percentile 3
            case 10:
            // Throughput
            case 11:
            // Kbytes/s
            case 12:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 650, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
