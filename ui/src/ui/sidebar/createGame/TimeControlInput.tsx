import { useState } from "react";
import './TimeControlInput.css';

function TimeControl(props: any) {

    const { clockSeconds, setClockSeconds, increment, setIncrement } = props;
    const [clockValidity, setClockValidity] = useState(true);
    const [incrementValidity, setIncrementValidity] = useState(true);

    return (
        <div>
            <input
                id="clock-input"
                className={"clock-input " + (clockValidity ? "valid-input" : "invalid-input")}
                type="text"
                name="clock"
                required pattern="[0-9]{1,3}:[0-5][0-9]"
                value={clockSeconds}
                onChange={(e) => { setClockSeconds(e.target.value); setClockValidity(e.target.checkValidity()) }}
                title="Write a duration in the format mm:ss">
            </input>
            <input
                id="increment-input"
                className={"increment-input " + (incrementValidity ? "valid-input" : "invalid-input")}
                type="number"
                name="increment"
                required pattern="[0-9]{1,3}"
                value={increment}
                onChange={(e) => { setIncrement(e.target.value); setIncrementValidity(e.target.checkValidity()) }}
                title="Increment">
            </input>
        </div>
    );

}

export default TimeControl;