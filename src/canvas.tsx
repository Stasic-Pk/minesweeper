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
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const size = 20
    const width = window.innerWidth / size
    const height = window.innerHeight / size

    const cells: {
      mine: number,
      number: number,
      x: number,
      y: number
    }[][] = []

    for(let i = 0; i < height; i++) {
      cells[i] = []
      for(let j = 0; j < width; j++) {
        cells[i][j] = {
          mine: 0,
          number: 1,
          x: j,
          y: i
        }
      }
    }

    const flag = (array: any) => {
      const event = window.event as MouseEvent
      const x = Math.floor(event.clientX / size)
      const y = Math.floor(event.clientY / size)

      if (array[y][x].mine == 0) {
        array[y][x].mine = 1
        array[y][x].number = 0
      } else {
        array[y][x].mine = 0
        array[y][x].number = 1
      }
    }

    const paint = (array: any) => {
      for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
          if (array[i][j].mine == 1) {
            ctx.fillStyle = 'black'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
          } else {
            ctx.fillStyle = 'white'
            ctx.fillRect(array[i][j].x * size, array[i][j].y * size, size, size)
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