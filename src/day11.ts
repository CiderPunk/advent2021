import { readFile, writeFile } from "fs/promises"
import { compassRose } from "./coord"
import { coord } from "./day9"
 

export const day11A = async (cycles = 100, input:string = './input/day11.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const map = new Array<Array<number>>()
    lines.forEach((line, y)=>{ 
      line.split('').forEach((char, x)=>{ 
        if (map[x] === undefined){
          map[x]=[]
        }
        map[x][y] = parseInt(char)
      })
    })
    let total = 0
    const size = new coord(map.length, map[0].length)
    for (let i = 0; i<cycles; i++){
      const flashers = new Array<coord>()
      
      for(let x = 0; x<size.x;x++){
        for (let y = 0; y<size.y;y++){
          if (++map[x][y] > 9 ){
            map[x][y] = 0
            flashers.push(new coord(x,y))
          }
        }
      }

      while (flashers.length > 0){
        const flash = flashers.pop() as coord
        total++
        compassRose.forEach(d=>{
          const target = flash.add(d)
          if (target.inBounds(size) && map[target.x][target.y] != 0){
            if (++map[target.x][target.y] > 9){
              map[target.x][target.y] = 0
              flashers.push(target)
            }
          }
        })
      }
    }
    return total
 })
}



export const day11B = async ( input:string = './input/day11.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const map = new Array<Array<number>>()
    lines.forEach((line, y)=>{ 
      line.split('').forEach((char, x)=>{ 
        if (map[x] === undefined){
          map[x]=[]
        }
        map[x][y] = parseInt(char)
      })
    })
    
    const size = new coord(map.length, map[0].length)


    for (let step = 1; true; step++){
      let count = 0;
      const flashers = new Array<coord>()
      
      for(let x = 0; x<size.x;x++){
        for (let y = 0; y<size.y;y++){
          if (++map[x][y] > 9 ){
            map[x][y] = 0
            flashers.push(new coord(x,y))
          }
        }
      }

      while (flashers.length > 0){
        const flash = flashers.pop() as coord
        count++
        compassRose.forEach(d=>{
          const target = flash.add(d)
          if (target.inBounds(size) && map[target.x][target.y] != 0){
            if (++map[target.x][target.y] > 9){
              map[target.x][target.y] = 0
              flashers.push(target)
            }
          }
        })
      }
      if (count == size.x * size.y){
        return step
      }
    }
    return 0
 })
}

//day11A().then(r=>console.log(r))
//day11B().then(r=>console.log(r))