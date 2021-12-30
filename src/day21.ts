
import { count } from "console"
import { readFile, writeFile } from "fs/promises"
import { escapeLeadingUnderscores } from "typescript"

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

export const day21A = async (input:string = "./input/day21.txt"):Promise<number>=>{
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

const dierolls = [
  [3,1],
  [4,3],
  [5,6],
  [6,7],
  [7,6],
  [8,3],
  [9,1]
]

class IGameState{
  p1pos:number = 0
  p2pos :number = 0
  p1score :number = 0
  p2score :number = 0
}

const toStringState = (state:IGameState):string=>`p1p: ${state.p1pos+1} p2p: ${state.p2pos+1} p1s: ${state.p1score} p2s: ${state.p2score}`

const encodeState = (gs:IGameState):number => gs.p1pos + (gs.p2pos * 10) + (gs.p1score * 100) + (gs.p2score * 10000)
const decodeState = (state:number):IGameState =>{
  return {
    p2score: Math.floor(state / 10000),
    p1score: Math.floor((state % 10000) / 100),
    p2pos: Math.floor((state % 100) / 10 ),
    p1pos: state % 10
  }
}


export const day21B = async (input:string = "./input/day21.txt"):Promise<number>=>{
  return readFile(input).then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/).filter(l=>l.length > 0)
    const playerexp = /Player \d+ starting position: (\d+)/
    const players = lines.map<player>(l=>{return { pos: parseInt(playerexp.exec(l)![1]) - 1, score:0}})
    
    let gameStates = new Map<number,number>()
    gameStates.set(encodeState( {p1score:0, p2score:0, p1pos:players[0].pos, p2pos:players[1].pos}), 1)

    const wins = new Array<number>(2).fill(0)

    let currentPlayer = 0
    while(gameStates.size > 0){
      currentPlayer++
      let nextGameStates = new Map<number,number>()
      gameStates.forEach((count,state)=> {
        const gs = decodeState(state)
        dierolls.forEach(roll=>{
          const newpos = (gs.p1pos + roll[0]) % 10
          const newgs = {
            p1pos:gs.p2pos,
            p2pos:newpos,
            p1score:gs.p2score,
            p2score:gs.p1score + newpos + 1
          }
          if (newgs.p2score > 20){
            wins[currentPlayer % 2] += (count * roll[1] )
          }
          else{
            const newstate = encodeState(newgs)
            nextGameStates.set(newstate, (nextGameStates.get(newstate) ?? 0) + (count * roll[1]))
          }
        })
      });
      gameStates = nextGameStates
    }
    return Math.max(...wins)
  })
}

