import { readFile, writeFile } from "fs/promises"
 
const day7 = async ( fuelCalc:(dist:number)=>number, input:string = './input/day7.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const crabs = lines[0].split(',').map(v=>parseInt(v))
    const min = Math.min(...crabs)
    const max = Math.max(...crabs)
    let best =0
    for (let i = min; i<max; i++){
      const fuel = crabs.reduce((p,c)=>p+ fuelCalc(Math.abs(c-i)),0)
      best = best == 0 ? fuel : Math.min(fuel, best)
    }
    return best
 })
}

//fuel calculation functions
const fuelCalcA = (dist:number)=>{ return dist }

const fuelCalcB = (dist:number)=>{ 
  let c= 0
  for (let i = 0; i <= dist; i++){
    c+=i
  }
  return c
}

export const day7A = async()=>{ return day7(fuelCalcA)}
export const day7B = async()=>{ return day7(fuelCalcB)}

//day7A().then(r=>console.log(r))
//day7B().then(r=>console.log(r))
//day6B().then(r=>console.log(r))g