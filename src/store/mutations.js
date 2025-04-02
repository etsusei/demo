import * as types from './mutation-types';
const mutations={
    [types.PushTracks](state,songs){
        state.tracks.splice(0,state.tracks.length);
        for(var i=0;i<songs.length;i++){
            state.tracks.push({
                id:songs[i].id,
                name:songs[i].name,
                artist:songs[i].ar[0].name,
                album:songs[i].al.name,
                cover:songs[i].al.picUrl,
                source:"https://music.163.com/song/media/outer/url?id="+songs[i].id+".mp3"
            })
        }
    },
    [types.PushSearchTracks](state,songs){
        state.tracks.splice(0,state.tracks.length);
        for(var i=0;i<songs.length;i++){
            state.tracks.push({
                id:songs[i].id,
                name:songs[i].name,
                artist:songs[i].artists[0].name,
                album:songs[i].album.name,
                cover:"",
                source:"https://music.163.com/song/media/outer/url?id="+songs[i].id+".mp3"
            })
        }
    },
    [types.GetIndex](state,index){
        state.index=index
    },
    [types.PushIndex](state,currentIndex){
        state.currentIndex=currentIndex;
    }
}
export default mutations;