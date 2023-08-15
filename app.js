const container = document.querySelector(".container");
const image = document.getElementById("music-img");
const title = document.querySelector("#music-details .title");
const singer = document.querySelector("#music-details .singer");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const next = document.querySelector("#next");
const duration = document.getElementById("duration");
const currentTime = document.getElementById("current-time");
const progressBar = document.getElementById("progress-bar");
const volume = document.querySelector("#volume");
const volumeBar = document.querySelector("#volume-bar");
const ul = document.querySelector("ul");
const repeat = document.querySelector("#repeat");
const mixed = document.querySelector("#mixed-play");

const player = new MusicPlayer(musicList);

let music = player.getMusic();

window.addEventListener("load", () => {
  let music = player.getMusic();
  displayMusic(music);
  displayMusicList(player.musicList);
  isPlayingNow();
});

function displayMusic(music) {
  title.innerText = music.getName();
  singer.innerText = music.singer;
  image.src = "img/" + music.img;
  audio.src = "mp3/" + music.file;
}

play.addEventListener("click", () => {
  const isMusicPlay = container.classList.contains("playing");

  if (!isMusicPlay) {
    container.classList.add("playing");
    play.classList.remove("fa-pause");
    play.querySelector("i").classList.add("fa-play");
    audio.play();
  } else {
    container.classList.remove("playing");
    play.querySelector("i").classList.remove("fa-play");
    play.querySelector("i").classList.add("fa-pause");
    audio.pause();
  }
});

prev.addEventListener("click", () => {
  player.prev();
  let music = player.getMusic();
  displayMusic(music);
  audio.play();
  isPlayingNow();
});

next.addEventListener("click", () => {
  player.next();
  let music = player.getMusic();
  displayMusic(music);
  audio.play();
  isPlayingNow();
});

repeat.addEventListener("click", () => {
  player.repeat(player.index);
  let music = player.getMusic();
  displayMusic(music);
  audio.play();
  isPlayingNow();
});

mixed.addEventListener("click", () => {
  player.index = player.mixed();
  let music = player.getMusic();
  displayMusic(music);
  audio.play();
  isPlayingNow();
});

const calculateTime = (second) => {
  const dakika = Math.floor(second / 60);
  const saniye = Math.floor(second % 60);
  const guncellenenSaniye = saniye < 10 ? `0${saniye}` : saniye;
  const sonuc = `${dakika} : ${guncellenenSaniye}`;

  return sonuc;
};

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = calculateTime(audio.duration);
  progressBar.max = Math.floor(audio.duration);
});

audio.addEventListener("timeupdate", () => {
  progressBar.value = Math.floor(audio.currentTime);
  currentTime.textContent = calculateTime(progressBar.value);
});

progressBar.addEventListener("input", () => {
  currentTime.textContent = calculateTime(progressBar.value);
  audio.currentTime = progressBar.value;
});

let muteState = "unmuted";

volumeBar.addEventListener("input", (e) => {
  const value = e.target.value;
  audio.volume = value / 100;
  if (value == 0) {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});
volume.addEventListener("click", () => {
  if (muteState === "unmuted") {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumeBar.value = 0;
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
    volumeBar.value = 100;
  }
});

const displayMusicList = (list) => {
  for (let i = 0; i < list.length; i++) {
    let liTag = `
       <li li-index='${i}' onclick="selectedMusic(this)" class="list-group-item d-flex justify-content-between align-item-center">
          <span>${list[i].getName()}</span>
          <span class="badge bg-primary rounded-pill" id="music-${i}" > </span>
          <audio class = "music-${i}" src="mp3/${list[i].file}"></audio>
       </li>
       `;
    ul.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ul.querySelector(`#music-${i}`);
    let liAudioTag = ul.querySelector(`.music-${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
      liAudioDuration.innerText = calculateTime(liAudioTag.duration);
    });
  }
};

const selectedMusic = (li) => {
  const index = li.getAttribute("li-index");
  player.index = index;
  displayMusic(player.getMusic());
  audio.play();
  isPlayingNow();
};

const isPlayingNow = () => {
  for (let li of ul.querySelectorAll("li")) {
    if (li.classList.contains("playing")) {
      li.classList.remove("playing");
    }
    if (li.getAttribute("li-index") == player.index) {
      li.classList.add("playing");
    }
  }
};
audio.addEventListener("ended", () => {
  player.next();
});
