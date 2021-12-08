import { readFile, writeFile } from "fs/promises"

//only use this for horizontal vertical or 45 degree vectors!!!!
class Vec2{
  constructor(readonly x:number, readonly y:number){}
  add = (v:Vec2)=>new Vec2(this.x + v.x, this.y + v.y)
  sub = (v:Vec2)=>new Vec2(this.x - v.x, this.y - v.y)
  unitize = ()=>new Vec2(this.x != 0 ? this.x / this.len(): 0 ,  this.y != 0 ? this.y/ this.len(): 0) 
  // nasty-ass hack - pythegerous this shit for non-45 degree
  len = ()=> Math.max(Math.abs(this.x), Math.abs(this.y))
  scale= (v:number)=> new Vec2(this.x * v, this.y*v )
}

export const day5A = async (skipDiags:boolean = true):Promise<number>=>{
  return readFile('./input/day5.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    //get coords
    const vents = lines.map(p=>p.split(" -> ",2).map(part=> {
        let x,y
        [x,y] =  part.split(',',2).map(n=>parseInt(n))
        return new Vec2(x,y)
      }))
    //init our map array
    const _mapSize = 1000 
    const map = new Array<Array<number>>()
    for (let i = 0; i<_mapSize; i++){
      map[i] = new Array<number>()
      for (let j = 0; j < _mapSize; j++){
        map[i][j] = 0
      }
    }
    let ventCount = 0
    //plot vents on map
    vents.forEach(vent=>{
      const diff = vent[1].sub(vent[0])
      //only horizontal or verticaL lines for now...
      if (!skipDiags || diff.x == 0 || diff.y == 0){
        ventCount++
        const len = diff.len()
        const unit = diff.unitize()
        //+1 so we include the end!
        for (let i =0; i< len+1; i++){
          const target = vent[0].add(unit.scale(i))
          map[target.x][target.y]++
        }
      }
    })
    //dumpMap(map)
    //count doubles
    let result = map.reduce<number>((p1,c1)=> c1.reduce((p2,c2)=>p2 += (c2 > 1 ? 1 : 0),p1),0)
    return result
 })
}



export const day5B = async ():Promise<number>=>{
  return day5A(false)
}



const dumpMap = (map: Array<Array<number>>)=>{
  let dump = ""
  map.forEach(col => {
    dump += "\n" + col.toString()
  });
  writeFile("dump.txt", dump)
}


//day5A().then(res=>console.log(res))
//day5B().then(res=>console.log(res))