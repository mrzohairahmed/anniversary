let currentPage = 0;
const pages = document.querySelectorAll(".page");
const totalPages = pages.length;
const effectsLayer = document.getElementById("effects-layer");
const bgMusic = document.getElementById("bgMusic");

/* PAGE TURNING */
function turnPage(direction) {
    pages[currentPage].classList.remove("active");

    if (direction === "next") currentPage = (currentPage + 1) % totalPages;
    else currentPage = (currentPage - 1 + totalPages) % totalPages;

    pages[currentPage].classList.add("active");
}

/* FLOATING ELEMENT CREATION (runs ONCE) */
function createFloatingElements() {
    setInterval(() => createHeart(), 800);
    setInterval(() => createSparkle(), 700);
    setInterval(() => createTeddy(), 4000);
}

function createHeart() {
    const h = document.createElement("div");
    h.className = "heart";
    h.innerHTML = "❤️";
    h.style.left = Math.random() * 100 + "vw";
    effectsLayer.appendChild(h);

    setTimeout(() => h.remove(), 6000);
}

function createSparkle() {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.innerHTML = "✧";
    s.style.left = Math.random() * 100 + "vw";
    effectsLayer.appendChild(s);

    setTimeout(() => s.remove(), 4000);
}

function createTeddy() {
    const t = document.createElement("div");
    t.className = "teddy";
    t.innerHTML = "🧸";
    t.style.left = Math.random() * 100 + "vw";
    effectsLayer.appendChild(t);

    setTimeout(() => t.remove(), 10000);
}

// 🎵 Toggle open/close playlist panel
function toggleMusic() {
    const panel = document.getElementById("musicPanel");
    const button = document.querySelector(".music-toggle");

    panel.classList.toggle("open");

    if (panel.classList.contains("open")) {
        button.classList.add("hidden");
    } else {
        button.classList.remove("hidden");
    }
}

// 🎶 Play selected song
function playSong(src, element) {
    bgMusic.src = src;
    bgMusic.play().catch(() => {
        console.log("Playback blocked until user interacts");
    });

    // highlight selected song
    document.querySelectorAll(".music-list li").forEach(li =>
        li.classList.remove("active")
    );

    if (element) {
        element.classList.add("active");
    }

    // update play/pause button icon
    if (playPauseBtn) {
        playPauseBtn.textContent = "⏸";
    }
}

window.addEventListener("load", () => {
    createFloatingElements();

    // preload first song + highlight it
    bgMusic.src = "audio/AboutYou.mp3";
    bgMusic.volume = 0.5;

    const firstSong = document.querySelector(".music-list li");
    if (firstSong) {
        document.querySelectorAll(".music-list li").forEach(li =>
            li.classList.remove("active")
        );
        firstSong.classList.add("active");
    }
});

const enterBtn = document.getElementById("enterBtn");
const landingScreen = document.getElementById("landing-screen");

enterBtn.addEventListener("click", () => {
    bgMusic.play().then(() => {
        if (playPauseBtn) {
            playPauseBtn.textContent = "⏸";
        }
    }).catch(() => {});

    landingScreen.classList.add("fade-out");

    setTimeout(() => {
        landingScreen.style.display = "none";
    }, 600);
});

// 🎶 Elements
const progressContainer = document.getElementById("progress-container");
const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const playPauseBtn = document.getElementById("playPauseBtn");
const knob = document.getElementById("progress-knob");

let isDragging = false;

/* Update progress bar while music plays */
bgMusic.addEventListener("timeupdate", () => {
    const percent = bgMusic.duration ? (bgMusic.currentTime / bgMusic.duration) * 100 : 0;
    progressBar.style.width = percent + "%";

    currentTimeEl.textContent = formatTime(bgMusic.currentTime);
    totalTimeEl.textContent = formatTime(bgMusic.duration);

    if (!isDragging) {
        knob.style.left = percent + "%";
    }
});

/* Allow clicking on bar to skip */
progressContainer.addEventListener("click", (event) => {
    const width = progressContainer.clientWidth;
    const clickX = event.offsetX;
    const duration = bgMusic.duration;

    if (!duration) return;
    bgMusic.currentTime = (clickX / width) * duration;
});

/* Time formatting helper */
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec % 60);
    if (seconds < 10) seconds = "0" + seconds;
    return `${minutes}:${seconds}`;
}

/* Play / Pause button */
playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            playPauseBtn.textContent = "⏸";
        }).catch(() => {});
    } else {
        bgMusic.pause();
        playPauseBtn.textContent = "▶️";
    }
});

/* When user starts dragging */
knob.addEventListener("mousedown", () => {
    isDragging = true;
});

/* Drag movement */
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;

    const rect = progressContainer.getBoundingClientRect();
    let x = e.clientX - rect.left;

    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = x / rect.width;
    knob.style.left = (percentage * 100) + "%";
    progressBar.style.width = (percentage * 100) + "%";

    if (bgMusic.duration) {
        bgMusic.currentTime = bgMusic.duration * percentage;
    }
});

/* Stop dragging */
document.addEventListener("mouseup", () => {
    isDragging = false;
});