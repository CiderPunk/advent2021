import { readFile } from "fs/promises"

export const day1A = async():Promise<number>=>{
  return readFile("./input/day1.txt").then((buffer)=>{
    const lines = buffer.toString().split(/\r?\n/)
    return lines.reduce<number>((p, c, i)=> {
      if (i > 0){
        return p + (Number.parseInt(lines[i]) > Number.parseInt(lines[i-1]) ? 1 : 0)
      }
      return p
    },0 ) 
  }) 
}

const winsize = 3
export const day1B = async():Promise<number>=>{
return readFile("./input/day1.txt").then((buffer)=>{
    const lines = buffer.toString().split(/\r?\n/)
    return  lines.reduce<number>((p, c, i)=> {
      if (i < winsize){
        return 0
      }
      return p + (Number.parseInt(lines[i]) > Number.parseInt(lines[i-winsize]) ? 1 : 0)
    },0 ) 
  }) 
}
