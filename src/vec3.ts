export class vec3{
  manhat():number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z)
  }

  public constructor(public x:number, public y:number, public z:number){}
  public static parse(str:string):vec3{
    const vals = str.split(",").map(v=>parseInt(v))
    return new vec3(vals[0],vals[1],vals[2])
  }

  public toString = ():string=>`(x:${this.x},y:${this.y},z:${this.z})`
  public static zero = ()=>new vec3(0,0,0)
  public scale(s: number) {
    return new vec3(this.x * s, this.y * s, this.z * s)
  }
  public add(other: vec3): vec3 { 
    return new vec3(this.x + other.x, this.y+other.y, this.z+other.z)

  }
  public sub(other:vec3):vec3{
    return new vec3(this.x - other.x, this.y-other.y, this.z-other.z)
  }
  public len2(){
  //pythagoras! dont bother square-rooting who needs that sbit?
    return (this.x*this.x) + (this.y*this.y) + (this.z *this.z)
  }
  public len(){
    return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z *this.z))
  }

  public isEqual = (other:vec3):boolean => this.x == other.x && this.y==other.y && this.z==other.z

}
    