interface Cell {
   isAlive: boolean,
   element: HTMLElement | null
}

class GameOfLife {
   color: string = '#3498db'
   cells: Cell[][]
   delay: number = 500
   start: boolean = false
   isReset: boolean = false
   isHold: boolean = false
   constructor(
      public m: number = 30,
      public n: number = 30
   ) {
      this.cells = [];
      for(let i = 0; i < m; i++) {
         if(!this.cells[i])
            this.cells[i] = []
         for(let j = 0; j < n; j++) {
            this.cells[i][j] = {isAlive: false, element: null} 
         }
      }
   }

   createField(): void {
      this.addEventListeners()

      const container: HTMLElement = document?.getElementById('container')
      for(let i = 0; i < this.m; i++) {
         for(let j = 0; j < this.n; j++) {
            const square: HTMLElement = document?.createElement('div')
            square.classList.add('square')
            square.setAttribute('id', `square-${i}-${j}`)

            square.addEventListener('click', () => { 
               if(this.start)
                   return

               if(this.cells[i][j].isAlive) {
                  this.removeColor(square)
               } 
               this.isReset = false
               this.cells[i][j].isAlive = !this.cells[i][j].isAlive
            })
            
            square.addEventListener('mouseover', (e) => this.handleChange(e, i, j))
            square.addEventListener('mouseout', (e) =>  this.handleChange(e, i, j))

            this.cells[i][j].element = square;
            container.appendChild(square)
         }       
      }

      let y = Math.floor(this.cells.length / 2)
      let x = Math.floor(this.cells[0].length / 2)
      this.initPattern(x, y)
      this.initPattern(x - 3, y - 3)
   }

   handleChange(e: Event, i: number, j: number): void {
      if(this.start)
         return 
      switch(e.type) {
         case 'mouseover':
            if(this.isHold && this.cells[i][j].isAlive) this.removeColor(this.cells[i][j].element)
            else if(!this.cells[i][j].isAlive) this.setColor(this.cells[i][j].element)
            if(this.isHold) {
               this.cells[i][j].isAlive = !this.cells[i][j].isAlive
               this.isReset = false
            }      
            break
         case 'mouseout':
            if(!this.isHold && !this.cells[i][j].isAlive) this.removeColor(this.cells[i][j].element)
            break
         default:
            break
      }  
   }

   setColor(element: HTMLElement): void {
      element.style.background = `${this.color}`
      element.style.boxShadow = `0 0 2px ${this.color}, 0 0 10px ${this.color}`
   }

   removeColor(element: HTMLElement): void {
      element.style.background = '#1d1d1d'
      element.style.boxShadow = '0 0 2px #000'    
      
   }

   play(): void {
      setInterval(() => {
         if(this.start)
            this.applyRules()
      }
      , this.delay)    
   }

   applyRules(): void {
      const count: number[][] = [];

      for(let i = 0; i < this.cells.length; i++) {
         count[i] = []
         for(let j = 0; j < this.cells[i].length; j++) {
            count[i][j] = 0
         }
      }

      this.cells.forEach((row: Cell[], i: number) => row.forEach((cell: Cell, j: number) => {
         if(cell.isAlive)
            this.findNeibhours(count, i, j, this.cells.length - 1, this.cells[j].length - 1)
      }))

      count.forEach((row: number[], i: number) => row.forEach((element: number, j: number) => {
         if(element < 2 || element > 3)
            this.cells[i][j].isAlive = false
         else if(!this.cells[i][j].isAlive && element === 3)
            this.cells[i][j].isAlive = true   
      }))

      this.draw()
   }

   findNeibhours(count: number[][], i: number, j: number, maxI: number, maxJ: number): void {
      if(i > 0)
         count[i - 1][j] = count[i - 1][j] ? count[i - 1][j] + 1 : 1
      if(j > 0)
         count[i][j - 1] = count[i][j - 1] ? count[i][j - 1] + 1 : 1
      if(i > 0 && j > 0)
         count[i - 1][j - 1] = count[i - 1][j - 1] ? count[i - 1][j - 1] + 1 : 1
      if(i < maxI)
         count[i + 1][j] = count[i + 1][j] ? count[i + 1][j] + 1 : 1
      if(j < maxJ)
         count[i][j + 1] = count[i][j + 1] ? count[i][j + 1] + 1 : 1
      if(j < maxJ && i < maxI)
         count[i + 1][j + 1] = count[i + 1][j + 1] ? count[i + 1][j + 1] + 1 : 1
      if(i > 0 && j < maxJ)
         count[i - 1][j + 1] = count[i - 1][j + 1] ? count[i - 1][j + 1] + 1 : 1
      if(j > 0 && i < maxI)
         count[i + 1][j - 1] = count[i + 1][j - 1] ? count[i + 1][j - 1] + 1 : 1
   }

   draw(): void {
      this.cells.forEach((row: Cell[], i: number) => row.forEach((cell: Cell, j: number) => {
         if(cell.isAlive)
            this.setColor(cell.element)
         else
            this.removeColor(cell.element)
      }))
   }

   reset(): void {
      this.start = false
      if(!this.isReset) {
         this.isReset = true
         this.cells.forEach((row: Cell[], i: number) => row.forEach((cell: Cell, j: number) => { 
            this.cells[i][j].isAlive = false
            this.removeColor(this.cells[i][j].element)
         }));
      }
   }

   initPattern(x: number, y: number): void {
      for(let i = y; i < y + 3; i++) {
         for(let j = x; j < x + 3; j++) {
            this.cells[i][j].isAlive = true;
            this.setColor(this.cells[i][j].element)
         }
      }
   }

   addEventListeners(): void {
      document.addEventListener('mousedown', () => { this.isHold = true })
      document.addEventListener('mouseup', () => { this.isHold = false })

      const startBtn: HTMLElement = document.getElementById('start')

      startBtn.addEventListener('click', () => {
         this.start = !this.start
         startBtn.textContent = this.start ? 'Stop' : 'Start'
      })

      document.getElementById('reset').addEventListener('click', () => {
         this.reset()
         document.getElementById('start').textContent= 'Start'
      })
   }
}

const game = new GameOfLife()
game.createField()
game.play.bind(game)()

