import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GameInstanceState } from '../../../models/api';
import { ReduxAction, ReduxActionType } from '../../../models/reduxAction';
import { gameInstanceStateSelector, positionSelector, timeBankSelector } from '../../../store/selectors';


function pad(num: number, size: number) {
    var numstr = num.toString();
    while (numstr.length < size) {
        numstr = "0" + numstr;
    }
    return numstr;
}


function TimeBankDisplay(props: any) {
    const timeBank = useSelector(timeBankSelector);
    const gameInstanceState = useSelector(gameInstanceStateSelector);
    const position = useSelector(positionSelector);
    const dispatch = useDispatch();

    function getTextLabel(millis: number) {
        const millisRounded = Math.round(millis / 1000) * 1000;
        const minutes = Math.floor(millisRounded / 60000);
        const seconds = Math.floor((millisRounded % 60000) / 1000) % 60;
        return `${minutes}:${pad(seconds, 2)}`;
    }

    useEffect(() => {
        const action: ReduxAction = { type: ReduxActionType.TIMER_TICK };
        console.log("timeBank: ", timeBank.white, timeBank.black);
        if (gameInstanceState === GameInstanceState.IN_PLAY) {
            const interval = setInterval(() => dispatch(action), 1000);
            return () => clearInterval(interval);
        }
    }, [gameInstanceState, dispatch]);


    return <div className="time-banks-container">
        <div className={`time-bank time-bank-white ${ position.whites_turn ? 'time-bank-active' : '' } `}>
            {getTextLabel(timeBank.white)}
        </div>
        <div className={`time-bank time-bank-black ${ !position.whites_turn ? 'time-bank-active' : '' } `}>
            {getTextLabel(timeBank.black)}
        </div>
    </div>
}

export default TimeBankDisplay;