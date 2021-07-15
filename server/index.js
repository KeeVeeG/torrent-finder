import express from "express"
import axios from 'axios'
import {JSDOM} from 'jsdom'
import http from 'http'
const app = express()
const PORT = process.env.PORT || 80
const ip = "http://5.45.86.39"

app.get('/',(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    axios.get(encodeURI(ip+"/search/0/0/010/2/"+encodeURI(req.query.name)+"/")).then(response=>{
        if(response.status!==200) return
        let data = response.data
        var doc = new JSDOM(data).window.document
        let list = [...doc.querySelectorAll('#index>table>tbody>tr')]
        list.shift()
        list = list.filter(e=>e.querySelectorAll("td")[1].querySelectorAll("a")[0]!==undefined && e.querySelectorAll("td")[1].querySelectorAll("a")[1]!==undefined)
        list = list.map(e=>{
          function GetPeers(str){
            return str.slice(str.indexOf(";")+1)
          }
          function FormatDate(str){
            const dict = {
              "Янв":"01", "Фев":"02", "Мар":"03", "Апр":"04", "Мая":"05", "Июн":"06", "Июл":"07", "Авг":"08", "Сен":"09", "Окт":"10", "Ноя":"11", "Дек":"12",
            }
            let date = str.split("&nbsp;")
            date[1]=dict[date[1]]
            return date.join("/")
          }
          return {
            date:FormatDate(e.querySelectorAll("td")[0].innerHTML),
            hrefDownload:e.querySelectorAll("td")[1].querySelectorAll("a")[0].getAttribute("href"),
            href:e.querySelectorAll("td")[1].querySelectorAll("a")[1].getAttribute("href"),
            name:e.querySelectorAll("td")[1].querySelectorAll("a")[1].innerHTML,
            size:e.querySelectorAll("td")[3].innerHTML.split("&nbsp;").join(" "),
            peers:GetPeers(e.querySelectorAll("td")[4].querySelector(".green").innerHTML)
          }
        })
        res.send(list.filter(e=>e.peers>=10))
    })
})

app.get('/magnet',(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    axios.get(encodeURI(ip+req.query.href)).then(response=>{
        if(response.status!==200) return
        let data = response.data
        let doc = new JSDOM(data).window.document
        res.send(doc.querySelector("#download_page_buttons").querySelectorAll("a")[1].getAttribute("href"))
    })
})

app.get('/torrent',(req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    axios.get(encodeURI(ip+req.query.href)).then(response=>{
        if(response.status!==200) return
        let data = response.data
        let doc = new JSDOM(data).window.document
        let url = ip+doc.querySelector("#download_page_buttons").querySelectorAll("a")[0].getAttribute("href")
        http.get(url, (getRes)=>{
          res.setHeader("content-type", getRes.headers['content-type']);
          getRes.pipe(res);
        });
    })
})

app.get('/description',(req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  axios.get(encodeURI(ip+req.query.href)).then(response=>{
      if(response.status!==200) return
      let data = response.data
      let doc = new JSDOM(data).window.document
      res.send(doc.querySelectorAll("#details>tbody>tr")[0].innerHTML.replace(/\<a href=".*?\">/g, ''))
  })
})

app.listen(PORT,()=>{
  console.log("Started")
})