<template>
  <div class="cover-warpper" v-for="(track, $index) in result" :key="$index">
    <router-link :to="{name:'List',params:{listId:`${track.id}`}}">
      <div
        class="cover"
        :style="{ backgroundImage: `url(${track.coverImgUrl})` }"
        @click="toList"
      ></div>
    </router-link>
    <div class="name">{{ track.name }}</div>
  </div>
</template>

<script>
export default {
  props: ["result"],
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss">
.cover-warpper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 200px;
  width: 200px;
  margin: 30px 37px;
}
.cover {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 175px;
  height: 175px;
  border-radius: 20px;
  padding: 0 0 0 0;
  margin: auto;
  cursor: pointer;
}
.cover:hover {
  width: 185px;
  height: 185px;
  transition: all 0.3s ease-in-out;
}
</style>