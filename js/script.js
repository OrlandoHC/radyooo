const logoTitle = "NNR";

const preloader = document.querySelector(".preloader");
const body = document.querySelector("body");
const stations = document.querySelectorAll(".station");
const footer = document.querySelector("footer");
const menu = document.querySelector(".menu");
const leftLinks = document.querySelector(".left-links");
const currentIcon = `
<svg
class = "controls"
xmlns = "http://www.w3.org/2000/svg"
width = "16"
height = "16"
viewBox = "0 0 16 16">
<rect
width = "16"
height = "16"
rx = "8"
ry = "8" />
<rect
class = "pause"
x = "5"
y = "5"
width = "6"
height = "6"
rx = "1.5"
ry = "1.5"
fill = "currentColor" />
<path
class = "play"
d = "M10.79,8.41l-3.5,2.5a.5.5,0,0,1-.79-.41v-5a.5.5,0,0,1,.09-.29.51.51,0,0,1,.7-.12l3.5,2.5a.68.68,0,0,1,.12.12A.51.51,0,0,1,10.79,8.41Z"
fill = "currentColor" />
</svg>
`;

let nowPlaying = false;
let clickTracking = [];
let start = 0;

function radioPlayer() {
    const player = document.createElement("div");
    const container = document.createElement("div");
    const info = document.createElement("div");
    const control = document.createElement("div");
    const logo = document.createElement("img");
    const logoContainer = document.createElement("div");
    const radioName = document.createElement("h2");
    const overlay = document.createElement("div");

    player.append(container);
    container.append(info);
    container.append(control);
    info.append(logoContainer);
    logoContainer.append(logo);
    logoContainer.append(overlay);
    info.append(radioName);
    document.body.insertBefore(player, document.querySelector("script"));

    player.className = "player";
    container.className = "container";
    info.className = "info";
    control.className = "control";
    logoContainer.className = "logoContainer";
    overlay.className = "overlay";

    control.innerHTML = currentIcon;
    overlay.innerHTML = currentIcon;

    logoContainer.classList.add("controls");
};

function updateRadioPlayer(station) {
    const controls = document.querySelectorAll("svg.controls");
    const radioName = station.firstElementChild.alt;
    const favicon = document.querySelector('link[rel*="icon"]');
    const active = "icons/favicon/active.png";
    const inActive = "icons/favicon/inactive.png";

    document.querySelector(".info h2").textContent = radioName;
    document.querySelector(".info img").src = station.firstElementChild.src;
    document.title = logoTitle + " | " + radioName;

    controls.forEach(
        control => {
            if (control.classList.contains("clicked") && nowPlaying === false) {
                control.classList.remove("clicked");
                favicon.setAttribute("href", inActive);
            } else {
                control.classList.add("clicked");
                favicon.setAttribute("href", active);
            };
        }
    );
};

function play(audio) {
    audio.play();
};

function stop(audio) {
    audio.pause();
};

stations.forEach(
    (station, activeStation) => {
        function controls() {
            for (otherStations = 0; otherStations < stations.length; otherStations++) {
                if (otherStations === activeStation) {
                    continue;
                };
                stations[otherStations].children[1].pause();
                stations[otherStations].classList.remove("active");
            };

            let audio = station.children[1];

            function isPlaying() {
                if (audio.paused) {
                    play(audio);
                    nowPlaying = true;
                    station.classList.add("active");
                } else {
                    stop(audio);
                    nowPlaying = false;
                    station.classList.remove("active");
                };
            };

            isPlaying();

            if (footer.nextElementSibling.className === "player") {
                updateRadioPlayer(station);
            } else {
                radioPlayer();
                updateRadioPlayer(station);
            };

            const controls = document.querySelectorAll(".player .controls");
            const player = document.querySelector(".player");

            controls.forEach(
                control => {
                    control.onclick = (e) => {
                        e.stopPropagation();
                        isPlaying();
                        updateRadioPlayer(station);
                    };
                }
            );

            player.onclick = () => {
                player.classList.toggle("maximized");
                body.classList.toggle("overflowHidden");
            };

            if (footer.attributes.style === undefined) {
                footer.style.marginBottom = `${player.offsetHeight}px`;
            };

            const info = document.querySelector(".player .info");

            clickTracking[start++] = activeStation;

            if (start === 2) {
                start = 0;
            };

            if (clickTracking[clickTracking.length - 1] !== clickTracking[clickTracking.length - 2]) {
                info.style.animation = "fadeIn 1s ease-in-out both";

                setTimeout(() => {
                    info.removeAttribute("style");
                }, 1000);
            };

            document.onkeyup = (e) => {
                if (e.keyCode === 13) {
                    isPlaying();
                    updateRadioPlayer(station);
                };
            };
        };

        station.addEventListener("click", controls);
    }
);

function showRadioNameOnHover() {
    stations.forEach(
        station => {
            station.setAttribute("data-name", station.firstElementChild.alt);
        }
    );
};

showRadioNameOnHover();

menu.addEventListener(
    "click",
    () => {
        menu.classList.toggle("menu-opened");
        leftLinks.classList.toggle("visible");
        body.classList.toggle("overflowHidden");
    }
);

window.onload = () => {
    setTimeout(() => {
        preloader.classList.add("fadeOut");
        body.classList.remove("overflowHidden");
    }, 250);

    setTimeout(() => {
        preloader.remove();
    }, 500);
};