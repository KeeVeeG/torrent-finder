<template>
  <div id="app">
    
    <div class="search" :class="first?'first':''">
      <input v-on:keydown.enter="Search()" type="text" v-model="search">
      <button 
      :class="search.length>0?'active':''" @click="Search()">Search</button>
    </div>

    <div v-if="torrents.length>0" class="table">
      <div class="row header">
        <div class="cell date">Date</div>
        <div class="cell name">Name</div>
        <div class="cell size">Size</div>
        <div class="cell peers">Peers</div>
        <div class="cell download">Download</div>
      </div>
    <Torrent v-for="(item,index) in torrents"
    :key="index+item.name" :torrent="item"/>
    </div>

    <div v-if="notFound" class="notfound">NOT FOUND</div>
    <div class="loading" v-if="loading">
      <div></div>
      <div></div>
      <div></div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'
import Torrent from '@/components/Torrent.vue'

export default {
  name: 'torrent-finder',
  components:{Torrent},
  data() {
    return {
      first: true,
      notFound: false,
      search: "",
      torrents: []
    }
  },
  computed:{
    loading(){  
      return this.$store.state.loading
    },
    domain(){  
      return this.$store.state.domain
    }
  },
  methods:{
    Search(){
      if(this.search.length<1) return
      this.first=false
      this.notFound=false
      this.$store.commit('SetLoadingStatus',true)
      axios.get(this.domain,{params:{name:this.search}}).then(res=>{
        this.torrents=res.data.map(e=>{
          e.open=false
          e.description=""
          return e
        })
        this.notFound=this.torrents<1
        this.$store.commit('SetLoadingStatus',false)
      })
    },
  },
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Play:wght@400;700&display=swap');
*{
  margin: 0;
  padding: 0;
  outline: none;
  font-family: 'Play', sans-serif;
  font-size: 16px;
}
$blue: #4dbac9;
.search{
  display:flex;
  width:100%;
  height:80px;
  justify-content:center;
  align-items:center;
  transition: height .7s ease;
  &.first{
    height:100vh;
  }
  input{
    box-sizing:border-box;
    height: 35px;
    width: 300px;
    border: 3px solid $blue;
    border-right: none;
    padding: 5px;
    border-radius: 5px 0 0 5px;
    outline: none;
    color: #333836;
  }
  button{
    height: 35px;
    border: 1px solid $blue;
    background: $blue;
    text-align: center;
    color: #9bd5dd;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    padding: 5px;
    &.active{
      color: white
    }
  }
}
.table{
  display: table;
  width: 95%;
  margin: 0 auto;
  padding: 0 10px;
  .row{
    display: table-row;
    &:nth-child(even){
      background:#e0faff;
    }
    .cell{
      padding: 5px;
      display: table-cell;
      vertical-align:middle;
      $border: 1px solid #c2d5da;
      &.date, &.name, &.size, &.peers, &.download{
        border-right: $border;
      }
      &.name{
        padding-left: 15px;
      }
      button{
        cursor: pointer;
        background: transparent;
        border: none;
      }
    }
    &.header>.cell{
      font-weight: 600;
    }
  }
  .date, .size, .peers, .download, .description{
    text-align: center;
  }
  .download{
    div{
      display: flex;
      justify-content: space-around;
    }
  }
}
.notfound{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  font-weight: 900;
  color: $blue;
  font-size: 5rem;
  font-style: italic;
}
.loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  width: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid white;
    background: $blue;
    &:nth-child(1){
      animation: bouncing 0.4s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95);
    }
    &:nth-child(2){
      animation: bouncing 0.4s 0.1s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95) backwards;
    }
    &:nth-child(3){
      animation: bouncing 0.4s 0.2s alternate infinite cubic-bezier(0.6, 0.05, 0.15, 0.95) backwards;
    }
  }
}
@keyframes bouncing {
  0% {
    transform: translate3d(0, 10px, 0) scale(1.2, 0.85);
  }
  100% {
    transform: translate3d(0, -20px, 0) scale(0.9, 1.1);
  }
}
@media (max-width:700px) {
  *{
    font-size: 12px;
  }
}
@media (max-width:415px){
  .date{
    display: none!important;
  }
  .name{
    padding-left:5px!important;
  }
}
.hidewrap{
  display: none;
}
</style>
