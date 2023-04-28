<template>
    <div class="unlock">
        <Heads></Heads>
        <!-- <tdeIndex></tdeIndex> -->
        <div class="main">
            <!-- 需要动态化的内容 -->
            <div class="moduleList" v-for="(item, index) in newdataJson" :key="index" ref="moduleList">
                <div class="areaListUl">
                    <div class="areaList">区域标识:</div>
                    <div class="areaList">占用AGV:</div>
                    <div class="areaList">备注:</div>
                    <!-- <button class="releaseBtn" id="show-modal" @click="showModal = true">强制释放</button> -->
                    <button class="releaseBtn" @click="release($event)" :agvName='item.agvName'
                        :areaMark='item.areaMark'>强制释放</button>
                </div>
                <div class="data_alue" ref="data_alue">
                    <div class="areaList1 areaList3" :title="item.areaMark" @click="showModal = true; addLikes($event);">
                        {{ item.areaMark }}</div>
                    <div class="areaList1 area">{{ item.agvName }}</div>
                    <div class="areaList1 areaList2" :title="item.des" ref="remark"
                        @click="showModal = true; addLikes($event);">{{ item.des }}</div>
                </div>
                <div style="clear: both;"></div>
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
                    <button class="clearBtn releaseBtn3" :agvName=this.agvName :areaMark=this.areaMark
                        @click="cancel($event); getUnlock($event);">确定</button>
                    <button class="closeBtn releaseBtn4" @click="cancel($event)">取消</button>
                </div>

            </div>
            <div class="md-overlay hide"></div>
            <div to="body">
                <!-- 使用这个 modal 组件，传入 prop -->
                <modal :show="showModal" @close="showModal = false">
                    <template #body>
                        <span class="dialogdes">{{ DesJson }}</span>
                    </template>
                </modal>
            </div>
        </div>


        <div>{{ city }}</div>
    </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import Heads from '@/components/heads.vue'
import tdeIndex from '@/components/tdeindex.vue'
import Modal from '@/components/dialog.vue'
import TdeBtn from '../assets/img/tdeBtn.png'

import api from '../api/index'
import request from "@/utils/request";
import { mapState } from 'vuex';


