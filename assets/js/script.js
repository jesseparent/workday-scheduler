// Get the date and time right now
let today = moment("12PM", "hA"); // for testing
//let today = moment();

// Time Slots for Each row in calendar
let schedule = JSON.parse(localStorage.getItem('schedule')) 
  || [
  { "9AM": "" },
  { "10AM": "" },
  { "11AM": "" },
  { "12PM": "" },
  { "1PM": "" },
  { "2PM": "" },
  { "3PM": "" },
  { "4PM": "" },
  { "5PM": "" }
];

// Timer to check if colors on schedule need to be updated due to hour change
let updateInterval;

// Format Date to Day-Of-Week, Month-Name Day-Suffixed (e.g. "Thursday, January 7th") and display it at top of page
$('#currentDay').text(today.format("dddd, MMMM Do"));

// Render the schedule with stored tasks
let renderSchedule = function() {
  for (let i = 0; i < schedule.length; i++) {
    let currentKey = Object.keys(schedule[i])[0]; // Get the time of the time slot to evaluate
    let textEntry = $("#" + currentKey); // Find the class of the textarea to change
    textEntry.val(schedule[i][currentKey]); // Change the text entry to match the event for that time
  }

  // Change the colors of each time slot based on the current time
  changeColors();
};

// Change the colors of the timeslots in the Workday schedule
let changeColors = function () {
  console.log("change colors");
  for (let i = 0; i < schedule.length; i++) {
    let timeToCheck = Object.keys(schedule[i])[0]; // Get the time of the time slot to evaluate
    let textEntry = $("#" + timeToCheck); // Find the class of the textarea to change

    let currentHour = moment(today, "hA"); // The current hour on the user's clock
    let rowHour = moment(timeToCheck, "hA"); // The hour of the time slot to evaluate

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

// After first time gets me close to teh start of the hour, check on an hourly basis if the colors on teh scheduler need to change
let setupHourlyCheck = function() {
  changeColors();  // Change the background colors of hourly time slots based on teh current hour

  let anHour = 60 * 60 * 1000; // 60 minutes * 60 seconds * 1000 milliseconds
  
  updateInterval = setInterval(changeColors, anHour);
}

// Save the entry on teh current time to in memory and local storage
$(".saveBtn").click(function()
{
  let key = $(this).attr("data-txt-id");
  let value = $(this).closest(".time-block").children(".description").children().val();

  // Find and change the current time entry in the array
  for (let i = 0; i < schedule.length; i++) {
    let currentKey = Object.keys(schedule[i])[0];
    if (currentKey === key)
    {
      schedule[i][currentKey] = value;
      break;
    }
  }

  // Save to localStorage
  localStorage.setItem('schedule', JSON.stringify(schedule));
});

// Render the schedule
renderSchedule();

// Set a timer based on how close the next hour is and then set an hourly interval timer
let timeToNextHour = (60 - moment().format("m") + 1) * 60 * 1000; // Milliseconds to the next hour, plus 1 minute extra to account for overage due to seconds

let initialCheckTimeout = setTimeout(setupHourlyCheck, timeToNextHour);


