
import { readFile, writeFile } from "fs/promises"


class mat3{
  mul(other: mat3) {
    const m = this.m
    const o = other.m
    return new mat3( [
      (m[0] * o[0]) + (m[1] * o[3]) + (m[2] * o[6]), (m[0] * o[1]) + (m[1] * o[4]) + (m[2] * o[7]), (m[0] * o[2]) + (m[1] * o[5]) + (m[2] * o[8]) ,  
      (m[3] * o[0]) + (m[4] * o[3]) + (m[5] * o[6]), (m[3] * o[1]) + (m[4] * o[4]) + (m[5] * o[7]), (m[3] * o[2]) + (m[4] * o[5]) + (m[5] * o[8]) ,  
      (m[6] * o[0]) + (m[7] * o[3]) + (m[8] * o[6]), (m[6] * o[1]) + (m[7] * o[4]) + (m[8] * o[7]), (m[6] * o[2]) + (m[7] * o[5]) + (m[8] * o[8])  
    ])

  }


  public static identity = ()=>new mat3([1,0,0,0,1,0,0,0,1])


  public static rotZ=(a:number):mat3=>new mat3([Math.cos(a),Math.sin(a),0,
    -Math.sin(a),Math.cos(a),0,
    0,0,1])

  public static rotX=(a:number):mat3=>new mat3([0,0,1,
    Math.cos(a),Math.sin(a),0,
    -Math.sin(a),Math.cos(a),0])

  public static rotY=(a:number):mat3=>new mat3([-Math.sin(a),Math.cos(a),0,
    0,0,1,
    Math.cos(a),Math.sin(a),0])                                   

  
  readonly m:Array<number>

  public constructor( parts:Array<number>){
    this.m = parts.map(p=>Math.round(p))
   }

  public transform(t:vec3):vec3{
    return new vec3(((t.x*this.m[0]) + (t.y * this.m[1]) + (t.z *this.m[2])), 
      ((t.x*this.m[3]) + (t.y * this.m[4]) + (t.z *this.m[5])),
      ((t.x*this.m[6]) + (t.y * this.m[7]) + (t.z *this.m[8])))
  }

}

class vec3{
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
  scale(s: number) {
    return new vec3(this.x * s, this.y * s, this.z * s)
  }
  add(other: vec3): vec3 { 
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
    //pythagoras! dont bother square-rooting who needs that sbit?
    return Math.sqrt((this.x*this.x) + (this.y*this.y) + (this.z *this.z))
  }

  public isEqual = (other:vec3):boolean => this.x == other.x && this.y==other.y && this.z==other.z

}

class sensor{


  private transform = mat3.identity()
  public sensorPos = vec3.zero()

  constructor(readonly id:number, readonly beacons:Array<vec3>){}

  dumpBeacons(result: Array<vec3>) {
    this.beacons.forEach(b=>{
      const trans = this.transform.transform(b).add(this.sensorPos)
      if (result.findIndex(c=>c.isEqual(trans))== -1){
        result.push(trans)
      }
    })
  }

  
  public dumpDistances(distances: Map<number, [vec3, vec3]>) {
    for (let i = 0; i < this.beacons.length; i++){
      for( let j = i+1; j<this.beacons.length; j++){
        const diff = this.beacons[i].sub(this.beacons[j])
        const len2 = diff.len2()
        if (!distances.get(len2)){
          distances.set(len2, [
            this.transform.transform( this.beacons[i]).add(this.sensorPos),
            this.transform.transform( this.beacons[j]).add(this.sensorPos)
          ])
        }
      } 
    }
  }

  public findDistanceMatches(distances: Map<number, [vec3, vec3]>):boolean{

    const matches = new Array<[vec3,vec3,vec3,vec3]>()
    for (let i = 0; i < this.beacons.length; i++){
      for( let j = i+1; j<this.beacons.length; j++){
        const diff = this.beacons[i].sub(this.beacons[j])
        const len2 = diff.len2()
        const match = distances.get(len2)
        if (match){
          matches.push([this.beacons[i], this.beacons[j],...match])
        }
      } 
    }
    if (matches.length > 1){
      return this.findTransform(matches)
    }

    return false

  }

