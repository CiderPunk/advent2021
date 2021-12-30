import { readFile, writeFile } from "fs/promises"
import { vec3 } from "./vec3"

type instruction = [boolean,block]

export class block{

  public constructor(public readonly tl:vec3, public readonly br:vec3){
  }

  public static  fromFile(x1:number,x2:number,y1:number,y2:number,z1:number,z2:number){
    return new block(new vec3(Math.min(x1,x2), Math.min(y1,y2), Math.min(z1,z2)),new vec3(Math.max(x1,x2), Math.max(y1,y2), Math.max(z1,z2)))
  }


  public intersection(other:block):block|null{
    const intersection =  new block(
      new vec3( Math.max(this.tl.x, other.tl.x), Math.max(this.tl.y, other.tl.y), Math.max(this.tl.z, other.tl.z)),
      new vec3( Math.min(this.br.x, other.br.x), Math.min(this.br.y, other.br.y), Math.min(this.br.z, other.br.z))
    )
    return  intersection.isPositive() ? intersection : null
  }

  public isPositive():boolean{
    return this.tl.x <= this.br.x && this.tl.y <= this.br.y && this.tl.z <= this.br.z
  }

  public volume():number{
    const size = this.br.sub(this.tl).add(new vec3(1,1,1))
    return size.x * size.y * size.z
  }
}

const readInstructions = async (input:string ):Promise<Array<instruction>>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0).filter(l=>!l.startsWith("//"))
    const instructionparser = /^(on|off) x=(-?\d+)..(-?\d+),y=(-?\d+)..(-?\d+),z=(-?\d+)..(-?\d+)/
    return lines.map<instruction>(l=>{
      const matches = instructionparser.exec(l)!
      return [matches[1] == "on",block.fromFile(parseInt(matches[2]),parseInt(matches[3]),parseInt(matches[4]),parseInt(matches[5]),parseInt(matches[6]),parseInt(matches[7]))]
    }).filter(p=>{return (p != null)})
  })
}

const calcCombinedVoulme = (blocks:Array<block>):number=>{
  let total = 0
  for (let i = 0; i < blocks.length; i++){
    total += blocks[i].volume()
    const ints = new Array<block>()
    for (let j = i + 1; j < blocks.length; j++){
      const int = blocks[i].intersection(blocks[j])
      if (int){
        ints.push(int)
      }
    }
    total -= calcCombinedVoulme(ints)
  }
  return total
}

const day22 = async (instructionFilter:(ins:instruction)=>boolean,input:string= "./input/day22.txt",):Promise<number> =>{
  return readInstructions(input).then(ins=>{

    ins = ins.filter(instructionFilter)
    let total = 0
    for (let i= ins.length-1; i >= 0; i-- ){
      const intersections= new Array<block>()
      //only use ons
      if (ins[i][0]){
        const currentBlock = ins[i][1]
        //get all intersections with followinng blocks
        for (let j = i+1; j < ins.length; j++ ){
          const int = currentBlock.intersection(ins[j][1])
          if (int){
            intersections.push(int)
          }
        }
        total += currentBlock.volume() - calcCombinedVoulme(intersections)
      }
    }
    return total
  })
}
export const day22B = ():Promise<number>=>{ 
  return day22(i=>true)
}

export const day22A = ():Promise<number>=>{ 
  return day22(i=>i[1].tl.x >= -50 && i[1].tl.y >= -50 && i[1].tl.z >= -50 && i[1].br.x <= 50 && i[1].br.y <= 50 && i[1].br.z <= 50)
}

//day22A().then(r=>console.log(r))
//day22B().then(r=>console.log(r))