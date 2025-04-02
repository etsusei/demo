<template>
  <div>
    <canvas id="canvas" width="1400" height="600"></canvas>
    <div class="app-container">
      <div class="app-header">
        <div class="app-header-left">
          <i class="fa fa-music" style="font-size: 24px"></i>
          <p class="app-name">Neon</p>
          <div class="search-wrapper">
            <input class="search-input" type="text" placeholder="Search" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              class="feather feather-search"
              viewBox="0 0 24 24"
            >
              <defs></defs>
              <circle cx="11" cy="11" r="8"></circle>
              <path d="M21 21l-4.35-4.35"></path>
            </svg>
          </div>
        </div>
        <div class="app-header-right">
          <button class="profile-btn">
            <img
              src="https://img0.baidu.com/it/u=3522288622,363838562&fm=253&fmt=auto&app=138&f=JPEG?w=537&h=269"
            />
            <!-- http://p2.music.126.net/Dp_Zf9m4t7s3_IOxKb5GpQ==/109951163806722668.jpg -->
            <span>RYOZO</span>
          </button>
        </div>
      </div>
      <div class="app-content">
        <div class="app-sidebar">
          <a href="" class="app-sidebar-link active">
            <i class="fa fa-home" style="font-size: 24px"></i>
          </a>
          <a href="" class="app-sidebar-link">
            <i class="fa fa-heart" style="font-size: 24px"></i>
          </a>
        </div>
        <div class="projects-section">
          <div class="projects-section-header">
            <p>Home</p>
            <p class="time">{{ this.dateToday }}</p>
          </div>
          <div class="projects-section-pages">
            <router-view />
          </div>
        </div>
        <div class="messages-section">
          <div class="projects-section-header">
            <p>Playlist</p>
          </div>
          <div class="messages">
            <playlist />
          </div>
        </div>
      </div>
    </div>
    <div class="playerwarper">
      <div class="musicplayer">
        <div class="musicplayer-left">
          <div class="album-info">
            <transition-group :name="transitionName">
              <template v-for="(track, $index) in tracks" :key="$index">
                <div
                  class="player-cover__item"
                  v-if="$index === currentTrackIndex"
                  :style="{ backgroundImage: `url(${track.cover})` }"
                ></div>
              </template>
            </transition-group>

            <div class="album-right">
              <div class="album-right_name">{{ currentTrack.name }}</div>
              <div class="album-right_info">{{ currentTrack.artist }}</div>
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
                <div
                  class="progress_current"
                  :style="{ width: barWidth }"
                ></div>
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
  </div>
</template>

