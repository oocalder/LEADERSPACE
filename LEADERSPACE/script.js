

// PEOGRESS BAR JS --------------------------------------------------------------------------
const progressItems = document.querySelectorAll('.progress-bar li');

progressItems.forEach((item, index) => {
  item.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent the default link behavior
    if (index === 0 || item.previousElementSibling.classList.contains('active')) {
      item.classList.toggle('active');
    }
  });
});
// END OF PROGRESS BAR JS -----------------------------------------------------------------------






// CALENDAR JS ----------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
  var calendarEl = document.getElementById('calendar');
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: [/* your initial events */]
  });
  calendar.render();

  // Function to update the "Your Upcoming Events" section
  function updateUpcomingEvents() {
    const upcomingEvents = document.querySelector('.section.upcoming-events-list');
    const now = new Date();
    const events = calendar.getEvents();

    // Filter events that are in the future
    const futureEvents = events.filter(event => new Date(event.start) > now);

    // Sort the events by start date
    futureEvents.sort((a, b) => new Date(a.start) - new Date(b.start));

    // Create HTML for each event with a data attribute containing the event ID
    const eventList = futureEvents.map(event => {
      const eventStart = new Date(event.start);
      const daysUntilEvent = Math.ceil((eventStart - now) / (1000 * 60 * 60 * 24));
      return `<p class="event-link" data-event-id="${event.id}">${event.title} with ${event.extendedProps.withWhom} in ${daysUntilEvent} days</p>`;
    }).join('');

    // Set the content of the "Your Upcoming Events" section
    upcomingEvents.innerHTML = `
        <h2>Your Upcoming Events</h2>
        ${eventList}
    `;

    // Add click event listeners to event links in the upcoming events section
    const eventLinks = document.querySelectorAll('.event-link');
    eventLinks.forEach(eventLink => {
      eventLink.addEventListener('click', function() {
        const eventId = this.getAttribute('data-event-id');
        const event = calendar.getEventById(eventId);
        if (event) {
          // Display event details from the calendar
          eventClick(event);
        }
      });
    });
  }

  // Add click event listeners to event links
  const eventLinks = document.querySelectorAll('.event-link');
  eventLinks.forEach(eventLink => {
    eventLink.addEventListener('click', function(e) {
      e.preventDefault();
      const eventId = this.getAttribute('data-event-id');
      const event = calendar.getEventById(eventId);
      if (event) {
        // Show event details (you can customize this part)
        alert(`Event Details:\nTitle: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
      }
    });
  });

  document.getElementById('add-event-button').addEventListener('click', function() {
    document.getElementById('event-modal').style.display = 'block';
  });

  document.getElementById('close-modal').addEventListener('click', function() {
    clearEventForm();
    document.getElementById('event-modal').style.display = 'none';
  });

  document.getElementById('save-event-button').addEventListener('click', function() {
    const title = document.getElementById('event-title').value;
    const withWhom = document.getElementById('event-with-whom').value;
    const start = document.getElementById('event-start').value;
    const end = document.getElementById('event-end').value;
    const location = document.getElementById('event-location').value;

    // Validate that required fields are not empty
    if (title && start && end) {
      const event = {
        title,
        start,
        end,
        withWhom,
        location,
      };

      // Add the event to FullCalendar
      calendar.addEvent(event);

      // Add the event to the "Your Upcoming Events" section
      addToUpcomingEvents(event);

      // Clear the form and close the modal
      clearEventForm();
      document.getElementById('event-modal').style.display = 'none';
    } else {
      alert('Please fill in the required fields: Title, Start, and End.');
    }
  });

  function eventClick(event) {
    // Customize this part to display event details as desired
    alert(`Event Details:\nTitle: ${event.title}\nStart: ${event.start}\nEnd: ${event.end}`);
  }

  function addToUpcomingEvents(event) {
    const upcomingEventsList = document.getElementById('upcoming-events-list');

    // Parse the event start date
    const eventStartDate = new Date(event.start);
    const now = new Date();

    // Calculate the number of days until the event
    const daysUntilEvent = Math.round((eventStartDate - now) / (1000 * 60 * 60 * 24));

    // Create an element to display the event
    const eventElement = document.createElement('p');
    eventElement.textContent = `${event.title} with ${event.withWhom} at ${event.location} in ${daysUntilEvent} days`;

    // Append the event element to the list
    upcomingEventsList.appendChild(eventElement);
  }

  function clearEventForm() {
    document.getElementById('event-title').value = '';
    document.getElementById('event-with-whom').value = '';
    document.getElementById('event-start').value = '';
    document.getElementById('event-end').value = '';
    document.getElementById('event-location').value = '';
  }
  
});

// Function to update Local Storage with the array of events
function updateEventsStorage() {
  const events = Array.from(document.querySelectorAll('#upcoming-events-list div')).map(upcomingEventsList => {
    return {
      text: upcomingEventsList.querySelector('label').textContent,
    };
  });

  localStorage.setItem('goals', JSON.stringify(goals));
}
// END OF CALENDAR JS -----------------------------------------------------------------------------------------





// GOAL SECTION JS ------------------------------------------------
function addGoal(text, completed) {
  const goalContainer = document.createElement('div');
  const dollarAmount = document.createElement('span');
  dollarAmount.id = 'dollarAmoundId'; // Make sure the span has the correct ID

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;
  goalContainer.appendChild(checkbox);

  const goalElement = document.createElement('label');
  goalElement.textContent = text;
  goalContainer.appendChild(goalElement);

  checkbox.addEventListener('change', function() {
    updateGoalStyle(goalElement, checkbox.checked);
    incrementDollarAmount(checkbox.checked);
    updateLocalStorage();
  });

  updateGoalStyle(goalElement, completed);

  return goalContainer;
}

function incrementDollarAmount(checked) {
  const dollarAmountSpan = document.getElementById('dollarAmoundId');
  if (dollarAmountSpan) {
    const currentAmount = parseFloat(dollarAmountSpan.textContent);
    const increment = checked ? 5 : -5; // Increment by 5 when checked, decrement by 5 when unchecked
    const newAmount = currentAmount + increment;
    dollarAmountSpan.textContent = newAmount.toFixed(2); // Display the new amount with 2 decimal places
  }
}


// Function to update the style of a goal element
function updateGoalStyle(goalElement, completed) {
  if (completed) {
    goalElement.style.textDecoration = 'line-through';
    goalElement.style.color = 'green';
  } else {
    goalElement.style.textDecoration = 'none';
    goalElement.style.color = 'black';
  }
}

// Function to update Local Storage with the array of goals
function updateLocalStorage() {
  const goals = Array.from(document.querySelectorAll('#goalsList div')).map(goalContainer => {
    const checkbox = goalContainer.querySelector('input[type="checkbox"]');
    return {
      text: goalContainer.querySelector('label').textContent,
      completed: checkbox.checked,
    };
  });

  localStorage.setItem('goals', JSON.stringify(goals));
}

// Retrieve and display stored goals when the page loads
window.addEventListener('load', function() {
  const goalsList = document.getElementById('goalsList');
  const storedGoals = JSON.parse(localStorage.getItem('goals')) || [];

  storedGoals.forEach(function(goal) {
    const goalContainer = addGoal(goal.text, goal.completed);
    goalsList.appendChild(goalContainer);
  });

  // Remove completed goals from the list when the page loads
  goalsList.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox, index) {
    if (checkbox.checked) {
      goalsList.removeChild(checkbox.parentElement);
    }
  });
});

// Add a new goal when the button is clicked
document.getElementById('addGoalButton').addEventListener('click', function() {
  const goalInput = document.getElementById('goalInputId');
  const goalsList = document.getElementById('goalsList');
  const goalText = goalInput.value.trim();

  if (goalText !== '') {
    const goalContainer = addGoal(goalText, false);
    goalsList.appendChild(goalContainer);
    updateLocalStorage();
    goalInput.value = '';
  }
});
// END OF GOALS JS -----------------------------------------------------------------------------




// RECOGNITION SIDE JS



// Function to update the current date
document.addEventListener('DOMContentLoaded', function() {
  function updateCurrentDate() {
    const currentDateElement = document.getElementById('current-date');
    const currentDate = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = currentDate.getDate();
    const monthIndex = currentDate.getMonth();
    const month = monthNames[monthIndex];
    const formattedDate = `${month} ${day}${getDaySuffix(day)}`;
    currentDateElement.textContent = formattedDate;
  }

  // Function to get the day suffix (st, nd, rd, or th)
  function getDaySuffix(day) {
    if (day >= 11 && day <= 13) {
      return "th";
    }
    const lastDigit = day % 10;
    if (lastDigit === 1) {
      return "st";
    } else if (lastDigit === 2) {
      return "nd";
    } else if (lastDigit === 3) {
      return "rd";
    } else {
      return "th";
    }
  }

  // Call the function to update the current date when the page loads
  updateCurrentDate();
});

document.getElementById('comment-button').addEventListener('click', addComment);



function addComment() {
  var commentText = document.getElementById('comment').value;
  var commentsArea = document.getElementById('comments-area');
  if (commentText) {  // only proceed if there's text entered
    var commentDiv = document.createElement('div');
    commentDiv.className = 'comment';

    // Create and append the name element
    var nameElement = document.createElement('div');
    nameElement.className = 'commenter-name';
    nameElement.textContent = 'Patrick Star: '  // replace with the actual name or a variable
    commentDiv.appendChild(nameElement);

    // Create and append the comment text element
    var commentTextElement = document.createElement('div');
    commentTextElement.className = 'comment-text';
    commentTextElement.textContent = commentText;
    commentDiv.appendChild(commentTextElement);

    // Get the current date and time
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;  // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var month = now.toLocaleString('default', { month: 'short' });
    var date = now.getDate();
    var strTime = hours + ':' + minutes + ampm + ' | ' + month + ' ' + date + 'th';

    // Create and append the timestamp element
    var timestampElement = document.createElement('div');
    timestampElement.className = 'timestamp';
    timestampElement.textContent = strTime;
    commentDiv.appendChild(timestampElement);

    commentsArea.appendChild(commentDiv);
    document.getElementById('comment').value = '';  // clear the text area
  }
}

//CODE FOR COMMENTS SECTION TO BE HIDDEN/WORK

document.addEventListener('DOMContentLoaded', function() {
  // Ensure the elements exist before trying to add event listeners
  var commentButton = document.getElementById('comment-button');
  var chatBox = document.getElementById('chat-box');

  if (commentButton && chatBox) {
    
    // Toggle the display of the chat box when the comment button is clicked
    commentButton.addEventListener('click', function() {
      chatBox.style.display = chatBox.style.display === 'none' ? 'block' : 'none';
    });
  } else {
    // If the elements don't exist, log an error to the console
    console.error('Make sure your HTML elements have the correct IDs');
  }
});
