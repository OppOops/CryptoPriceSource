import { computed, createApp, reactive, ref } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { publicPath } from '../vue.config'

class RectData {
  constructor(symbol) {
    this.symbol = symbol
    this.price  = ref("")
    this.change_ratio = ref(0)
    this.relativePosition = ref(50)
    this.leftArea_1 = computed(()=> this.floatLeftStyle(this.relativePosition.value))
    this.leftArea_2 = computed(()=> this.redGreenLeftStyle(this.relativePosition.value))

    this.rightArea_1 = computed(()=> this.redGreenRightStyle(this.relativePosition.value))
    this.rightArea_2 = computed(()=> this.floatRightStyle(this.relativePosition.value))
  }

  floatLeftStyle(width){
    if(width <= 0)
      return "display:None"
    
    width = (width >= 50) ? 50 : width
    // width = width * .95
    return `width: ${width}%; background-color:transparent`
  }

  floatRightStyle(width){
    if(width >= 100)
      return "display:None"
    width = (width <= 50) ? 50 : 100 - width

    // width = width * .95
    return `width: ${width}%; background-color:transparent`
  }

  redGreenLeftStyle(width){    
    if(width >= 50)
      return "display:None"
    width = (width <= 0) ? 0 : 50 - width
    // width = width * .95
    return `width: ${width}%; background-color:red`  
  }

  redGreenRightStyle(width){    
    if(width <= 50)
      return "display:None"
    width = (width >= 100) ? 50 : width - 50
    // width = width * .95
    return `width: ${width}%; background-color:green`  
  }
}


const data = reactive({
  assignedApplications: [
      new RectData("BTC-USDT") ,
      new RectData("ETH-USDT") 
   ]
})

function asRatio(last, high, low){
  if(high-low < 1e-8)
    return 50
  return ((last-low)/(high-low)) * 100
}
function retChange(prev, last){
  if(prev < 1e-8)
    return 0
  return (last - prev) / prev * 100
}
function registerServiceWorker() {
  console.log("public path", publicPath)
  let path = (publicPath==="/") ? "./" : publicPath

  if ('serviceWorker' in navigator) {
     navigator.serviceWorker.register(path + 'sw.js') //
        .then(function(){
            console.log("service worker registered")
        }).catch(function(err) {
            console.log(err)
        });
  }
  else {
    console.log("Could not find serviceWorker in navigator")
  }
}


App.created = function(){
  if(process.env.NODE_ENV === 'production')
    registerServiceWorker()
  var url = "wss://stream.binance.com:9443/ws/streamTest"
  var ws  = new WebSocket(url)

  var req = {
    "method": "SUBSCRIBE",
    "params": [
      "btcusdt@kline_1d",
      "ethusdt@kline_1d",
    ],
    "id": 1
  }

  ws.onopen = function(){
      console.log("connected!")
      ws.send(JSON.stringify(req))
  }

  ws.onmessage = function(e){
    let obj = JSON.parse(e.data)
    if(obj.s === undefined)
      return
    let symbol = obj.s
    let closePrice  = obj.k.c
    
    let openPrice = parseFloat(obj.k.o)
    let lastPrice = parseFloat(obj.k.c) 
    let highPrice = parseFloat(obj.k.h)
    let lowPrice = parseFloat(obj.k.l)
    let ratio = asRatio(lastPrice, highPrice, lowPrice)
    let change = retChange(openPrice, lastPrice)

    if(symbol == "BTCUSDT"){
      data.assignedApplications[0].price = closePrice
      data.assignedApplications[0].relativePosition = ratio
      data.assignedApplications[0].change_ratio     = change.toFixed(2)

    }else if(symbol == "ETHUSDT"){
      data.assignedApplications[1].price = closePrice
      data.assignedApplications[1].relativePosition = ratio
      data.assignedApplications[1].change_ratio     = change.toFixed(2)

    }

  }

  ws.onclose   = function(e){
      console.log("stream is close")
      console.log(e)
  }

  // setInterval(() => {
  //   for(let i = 0; i< data.assignedApplications.length; i++)
  //   {
  //     let item = data.assignedApplications[i];
  //     item.relativePosition = (item.relativePosition + i + 1) % 100
  
  //   }
  //   // console.log(data.assignedApplications)
  // }, 1000)
}

App.data = function(){
  console.log("data created")
  return data
}


App.methods = {
  update: function(){
    data.assignedApplications[0].relativePosition = (data.assignedApplications[0].relativePosition + 1)%100
    data.assignedApplications[1].relativePosition = (data.assignedApplications[1].relativePosition + 2)%100
  }
}

createApp(App).mount('#app')
