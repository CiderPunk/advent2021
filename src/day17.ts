import { readFile, writeFile } from "fs/promises"
import { getTrailingCommentRanges } from "typescript"
import { coord, rect } from "./coord"


const day17 = async (input:string):Promise<rect>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const targetParser = /target area: x=([\-\+]?\d+)\.\.([\+\-]?\d+), y=([\+\-]?\d+)\.\.([\+\-]?\d+)/
    const hits = targetParser.exec(lines[0])?.map(v=>parseInt(v))!
    return new rect(new coord( hits[1], hits[3]), new coord(hits[2],hits[4]))
  })
}

export const day17A =  async(input:string = './input/day17.txt'):Promise<number>=>{
  return  day17(input).then(target=>{
    let vY = 0 - target.tl.y -1
    let y = 0
    //while above target or moving up
    while (y > target.br.y && vY > 0){
      y+= vY
      vY--
      if (vY == 0){
        //max height
        return y
      }
    }
    //fail
    return 0
  })
}

const testVel = (v:coord, target:rect):boolean =>{
  let probe = new coord(0,0)
  while (probe.y >= target.tl.y && probe.x <= target.br.x && (v.x > 0 || probe.x >= target.tl.x )){
    probe = probe.add(v)
    if (target.contains(probe)){
      return true
    }
    v = v.add(coord.down)
    if (v.x > 0){
      v= v.add(coord.left)
    }
  }

  return false
}

export const day17B =  async(input:string = './input/day17.txt'):Promise<number>=>{
  return  day17(input).then(target=>{
    const vYmax = 0 - target.tl.y -1
    const vYmin = target.tl.y
    const vXmax = target.br.x
    let count = 0
    //there's certainly more efficient ways to do this but i'm ina rush
    for (let vx = 1; vx <= vXmax; vx++){
      for (let vy = vYmin; vy <= vYmax; vy++){
        if (testVel(new coord (vx,vy), target)){
         // console.log(`${vx},${vy}`)
          count++
        }
      }
    }
    
    return count
  })
}


//day17A().then(r=>console.log(r.toString()))
//day17B().then(r=>console.log(r.toString()))
