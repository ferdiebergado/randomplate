/*! 
 Created on : Dec 22, 2014, 10:19:11 PM
 Author     : Ferdinand Bergado
 */

var dateselected;

// Test if sqlite is supported
function initDB() {

    if (!sqlitePlugin.openDatabase)  // Check browser is supported SQLite or not.

    {
        alert('Databases are not supported by your device. \nThe app won\'t be able to generate driver names.');
    }

    dateselected = new Date();
    document.getElementById("dateinput").value = dateselected.toLocaleDateString();

}

//Invoke Cordova Datepicker Plugin
function showDatePicker() {
    var options = {
        date: new Date(),
        mode: 'date'
    };

    datePicker.show(options, function (date) {
        dateselected = date;
        document.getElementById("dateinput").value = dateselected.toLocaleDateString();
    });
}

// Generate driver's name
function generateNames() {

    var sql_fname_count = "SELECT * FROM fnames";
    var sql_lname_count = "SELECT * FROM lnames";
    var sql_fname = " WHERE fnid = (?)";
    var sql_lname = " WHERE lnid = (?)";
    var fid = 0;
    var fn = '';
    var lid = 0;
    var ln = '';
    var fcount = 0;
    var lcount = 0;
    var dataset;

    var db = sqlitePlugin.openDatabase({name: "names.db"});

    db.transaction(function (tx) {

        // Get the number of records
        tx.executeSql(sql_fname_count, [], function (tx, result) {

            dataset = result.rows;
            fcount = dataset.length;
            fid = getRandomInt(1, fcount);

            //Retrieve the id of the first name that corresponds to the randomly generated number
            tx.executeSql(sql_fname_count + sql_fname, [fid], function (tx, result) {
                dataset = result.rows;
                fn = dataset.item(0).fname;
                document.getElementById("driver-name").innerHTML = fn;
                // $("#driver-name").prop("innerHTML", fn);
            });
        });

        tx.executeSql(sql_lname_count, [], function (tx, result) {

            dataset = result.rows;
            lcount = dataset.length;
            lid = getRandomInt(1, lcount);

            tx.executeSql(sql_lname_count + sql_lname, [lid], function (tx, result) {
                dataset = result.rows;
                ln = dataset.item(0).lname;
                var fname = document.getElementById("driver-name").textContent;
                document.getElementById("driver-name").innerHTML = fname + ' ' + ln;
                // $("#driver-name").prop("innerHTML", $("#driver-name").text() + ' ' + ln);
            });
        });

    }, function (e) {
        alert("ERROR: " + e.textContent);
    });

    var pn = generatePlates();
    // document.getElementById("plate-number").textContent = pn;            
    // document.getElementById("plate-number").className = "plate-number";
    $("#plate-number").prop("innerHTML", "<h1>" + pn + "</h1>");
}

// Generate plate numbers
function generatePlates() {
    var platedigits = 0;
    var plateletters = '';
    var platenumber = '';
    if (document.getElementById("select-vehicle").value == 'tric') {
        platedigits = getRandomInt(1000, 9999);
        plateletters = String.fromCharCode(getRandomInt(65, 90)) + String.fromCharCode(getRandomInt(65, 90));
        platenumber = platedigits + ' ' + plateletters;
    } else {
        var fl = '';
        platedigits = (getRandomInt(100, 999)).toString();
        var f2 = getRandomInt(10, 99);
        var ld = parseInt(platedigits.substr(platedigits.length - 1));
        var sel_area = document.getElementById("select-area").value;
        // var d3 = 0;
        // var sel_day = document.getElementById("select-day").value;
        switch (sel_area) {
            case "REGION_I": //Region I
                fl = 'A';
                break;
            case "REGION_II": //Region II
                fl = "B";
                break;
            case "REGION_III": //Region III
                fl = "R";
                break;    
            case "REGION_IVA": //Region IV-A
                fl = "V";
                break; 
            case "REGION_IVB": //Region IV-B
                fl = "V";
                break;    
            case "REGION_V": //Region V
                fl = "E";
                break;
            case "REGION_VIII": //Region III
                fl = "H";
                break;
            case "REGION_IX" : //Region IX
                fl = "J";
                break;
            case "ARMM" : //ARMM
                fl = "J";
                break;    
            case "REGION_XII": //Region XII
                fl = "M";
                break;
            case "NCR":
                var l = getRandomInt(1, 2);
                if (l == 1) {
                    fl = 'P';
                } else {
                    fl = 'T';
                }
                break;
            case "REGION_VII": //Region VII
                fl = 'Y';
                break;
            case "REGION_XI": //Region XI
                fl = 'L';
                break;
            case "REGION_X": //Region X
                fl = 'K';
                break;
            case "CARAGA": //CARAGA
                fl = 'K';
                break;
            case "CAR": //CAR
                fl = 'A';
                break;
            case "REGION_VI": //Region VI
                fl = "F";
                break;
        }
        // Get the day of week and assign an appropriate last digit for the plate number        
        var selecteddate = new Date(dateselected);
        switch (selecteddate.getDay()) {
            case 1: //Monday
                d3 = getDigit(ld, 1, 2);
                break;
            case 2: //Tuesday
                d3 = getDigit(ld, 3, 4);
                break;
            case 3: //Wednesday
                d3 = getDigit(ld, 5, 6);
                break;
            case 4: //Thursday
                d3 = getDigit(ld, 7, 8);
                break;
            case 5: //Friday
                d3 = getDigit(ld, 9, 0);
                break;            
        }
        // Use the generated last digit if the date falls on a week day
        if ((selecteddate.getDay() !== 0) && (selecteddate.getDay() !== 6)) {
            platedigits = f2.toString() + d3.toString();
        }
        // Combine the characters and digits for the plate number
        plateletters = fl + String.fromCharCode(getRandomInt(65, 90)) + String.fromCharCode(getRandomInt(65, 90));
        platenumber = plateletters + ' ' + platedigits;
    }
    return platenumber;
}

//Generate the appropriate last digit
function getDigit(d, x, y) {
    while ((d === x) || (d === y)) {
        d = getRandomInt(1, 10);
        if (d === 10) {
            d = 0;
        }
    }
    return d;
}

//Generate a random integer
function getRandomInt(mind, maxd) {
    return Math.floor(Math.random() * (maxd - mind + 1)) + mind;
}

//Show that About Dialog 
function showAbout() {
    $("#popupAbout").popup("open");
}

//Quit the application
function exitRPNG() {
    var c = confirm("Are you sure you want to exit this app?");
    if (c == true) {
        navigator.app.exitApp();
    }
}