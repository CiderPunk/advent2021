import { readFile, writeFile } from "fs/promises"
import { monitorEventLoopDelay } from "perf_hooks"
import { createRestTypeNode } from "typescript"
import { compassRose, coord } from "./coord"
 
const searchDirs = [ coord.east, coord.south, coord.north, coord.west]



const day15 = async (mapGen:(filemap:Array<Array<number>>)=>Array<Array<number>> ,input:string = './input/day15.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const filemap = new Array<Array<number>>()
    lines.forEach((line, y)=>{ 
      line.split('').forEach((char, x)=>{ 
        if (filemap[y] === undefined){
          filemap[y]=[]
        }
        filemap[y][x] = parseInt(char)
      })
    })

const map = mapGen(filemap)
//dump map to confirm
//map.forEach(l=>{ console.log(l.join(""))})

    const size = new coord(map.length, map[0].length)

    const riskMap = new Array<Array<number>>()
    for(let x = 0; x < size.x; x++){
      riskMap[x]=[]
      for (let y=0; y<size.y; y++){
        riskMap[x][y] = Number.MAX_VALUE
      }
    }

    let current:coord
    riskMap[0][0] = 0
    const prospects = new Array<coord>()
    prospects.push(new coord(0,0))
    
    while(prospects.length > 0){
      //take first coord
      current = prospects.shift()!
      let currentTotalRisk = riskMap[current.x][current.y]
      const cellRisk = map[current.x][current.y]
      searchDirs.forEach((dir)=>{
        const prospect = current.add(dir)
        if (prospect.inBounds(size)){
          const prospectTotalRisk = riskMap[prospect.x][prospect.y]
          const prospectCellRisk = map[prospect.x][prospect.y] 
          
          if (prospectTotalRisk < currentTotalRisk - cellRisk){ //we found a shorter route to current
            currentTotalRisk = prospectTotalRisk + cellRisk
            riskMap[current.x][current.y] = currentTotalRisk
            //do we need to re-evaluate all our neighbours now???? maybe
            prospects.unshift(current)
          }
          else
          //if (prospectTotalRisk > currentTotalRisk + prospectCellRisk)
          {
            let newProspectRisk = currentTotalRisk + prospectCellRisk   
            if (newProspectRisk < riskMap[prospect.x][prospect.y]){
              riskMap[prospect.x][prospect.y] = newProspectRisk
              prospects.push(prospect)
            }
                   
          }
        }
      })
    }
    //our shortest route shou;d be the value in the bottom right!
    return  riskMap[size.x-1][size.y-1]

 })
}


/* recursion cannot help you here! crazy!
const findPath = (current:coord, map:Array<Array<number>>,size:coord, prev:Array<coord>= [], risk:number = 0, bestSoFar = Number.MAX_VALUE):number=>{
  if (risk>bestSoFar){
    return Number.MAX_VALUE
  }
  if (current.equal(size)){
    return risk
  }
  let best = Number.MAX_VALUE
  searchDirs.forEach((dir)=>{
    const prospect = current.add(dir)
    if (prospect.inBounds(size) && prev.findIndex(p=>{p.equal(prospect)}) == -1){
      const prospectRisk = findPath(prospect,map, size, prev.concat(current), risk + map[prospect.x][prospect.y],best)
      if (prospectRisk < best){
        best = prospectRisk
      }
    }
  })
  return best
}
*/


export const day15A = async (filename:string = "./input/day15.txt"):Promise<number>=>{
  return day15( (filemap:Array<Array<number>>) => filemap, filename)
}
export const day15B = async (resizeFactor = 5, filename:string = "./input/day15.txt"):Promise<number>=>{
  return day15( (filemap:Array<Array<number>>) => {
    //build the crazy 5 times map!
    const map = new Array<Array<number>>()
    const size = new coord(filemap.length, filemap[0].length)
    for (let x = 0; x < size.x * resizeFactor; x++){
      map[x] = []
    }
    for (let x = 0; x< size.x; x++){
      for (let y = 0; y<size.y; y++){
        for (let i = 0; i < resizeFactor ; i++){
          for (let j = 0; j < resizeFactor; j++){
            const val = ((filemap[x][y] -1 + i + j) %9)+1
            
            map[(i*size.x) + x][(j * size.y) + y] = val == 0 ? 1 : val 
          }
        }
      }
    }
    return map
  }, filename)
}
//day15A("./input/day15.txt").then(r=>console.log(r))
//day15B(5,"./input/day15.txt").then(r=>console.log(r))
//day11B().then(r=>console.log(r))