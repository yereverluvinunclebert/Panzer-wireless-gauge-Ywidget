/*
    Panzer Wireless Widget

    Created by Dean Beedell

    Visuals added to and enhanced by Dean Beedell
    Sorted by Harry Whitfield

    email: dean.beedell@lightquick.co.uk
    http//lightquick.co.uk
*/

/*jslint for, multivar, this */

/*property
    ConnectServer, MouseWheelPref, WMIenabled, actionSwitchPref, airport,
    available, busy, charAt, clockSize, createObject, ctrlKey, data,
    defaultValue, devicePref, devices, duration, ease, endAngle, floor,
    hOffset, hRegistrationPoint, height, i, ibps, interval, isNaN, kEaseOut,
    keyCode, length, maxLength, maxSpeedPref, milliseconds, minLength,
    minSpeedPref, name, network, networkswitch, noise, obps, onKeyDown,
    onMouseDown, onMouseUp, onMouseWheel, onPreferencesChanged, onTimerFired,
    onWakeFromSleep, onload, opacity, option, optionValue, platform, powered,
    random, reset, rotation, round, sampleIntervalPref, scrollDelta, setTick,
    signal, size, soundPref, src, srcHeight, srcWidth, start, startAngle,
    startTime, ticking, ticks, toFixed, tooltip, traffic, type, vOffset,
    vRegistrationPoint, value, visible, width, wirelessSwitch
*/

"use strict";

var mainWindow, background, surround, switchFacesButton, networkScaleText,
        wirelessPercentText, tempDigitalCurrText,
        hourHand, hourShadow, minuteHand, minuteShadow, pointer, pointerShadow,
        bigReflection, windowReflection,
        startButton, stopButton, pin, prefs, tankHelp, helpbutton, actionSwitch,
        createLicence, setmenu, theDLSdelta, lprint, smallMinuteHand,
        helpButton, showFace, mainScreen, settooltip, checkLockWidget,
        dangerLamp, OHMLamp, letterBack, sensorNumber, sensorNumberText, buildVitality,
        helpWindow, changePrefs, networkScaleTextArea, wirelessPercentTextArea,
        tempDigitalCurrTextArea, engineIdentifier, runJscript, getMacTemps,
        NETSTAT, maxBytes, minSpeedPref, Menu, SNOWLEOPARD, percent, getSystemAirport;
        

var sensorNumberVar;
var windowx = 785, windowy = 622;
var backxo = 0, backyo = 0, backgroundxo = 7, backgroundyo = 0;
var surroundxo = 0, surroundyo = 0;
var switchFacesButtonxo = 710, switchFacesButtonyo = 267;
var dangerLampxo = 266, dangerLampyo = 293;
var engineIdentifierxo = 350, engineIdentifieryo = 270;
var startButtonxo = 710, startButtonyo = 135;
var stopButtonxo = 710, stopButtonyo = 395;
var secondxo = 416, secondyo = 313, secondxr = 11.5, secondyr = 245.5;
var pointerShadowxo = 416, pointerShadowyo = 313, pointerShadowxr = 22.5, pointerShadowyr = 260.5;

// macintosh
var wirelessPercentTextAreaxo = 346, wirelessPercentTextAreayo = 190;   // was 323, 190
var networkScaleTextAreaxo = 536, networkScaleTextAreayo = 383;         // was 513, 383

// windows
var wirelessPercentTextxo = 346, wirelessPercentTextyo = 210;           // was 333, 210
var networkScaleTextxo = 538, networkScaleTextyo = 403;                 // was 523, 403

var shadowOffset = 0;
var bigReflectionxo = 169, bigReflectionyo = 69;
var windowReflectionxo = 511, windowReflectionyo = 210;
var pinxo = 162, pinyo = 60;
var prefsxo = 161, prefsyo = 516;
var helpButtonxo = 625, helpButtonyo = 516;
var actionSwitchxo = 625, actionSwitchyo = 59;
var vols = 0;
var volsCnt = 0;


