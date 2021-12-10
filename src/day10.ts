import { readFile, writeFile } from "fs/promises"
 

export const day10A = async (input:string = './input/day10.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)

    return lines.reduce((p,line)=>{
      const heap = new Array<string>()
      for (let i = 0; i< line.length; i++){
        const char =line[i] 
        switch(char){
          case '(':
            heap.push(')')
            break
          case '[':
            heap.push(']')
            break
          case '<':
            heap.push('>')
            break
          case '{':
            heap.push('}')
            break
          default:{
            if (char != heap.pop()){
              switch (char){
                case ')':
                  return p + 3
                case ']':
                  return p+57
                case '}':
                  return p+1197
                case '>':
                  return p+25137
              }
            }
          }
        }
      }
      return p
    },0)
    return 0
 })
}



export const day10B = async (input:string = './input/day10.txt'):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)

    const scores = lines.map(line=>{
      const heap = new Array<string>()
      for (let i = 0; i< line.length; i++){
        const char =line[i] 
        switch(char){
          case '(':
            heap.push(')')
            break
          case '[':
            heap.push(']')
            break
          case '<':
            heap.push('>')
            break
          case '{':
            heap.push('}')
            break
          default:{
            if (char != heap.pop()){
              return 0
            }
          }
        }
      }
      let total = 0
      while(heap.length>0){
        switch (heap.pop()){
          case ')':
            total = (total * 5) + 1
            break
          case ']':
            total = (total * 5) + 2
            break
          case '}':
            total = (total * 5) + 3
            break
          case '>':
            total = (total * 5) + 4
            break
        }
      }
      return total

    })

    const sortedScores = scores.filter(s=>s!=0).sort((a,b)=>a-b)
    return sortedScores[Math.floor(sortedScores.length /2)]
 })
}
