export class Time{
  constructor(public milisec: number){ }

  static seconds(sec: number) { return sec*1000 }
  static minutes(min: number) { return this.seconds(min*60) }
  static hours(h: number) { return this.minutes(h*60) }

  get seconds() { return Math.floor( (this.milisec/1000) % 60 )}
  get minutes() { return Math.floor( (this.milisec/1000/60) % 60 )}
  get hours() { return Math.floor( (this.milisec/(1000*60*60)) % 24 )}
  get days() { return Math.floor( this.milisec/(1000*60*60*24) )}
}

type TimeEvents = {
  time: Time,

}

export class Timer{

  deadline: number = 0
  private pauseTime = 0
  constructor(time: Time){
    this.deadLine = time
  }
  set deadLine(time: Time) {
    const currentTime = new Date().getTime()
    this.deadline = new Date(currentTime + time.milisec).getTime()
  }

  startPauseTime?: number
  paused = false
  
  pause() {
    if(this.paused) return
    this.startPauseTime = new Date().getTime()
  }

  resume() {
    if(!this.paused) return
    this.pauseTime += new Date().getTime() - this.startPauseTime!
  }

  timeRemaining(){
     return new Time(this.deadline + this.pauseTime - new Date().getTime())
  }

}

export const isTime = (val: unknown): val is Time => val instanceof Time 

