import React, {useState, useEffect, useRef} from "react";

const Timer = () => {
    const [workingTime, setWorkingTime] = useState(1500);
    const [pauseTime, setPauseTime] = useState(300);
    const [pauseStatus, setPauseStatus] = useState(false);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [duration, setDuration] = useState(1500);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const input = useRef();
    const input2 = useRef();

    /**toggle
     * - sets first timer as work timer
     * - starts timer
     */
    function toggle() {
        if (isFirstTime == true && typeof workingTime == "number" && typeof pauseTime == "number") {
            pauseStatus? setDuration(duration => duration = pauseTime) : setDuration(duration => duration = workingTime)
            setIsFirstTime(false);
        }
        setIsActive(!isActive);
    }

    /**Reset
     * stops timer
     * set duration to work timer
     */
    function reset() {
        pauseStatus? setDuration(pauseTime) : setDuration(workingTime);
        setIsActive(false);
    }

    /**Decrement every second
     * when reaches 0 ->  - console event + change pause status
     *                    - set duration to pause time +
     *                    - changes title to pause time
     */
    useEffect(() => {
        let interval = null;
        if (isActive) {
            interval = setInterval(() => {
                setDuration((duration) =>
                    duration > 0 ? duration - 1 : duration,
                );
            }, 1000);
        }
        if (isActive && duration == 0) {
            pauseStatus == false? console.log("c'est la pause!") : console.log("c'est la fin de la pause!")
            setPauseStatus(pauseStatus => !pauseStatus)
        }
        
        return () => clearInterval(interval);
    }, [isActive, duration]);

    useEffect(() => {
        pauseStatus == true? setDuration(duration => duration = pauseTime) : setDuration(duration => duration = workingTime)
        isFirstTime == false? setIsActive(isActive => isActive = true) : ""
    }, [pauseStatus]);

    /**timer display */
    useEffect(() => {
        setMinutes((minutes) => (minutes = parseInt(duration / 60)));
        setSeconds((seconds) => (seconds = duration % 60));
    }, [duration]);

    /**input fields +/- buttons */
    let increment = (e) => {
        e.preventDefault();
        setWorkingTime((workingTime) => workingTime + 60);
    };

    let decrement = (e) => {
        e.preventDefault();
        setWorkingTime((workingTime) => workingTime - 60);
    };

    useEffect(() => {
        input.current.value = workingTime / 60;
        if (isFirstTime && pauseStatus==false) {
            setDuration((duration) => (duration = workingTime));
        }
        if (isFirstTime && pauseStatus) {
            setDuration((duration) => (duration = pauseTime));
        }
    }, [workingTime, pauseTime]);

    let incrementPause = (e) => {
        e.preventDefault();
        setPauseTime((pauseTime) => pauseTime + 60);
    };

    let decrementPause = (e) => {
        e.preventDefault();
        setPauseTime((pauseTime) => pauseTime - 60);
    };

    useEffect(() => {
        input2.current.value = pauseTime / 60;
    }, [pauseTime]);

    let changeTimer = (e) => {
        e.preventDefault();
        isActive?  "" : setPauseStatus(!pauseStatus)
        setIsFirstTime(true)
    }

    return (
        <>
            <div className="time">
                <h2 onClick={changeTimer}>{pauseStatus? "Pause Timer" : "Work Timer"}</h2>
                <span>{minutes}:</span>
                <span>{seconds}</span>
            </div>
            <audio src="./alarm.mp3"></audio>
            <div className="row">
                <button
                    className={`button-${isActive ? "active" : "inactive"}`}
                    onClick={toggle}>
                    {isActive ? "Pause" : "Start"}
                </button>

                <button className="button" onClick={reset}>
                    Reset
                </button>
            </div>
            <form>
                <h2>Working Time</h2>
                <input
                    type="text"
                    ref={input}
                    onChange={(e) => {
                        if (
                            typeof (e.target.value == "number") &&
                            e.target.value > 0
                        ) {
                            setWorkingTime(e.target.value * 60);
                        }
                    }}
                    defaultValue={workingTime / 60}
                />
                <button onClick={increment}>+</button>
                <button onClick={decrement}>-</button>
            </form>
            <form>
                <h2>Pause Time</h2>
                <input
                    type="text"
                    ref={input2}
                    onChange={(e) => {
                        if (
                            typeof (e.target.value == "number") &&
                            e.target.value > 0
                        ) {
                            setPauseTime(e.target.value * 60);
                        }
                    }}
                    defaultValue={pauseTime / 60}
                />
                <button onClick={incrementPause}>+</button>
                <button onClick={decrementPause}>-</button>
            </form>
        </>
    );
};

export default Timer;
