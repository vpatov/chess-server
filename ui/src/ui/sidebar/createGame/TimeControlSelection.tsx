import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import './TimeControlSelection.css';

function TimeControlSquare(props: any) {
    const { minute, selected, onClickHandler } = props;
    const thisSelected = selected === minute;
    return <div
        className={`time-control-square ${`time-control-square-${thisSelected ? '' : 'un'}selected`}`}
        onClick={() => onClickHandler(minute)}
        >
        {minute}

    </div>
}

function TimeControlSelection() {
    const { register, setValue } = useFormContext();
    const [minuteChosen, setMinuteChosen] = useState(5);
    const [increment, setIncrement] = useState("0");

    const minutesControlMethods = register('minutes');

    function selectMinuteChosenHandler(value: number){
        setMinuteChosen(value);
        setValue('minutes',value);
    }

    useEffect(() => {setValue('minutes',5)}, [setValue])


    function checkLength(event: any){
        const val = Number(event.target.value)
        if (val < 0 ){
            setIncrement("0");
        }
        else if (val > 60){
            setIncrement("60");
        }
        else {
            setIncrement(String(val));
        }
    }
    const minuteValues = [1, 3, 5, 10, 15, 20, 30, 60, 90];
    return <div>
        <div>
            Increment (seconds):
            <input
                {...register('increment')}
                className="increment-input"
                type="number"
                min={0}
                max={60}
                onInput={checkLength}
                value={increment}
            ></input>

        </div>
        <span> Minutes: </span>
        <div className="time-control-squares-container">
            {minuteValues.map((minute) => (
                <TimeControlSquare
                    key={minute}
                    minute={minute}
                    selected={minuteChosen}
                    onClickHandler={selectMinuteChosenHandler}
                />
            ))}
        </div>
    </div>

}

export default TimeControlSelection;