import { readFile } from "fs/promises"

type offset = {dist:number,depth:number}

export const day2A = async ():Promise<number>=>{
 return readFile('./day2.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/)
    const result = lines.reduce<offset>((p:offset,c:string)=>{
      const parts = c.split(' ')
      const val = Number.parseInt(parts[1])
      switch (parts[0]){
        case "forward":
          p.dist += val
          break
        case "down":
          p.depth += val
          break
        case "up":
          p.depth -= val
          break
      }
      return p;
    }, {dist:0, depth:0})
    return (result.depth * result.dist)
 })
}

type aimOffset = {aim:number, dist:number,depth:number}
export const day2B = async () : Promise<number>=>{
  return readFile('./day2.txt').then(buffer => {
    const lines = buffer.toString().split(/\r?\n/)
    const result = lines.reduce<aimOffset>((p: aimOffset, c: string) => {
      const parts = c.split(' ')
      const val = Number.parseInt(parts[1])
      switch (parts[0]) {
        case "forward":
          p.dist += val
          p.depth += val * p.aim
          break
        case "down":
          p.aim += val
          break
        case "up":
          p.aim -= val
          break
      }
      return p
    }, { aim: 0, dist: 0, depth: 0 })
    return result.depth * result.dist
  })
 }

