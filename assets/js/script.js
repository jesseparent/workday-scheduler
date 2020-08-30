// Get the date and time right now
let today = moment();

// Time Slots for Each row in calendar - use pseudo associative array
let schedule = JSON.parse(localStorage.getItem('schedule')) // Check local storage for values
  // If there is nothing in local storage, create an empty schedule
  || [
    { timeslot : "9AM", task : "" },
    { timeslot : "10AM", task : "" },
    { timeslot : "11AM", task : "" },
    { timeslot : "12PM", task : "" },
    { timeslot : "1PM", task : "" },
    { timeslot : "2PM", task : "" },
    { timeslot : "3PM", task : "" },
    { timeslot : "4PM", task : "" },
    { timeslot : "5PM", task : "" }
  ];

// Timers to check if colors on schedule need to be updated due to hour change
let initialCheckTimeout;
let updateInterval;

// Render the schedule with stored tasks
let renderSchedule = function () {
  // Format Date to Day-Of-Week, Month-Name Day-Suffixed (e.g. "Thursday, January 7th") and display it at top of HTML page
  $('#currentDay').text(today.format("dddd, MMMM Do"));

  // Write out the schedule
  let scheduleContainer = $('.container');

  for (let i = 0; i < schedule.length; i++) {
    let currentTimeslot = schedule[i].timeslot;
    let currentTask = schedule[i].task;
    let rowText = ''; // Set up row text

    // Create row for this time slot
    rowText += '<div class="row time-block">\n';
    rowText += '  <div class="col-1 hour m-0 p-0">' + currentTimeslot + '</div>\n';
    rowText += '  <div class="col-10 description m-0 p-0"><textarea id="' + currentTimeslot + '" class="w-100 h-100">' + currentTask + '</textarea></div>\n';
    rowText += '  <div class="col-1 m-0 p-0"><button class="saveBtn w-100 h-100"><i class="fas fa-save"></i></button></div>\n';
    rowText += '</div>\n';

    scheduleContainer.append(rowText);
  }

  // Change the colors of each time slot based on the current time
  changeColors();
};

// Change the colors of the timeslots in the Workday schedule
let changeColors = function () {
  // Load time right now to see if we need to change colors on backgrounds
  today = moment();
  
  for (let i = 0; i < schedule.length; i++) {
    let timeToCheck = schedule[i].timeslot; // Get the time of the time slot to evaluate
    let textEntry = $("#" + timeToCheck); // Find the class of the textarea to change

    let currentHour = moment(today.format("hA"), "hA"); // The current hour on the user's clock and store as string
    let rowHour = moment(timeToCheck, "hA"); // The hour of the time slot to evaluate and store as string

    // Clear current classes that style the background color based on time
    textEntry.removeClass("past present future");

    // Determine if the hour associated to the time slot being evaluated is before, after, or the same hour as the current hour
    if (rowHour.isBefore(currentHour)) {
      textEntry.addClass("past"); // This time slot is in the past
    }
    else if (rowHour.isAfter(currentHour)) {
      textEntry.addClass("future"); // This time slot in the future
    }
    else {
      textEntry.addClass("present"); // This is the current time slot 
    }
  }
};

// After first timer gets me close to the start of the hour, check on an hourly basis if the colors on the scheduler need to change
let setupHourlyCheck = function () {
  // Change the background colors of hourly time slots based on the current hour
  changeColors();

  // Get the milliseconds in an hour: 60 minutes * 60 seconds * 1000 milliseconds
  let anHour = 60 * 60 * 1000; 

  // Change the background colors of hourly time slots every hour from now on
  clearInterval(updateInterval);
  updateInterval = setInterval(changeColors, anHour);
};

// Render the schedule
renderSchedule();

// Save the entry on the current time to in memory and local storage
$(".saveBtn").click(function () {
  let key = $(this).closest(".time-block").children(".hour").text();
  let value = $("#" + key).val();
  
console.log(key + " : " + value);
console.log($(this).closest(".time-block"));
console.log($(this).closest(".time-block").children(".hour"));
console.log($(this).closest(".time-block").children(".description"));

  // Find and change the current time entry in the array
  for (let i = 0; i < schedule.length; i++) {
    let currentKey = schedule[i].timeslot;
    if (currentKey === key) {
      schedule[i].task = value;
      break;
    }
  }

  // Save to localStorage
  localStorage.setItem('schedule', JSON.stringify(schedule));
});

// Set a timer based on how close the next hour is and then set an hourly interval timer
let timeToNextHour = (60 - moment().format("m") + 1) * 60 * 1000; // Milliseconds to the next hour, plus 1 minute extra to account for overage due to seconds

// Clear timer and then set it
clearTimeout(initialCheckTimeout);
initialCheckTimeout = setTimeout(setupHourlyCheck, timeToNextHour);