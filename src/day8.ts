import { sign } from "crypto"
import { prototype } from "events"
import { readFile, writeFile } from "fs/promises"
 
export const day8A = async ( input:string = './input/day8.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const display = lines.map(l=>l.split(" | ")[1])

    const result = display.reduce((p,c)=> c.split(' ').reduce((p2,c2)=>{
      switch(c2.length){
        case 2:
        case 3:
        case 4:
        case 7:
          return p2+1
        default:
          return p2
      }
    }, p),0)
    return result
 })
}




const toBin = (val:string):number=>{
  return val.split('').reduce((p,c)=>{switch(c){ 
    case "a": 
      return 1+p
    case "b": 
      return 2+p
    case "c": 
      return 4+p
    case "d": 
      return 8+p
    case "e": 
      return 16+p
    case "f": 
      return 32+p
    case "g": 
      return 64+p
    default:
      return NaN
  } 
},0)
}

export const day8B = async ( input:string = './input/day8.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)

    const signaldisplys = lines.map(l=>l.split(" | ").map(part=>{
      let parts = part.split(" ")
      return parts.map(p=>p.split("").sort().join(""))
    }))

    return signaldisplys.reduce((total,sigdisp)=>{
      const sig = sigdisp[0].sort((a,b)=>a.length - b.length).map(v=>toBin(v))
      const display = sigdisp[1]
      const lookup:Array<number> = []
      lookup[1] = sig[0]
      lookup[7] = sig[1]
      lookup[4] = sig[2]
      lookup[8] = sig[9]

      for(let i = 0; i<sig.length; i++){
        if (lookup.indexOf(sig[i]) > -1){
          sig[i]=0
        }
        else if (i < 6){ //2,3, or 5
          //3 test
          if ((sig[i] & lookup[1]) == lookup[1]){
            lookup[3] = sig[i]
            sig[i] = 0 
          }
        }  
        else{ //0,6,9
          //6 test
          if ((sig[i] & lookup[1]) != lookup[1] ){
            lookup[6] = sig[i]
          }
          else if ((sig[i] & lookup[4]) == lookup[4]){
            lookup[9] = sig[i]
          }
          else{
            lookup[0] = sig[i]
          }
          sig[i] = 0
        }
      }
      //second parse for 2 and 5
      for(let i = 0; i<sig.length; i++){
        if (sig[i] != 0){
          if ((sig[i] | lookup[6]) == lookup[6]){
            lookup[5] = sig[i]
          }
          else{
            lookup[2] = sig[i]
          }
        }
      }
    const res = display.map(v=>lookup.indexOf(toBin(v)))
    return total + (res[0] * 1000) + (res[1] * 100) + (res[2] * 10) + res[3]
 },0)
})
}

//day8B('./input/day8.txt').then(r=>console.log(r))
