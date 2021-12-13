import { readFile, writeFile } from "fs/promises"
import {  coord } from "./coord"





export const day13 = async (foldcount:number = 0, input:string = './input/day13.txt'):Promise<Array<coord>>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    let points = new Array<coord>()
    const folds = new Array<coord>()

    const foldParseRx = /fold along ([x|y])=(\d+)/
    lines.forEach(l=>{
      if (l.startsWith("fold")){
        const parts = foldParseRx.exec(l) 
        if (parts!= undefined){
          switch(parts[1]){
            case "x":
              folds.push(new coord(parseInt(parts[2]),0))
              break
            case "y":
              folds.push(new coord(0,parseInt(parts[2])))
              break
          }
        }
      }
      else{
        const parts = l.split(",",2).map(p=>parseInt(p))
        points.push(new coord(parts[0],parts[1]))
      }
    })
    
    const count = (foldcount == 0) ? folds.length : foldcount
    for (let i = 0; i< count; i++){
      if (folds[i].x ==0){
        const foldpoint = folds[i].y
        points = points.map(p=>{
          if (p.y < foldpoint){
            return p
          }  
          else{
            return new coord(p.x, (foldpoint * 2) - p.y)
          }
        })   
      }
      else{
        const foldpoint = folds[i].x
        points = points.map(p=>{
          if (p.x < foldpoint){
            return p
          }  
          else{
            return new coord((foldpoint * 2) - p.x,  p.y)
          }
        })   

      }
    }
    const sortedpoints = points.sort((a,b)=>a.hash() - b.hash())
    const uniquePoints = sortedpoints.filter((c,i,a)=>i==0 || !c.equal(a[i-1]))

    return uniquePoints
 })
}

export const day13A = async ():Promise<number>=>{
  return day13(1).then(r=>r.length)
}

export const day13B = async ():Promise<string>=>{
  return day13().then(r=>{ 
    //find buffer size
    const max =  r.reduce((p,c)=>new coord(Math.max(p.x,c.x), Math.max(p.y,c.y)),new coord(0,0))
    //create and initialize buffer
    const buffer = new Array<Array<string>>()
    for (let y = 0; y<max.y+1; y++){
      buffer[y]= []
      for (let x = 0; x<max.x+ 1; x++){
        buffer[y][x] = " "
      }
    }
    //plot points
    r.forEach(point=>{  buffer[point.y][point.x] = "@" })

    return buffer.map(line=>line.join("")).join("\n")
  })
}

//day13A().then(r=>console.log(r))
//day13B().then(r=>console.log(r))
