import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [title, setTitle] = useState("let's play");
  const [classTitle, setClassTitle] = useState("");

  const [submit, setSubmit] = useState("play");
  const [time, setTime] = useState(0);
  const [number, setNumber] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [numberArr, setNumberArr] = useState([]);
  const [clickedCount, setClickedCount] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (title === "all cleared") {
      setClassTitle("game-win");
    } else if (title === "game over") {
      setClassTitle("game-over");
    } else {
      setClassTitle("");
    }
  }, [title]);

  function playGameHandler() {
    if (inputValue > 0) {
      const newNumberArr = [];
      for (let i = 1; i <= Number(inputValue); i++) {
        const positionX = Math.round(Math.random() * 93);
        const positionY = Math.round(Math.random() * 91);

        const numberObj = {
          num: i,
          x: positionX,
          y: positionY,
          isActive: false,
          isVisible: true,
        };
        newNumberArr.unshift(numberObj);
      }
      setSubmit("restart");
      setNumberArr(newNumberArr);
      setNumber(1); // Đặt lại số để bắt đầu trò chơi mới
      setTitle("let's play"); // Reset tiêu đề
      setClickedCount(0);
      setTime(0);

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 0.1);
      }, 100);
    } else {
      setTime(0);
    }
  }

  function activeHandler(index) {
    const updateNumberArr = [...numberArr];
    const clickedNumber = updateNumberArr[index];

    if (clickedNumber.isVisible) {
      // Kiểm tra nếu bong bóng còn hiển thị
      clickedNumber.isActive = true;
      setNumberArr(updateNumberArr);

      if (clickedNumber.num === number) {
        setNumber((prevNumber) => prevNumber + 1);
        setClickedCount((prevCount) => prevCount + 1);

        setTimeout(() => {
          const removeNumberArr = [...updateNumberArr];
          removeNumberArr[index].isVisible = false; // Ẩn bong bóng
          setNumberArr(removeNumberArr);

          if (clickedCount + 1 === numberArr.length) {
            setTitle("all cleared");
            if (intervalRef.current) {
              clearInterval(intervalRef.current); // Dừng đồng hồ khi thắng
            }
          }
        }, 1500);
      } else {
        setTitle("game over");
        if (intervalRef.current) {
          clearInterval(intervalRef.current); // Dừng đồng hồ khi thua
        }
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h3 className={`title ${classTitle}`}>{title}</h3>
        <div className="input-container">
          <label htmlFor="point">Points:</label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="time-display">
          <span className="time-label">Time:</span>
          <span>{time.toFixed(1)}s</span>
        </div>
        <div className="actions">
          <button onClick={playGameHandler}>{submit}</button>
        </div>
      </div>

      <div className="content">
        {numberArr.map(
          (item, index) =>
            item.isVisible && ( // Kiểm tra nếu bong bóng còn hiển thị
              <button
                key={index}
                className={`number-item ${item.isActive ? "active" : ""}`}
                style={{
                  position: "absolute",
                  left: item.x + "%",
                  top: item.y + "%",
                }}
                onClick={() => activeHandler(index)}
              >
                {item.num}
              </button>
            ),
        )}
      </div>
    </div>
  );
}

export default App;