export default {
    name: 'unlock',
    components: {
        Heads,
        tdeIndex,
        Modal
    },
    data() {
        return {
            // newdataJson: [],
            // showModal: false,
            // newDes: [],
            // DesJson: "",
            // fullWidth: document.documentElement.clientWidth,
            // fullHeight: document.documentElement.clientHeight,
            // agvName: '',
            // newdatatitle: [],
            // areaMark: '',
            // setSelectedItem: null
            newdataJson: [],
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
            path: 'ws://192.168.3.250:12345/netserver/1',  //使用websocket
            sockernum: 0,
            socket: '',
            newcar: [],
            newAdddataJson: [],   //通过新增获取的新数据
            firstDataJson: [
                // { "areaMark": "cross_spk11Rd", "des": "spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C001" }, { "agvName": "C0011121" }] },
                // { "areaMark": "cross_spk22Rd", "des": "spk靠近pd丁子路口", "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] },
                // { "areaMark": "cross_spk33Rd", "des": "spk靠近pdspk靠3", "areaAgvList": [{ "agvName": "C0031" }, { "agvName": "C0032" }] },
                { "areaMark": "cross_spk22Rd", "des": "哈哈哈", "areaAgvList": [{ "agvName": "我是新加入的" }] }
            ]      //第一次获取的数据


        }
    },
    mounted() {
        // this.init();
        this.ceshi()
        //初始化后端返回的数据
        // api.getChengPin().then(res => {
        //     console.log("ssssssssssssssss", res)
        //     console.log(res.data);
        // }).catch((e) => {
        //     console.log(e);
        // })

        // api.getBanner1().then(res => {
        //     console.log("getBanner", res)
        //     console.log(res.data);
        // }).catch((e) => {
        //     console.log(e);
        // })


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
                var chose = this
                var chosedom = chose.$refs.moduleList;
                var data_alue = chose.$refs.data_alue;
                var Remark = chose.$refs.remark;
                console.log(Remark);
                for (var i = 0; i < chosedom.length; i++) {
                    var module_list = chosedom[i];
                    module_list.style.width = '327px';
                }
                for (var i = 0; i < data_alue.length; i++) {
                    var dataAlue = data_alue[i];
                    dataAlue.style.width = '200px';
                }

                for (var i = 0; i < Remark.length; i++) {
                    var Re_mark = Remark[i];
                    console.log(Re_mark);

                }


            } else if (os.isPc) {
                // pc
                console.log("PC")

            }


        }, 10)
    },
    methods: {
        init() {


            this.items = [
                { id: 1, name: 'Item 1', "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] },
                { id: 2, name: 'Item 2', "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] },
                { id: 3, name: 'Item 3', "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] }
            ];

            this.additionalItems = [
                { "operatetype": "asklock", "agvid": "3", "zoneid": "Item 1" },
                { "operatetype": "asklock", "agvid": "3111", "zoneid": "Item 2" }
            ];

            this.items.forEach((n) => {

                var aa1 = {};
                this.additionalItems.forEach((m) => {
                    var tt = n.name
                    var areaAgvList = n.areaAgvList;
                    console.log(tt)
                    var kk = m.zoneid
                    console.log(kk)
                    if (tt.indexOf(kk) != -1) {

                        aa1 = {
                            "agvName": m.agvid
                        }
                        areaAgvList.push(aa1)

                    }
                })


            })
            console.log(this.items)


            console.log("测试", this.items);
            console.log("测试1", this.additionalItems);

            //测试循环多个li
            var dataJson = [
                { "areaMark": "cross_spk111Rd", "des": "spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C001" }, { "agvName": "C0011121" }] },
                { "areaMark": "cross_spk22Rd", "des": "spk靠近pd丁子路口", "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] },
                { "areaMark": "cross_spk33Rd", "des": "spk靠近pdspk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C0031" }, { "agvName": "C0032" }] },
                { "areaMark": "cross_spk4444Rd", "des": "spk靠近pdspk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C004" }, { "agvName": "C0041" }, { "agvName": "C0041" }] },
                { "areaMark": "cross_spk33Rd", "des": "spk靠近pdspk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C0031" }, { "agvName": "C0032" }] },
                { "areaMark": "cross_spk4444Rd", "des": "spk靠近pdspk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C004" }, { "agvName": "C0041" }, { "agvName": "C0041" }] },
            ]

            this.$data.newdataJson = dataJson;
            // var dataJson = [];
            // var newdata = [];
            // var newdatatitle = [];
            // var newDes = [];
            // for (var i = 0; i < dataJson.length; i++) {
            //     // console.log(dataJson[i]);
            //     var dataJsonareaMark = dataJson[i].areaMark;
            //     var dataJsondes = dataJson[i].des;
            //     var dataJsonareaAgvList = dataJson[i].areaAgvList;
            //     // console.log(dataJsonareaAgvList);
            //     // console.log("@", dataJsonareaAgvList.length);
            //     var datas = {};
            //     var datas1 = {};
            //     newdatatitle.push(dataJsonareaMark);

            //     this.$data.newdatatitle = newdatatitle;
            //     // console.log(newdatatitle);

            //     for (var j = 0; j < dataJsonareaAgvList.length; j++) {
            //         var dataJsonagvName = dataJsonareaAgvList[j].agvName;

            //         datas = {
            //             "areaMark": dataJsonareaMark,
            //             "des": dataJsondes,
            //             "agvName": dataJsonagvName
            //         }
            //         newdata.push(datas);
            //         datas1 = {
            //             "des": dataJsondes,
            //         }
            //         newDes.push(datas1);
            //         console.log(newdata);
            //         this.$data.newdataJson = newdata;

            //         this.$data.newDes = newDes;

            //     }

            // }


        },

        ceshi() {

            if ('WebSocket' in window) {
                console.log('您的浏览器支持WebSocket');
                // this.socket = new WebSocket(this.path)
                // 监听socket连接
                // this.socket.onopen = this.open
                const params = {
                    "operatetype": "1"
                }
                // this.socket.onopen = (enent) => {
                //     // Web Socket 已连接上，使用 send() 方法发送数据
                //     // alert('数据发送中...')
                //     this.socket.send(JSON.stringify(params));//初始化请求数据传给服务器端的参数
                // }
                // 监听socket错误信息
                // this.socket.onerror = (msg) => {
                //     console.log('错误信息：' + msg)
                // }
                // 监听socket消息
                // this.socket.onmessage = (msg) => {
                // console.log('收到消息：', msg.data)
                // const dataJson = JSON.parse(msg.data)   //后端返回的数据
                //建立测试数据

                // var xin = [{
                //     "operatetype": "asklock",
                //     "agvid": "3",
                //     "zoneid": "cross_BHV2_2"
                // }]

                var dataJson = [
                    // { "areaMark": "cross_spk11Rd", "des": "spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123", "areaAgvList": [{ "agvName": "C001" }, { "agvName": "C0011121" }] },
                    // { "areaMark": "cross_spk22Rd", "des": "spk靠近pd丁子路口", "areaAgvList": [{ "agvName": "C0021" }, { "agvName": "C0022" }] },
                    // { "areaMark": "cross_spk33Rd", "des": "spk靠近pdspk靠3", "areaAgvList": [{ "agvName": "C0031" }, { "agvName": "C0032" }] },
                    { "operatetype": "asklock", "agvid": "我是新加入的333哈哈哈", "zoneid": "cross_spk33Rd", "des": "哈哈哈" },
                    // { "operatetype": "asklock", "agvid": "我是新加入的123", "zoneid": "cross_spk11Rd", "des": "哈哈哈啥啊" }
                ]

                [{ "operatetype": "asklock", "agvid": "我是新加入的333哈哈哈", "zoneid": "cross_spk33Rd", "des": "哈哈哈" }]
                [{ "operatetype": "releaselock", "agvid": "B001", "zoneid": "B区", "des": "重庆路口" }]
                [{ "operatetype": "asklock", "agvid": "B001", "zoneid": "B区", "des": "重庆路口" }]
                [{ "operatetype": "asklock", "agvid": "C003", "zoneid": "A区", "des": "spk靠近pdspk靠3" }]


                [{ "areaMark": "A区", "des": "spk靠近pdspk靠3", "areaAgvList": [{ "agvName": "C001" }, { "agvName": "C002" }] }]

                console.log(dataJson)
                var newdata = [];
                var newDes = []
                if (dataJson != "") {
                    for (var i = 0; i < dataJson.length; i++) {
                        // console.log(dataJson[i]);
                        //判断返回的数据是否存在"operatetype":"asklock"/"operatetype":"releaselock",是否存在
                        if (dataJson[i].hasOwnProperty("operatetype")) {
                            console.log("该值存在")
                            if (dataJson[i].operatetype == "asklock") {     //增加锁
                                console.log("收到增加锁的信息")
                                this.$data.newcar = dataJson;

                                //添加锁改变的数据
                                if (this.firstDataJson != "") {
                                    //原来的数据不为空
                                    this.firstDataJson.forEach((n) => {
                                        var aa1 = {};
                                        this.newcar.forEach((m) => {
                                            var tt = n.areaMark
                                            var areaAgvList = n.areaAgvList;
                                            var kk = m.zoneid
                                            if (tt.indexOf(kk) != -1) {
                                                aa1 = {
                                                    "agvName": m.agvid
                                                }
                                                areaAgvList.push(aa1)
                                            }else {
                                                console.log("this.newcar", this.newcar)
                                                const result = this.newcar.reduce((acc, cur) => {
                                                    const existingArea = acc.find((area) => area.areaMark === cur.zoneid);
                                                    if (existingArea) {
                                                        existingArea.areaAgvList.push({ agvName: cur.agvid });
                                                    } else {
                                                        acc.push({
                                                            areaMark: cur.zoneid,
                                                            des: cur.des,
                                                            areaAgvList: [{ agvName: cur.agvid }],
                                                        });
                                                    }
                                                    return acc;
                                                }, []);

                                                result.forEach((Item) => {
                                                    this.$data.firstDataJson.push(Item);
                                                    console.log("Item", Item)
                                                    console.log(this.firstDataJson);

                                                })
                                            

                                            }
                                        })

                                    })

                                    console.log("收到数据新增", this.firstDataJson)
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
                                            datas1 = {
                                                "des": dataJsondes,
                                            }
                                            newDes.push(datas1);
                                            this.$data.newdataJson = newdata;

                                            this.$data.newDes = newDes;

                                        }

                                    })

                                } else {
                                    //整体数据为空的时候
                                    console.log("走了整体数据为空值的时候添加了新锁");
                                    var datas11 = {};
                                    var datas1arr = []
                                    for (let i = 0; i < dataJson.length; i++) {

                                        datas11 = {
                                            "areaMark": dataJson[i].zoneid,
                                            "des": dataJson[i].des,
                                            "agvName": dataJson[i].agvid
                                        }
                                        datas1arr.push(datas11);
                                        this.$data.newdataJson = datas1arr;

                                        console.log("123", this.newdataJson)


                                        const result = dataJson.reduce((acc, cur) => {
                                            const existingArea = acc.find((area) => area.areaMark === cur.zoneid);
                                            if (existingArea) {
                                                existingArea.areaAgvList.push({ agvName: cur.agvid });
                                            } else {
                                                acc.push({
                                                    areaMark: cur.zoneid,
                                                    des: cur.des,
                                                    areaAgvList: [{ agvName: cur.agvid }],
                                                });
                                            }
                                            return acc;
                                        }, []);

                                        console.log("结果", result);

                                        this.$data.firstDataJson = result;
                                        console.log(this.firstDataJson);

                                    }

                                }

                            } else if (dataJson[i].operatetype == 1) {
                                console.log("申请删除解锁成功");
                                let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));

                                console.log("申请删除解锁成功返回所有的数据", delClockData);
                                this.$data.newdataJson = delClockData;

                            } else if (dataJson[i].operatetype == 2) {
                                console.log("解锁失败")

                            } else {                                        //删除锁
                                console.log("收到服务端自己删除锁的信息")
                                //删除锁改变的数据
                                let delClockData = this.newdataJson.filter(item => !dataJson.some(ele => ele.agvid === item.agvName));
                                console.log("收到服务端自己删除锁剩下所有的数据", delClockData);
                                this.$data.newdataJson = delClockData;
                            }

                        } else {
                            console.log("该值不存在")
                            this.$data.firstDataJson = dataJson;
                            var dataJsonareaMark = dataJson[i].areaMark;
                            var dataJsondes = dataJson[i].des;
                            var dataJsonareaAgvList = dataJson[i].areaAgvList;
                            var datas = {};
                            var datas1 = {};

                            for (var j = 0; j < dataJsonareaAgvList.length; j++) {
                                var dataJsonagvName = dataJsonareaAgvList[j].agvName;
                                datas = {
                                    "areaMark": dataJsonareaMark,
                                    "des": dataJsondes,
                                    "agvName": dataJsonagvName
                                }
                                newdata.push(datas);
                                datas1 = {
                                    "des": dataJsondes,
                                }
                                newDes.push(datas1);
                                this.$data.newdataJson = newdata;

                                this.$data.newDes = newDes;

                            }
                        }

                    }
                } else {
                    console.log("没有数据");
                }

                // }

            } else {
                console.log('您的浏览器不支持websocket');
            }
        },


        getUnlock(e) {
            console.log("数据返回成功");
            const agvName = e.currentTarget.getAttributeNode('agvName').value;
            const areaMark = e.currentTarget.getAttributeNode('areaMark').value;

            console.log(agvName)
            console.log(areaMark)

            var params = {
                "areaName": agvName,
                "areaMark": areaMark
            }


            api.getIndexList(params).then(res => {
                console.log("IndexList", res)
                console.log(res.data);
            }).catch((e) => {
                console.log(e);
            })




            // var params = {
            //     "areaName": "",
            //     "areaNo": "",
            //     "id": 0,
            //     "ifDelete": 0,
            //     "storeInfoNumber": 0
            // }
            // var that = this;
            // that.axios.post('', params).then(function (response) {
            //     console.log(response);
            //     var result = response.data;
            //     console.log(result);

            //     if (response.status == 200) {
            //         console.log("数据返回成功");


            //     } else {
            //         console.log("数据返回错误");
            //     }
            // }).catch(function (error) {
            //     console.log(error);
            // });


        },

        getData() {
            var that = this;
            axios.get('/query?name=tom').then(function (response) {
                console.log(response);
                if (result.status == 200) {
                    sonsole.log("数据返回成功");

                } else {
                    console.log("数据返回错误");
                }
            }).catch(function (error) {
                console.log(error);
            });
        },
        addLikes(event) {
            //获取当前元素的属性
            console.log(event);
            console.log(event.srcElement.innerHTML);
            this.$data.DesJson = event.srcElement.innerHTML;
            //获取当前元素父元素的属性

        },
        release(e) {

            let Modals = document.querySelector(".Modals");
            let md_overlay = document.querySelector(".md-overlay");
            md_overlay.classList.remove("hide");
            Modals.classList.remove("hide");
            this.$data.agvName = e.currentTarget.getAttributeNode('agvName').value;
            this.$data.areaMark = e.currentTarget.getAttributeNode('areaMark').value;

        },
        cancel(e) {
            let Modals = document.querySelector(".Modals");
            let md_overlay = document.querySelector(".md-overlay");
            md_overlay.classList.add("hide");
            Modals.classList.add("hide");
            console.log(e);
        },


    },
    computed: {//必须
        city() {
            return this.$store.state.fid
        }
    },




}
</script>
<style>
* {
    margin: 0px;
    padding: 0px;
}

.main {
    /* min-height: calc(90vh - 100px); */
    display: -webkit-box;
    /* overflow-x: scroll; */
    -webkit-overflow-scrolling: touch;

    padding: 35px 16px 30px 47px;
    position: absolute;
    top: 80px;
}

body {
    background: #ededed;
}

.moduleListUl {
    display: table;
}

.moduleList1 {
    width: 434px;
    height: 170px;
    border-bottom: 1px solid #ececec;
    position: relative;
    background: #fff;
    padding-top: 10px;
    /* display: inline-block; */
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

.streetBor {
    display: inline-block;
}

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