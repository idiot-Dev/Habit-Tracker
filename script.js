const Activities = document.querySelector("#Activities");

// Load saved activities when page loads
document.addEventListener("DOMContentLoaded", () => {
    const savedActivities =
        JSON.parse(localStorage.getItem("habitTrackerActivities")) || [];
    savedActivities.forEach((activity) => {
        createActivityElement(activity);
    });
});

function makeStreakGrid() {
    // let nameOfActivity = prompt("Enter activity name:");
    // if (!nameOfActivity) return; // If user cancels prompt

    const activityData = {
        name: nameOfActivity,
        completions: [],
        createdAt: new Date().toISOString(),
    };

    createActivityElement(activityData);
    saveActivitiesToLocalStorage();
}

function createActivityElement(activityData) {
    const activityName = document.createElement("h2");
    activityName.classList.add("activityName");
    activityName.textContent = activityData.name;
    Activities.appendChild(activityName);

    const Activity = document.createElement("div");
    Activity.classList.add("Activity");
    Activities.appendChild(Activity);

    // Create date display element
    const dateDisplay = document.createElement("div");
    dateDisplay.classList.add("date-display");
    Activity.appendChild(dateDisplay);

    const daysContainer = document.createElement("div");
    daysContainer.classList.add("daysContainer");
    Activity.appendChild(daysContainer);

    const grid = document.createElement("div");
    grid.classList.add("grid");
    Activity.appendChild(grid);

    // Create grid cells for one year starting from creation date
    const creationDate = new Date(activityData.createdAt);
    const endDate = new Date(creationDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Create day rows (Sunday to Saturday)
    for (let day = 0; day < 7; day++) {
        const dayRow = document.createElement("div");
        dayRow.classList.add("day-row");

        // Create cells for each week
        for (let week = 1; week <= 52; week++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");

            // Calculate the exact date for this cell
            const cellDate = new Date(creationDate);
            const daysToAdd = (week - 1) * 7 + day;
            cellDate.setDate(cellDate.getDate() + daysToAdd);

            cell.dataset.date = cellDate.toISOString().split("T")[0];
            cell.title = cellDate.toLocaleDateString();

            // Mark if completed
            if (activityData.completions.includes(cell.dataset.date)) {
                cell.style.backgroundColor = "green";
            }

            dayRow.appendChild(cell);
        }

        grid.appendChild(dayRow);
    }

    const controlBtns = document.createElement("div");
    controlBtns.classList.add("controlBtns");
    Activity.appendChild(controlBtns);

    const doneBtn = document.createElement("div");
    doneBtn.classList.add("doneBtn");
    doneBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M480-96q-79 0-149-30t-122.5-82.5Q156-261 126-331T96-480q0-80 30-149.5t82.5-122Q261-804 331-834t149-30q63 0 120 19t105 54l-52 52q-37-26-81-39.5T480-792q-130 0-221 91t-91 221q0 130 91 221t221 91q130 0 221-91t91-221q0-21-3-41.5t-8-40.5l57-57q13 32 19.5 67t6.5 72q0 79-30 149t-82.5 122.5Q699-156 629.5-126T480-96Zm-55-211L264-468l52-52 110 110 387-387 51 51-439 439Z"/></svg>`;
    controlBtns.appendChild(doneBtn);

    const delBtn = document.createElement("div");
    delBtn.classList.add("delBtn");
    delBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="m376-300 104-104 104 104 56-56-104-104 104-104-56-56-104 104-104-104-56 56 104 104-104 104 56 56Zm-96 180q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520Zm-400 0v520-520Z"/></svg>`;
    controlBtns.appendChild(delBtn);

    doneBtn.addEventListener("click", () => {
        const today = new Date();
        const todayString = today.toISOString().split("T")[0];

        // Find all cells with today's date
        const cells = document.querySelectorAll(
            `.cell[data-date="${todayString}"]`
        );

        cells.forEach((cell) => {
            const isCompleted = cell.style.backgroundColor === "green";
            cell.style.backgroundColor = isCompleted ? "#ebedf0" : "green";

            // Update completions array
            if (isCompleted) {
                const index = activityData.completions.indexOf(todayString);
                if (index !== -1) {
                    activityData.completions.splice(index, 1);
                }
            } else {
                activityData.completions.push(todayString);
            }
        });

        saveActivitiesToLocalStorage();
    });

    delBtn.addEventListener("click", () => {
        Activities.removeChild(Activity);
        Activities.removeChild(activityName);
        removeActivityFromStorage(activityData.createdAt);
    });
}

// Save all activities to localStorage
function saveActivitiesToLocalStorage() {
    const activities = [];
    document.querySelectorAll(".Activity").forEach((activityEl, index) => {
        const activityName =
            document.querySelectorAll(".activityName")[index].textContent;
        const activityId =
            activityEl.querySelector(".cell").dataset.activityId;
        const completions = [];

        activityEl
            .querySelectorAll('.cell[style*="green"]')
            .forEach((cell) => {
                completions.push(cell.dataset.date);
            });

        activities.push({
            name: activityName,
            completions,
            createdAt: activityId,
        });
    });

    localStorage.setItem("habitTrackerActivities", JSON.stringify(activities));
}

// Remove activity from storage
function removeActivityFromStorage(activityId) {
    const savedActivities =
        JSON.parse(localStorage.getItem("habitTrackerActivities")) || [];
    const updatedActivities = savedActivities.filter(
        (activity) => activity.createdAt !== activityId
    );
    localStorage.setItem(
        "habitTrackerActivities",
        JSON.stringify(updatedActivities)
    );
}
function openPopUp() {
    const modal = document.querySelector("#modal");
    const openBtn = document.querySelector(".left-side");
    const closeBtn = document.querySelector(".close-button");
    const okBtn = document.querySelector(".Ok-button");
    const nameInput = document.querySelector("#ActivityName");

    openBtn.addEventListener("click", () => {
        modal.showModal();
    });

    okBtn.addEventListener("click", () => {
        const activityName = nameInput.value.trim();
        if (!activityName) return;

        const activityData = {
            name: activityName,
            completions: [],
            createdAt: new Date().toISOString(),
        };

        createActivityElement(activityData);
        saveActivitiesToLocalStorage();
        modal.close();
        nameInput.value = ""; // Clear input
    });

    closeBtn.addEventListener("click", () => {
        modal.close();
    });
}
const okBtn = document.querySelector(".Ok-button");
openPopUp();
