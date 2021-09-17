<template>

  <div id="app" class="container">
    <div class="row">
    <!-- <div class="col-sm-2"></div> -->
    <div class="col-sm">
    <table class="table" >
       <thead>
        <tr>
        <th scope="col"></th>
        <th scope="col">價格</th>
        <th scope="col">變化 (%)</th>
        <th scope="col">24hr-相對變化</th>
        </tr>
      </thead>
      <tbody>
      <tr v-for="a in assignedApplications" :key="a">
          <th scope="row">{{a.symbol}}</th>
          <td>{{a.price}}</td>
          <td>{{a.change_ratio}} %</td>
          <td> 
            <div class="row_container">
              <div :style="a.leftArea_1" ></div>
              <div :style="a.leftArea_2" ></div>
              <div :style="a.rightArea_1" ></div>
              <div :style="a.rightArea_2" ></div>
            </div>
            <!-- <div style="width:10%; background-color:green; display: inline-block" ></div>             -->
          </td>
      </tr>
      </tbody>
    </table>
    <!-- <a href="#" v-on:click.prevent="update">Update</a> -->
    </div>
    </div>
  </div>

</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.row_container {
    display: flex;
}
.row_container > div {
    height: 10px;
}
</style>
