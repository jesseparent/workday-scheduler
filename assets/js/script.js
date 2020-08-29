// Get the date and time right now
let today = moment();

// Format Date to Day-Of-Week, Month-Name Day-Suffixed (e.g. "Thursday, January 7th") and display it at top of page
$('#currentDay').text(today.format("dddd, MMMM Do"));

