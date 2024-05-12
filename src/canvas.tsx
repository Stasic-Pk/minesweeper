import { useEffect, useRef } from "react"

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if(!canvas) {
      return
    }
    const ctx = canvas.getContext("2d")
    if(!ctx) {
      return
    }
    
    document.oncontextmenu = function() {
      return false;
    }

    // minesweeper

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const size = 32
    const fontSize = size / 2
    const width = window.innerWidth / size
    const height = window.innerHeight / size

    const cells: {
      mine: boolean,
      field: boolean,
      flag: boolean,
      open: boolean,
      x: number,
      y: number
    }[][] = []

    function getRandomInt(max: any) {
      const int = Math.floor((Math.random() * max) - 0.70)
      if (int <= 0) {
        return false
      } else {
        return true
      }
    }

    for(let i = 0; i < height; i++) {
      cells[i] = []
      for(let j = 0; j < width; j++) {
        cells[i][j] = {
          mine: false,
          field: true,
          flag: false,
          open: false,
          x: j,
          y: i
        }
      }
    }

    for(let i = 0; i < height; i++) {
      for(let j = 0; j < width; j++) {
        cells[i][j].mine = getRandomInt(2)
        if(cells[i][j].mine === true) {
          cells[i][j].field = false
        }
      }
    }
  
    const numberOfMine = (i: number, j: number, array: any) => {
      let number: number = 0
      const numRows = array.length
      const numCols = array[0].length
  
      const isValidIndex = (x: number, y: number) => {
        return x >= 0 && x < numRows && y >= 0 && y < numCols
      };
  
      const isMined = (x: number, y: number) => {
        return isValidIndex(x, y) && array[x][y].mine
      };
  
      if (isMined(i - 1, j - 1)) { number++ }
      if (isMined(i - 1, j)) { number++ }
      if (isMined(i, j - 1)) { number++ }
      if (isMined(i + 1, j - 1)) { number++ }
      if (isMined(i - 1, j + 1)) { number++ }
      if (isMined(i + 1, j + 1)) { number++ }
      if (isMined(i + 1, j)) { number++ }
      if (isMined(i, j + 1)) { number++ }
  
      return number
    }

    const flagField = (array: any) => {
      const event = window.event as MouseEvent
      const x = Math.floor(event.clientX / size)
      const y = Math.floor(event.clientY / size)

      if (array[y][x].flag === false && array[y][x].open === false) {
        array[y][x].flag = true
      } else {
        array[y][x].flag = false
      }
    }

    const chainOpen = (i: number, j: number, array: any) => {
      const number = numberOfMine(i, j, array)

      const numRows = array.length
      const numCols = array[0].length

      const isValidIndex = (x: number, y: number) => {
        return x >= 0 && x < numRows && y >= 0 && y < numCols
      }
      const isOpen = (x: number, y: number) => {
        if (isValidIndex(x, y) && array[x][y].open !== true) {
          return true
        }
      }

      if (number === 0) {
        if (isOpen(i - 1, j - 1)) { array[i - 1][j - 1].open = true; chainOpen(i - 1, j - 1, array) }
        if (isOpen(i - 1, j)) { array[i - 1][j].open = true; chainOpen(i - 1, j, array) }
        if (isOpen(i, j - 1)) { array[i][j - 1].open = true; chainOpen(i, j - 1, array) }
        if (isOpen(i + 1, j - 1)) { array[i + 1][j - 1].open = true; chainOpen(i + 1, j - 1, array) }
        if (isOpen(i - 1, j + 1)) { array[i - 1][j + 1].open = true; chainOpen(i - 1, j + 1, array) }
        if (isOpen(i + 1, j + 1)) { array[i + 1][j + 1].open = true; chainOpen(i + 1, j + 1, array) }
        if (isOpen(i + 1, j)) { array[i + 1][j].open = true; chainOpen(i + 1, j, array) }
        if (isOpen(i, j + 1)) { array[i][j + 1].open = true; chainOpen(i, j + 1, array) }
      }
    }

    const openField = (array: any) => {
      const event = window.event as MouseEvent
      const x = Math.floor(event.clientX / size)
      const y = Math.floor(event.clientY / size)

      if (array[y][x].mine === false) {
        array[y][x].open = true
        chainOpen(y, x, array)
      } else if(array[y][x].flag === false) {
        console.log("you loose")
      }
    }

    const paint = (array: any) => {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          // flag
          if(array[i][j].flag === true && (i + j) % 2 === 0) {
            ctx.fillStyle = '#EA3A1B'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
          } else if(array[i][j].flag === true && (i + j) % 2 !== 0) {
            ctx.fillStyle = '#e82e20'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size) 
          } 
          // open
          else if((i + j) % 2 === 0 && array[i][j].open === false) {
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#A5DC53'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && array[i][j].mine === false && array[i][j].open === true) {
              ctx.fillText(`${number}`, array[i][j].x * size + (size / 3), array[i][j].y * size + size / 1.5, size / 2)
            }
          } else if((i + j) % 2 !== 0 && array[i][j].open === false){
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#9DD64C'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && array[i][j].mine === false && array[i][j].open === true) {
              ctx.fillText(`${number}`, array[i][j].x * size + (size / 3), array[i][j].y * size + size / 1.5, size / 2)
            }
          } 
          // not open
          else if((i + j) % 2 === 0 && array[i][j].open === true) {
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#E1C4A0'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && array[i][j].mine === false && array[i][j].open === true) {
              ctx.fillText(`${number}`, array[i][j].x * size + (size / 3), array[i][j].y * size + size / 1.5, size / 2)
            }
          } else if((i + j) % 2 !== 0 && array[i][j].open === true){
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#D3BA9A'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && array[i][j].mine === false && array[i][j].open === true) {
              ctx.fillText(`${number}`, array[i][j].x * size + (size / 3), array[i][j].y * size + size / 1.5, size / 2)
            }
          } 
        }
      }
    }

    paint(cells)

    window.addEventListener('mousedown', function start() {
      const event = window.event as MouseEvent
      if (event.button === 0) {
        openField(cells)
      } else if(event.button === 2) {
        flagField(cells)
      }
      paint(cells)
    })

  }, [])
  return  <canvas ref = { canvasRef }/>
}

export default Canvas