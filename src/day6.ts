import { readFile, writeFile } from "fs/promises"
 
export const day6A = async (days:number = 80):Promise<number>=>{
  return readFile('./day6.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const fish = lines[0].split(',').map(v=>parseInt(v))
    for(let d = 0; d<days; d++){
      let len = fish.length
      for(let f = 0; f < len; f++){
        if (--fish[f] == -1){
          fish[f]=6
          fish.push(8)
        }
      }
      //console.log(`day ${d} fish: ${fish.length}`)
    }
    return fish.length
 })
}

export const day6B = async (days:number=256):Promise<number>=>{
  return readFile('./day6.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const fish = lines[0].split(',').map(v=>parseInt(v))
    const tanks = [0,0,0,0,0,0,0,0,0]
    fish.forEach(f=>tanks[f]++)
    for(let d = 0; d<days; d++){
      const spawns = tanks[0]
      for(let t=0; t<9; t++){
        tanks[t]=tanks[t+1]
      }
      tanks[8]=spawns
      tanks[6]+=spawns
    }
    return tanks.reduce((p,c)=>p+c,0)
 })
}

//day6A().then(r=>console.log(r))
//day6B().then(r=>console.log(r))g