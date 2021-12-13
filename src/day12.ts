import { readFile, writeFile } from "fs/promises"



class node{
  readonly isMajor:boolean
  readonly isStart:boolean
  readonly isEnd:boolean

  constructor (readonly name:string){ 
    this.isMajor = (name.toUpperCase() == name)  
    this.isStart = (name == "start")
    this.isEnd = (name == "end")
  }

  links = new Array<node>()

  addLink(target:node){
    this.links.push(target)
    target.links.push(this)
  }
}

export const day12 = async (routeFinder:(current:node)=>number, input:string = './input/day12.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const nodeMap = new Map<string, node>()
    //read in lines and assign links
    lines.forEach(line=>{
      const nodes = line.split("-").map(s=>{ 
        let n = nodeMap.get(s)
        if (n == undefined){
          n = new node(s)
          nodeMap.set(s,n)
        }
        return n
      })
      nodes[0].addLink(nodes[1])
    })
    
    const start = nodeMap.get("start")
    if (start != undefined){
      return routeFinder(start)
    }
    return 0
 })
}


const findRoutesA = (current:node, prior:Array<string> = [], total:number =0):number=>{
  if (current.isEnd){
    return total + 1
  }
  for (let i = 0; i<current.links.length; i++){
    const prospect = current.links[i]
    if (prospect.isMajor || prior.indexOf(prospect.name) == -1){
      total = findRoutesA(current.links[i], prior.concat(current.name), total )
    }
  }
  return total
}


const findRoutesB = (current:node, prior:Array<string> = [],doubled = false, total:number =0):number=>{
  if (current.isEnd){
    return total + 1
  }
  for (let i = 0; i<current.links.length; i++){
    const prospect = current.links[i]
    if (prospect.isMajor || prior.indexOf(prospect.name)==-1){
      total = findRoutesB(prospect, prior.concat(current.name), doubled, total )
    }
    else if (!prospect.isMajor && !prospect.isStart && !doubled){
      total = findRoutesB(prospect, prior.concat(current.name), true, total )
    }
  }
  
  return total
}


export const day12A = async ():Promise<number>=>{
  return day12(findRoutesA)
}
export const day12B = async ():Promise<number>=>{
  return day12(findRoutesB)
}



//day12A().then(r=>console.log(r))
//day12B().then(r=>console.log(r))