<script>
import dayjs from "dayjs";
import playlist from "../components/playlist.vue";
//import Views13 from '../views/view1/views13.vue';
//import View2111 from './view2/view2-1-1/view2-1-1-1.vue';
//import view22 from "../views/view2/view2-2.vue"
//import View31 from '../views/view3/view3-1.vue';
//import view11 from "./view1/home.vue"
export default {
  components: {
    playlist,
    //View31
    //view11,
    //Views13,
    //View2111,
    //view22,
  },
  data() {
    return {
      //************** WebGL Var **************
      canvas: {
        width: 0,
        height: 0,
      },
      gl: null,
      time: 0.0,
      vertexSource: null,
      fragmentSource: null,
      vertexShader: null,
      fragmentShader: null,
      vertexData: null,
      vertexDataBuffer: null,
      positionHandle: null,
      shaderSource: null,
      shaderType: null,
      program: null,
      timeHandle: null,
      widthHandle: null,
      heightHandle: null,
      lastFrame: null,
      thisFrame: null,
      //************** Date **************
      dateToday: null,
      datejs: null,
      //************** MusicPlayer Var **************
      audio: null,
      circleLeft: null,
      barWidth: null,
      duration: null,
      currentTime: null,
      isTimerPlaying: false,
      tracks: [
        {
          name: "The Comeback Kid",
          artist: "Lindi Ortega",
          cover:
            "https://img2.baidu.com/it/u=1687549870,4079575875&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          source:
            "https://music.163.com/song/media/outer/url?id=1816075932.mp3",
          url: "https://www.youtube.com/watch?v=me6aoX0wCV8",
          favorited: true,
        },
        {
          name: "Overdose",
          artist: "Grandson",
          cover:
            "https://img1.baidu.com/it/u=923348801,1979595828&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          source:
            "https://music.163.com/song/media/outer/url?id=1438895972.mp3",
          url: "https://www.youtube.com/watch?v=00-Rl3Jlx-o",
          favorited: false,
        },
        {
          name: "Rag'n'Bone Man",
          artist: "Human",
          cover:
            "https://img2.baidu.com/it/u=2177886564,2212580282&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
          source:
            "https://music.163.com/song/media/outer/url?id=1852369772.mp3",
          url: "https://www.youtube.com/watch?v=L3wKzyIN1yk",
          favorited: false,
        },
      ],
      currentTrack: null,
      currentTrackIndex: 0,
      transitionName: null,
      volumeLeft: null,
      volumeWidth: null,
      currentVolume: null,
    };
  },
  methods: {
    //************** WebGL **************
    ShaderSources() {
      this.vertexSource = `
      attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;
      this.fragmentSource = `
precision highp float;

#define AA

uniform float width;
uniform float height;
vec2 resolution = vec2(width, height);

uniform float time;

void main(){

	float strength = 0.4;
	float t = time/6.0;

	vec3 col = vec3(0);
	vec2 fC = gl_FragCoord.xy;

	#ifdef AA
	for(int i = -1; i <= 1; i++) {
		for(int j = -1; j <= 1; j++) {

			fC = gl_FragCoord.xy+vec2(i,j)/3.0;

			#endif

			//Normalized pixel coordinates (from 0 to 1)
			vec2 pos = fC/resolution.xy;

			pos.y /= resolution.x/resolution.y;
			pos = 4.0*(vec2(0.5) - pos);

			for(float k = 1.0; k < 7.0; k+=1.0){ 
				pos.x += strength * sin(2.0*t+k*1.5 * pos.y)+t*0.5;
				pos.y += strength * cos(2.0*t+k*1.5 * pos.x);
			}

			//Time varying pixel colour
			col += 0.5 + 0.5*cos(time+pos.xyx+vec3(0,2,4));

			#ifdef AA
		}
	}

	col /= 9.0;
	#endif

  //Gamma
  col = pow(col, vec3(0.2));

	//Fragment colour
	gl_FragColor = vec4(col,1.0);
}
`;
    },
    onWindowResize() {
      this.canvas.width = window.innerHeight;
      this.canvas.height = window.innerHeight;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      this.gl.uniform1f(this.widthHandle, window.innerWidth);
      this.gl.uniform1f(this.heightHandle, window.innerHeight);
    },
    compileShader(shaderSource, shaderType) {
      var shader = this.gl.createShader(shaderType);
      this.gl.shaderSource(shader, shaderSource);
      this.gl.compileShader(shader);
      if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
        throw "Shader compile failed with: " + this.gl.getShaderInfoLog(shader);
      }
      return shader;
    },
    getAttribLocation(program, name) {
      var attributeLocation = this.gl.getAttribLocation(program, name);
      if (attributeLocation === -1) {
        throw "Cannot find attribute " + name + ".";
      }
      return attributeLocation;
    },
    getUniformLocation(program, name) {
      var attributeLocation = this.gl.getUniformLocation(program, name);
      if (attributeLocation === -1) {
        throw "Cannot find uniform " + name + ".";
      }
      return attributeLocation;
    },
    draw() {
      //Update time
      this.thisFrame = Date.now();
      this.time += (this.thisFrame - this.lastFrame) / 5000;
      this.lastFrame = this.thisFrame;

      //Send uniforms to program
      this.gl.uniform1f(this.timeHandle, this.time);

      //Draw a triangle strip connecting vertices 0-4
      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(this.draw);
    },

    //************** MusicPlayer **************
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
      console.log(this.audio.volume);
    },
    updateBar(x) {
      let progress = this.$refs.progress;
      let maxduration = this.audio.duration;
      let position = x - progress.offsetLeft;
      console.log(
        x,
        progress.offsetParent,
        progress.offsetLeft,
        progress.offsetWidth
      );
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
    prevTrack() {
      this.transitionName = "scale-in";
      this.isShowCover = false;
      if (this.currentTrackIndex > 0) {
        this.currentTrackIndex--;
      } else {
        this.currentTrackIndex = this.tracks.length - 1;
      }
      this.currentTrack = this.tracks[this.currentTrackIndex];
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
      this.resetPlayer();
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
    favourite() {
      this.tracks[this.currentTrackIndex].favourited =
        !this.tracks[this.currentTrackIndex].favourited;
    },
  },
  created() {
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
    console.log(this.duration, this.audio.duration, this.audio);
  },
  mounted() {
    //************** WebGL Part**************
    this.canvas = document.getElementById("canvas");
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    // Initialize the GL context
    this.gl = this.canvas.getContext("webgl");
    if (!this.gl) {
      console.error("Unable to initialize WebGL.");
    }
    //Create shader programs
    this.program = this.gl.createProgram();
    //************** Shader sources **************
    this.ShaderSources();

    //************** Utility functions **************
    window.addEventListener(
      "resize",
      () => {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        this.gl.uniform1f(this.widthHandle, window.innerWidth);
        this.gl.uniform1f(this.heightHandle, window.innerHeight);
      },
      false
    );
    //Compile shader and combine with source
    // this.compileShader(this.shaderSource,this.shaderType);
    //Utility to complain loudly if we fail to find the attribute/uniform
    this.getAttribLocation(this.program, this.name);
    this.getUniformLocation(this.program, this.name);
    //************** Create shaders **************

    //Create vertex and fragment shaders
    this.vertexShader = this.compileShader(
      this.vertexSource,
      this.gl.VERTEX_SHADER
    );
    this.fragmentShader = this.compileShader(
      this.fragmentSource,
      this.gl.FRAGMENT_SHADER
    );

    //Create shader programs

    this.gl.attachShader(this.program, this.vertexShader);
    this.gl.attachShader(this.program, this.fragmentShader);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);

    //Set up rectangle covering entire canvas
    this.vertexData = new Float32Array([
      -1.0,
      1.0, // top left
      -1.0,
      -1.0, // bottom left
      1.0,
      1.0, // top right
      1.0,
      -1.0, // bottom right
    ]);

    //Create vertex buffer

    this.vertexDataBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexDataBuffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexData,
      this.gl.STATIC_DRAW
    );

    // Layout of our data in the vertex buffer

    this.positionHandle = this.getAttribLocation(this.program, "position");
    this.gl.enableVertexAttribArray(this.positionHandle);
    this.gl.vertexAttribPointer(
      this.positionHandle,
      2, // position is a vec2 (2 values per component)
      this.gl.FLOAT, // each component is a float
      false, // don't normalize values
      2 * 4, // two 4 byte float components per vertex (32 bit float is 4 bytes)
      0 // how many bytes inside the buffer to start from
    );

    //Set uniform handle

    this.timeHandle = this.getUniformLocation(this.program, "time");
    this.widthHandle = this.getUniformLocation(this.program, "width");
    this.heightHandle = this.getUniformLocation(this.program, "height");

    this.gl.uniform1f(this.widthHandle, window.innerWidth);
    this.gl.uniform1f(this.heightHandle, window.innerHeight);

    this.lastFrame = Date.now();

    this.draw();
    //************** WebGL Part**************
    this.dayjs = require("dayjs");
    this.dateToday = dayjs().format("YYYY,MMM,DD");
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=DM+Sans:400,500,700&display=swap");

* {
  box-sizing: border-box;
}

:root {
  --app-container: #fcfcfc00;
  --main-color: #1f1c2e;
  --secondary-color: #4a4a4a;
  --link-color: #1f1c2e;
  --link-color-hover: #c3cff4;
  --link-color-active: #fff;
  --link-color-active-bg: #1f1c2e;
  --projects-section: #fff;
  --message-box-hover: #fafcff;
  --message-box-border: #e9ebf0;
  --more-list-bg: #fff;
  --more-list-bg-hover: #f6fbff;
  --more-list-shadow: rgba(209, 209, 209, 0.4);
  --button-bg: #1f1c24;
  --search-area-bg: #fff;
  --star: #1ff1c2e;
  --message-btn: #fff;
}

html,
body {
  width: 100%;
  //height: 100vh;
  margin: 0;
}

body {
  font-family: "DM Sans", sans-serif;
  display: flex;
  justify-content: center;
  background-color: #000;
  background-repeat: no-repeat;
}
#canvas {
  -webkit-filter: blur(30px);
  filter: blur(30px);
  z-index: -2;
  position: absolute;
  left: 0px;
}

.app {
  &-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: var(--app-container);
    transition: 0.2s;
    max-width: 1800px;
    margin:auto;
    button,
    input,
    optgroup,
    select,
    textarea {
      font-family: "DM Sans", sans-serif;
    }
  }

  &-content {
    display: flex;
    height: 100%;
    overflow: hidden;
    padding: 16px 24px 24px 0;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 16px 24px;
    position: relative;

    &-left,
    &-right {
      display: flex;
      align-items: center;
    }

    &-left {
      flex-grow: 1;
    }

    &-right button {
      margin-left: 10px;
    }
  }

  &-icon {
    width: 26px;
    height: 2px;
    border-radius: 4px;
    background-color: var(--main-color);
    position: relative;

    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 12px;
      height: 2px;
      border-radius: 4px;
      background-color: var(--main-color);
      left: 50%;
      transform: translatex(-50%);
    }

    &:before {
      top: -6px;
    }
    &:after {
      bottom: -6px;
    }
  }

  &-name {
    color: var(--main-color);
    margin: 0;
    font-size: 20px;
    line-height: 24px;
    font-weight: 700;
    margin: 0 32px;
  }
}

.search-wrapper {
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.6);
  padding-right: 12px;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 480px;
  color: var(--light-font);
  box-shadow: 0 2px 6px 0 rgba(136, 148, 171, 0.2),
    0 24px 20px -24px rgba(71, 82, 107, 0.1);
  overflow: hidden;

  .dark & {
    box-shadow: none;
  }
}

.search-input {
  border: none;
  flex: 1;
  outline: none;
  height: 100%;
  padding: 0 20px;
  font-size: 16px;
  background-color: rgba(255, 255, 255, 0);
  color: var(--main-color);

  &:placeholder {
    color: var(--main-color);
    opacity: 0.6;
  }
}

.profile-btn {
  padding: 0;
  border: 0;
  background-color: transparent;
  display: flex;
  align-items: center;
  padding-left: 12px;
  border-left: 2px solid #ddd;

  img {
    width: 32px;
    height: 32px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 4px;
  }

  span {
    color: var(--main-color);
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
  }
}

.app-sidebar {
  padding: 40px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &-link {
    color: var(--main-color);
    color: var(--link-color);
    margin: 16px 0;
    transition: 0.2s;
    border-radius: 50%;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      background-color: var(--link-color-hover);
      color: var(--link-color-active);
    }

    &.active {
      background-color: var(--link-color-active-bg);
      color: var(--link-color-active);
    }
  }
}

.projects-section {
  flex: 2;
  //background-color: var(--projects-section);
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 32px;
  padding: 32px 32px 0 32px;
  overflow: hidden;
  height: 80vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: auto;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);
  &-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 32px;
  }

  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    color: var(--main-color);

    p {
      font-size: 24px;
      line-height: 32px;
      font-weight: 700;
      opacity: 0.9;
      margin: 0;
      color: var(--main-color);
    }

    .time {
      font-size: 20px;
    }
  }

  &-pages {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    color: var(--main-color);
    border-radius: 32px;
    //margin: 325px 750px;
  }
}
.projects-section::-webkit-scrollbar{
  width:8px;
  border-radius: 10px;
  //background:rgba(190, 190, 190, 0.6)
}
.projects-section::-webkit-scrollbar-thumb{
  border-radius: 10px;
  //-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);
  background:rgba(121, 121, 121, 0.3);
  cursor: pointer;
}
.projects-section::-webkit-scrollbar-track{
  border-radius: 10px;
  cursor: pointer;
  //background: rgba(190, 190, 190, 0.6);
}
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

.messages-section {
  flex-shrink: 0;
  padding-bottom: 32px;
  //background-color: var(--projects-section);
  background-color: rgba(255, 255, 255, 0.7);
  margin-left: 24px;
  max-width: 200px;
  //flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 80vh;
  //height:400px;
  border-radius: 30px;
  position: relative;
  overflow: auto;
  transition: all 300ms cubic-bezier(0.19, 1, 0.56, 1);

  .projects-section-header {
    position: sticky;
    top: 0;
    z-index: 1;
    padding: 32px 24px 0 15px;
    //background-color: var(--projects-section);
  }
}

.message-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .name {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    color: var(--main-color);
    margin: 0;
  }
}

.messages{
  height: 100%;
  overflow-x:hidden;
  overflow-y:auto;
}
.messages::-webkit-scrollbar{
  width:8px;
  border-radius: 10px;
  //background:rgba(190, 190, 190, 0.6)
}
.messages::-webkit-scrollbar-thumb{
  border-radius: 10px;
  //-webkit-box-shadow:inset 0 0 5px rgba(0,0,0,0.2);
  background:rgba(121, 121, 121, 0.3)
}
.messages::-webkit-scrollbar-track{
  border-radius: 10px;
  //background: rgba(190, 190, 190, 0.6);
}

@media screen and (max-width: 200px) {
  .messages-section {
    transform: translateX(100%);
    position: absolute;
    opacity: 0;
    top: 0;
    z-index: 2;
    height: 100%;
    width: 100%;

    .messages-close {
      display: block;
    }
  }
}

@media screen and (max-width: 720px) {
  .app-name,
  .profile-btn span {
    display: none;
  }
  .app-header-right button {
    margin-left: 4px;
  }
}
@media screen and (max-width: 520px) {
  .projects-section {
    overflow: auto;
  }
  .project-boxes {
    overflow-y: visible;
  }

  .app-sidebar,
  .app-icon {
    display: none;
  }

  .app-content {
    padding: 16px 12px 24px 12px;
  }

  .status-number,
  .status-type {
    font-size: 10px;
  }

  .view-btn {
    width: 24px;
    height: 24px;
  }

  .app-header {
    padding: 16px 10px;
  }

  .search-input {
    max-width: 120px;
  }

  .profile-btn img {
    width: 24px;
    height: 24px;
  }

  .app-header {
    padding: 10px;
  }

  .projects-section-header p,
  .projects-section-header .time {
    font-size: 18px;
  }

  .status-type {
    padding-right: 4px;

    &:after {
      display: none;
    }
  }

  .search-input {
    font-size: 14px;
  }
}
</style>