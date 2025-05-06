// Elements
const Activities = document.querySelector("#Activities");
const openBtn = document.querySelector(".left-side");
const modal = document.getElementById("modal");
const closeBtn = modal.querySelector(".close-button");
const okBtn = modal.querySelector(".ok-button");
const nameInput = modal.querySelector("#activityName");

// — Load saved activities on page load —
document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("habitTrackerActivities")) || [];
  saved.forEach(createActivityElement);
});

// — Modal open/close —
openBtn.addEventListener("click", () => modal.showModal());
closeBtn.addEventListener("click", () => modal.close());


okBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Please enter a name for the activity.");
    return;
  }
  const activityData = {
    name,
    completions: [],
    createdAt: new Date().toISOString(),
  };
  createActivityElement(activityData);
  saveActivities();
  nameInput.value = "";
  modal.close();
});


function createActivityElement({ name, completions, createdAt }) {
  // wrapper container
  const wrapper = document.createElement("div");
  wrapper.className = "activityWrapper";
  wrapper.dataset.activityId = createdAt;

  const h2 = document.createElement("h2");
  h2.className = "activityName";
  h2.textContent = name;
  wrapper.appendChild(h2); // the activity name 

  const container = document.createElement("div");
  container.className = "Activity"; // activity

  const grid = document.createElement("div");
  grid.className = "grid";// grid

  const start = new Date(createdAt);
  for (let day = 0; day < 7; day++) {
    const row = document.createElement("div");
    row.className = "day-row";

    for (let week = 0; week < 52; week++) {
      const cell = document.createElement("div");
      cell.className = "cell";

      // calculate date for this cell
      const d = new Date(start);
      d.setDate(d.getDate() + day + week * 7);
      const dayStr = d.toISOString().split("T")[0];

      cell.dataset.date = dayStr;
      cell.title = d.toLocaleDateString();

      // mark completed if in saved data
      if (completions.includes(dayStr)) {
        cell.classList.add("completed");
      }

      cell.addEventListener("click", () => {
        cell.classList.toggle("completed"); // check/toggle on click
        saveActivities();
      });

      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
  container.appendChild(grid);

  // control buttons (done/delete bnts)
  const controls = document.createElement("div");
  controls.className = "controlBtns";

  const doneBtn = document.createElement("div");
  doneBtn.className = "doneBtn";
  doneBtn.setAttribute("role","button");
  doneBtn.setAttribute("aria-label","Toggle today’s completion");
  doneBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q63 0 120 19t105 54l-52 52q-37-26-81-39.5T480-792q-130 0-221 91t-91 221q0 130 91 221t221 91q130 0 221-91t91-221q0-21-3-41.5t-8-40.5l57-57q13 32 19.5 67t6.5 72q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm-55-211L264-468l52-52 110 110 387-387 51 51-439 439Z"/></svg>`;
  doneBtn.addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    const todayCell = wrapper.querySelector(`.cell[data-date="${today}"]`);
    if (todayCell) {
      todayCell.classList.toggle("completed");
      saveActivities();
    }
  });

  const delBtn = document.createElement("div");
  delBtn.className = "delBtn";
  delBtn.setAttribute("role","button");
  delBtn.setAttribute("aria-label","Delete activity");
  delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>`;
  delBtn.addEventListener("click", () => {
    wrapper.remove();
    saveActivities();
  });

  controls.append(doneBtn);
  controls.append(delBtn);
  container.appendChild(controls);
  wrapper.appendChild(container);
  Activities.appendChild(wrapper);
}

// save data to local storage 
function saveActivities() {
  const wrappers = document.querySelectorAll(".activityWrapper");
  const out = Array.from(wrappers).map(w => {
    return {
      name: w.querySelector(".activityName").textContent,
      createdAt: w.dataset.activityId,
      completions: Array.from(w.querySelectorAll(".cell.completed")).map(c => c.dataset.date)
    };
  });
  localStorage.setItem("habitTrackerActivities", JSON.stringify(out));
}
