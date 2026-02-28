// ===== Save key =====
const KEY = "weeklyPlannerBlocks";

// ===== Elements =====
const dayEl = document.getElementById("day");
const timeEl = document.getElementById("time");
const subjectEl = document.getElementById("subject");
const durationEl = document.getElementById("duration");
const goalEl = document.getElementById("goal");

const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const output = document.getElementById("output");
const msg = document.getElementById("msg");

const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ===== Helpers =====
function showMsg(text){
  msg.textContent = text;
  setTimeout(() => (msg.textContent = ""), 2000);
}

function loadBlocks(){
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : [];
}

function saveBlocks(blocks){
  localStorage.setItem(KEY, JSON.stringify(blocks));
}

// Sort by time (HH:MM)
function sortByTime(a, b){
  return a.time.localeCompare(b.time);
}

// ===== Render schedule =====
function render(){
  const blocks = loadBlocks();
  output.innerHTML = "";

  days.forEach(day => {
    const dayBox = document.createElement("div");
    dayBox.className = "dayBox";
    dayBox.innerHTML = `<h3>${day}</h3>`;

    // filter + sort
    const todayBlocks = blocks
      .filter(b => b.day === day)
      .sort(sortByTime);

    if(todayBlocks.length === 0){
      dayBox.innerHTML += `<p class="hint"><small>No blocks for this day</small></p>`;
    } else {
      todayBlocks.forEach(b => {
        const div = document.createElement("div");
        div.className = "block";

        div.innerHTML = `
          <b>${b.time}</b> - ${b.subject}<br>
          <small>${b.duration} minutes | ${b.goal ? b.goal : "No goal"}</small><br>
          <button class="deleteBtn" type="button">Delete</button>
        `;

        div.querySelector(".deleteBtn").addEventListener("click", () => {
          deleteBlock(b.id);
        });

        dayBox.appendChild(div);
      });
    }

    output.appendChild(dayBox);
  });
}

// ===== Add block =====
addBtn.addEventListener("click", () => {
  const day = dayEl.value;
  const time = timeEl.value;
  const subject = subjectEl.value.trim();
  const duration = durationEl.value;
  const goal = goalEl.value.trim();

  if(time === "" || subject === ""){
    showMsg("Please enter Time and Subject!");
    return;
  }

  const blocks = loadBlocks();

  // Prevent duplicate (same day + time + subject)
  const already = blocks.some(b =>
    b.day === day &&
    b.time === time &&
    b.subject.toLowerCase() === subject.toLowerCase()
  );

  if(already){
    showMsg("This block already exists!");
    return;
  }

  blocks.push({
    id: Date.now(),
    day,
    time,
    subject,
    duration,
    goal
  });

  saveBlocks(blocks);

  showMsg("✅ Block added!");
  timeEl.value = "";
  subjectEl.value = "";
  goalEl.value = "";

  render();
});

// ===== Delete block =====
function deleteBlock(id){
  let blocks = loadBlocks();
  blocks = blocks.filter(b => b.id !== id);
  saveBlocks(blocks);
  showMsg("🗑 Block deleted!");
  render();
}

// ===== Clear all =====
clearBtn.addEventListener("click", () => {
  const ok = confirm("Do you want to clear all blocks?");
  if(!ok) return;

  localStorage.removeItem(KEY);
  showMsg("🧹 All blocks cleared!");
  render();
});

// First load
render();