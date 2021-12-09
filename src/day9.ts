import { readFile, writeFile } from "fs/promises"
import { getTypeParameterOwner } from "typescript"
 
export const day9A = async (input:string = './input/day9.txt'):Promise<number>=>{
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

    return map.reduce((total,col,x)=>{ 
      return col.reduce((rowTotal,cell,y)=>{
        if ((y==0 || map[x][y-1] > cell) 
          && (y == col.length-1 || map[x][y+1] > cell)
          && (x == 0 || map[x-1][y] > cell)
          && (x == map.length-1 || map[x+1][y] > cell)){
            return rowTotal + cell + 1
          }
        return rowTotal
      },total) 
    },0)
 })
}


export const day9B = async (input:string = './input/day9.txt'):Promise<number>=>{
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


    const basins = new Array<number>()
    //find basins
    map.forEach((col,x)=>{ 
      col.forEach((cell,y)=>{
      if ((y==0 || map[x][y-1] > cell) 
        && (y == col.length-1 || map[x][y+1] > cell)
        && (x == 0 || map[x-1][y] > cell)
        && (x == map.length-1 || map[x+1][y] > cell)){
          basins.push(findSize(map, x,y)
          )
        }
      }) 
    })
  const sorted = basins.sort((a,b)=>b-a)
  const top3 = sorted.splice(0,3)
  
  return top3.reduce((p,v)=>p*v,1)
 })
}


export class coord{
  public constructor(readonly x:number, readonly y:number){ }
  add(other:coord):coord{
    return new coord(this.x+other.x, this.y+other.y)
  }
  equal(other:coord):boolean{
    return other !=null && other.x == this.x && other.y== this.y;
  }
  inBounds(size:coord):boolean{
    return (this.x < size.x && this.x >=0 && this.y < size.y && this.y>=0)
  }
}

const north = new coord(0,-1)
const south = new coord(0,1)
const east = new coord(1,0)
const west = new coord(-1,0)
const dirs:Array<coord> = [north,south, east, west]

const grow = (map:number[][], size:coord, found:coord[], current:coord)=>{
  found.push(current)
  dirs.forEach(dir => {
    const prospect = current.add(dir)
    if (prospect.inBounds(size) ){
      if ( found.findIndex(p=>p.equal(prospect)) == -1 && map[prospect.x][prospect.y] != 9){
        grow(map, size, found, prospect)
      }
    }
  })
}

const findSize = (map: number[][], x: number, y: number): number =>{
  const size = new coord(map.length, map[0].length)
  const found = new Array<coord>()
  grow(map, size, found, new coord(x,y))
  return found.length
}


//day9A().then(r=>console.log(r))
//day9B().then(r=>console.log(r))