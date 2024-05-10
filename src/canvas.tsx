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
      x: number,
      y: number
    }[][] = []

    function getRandomInt(max: any) {
      const int = Math.floor((Math.random() * max) - 0.60)
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
  
    const numberOfBombs = (i: number, j: number, array: any) => {
      let number: number = 0
      const numRows = array.length
      const numCols = array[0].length
  
      const isValidIndex = (x: number, y: number) => {
        return x >= 0 && x < numRows && y >= 0 && y < numCols
      };
  
      const isFlagged = (x: number, y: number) => {
        return isValidIndex(x, y) && array[x][y].flag
      };
  
      if (isFlagged(i - 1, j - 1)) { number++ }
      if (isFlagged(i - 1, j)) { number++ }
      if (isFlagged(i, j - 1)) { number++ }
      if (isFlagged(i + 1, j - 1)) { number++ }
      if (isFlagged(i - 1, j + 1)) { number++ }
      if (isFlagged(i + 1, j + 1)) { number++ }
      if (isFlagged(i + 1, j)) { number++ }
      if (isFlagged(i, j + 1)) { number++ }
  
      return number
    }

    const flag = (array: any) => {
      const event = window.event as MouseEvent
      const x = Math.floor(event.clientX / size)
      const y = Math.floor(event.clientY / size)

      if (array[y][x].flag === false) {
        array[y][x].flag = true
        array[y][x].field = false
      } else {
        array[y][x].flag = false
        array[y][x].field = true
      }
    }

    const paint = (array: any) => {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (array[i][j].flag === true) {
            ctx.fillStyle = 'black'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
          } else {
            const number = numberOfBombs(i, j, array)
            ctx.fillStyle = 'white'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0) {
              ctx.fillText(`${number}`, array[i][j].x * size + (size / 3), array[i][j].y * size + size / 1.5, size / 2)
            }
          }
        }
      }
    }

    window.addEventListener('mousedown', function start() {
      flag(cells)
      paint(cells)
    })

  }, [])
  return  <canvas ref = { canvasRef }/>
}

export default Canvas