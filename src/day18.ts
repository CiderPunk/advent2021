import { readFile, writeFile } from "fs/promises"

class sfnum{

  constructor(readonly parts :Array<number|string> = []){}

  public magnitude():number{
    return this.calcMag( {pos:0})
  }
  
  
  calcMag(arg: { pos: number }): number {
    const left = this.parts[++arg.pos]
    const leftVal:number = left == "[" ? this.calcMag(arg) : left as number

    const right = this.parts[++arg.pos]
    const rightVal:number = right == "[" ? this.calcMag(arg) : right as number
    //skip closing bracket
    arg.pos++
    return (leftVal * 3) + (rightVal * 2)
  }



  public add(other:sfnum):sfnum{
    const result = new sfnum( ["[", ...this.parts, ...other.parts, "]" ])
    result.reduce()
    return result
  }

  public toString(){
    return this.parts.reduce<string>((p,c,i,a)=>{
      if ((i == 0)  
        || (c == "]") 
        || (a[i-1] == "[")){
          return p.concat(c.toString())
        }
      return p.concat(",",c.toString())
   },"")
  }

  static parse(val:string):sfnum{
    const init:Array<number|string> = []
    for (let i = 0; i <val.length; i++){
      switch (val[i]){
        case "[":
          init.push("[") 
          break
        case "]":
          init.push("]")
          break
        case ","://DONT CARE
          break
        default:
          init.push(parseInt(val[i]))
          break
      }
    }
    return new sfnum(init)
  }

  public reduce():sfnum{
    while(!this.reduceCycle()){
      //console.log( "reduce: " + this.toString())
    }
    return this
  }

  private reduceCycle():boolean{
    let depth = 0
    for (let i = 0; i <this.parts.length; i++){
      switch(this.parts[i]){
        case "[":
          depth++
          break
        case "]":
          depth--
          break
        default: // number 
          const val =this.parts[i] as number

          if (depth > 4 && typeof this.parts[i+1] == "number"){
            //console.log(`explode at ${i} val [${this.parts[i]},${this.parts[i+1]}] depth: ${depth}`)
            this.explode(i-1)
            return false
          }
      
                
      }
    }
    for (let i = 0; i <this.parts.length; i++){
      const val = this.parts[i]
      if (typeof val == "number" && val > 9){
        //split
        //console.log(`split at ${i} val ${val}`)
        this.split(i)
        return false
      }
    }

    return true
  }
  private split(position: number) {
    const val = this.parts[position] as number
    const insert = []
    insert.push("[")
    insert.push(Math.floor(val/2))
    insert.push(Math.ceil(val/2))
    insert.push("]")
    this.parts.splice(position,1, ...insert)
  }

  private addLeft(val:number,start:number):void{
    for (let i = start; i > 0; i--){
      if (typeof this.parts[i] == "number"){
        this.parts[i] = this.parts[i] as number + val
        return
      }
    }
  }

  private addRight(val:number,start:number):void{
    for (let i = start; i < this.parts.length; i++){
      if (typeof this.parts[i] == "number"){
        this.parts[i] = this.parts[i] as number + val
        return
      }
    }
  }

  private explode(position: number) {
    this.addLeft(this.parts[position+1] as number, position)
    this.addRight(this.parts[position+2] as number, position+3)
    //replace pair with 0
    this.parts.splice(position,4,0)
  }

}


export const day18A = async (input:string = "./input/day18.txt"):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const result = lines.reduce<sfnum|null>((p,c)=>{   
      if (!p){
        return sfnum.parse(c)
      }
      return p.add(sfnum.parse(c))
    },null)
    return result?.magnitude() ?? 0;
  })
}
export const day18B = async (input:string = "./input/day18.txt"):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const nums = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0).map(l=>sfnum.parse(l))
    let best = 0
    for (let i = 0; i <nums.length; i++){
      for (let j = 0; j <nums.length; j++){
        if (i != j){
          const sum = nums[i].add(nums[j])
          const mag = sum.magnitude() 
          
          //console.log(`${mag} ${sum.toString()}`)
          best = Math.max(best,mag)
        }
      }
    }
    return best
  })
}


//day18A("./input/day18.txt").then(r=>{ console.log(r) })
//day18B("./input/day18.txt").then(r=>{ console.log(r) })
