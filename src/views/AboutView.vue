<template>
  <div class="about">
    <Heads :pageBtn="pageBtn"></Heads>
    <div class="img_box" ref="img_box" :style="{ width: fullWidth + 'px' }"></div>

    <canvas class="cavasBg" ref="juxing" width="400" height="400" @click="canvasDown($event)"
      @touchstart="canvasDown($event)"></canvas>
    <div to="body">
      <!-- 使用这个 modal 组件，传入 prop -->
      <modal :show="showModal" @close="showModal = false" @touchstart="showModal = false">
        <template #body>
          <p class="dialogdes">区域标识:<span class="agvNameNumber">{{ info }}</span></p>
          <div class="dialogdes">占用AGV:<button class="agvNameNumberbtn" v-for="(item, index) in infoCarList"
              :key="index">{{ item.agvName }}</button></div>
          <p class="dialogdes">备注:<span class="agvNameNumber">{{ des }}</span></p>
        </template>
      </modal>
    </div>
  </div>
</template>

<script>
import Heads from '@/components/heads.vue'
import Modal from '@/components/dialog.vue'
import staticMap from '../assets/img/tdemap.jpg'
import placePic from '../assets/img/place.png'



export default {
  name: 'about',
  components: {
    Heads,
    Modal
  },
  data() {
    return {
      showModal: false,
      fullWidth: document.documentElement.clientWidth,
      fullHeight: document.documentElement.clientHeight,
      pageBtn: '切换列表模式',
      dataJson: "",
      clickXY: [],
      mapData: "",
      newFiltered: [],
      infoCarList: [],
      info: '',
      des: '',
      areaMarkArr: [],
      Terminal: ''


    }
  },
  mounted() {
    // window.console.log(this.$router)
    this.handleResize();
  },
  methods: {
    handleResize() {
      this.fullWidth = document.documentElement.clientWidth
      this.fullHeight = document.documentElement.clientHeight
      console.log(this.fullWidth)
      //判断设备
      setTimeout(() => {
        // this=mthis
        var os = function () {
          var ua = navigator.userAgent,
            isWindowsPhone = /(?:Windows Phone)/.test(ua),
            isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
            isAndroid = /(?:Android)/.test(ua),
            isFireFox = /(?:Firefox)/.test(ua),
            isChrome = /(?:Chrome|CriOS)/.test(ua),
            isTablet = /(?:iPad|PlayBook)/.test(ua) || (isAndroid && !/(?:Mobile)/.test(ua)) || (isFireFox && /(?:Tablet)/.test(ua)),
            isPhone = /(?:iPhone)/.test(ua) && !isTablet,
            isPc = !isPhone && !isAndroid && !isSymbian;
          return {
            isTablet: isTablet,
            isPhone: isPhone,
            isAndroid: isAndroid,
            isPc: isPc
          };
        }();
        if (os.isAndroid || os.isPhone) {
          // 手机
          console.log("手机")
        } else if (os.isTablet) {
          // 平板
          console.log("平板")
          let Terminal = "平板"
          this.$data.Terminal = Terminal;
          this.map();

        } else if (os.isPc) {
          // pc
          console.log("PC")
          let Terminal = "PC"
          this.$data.Terminal = Terminal;
          this.map();

        }

      }, 50)

    },

    //生成地图区域框
    map() {
      //列表页面传过来的数据
      // console.log(this.$route.query.msgData);
      this.$data.dataJson = JSON.parse(this.$route.query.msgData);
      this.$data.mapData = JSON.parse(this.$route.query.mapData);
      let imgBox = this.$refs.img_box;
      // console.log(this.$route.query.mapData);
      const refWidth = this.$refs['img_box'].offsetWidth;
      const refHeight = this.$refs['img_box'].offsetHeight;
      let chose = this;
      let canvas = chose.$refs.juxing;
      console.log(canvas);
      let ctx = canvas.getContext("2d");
      canvas.width = refWidth;
      canvas.height = refHeight;
      ctx.translate(0, refHeight);
      ctx.rotate(180 / 180 * Math.PI);
      ctx.scale(-1, 1);
      ctx.fillStyle = "red";
      // ctx.arc(660, 500, 4, 0, 2 * Math.PI);
      // ctx.fill();
      // ctx.stroke();

      // });

      // let dataJson = [
      //   { "areaMark": "cross_BNG1_1", "x": "820", "y": "120" },
      //   { "areaMark": "cross_BHV2_2", "x": "840", "y": "240" },
      // ]

      //地图上标记好的区域点位坐标
      let newagvmark = [
        { "areaMark": "cross_BNG1_1", "x": "820", "y": "120", "w": "40", "h": "80" },
        { "areaMark": "cross_BHV2_2", "x": "840", "y": "240", "w": "20", "h": "80" },
        { "areaMark": "cross_Dhv2_2", "x": "680", "y": "360", "w": "20", "h": "73" },
        { "areaMark": "cross_BHV2_1", "x": "820", "y": "240", "w": "20", "h": "80" },
        { "areaMark": "cross_BNG9_2", "x": "820", "y": "50", "w": "20", "h": "60" },
        { "areaMark": "cross_BNG9_1", "x": "840", "y": "50", "w": "20", "h": "60" },
        { "areaMark": "cross_BNG3Rd", "x": "810", "y": "435", "w": "80", "h": "40" },
        { "areaMark": "cross_BNG3_2", "x": "840", "y": "495", "w": "20", "h": "90" },
        { "areaMark": "cross_BNG3_1", "x": "820", "y": "495", "w": "20", "h": "90" },
        { "areaMark": "cross_BNG8_2", "x": "820", "y": "630", "w": "20", "h": "80" },
        { "areaMark": "cross_BNG8_1", "x": "840", "y": "710", "w": "20", "h": "80" },
        { "areaMark": "cross_schjB_2", "x": "680", "y": "650", "w": "20", "h": "80" },
        { "areaMark": "cross_schjB_1", "x": "660", "y": "650", "w": "20", "h": "80" },
        { "areaMark": "cross_schjC_2", "x": "680", "y": "580", "w": "20", "h": "70" },
        { "areaMark": "cross_schjC_1", "x": "660", "y": "580", "w": "20", "h": "70" },
        { "areaMark": "cross_NG3B_2", "x": "680", "y": "490", "w": "20", "h": "40" },
        { "areaMark": "cross_NG3A", "x": "680", "y": "530", "w": "20", "h": "50" },
        { "areaMark": "cross_NG3Rd", "x": "640", "y": "435", "w": "85", "h": "40" },
        { "areaMark": "cross_BNG4_2", "x": "840", "y": "335", "w": "20", "h": "70" },
        { "areaMark": "cross_ju4Rd", "x": "480", "y": "435", "w": "85", "h": "40" },
        { "areaMark": "cross_ju4A_2", "x": "515", "y": "360", "w": "20", "h": "70" },
        { "areaMark": "cross_ju4A_1", "x": "490", "y": "360", "w": "20", "h": "70" },
        { "areaMark": "cross_ju4B_2", "x": "515", "y": "290", "w": "20", "h": "70" },
        { "areaMark": "cross_NG3B_1", "x": "660", "y": "360", "w": "20", "h": "73" },
        { "areaMark": "cross_ju4schj_1", "x": "660", "y": "255", "w": "20", "h": "73" },
        { "areaMark": "cross_ju4schj_2", "x": "680", "y": "255", "w": "20", "h": "100" },
        { "areaMark": "cross_schjA_2", "x": "660", "y": "735", "w": "20", "h": "70" },
        { "areaMark": "cross_schjA_1", "x": "680", "y": "735", "w": "20", "h": "70" },
        { "areaMark": "cross_A198", "x": "805", "y": "808", "w": "85", "h": "40" },
        { "areaMark": "cross_hcRd", "x": "635", "y": "808", "w": "85", "h": "40" },
        { "areaMark": "cross_jinzi1", "x": "470", "y": "808", "w": "85", "h": "40" },
        { "areaMark": "cross_A1_1", "x": "490", "y": "765", "w": "20", "h": "40" },
        { "areaMark": "cross_A1_2", "x": "515", "y": "765", "w": "20", "h": "40" },
        { "areaMark": "cross_jinzi_1", "x": "515", "y": "700", "w": "20", "h": "60" },
        { "areaMark": "cross_jinzi3_2", "x": "515", "y": "55", "w": "20", "h": "70" },
        { "areaMark": "cross_jinzi_2", "x": "515", "y": "635", "w": "20", "h": "60" },
        { "areaMark": "cross_ju3A_1", "x": "490", "y": "700", "w": "20", "h": "60" },
        { "areaMark": "cross_ju3A_2", "x": "515", "y": "580", "w": "20", "h": "50" },
        { "areaMark": "cross_ju3B_1", "x": "490", "y": "525", "w": "20", "h": "50" },
        { "areaMark": "cross_ju3B_2", "x": "515", "y": "525", "w": "20", "h": "50" },
        { "areaMark": "cross_A2_1", "x": "490", "y": "580", "w": "20", "h": "50" },
        { "areaMark": "cross_A2_2", "x": "490", "y": "635", "w": "20", "h": "60" },
      ]

      let areaMarkArr = [];
      let areaMarkObj = {};
      newagvmark.forEach(item => {
        areaMarkObj = {
          "areaMark": item.areaMark
        }
        areaMarkArr.push(areaMarkObj)
      })
      this.$data.areaMarkArr = areaMarkArr;
      if (this.dataJson !== undefined) {
        const ids = this.dataJson.map(e => e.areaMark);
        let filtered = newagvmark.filter(e => ids.includes(e.areaMark));


        this.mapData.forEach(item => {
          filtered.forEach((value, index) => {
            if (item.areaMark == value.areaMark) {
              value.areaAgvList = item.areaAgvList;
              value.des = item.des
            }
          })

        })

        this.$data.newFiltered = filtered;
        //根据后端返回的区域锁数据信息，在地图上标记矩形展示区域锁显示对应的位置  
        for (let i = 0; i < filtered.length; i++) {
          this.areaMarkArr.forEach(items => {
            if (filtered[i].areaMark == items.areaMark) {
              let x = filtered[i].x;
              let y = filtered[i].y;
              let infoName = filtered[i].areaMark;
              let infoCarList = filtered[i].areaAgvList;
              let des = filtered[i].des;
              let w = filtered[i].w;
              let h = filtered[i].h;
              ctx.strokeStyle = '#d01b1b'; //strokeStyle设置边框颜色
              //判断设备信息
              if (this.Terminal == "PC") {
                ctx.lineWidth = 4; //lineWidth设置图形边框的宽度
                ctx.rect(Number(x), Number(y), Number(w), Number(h))
                ctx.stroke()
                this.clickXY.push({ x: Number(x), y: Number(y), w: Number(w), h: Number(h), info: infoName, infoCarList: infoCarList, des: des })
              } else if (this.Terminal == "平板") {
                ctx.lineWidth = 3; //lineWidth设置图形边框的宽度
                ctx.rect(Number(x / 2.5), Number(y * 1.1), Number(w / 2), Number(h))
                ctx.stroke()
                this.clickXY.push({ x: Number(x / 2.5), y: Number(y * 1.1), w: Number(w / 2), h: Number(h), info: infoName, infoCarList: infoCarList, des: des })
              }

            }

          })

        }

      }

    },

    //点击地图上的红框弹出对应的详细信息
    canvasDown(event) {
      console.log("按下", event)
      let chose = this;
      let canvas = chose.$refs.juxing;
      let ctx = canvas.getContext("2d");
      ctx.translate(0, canvas.height);
      ctx.rotate(180 / 180 * Math.PI);
      ctx.scale(-1, 1);
      const rect = canvas.getBoundingClientRect();
      console.log("rect", rect)
      const x = Math.abs(event.clientX - rect.left);
      const y = Math.abs(event.clientY - rect.bottom);
      for (let i of this.clickXY) {
        // Check if the click event occurred within the rectangle
        if (x >= i.x && x <= (i.x + i.w) && y >= i.y && y <= (i.y + i.h)) {
          this.showModal = true;
          console.log("区域名称" + i.info, i.infoCarList)
          this.$data.info = i.info;
          console.log("区域小车列表", i.infoCarList)
          this.$data.infoCarList = i.infoCarList;
          this.$data.des = i.des;
          //这里可以根据i 来确定你需要执行的方法
          break
        }
      }

    },

    canvasMove(e) {
      console.log("移动")
    },
    canvasUp(e) {
      console.log("抬起")
    },

  },

  created() {
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },


}

</script>
<style>
.img_box {
  position: absolute;
  background: url('../assets/img/tdemap.jpg');
  width: 100%;
  height: calc(100vh - 80px);
  top: 80px;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  /* 保证盒子始终在窗口中心 */
  background-position: center center;

}

.cavasBg {
  position: absolute;
  z-index: 2;
  top: 80px;
}

.mapBtn {
  display: none;
}

.listBtn {
  display: block;
}

.agvNameNumber {
  margin-left: 10px;
  color: #df002b;
}

.agvNameNumberbtn {
  margin-left: 10px;
  color: #df002b;
  padding: 2px 3px;
}

.dialogdes {
  margin-bottom: 20px;
}

.modal-container {
  text-align: center;
}
</style>