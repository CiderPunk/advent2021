import { readFile, writeFile } from "fs/promises"
import { TLSSocket } from "tls"
import { vec3 } from "./vec3"




class block{
  public readonly tl:vec3
  public readonly br:vec3
  constructor(public readonly state:boolean, x1:number,x2:number,y1:number, y2:number,z1:number, z2:number){
    this.tl = new vec3(Math.min(x1,x2),Math.min(y1,y2), Math.min(z1,z2))
    this.br = new vec3(Math.max(x1,x2),Math.max(y1,y2), Math.max(z1,z2))
  }

  contains=(other:block)=>this.tl.lessThanEqual(other.tl) && this.br.greaterThanEqual(other.br)
} 

export const readBlocks = async (input:string = "./input/day22.txt"):Promise<Array<block>>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)

    const lineparser = /(on|off) x=(\-?\d+)..(\-?\d+),y=(\-?\d+)..(\-?\d+),z=(\-?\d+)..(\-?\d+)/
    return lines.map(l=>{
      const m = lineparser.exec(l)
      return new block(m![1] == "on", parseInt(m![2]),parseInt(m![3]), parseInt(m![4]),parseInt(m![5]), parseInt(m![6]),parseInt(m![7]))
    })
  })  
}


export const day20A = (input:string = "./input/day22.txt" ):Promise<number>=>{
  return readBlocks(input).then(blocks => {
    //const bounds = new block(true, -50,50,-50,50,-50,50)
    //const filteredBlocks = blocks.filter(b=>bounds.contains(b))
  
    

return total

  })

}





day20A().then(r=>{ console.log(r)})