  //returns true on success
  findTransform(matches: Array<[vec3, vec3, vec3, vec3]>): boolean {

    //console.log(`transform search for ${this.id}`)
    const t1 = matches[0][3].sub(matches[0][2])
    const t2 = matches[0][2].sub(matches[0][3])
    const ours = matches[0][1].sub(matches[0][0])
    //find a parity beacon for testing
    let parityBeacon = matches[1][2]
    //check were not using a beacon from the target
    if (parityBeacon.isEqual(matches[0][2]) || parityBeacon.isEqual(matches[0][3])){
      //switch to the second beacon
      parityBeacon = matches[1][3]
    }
  
    const targetAvg = matches[0][3].add(matches[0][2]).scale(0.5)
    const ourAvg = matches[0][1].add(matches[0][0]).scale(0.5)

    //prolly some repeats here...done with this!
    for(let x = 0; x<4;x++){
      for (let y = 0; y<4; y++){
        for (let z = 0; z<4; z++){
          const t = mat3.rotZ(z*0.5*Math.PI).mul(mat3.rotY(y*0.5*Math.PI)).mul(mat3.rotX(x*0.5*Math.PI))
          const trans = t.transform(ours)
          if (trans.isEqual(t1) || trans.isEqual(t2)){
            //calc offset
            const sloc =targetAvg.sub( t.transform(ourAvg))
            const partiyCheckA = t.transform(matches[1][0]).add(sloc)
            const parityCheckB = t.transform(matches[1][1]).add(sloc)

            if (partiyCheckA.isEqual(parityBeacon) || parityCheckB.isEqual(parityBeacon)){
             // console.log("greatSuccess")
              this.transform = t
              this.sensorPos = sloc
              return true
            }
            else{
//console.log("Parity failed")

            }
          }

        }   
      }

    }
    return false
  }

}

const readSensors = async (input:string):Promise<Array<sensor>>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const sensorStartRX = /--- scanner (\d+) ---/
    const sensors = new Array<sensor>()
    let beacons = new Array<vec3>()
    
    let currentSensor = 0
    for (let i =0; i<lines.length;i++){
      const match = sensorStartRX.exec(lines[i])
      if (match){
        if (beacons.length > 0){
          sensors.push(new sensor(currentSensor, beacons.map(b=>b)))
          beacons = []
        }
        currentSensor = parseInt(match[1])
      }
      else{
        beacons.push(vec3.parse(lines[i]))
      }
    }
    //last one
    sensors.push(new sensor(currentSensor, beacons.map(b=>b)))
    return sensors
  })
}


const getBeaconList = async ( input:string):Promise<[Array<vec3>, Array<sensor>]>=>{

  return readSensors(input).then(s=>{
    const distances = new Map<number, [vec3,vec3]>()
    const beacons =  new Array<vec3>()
    const sensors = new Array<sensor>()
    //take first sensor as our baseline...
    const s1 = s.shift() as sensor
    s1.dumpDistances(distances)
    s1.dumpBeacons(beacons)
    sensors.push(s1)
    while(s.length > 0){
      const candidate  = s.shift()
      if (candidate?.findDistanceMatches(distances)){
        candidate.dumpDistances(distances)
        candidate.dumpBeacons(beacons)
        sensors.push(candidate)
      }
      else{
        //add it back to the queue
        s.push(candidate!)
      }
    }
    return [beacons,sensors]
  })
}


export const day19A = async (input:string  = "./input/day19.txt"):Promise<number>=>{ 
  return getBeaconList(input).then(r=>{

    //r.sort((a,b)=>a.x - b.x)
    //r.forEach(b=>{ console.log(b.toString())})
    return r[0].length
  })
}
export const day19B = async (input:string  = "./input/day19.txt"):Promise<number>=>{ 
  return getBeaconList(input).then(r=>{
    const sensors = r[1]
    let max = 0
    for (let i = 0; i < sensors.length;i++){
      for (let j = 0; j < sensors.length;j++){
        const diff = sensors[i].sensorPos.sub(sensors[j].sensorPos)
        const len = diff.manhat()
        max = Math.max(len,max)
      }
    }
    return max
  })
}

//day19A("./input/day19.txt").then(r=>{ console.log(r) })
//day19B().then(r=>{ console.log(r) })
