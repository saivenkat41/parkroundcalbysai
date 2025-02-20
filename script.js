let count = localStorage.getItem("rounds") ? parseInt(localStorage.getItem("rounds")) : 0;
document.getElementById("roundCount").textContent = count;
const startBtn = document.getElementById("startBtn");
const roundBtn = document.getElementById("roundBtn");
const resetBtn = document.getElementById("resetBtn");
const toggleDarkMode = document.getElementById("toggleDarkMode");
const timeElapsed = document.getElementById("timeElapsed");
const notificationSound = document.getElementById("notificationSound");
const pauseBtn = document.getElementById("pauseBtn");
const progressBar = document.getElementById("progressBar");
const roundGoalInput = document.getElementById("roundGoal");
const setGoalBtn = document.getElementById("setGoalBtn");
const saveSessionBtn = document.getElementById("saveSessionBtn");
const loadSessionBtn = document.getElementById("loadSessionBtn");
const soundUpload = document.getElementById("soundUpload");
let startTime;
let timerInterval;
let isPaused = false;
let pausedTime = 0;
let totalTime = 0;
function updateTime() 
{
    const now = new Date();
    const elapsed = new Date(now - startTime);
    const hours = String(elapsed.getUTCHours()).padStart(2, '0');
    const minutes = String(elapsed.getUTCMinutes()).padStart(2, '0');
    const seconds = String(elapsed.getUTCSeconds()).padStart(2, '0');
    timeElapsed.textContent = `${hours}:${minutes}:${seconds}`;
}
function updateProgressBar() 
{
    const maxRounds = parseInt(localStorage.getItem("roundGoal")) || 10; 
    const progress = (count / maxRounds) * 100;
    progressBar.style.width = `${progress}%`;
}
function checkGoal() 
{
    const goal = parseInt(localStorage.getItem("roundGoal"));
    if (goal && count >= goal) {
        alert("Congratulations! You've reached your round goal!");
        notificationSound.play(); 
    }
}
startBtn.addEventListener("click", () => 
{
    startTime = new Date();
    timerInterval = setInterval(updateTime, 1000);
    roundBtn.disabled = false;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
});
roundBtn.addEventListener("click", () => 
{
    count++;
    localStorage.setItem("rounds", count);
    document.getElementById("roundCount").textContent = count;
    updateProgressBar();
    checkGoal(); 
    const now = new Date();
    const elapsed = now - startTime;
    totalTime += elapsed;
    const averageTime = totalTime / count;
    const avgHours = String(Math.floor(averageTime / 3600000)).padStart(2, '0');
    const avgMinutes = String(Math.floor((averageTime % 3600000) / 60000)).padStart(2, '0');
    const avgSeconds = String(Math.floor((averageTime % 60000) / 1000)).padStart(2, '0');
    document.getElementById("averageTime").textContent = `${avgHours}:${avgMinutes}:${avgSeconds}`;
});
resetBtn.addEventListener("click", () => 
{
    clearInterval(timerInterval);
    startBtn.disabled = false;
    roundBtn.disabled = true;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";
    isPaused = false;
    count = 0;
    totalTime = 0;
    localStorage.setItem("rounds", count);
    document.getElementById("roundCount").textContent = count;
    timeElapsed.textContent = "00:00:00";
    document.getElementById("averageTime").textContent = "00:00:00";
    progressBar.style.width = "0%";
});
pauseBtn.addEventListener("click", () => 
{
    if (isPaused) 
    {
        startTime = new Date(new Date() - pausedTime);
        timerInterval = setInterval(updateTime, 1000);
        pauseBtn.textContent = "Pause";
    } 
    else 
    {
        clearInterval(timerInterval);
        pausedTime = new Date() - startTime;
        pauseBtn.textContent = "Resume";
    }
    isPaused = !isPaused;
});
toggleDarkMode.addEventListener("click", () => 
{
    document.body.classList.toggle("dark-mode");
    document.querySelector(".container").classList.toggle("dark-mode");
});
setGoalBtn.addEventListener("click", () => 
{
    const goal = parseInt(roundGoalInput.value);
    if (goal > 0) 
    {
        localStorage.setItem("roundGoal", goal);
        alert(`Round goal set to ${goal}`);
    } 
    else 
    {
        alert("Please enter a valid round goal.");
    }
});
saveSessionBtn.addEventListener("click", () => 
{
    const session = 
    {
        count: count,
        startTime: startTime,
        totalTime: totalTime
    };
    localStorage.setItem("session", JSON.stringify(session));
    alert("Session saved!");
});
loadSessionBtn.addEventListener("click", () => 
{
    const session = JSON.parse(localStorage.getItem("session"));
    if (session) 
    {
        count = session.count;
        startTime = new Date(session.startTime);
        totalTime = session.totalTime;
        document.getElementById("roundCount").textContent = count;
        timerInterval = setInterval(updateTime, 1000);
        roundBtn.disabled = false;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        alert("Session loaded!");
    } 
    else 
    {
        alert("No session found!");
    }
});
soundUpload.addEventListener("change", (event) => 
{
    const file = event.target.files[0];
    if (file) 
    {
        const url = URL.createObjectURL(file);
        notificationSound.src = url;
    }
});