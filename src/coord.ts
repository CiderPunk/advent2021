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
}

const north = new coord(0,-1)
const northEast = new coord(1,-1)
const east = new coord(1,0)
const southEast = new coord(1,1)
const south = new coord(0,1)
const southWest = new coord(-1,1)
const west = new coord(-1,0)
const northWest = new coord(-1,-1)

export const dirs:Array<coord> = [north,south, east, west]
export const compassRose:Array<coord> = [north, northEast, east, southEast, south, southWest, west, northWest]