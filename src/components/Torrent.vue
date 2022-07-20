<template>
  <div v-frag>
    <div class="row">
      <div class="cell date">{{ date }}</div>
      <div class="cell name">{{ name }}</div>
      <div class="cell size">{{ size }}</div>
      <div class="cell peers">{{ peers }}</div>
      <div class="cell download">
        <div>
          <button @click="Magnet(hrefDownload)">
            <img src="~@/assets/magnet.png" />
          </button>
          <button @click="Torrent(hrefDownload, name)">
            <img src="~@/assets/download.png" />
          </button>
        </div>
      </div>
      <div class="cell description" :class="isOpen ? 'open' : ''">
        <button @click="Open(href)">
          <img src="~@/assets/down-arrow.png" />
        </button>
      </div>
    </div>
    <div v-if="isOpen && description.length > 0" class="row">
      <td class="text" colspan="6" v-html="description"></td>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import FileDownload from 'js-file-download'
import frag from 'vue-frag'

export default {
  name: 'torrent-finder',
  directives: { frag },
  props: { torrent: Object },
  data() {
    return {
      date: this.torrent.date,
      name: this.torrent.name,
      size: this.torrent.size,
      peers: this.torrent.peers,
      hrefDownload: this.torrent.hrefDownload,
      href: this.torrent.href,
      isOpen: false,
      description: '',
    }
  },
  computed: {
    domain() {
      return this.$store.state.domain
    },
  },
  methods: {
    Magnet(href) {
      this.$store.commit('SetLoadingStatus', true)
      axios
        .get(this.domain + 'magnet', { params: { href: href } })
        .then(res => {
          window.location = res.data
          this.$store.commit('SetLoadingStatus', false)
        })
    },
    Torrent(href, name) {
      this.$store.commit('SetLoadingStatus', true)
      axios
        .get(this.domain + 'torrent', {
          responseType: 'blob',
          params: { href: href },
        })
        .then(res => {
          FileDownload(res.data, '[github.com/KeeVeeG] ' + name + '.torrent')
          this.$store.commit('SetLoadingStatus', false)
        })
    },
    Open(href) {
      this.isOpen = !this.isOpen
      if (!this.isOpen || this.description.length > 0) return
      this.$store.commit('SetLoadingStatus', true)
      axios
        .get(this.domain + 'description', { params: { href: href } })
        .then(res => {
          this.description = res.data
          this.$store.commit('SetLoadingStatus', false)
        })
    },
  },
}
</script>

<style scoped lang="scss">
.row {
  display: table-row;
  &:nth-child(even) {
    background: #e0faff;
  }
  .cell {
    padding: 5px;
    display: table-cell;
    vertical-align: middle;
    $border: 1px solid #c2d5da;
    &.date,
    &.name,
    &.size,
    &.peers,
    &.download {
      border-right: $border;
    }
    &.name {
      padding-left: 15px;
    }
    button {
      cursor: pointer;
      background: transparent;
      border: none;
    }
  }
  &.header > .cell {
    font-weight: 600;
  }
}
.date,
.size,
.peers,
.download,
.description {
  text-align: center;
}
.download {
  div {
    display: flex;
    justify-content: space-around;
  }
}
.description {
  transition: transform 0.3s ease;
  &.open {
    transform: scale(-100%);
  }
}
.text {
  padding: 10px 15px;
}
</style>
