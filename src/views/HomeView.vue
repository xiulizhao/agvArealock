<template>
    <div class="HomeView">
        <Heads :msgData="newdataJson" :pageBtn="pageBtn" :mapData="firstDataJson"></Heads>
        <!-- <tdeIndex></tdeIndex> -->
        <div class="main">
            <!-- 需要动态化的内容 -->
            <div class="moduleList" v-for="(item, index) in       newdataJson      " :key="index" ref="moduleList">
                <div class="areaListUl">
                    <div class="areaList">区域标识:</div>
                    <div class="areaList">占用AGV:</div>
                    <div class="areaList">备注:</div>
                    <!-- <button class="releaseBtn" id="show-modal" @click="showModal = true">强制释放</button> -->
                    <button class="releaseBtn" @click="release($event)" @touchstart="release($event)"
                        :agvName='item.agvName' :areaMark='item.areaMark'>强制释放</button>
                </div>
                <div class="data_alue" ref="data_alue">
                    <div class="areaList1 areaList3" :title="item.areaMark" @click="showModal = true; addLikes($event);"
                        @touchstart=" showModal = true; addLikes($event); ">
                        {{ item.areaMark }}</div>
                    <div class="areaList1 area">{{ item.agvName }}</div>
                    <div class="areaList1 areaList2" :title=" item.des " ref="remark"
                        @click=" showModal = true; addLikes($event); " @touchstart=" showModal = true; addLikes($event); ">
                        {{
                        item.des }}</div>
                </div>
                <div style="clear: both;"></div>
            </div>
            <!-- 获取空数据的时候 -->
            <div class="dataPic hide" ref="dataPic">
                <img :src=" dataPic " alt="">
                <span>暂无区域锁数据</span>
            </div>
            <!-- 网络不同的情况 -->
            <div class="networkPic hide" ref="networkPic">
                <img :src=" networkPic " alt="">
                <span>区域锁数据获取失败</span><br>
                <span>请检查网络后，重新加载页面</span><br>
                <input class="refrestBtn" type="button" onclick="javascript:location.reload();" value="刷新页面">
            </div>
            <!-- 连接成功没有没有数据时加载转圈 -->
            <div class="upload hide" ref="upload">
                <div class="spinner"></div>
                <span>loading</span>
            </div>
            <!-- 释放弹出框 -->
            <div class="Modals hide">
                <div class="Modalslist1">是否强制释放通行锁？</div>
                <div class="Modalslist1">
                    区域标识:<span class="agvNameNumber dialogdes">{{ areaMark }}</span>
                </div>
                <div class="Modalslist">
                    占用AGV:<span class="agvNameNumber dialogdes">{{ agvName }}</span>
                </div>
                <div class="ModalslistBtn">
                    <button class="clearBtn releaseBtn3" :agvName= this.agvName  :areaMark= this.areaMark 
                        @click=" cancel($event); getUnlock($event); "
                        @touchstart=" cancel($event); getUnlock($event); ">确定</button>
                    <button class="closeBtn releaseBtn4" @click=" cancel($event) "
                        @touchstart=" cancel($event) ">取消</button>
                </div>

            </div>
            <div class="md-overlay hide"></div>
            <div to="body">
                <!-- 使用这个 modal 组件，传入 prop -->
                <modal :show=" showModal " @close=" showModal = false ">
                    <template #body>
                        <span class="dialogdes">{{ DesJson }}</span>
                    </template>
                </modal>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Heads from '@/components/heads.vue'
import tdeIndex from '@/components/tdeindex.vue'
import Modal from '@/components/dialog.vue'
import TdeBtn from '../assets/img/tdeBtn.png'
import dataPic from '../assets/img/datapic.png'
import networkPic from '../assets/img/networkPic.png'

import api from '../api/index'
import { mapActions } from 'vuex';

