<template>
  <div class="header">
    <div class="headerChild">
      <div class="logo">{{ logoname }}</div>
      <div class="logoDes">{{ logoDes }}</div>
      <!-- <div>{{ msgData }}</div> -->
      <div class="cutMap"><span @click="handle()">{{ pageBtn }}</span></div>
      <div style="clear: both;"></div>
    </div>
  </div>
</template>
  
<script>
export default {
  data() {
    return {
      logoname: 'DENSO',
      logoDes: 'AGV区域锁监控系统',
    }
  },
  props: ['pageBtn', 'msgData','mapData'],

  mounted() {
    window.Vue = this;
  },

  methods: {
    handle() {
      if (this.pageBtn == "切换地图模式") {
        this.$router.push({
          path: '/about',
          query: {
            id: Date.now(), //动态id 进行路由动态更新 从而促使每次跳转保持路由的刷新
            msgData: JSON.stringify(this.msgData),
            mapData:JSON.stringify(this.mapData),
          }
        }).catch(err => { })
      } else {
        this.$router.push({
          path: '/',
          query: {
            id: Date.now(), //动态id 进行路由动态更新 从而促使每次跳转保持路由的刷新
          }
        }).catch(err => { })
      }


    },

  }


}
</script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
.header {
  width: 100%;
  height: 80px;
  background: #df002b;
  position: fixed;
  z-index: 999;
}

.headerChild {
  line-height: 80px;
  padding-left: 25px;
  color: #fff;
}

.logo {
  font-size: 30px;
  font-weight: 500;
  font-style: italic;
  float: left;
}

.cutMap {
  float: right;
  margin-right: 40px;
  cursor: pointer;
  float: right;
}

.cutMap a {
  text-decoration: none;
  color: #fff;
}

.logoDes {
  float: left;
  margin-left: 30px;
  letter-spacing: 2px;
}</style>
  