var currIcon = "Resources/images/dock.png";
var widgetName = "Panzer OHM gauge Ywidget.widget";

var counter = "Resources/sounds/counter.mp3";
var lock = "Resources/sounds/lock.mp3";
var till = "Resources/sounds/till01.mp3";
var ting = "Resources/sounds/ting.mp3";
var mistake = "Resources/sounds/mistake.wav";
var thhhh = "Resources/sounds/thhhh.mp3";
var winding = "Resources/sounds/winding.mp3";
var konPath2 = "";
var OHM = false;
var cpuTemp = [], cpuName = [], cpuMax = [], cpuIdent = [];
var sensorCounter = 1;
var sensorCount = 0;
var maxSpeed = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];
var wmi;
var FSWbemLocator;
var devTypeOf = [];
var wirelessStrength;
var timerCount = 1,
    timerCountModulo = 10;
var percentageBandwidth;


var systemAirport;              // **** declarations to fix problems below
var deviceMenu = null;          // **** declarations to fix problems below
var devName = null;             // **** declarations to fix problems below


var WbemUser = "";
var WbemPassword = "";
var WbemComputer = "."; // was localhost
  
//these are NOT the wmi get statements that cause the generic error on Windows 10, it is the collection of data itself
//that causes the problem, empty collectors?
  
if (system.platform === "windows") {
    //these work
    FSWbemLocator = COM.createObject("WbemScripting.SWbemLocator"); // Creates variable to access WMI
    wmi = FSWbemLocator.ConnectServer(WbemComputer, "root\\cimv2"); // Connects to WMI interface
} else {
    FSWbemLocator = null;
    wmi = null;
}

include("Menu.js");
include("getWiFiData.js");
if (system.platform === "macintosh") {
    include("NETSTATmac.js");
} else {
    include("NETSTATwin.js");
}
include("functions.js");
include("Resources/Licence/licence.js");

Number.isNaN = Number.isNaN || function (value) {       // polyfill
    return value !== value;
};

//===============================================================
// this function does the actual resizing
//===============================================================
function sizeClock() {
    var scale = Number(preferences.clockSize.value) / 100;

    function sc(img, hOffset, vOffset, hReg, vReg) {
        img.hOffset = Math.round(hOffset * scale);
        img.vOffset = Math.round(vOffset * scale);
        img.width = Math.round(img.srcWidth * scale);
        img.height = Math.round(img.srcHeight * scale);
        if (hReg !== undefined) {
            img.hRegistrationPoint = Math.round(hReg * scale);
        }
        if (vReg !== undefined) {
            img.vRegistrationPoint = Math.round(vReg * scale);
        }
    }

    mainWindow.width = Math.round(windowx * scale);
    mainWindow.height = Math.round(windowy * scale);

    sc(background, backgroundxo, backgroundyo);
    sc(surround, surroundxo, surroundyo);
    sc(switchFacesButton, switchFacesButtonxo, switchFacesButtonyo);
    sc(dangerLamp, dangerLampxo, dangerLampyo);
    sc(startButton, startButtonxo, startButtonyo);
    sc(stopButton, stopButtonxo, stopButtonyo);
    sc(pointer, secondxo, secondyo, secondxr, secondyr);
    sc(pointerShadow, pointerShadowxo + shadowOffset, pointerShadowyo + shadowOffset, pointerShadowxr, pointerShadowyr);

    sc(bigReflection, bigReflectionxo, bigReflectionyo);
    sc(windowReflection, windowReflectionxo, windowReflectionyo);
    sc(pin, pinxo, pinyo);
    sc(prefs, prefsxo, prefsyo);

    sc(helpButton, helpButtonxo, helpButtonyo);
    sc(actionSwitch, actionSwitchxo, actionSwitchyo);

    networkScaleTextArea.size = Math.round(23 * scale);
    networkScaleTextArea.hOffset = Math.round(networkScaleTextAreaxo * scale);
    networkScaleTextArea.vOffset = Math.round(networkScaleTextAreayo * scale);
    wirelessPercentTextArea.size = Math.round(23 * scale);
    wirelessPercentTextArea.hOffset = Math.round(wirelessPercentTextAreaxo * scale);
    wirelessPercentTextArea.vOffset = Math.round(wirelessPercentTextAreayo * scale);

    networkScaleText.size = Math.round(23 * scale);
    networkScaleText.hOffset = Math.round(networkScaleTextxo * scale);
    networkScaleText.vOffset = Math.round(networkScaleTextyo * scale);
    wirelessPercentText.size = Math.round(23 * scale);
    wirelessPercentText.hOffset = Math.round(wirelessPercentTextxo * scale);
    wirelessPercentText.vOffset = Math.round(wirelessPercentTextyo * scale);

    engineIdentifier.size = Math.round(9 * scale);
    engineIdentifier.hOffset = Math.round(engineIdentifierxo * scale);
    engineIdentifier.vOffset = Math.round(engineIdentifieryo * scale);
}
//=====================
//End function
//=====================