export default {
    name: 'HomeView',
    components: {
        Heads,
        tdeIndex,
        Modal
    },
    data() {
        return {
            newdataJson: [],    //页面显示最终操作的数组
            showModal: false,
            aaa: '',
            bbb: '',
            newDes: [],
            DesJson: "",
            fullWidth: document.documentElement.clientWidth,
            fullHeight: document.documentElement.clientHeight,
            agvName: '',
            areaMark: '',
            dataJson: [],
            path: 'ws://localhost:9090/netserver/1',  //使用websocket
            // path: 'ws://192.168.3.250:12345/netserver/1',  //使用websocket
            sockernum: 0,
            socket: '',
            newcar: [],
            newAdddataJson: [],   //通过新增获取的新数据
            firstDataJson: [],      //第一次获取的数据
            newAddData: {},
            dataPic: dataPic,
            networkPic: networkPic,
            pageBtn: '切换地图模式',


        }
    },
    mounted() {
        //初始化数据
        // this.init();
        this.addsocket();
        //判断屏幕尺寸大小
        this.handleResize();

    },
    methods: {
        //检测屏幕尺寸
        handleResize() {
            this.fullWidth = document.documentElement.clientWidth
            this.fullHeight = document.documentElement.clientHeight
            console.log(this.fullWidth)
            this.Terminal();
        },
        //判断终端设备
        Terminal() {
            setTimeout(() => {
                // this=mthis
                let os = function () {
                    let ua = navigator.userAgent,
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
                    let chose = this
                    let chosedom = chose.$refs.moduleList || [];
                    let data_alue = chose.$refs.data_alue || [];
                    // let Remark = chose.$refs.remark || [];
                    // console.log(Remark);
                    for (let i = 0; i < chosedom.length; i++) {
                        let module_list = chosedom[i];
                        module_list.style.width = '327px';
                    }
                    for (let i = 0; i < data_alue.length; i++) {
                        let dataAlue = data_alue[i];
                        dataAlue.style.width = '200px';
                    }

                    // for (let i = 0; i < Remark.length; i++) {
                    //     let Re_mark = Remark[i];
                    //     // console.log(Re_mark);

                    // }


                } else if (os.isPc) {
                    // pc
                    console.log("PC")
                    let chose = this
                    let chosedom = chose.$refs.moduleList || [];
                    let data_alue = chose.$refs.data_alue || [];
                    // let Remark = chose.$refs.remark || [];
                    // console.log(Remark);
                    for (let i = 0; i < chosedom.length; i++) {
                        let module_list = chosedom[i];
                        module_list.style.width = '434px';
                    }
                    for (let i = 0; i < data_alue.length; i++) {
                        let dataAlue = data_alue[i];
                        dataAlue.style.width = '280px';
                    }

                    // for (let i = 0; i < Remark.length; i++) {
                    //     let Re_mark = Remark[i];
                    //     // console.log(Re_mark);

                    // }

                }

            }, 50)
        },

        //关闭websocket
        closeWebsocket() {
            if (this.socket) {
                this.socket.close();
            }
        },
        //连接websocket方法
        addsocket() {
            // console.log(this.path)
            if ('WebSocket' in window) {
                console.log('您的浏览器支持WebSocket');
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                // this.socket.onopen = this.open
                const params = {
                    "operatetype": "1"
                }
                this.socket.onopen = (enent) => {
                    // Web Socket 已连接上，使用 send() 方法发送数据
                    // alert('数据发送中...')
                    this.socket.send(JSON.stringify(params));//初始化请求数据传给服务器端的参数
                    console.log("已经连接上了")
                    let upload = this.$refs.upload;
                    upload.classList.remove("hide");
                }
                // 监听socket错误信息
                this.socket.onerror = (msg) => {
                    console.log('错误信息：' + msg)
                    let networkPic = this.$refs.networkPic;
                    networkPic.classList.remove("hide");

                }
                // 监听socket消息
                this.socket.onmessage = (msg) => {
                    this.Terminal();
                    console.log('websocket收到数据：', msg.data)
                    const dataJson = JSON.parse(msg.data)   //后端返回的数据
                    console.log(typeof dataJson)
                    console.log("websocket收到转化完的数据", dataJson)

                    let newdata = [];         //新建一个空数据
                    let newDes = [];         //新建一个描述的空数组
                    if (dataJson != "") {    //收到的数据不为空的时候
                        let upload = this.$refs.upload;
                        upload.classList.add("hide");
                        let dataPic = this.$refs.dataPic;
                        dataPic.classList.add("hide");
                        for (let i = 0; i < dataJson.length; i++) {
                            // console.log(dataJson[i]);
                            //判断返回的数据是否存在"operatetype":"asklock"/"operatetype":"releaselock",是否存在
                            if (dataJson[i].hasOwnProperty("operatetype")) {    // 返回的数据存在operatetype属性
                                console.log("新数据有operatetype属性");
                                if (dataJson[i].operatetype == "asklock") {    //增加锁判断有asklock属性
                                    console.log("有operatetype属性，属性值为新增asklock");
                                    this.$data.newcar = dataJson;     // 将新获取的值存入到一个新的newcar数组中
                                    console.log("新增加的时候获取的时候返回的新数据格式", this.newcar)
                                    console.log("this", this.firstDataJson)
                                    //添加锁改变的数据
                                    if (this.firstDataJson != "") {
                                        //原来的数据不为空
                                        this.firstDataJson.forEach((n) => {
                                            let aa1 = {};
                                            let tt = n.areaMark
                                            let areaAgvList = n.areaAgvList;
                                            this.newcar.forEach((m) => {
                                                let kk = m.zoneid
                                                console.log("kk", kk)

                                                const hasSameName = this.firstDataJson.some(obj1 => {
                                                    return this.newcar.some(obj2 => {
                                                        return Object.keys(obj1).includes('areaMark') && Object.keys(obj2).includes('zoneid') && obj1.areaMark === obj2.zoneid;
                                                    });
                                                });

                                                console.log("areaMark是否存在", hasSameName);

                                                if (hasSameName) {    //判断数组中存在该区域名字
                                                    console.log("数组中存在该区域名字");
                                                    if (tt.indexOf(kk) != -1) {
                                                        aa1 = {
                                                            "agvName": m.agvid
                                                        }
                                                        areaAgvList.push(aa1)
                                                    }

                                                } else {

                                                    console.log("没有相同的名字");
                                                    let newAddData = {};
                                                    this.newcar.forEach((item) => {
                                                        let areaMark = item.zoneid;
                                                        let des = item.des;
                                                        let agvName = item.agvid;

                                                        this.newAddData = {
                                                            "areaMark": areaMark,
                                                            "des": des,
                                                            "areaAgvList": [
                                                                { "agvName": agvName }
                                                            ]

                                                        }
                                                    })

                                                    console.log("新增新的数据了并且原有的数据不存在的情况", newAddData)
                                                    this.$data.firstDataJson.push(this.newAddData);

                                                }

                                            })

                                        })

                                        console.log("新增相同的数据", this.firstDataJson)
                                        this.$data.newAdddataJson = this.firstDataJson;

                                        this.newAdddataJson.forEach((itme) => {
                                            let dataJsonareaMark = itme.areaMark;
                                            let dataJsondes = itme.des;
                                            let dataJsonareaAgvList = itme.areaAgvList;
                                            let datas = {};
                                            let datas1 = {};

                                            for (let j = 0; j < dataJsonareaAgvList.length; j++) {
                                                let dataJsonagvName = dataJsonareaAgvList[j].agvName;
                                                datas = {
                                                    "areaMark": dataJsonareaMark,
                                                    "des": dataJsondes,
                                                    "agvName": dataJsonagvName
                                                }
                                                newdata.push(datas);
                                                this.$data.newdataJson = newdata;
                                                datas1 = {
                                                    "des": dataJsondes,
                                                }
                                                newDes.push(datas1);

                                                this.$data.newDes = newDes;

                                            }

                                        })

                                    } else {
                                        //整体数据为空的时候
                                        console.log("走了整体数据为空值的时候添加了新锁");
                                        let datas11 = {};
                                        let datas1arr = []
                                        for (let i = 0; i < dataJson.length; i++) {

                                            datas11 = {
                                                "areaMark": dataJson[i].zoneid,
                                                "des": dataJson[i].des,
                                                "agvName": dataJson[i].agvid
                                            }
                                            datas1arr.push(datas11);
                                            this.$data.newdataJson = datas1arr;

                                            this.$data.newcar = dataJson;
                                            let newAddData = {};
                                            this.newcar.forEach((item) => {
                                                let areaMark = item.zoneid;
                                                let des = item.des;
                                                let agvName = item.agvid;

                                                this.newAddData = {
                                                    "areaMark": areaMark,
                                                    "des": des,
                                                    "areaAgvList": [
                                                        { "agvName": agvName }
                                                    ]

                                                }
                                            })
                                            this.$data.firstDataJson.push(this.newAddData);

                                        }


                                    }

                                } else if (dataJson[i].operatetype == 1) {

                                    let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));

                                    // console.log("申请删除解锁成功返回所有的数据", delClockData);
                                    this.$data.newdataJson = delClockData;


                                } else if (dataJson[i].operatetype == 2) {
                                    console.log("解锁失败")

                                } else {                                        //删除锁
                                    // console.log("收到服务端自己删除锁的信息")
                                    //删除锁改变的数据
                                    let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));
                                    // console.log("收到服务端自己删除锁剩下所有的数据", delClockData);
                                    this.$data.newdataJson = delClockData;

                                }

                            } else {       //返回的数据没有operatetype属性存在执行的函数
                                console.log("返回的数据没有operatetype属性存在")
                                this.$data.firstDataJson = dataJson;   //第一次整体返回的数据先保存在firstDataJson数组中
                                let dataJsonareaMark = dataJson[i].areaMark;
                                let dataJsondes = dataJson[i].des;
                                let dataJsonareaAgvList = dataJson[i].areaAgvList;
                                let datas = {};
                                let datas1 = {};

                                for (let j = 0; j < dataJsonareaAgvList.length; j++) {
                                    let dataJsonagvName = dataJsonareaAgvList[j].agvName;
                                    datas = {
                                        "areaMark": dataJsonareaMark,
                                        "des": dataJsondes,
                                        "agvName": dataJsonagvName
                                    }
                                    newdata.push(datas);

                                    this.$data.newdataJson = newdata;   // newdataJson为操作系统

                                    datas1 = {
                                        "des": dataJsondes,
                                    }
                                    newDes.push(datas1);
                                    this.$data.newDes = newDes;   //新增加的描述

                                }
                            }

                        }
                    } else {      // 收到的数据为空的时候页面展示的信息
                        this.$data.newdataJson = dataJson;
                        this.$data.firstDataJson = dataJson;
                        console.log("没有数据");
                        let upload = this.$refs.upload;
                        upload.classList.add("hide");
                        let dataPic = this.$refs.dataPic;
                        dataPic.classList.remove("hide");

                    }


                }

            } else {
                console.log('您的浏览器不支持websocket');
            }


        },

        getUnlock(e) {   //强制解锁函数
            // const agvName = e.currentTarget.getAttributeNode('agvName').value;   
            // const areaMark = e.currentTarget.getAttributeNode('areaMark').value;
            const agvName = e.target.getAttribute('agvName');
            const areaMark = e.target.getAttribute('areaMark');

            console.log(agvName)
            console.log(areaMark)

            let params = {
                "agvid": agvName,
                "zoneid": areaMark,
                "operatetype": "releaselock"
            }

            if ('WebSocket' in window) {
                console.log('您的浏览器支持WebSocket');
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = (event) => {
                    // Web Socket 已连接上，使用 send() 方法发送数据
                    // alert('数据发送中...')
                    console.log('发送解锁请求已连接上')
                    this.socket.send(JSON.stringify(params));//可以给后台发送参数

                }
                // 监听socket错误信息
                this.socket.onerror = (msg) => {
                    console.log('错误信息：' + msg)
                }
                // 监听socket消息
                this.socket.onmessage = (msg) => {
                    this.Terminal();
                    console.log('解锁之后信息收到消息：', msg.data)
                    // const obj = JSON.parse(msg.data)
                    // console.log(obj)

                    const dataJson = JSON.parse(msg.data)   //后端返回的数据
                    console.log("websocket收到转化完的数据", dataJson)
                    let newdata = [];         //新建一个空数据
                    let newDes = [];         //新建一个描述的空数组
                    if (dataJson != "") {    //收到的数据不为空的时候
                        let upload = this.$refs.upload;
                        upload.classList.add("hide");
                        let dataPic = this.$refs.dataPic;
                        dataPic.classList.add("hide");
                        for (let i = 0; i < dataJson.length; i++) {
                            // console.log(dataJson[i]);
                            //判断返回的数据是否存在"operatetype":"asklock"/"operatetype":"releaselock",是否存在
                            if (dataJson[i].hasOwnProperty("operatetype")) {    // 返回的数据存在operatetype属性
                                console.log("新数据有operatetype属性");
                                if (dataJson[i].operatetype == "asklock") {    //增加锁判断有asklock属性
                                    console.log("有operatetype属性，属性值为新增asklock");
                                    this.$data.newcar = dataJson;     // 将新获取的值存入到一个新的newcar数组中
                                    console.log("新增加的时候获取的时候返回的新数据格式", this.newcar)
                                    console.log("this", this.firstDataJson)
                                    //添加锁改变的数据
                                    if (this.firstDataJson != "") {
                                        //原来的数据不为空
                                        this.firstDataJson.forEach((n) => {
                                            let aa1 = {};
                                            let tt = n.areaMark
                                            let areaAgvList = n.areaAgvList;
                                            this.newcar.forEach((m) => {
                                                let kk = m.zoneid
                                                console.log("kk", kk)

                                                const hasSameName = this.firstDataJson.some(obj1 => {
                                                    return this.newcar.some(obj2 => {
                                                        return Object.keys(obj1).includes('areaMark') && Object.keys(obj2).includes('zoneid') && obj1.areaMark === obj2.zoneid;
                                                    });
                                                });

                                                console.log("areaMark是否存在", hasSameName);

                                                if (hasSameName) {    //判断数组中存在该区域名字
                                                    console.log("数组中存在该区域名字");
                                                    if (tt.indexOf(kk) != -1) {
                                                        aa1 = {
                                                            "agvName": m.agvid
                                                        }
                                                        areaAgvList.push(aa1)
                                                    }

                                                } else {

                                                    console.log("没有相同的名字");
                                                    let newAddData = {};
                                                    this.newcar.forEach((item) => {
                                                        let areaMark = item.zoneid;
                                                        let des = item.des;
                                                        let agvName = item.agvid;

                                                        this.newAddData = {
                                                            "areaMark": areaMark,
                                                            "des": des,
                                                            "areaAgvList": [
                                                                { "agvName": agvName }
                                                            ]

                                                        }
                                                    })

                                                    console.log("新增新的数据了并且原有的数据不存在的情况", newAddData)
                                                    this.$data.firstDataJson.push(this.newAddData);

                                                }

                                            })

                                        })

                                        console.log("新增相同的数据", this.firstDataJson)
                                        this.$data.newAdddataJson = this.firstDataJson;

                                        this.newAdddataJson.forEach((itme) => {
                                            let dataJsonareaMark = itme.areaMark;
                                            let dataJsondes = itme.des;
                                            let dataJsonareaAgvList = itme.areaAgvList;
                                            let datas = {};
                                            let datas1 = {};

                                            for (let j = 0; j < dataJsonareaAgvList.length; j++) {
                                                let dataJsonagvName = dataJsonareaAgvList[j].agvName;
                                                datas = {
                                                    "areaMark": dataJsonareaMark,
                                                    "des": dataJsondes,
                                                    "agvName": dataJsonagvName
                                                }
                                                newdata.push(datas);
                                                this.$data.newdataJson = newdata;
                                                datas1 = {
                                                    "des": dataJsondes,
                                                }
                                                newDes.push(datas1);

                                                this.$data.newDes = newDes;

                                            }

                                        })

                                    } else {
                                        //整体数据为空的时候
                                        console.log("走了整体数据为空值的时候添加了新锁");
                                        let datas11 = {};
                                        let datas1arr = []
                                        for (let i = 0; i < dataJson.length; i++) {

                                            datas11 = {
                                                "areaMark": dataJson[i].zoneid,
                                                "des": dataJson[i].des,
                                                "agvName": dataJson[i].agvid
                                            }
                                            datas1arr.push(datas11);
                                            this.$data.newdataJson = datas1arr;

                                            this.$data.newcar = dataJson;
                                            let newAddData = {};
                                            this.newcar.forEach((item) => {
                                                let areaMark = item.zoneid;
                                                let des = item.des;
                                                let agvName = item.agvid;

                                                this.newAddData = {
                                                    "areaMark": areaMark,
                                                    "des": des,
                                                    "areaAgvList": [
                                                        { "agvName": agvName }
                                                    ]

                                                }
                                            })
                                            this.$data.firstDataJson.push(this.newAddData);

                                        }


                                    }

                                } else if (dataJson[i].operatetype == 1) {

                                    let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));

                                    // console.log("申请删除解锁成功返回所有的数据", delClockData);
                                    this.$data.newdataJson = delClockData;


                                } else if (dataJson[i].operatetype == 2) {
                                    console.log("解锁失败")

                                } else {                                        //删除锁
                                    // console.log("收到服务端自己删除锁的信息")
                                    //删除锁改变的数据
                                    let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));
                                    // console.log("收到服务端自己删除锁剩下所有的数据", delClockData);
                                    this.$data.newdataJson = delClockData;

                                }

                            } else {       //返回的数据没有operatetype属性存在执行的函数
                                console.log("返回的数据没有operatetype属性存在")
                                this.$data.firstDataJson = dataJson;   //第一次整体返回的数据先保存在firstDataJson数组中
                                let dataJsonareaMark = dataJson[i].areaMark;
                                let dataJsondes = dataJson[i].des;
                                let dataJsonareaAgvList = dataJson[i].areaAgvList;
                                let datas = {};
                                let datas1 = {};

                                for (let j = 0; j < dataJsonareaAgvList.length; j++) {
                                    let dataJsonagvName = dataJsonareaAgvList[j].agvName;
                                    datas = {
                                        "areaMark": dataJsonareaMark,
                                        "des": dataJsondes,
                                        "agvName": dataJsonagvName
                                    }
                                    newdata.push(datas);

                                    this.$data.newdataJson = newdata;   // newdataJson为操作系统

                                    datas1 = {
                                        "des": dataJsondes,
                                    }
                                    newDes.push(datas1);
                                    this.$data.newDes = newDes;   //新增加的描述

                                }
                            }

                        }
                    } else {      // 收到的数据为空的时候页面展示的信息
                        this.$data.newdataJson = dataJson;
                        this.$data.firstDataJson = dataJson;
                        console.log("没有数据");
                        let upload = this.$refs.upload;
                        upload.classList.add("hide");
                        let dataPic = this.$refs.dataPic;
                        dataPic.classList.remove("hide");

                    }

                }

            } else {
                console.log('您的浏览器不支持websocket');
            }

        },


        addLikes(event) {   //
            //获取当前元素的属性
            console.log("aaa")
            console.log(event);
            console.log(event.srcElement.innerHTML);
            this.$data.DesJson = event.srcElement.innerHTML;
            //获取当前元素父元素的属性

        },
        release(e) {  //强制释放按钮

            let Modals = document.querySelector(".Modals");
            let md_overlay = document.querySelector(".md-overlay");
            md_overlay.classList.remove("hide");
            Modals.classList.remove("hide");
            this.$data.agvName = e.target.getAttribute('agvName');
            this.$data.areaMark = e.target.getAttribute('areaMark');

        },
        cancel(e) {  //取消按钮
            let Modals = document.querySelector(".Modals");
            let md_overlay = document.querySelector(".md-overlay");
            md_overlay.classList.add("hide");
            Modals.classList.add("hide");
            console.log(e);
        },


    },
    beforeDestroy() {
        // 页面离开时断开连接
        this.closeWebsocket()
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
* {
    margin: 0px;
    padding: 0px;
}

.main {
    padding: 35px 16px 30px 47px;
    position: absolute;
    top: 80px;
}

body {
    background: #ededed;
}

.dataPic,
.networkPic {
    /* background: #fff; */
    padding: 30px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    /* z-index: 2000; */
    text-align: center;
    /* visibility: hidden; */
    transform: translateX(-50%) translateY(-50%);
    /* width: 300px; */
}

.dataPic img {
    display: block;
}

.dataPic span {
    font-size: 25px;
    color: #a09191;
}

.networkPic img {
    display: block;
}

.networkPic span {
    font-size: 20px;
    color: #a09191;
}

.refrestBtn {
    background-color: #58bfbc;
    /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    border-radius: 40px;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
    margin: 15px 2px;
    cursor: pointer;
    outline: none
}


.moduleListUl {
    display: table;
}

.moduleList {
    width: 434px;
    height: 170px;
    border-bottom: 1px solid #ececec;
    position: relative;
    background: #fff;
    padding-top: 10px;
    display: inline-block;
    margin-right: 24px;
    margin-bottom: 20px;
}

.areaListUl {
    margin-top: 10px;
    float: left;
    text-align: right;
    color: #848484;
    width: 88px;
    margin-right: 15px;
}

.areaList,
.areaList1 {
    padding: 10px 0;
}

.areaList2 {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* 超出几行省略 */
    overflow: hidden;
    height: 35px;
}

.areaList3 {
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    overflow: hidden;
    width: 50%;
    height: 15px;
}

.releaseBtn {
    position: absolute;
    top: 25px;
    right: 25px;
    color: #df002b;
    border: 1px solid #df002b;
    padding: 8px 13px;
    cursor: pointer;
    background-color: #fff;
}

.releaseBtn:hover {
    background: #e9e2e2;
}

.releaseBtn1,
.releaseBtn2 {
    border-radius: 20px;
    padding: 3px 10px;
    cursor: pointer;
}

.releaseBtn3,
.releaseBtn4 {
    padding: 3px 10px;
    cursor: pointer;
    /* margin-left: 20px; */
    /* float: right; */
}

.releaseBtn3 {
    margin-right: 15px;
}

.releaseBtn4 {
    margin-left: 15px;
}

.ModalslistBtn {
    text-align: center;
}

.hide {
    display: none;
}

/* background:#d8d8d8; fit-content;width:-webkit-fit-content;width:-moz-fit-content;*/
.Modals,
.ModalsTitle,
.ModalsTitle1 {
    background: #fff;
    padding: 30px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    /* max-width: 630px;
          min-width: 320px; */
    height: auto;
    z-index: 2000;
    /* visibility: hidden; */
    transform: translateX(-50%) translateY(-50%);
    width: 300px;
}

.closeBtn1,
.closeBtn2 {
    position: absolute;
    right: 15px;
    top: 5px;
    cursor: pointer;
    width: 25px;
    height: 25px;
    text-align: center;
    display: block;
}


.md-show~.md-overlay {
    opacity: 1;
    visibility: visible;
}

.md-overlay {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1000;
    /* opacity: 0; */
    background: rgba(0, 0, 0, 0.5);
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    transition: all 0.3s;
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
}

.areaListtext {
    text-align: right;
}

.data_alue {
    margin-top: 10px;
    margin-left: 10px;
    float: left;
    width: 280px;
}

.area {
    margin-top: 6px;
}

/* .streetBor{display: inline-flex;} */
.streetBtn {
    padding: 10px 80px 10px 20px;
    background: #df002b;
    border: 1px solid #df002b;
    color: #fff;
    border-radius: 57px 83px 10px 0px
}

.Modalslist {
    padding: 10px;
    margin-bottom: 30px;
    text-align: center;
}

.Modalslist1 {
    padding: 10px;
    margin-bottom: 10px;
    text-align: center;
}

.street {
    background: url('../assets/img/tdeBtn.png');
    background-size: 100% 100%;
    display: block;
    width: 150px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    padding-left: 20px;
}

.dialogdes {
    word-break: break-all;
    word-wrap: break-word;
}

.cavasBg {
    position: absolute;
    z-index: 2;
    top: 80px;
}

.listBtn {
    display: none;
}

.mapBtn {
    display: block;
}

.agvNameNumber {
    margin-left: 10px;
    color: #df002b;
}

.upload {
    position: fixed;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    /* z-index: 2000; */
    text-align: center;
    /* visibility: hidden; */
    transform: translateX(-50%) translateY(-50%);

}

.upload span {
    position: absolute;
    top: 58px;
    left: 42px;
    color: #b3b1b1;
}

.spinner {
    border: 10px solid #f3f3f3;
    /* Light grey */
    border-top: 10px solid #3498db;
    /* Blue */
    border-radius: 50%;
    width: 120px;
    height: 120px;
    animation: spin 2s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

/* 修改滚动条样式 */
/* body::-webkit-scrollbar{ 

width:5px;

}

body::-webkit-scrollbar-track{

background: #999;

  border-radius:2px;

}

body::-webkit-scrollbar-thumb{

  background: rgb(179, 177, 177);

  border-radius:10px;

}

body::-webkit-scrollbar-thumb:hover{

  background: #333;

}

body::-webkit-scrollbar-corner{

  background: #179a16;

} */
</style>