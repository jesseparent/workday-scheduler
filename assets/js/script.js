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

// Format Date to Day-Of-Week, Month-Name Day-Suffixed (e.g. "Thursday, January 7th") and display it at top of page
$('#currentDay').text(today.format("dddd, MMMM Do"));

// Render the schedule with stored tasks
let renderSchedule = function() {
  for (let i = 0; i < schedule.length; i++) {
    let currentKey = Object.keys(schedule[i])[0]; // Get the time of the time slot to evaluate
    let textEntry = $("#" + currentKey); // Find the class of the textarea to change
    textEntry.val(schedule[i][currentKey]);
  }

  changeColors();
};

// Change the colors of the timeslots in the Workday schedule
let changeColors = function () {
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

$(".saveBtn").click(function()
{
  let key = $(this).attr("data-txt-id");
  let value = $(this).closest(".time-block").children(".description").children().val();

  for (let i = 0; i < schedule.length; i++) {
    let currentKey = Object.keys(schedule[i])[0];
    if (currentKey === key)
    {
      schedule[i][currentKey] = value;
      break;
    }
  }

  localStorage.setItem('schedule', JSON.stringify(schedule));
});

renderSchedule();



