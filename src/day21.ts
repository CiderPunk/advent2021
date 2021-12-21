
import { count } from "console"
import { readFile, writeFile } from "fs/promises"

class DeterministicDie{
  
  public rolls = 0
  public constructor(readonly max:number = 100){   
  }
  roll(count:number):number{
    let tote = 0
    for(let i = 0; i<count; i++){
      tote+= (this.rolls++ % this.max) + 1    
    }
    return tote
  }
}

interface player {pos:number, score:number}

const day21 = async (input:string = "./input/day21.txt"):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const playerexp = /Player \d+ starting position: (\d+)/
    const players = lines.map<player>(l=>{return { pos: parseInt(playerexp.exec(l)![1]) - 1, score:0}})
    const die = new DeterministicDie(100)
    while(true){
      for(let i = 0; i<players.length; i++){
        players[i].pos+=die.roll(3)
        players[i].score += (players[i].pos % 10) + 1
        if (players[i].score >= 1000){
          players.sort((a,b)=>a.score- b.score)
          return die.rolls * players[0].score
        }
      }
    }
  })
}


/*
export const day21A = async ():Promise<number> => { 
  return day20().then(r=>r)
}

export const day20B = ():Promise<number> => { 
  return day20(51, 50,"./input/day20.txt").then(r=>{ 
    return r.reduce((p,c)=>c.reduce((p2,c2)=>p2+(c2?1:0),p),0)
  })
}
*/
day21().then(r=>{ console.log(r) })
//day20B().then(r=>{ console.log(r) })

