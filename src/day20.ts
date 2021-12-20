
import { readFile, writeFile } from "fs/promises"
import { coord } from "./coord"
const day20 = async (pad:number, cycles:number, input:string):Promise<Array<Array<boolean>>>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const algo = lines.shift()!.split("").map(c=>c=="#")
    //const pad = 50
    let map = lines.map(l=>{
      const line = l.split("").map(c=>(c=="#"))
      line.unshift(...new Array<boolean>(pad).fill(false))
      line.push( ...new Array<boolean>(pad).fill(false))
      return line
    })

    const mapWidth = map[0].length

    //not sure if these'd be ref'd if i copied the same array top and bopttom, avoid issues!
    const top = new Array<Array<boolean>>(pad).fill(new Array<boolean>(mapWidth).fill(false))
    const bottom = new Array<Array<boolean>>(pad).fill(new Array<boolean>(mapWidth).fill(false))
    map.unshift(...top)
    map.push(...bottom)
   let infFill = false

   //dumpMap(map)
    for (let i = 0; i < cycles; i++){
      [map,infFill] = applyAlgo(map,algo,infFill)

      //dumpMap(map)
    }
    //dumpMap(map)

    return map
  })
}

const dumpMap = (map:Array<Array<boolean>>)=>{
  map.forEach(l=>{
    console.log(l.map(b=>b?"#":".").join(""))
  })
}


const scanCoords=[ coord.northWest, coord.north, coord.northEast,coord.west, coord.zero, coord.east, coord.southWest, coord.south, coord.southEast ]

function applyAlgo(map: boolean[][], algo: boolean[], infFill:boolean=false) : [boolean[][], boolean]{
  const size = new coord(map[0].length, map.length)
  const newMap = map.map((line,y)=>{ 
    return line.map((ch,x)=>{
      const target = new coord(x,y)
      const index = scanCoords.reduce((p,c,i)=>{
        const scan = target.add(c)
        const val = scan.inBounds(size) ? (map[scan.y][scan.x]?1:0) : infFill ? 1:0
        return (p << 1) + val
      },0)
      return algo[index]
    })
  })

  const newInfFill = algo[infFill ? 0b111111111 : 0b000000000]
  return [newMap,newInfFill ]
}


export const day20A = ():Promise<number> => { 
  return day20(3, 2,"./input/day20.txt").then(r=>{ 
    return r.reduce((p,c)=>c.reduce((p2,c2)=>p2+(c2?1:0),p),0)
  })
}

export const day20B = ():Promise<number> => { 
  return day20(51, 50,"./input/day20.txt").then(r=>{ 
    return r.reduce((p,c)=>c.reduce((p2,c2)=>p2+(c2?1:0),p),0)
  })
}

//day20A().then(r=>{ console.log(r) })
//day20B().then(r=>{ console.log(r) })

