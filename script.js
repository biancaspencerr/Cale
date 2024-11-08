const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper "),
  addEventCloseBtn = document.querySelector(".close "),
  addEventTitle = document.querySelector(".event-name "),
  addEventFrom = document.querySelector(".event-time-from "),
  addEventTo = document.querySelector(".event-time-to "),
  addEventSubmit = document.querySelector(".add-event-btn ");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const eventsArr = [];
getEvents();
console.log(eventsArr);

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();
  const day = firstDay.getDay();
  const nextDays = 7 - lastDay.getDay() - 1;

  date.innerHTML = months[month] + " " + year;

  let days = "";
  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
  }
  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });
    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += `<div class="day today active ${
        event ? "event" : ""
      }">${i}</div>`;
    } else {
      days += `<div class="day ${event ? "event" : ""}">${i}</div>`;
    }
  }
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next-date">${j}</div>`;
  }
  daysContainer.innerHTML = days;
  addListner();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListner() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);
      days.forEach((day) => day.classList.remove("active"));
      if (e.target.classList.contains("prev-date")) {
        prevMonth();
        setTimeout(
          () =>
            document
              .querySelector(
                `.day:not(.prev-date):contains(${e.target.innerHTML})`
              )
              .classList.add("active"),
          100
        );
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
        setTimeout(
          () =>
            document
              .querySelector(
                `.day:not(.next-date):contains(${e.target.innerHTML})`
              )
              .classList.add("active"),
          100
        );
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) dateInput.value += "/";
  if (dateInput.value.length > 7) dateInput.value = dateInput.value.slice(0, 7);
  if (e.inputType === "deleteContentBackward" && dateInput.value.length === 3) {
    dateInput.value = dateInput.value.slice(0, 2);
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (
    dateArr.length === 2 &&
    dateArr[0] > 0 &&
    dateArr[0] < 13 &&
    dateArr[1].length === 4
  ) {
    month = dateArr[0] - 1;
    year = dateArr[1];
    initCalendar();
  } else {
    alert("Invalid Date");
  }
}

function getActiveDay(date) {
  const day = new Date(year, month, date);
  const dayName = day.toString().split(" ")[0];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = `${date} ${months[month]} ${year}`;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event"><div class="title"><i class="fas fa-circle"></i><h3 class="event-title">${event.title}</h3></div><div class="event-time"><span class="event-time">${event.time}</span></div></div>`;
      });
    }
  });
  eventsContainer.innerHTML =
    events || `<div class="no-event"><h3>No Events</h3></div>`;
  saveEvents();
}

addEventBtn.addEventListener("click", () =>
  addEventWrapper.classList.toggle("active")
);
addEventCloseBtn.addEventListener("click", () =>
  addEventWrapper.classList.remove("active")
);

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target))
    addEventWrapper.classList.remove("active");
});

addEventTitle.addEventListener("input", () => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function handleTimeInput(event) {
  let inputField = event.target;

  // Allow only numbers, colon, and AM/PM
  inputField.value = inputField.value.replace(/[^0-9:ampAMP]/g, "");

  // Add colon after two digits for hour input
  if (inputField.value.length === 2 && !inputField.value.includes(":")) {
    inputField.value += ":";
  }

  // Automatically convert to uppercase for AM/PM
  inputField.value = inputField.value.toUpperCase();

  // Remove colon if backspacing to delete
  if (
    event.inputType === "deleteContentBackward" &&
    inputField.value.length === 2
  ) {
    inputField.value = inputField.value.slice(0, 1);
  }

  // Limit input length to "12:00 AM" format
  if (inputField.value.length > 8) {
    inputField.value = inputField.value.slice(0, 8);
  }

  // Validate time format and limit to "12:59 AM/PM"
  const [time, period] = inputField.value.split(" ");
  const [hours, minutes] = time.split(":");
  if (
    hours > 12 ||
    minutes > 59 ||
    (period && !["AM", "PM"].includes(period))
  ) {
    alert("Please enter a valid time in 12-hour format with AM or PM.");
    inputField.value = "";
  }
}

// Apply the event listener to both time input fields
addEventFrom.addEventListener("input", handleTimeInput);
addEventTo.addEventListener("input", handleTimeInput);

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value;
  const eventTimeFrom = addEventFrom.value;
  const eventTimeTo = addEventTo.value;
  if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
    alert("Please fill all the fields");
    return;
  }
  const timeFrom = convertTime(eventTimeFrom);
  const timeTo = convertTime(eventTimeTo);
  if (
    eventsArr.some(
      (event) =>
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year &&
        event.events.some((e) => e.title === eventTitle)
    )
  ) {
    alert("Event already added");
    return;
  }
  const newEvent = { title: eventTitle, time: `${timeFrom} - ${timeTo}` };
  const existingEvent = eventsArr.find(
    (e) => e.day === activeDay && e.month === month + 1 && e.year === year
  );
  if (existingEvent) existingEvent.events.push(newEvent);
  else
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year,
      events: [newEvent],
    });
  addEventWrapper.classList.remove("active");
  addEventTitle.value = addEventFrom.value = addEventTo.value = "";
  updateEvents(activeDay);
  document.querySelector(".day.active").classList.add("event");
});

eventsContainer.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("event") &&
    confirm("Are you sure you want to delete this event?")
  ) {
    const eventTitle = e.target.children[0].children[1].innerHTML;
    eventsArr.forEach((event) => {
      if (
        event.day === activeDay &&
        event.month === month + 1 &&
        event.year === year
      ) {
        event.events = event.events.filter((item) => item.title !== eventTitle);
        if (!event.events.length) {
          eventsArr.splice(eventsArr.indexOf(event), 1);
          document.querySelector(".day.active").classList.remove("event");
        }
      }
    });
    updateEvents(activeDay);
  }
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  const savedEvents = localStorage.getItem("events");
  if (savedEvents) eventsArr.push(...JSON.parse(savedEvents));
}

function convertTime(time) {
  const [timePart, period = "AM"] = time.split(" ");
  let [hours, minutes] = timePart.split(":");

  hours = parseInt(hours);
  const timeFormat =
    period.toUpperCase() === "PM" && hours !== 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${hours}:${minutes} ${timeFormat}`;
}
