import logo from './logo.svg';
import './App.css';
import { useEffect, useMemo, useState } from 'react';

function App() {
  return (
    <div className="App">
      <Arena />
    </div>
  );
}

const Arena = () => {
  const [cellAmount, setCellAmount] = useState(5)
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

  //Move into move function later
  useEffect(() => {
    activeCells.map((item, idx) => {
      let cell = document.getElementById(`x${item[0]}y${item[1]}`);
      //handle body movement
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
    if (head.classList.contains("food")){
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
      <input id="cell-numers-temp"type="number" onChange={ e => e.target.value > 0 ? setCellAmount(e.target.value) :null} />
      <div className="grid" style={gridStyle}>
        {cellArray.map(item => {
          return(
            <div key={`x${item[0]}y${item[1]}`} id={`x${item[0]}y${item[1]}`} className="cell empty"></div>
          )
        })}
      </div>
      <Controls
      activeCells = {activeCells}
      setActiveCells = {setActiveCells}
      ateFood = {ateFood}
      setAteFood = {setAteFood}
      />
    </div>
  )
}

const Controls = (props) =>{
  
  const handleClick = (e) => {
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
    switch(e.target.id){
      case "up":
        head[0] -=1;
        break;
      case "down":
        head[0] +=1;
        break;
      case "right":
        head[1] +=1;
        break;
      case "left":
        head[1] -=1;
        break;
    }
    props.setActiveCells([head, ...newArr])
  }

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
      <button id="up" onClick={handleClick}>up</button>
      <button id="right" onClick={handleClick}>right</button>
      <button id="down" onClick={handleClick}>down</button>
      <button id="left" onClick={handleClick}>left</button>
    </div>
  )
}
export default App;
