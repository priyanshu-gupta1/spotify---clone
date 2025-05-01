let currentsong = new Audio();
let songs;
let currentFolder;
function secondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`/${folder}/`)
    let respons = await a.text();
    let div = document.createElement("div")
    div.innerHTML = respons;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currentFolder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = " "
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
        <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")}</div>
            <div>Arijit Singh</div>
        </div>
        <div class="playbar">
            <span>play now</span>
            <img class="invert" src="play.svg" alt="">
        </div></li>`
    }
    // Attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    
    });
    return songs;
}
const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currentFolder}/` + track;
    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}
async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let respons = await a.text();
    let div = document.createElement("div")
    div.innerHTML = respons;
    let anchor = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folderFile = e.href.split("/").slice(-1)[0]
            //get the meta data of the folder
            let a = await fetch(`/songs/${folderFile}/info.json`)
            let respons = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + ` <div id="card1" data-folder="${folderFile}" class="card">
                   <div class="hover">
                       <img id="himage" src="playbar.svg" alt="">
                   </div>
                   <img src="/songs/${folderFile}/cover.jpg" alt="">
                   <h2>${respons.title}</h2>
                   <p>${respons.description}</p>
                   </div>`

        }
    }
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
}

async function main() {
    // get the list of all song
    await getSongs("songs/punj")
    playMusic(songs[0], true)
    //Display all the album on the page
    await displayAlbums()

    //Attach an eventlistner to play pause and next and previous song
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //listen for time update
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentsong.currentTime)}/${secondsToMinutesAndSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    })
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;
    })
    //getBoundingClientRect() method in JavaScript gives you information about the size and position of an element (like an HTML element) on a web page. It returns an object with properties like top, left, right, bottom, width, and height
    //e.offsetX it give the width of x-axis from where you click and we devided it from the whole width of element and then which value we get multiply with 100 
    //add event listener for hamburger
    document.querySelector(".hamburgar").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })
    //add event listener for close hamburger

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })
    //add Event listner for previous and next button
    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log(currentsong.src);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        console.log(index);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }

    })
    next.addEventListener("click", () => {
        currentsong.pause()
        console.log(currentsong.src.split("/").slice(-1)[0]);
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100

        //the value of valume is lie between 0 and 1 and e.target.value give the value between 1-100 so we devided it from 100
    })
    document.querySelector(".s-btn").addEventListener("click", () => {

        if (currentsong.volume > 0) {
            currentsong.volume = "0"
            sound.src = "mute.svg"
        }
        else {
            currentsong.volume = "0.5"
            sound.src = "sound.svg"
        }
    })

}
main()



