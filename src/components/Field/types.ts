export interface ImageMapInterface {
  setField: Function,
  dimensions: Array<number>
}

export interface FieldInterface { 
  play: boolean, 
  setPlay: Function, 
  scoreBoard : { 
    [playerId : number] : number 
  }, 
  setScoreboard : Function 
}