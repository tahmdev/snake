import logo from './logo.svg';
import './App.css';
import { useEffect, useMemo, useState } from 'react';
import 'font-awesome/css/font-awesome.min.css';


let intervalId = null

function App() {
  const [timer, setTimer] = useState(0)
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(() => {  
    let newTimer = timer +1
    setTimer(newTimer)
  }, 140);
    
  return (
    <div className="App">
      <Arena timer={timer}/>
    </div>
  );
}

const Arena = (props) => {
  const [cellAmount, setCellAmount] = useState(10)
  const [cellArray, setCellArray] = useState([])
  const [activeCells, setActiveCells] = useState([[2,3]])
  const [foodCell, setFoodCell] = useState([0,0])
  const [ateFood, setAteFood] = useState(false)
  useMemo(() => {
    let newParentArr = "";
    let newChildArr = "";
    for (let x = 0; x <= cellAmount; x++){
      newParentArr = [...newParentArr, ...newChildArr, ]
      newChildArr = ""
      for (let y = 0; y < cellAmount; y++){
        newChildArr = [...newChildArr, [x, y]]
    }
    }
    setCellArray(newParentArr)
  }, [cellAmount])

  const gridStyle = {
    gridTemplateColumns: `repeat(${cellAmount}, auto)`,
    gridTemplateRows: `repeat(${cellAmount}, auto)`,
  }

  //Display movement & handle collision
  useEffect(() => {
    activeCells.map((item, idx) => {
      let cell = document.getElementById(`x${item[0]}y${item[1]}`);
      //handle body movement
      if (!cell){
        console.log("ded")
        resetGame();
      }
      if (cell && idx !== 0) {
        cell.classList.add("active")
        cell.classList.remove("empty")
        cell.classList.remove("head")
      }
      //handle head movement
      if (cell && idx === 0) {
        cell.classList.add("head")
        cell.classList.remove("empty")
        //detect head to body collision 
        if (cell.classList.contains("head") && cell.classList.contains("active")){
          resetGame();
        }
      } 
    })
    let head = document.getElementById(`x${activeCells[0][0]}y${activeCells[0][1]}`);
    
    //detect food collision
    if (head && head.classList.contains("food")){
      head.classList.remove("food")
      setAteFood(true)
      let emptyCells = document.getElementsByClassName("empty")
      const randomNumber = Math.floor(Math.random() * emptyCells.length)
      emptyCells[randomNumber].classList.add("food")
    }
  }, [activeCells])
  
  // set food cells
  useEffect(() => {
      let cell = document.getElementById(`x${foodCell[0]}y${foodCell[1]}`);
      if (cell) cell.classList.add("food")
  }, [foodCell])

  const resetGame =()=> {
    const randomNumber = Math.floor(Math.random() * cellArray.length)
    let allCells = document.getElementsByClassName("cell")
    setActiveCells(() => {
      for (let i=0; i <allCells.length; i++){
        allCells[i].classList.remove("active")
      }
      return [cellArray[randomNumber]]
    })
    
  }
  return(
    <div className="arena-wrapper">
      <div className="grid-wrapper">
        <div className="grid" style={gridStyle}>
          {cellArray.map(item => {
            return(
              <div key={`x${item[0]}y${item[1]}`} id={`x${item[0]}y${item[1]}`} className="cell empty"></div>
            )
          })}
        </div>
      </div>
      <Controls
      activeCells = {activeCells}
      setActiveCells = {setActiveCells}
      ateFood = {ateFood}
      setAteFood = {setAteFood}
      timer = {props.timer}
      setCellAmount = {setCellAmount}
      cellAmount = {cellAmount}
      />
    </div>
  )
}



const Controls = (props) =>{
  let [direction, setDirection] = useState("a")
  //prevents going backwards
  let [lastDirection, setlastDirection] = useState("")


  const move = () => {
    let newArr = [...props.activeCells]
    if(props.ateFood){
      props.setAteFood(false)
    }else{
      let tail = newArr.pop()
      document.getElementById(`x${tail[0]}y${tail[1]}`).classList.remove("head")
      document.getElementById(`x${tail[0]}y${tail[1]}`).classList.remove("active")
      document.getElementById(`x${tail[0]}y${tail[1]}`).classList.add("empty")
    }
    let head = [...props.activeCells[0]]
    switch(direction){
      case "up":
        head[0] -=1;
        setlastDirection("up")
        break;
      case "down":
        head[0] +=1;
        setlastDirection("down")
        break;
      case "right":
        head[1] +=1;
        setlastDirection("right")
        break;
      case "left":
        head[1] -=1;
        setlastDirection("left")
        break;
      default:
        break;
    }
    props.setActiveCells([head, ...newArr])
  }
  useEffect(() => {
    move();
  }, [props.timer])
    
  const handleClick = (e) => {
    if (e.target.id === "up" && lastDirection !== "down"){
      setDirection("up")
    }
    if (e.target.id === "right" && lastDirection !== "left") {
      setDirection("right")
    }
    if (e.target.id === "down" && lastDirection !== "up"){ 
      setDirection("down")
    }
    if (e.target.id === "left" && lastDirection !== "right"){ 
      setDirection("left")
    }
  }

  //keyboard functionality
  useEffect(() => {
    const handleKey = (e) => {
      if(e.key === "w" || e.key === "ArrowUp") document.getElementById("up").click();
      if(e.key === "d" || e.key === "ArrowRight") document.getElementById("right").click();
      if(e.key === "s" || e.key === "ArrowDown") document.getElementById("down").click();
      if(e.key === "a" || e.key === "ArrowLeft") document.getElementById("left").click();
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey) 
  }, [])

  return(
    <div className='controlls-wrapper'>
      <input id="cell-numbers"type="number" onChange={ e => e.target.value > 0 ? props.setCellAmount(e.target.value) :null} value={props.cellAmount}/>

      <button id="up" onClick={handleClick} style={direction === "up" ? {backgroundColor: "rgba(141, 141, 141, 0.8)"} : null}>up</button>
      <button id="right" onClick={handleClick} style={direction === "right" ? {backgroundColor: "rgba(141, 141, 141, 0.8)"} : null}>right</button>
      <button id="down" onClick={handleClick} style={direction === "down" ? {backgroundColor: "rgba(141, 141, 141, 0.8)"} : null}>down</button>
      <button id="left" onClick={handleClick} style={direction === "left" ? {backgroundColor: "rgba(141, 141, 141, 0.8)"} : null}>left</button>
    </div>
  )
}
export default App;
