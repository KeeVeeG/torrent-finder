<template>
  <div id="app">
    <div class="search">
      <input type="text" v-model="search">
      <button @click="Search()">Search</button>
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
            <button @click="Torrent(item.hrefDownload)">
              <img  src="~@/assets/download.png">
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'torrent-finder',
  data() {
    return {
      domain: "https://young-brushlands-59138.herokuapp.com/",
      search: "",
      torrents: []
    }
  },
  methods:{
    Search(){
      axios.get(this.domain,{params:{name:this.search}}).then(res=>this.torrents=res.data)
    },
    Magnet(href){
      axios.get(this.domain+"magnet",{params:{href:href}}).then(res=>window.location=res.data)
    },
    Torrent(href){
      axios.get(this.domain+"torrent",{params:{href:href}}).then(res=>window.location=res.data)
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
.search{
  display:flex;
  width:100%;
  height:80px;
  justify-content:center;
  align-items:center;
  $blue: #4dbac9;
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
    height: 34px;
    border: 1px solid $blue;
    background: $blue;
    text-align: center;
    color: white;
    border-radius: 0 5px 5px 0;
    cursor: pointer;
    padding: 5px;
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
</style>