//=====================
//
//=====================
function showDigitalValues() {
    wirelessPercentTextArea.data = cpuMax[sensorCounter] || "00";
    wirelessPercentText.data = cpuMax[sensorCounter] || "00";
}
//=====================
//End function
//=====================

//======================================================================================
// Function to find network maximumSpeedIndex
//======================================================================================
function maximumSpeedIndex(maxBytes) {
    var maxS = maxBytes / 125000, i;
    
    for (i = 0; i < maxSpeed.length; i += 1) {
        if (maxS <= maxSpeed[i]) {
            return i;
        }
    }
    return maxSpeed.length - 1;
}
//=====================
//End function
//=====================

//===============================================================
// this function is called by the main timer and does the gauge work
//===============================================================
function updateNetwork() {
    var wirelessText, traffic, bytes, curSpeed, speedIndex;

    var rotateObject = function (obj, value) {
        var animationDuration,
            animationInterval = 60,

            updateMe = function () {    // called during rotateAnimation
                var now = animator.milliseconds, fraction, angle;

                if (now >= (this.startTime + this.duration)) {
                    obj.rotation = this.endAngle;
                    obj.busy = false;
                    return false;
                }
                fraction = (now - this.startTime) / this.duration;
                angle = animator.ease(this.startAngle, this.endAngle, fraction, animator.kEaseOut);
                obj.rotation = angle;
                return true;
            },

            rotateAnimation = function (startAngle, endAngle) {
                var rotate = new CustomAnimation(animationInterval, updateMe);
                rotate.duration = animationDuration;
                rotate.startAngle = startAngle;
                rotate.endAngle = endAngle;
                animator.start(rotate);
            };

        obj.busy = true;
        animationDuration = animationInterval * Math.floor(900 / animationInterval - 1);
        rotateAnimation(obj.rotation, value);
    };


//	if (preferences.WMIenabled.value === "enabled" && system.platform === "windows") {
        traffic = NETSTAT.traffic(devName);     // **** devName is not set anywhere  hw
        bytes = traffic.ibps + traffic.obps;

        if (bytes > maxBytes) {
            maxBytes = bytes;
            curSpeed = String(maxSpeed[maximumSpeedIndex(maxBytes)]);
            preferences.maxSpeedPref.value = curSpeed;
            print("---- 1 speeds ----");
            print("maxBytes: " + maxBytes.toFixed(0));
            print("Maximum Speed: " + preferences.maxSpeedPref.value);
            print("Minimum Speed: " + maxSpeed[preferences.minSpeedPref.value]);
        } else {
            timerCount = (timerCount + 1) % timerCountModulo;
            if (timerCount === 0) {
                speedIndex = maximumSpeedIndex(maxBytes);
                if ((speedIndex > minSpeedPref) && (bytes < 125000 * maxSpeed[speedIndex - 1])) {
                    maxBytes = 125000 * maxSpeed[speedIndex - 1];
                    curSpeed = String(maxSpeed[speedIndex - 1]);
                    preferences.maxSpeedPref.value = curSpeed;
                    print("---- 2 speeds ----");
                    print("maxBytes: " + maxBytes.toFixed(0));
                    print("Maximum Speed: " + preferences.maxSpeedPref.value);
                    print("Minimum Speed: " + maxSpeed[preferences.minSpeedPref.value]);
                } else {
                    // dummy();
                    print("dummy line 299");
                }
            }
        }

        percentageBandwidth = parseInt(100 * bytes / maxBytes);
        print(">>>>>>>>>>>>> percentageBandwidth: " + percentageBandwidth);
        //background.tooltip += percentageBandwidth;
        //displayValue(pointer, wirelessPercentText, whr, invNET, networkSmooth === "enabled", animationInterval);
//	}
    /*
    print("wireless : " + preferences.wirelessSwitch.value);
    print("network : " + preferences.networkswitch.value);
    print("available : " + systemAirport.available);
    print("powered : " + systemAirport.powered);
    */

    if (preferences.wirelessSwitch.value === "on") {
        if (SNOWLEOPARD) {
            systemAirport = getSystemAirport();
        } else {
            systemAirport = system.airport;
        }

        if (systemAirport.available && systemAirport.powered) {
            if (SNOWLEOPARD) {
                wirelessStrength = percent(systemAirport.signal);
            } else { //windows or earlier Macs
                wirelessStrength = parseInt(systemAirport.signal, 10);
            }

            wirelessText = String(Math.round(wirelessStrength));
            while (wirelessText.length < 3) {
                wirelessText = " " + wirelessText;
            }
            wirelessPercentText.data = wirelessText;

            background.tooltip = "   Wireless signal " + "\n" + "   " + ("Network: ") + systemAirport.network + "\n" + "   " + ("Noise level: ") + systemAirport.noise + "db \n" + "   " + ("Signal level : ") + wirelessStrength + "%";
            dangerLamp.tooltip = background.tooltip;
            background.tooltip += "\n   " + "Bandwidth usage: " + percentageBandwidth + "% ";

            networkScaleText.data = percentageBandwidth;


            dangerLamp.opacity = (wirelessStrength + 30) * 2.55;
        } else {
            pointer.rotation = 30;
            pointerShadow.rotation = 30;
            wirelessPercentText.data = "000";
            background.tooltip = " Wireless is unpowered or unavailable ";

            dangerLamp.opacity = 0;
        }
    } else {
        pointer.rotation = 30;
        pointerShadow.rotation = 30;
        wirelessPercentText.data = " 00";
        background.tooltip = " Wireless monitoring is off ";
        dangerLamp.opacity = 0;
    }

    if (preferences.actionSwitchPref.value === "tick") {
        pointer.rotation = (wirelessStrength * 3) + 30;
        pointerShadow.rotation = pointer.rotation;
    } else {
        // zero pointer smoothly
        rotateObject(pointer, (wirelessStrength * 3) + 30);
        rotateObject(pointerShadow, (wirelessStrength * 3) + 30);
    }

    if (wirelessStrength < 80) {
        //dangerLamp.src = "Resources/images/red-lamptrue.png";
        print("wirelessStrength < 80");
    } else {
        //dangerLamp.src = "Resources/images/green-lamptrue.png";
        print("wirelessStrength >= 80");
    }

    buildVitality(currIcon, String(wirelessStrength)); // build the dock vitality
}
//=====================
//End function
//=====================


