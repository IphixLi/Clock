import React, {Component} from "react";
import './App.css';

class TimerPanel extends Component {
  constructor(props) {
    super(props);
    this.normalizedRadius = this.props.radius - this.props.stroke * 2;
    this.circumference = this.normalizedRadius * 2 * Math.PI;
  }

  render() {
    const strokeDashoffset =
      -(1 - this.props.ringProgress) * this.circumference;

    return (
      <div id="timer-panel">
        <svg class="progress-ring" height="300" width="300">
          <circle
            //ANIMATED CIRCLE
            class="progress-ring__circle"
            stroke="purple"
            fill="transparent"
            stroke-width={this.props.stroke}
            strokeDasharray={this.circumference + " " + this.circumference}
            style={{ strokeDashoffset }}
            r={this.normalizedRadius}
            cx={this.props.radius}
            cy={this.props.radius}
          />
          //CIRCLE WITH LOW OPACITY
          <circle
            class="progress-ring__circle"
            stroke="purple"
            strokeOpacity="20%"
            fill="transparent"
            stroke-width={this.props.stroke}
            strokeDasharray={this.circumference + " " + this.circumference}
            r={this.normalizedRadius}
            cx={this.props.radius}
            cy={this.props.radius}
          />
        </svg>
        <div id="timer-label" class="text-center">
          {this.props.timerType}
        </div>
        <div id="time-left" class="text-center">
          {this.props.clockFormat()}
        </div>
      </div>
    );
  }
}

//ReactDOM.render(<TimerPanel />, document.querySelector("#container"));

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.breakIncrement = this.breakIncrement.bind(this);
    this.breakDecrement = this.breakDecrement.bind(this);
    this.sessionIncrement = this.sessionIncrement.bind(this);
    this.sessionDecrement = this.sessionDecrement.bind(this);
  }

  breakIncrement() {
    if (this.props.breakLength < 60) {
      this.props.setLength("breakLength", "increment");
    }
  }

  breakDecrement() {
    if (this.props.breakLength > 1) {
      this.props.setLength("breakLength", "decrement");
    }
  }

  sessionIncrement() {
    if (this.props.sessionLength < 60) {
      this.props.setLength("sessionLength", "increment");
      this.props.setTimer("sessionLength", +1);
    }
  }

  sessionDecrement() {
    if (this.props.sessionLength > 1) {
      this.props.setLength("sessionLength", "decrement");
      this.props.setTimer("sessionLength", -1);
    }
  }

  render() {
    return (
      <div id="control-panel">
        <div id="break-panel" class="side-panel">
          <div id="break-label" class="text-center control-label">
            Break Length
          </div>
          <div id="break-control" class="side-control">
            <img
              id="break-decrement"
              class="minus control-button"
              src="https://i.imgur.com/NoDvpNg.png"
              onClick={this.breakDecrement}
            />
            <span id="break-length" class="control-length">
              {this.props.breakLength}
            </span>
            <img
              id="break-increment"
              class="plus control-button"
              src="https://i.imgur.com/7gTsInL.png"
              onClick={this.breakIncrement}
            />
          </div>
        </div>
        <div id="session-panel" class="side-panel">
          <div id="session-panel">
            <div id="session-label" class="text-center control-label">
              Session Length
            </div>
            <div id="session-control" class="side-control">
              <img
                id="session-decrement"
                class="minus control-button"
                src="https://i.imgur.com/NoDvpNg.png"
                onClick={this.sessionDecrement}
              />
              <span id="session-length" class="control-length">
                {this.props.sessionLength}
              </span>
              <img
                id="session-increment"
                class="plus control-button"
                src="https://i.imgur.com/7gTsInL.png"
                onClick={this.sessionIncrement}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//ReactDOM.render(<ControlPanel />, document.querySelector("#container"));

class StartPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      soundIsPlaying : false
    }
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick(){
    if (!this.state.soundIsPlaying){
      this.props.playSound();
      this.setState({
        soundIsPlaying: !this.state.soundIsPlaying
      })
    } else {
    document.querySelector("#beep").pause();
    document.querySelector("#beep").currentTime = 0;
      this.setState({
        soundIsPlaying: !this.state.soundIsPlaying
      })
    }
  }

  render() {
    return (
      <div id="start-panel">
        <img
          id="start_stop"
          className="play-pause-button"
          src="https://i.imgur.com/53mZj6i.png"
          onClick={this.props.start}
        />
        
        <div id="secondary">
        <img
          id="reset"
          className="reset-button secondary-button"
          src="https://i.imgur.com/kfgRqr0.png"
          onClick={this.props.reset}
        />
        <img 
          id="test-sound"
          className="secondary-button"
          src="https://i.imgur.com/rLIfj72.png"
          onClick={this.handleClick}
          />
        </div>
      </div>
    );
  }
}

