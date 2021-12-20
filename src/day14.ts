import { readFile, writeFile } from "fs/promises"

const day14 = async (loopCount:number = 40, input:string = './input/day14.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const init = lines[0]
    const instructionMap = new Map<string,string>()
    //split instructions
    lines.slice(1).forEach(l=>{ 
      const parts = l.split(" -> ",2)
      instructionMap.set(parts[0], parts[1])
    })
    //init a count array with the start value
    let counts = new Map<string,number>()
    for (let i = 0; i < init.length -1; i++){
      const inst = init.substr(i,2)
      counts.set(inst, (counts.get(inst) ?? 0) + 1)
    }

    for (let loop = 0; loop < loopCount; loop++){
      let newCounts = new Map<string,number>()
      counts.forEach((val, inst)=>{
        const insert = instructionMap.get(inst) 
        if (insert){
          incCount(inst[0].concat(insert), val, newCounts)
          incCount(insert.concat(inst[1]), val, newCounts)
        }
        else{
          //dunn if we can hade a code pair without an instruction but this is to handle that case
          incCount(inst, val, newCounts)
        }
      })
      counts = newCounts  
    }
    //count each character
    const letterCounts = new Map<string, number>()
    counts.forEach((v,k)=>{
      const letter = k[1]
      letterCounts.set(letter, (letterCounts.get(letter) ?? 0) + v)
    })
    //cos our letter pairs miss the first character, add 1 for that guy!
    letterCounts.set(init[0], (letterCounts.get(init[0]) ?? 0) + 1)
    //find min/max
    let min = Number.MAX_VALUE
    let max = 0
    letterCounts.forEach((v,k)=>{
      min = Math.min(v,min)
      max = Math.max(v,max)
    })

    return max - min
  })
}

const incCount = (code:string,count:number, counts:Map<string, number>)=>{
  counts.set(code, (counts.get(code) ?? 0) + count)
}

export const day14A = async ():Promise<number>=>{
  return day14(10)
}
export const day14B = async ():Promise<number>=>{
  return day14(40)
}

//day14A().then(r=>console.log(r))
//day14B().then(r=>console.log(r))
