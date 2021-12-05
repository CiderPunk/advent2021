import { readFile } from "fs/promises"

export const day4A = async ():Promise<number>=>{
  return readFile('./day4.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/)
    const calls = lines[0].split(',').map(v=>parseInt(v))
    const cards = new Array<Card>()
    for (let i = 2; i < lines.length; i+=6){
      cards.push(new Card(lines.slice(i, i+5)))
    }
    for (const num of calls){
      const card = cards.find(c=>c.call(num))
      if(card != null){
        return card.sumRemaining() * num;
      }
    }
    return 0
 })
}

export const day4B = async ():Promise<number>=>{
  return readFile('./day4.txt').then(buffer=>{
    const lines = buffer.toString().split(/\r?\n/)
    const calls = lines[0].split(',').map(v=>parseInt(v.trim()))
    let cards = new Array<Card>()
    for (let i = 2; i < lines.length; i+=6){
      cards.push(new Card(lines.slice(i, i+5)))
    }
    for (const num of calls){
      var nc = cards.filter(c=>!c.call(num))
      if (nc.length == 0){
        return cards[0].sumRemaining() * num
      }
      cards = nc
    }
    return 0
 })
}

type LineArray = Array<Array<number>>
class Card {
  horizontal:LineArray 
  vertical:LineArray = []
  constructor(rows:String[]){
    //build horizontal lines
    this.horizontal = rows.map(r=>(r.trim().split(/\s+/).map(v=>parseInt(v))))
    //build vertical lines
    for(let i = 0; i < 5; i++){
      this.vertical.push(this.horizontal.map(v=>v[i]))
    }
  }

  call(v:number):boolean{
    return this.callTest(v, this.horizontal) || this.callTest(v, this.vertical)
  }

  callTest(v:number, lines:LineArray):boolean{
    const res = lines.findIndex(line=>{ 
      let i = line.findIndex(val=>v === val)
      if (i > -1){
        line[i] = -1
        if (line.reduce<number>((p,c)=>p+c,0) == -5){
          return true
        }
      }
    })
    return res > -1
  }

  sumRemaining(){
    return this.horizontal.reduce((p1,c1)=>p1+c1.reduce((p2,c2)=>p2 + (c2 > -1 ? c2: 0),0),0)
  }
}

//day4A().then(res=>console.log(res))
//day4B().then(res=>console.log(res))