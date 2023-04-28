<template>
   <div class="main">
       
      
      <!-- 释放弹出框 -->
      <div class="Modals hide">
        <div class="Modalslist">是否释放通行锁？</div>
        <button class="clearBtn releaseBtn3">确定</button>
        <button class="closeBtn releaseBtn4">取消</button>
        </div>
        <div class="ModalsTitle hide">
            <div class="ModalslistTitle ">11231231232</div>
            <div class="closeBtn1">X</div>
        </div>
        <div class="ModalsTitle1 hide">
            <div class="ModalslistTitle1 ">11231231232</div>
            <div class="closeBtn2">X</div>
        </div>
        <div class="md-overlay hide"></div>
      
   </div>
  </template>
  
  <script>
  import TdeBtn from '../assets/img/tdeBtn.png'

  export default {
    data(){
      return{
        conTop: {
            backgroundImage:'url(' + TdeBtn + ')',
            }

      }
    },
    mounted () {
        this.init();
    },
    methods: {
      init() {
        var main = document.querySelector(".main");
        var releaseBtn = document.querySelector(".releaseBtn");
        var areaId = document.querySelector(".areaId");
        var Modalslist = document.querySelector(".Modalslist");
        var ModalslistTitle = document.querySelector(".ModalslistTitle");
        var ModalslistTitle1 = document.querySelector(".ModalslistTitle1");

        //测试循环多个li
        var dataJson =[
            {"areaMark":"cross_spk1111Rdk1111Rdk1111Rdk1111Rd","des":"spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123","areaAgvList":[{"agvName":"C001"},{"agvName":"C001"}]},
            {"areaMark":"cross_spk22Rd","des":"spk靠近pd丁子路口","areaAgvList":[{"agvName":"C0021"},{"agvName":"C0022"}]},
            {"areaMark":"cross_spk33Rd","des":"spk靠近pdspk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123spk靠近十字路口123123","areaAgvList":[{"agvName":"C0031"},{"agvName":"C0032"}]},
            {"areaMark":"cross_spk4444Rd","des":"spk靠近pdspk靠近十字路口123123spk靠近十字路口123123","areaAgvList":[{"agvName":"C004"},{"agvName":"C0041"},{"agvName":"C0041"}]}
        ]




        for(var i=0;i<dataJson.length;i++){
            var dataJsonareaMark = dataJson[i].areaMark;
            var dataJsondes = dataJson[i].des;
            var dataJsonareaAgvList = dataJson[i].areaAgvList;
            console.log(dataJsonareaAgvList);

            //   var DivHtml = document.createElement("div");
            //     DivHtml.className = 'streetBor';
                // DivHtml.innerHTML ='<div class="street"></div>'
               
            for(var j = 0;j < dataJsonareaAgvList.length;j++){
                var dataJsonagvName = dataJsonareaAgvList[j].agvName;
                main.innerHTML +='<div class="moduleList"><div class="areaListUl"><div class="areaList">区域标识:</div><div class="areaList">占用AGV:</div><div class="areaList">备注:</div><button class="releaseBtn">强制释放</button></div><div class="data_alue"><div class="areaList1 areaList3" title='+ dataJsonareaMark +'>' + dataJsonareaMark + '</div><div class="areaList1 area">' + dataJsonagvName + '</div><div class="areaList1 areaList2 remark" title='+ dataJsondes +'>' + dataJsondes + '</div></div><div style="clear: both;"></div></div>'
            
            }

            // main.appendChild(DivHtml);
         
        }


        // var main = document.querySelector(".main");
       var  oElements  = main.querySelectorAll(".moduleList");
        var Modals = document.querySelector(".Modals");
        var ModalsTitle = document.querySelector(".ModalsTitle");
        var ModalsTitle1 = document.querySelector(".ModalsTitle1");
        var closeBtn = document.querySelector(".closeBtn");
        var clearBtn = document.querySelector(".clearBtn");
        var closeBtn1 = document.querySelector(".closeBtn1");
        var closeBtn2 = document.querySelector(".closeBtn2");
        var md_overlay = document.querySelector(".md-overlay");
        
        for(var i=0;i<oElements.length;i++){
            (function(i){
                console.log(oElements[i].querySelector(".area").innerHTML);
                oElements[i].querySelector(".releaseBtn").onclick = function(){
                    console.log(i);
                    md_overlay.classList.remove("hide");
                    Modals.classList.remove("hide");
                    areaId.innerHTML = oElements[i].querySelector(".area").innerHTML;
                }
            })(i)
        }

        
            var os = function (){
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
        //    var  oElements  = main.querySelectorAll(".moduleList");
           for(var i=0;i<oElements.length;i++){
            var aaa = oElements[i].querySelector(".data_alue");
            var bbb = oElements[i];
            aaa.style.width = '200px';
            bbb.style.width = '327px';
            console.log(aaa);
            console.log(bbb);
            (function(i){
                console.log(oElements[i].querySelector(".remark").innerHTML);
                oElements[i].querySelector(".remark").onclick = function(){
                    console.log(i);
                    md_overlay.classList.remove("hide");
                    ModalsTitle.classList.remove("hide");
                    ModalslistTitle.innerHTML = oElements[i].querySelector(".remark").innerHTML;
                };
                oElements[i].querySelector(".areaList3").onclick = function(){
                    console.log(i);
                    md_overlay.classList.remove("hide");
                    ModalsTitle1.classList.remove("hide");
                    ModalslistTitle1.innerHTML = oElements[i].querySelector(".areaList3").innerHTML;
                };
                
            })(i)
        }

        closeBtn1.addEventListener('click', function(){
           md_overlay.classList.add("hide");
           ModalsTitle.classList.add("hide")
       });
       closeBtn2.addEventListener('click', function(){
           md_overlay.classList.add("hide");
           ModalsTitle1.classList.add("hide");
       });

        } else if (os.isPc) {
            // pc
            console.log("PC")
           
        }

        clearBtn.addEventListener('click', function(){
            md_overlay.classList.add("hide");
            Modals.classList.add("hide");
        });
        closeBtn.addEventListener('click', function(){
           
            md_overlay.classList.add("hide");
            Modals.classList.add("hide")
        });
       

     }
   }
    
    
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
 <style scoped lang="less">
  .main{
            min-height: calc(100vh - 100px);
            display: -webkit-box;
            overflow-x: scroll;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 20px;
            
        }

  </style>
  