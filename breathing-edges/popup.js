'use strict';
var server_address = "http://localhost:8080";
var url = '';
var user_id = null;

function getTime()
{
  var today = new Date();
  var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
  var time = today.getHours() + ":" + today.getMinutes( ) + ":" + today.getSeconds();
  var dateTime = time + ' ' + date;
  return dateTime
}

// Send POST message with action and status to server_address
// Message is in JSON format
function post_server(action, status)
{
  var xhr = new XMLHttpRequest();
  xhr.open("POST", server_address , true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  var message = '{"user_id": "' + String(user_id) + '", "Action" : "' + action + '", "New value" : "' + status + '", "url" : "' + url + '", "time" : "' + getTime() + '"}'
  xhr.send(message);
}

// Update enable checkbox
function check_enable(e)
{
  // Store value
  chrome.storage.sync.set({
      enabled: this.checked
  }, update_status);
  // Update page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
  });
  post_server("Changed activation", this.checked? 'Turn on' : 'Turn off')
}

// Open adaptive mode BT hub website
function check_BTenable(e)
{
  console.log(this.checked);
  chrome.storage.sync.set({
      adaptive: this.checked
  }, update_status);
  // Update page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
  });
  chrome.storage.sync.get(['enabled','adaptive'], function(result) {
    if(result.adaptive){
      // Open hub website in new tab
      chrome.tabs.create({url:"https://pervasivewellbeingtech.github.io/Subliminal-ChromeExtension-BTHubWebsite/"});
    }
  });
}


// Update color picker
function change_color(e)
{
    // Update styles
    document.querySelector(".color-picker-wrapper").style.backgroundColor = this.value;
    document.getElementById("colorBox").value = this.value;
    document.getElementById("colorBox").style.background = this.value;
    color_style.innerHTML = ".color input:checked + .slider {background-color: " + this.value + ";}";
    document.querySelector('#range-value-bar').style.background = this.value;

    // Store value
    chrome.storage.sync.set({
        color: this.value
    }, update_status);

    // Update page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
    });

    // Log action
    post_server("Changed color", this.value)
}

// Update color box
function change_hex(e)
{
    var reg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/;
    if (reg.exec(this.value)) // check for valid text input
    {
        var hex_val = this.value;
        if (hex_val.charAt(0) != '#') // fix string if needed
        {
            hex_val = '#' + hex_val;
        }
        // Update styles accordingly
        document.getElementById("colorBox").style.background = hex_val;
        document.querySelector(".color-picker").value = hex_val;
        document.querySelector(".color-picker-wrapper").style.backgroundColor = hex_val;
        color_style.innerHTML = ".color input:checked + .slider {background-color: " + hex_val + ";}";
        document.querySelector('#range-value-bar').style.background = hex_val;

        // Store value
        chrome.storage.sync.set({
            color: hex_val
        }, update_status);

        // Update page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
        });
        // Log action
        post_server("Changed color", hex_val)
    }
}

// Update opacity
function change_opacity(e)
{
    // Update styles
    document.querySelector('#range-value-bar').style.setProperty('opacity', this.value/100);

    // Store value
    chrome.storage.sync.set({
        opacity: this.value/100
    }, update_status);

    // Update page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
    });
    // Log action
    post_server("Changed opacity", this.value/100)
}

// Update breathing interval
function change_interval(e)
{
    var max_bpm = 30;
    var reg = /^(\d+\.?\d*|\.\d+)$/;
    if (!isNaN(this.value) && reg.exec(this.value)) // check for valid text input
    {
      // Set thresholds
      if (this.value < 1) {
        this.value = 1;
      } else if(this.value > max_bpm) {
        this.value = max_bpm;
      }
      var interval_val = 60 / this.value;
      // Store value
      chrome.storage.sync.set({
          interval: interval_val
      }, update_status);

      // Update page
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
      });
      // Log action
      post_server("Changed interval", this.value)
    }
}

