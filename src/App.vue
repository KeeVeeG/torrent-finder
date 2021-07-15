<template>
  <div id="app">
    <div class="search" :class="first?'first':''">
      <input v-on:keydown.enter="Search()" type="text" v-model="search">
      <button 
      :class="search.length>1?'active':''" @click="Search()">Search</button>
    </div>
    <div v-if="torrents.length>0" class="table">
      <div class="row header">
        <div class="cell date">Date</div>
        <div class="cell name">Name</div>
        <div class="cell size">Size</div>
        <div class="cell peers">Peers</div>
        <div class="cell download">Download</div>
      </div>
      <div class="row" v-for="(item, index) in torrents" :key="index">
        <div class="cell date">{{item.date}}</div>
        <div class="cell name">{{item.name}}</div>
        <div class="cell size">{{item.size}}</div>
        <div class="cell peers">{{item.peers}}</div>
        <div class="cell download">
          <div>
            <button @click="Magnet(item.hrefDownload)">
              <img  src="~@/assets/magnet.png">
            </button>
            <button @click="Torrent(item.hrefDownload, item.name)">
              <img  src="~@/assets/download.png">
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="notfound" class="notfound">NOT FOUND</div>
    <div class="loading" v-if="loading">
        <div></div>
        <div></div>
        <div></div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FileDownload from 'js-file-download'

export default {
  name: 'torrent-finder',
  data() {
    return {
      first: true,
      notfound: false,
      loading: false,
      domain: process.env.NODE_ENV==='production'?"https://young-brushlands-59138.herokuapp.com/":"http://localhost:80/",
      search: "",
      torrents: []
    }
  },
  methods:{
    Search(){
      if(this.search.length<1) return
      this.first=false
      this.notfound=false
      this.loading=true
      axios.get(this.domain,{params:{name:this.search}}).then(res=>{
        this.torrents=res.data
        this.notfound=this.torrents<1
        this.loading=false
      })
    },
    Magnet(href){
      this.loading=true
      axios.get(this.domain+"magnet",{params:{href:href}}).then(res=>{
        window.location=res.data
        this.loading=false
      })
    },
    Torrent(href, name){
      this.loading=true
      axios.get(this.domain+"torrent",{responseType:'blob',params:{href:href}}).then(res=>{
        FileDownload(res.data, "[github.com/KeeVeeG] "+name+".torrent")
        this.loading=false
      })
    }
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
      &.date, &.name, &.size, &.peers{
        border-right: $border;
      }
      &.name{
        padding-left: 15px;
      }
    }
    &.header>.cell{
      font-weight: 600;
    }
  }
  .date, .size, .peers, .download{
    text-align: center;
  }
  .download{
    div{
      display: flex;
      justify-content: space-around;
      button{
        cursor: pointer;
        background: transparent;
        border: none;
      }
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
  position: absolute;
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
</style>
