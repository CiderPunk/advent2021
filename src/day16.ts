import { readFile, writeFile } from "fs/promises"

class BinData{

  public pos:number
  public constructor(readonly data:string){
    this.pos = 0
  }
  read3byte():number{
    return parseInt(this.data.substring(this.pos, this.pos+=3),2)
  }

  readBit():number{
    return parseInt(this.data[this.pos++],2)
  }
  readnumber(bitSize:number){
    const bin = this.data.substring(this.pos, this.pos+=bitSize)
    return parseInt(bin,2)
  }

  readLit(): number {
    let bin  = ""
    let cont = 0
    do{
      cont =this.readBit()
      bin = bin.concat(this.data.substring(this.pos, this.pos+=4))
    } while(cont == 1)
    return parseInt(bin,2)
  }
}


class Packet{
  value(): any {
    switch(this.typeId){
      case 4: 
        return this.literal
      case 0://sum
        return this.packets.reduce((p,c)=>p+c.value(),0)
      case 1://multi
        return this.packets.reduce((p,c)=>p*c.value(),1)
      case 2://min
        return this.packets.reduce((p,c)=>Math.min(p,c.value()),Number.POSITIVE_INFINITY)
      case 3://min ..negative numbers??
        return this.packets.reduce((p,c)=>Math.max(p,c.value()),Number.NEGATIVE_INFINITY)
      case 5://greater
        return this.packets[0].value() > this.packets[1].value() ? 1 : 0
      case 6://less
        return this.packets[0].value() < this.packets[1].value() ? 1 : 0
      case 7://equal
        return this.packets[0].value() == this.packets[1].value() ? 1 : 0
      
    }
  }
  versionSum(): number {
    return this.packets.reduce((p,c)=>p+c.versionSum(),this.version)
  }

  public readonly version:number
  public readonly typeId:number
  public readonly literal:number
  
  public readonly packets:Array<Packet>
  public constructor(source:BinData){
    this.version = source.read3byte()
    this.typeId = source.read3byte()
    switch (this.typeId){
      case 4:{
        this.literal = source.readLit() 
        this.packets = []
        break

      }
      default:{
        this.literal = 0
        this.packets = []
        switch(source.readBit())
        {
          case 0:{
            const bitCount= source.readnumber(15)

            const end = source.pos + bitCount
            while(source.pos < end){
              this.packets.push(new Packet(source))
            }
            break
          } 
          case 1:{
            const packetCount = source.readnumber(11)
            for(let i = 0; i< packetCount; i++){
              this.packets.push(new Packet(source))
            } 
            break
          }
        }
      }
    }
  }

  public toString():string{
    return `\nv:${this.version} t:${this.typeId} l:${this.literal} { ${this.packets.toString()} }`
  }
}

const day16 = async (input:string):Promise<Packet>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const full = lines.join("")
    let bin = ""
    for (let i = 0; i < full.length; i++){
      const byte = parseInt(full[i],16)
      //pad out the bin number with 0s so we always get 4 bits
      bin = bin.concat(byte.toString(2).padStart(4,"0"))
    }

    return new Packet(new BinData(bin))
  })
}

export const day16A =  async(input:string = './input/day16.txt'):Promise<number>=>{
  return day16(input).then(p=>p.versionSum() )
}
export const day16B =  async(input:string = './input/day16.txt'):Promise<number>=>{
  return day16(input).then(p=>p.value() )
}

//day16A().then(r=>console.log(r.toString()))
//day16B().then(r=>console.log(r.toString()))
