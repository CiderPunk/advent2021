import { readFile } from "fs/promises"

export const day3A = async ():Promise<number>=>{
 return readFile('./input/day3.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/)
    const result = lines.reduce<Array<number>>((p:Array<number>,c:string)=>{
      for (let i = 0; i < c.length; i++ ){
        if (p[i] === undefined){ 
          p[i] = 0
        }
        p[i] += parseInt(c[i])
      }
      return p
    }, new Array<number>())
    let gamma = ""
    let epsilon = ""
    for (let i = 0; i < result.length; i++ )
    {
      const bit = result[i] > (lines.length / 2)
      gamma +=  bit ? '1' : '0'
      epsilon += bit ? '0' : '1'
    }
    return parseInt(gamma, 2) * parseInt(epsilon,2)
 })
}


export const day3B = async ():Promise<number>=>{
  return readFile('./input/day3.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/)
    //copy/filter out blank line
    let ox = lines.filter(l=>l.length > 0)
    let cs = lines.filter(l=>l.length > 0)
    for (let i = 0; i < 12; i++){
      if (ox.length > 1){
        const countOx  = ox.reduce<number>((p:number,c:string)=>p + parseInt(c[i]) , 0)
        var filterOx = countOx >= (ox.length / 2) ? "1" : "0";
        ox = ox.filter(p=>{ return p[i] == filterOx })
      }
      if (cs.length > 1){
        const countCs  = cs.reduce<number>((p:number,c)=>p + parseInt(c[i]), 0)
        var filterCs = countCs < (cs.length / 2) ? "1" : "0";
        cs = cs.filter(p=>{ return p[i] == filterCs })
      }
    }
    return  parseInt(ox[0], 2) * parseInt(cs[0], 2) 
  })
 }
 