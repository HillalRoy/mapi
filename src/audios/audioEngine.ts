class AudioEngine {
  private isInteract: boolean = false;
  bgmusic = new Audio("/assets/Background Music.mp3");
  introspeech = new Audio(
    "/assets/In Game Voices/Intro Speech/Intro Speech.mp3"
  );
  silent = new Audio("/assets/silent.mp3");
  onClick = new Audio("/assets/click_sound/mixkit-video-game-mystery-alert-234.wav")
  wrongClick = new Audio("/assets/click_sound/button-4.wav")
  
  startButtonspeech: HTMLAudioElement[]=[new Audio("/assets/In Game Voices/Start Button Speech/All the best.mp3"), 
  new Audio("/assets/In Game Voices/Start Button Speech/Good Luck.mp3"), 
  new Audio("/assets/In Game Voices/Start Button Speech/Let's Go.mp3")];

  isbgMusicplaying = false;
  currentPlayingspeech?: HTMLAudioElement;

  play(audio: HTMLAudioElement) {
    if (this.isInteract) {
      if (this.bgmusic === audio) {
        this.isbgMusicplaying = true;
      } else {
        if (!this.currentPlayingspeech?.paused)
          this.currentPlayingspeech?.pause();
        this.currentPlayingspeech = audio;
      }
      audio.currentTime = 0;
      audio.play();
    }
  }
  firstUserInteraction() {
    this.isInteract = true;
    this.silent.play().catch(console.log);
  }
  allStop(){
      this.bgmusic.pause()
      this.currentPlayingspeech?.pause()
  }
}

export const audioEngine = new AudioEngine();
