import React, {useState, useRef, useEffect} from "react";
import ReactDOM from "react-dom";
import {useSpring, interpolate, animated} from "react-spring";
import {shuffle} from "lodash";


const width = 200;
const height = 200;
const centerX = width / 2;
const centerY = height / 2;

const numbers = new Array(12).fill(0).map((v, i) => i);

const getRandomData = () =>
    shuffle(numbers).map((n, i) => ({
        angle: i * 30,
        number: n
    }));


const renderNumber = ({angle, number}) => {
    const nbrValue = number === 0 ? 12 : number;
    const hasTwoNumbers = nbrValue > 9;
    return <g
        key={`nbr-${number}`}
        style={{transformOrigin: 'center'}}
        transform={` rotate(${angle})`}
    >
        <rect
            x={centerX - 10}
            y={0}
            width={20}
            height={50}
            fill="#7D4735"
        />
        <text
            x={centerX - 10 + (hasTwoNumbers ? 1 : 6)}
            y={20}
            textLength={18}
            fill="#D89840"
        >{nbrValue}</text>

        <line
            x1={centerX}
            y1={50}
            x2={centerX}
            y2={centerY}
            stroke="#2C1F1A"
        />
    </g>
};

const renderHands = ({minute, hour}, numberData) => {

    const hourNumber = numberData.find(d => d.number === hour);
    const hourNext = numberData.find(d => d.number === ((hour + 1) % 12));
    const diff = ((hourNext.angle - hourNumber.angle) + 360) % 360;
    const hourAngle = hourNumber.angle + diff * (minute / 60.0);

    const minuteHourNumber = Math.floor(minute / 5);
    const minuteNumber = numberData.find(d => d.number === minuteHourNumber);
    const minuteNext = numberData.find(d => d.number === (minuteNumber.number + 1) % 12);

    const minuteDiff = ((minuteNext.angle - minuteNumber.angle) + 360) % 360;
    const minuteAngle = (minuteNumber.angle + minuteDiff * ((minute % 5) / 5.0)) % 360;

    return <>

        <g
            style={{transformOrigin: 'center'}}
            transform={` rotate(${hourAngle})`}>
            <line
                x1={centerX}
                y1={40}
                x2={centerX}
                y2={centerY}
                stroke="#B36D41"
            />
        </g>


        <g
            style={{transformOrigin: 'center'}}
            transform={` rotate(${minuteAngle})`}>
            <line
                x1={centerX}
                y1={20}
                x2={centerX}
                y2={centerY}
                stroke="#B36D41"
            />
        </g>
    </>
};

function App() {

    const [numberData, setNumberData] = useState(getRandomData());
    const [time, setTime] = useState({minute: 31, hour: 6});

    useEffect(() => {
        let id = setInterval(() => {
            const nextMinute = time.minute + 1;
            const nextHour = nextMinute === 60 ? time.hour + 1 : time.hour;
            const updatedTime = {
                minute: nextMinute % 60,
                hour: nextHour % 12
            };
            setTime(updatedTime)
        }, 250);
        return () => clearInterval(id);
    }, [time]);


    return (
        <div className="App">
            <h1>Clock</h1>
            <div>{time.hour < 10 ? '0' + time.hour : time.hour}:{time.minute < 10 ? '0' + time.minute : time.minute}</div>
            <svg
                width="600"
                height="600"
                viewBox="0 0 200 200"
                onClick={() => setNumberData(getRandomData())}
            >
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={width / 2}
                    opacity={0.2}
                />

                {numberData.map(renderNumber)}

                <circle
                    cx={centerX}
                    cy={centerY}
                    r={10}
                    fill="#D89840"
                />

                {renderHands(time, numberData)}


                <circle
                    cx={centerX}
                    cy={centerY}
                    r={3}
                    fill="#7D4735"
                />

            </svg>

        </div>
    );
}

export default App;
