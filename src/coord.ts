import { text } from "stream/consumers";

export class coord{
  public constructor(readonly x:number, readonly y:number){ }
  add(other:coord):coord{
    return new coord(this.x+other.x, this.y+other.y)
  }
  equal(other:coord):boolean{
    return other !=null && other.x == this.x && other.y== this.y;
  }
  inBounds(size:coord):boolean{
    return (this.x < size.x && this.x >=0 && this.y < size.y && this.y>=0)
  }

  hash():number{
    return this.x + this.y * 1000000
  }
  
  public static readonly  up = new coord(0,1)
  public static readonly  down = new coord(0,-1)
  public static readonly  left = new coord(-1,0)
  public static readonly  right = new coord(1,0)


  public static readonly  north = new coord(0,-1)
  public static readonly  northEast = new coord(1,-1)
  public static readonly  east = new coord(1,0)
  public static readonly  southEast = new coord(1,1)
  public static readonly  south = new coord(0,1)
  public static readonly  southWest = new coord(-1,1)
  public static readonly  west = new coord(-1,0)
  public static readonly  northWest = new coord(-1,-1)
}

export const dirs:Array<coord> = [ coord.north,coord.south, coord.east, coord.west]
export const compassRose:Array<coord> = [
  coord.north,
  coord.northEast, 
  coord.east, 
  coord.southEast, 
  coord.south, 
  coord.southWest, 
  coord.west, 
  coord.northWest
]

export class rect{
  public constructor (public readonly tl:coord, public readonly br:coord){}
  public contains = (test:coord):boolean => test.x >= this.tl.x && test.y >= this.tl.y && test.x <= this.br.x && test.y <= this.br.y
}