//ReactDOM.render(<StartPanel />, document.querySelector("#container"));

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      started: false,
      timerType: "focus",
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      ringTimer: 1500,
      ringProgressPercentage: 1,
      intervalID: "",
      ringIntervalID: ""
    };
    this.setLength = this.setLength.bind(this);
    this.setTimer = this.setTimer.bind(this);
    this.ringProgress = this.ringProgress.bind(this);
    this.start = this.start.bind(this);
    this.reset = this.reset.bind(this);
    this.countDown = this.countDown.bind(this);
    this.clockFormat = this.clockFormat.bind(this);
    this.playSound = this.playSound.bind(this);
  }

  setLength(stateToChange, adjust) {
    if (!this.state.started) {
      if (adjust == "increment") {
        this.setState({
          [stateToChange]: this.state[stateToChange] + 1
        });
      } else if (adjust == "decrement") {
        this.setState({
          [stateToChange]: this.state[stateToChange] - 1
        });
      }
    }
  }

  setTimer(lengthType, n) {
    if (this.state.timerType === "focus" && !this.state.started) {
      this.setState({
        timer: (this.state[lengthType] + n) * 60,
        ringTimer: (this.state[lengthType] + n) * 60,
        ringProgressPercentage: 1
      });
    }
  }

  ringProgress() {
    let percentage = this.state.timer / this.state.ringTimer;
    this.setState({
      ringProgressPercentage: percentage
    });
  }

  start() {
    if (this.state.started === false) {
      document.querySelector("#start_stop").src =
        "https://i.imgur.com/7GT0Z2k.png";
      this.setState({
        started: !this.state.started,
        intervalID: setInterval(this.countDown, 1000),
        ringIntervalID: setInterval(this.ringProgress, 1000)
      });
    } else if (this.state.started) {
      clearInterval(this.state.intervalID);
      clearInterval(this.state.ringIntervalID);
      document.querySelector("#start_stop").src =
        "https://i.imgur.com/53mZj6i.png";
      this.setState({
        started: !this.state.started
      });
    }
  }

  countDown() {
    if (this.state.timer > 0) {
      this.setState({
        timer: this.state.timer - 1
      });
    } else if (this.state.timer === 0) {
      //PLAY AUDIO
      this.playSound();
      //RESET TIMER to respective timer type and duration
      if (this.state.timerType == "focus") {
        let newTimerDuration = this.state.breakLength * 60;
        this.setState({
          timerType: "relax",
          timer: newTimerDuration,
          ringTimer: newTimerDuration
        });
      } else if (this.state.timerType == "relax") {
        let newTimerDuration = this.state.sessionLength * 60;
        this.setState({
          timerType: "focus",
          timer: newTimerDuration,
          ringTimer: newTimerDuration
        });
      }
    }
  }

  playSound() {
    document.querySelector("#beep").play();
  }

  reset() {
    //Stop playing beep and rewound to the beginning
    document.querySelector("#beep").pause();
    document.querySelector("#beep").currentTime = 0;

    //Pause timer if it is running
    if (this.state.intervalID) {
      clearInterval(this.state.intervalID);
    }

    //Re-initialize states
    this.setState({
      started: false,
      timerType: "focus",
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      ringTimer: 1500,
      ringProgressPercentage: 1
    });
  }

  clockFormat() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer % 60;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return `${minutes}:${seconds}`;
  }

  render() {
    return (
      <div id="container" className="flex-center">
        <TimerPanel
          clockFormat={this.clockFormat}
          timerType={this.state.timerType}
          ringProgress={this.state.ringProgressPercentage}
          radius="150"
          stroke="4"
        />
        <ControlPanel
          breakLength={this.state.breakLength}
          sessionLength={this.state.sessionLength}
          setLength={this.setLength}
          setTimer={this.setTimer}
        />
        <StartPanel start={this.start} reset={this.reset} playSound={this.playSound}/>
        <footer id="info" className="text-center">
         IphixLi|2021 
        </footer>
        <audio
          id="beep"
          preload="auto"
          src="https://freesound.org/data/previews/411/411482_2154914-lq.mp3"
        />
      </div>
    );
  }
}

export default App;
