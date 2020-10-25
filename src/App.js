import React, { useState, useEffect } from "react";

import { createRipple } from "./Ripple";
import { useIsMount } from "./useIsMount";
import invert from "./assets/icons/invert.svg";
import github from "./assets/icons/github.svg";

function msTossms(inputMS) {
  let seconds = Math.floor(inputMS / 1000);
  let ms = inputMS % 1000;
  return seconds + "." + ms;
}

function App() {
  const isMount = useIsMount();
  const [milliseconds, setMilliSeconds] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [isTestActive, setIsTestActive] = useState(false);
  const [testLength, setTestLength] = useState(5000);
  const [startTime, setStartTime] = useState(Date.now());
  const [clickerDisabled, setClickerDisabled] = useState(false);

  let localDarkmode = localStorage.getItem("darkmode") === "true";
  if (!localDarkmode) {
    localDarkmode = false;
  }
  document.body.classList.add(localDarkmode ? "dark" : "light");
  const [darkmode, setDarkmode] = useState(localDarkmode);
  localStorage.setItem("darkmode", darkmode);
  document.body.classList.replace(
    darkmode ? "light" : "dark",
    darkmode ? "dark" : "light"
  );

  useEffect(() => {
    let interval = null;
    if (isTestActive) {
      interval = setInterval(() => {
        setMilliSeconds(testLength - (Date.now() - startTime));
      }, 1);
    }
    if (milliseconds <= 0) {
      setIsTestActive(false);
      clearInterval(interval);
      if (!isMount) {
        setClickerDisabled(true);
        setTimeout(() => setClickerDisabled(false), 1000);
      }
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line -- If I put in all deps it leads to unexpected behaivour(react-hooks/exhaustive-deps)
  }, [isTestActive, milliseconds, startTime]);

  return (
    <div className="App">
      <div className="title">
        <h1>CPS Tester</h1>
        <img
          className="icon"
          onClick={() => setDarkmode(!darkmode)}
          src={invert}
          alt="invert"
        />
        <img
          className="icon"
          onClick={() =>
            window.open("https://github.com/chxry/cps-tester", "_blank")
          }
          src={github}
          alt="invert"
        />
      </div>
      <button
        className="clicker"
        disabled={clickerDisabled}
        onClick={(e) => {
          createRipple(e);
          setIsTestActive(true);
          if (!isTestActive) {
            setMilliSeconds(testLength);
            setClicks(0);
            setStartTime(Date.now());
          } else {
            setClicks(clicks + 1);
          }
        }}
      >
        {
          <h2 className={isTestActive ? "fadeOut" : ""}>
            {clickerDisabled
              ? "YOUR CPS: " +
                Math.round(
                  (clicks / ((testLength - milliseconds) / 1000)) * 100
                ) /
                  100
              : "CLICK TO START THE TEST"}
          </h2>
        }
      </button>
      <div className="testLength">
        <h5>Test Length:</h5>
        <div className="testLengthButtons">
          <button
            className="testLengthButton"
            disabled={isTestActive}
            onClick={(e) => {
              createRipple(e);
              setTestLength(1000);
            }}
          >
            <h2>1</h2>
          </button>
          <button
            className="testLengthButton"
            disabled={isTestActive}
            onClick={(e) => {
              createRipple(e);
              setTestLength(5000);
            }}
          >
            <h2>5</h2>
          </button>
          <button
            className="testLengthButton"
            disabled={isTestActive}
            onClick={(e) => {
              createRipple(e);
              setTestLength(10000);
            }}
          >
            <h2>10</h2>
          </button>
          <button
            className="testLengthButton"
            disabled={isTestActive}
            onClick={(e) => {
              createRipple(e);
              setTestLength(20000);
            }}
          >
            <h2>20</h2>
          </button>
        </div>
      </div>
      <div className="testInfo">
        <div className="info">
          <h4>Time Remaining:</h4>
          <h3>{msTossms(isTestActive ? milliseconds : testLength)} seconds</h3>
        </div>
        <div className="info">
          <h4>Clicks:</h4>
          <h3>{clicks} clicks</h3>
        </div>
        <div className="info">
          <h4>CPS:</h4>
          <h3>
            {String(
              Math.round(
                (clicks / ((testLength - milliseconds) / 1000)) * 100
              ) / 100
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}

export default App;