// Restore options when popup is opened
function restore_options()
{
    // Defaults when opened
    chrome.storage.sync.get({
        enabled: false,
        color: "#0080FF",
        opacity: 1.0,
        interval: 4,
        adaptive: false
    }, function(items) {
        // Update values
        document.querySelector(".enable").checked = items.enabled;
        document.querySelector(".color-picker").value = items.color;
        document.getElementById("colorBox").value = items.color;
        document.querySelector("input[type=range]").value = items.opacity*100;
        document.getElementById("breathingInterval").value = 60/items.interval;
        document.getElementById("bt_switch").checked = items.adaptive;

        // Update styles
        document.querySelector(".color-picker-wrapper").style.backgroundColor = items.color;
        document.getElementById("colorBox").style.background = items.color;
        color_style.innerHTML = ".color input:checked + .slider {background-color: " + items.color + ";}";
        document.querySelector('#range-value-bar').style.background = items.color;
        document.querySelector('#range-value-bar').style.setProperty('opacity', items.opacity);
    });
}

// Display status message in popup
function update_status()
{
    // Update status to show options saved
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
        status.textContent = '';
    }, 750);
    chrome.tabs.query({
      active: true,               // Select active tabs
      lastFocusedWindow: true     // In the current window
      }, function(array_of_Tabs) {
      // Since there can only be one active tab in one active window,
      // the array has only one element
      var tab = array_of_Tabs[0];
      url = tab.url;
    });
}

var color_style = document.createElement('style');

// Ask server for new id
function request_id(callback){
  var xhr = new XMLHttpRequest();
  xhr.open("GET", server_address + '/getID', true);
  xhr.send();
  xhr.onreadystatechange = function() {
    console.log("Received GET response")
    if(this.readyState == 4 && this.status == 200){
      console.log("return value:")
      var content = xhr.responseText
      if(content != '') {
          callback(parseInt(content));
      } else {
          callback(null);
      }
    }
  }
}

// Look for BE cookie with user id in browser
// If not found, request server for new id and create cookie
function check_cookie(){
  var cookie = chrome.cookies.get({"url": "https://pervasivewellbeingtech.github.io/Subliminal-ChromeExtension/", "name": "Breathing Edges Extension Cookie"}, function(cookie) {
    if (cookie == null) {
      // Set cookie with new id
      request_id(function(id){
        if(id != null){
          chrome.cookies.set({
              "url": "https://pervasivewellbeingtech.github.io/Subliminal-ChromeExtension/",
              "name": "Breathing Edges Extension Cookie",
              "value": id.toString(),
              "secure": true,
              "expirationDate": 2553964244, // linux epoch time deadline
              "sameSite": "no_restriction"
          }, function (cookie) {
            console.log("New cookie set with value: " + id.toString());
          });
        user_id = id
        }
      })

    } else {
      console.log("Cookie found with value: " + cookie.value.toString())
      user_id = cookie.value
    }
  });
}

// Execute when popup loaded
document.addEventListener('DOMContentLoaded', function () {
    // Restore previous options
    update_status();
    restore_options();
    if(user_id == null){
      check_cookie();
    }
    // Add listeners
    var enable_check = document.querySelector(".enable");
    enable_check.addEventListener('click', check_enable);
    var color_picker = document.querySelector('.color-picker');
    color_picker.addEventListener('change', change_color);
    var colorbox = document.getElementById("colorBox");
    colorbox.addEventListener('input', change_hex);
    var range_slider = document.querySelector('.range-slider');
    range_slider.addEventListener('change', change_opacity);
    var interval_input = document.getElementById("breathingInterval");
    interval_input.addEventListener('input', change_interval);

    //var enable_BTslider = document.querySelector(".BTenable");
    //enable_BTslider.addEventListener('click', check_BTenable)

    var bluetooth_on = document.getElementById('bt_input');
    bluetooth_on.addEventListener('click', check_BTenable);

    document.body.appendChild(color_style);

    // Initial update of page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {todo: "update"});
    });
});
