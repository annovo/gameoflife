class GameOfLife {
   color: string = '#3498db'
   cells: boolean[][]
   delay: number = 1000
   start: boolean = false
   isReset: boolean = false
   constructor(
      public m: number = 30,
      public n: number = 30
   ) {
      this.cells = [];
      for(let i = 0; i < m; i++) {
         if(!this.cells[i])
            this.cells[i] = []
         for(let j = 0; j < n; j++) {
            this.cells[i][j] = false
         }
      }
   }

   createField(): void {
      this.addEventListeners()

      const container: HTMLElement = document.getElementById('container')
      for(let i = 0; i < this.m; i++) {
         for(let j = 0; j < this.n; j++) {
            const square: HTMLElement = document?.createElement('div')
            square.classList.add('square')
            square.setAttribute('id', `square-${i}-${j}`)
        
            square.addEventListener('click', (e) => { 
               if(this.start || e.defaultPrevented)
                   return

               if(this.cells[i][j]) {
                  this.removeColor(square)
               } 
               this.isReset = false
               this.cells[i][j] = !this.cells[i][j]

               e.preventDefault()
            })
            
            square.addEventListener('mouseover', (e) => {
               if(this.start || this.cells[i][j])
                  return 
               this.setColor(square) 
            })
            square.addEventListener('mouseout', (e) =>  {
               if(this.start || this.cells[i][j])
                  return 
               this.removeColor(square) 
            })

            container.appendChild(square)
         }       
      }

      let y = Math.floor(this.cells.length / 2)
      let x = Math.floor(this.cells[0].length / 2)
      this.initPattern(x, y)
      this.initPattern(x - 3, y - 3)
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
      const count = [];
      for(let i = 0; i < this.cells.length; i++) {
         count[i] = []
         for(let j = 0; j < this.cells[i].length; j++) {
            count[i][j] = 0
         }
      }

      this.cells.forEach((row, i) => row.forEach((el, j) => {
         if(el)
            this.findNeibhours(count, i, j, this.cells.length - 1, this.cells[j].length - 1)
      }))

      count.forEach((row, i) => row.forEach((element: number, j: number) => {
         if(element < 2 || element > 3)
            this.cells[i][j] = false
         else if(!this.cells[i][j] && element === 3)
            this.cells[i][j] = true   
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

   draw() {
      this.cells.forEach((row, i) => row.forEach((el, j) => {
         const square: HTMLElement = document?.getElementById(`square-${i}-${j}`)
         if(el)
            this.setColor(square)
         else
            this.removeColor(square)
      }))
   }

   reset(): void {
      this.start = false
      if(!this.isReset) {
         this.isReset = true
         this.cells.forEach((row,i) => row.forEach((el,j) => { 
            this.cells[i][j] = false
            this.removeColor(document?.getElementById(`square-${i}-${j}`))
         }));
      }
   }

   initPattern(x: number, y: number): void {
      for(let i = y; i < y + 3; i++) {
         for(let j = x; j < x + 3; j++) {
            this.cells[i][j] = true;
            this.setColor(document?.getElementById(`square-${i}-${j}`))
         }
      }
   }

   addEventListeners(): void {
      document?.addEventListener('keydown', (e: KeyboardEvent) => {
         if(e.defaultPrevented)
            return
         if(e.code === 'Enter') {
            this.start = !this.start
         } else if(e.code === 'Escape') 
            this.reset()
         
         e.preventDefault
      })

      const startBtn: HTMLElement = document?.getElementById('start')
      startBtn.addEventListener('click', (e) => {
         if(e.defaultPrevented)
            return
         this.start = !this.start
         startBtn.textContent = this.start ? 'Stop' : 'Start'
         e.preventDefault()
      })

      document?.getElementById('reset').addEventListener('click', (e) => {
         if(e.defaultPrevented)
            return
         this.reset()
         e.preventDefault()
      })
   }
}

const game = new GameOfLife()
game.createField()
game.play.bind(game)()

