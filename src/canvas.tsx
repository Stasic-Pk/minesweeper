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

    let gameOver: boolean = false
    const size = 32
    const fontSize = size / 2
    const width = 16
    const height = 16
    const borderSize = (width + height) / 4

    const centerX = Math.floor(window.innerWidth / 2 - (width * size) / 2)
    const centerY = Math.floor(window.innerHeight / 2 - (height * size) / 2)

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const cells: {
      mine: boolean,
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
      const x = Math.floor((event.clientX - centerX) / size)
      const y = Math.floor((event.clientY - centerY) / size)

      if (x >= 0 && x < array.length && y >= 0 && y < array[0].length) {
        if (!array[y][x].flag && !array[y][x].open) {
          array[y][x].flag = true
        } else {
          array[y][x].flag = false
        }
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
        if (isValidIndex(x, y) && !array[x][y].open) {
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

      if (array[i][j].flag) {
        array[i][j].flag = false
      }
    }
    
    const openField = (array: any) => {
      if (gameOver === true) return

      const event = window.event as MouseEvent
      const x = Math.floor((event.clientX - centerX) / size)
      const y = Math.floor((event.clientY - centerY) / size)

      if (x >= 0 && x < array.length && y >= 0 && y < array[0].length) {
        const cell = array[y][x]

        if (!cell.mine && !cell.flag) {
          array[y][x].open = true
          chainOpen(y, x, array)
        } else if(cell.mine && !cell.flag) {
          gameOver = true
          console.log("you explose!")

          ctx.fillStyle = 'rgba(255, 85, 85, 0.40)'
          ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
          ctx.fillStyle = 'black'
          ctx.font = `${size * 2}px open-sans`
          ctx.fillText("you explose!", window.innerWidth / 2 - size * 5, window.innerHeight / 2)
        }
      }
    }

    const paint = (array: any) => {
      ctx.fillStyle = "white"
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.fillStyle = '#BC6518'
      ctx.fillRect(centerX - borderSize, centerY - borderSize, size * array.length + borderSize * 2, size * array[0].length + borderSize * 2)
      
      let mineCount: number = 0
      let flagCount: number = 0
      
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (array[i][j].mine) {
            mineCount++
          }
          if (array[i][j].flag) {
            flagCount++
          }


          // flag
          if(array[i][j].flag && (i + j) % 2 === 0) {
            ctx.fillStyle = '#EA3A1B'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size)
          } else if(array[i][j].flag && (i + j) % 2 !== 0) {
            ctx.fillStyle = '#e82e20'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size) 
          } 
          // not open
          else if((i + j) % 2 === 0 && !array[i][j].open) {
            ctx.fillStyle = '#A5DC53'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size)
          } else if((i + j) % 2 !== 0 && !array[i][j].open){
            ctx.fillStyle = '#9DD64C'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size)
          } 
          // open
          else if((i + j) % 2 === 0 && array[i][j].open) {
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#E1C4A0'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && !array[i][j].mine && array[i][j].open) {
              ctx.fillText(`${number}`, centerX + (array[i][j].x * size + (size / 3)), centerY + (array[i][j].y * size + size / 1.5), size / 2)
            }
          } else if((i + j) % 2 !== 0 && array[i][j].open){
            const number = numberOfMine(i, j, array)
            ctx.fillStyle = '#D3BA9A'
            ctx.fillRect(centerX + array[i][j].x * size, centerY + array[i][j].y * size, size, size)
            ctx.fillStyle = 'black'
            ctx.font = `${fontSize}px open-sans`
            if (number !== 0 && !array[i][j].mine && array[i][j].open) {
              ctx.fillText(`${number}`, centerX + (array[i][j].x * size + (size / 3)), centerY + (array[i][j].y * size + size / 1.5), size / 2)
            }
          } 
        }
      }

      ctx.fillStyle = 'black'
      ctx.font = `${fontSize}px open-sans`
      ctx.fillText(`${mineCount - flagCount}`, size, size)
    }
    
    const win = ((array: any[][]) => {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if(!array[i][j].open && !array[i][j].mine) {
            return
          }
        }
      }
      ctx.fillStyle = 'black'
      ctx.font = `${size * 2}px open-sans`
      ctx.fillText("you win!", window.innerWidth / 2 - size * 3.5, window.innerHeight / 2)
    })

    paint(cells)

    const handleMouseDown = (() => {
      const event = window.event as MouseEvent
      if (event.button === 0) {
        openField(cells)
      } else if(event.button === 2) {
        flagField(cells)
      }
      if (!gameOver) paint(cells)
      win(cells)
    })

    canvas.addEventListener('mousedown', handleMouseDown);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
    }

  }, [])
  return  <canvas ref = { canvasRef }/>
}

export default Canvas