<template>
  <div class="playerwarper">
    <div class="musicplayer">
      <div class="musicplayer-left">
        <div class="album-info">
          <div
            class="player-cover__item"
            :style="{ backgroundImage: `url(${currentTrack.cover})` }"
          ></div>
          <div class="album-right">
            <div class="album-right_name">{{ currentTrack.name }}</div>
            <div class="album-right_info">
              {{ currentTrack.album }}-----{{ currentTrack.artist }}
            </div>
          </div>
        </div>
      </div>
      <div class="musicplayer-middle">
        <div class="player-controls">
          <div class="track-control">
            <div class="track-control_row">
              <div class="track-control_icon">
                <i class="fa fa-heart"></i>
              </div>
              <div class="track-control_icon" @click="prevTrack">
                <i class="fa fa-backward"></i>
              </div>
              <div class="track-control_iconPlay" @click="play">
                <i class="fa fa-pause-circle-o" v-if="isTimerPlaying"></i>
                <i class="fa fa-play-circle-o" v-else></i>
              </div>
              <div class="track-control_icon" @click="nextTrack">
                <i class="fa fa-forward"></i>
              </div>
              <div class="track-control_icon">
                <i class="fa fa-random"></i>
              </div>
            </div>
          </div>
          <div class="progress" ref="progress">
            <div class="progress_bar" @click="clickProgress">
              <div class="progress_current" :style="{ width: barWidth }"></div>
            </div>
            <div class="time">
              <div class="progress_time">{{ currentTime }}</div>
              <div class="progress_duration">{{ duration }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="musicplayer-right" ref="right">
        <div class="volume-control">
          <div class="volume-control_row">
            <div class="volume-control_speaker">
              <i class="fa fa-volume-up"></i>
            </div>
            <div class="volume-control_bar">
              <div class="bar" @click="clickVolume" ref="volume">
                <div
                  class="current-volume"
                  :style="{ width: volumeWidth }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {mapMutations} from 'vuex';
export default {
  data() {
    return {
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
      volumeLeft: null,
      volumeWidth: null,
      currentVolume: null,
    };
  },
  computed: {
    ...mapGetters(["tracks", "index"]),
  },
  watch: {
    tracks: {
      handler: function (newtrack,oldtrack) {
        if (!newtrack===oldtrack) {
          this.initialPlayer();
          console.log('new');
        }
      },
      deep: true,
      immediate: true,
    },
    index: {
      handler: function (newindex,oldindex) {
        if (newindex) {
          if (this.isTimerPlaying == true) {
            this.audio.pause();
            this.isTimerPlaying = false;
          }
          this.jumpToClick();
          console.log("new:"+newindex,"old:"+oldindex);
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    ...mapMutations({pushIndex:'PushIndex'}),
    play() {
      if (this.audio.paused) {
        this.audio.play();
        this.isTimerPlaying = true;
      } else {
        this.audio.pause();
        this.isTimerPlaying = false;
      }
    },
    generateTime() {
      let width = (100 / this.audio.duration) * this.audio.currentTime;
      this.barWidth = width + "%";
      this.circleLeft = width + "%";
      let durmin = Math.floor(this.audio.duration / 60);
      let dursec = Math.floor(this.audio.duration - durmin * 60);
      let curmin = Math.floor(this.audio.currentTime / 60);
      let cursec = Math.floor(this.audio.currentTime - curmin * 60);
      if (durmin < 10) {
        durmin = "0" + durmin;
      }
      if (dursec < 10) {
        dursec = "0" + dursec;
      }
      if (curmin < 10) {
        curmin = "0" + curmin;
      }
      if (cursec < 10) {
        cursec = "0" + cursec;
      }
      this.duration = durmin + ":" + dursec;
      this.currentTime = curmin + ":" + cursec;
      //console.log(this.audio.volume);
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      // console.log(
      //   x,
      //   progress.offsetParent,
      //   progress.offsetLeft,
      //   progress.offsetWidth
      // );
      let percentage = (100 * position) / progress.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.barWidth = percentage + "%";
      this.circleLeft = percentage + "%";
      this.audio.currentTime = (maxduration * percentage) / 100;
      this.audio.play();
    },
    clickProgress(e) {
      this.isTimerPlaying = true;
      this.audio.pause();
      this.updateBar(e.pageX);
    },
    generateVolume() {
      let width = 100 * this.audio.volume;
      this.volumeWidth = width + "%";
      this.volumeLeft = width + "%";
    },
    updateVolume(x) {
      let volume = this.$refs.volume;
      let right = this.$refs.right;
      console.log(
        x,
        volume.offsetParent,
        volume.offsetLeft,
        volume.offsetWidth
      );
      let position = x - right.offsetLeft - volume.offsetLeft;
      let percentage = (100 * position) / volume.offsetWidth;
      if (percentage > 100) {
        percentage = 100;
      }
      if (percentage < 0) {
        percentage = 0;
      }
      this.volumeWidth = percentage + "%";
      this.volumeLeft = percentage + "%";
      this.audio.volume = (1 * percentage) / 100;
    },
    clickVolume(e) {
      this.updateVolume(e.pageX);
    },
    jumpToClick() {
      this.currentTrack = this.tracks[this.index];
      this.currentTrackIndex = this.index;
      this.pushIndex(this.currentTrackIndex);
      this.refreshPlayer();
      this.audio.play();
      this.isTimerPlaying = true;
    },
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.pushIndex(this.currentTrackIndex);
      this.resetPlayer();
    },
    nextTrack() {
      this.transitionName = "sacle-out";
      this.isShowCover = false;
      if (this.currentTrackIndex < this.tracks.length - 1) {
        this.currentTrackIndex++;
      } else {
        this.currentTrackIndex = 0;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
      this.pushIndex(this.currentTrackIndex);
      this.resetPlayer();
    },
    refreshPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    resetPlayer() {
      this.barWidth = 0;
      this.circleLeft = 0;
      this.audio.currentTime = 0;
      this.audio.src = this.currentTrack.source;
      setTimeout(() => {
        if (this.isTimerPlaying) {
          this.audio.play();
        } else {
          this.audio.pause();
        }
      }, 300);
    },
    // favourite() {
    //   this.tracks[this.currentTrackIndex].favourited =
    //     !this.tracks[this.currentTrackIndex].favourited;
    // },
    initialPlayer() {
      let vm = this;
      this.currentTrack = this.tracks[0];
      this.audio = new Audio();
      //this.generateVolume();
      this.audio.src = this.currentTrack.source;
      this.audio.ontimeupdate = function () {
        vm.generateTime();
      };
      this.audio.onloadedmetadate = function () {
        vm.generateTime();
      };
      this.audio.onended = function () {
        vm.nextTrack();
        this.isTimerPlaying = true;
      };
      this.audio.load();
    },
  },
  created() {
    console.log(this.tracks);
    this.initialPlayer();
    console.log(this.duration, this.audio.duration, this.audio);
  },
};
</script>

<style lang="scss">
.playerwarper {
  overflow: hidden;
  padding: 65px 0px 0 0px;
  bottom: 0px;
  position: fixed;
  display: flex;
  z-index: 5;
  zoom: 1;
  bottom: 0;
  left: 0;
  right: 0;
  height: 105px;
  width: 100%;
}

.musicplayer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 0;
  width: 100%;
  height: 65px;
  background-color: rgba(255, 255, 255, 0.6);
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  min-width: 900px;
}
.musicplayer-left {
  display: flex;
  position: absolute;
  height: 100%;
  left: 0px;
}

.album-info {
  display: flex;
  flex-direction: row;
  justify-content: center;
  padding: 0 0 0 85px;
  height: 100%;
  border-top-left-radius: 32px;
}

// .album-info_img {
//   height: 80px;
//   width: 80px;
//   background-color: #000000;
//   border-radius: 10px;
//   margin-top: -30px;
// }

.player-cover__item {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 80px;
  height: 80px;
  border-radius: 15px;
  margin-top: -30px;
  // position: absolute;
  // left: 0;
  // top: 0;

  &:before {
    content: "";
    background: inherit;
    width: 80px;
    height: 80px;
    box-shadow: 0px 10px 40px 0px rgba(76, 70, 124, 0.5);
    display: block;
    z-index: 1;
    position: absolute;
    top: 30px;
    transform: scale(0.9);
    filter: blur(10px);
    opacity: 0.9;
    border-radius: 15px;
  }

  &:after {
    content: "";
    background: inherit;
    width: 80px;
    height: 80px;
    box-shadow: 0px 20px 20px 0px rgba(26, 26, 26, 0.66);
    display: block;
    z-index: 2;
    position: absolute;
    border-radius: 15px;
  }
}

.album-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 10px 0 16px;
}

.musicplayer-middle {
  display: flex;
  flex-direction: row;
}

.musicplayer-right {
  display: flex;
  flex-direction: row;
  position: absolute;
  height: 100%;
  right: 0px;
}

.player-controls {
  display: flex;
  flex-direction: column;
  margin-top: -30px;
}

.progress {
  display: flex;
  flex-direction: column;
  padding: 10px 0 0 0;
}

.progress_bar {
  height: 6px;
  width: 100%;
  cursor: pointer;
  background-color: rgba(175, 175, 175, 0.6);
  display: inline-block;
  border-radius: 10px;
}

.progress_current {
  height: inherit;
  width: 0%;
  background-color: rgba(153, 153, 153, 0.6);
  border-radius: 10px;
}

.progress_time,
.progress_duration {
  font-size: 10px;
}

.time {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 2px 0 0 0;
}

.volume-control {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 0 180px 0 0;
  border-top-right-radius: 32px;
  height: 100%;
}

.volume-control_row {
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin: auto;
}

// .volume-control_bar {
//   height: 6px;
//   width: 100px;
//   cursor: pointer;
//   background-color: rgba(153, 153, 153, 0.6);
//   display: inline-block;
//   border-radius: 10px;
//   margin: auto;
// }
.bar {
  height: 6px;
  width: 100px;
  cursor: pointer;
  background-color: rgba(175, 175, 175, 0.6);
  display: inline-block;
  border-radius: 10px;
  margin: auto;
}
.current-volume {
  height: inherit;
  width: 0%;
  background-color: rgba(153, 153, 153, 0.6);
  border-radius: 10px;
}

.volume-control_speaker {
  margin: auto;
  font-size: 18px;
  padding: 0 10px 0 0;
}

.track-control {
  display: flex;
  flex-direction: row;
  justify-content: center;
  border-radius: 24px;
  // padding: 20px 100px;
  background-color: #ffffff;
  height: 64px;
  width: 280px;
  z-index: 3;
}

.track-control_row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: auto;
  margin-bottom: auto;
  width: 75%;
  height: 100%;
}

.track-control_icon {
  margin: auto;
  font-size: 24px;
  color: rgba(153, 153, 153, 0.6);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.track-control_icon:hover {
  margin: auto;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.6);
}

.track-control_iconPlay {
  margin: auto;
  font-size: 50px;
  color: rgba(153, 153, 153, 0.6);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}
.track-control_iconPlay:hover {
  margin: auto;
  font-size: 50px;
  color: rgba(0, 0, 0, 0.6);
}
</style>