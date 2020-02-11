const day = document.getElementById("date");
date = new Date();

day.innerHTML = getDayText(
  date.getDay(),
  date.getMonth(),
  date.getDate(),
  date.getFullYear()
);

function getDayText(day, month, date, year) {
  const dayArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wesnerday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  const monthArray = [
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
    "December"
  ];
  return dayArray[day] + ", " + monthArray[month] + " " + date + ", " + year;
}
$(document).ready(function() {
  $(".delete-todo").on("click", function(e) {
    $target = $(e.target);
    const id = $target.attr("data-key");
    console.log(id);
    $.ajax({
      type: "DELETE",
      url: "/deleteWork/" + id,
      success: function(response) {
        alert("Delete Success");
        window.location.href = "/";
      },
      error: function(err) {
        console.log(err);
      }
    });
  });
  $(".todo-check").on("click", function(e) {
    $target = $(e.target);
    const id = $target.attr("data-key");
    const item = document.querySelector(`[data-key='${id}']`);
    if (item.classList.contains("done")) {
      item.classList.remove("done");
      $.ajax({
        type: "POST",
        url: "/updateUnDone/" + id,
        success: function(response) {
          console.log(response);
        }
      });
    } else {
      item.classList.add("done");
      $.ajax({
        type: "POST",
        url: "/updateDone/" + id,
        success: function(response) {
          console.log(response);
        }
      });
    }
  });
});