//======================================================================================
// Function to make text areas visible rather than text objects
//======================================================================================
function setTextAreas() {
    if (system.platform === "macintosh") {
        networkScaleTextArea.visible = true;
        wirelessPercentTextArea.visible = true;
    } else {
        networkScaleText.visible = true;
        wirelessPercentText.visible = true;
    }
}
//=====================
//End function
//=====================


//===============================================================
// this function generates a unique 10 character string for the unique filename
//===============================================================
function makeid() {
    var text = "";
    var i;
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (i = 0; i < 10; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//=====================
//End function
//=====================


//=================================
// initialise the main timer loop
//=================================
var networkTimer = new Timer();
networkTimer.ticking = true;
networkTimer.interval = preferences.sampleIntervalPref.value;
//=================================
// timer ends
//=================================


//===============================================================
// general utility functions on graphic objects
//===============================================================
startButton.onMouseUp = function () {
    this.opacity = 255;
    reloadWidget();
};

prefs.onMouseDown = function () {
    prefs.src = "Resources/images/prefs02.png";
};


prefs.onMouseUp = function () {
    prefs.src = "Resources/images/prefs01.png";
    if (preferences.soundPref.value !== "disabled") {
        play(winding, false);
    }
    showWidgetPreferences();
};

helpButton.onMouseDown = function () {
    helpButton.opacity = 255;
};

function tankHelpShow() {
    helpWindow.visible = true;
    if (preferences.soundPref.value !== "disabled") {
        play(till, false);
    }
}

helpButton.onMouseUp = function () {
    helpButton.opacity = 1;
    tankHelpShow();
};

tankHelp.onMouseDown = function () {
    helpWindow.visible = false;
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
};


stopButton.onMouseDown = function () {
    this.opacity = 10;
    networkTimer.ticking = false;
    pointer.visible = false;
    pointerShadow.visible = false;
};

stopButton.onMouseUp = function () {
    this.opacity = 255;
};
//=====================
//End functions
//=====================

//=================================
// resizing on mouse scroll wheel combined with a CTRL key just as browsers
//=================================
background.onMouseWheel = function (event) {
    var size = Number(preferences.clockSize.value),
        maxLength = Number(preferences.clockSize.maxLength),
        minLength = Number(preferences.clockSize.minLength),
        ticks = Number(preferences.clockSize.ticks),
        step = Math.round((maxLength - minLength) / (ticks - 1));

    if (event.ctrlKey) {
        if (event.scrollDelta > 0) {
            if (preferences.MouseWheelPref.value === "up") {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            } else {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            }
        } else if (event.scrollDelta < 0) {
            if (preferences.MouseWheelPref.value === "up") {
                size += step;
                if (size > maxLength) {
                    size = maxLength;
                }
            } else {
                size -= step;
                if (size < minLength) {
                    size = minLength;
                }
            }
        }
        preferences.clockSize.value = String(size);
        sizeClock();
    }
};
//=====================
//End function
//=====================

//=================================
// main timer loop
//=================================
networkTimer.onTimerFired = function () {
    updateNetwork();
};
//=====================
//End function
//=====================




//=====================
//
//=====================
function setValTooltips() {
/*
    sensorNumber.tooltip = "Sensor no. " + sensorCounter + " (" + cpuName[sensorCounter];
    if (cpuName[sensorCounter] === "network") {
        sensorNumber.tooltip += cpuIdent[sensorCounter];
    }
    sensorNumber.tooltip += ") - click to select next";
    letterBack.tooltip = sensorNumber.tooltip;
    wirelessPercentTextArea.tooltip = cpuName[sensorCounter];
    wirelessPercentText.tooltip = cpuName[sensorCounter];

    sensorNumber.tooltip = sensorNumber.tooltip;
*/
    return;
}
//=====================
//End function
//=====================

//======================================================================================
// Function to effect network menu selection action
//======================================================================================
function deviceMenuAction() {
    if (preferences.devicePref.value !== preferences.devicePref.optionValue[this.i]) {
        preferences.devicePref.value = preferences.devicePref.optionValue[this.i];
        widget.onPreferencesChanged();
    }
}
//=====================
//End function
//=====================

//======================================================================================
// Function to find network devices(adaptors)
//======================================================================================
function getDevices(update) {
    var option = [], optionValue = [], defaultIndex = -1, device = NETSTAT.devices(), i;

    print("========== devices ==========");
    for (i = 0; i < device.length; i += 1) {
        option[i] = device[i].type + " (" + device[i].name + ")";
        optionValue[i] = device[i].name;
        if (device[i].type === "Ethernet") {
            defaultIndex = i;
        }
        devTypeOf[device[i].name] = device[i].type;
        print("device[" + i + "]: " + option[i]);
    }
    
    // set the network device menu in the prefs
    preferences.devicePref.option = option;
    preferences.devicePref.optionValue = optionValue;

    if (defaultIndex !== -1) {
        preferences.devicePref.defaultValue = optionValue[defaultIndex];
    } else if (optionValue.length !== 0) {
        preferences.devicePref.defaultValue = optionValue[0];
    } else {
        preferences.devicePref.defaultValue = "";
    }
        
    if (update) {
        devName = preferences.devicePref.value;
        deviceMenu.reset(option, devTypeOf[devName] + " (" + devName + ")");
    } else {
        deviceMenu = new Menu(pointer, option, option[defaultIndex], deviceMenuAction);
        preferences.devicePref.value = preferences.devicePref.defaultValue;
    }
}
//=====================
//End function
//=====================

//======================================================================================
// Function called when preferences are changed
//======================================================================================
function setNetworkPrefs() {    // was (update)
    var value;

    devName = preferences.devicePref.value;
    deviceMenu.setTick(devTypeOf[devName] + " (" + devName + ")");
    
    print("==== device ====");
    print("devName: " + devName);
    print("devType: " + devTypeOf[devName]);

    maxBytes = 125000 * preferences.maxSpeedPref.value;
    minSpeedPref = Number(preferences.minSpeedPref.value);
    
//  traffic = NETSTAT.traffic(devName);             // **** was this meant to be global

    value = 0;

    print("---- 3 speeds ----");
    print("maxBytes: " + maxBytes.toFixed(0));
    print("Maximum Speed: " + preferences.maxSpeedPref.value);
    print("Minimum Speed: " + maxSpeed[preferences.minSpeedPref.value]);

    if (preferences.networkswitch.value === "on") {
        background.tooltip = devTypeOf[devName] + " (" + devName + ")  100% = " + preferences.maxSpeedPref.value + " Mb/s" +
                "\n\nThe Network Device Selection Menu is on the hand.\nSelecting with the alt-key updates the menu.";
        dangerLamp.tooltip = background.tooltip;
    } else {
        background.tooltip = "";
        dangerLamp.tooltip = "";
    }

    pointer.rotation = 0.01 * value * 251 - 120;
}
//=====================
//End function
//=====================

//===============================================================
// this function is the main start point
//===============================================================
function startup() {
    sizeClock();
    setTextAreas();
    mainScreen();
    createLicence(mainWindow);
    
    preferences.maxSpeedPref.option = maxSpeed;

    //if (preferences.WMIenabled.value === "enabled" && (system.platform === "windows" && winVersionNo !== "10" )){
//    if (preferences.WMIenabled.value === "enabled") {			****
        getDevices(false);     // get network adapters
        setNetworkPrefs(false); // initial setup
//    }

    updateNetwork();
    setValTooltips();
    setmenu();
    settooltip();
    checkLockWidget();
    buildVitality(currIcon, String(wirelessStrength)); // build the dock vitality
}
//=====================
//End function
//=====================

//===============================================================
// this function is called when the widget loads
//===============================================================
widget.onload = function () {
    startup();
};
//=====================
//End function
//=====================

//===============================================================
// this function is called when the widget prefs are changed
//===============================================================
widget.onPreferencesChanged = function () {
    changePrefs();
    startup();
};
//=====================
//End function
//=====================

//===============================================================
// this function is called when the widget wakes up
//===============================================================
widget.onWakeFromSleep = function () {
    updateNetwork();
};
//=====================
//End function
//=====================

//===============================================================
// this function defines the keyboard events captured
//===============================================================
mainWindow.onKeyDown = function (event) {
    if (event.keyCode === 116) {        //F5
        print("pressing " + event.keyCode);
        reloadWidget();
    }
};
//=====================
//End function
//=====================
