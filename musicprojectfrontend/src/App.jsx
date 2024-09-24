import { useEffect, useRef, useState } from "react";
import ReactJkMusicPlayer from "react-jinke-music-player";
import "react-jinke-music-player/assets/index.css";
import Webcam from "react-webcam";
import axios from "axios";
import Logo from "./assets/img.jpg";
import { BrowserRouter, NavLink, Route } from "react-router-dom";
import UserCard from "./UserCard";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import MainApp from "./MainApp";
import FriendsApp from "./FriendsApp";

export const BASE_URL = "http://localhost:8000";

function App() {
  // states
  const [audioList, setAudioList] = useState([]); //pagination array
  const [apiAudioList, setApiAudioList] = useState([]); //original array from api
  const [apiAudioListCopy, setApiAudioListCopy] = useState([]); //original array from api -> copy
  const [mood, setMood] = useState("");
  const [audioInstance, setAudioInstance] = useState(null);
  const [currAudio, setCurrAudio] = useState([]);

  // refs
  var webCamera = useRef(null);

  async function fetchMusic(selectedMood = null) {
    let payload = {
      token: localStorage.getItem("token"),
    };

    if (selectedMood) {
      payload["mood"] = selectedMood;
    } else {
      payload["image"] = webCamera.current.getScreenshot();
    }

    let response = await axios.post(`${BASE_URL}/api/post-image/`, payload);
    let songs = response.data.songs;
    let resMood = selectedMood || response.data.mood;

    setApiAudioList([]);
    setApiAudioListCopy([]);
    setApiAudioListCopy(
      songs.map((song) => {
        return {
          name: song.name,
          musicSrc: song.musicSrc,
          cover: song.cover,
        };
      })
    );
    setApiAudioList(songs);
    setMood(resMood);

    // Update currAudio with the new songs and play them
    setCurrAudio(songs);
    if (songs.length > 0 && audioInstance) {
      audioInstance.play();
    }
  }

  async function fetchSongsByMood(mood) {
    try {
      let response = await axios.post(`${BASE_URL}/api/get-songs-by-mood/`, {
        mood: mood,
        token: localStorage.getItem("token"),
      });

      let songs = response.data.songs;
      setApiAudioList([]);
      setApiAudioListCopy([]);
      setApiAudioListCopy(
        songs.map((song) => {
          return {
            name: song.name,
            musicSrc: song.musicSrc,
            cover: song.cover,
          };
        })
      );
      setApiAudioList(songs);
      setMood(mood);

      // Update currAudio with the new songs and play them
      setCurrAudio(songs);
      if (songs.length > 0 && audioInstance) {
        audioInstance.play();
      }
    } catch (error) {
      console.error("Error fetching songs by mood:", error);
    }
  }

  useEffect(() => {
    setAudioList(apiAudioList.slice(0, 6));
  }, [apiAudioList, apiAudioListCopy]);

  function playMusic(song) {
    audioInstance.clear();
    setTimeout(() => {
      setCurrAudio([song]);
      audioInstance.play();
    }, 300);
  }

  function reverse(arr = [], l, r) {
    while (l < r) {
      var temp = arr[l];
      arr[l] = arr[r];
      arr[r] = temp;
      l++;
      r--;
    }
  }

  function rotateDec(arr = []) {
    reverse(arr, 0, arr.length - 2);
    reverse(arr, 0, arr.length - 1);
  }

  function rotateInc(arr = []) {
    reverse(arr, 1, arr.length - 1);
    reverse(arr, 0, arr.length - 1);
  }

  function next() {
    rotateInc(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
      return "";
    });
    setAudioList(em);
  }

  function prev() {
    rotateDec(apiAudioList);
    var em = [];
    apiAudioList.slice(0, 6).map((song) => {
      em.push(song);
      return "";
    });
    setAudioList(em);
  }
 
  function logout() {
    localStorage.clear();
    window.location.pathname = "/login";
  }

  return (
    <div>
      {/* top */}
      <BrowserRouter>
        <div className="d-flex h-90">
          {/* menu */}
          <div className="w-15 text-center pt-5" id="menu">
            {/* logo */}
            <div>
              <img src={Logo} alt="logo" className="logo" />
            </div>

            {/* navs */}
            <nav className="d-flex flex-column justify-content-around">
              <NavLink to="/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-home"></i>
                    </span>{" "}
                    Home
                  </div>
                </div>
              </NavLink>
              <NavLink to="/friends/" activeClassName="active" exact>
                <div>
                  <div>
                    <span>
                      <i className="fas fa-user-friends"></i>
                    </span>{" "}
                    Friends
                  </div>
                </div>
              </NavLink>

              <div onClick={() => logout()}>
                <div>{localStorage.getItem("token") && "Logout"}</div>
              </div>
            </nav>

            <div id="info">
              <span>
                <i className="far fa-copyright"></i>
              </span>{" "}
              Moodiee 2024
            </div>
          </div>
          <div className="mood-selector">
        <h2>Select Your Mood:</h2>
        <div className="d-flex justify-content-around mb-4">
          <button className="btn btn-primary" onClick={() => fetchSongsByMood("Happy")}>
            Happy
          </button>
          <button className="btn btn-secondary" onClick={() => fetchSongsByMood("Sad")}>
            Sad
          </button>
          <button className="btn btn-success" onClick={() => fetchSongsByMood("Surprised")}>
            Surprise
          </button>
          <button className="btn btn-warning" onClick={() => fetchSongsByMood("Neutral")}>
            Neutral
          </button>
          <button className="btn btn-danger" onClick={() => fetchSongsByMood("Angry")}>
            Angry
          </button>
        </div>
      </div>

          <Route path="/" exact>
            <MainApp
              mood={mood}
              webCamera={webCamera}
              audioList={audioList}
              apiAudioListCopy={apiAudioListCopy}
              prev={prev}
              next={next}
              playMusic={playMusic}
              Webcam={Webcam}
              fetchMusic={fetchMusic}
              fetchSongsByMood={fetchSongsByMood} // Pass the function as a prop
            />
          </Route>

          <Route path="/friends" exact>
            <FriendsApp UserCard={UserCard} />
          </Route>

          <Route path="/signup" exact>
            <SignupForm />
          </Route>

          <Route path="/login" exact>
            <LoginForm />
          </Route>
        </div>
      </BrowserRouter>

      {/* Mood Selection */}


      {/* player */}
      <div>
        <ReactJkMusicPlayer
          mode="full"
          showDownload={false}
          showDestroy={false}
          showReload={false}
          showLyric={false}
          showThemeSwitch={false}
          showPlayMode={false}
          toggleMode={false}
          audioLists={currAudio}
          autoPlay={true} // Changed to autoPlay
          seeked={false}
          getAudioInstance={(audioObj) => {
            setAudioInstance(audioObj);
            console.log("Audio instance initialized:", audioObj); // Add this line
          }}
        />
      </div>
    </div>
  );
}

export default App;
