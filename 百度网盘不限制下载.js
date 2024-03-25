// ==UserScript==
// @name         百度网盘不限制下载-神速Down
// @namespace    http://sswpdd.xyz/
// @version      3.6.7
// @antifeature  membership
// @description  不限制速度下载的百度网盘解析脚本，无视黑号，拥有IDM/Aria2/Motrix三种方式任意体验极速下载！ 面向所有网友免费交流学习使用，更多功能正在完善中...
// @author       SSDown
// @icon         https://vitejs.dev/logo.svg
// @match        *://pan.baidu.com/*
// @match        *://yun.baidu.com/*
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.js
// @require      https://lib.baomitu.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://lib.baomitu.com/clipboard.js/2.0.6/clipboard.min.js
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @connect      localhost
// @connect      127.0.0.1
// @connect      baidu.com
// @connect      sswpdd.xyz
// @downloadURL https://update.greasyfork.org/scripts/480255/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E9%99%90%E5%88%B6%E4%B8%8B%E8%BD%BD-%E7%A5%9E%E9%80%9FDown.user.js
// @updateURL https://update.greasyfork.org/scripts/480255/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E4%B8%8D%E9%99%90%E5%88%B6%E4%B8%8B%E8%BD%BD-%E7%A5%9E%E9%80%9FDown.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let globalData = {
        scriptVersion: '2.1.0',
        domain: '',
        domainB: '',
        param: '',
        downloading: 0,
        sending: 0,
        storageNamePrefix: 'lwx_storageNamessd', // 本地储存名称前缀
    }

    let getAppSettingData = function () {
        return {
            scriptVersion: globalData.scriptVersion,
            param: globalData.param,
            storageNamePrefix: globalData.storageNamePrefix,
            getDownloadUrl: `/bd/api.php`,
        }
    }

    let tmpData = {
        response: '',
        pwd: '',
        fs_id: '',
        token: '',
    }

    let configDefault = {
        savePath: 'D:\\SSDOWN',
        jsonRpc: 'http://localhost:6800/jsonrpc',
        token: '',
        mine: '',
        code: '',
    };
    let getConfig = function () {
        // 上次使用 > 应用配置 > 代码默认
        return {
            savePath: getStorage.getLastUse('savePath') || getStorage.getAppConfig('savePath') || configDefault.savePath,
            jsonRpc: getStorage.getLastUse('jsonRpc') || getStorage.getAppConfig('jsonRpc') || configDefault.jsonRpc,
            token: getStorage.getLastUse('token') || getStorage.getAppConfig('token') || configDefault.token,
            mine: getStorage.getLastUse('mine') || getStorage.getAppConfig('mine') || configDefault.mine,
            code: getStorage.getLastUse('code') || configDefault.code,
        }
    }
    let getStorage = {
        getAppConfig: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_app_' + key) || '';
        },
        setAppConfig: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_app_' + key, value || '');
        },
        getLastUse: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_last_' + key) || '';
        },
        setLastUse: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_last_' + key, value || '');
        },
        getCommonValue: (key) => {
            return GM_getValue(getAppSettingData().storageNamePrefix + '_common_' + key) || '';
        },
        setCommonValue: (key, value) => {
            GM_setValue(getAppSettingData().storageNamePrefix + '_common_' + key, value || '');
        }
    }

    let uInfo = {};

    let isOldHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/home") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isNewHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/main") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isSharePage = function () {
        let path = location.pathname.replace('/disk/', '');
        if (/^\/(s|share)\//.test(path)) {
            return true;
        } else {
            return false;
        }
    }

    let getSelectedFileList = function () {
        let pageType = getPageType();
        if (pageType === 'old') {
            return require('system-core:context/context.js').instanceForSystem.list.getSelected();
        }
        if (pageType === 'new') {
            let mainList = document.querySelector('.nd-main-list');
            if (!mainList) mainList = document.querySelector('.nd-new-main-list');//20220524 新版
            return mainList.__vue__.selectedList;
        }
    };

    let getFileListStat = function (fileList) {
        let fileStat = {
            file_num: 0,
            dir_num: 0
        };
        fileList.forEach(function (item) {
            if (item.isdir == 0) {
                fileStat.file_num++;
            } else {
                fileStat.dir_num++;
            }
        });
        return fileStat;
    };





var callback = function(mutationsList, observer) {
    for (var mutation of mutationsList) {
        if (mutation.type === 'childList') {
            var dateShowDiv = document.getElementById('datatimeshow');
            if (dateShowDiv) {
                var date = new Date();
                var dateString = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();

                var todayTextSpan = dateShowDiv.querySelector('#todayText');
                var dateSpan = dateShowDiv.querySelector('#dateSpan');

                if (!todayTextSpan) {
                    todayTextSpan = document.createElement('span');
                    todayTextSpan.id = 'todayText';
                    todayTextSpan.textContent = 'Time';
                    dateShowDiv.appendChild(todayTextSpan);
                }

                if (!dateSpan) {
                    dateSpan = document.createElement('span');
                    dateSpan.id = 'dateSpan';
                    dateSpan.textContent = dateString;
                    dateShowDiv.appendChild(dateSpan);
                } else {
                    dateSpan.textContent = dateString;
                }
            }
        }
    }
};
var observer = new MutationObserver(callback);
var config = { attributes: false, childList: true, subtree: true };
observer.observe(document.body, config);




    let initButtonEvent = function () {
        console.log('initButtonEvent初始化按钮事件');
        let pageType = getPageType();
        let yunData = getYunData();
        if (!yunData && pageType != 'new') {
            showLogin();
            return;
        }
        //暂时限制只能在管理页面中使用
        if (pageType === 'share') {
            showTipErrorSwal('必须先转存到自己网盘中，然后进入网盘进行下载！');
            console.log('必须先转存到自己网盘中');
            showShareSave();
        } else {
            let fileList = getSelectedFileList();
            let fileStat = getFileListStat(fileList);
            if (fileList.length) {
                if (fileStat.file_num > 1 || fileStat.dir_num > 0) {
                    showTipError('请选择一个文件进行下载（暂时不支持文件夹和多文件批量下载）')
                }
                if (fileStat.dir_num == 0 && fileStat.file_num == 1) {
                    showDownloadDialog(fileList, fileStat);
                    setShareCompleteState();
                    //自动下载
                    // getJquery()("#dialogBtnGetUrl").click();
                }
            } else {
                showTipErrorSwal('请选择一个文件进行下载');
            }
        }
    };

    let getYunData = function () {
        return unsafeWindow.yunData;
    };

    let showTipErrorSwal = function (err) {
        showSwal(err, {icon: 'error'});
    }
    let showTipError = function (err) {
        // showSwal(err,{icon: 'error'});
        alert(err);
    }
    let showTipInfo = function (info) {
        //getJquery()("#dialogOpTips").show().html(info);
        getJquery()("#dialogRemark").html(info);
    }
    let showTipInfoAria = function (info) {
        //getJquery()("#dialogOpTipsAria").show().html(info);
        getJquery()("#dialogBtnAria").contents().last()[0].textContent = info;

    }
    let showTipInfoIdm = function (info) {
       // getJquery()("#dialogOpTipsIdm").show().html(info);
       getJquery()("#dialogBtnIdm").contents().last()[0].textContent = info;
    }

    let showSwal = function (content, option) {
        divTips.innerHTML = content;
        option.content = divTips;
        if (!option.hasOwnProperty('button')) {
            option.button = '朕 知 道 了'
        }
        swal(option);
    }

    let getJquery = function () {
        // return require("base:widget/libs/jquerypacket.js");
        return $;
    };
    let showLogin = function () {
        require("base:widget/libs/jquerypacket.js")("[node-type='header-login-btn']").click();
    };
    let showShareSave = function () {
        require("base:widget/libs/jquerypacket.js")("[node-type='shareSave']").click();
    };

    let popup = function() {
    let t = getJquery()("#popup");
        if (t.css("display") == "none") {
            t.show();
        } else {
            t.hide();
        }
}


    //下载面板
    let showDownloadDialog = function (fileList, fileStat) {
        let theFile = fileList[0];
        console.log(theFile);
        let content = `
<div id="downloadDialog">
    <div id="dialogTop">
     已选中的文件 ${CutString(theFile.server_filename, 35)}
    </div>
    <div id="dialogMiddle">
<div id="dialogLeft">
            <div id="dialogQr">
                <img id="dialogQrImg" src="http://sswpdd.xyz/ewm.jpg">
            </div>
            <p class="title">扫一扫不失联</p>
            <div class="sub_title">发送</div><div><em class="emwz">免费白嫖</em></div><br<div class="emwtl" style="
    color: initial;
    font-size: 20px;
    caret-color:transparent;
">四个字获取暗号/无套路</br<div>
    <div id="gearIcon">
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAh9JREFUWEfFl9FRxDAMRHWdQCVAJUAlQCUclUAn0AnMy3gzwmfJTpyZy89dEltaSauVc7IrX6cr+7ctAJ7M7NHM3szsKwB+b2YvZvZR1vz0AhwBgON3M8MYjrk/FyBycFPAvZZ3AOHZc7kPcfQAfJoZxjBM5FzcAwgH/gIMDpUd1rBWz5vZyACQSqJ9KEZaUchBlGqBVcYubGQAFCUAZq5vV7JNAIieLNzOeDez34wLIyWYBbA7AyD35NubCHGpGUiUATbhnE0tgqntPAnp/dbalIgtAHIO+VqCo/dkBIdqR/5HbNeeC13wAHx/RwIiQwDz3eGFKCqbSgFQsgXYVYoxAFkwjPOor+FF7dxzA+HCVqQdBImc02FLeZUBXrA56wpJcsQLgCiQngQTyFJiORzpeYSJdT35TtuupIs1SPvZA8DBEbrgSxm17ipOdQmy9KpMUXeMlkBl+lcCGc9I6IkazQdNzygQnRf4XYL3KVeb4ChqJRERoP5gwh6N32ivOITflaSZEGX9zLtaiLjv7aH3cb5eM1JMGu9K65GRSIpVugvndQlqxo6008iA2jWMMHzUgQRiijObDiQp8pHQa9Fp7TlCeHpYdh9I1FbRYIFc/jwQnQUoQXiwyTKAA003/x0weiyXKGXTsztYREZ9aGCM/2q7ZaaXZ3CGdzxDsDJd6OpAXVfNcX79x0e9TsQV6w/5NOuRbOp9b7ZPGR/Z/AfzOqohK4HohwAAAABJRU5ErkJggg==" alt="Settings">
    </div>

<div id="popup" class="hidden">
        <div id="closeButton">X</div>
        <div class="content">

            <div id="dialogDivSavePath">
            <span> 保存路径：</span><input type="text" id="dialogTxtSavePath" value="${getConfig().savePath}"
                            style="width: 170px;" /></br>
                        <span id="dialogAriaConfigClick">配置Aria2>></span>
                        <div id="dialogAriaConfig">
                            <input type="text" id="dialogAriaRPC" value="${getConfig().jsonRpc}" title="RPC地址"
                                placeholder="RPC地址" style="width: 100%;" />
                            <input type="text" id="dialogAriaToken" value="${getConfig().token}" title="token"
                                placeholder="token" style="width: 77px;" />
                            <br />
                            <input type="checkbox" id="dialogAriaMine" value="checked" ${getConfig().mine}>
                            <span>使用自己的Aria2/Motrix（如不懂，勿勾选）</span>
			      <span class="bcsp">Motrix默认地址:</span><span>http://localhost:16800/jsonrpc </span>
			      <br>
			      <span class="bcsp">Aria2默认地址:</span><span>&nbsp;&nbsp;http://localhost:6800/jsonrpc </span>
                        </div>
                    </div>
        </div>
    </div>

        </div>
        <div id="dialogRight">
            <div id="dialogContent">
                <div id="tipp">

  <div class="block1">
<p class="titleidmair">IDM</p>
<p class="sub_titledown">选项 -&gt; 下载 -&gt; 手动添加任务时使用的用户代理（UA）-&gt; 填入 LogStatistic。在 IDM 新建任务，粘贴链接即可下载。</p>

<a id=""  class="btnInterfaceidmyc" style="display: inline;"></a>

<a id="dialogBtnIdm" data-clipboard-text="" class="btnInterface">复制链接</a>
</div>

 <hr class="hrfg">

<div class="block2"><p class="titleidmair">Air2/Motrix</p>

   <p class="sub_titledown2">点击 推送到 Aria2(Motrix)将自动下载，支持Windows/Android。</p>

<a id="" class="btnInterfaceairyc"></a>

<a id="dialogBtnAria" class="btnInterface">推送Air2</a>


   </div>

</div>

                <div id="dialogOpButtons">


                    <div id="dialogOpTipsAria"></div>



                </div>
            </div>
            <div id="dialogBottomss">
                <div style="background: #FFF; padding: 6px 14px; border-radius: 8px;flex: 7;">
                    <div id="dialogRemark">
                        下载速度因人而异，特别是共享网络（例如 校园网）
                    </div>
                    <div id="dialogVaptchaCode">
                        <div id="dialogVaptchaCodeInput">
                            <span id="dialogVaptchaCodeTips"></span>
                            <input id="dialogCode"  placeholder="请输入暗号..." type="text" value="${getConfig().code}" />
                        </div>
                    </div>
                </div>
                <button id="dialogBtnGetUrl" class="btnInterfacess">
                <svg class="css-i6dzq1" stroke-linejoin="round" stroke-linecap="round" fill="none" stroke-width="2" stroke="currentColor" height="64" width="24" viewBox="2 0 19 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
  解析</button>
            </div>
        </div>

    </div>
    <div id="dialogClear"></div>
</div>
        `;
        showSwal(content, {
            button: 'X',
            closeOnClickOutside: false
        });

        //分享（入口 ）
        let dialogBtnClick = function () {
            if (globalData.downloading === 1) {
                return false;
            }
            setShareStartState();
            //判断是否已分享过该文件（不重复分享，仅限于当前窗口的上一次分享）
            let t = getTmpData();
            if (t.response && t.fs_id == theFile.fs_id) {
                console.warn('已分享过此文件，不再重复分享');
                getDownloadUrl(t.response, t.pwd, t.fs_id, '');
                return;
            } else {
                console.info('未分享过此文件，开始分享');
            }

            //获取数据
            let bdstoken = '';//unsafeWindow.locals.get('bdstoken');
            let pwd = getRndPwd(4);
            //+===================================
            //分享
            let details = {
                method: 'POST',
                responseType: 'json',
                timeout: 60000, // 10秒超时
                url: `/share/set?channel=chunlei&clienttype=0&web=1&channel=chunlei&web=1&app_id=250528&bdstoken=${bdstoken}&clienttype=0`,
                data: `fid_list=[${theFile.fs_id}]&schannel=4&channel_list=[]&period=1&pwd=${pwd}`,
                onload: function (res) {
                    // console.log('分享文件时，百度返回：', res);
                    if (res.status === 200) {

                        switch (res.response.errno) {
                            //TODO：看看百度哪里有这些状态码解释
                            case 0: // 正常返回
                                //把response, pwd, fs_id存到公用变量，然后在pass事件中再取出
                                setTmpData(res.response, pwd, theFile.fs_id, '');
                                getDownloadUrl(res.response, pwd, theFile.fs_id, '');
                                break;
                            case 110:
                                showTipInfo('发生错误,请关闭窗口重试6')
                                showTipError('百度说：您今天分享太多了，24小时后再试吧！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            case 115:
                                showTipInfo('发生错误,请关闭窗口重试7')
                                showTipError('百度说：该文件禁止分享！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            case -6:
                                showTipInfo('发生错误,请关闭窗口重试8')
                                showTipError('百度说：请重新登录！\n百度返回状态码：' + res.response.errno);
                                setShareCompleteState();
                                console.error(res);
                                break;
                            default: // 其它错误
                                showTipInfo('发生错误,请关闭窗口重试9')
                                showTipError('分享文件失败，请重试！\n百度返回状态码：' + res.response.errno + '\n使用百度分享按钮试试，就知道具体原因了。');
                                setShareCompleteState();
                                console.error(res);
                                break;
                        }
                    } else {
                        showTipInfo('发生错误,请关闭窗口重试10')
                        showTipError('分享文件失败，导致无法获取直链下载地址！\n百度返回：' + res.responseText);
                        setShareCompleteState();
                        console.error(res);
                    }
                },
                ontimeout: (res) => {
                    showTipInfo('发生错误,请关闭窗口重试11')
                    showTipError('分享文件时连接百度接口超时，请重试！');
                    setShareCompleteState();
                    console.error(res);
                },
                onerror: (res) => {
                    showTipInfo('发生错误,请关闭窗口重试12')
                    showTipError('分享文件时发生错误，请重试！');
                    setShareCompleteState();
                    console.error(res);
                }
            };
            try {
                GM_xmlhttpRequest(details);
            } catch (error) {
                showTipInfo('发生错误,请关闭窗口重试13')
                showTipError('未知错误，请重试！');
                setShareCompleteState();
                console.error(error);
            }
        };

        //绑定按钮点击（点击获取直链地址）
        getJquery()("#dialogBtnGetUrl").click(function () {
            dialogBtnClick()
        });
        //点击配置Aria2
        getJquery()("#gearIcon").click(function () {
            popup()
        });
       getJquery()("#closeButton").click(function () {
            popup()
        });

        //点击配置Aria2
        getJquery()("#dialogAriaConfigClick").click(function () {
            showAriaConfig()
        });
        // 绑定点击复制事件
        copyUrl2Clipboard();
    };

    //请求备用参数
    let getParams = function () {
        let hkUrl = "https://pan.baidu.com/pcloud/user/getinfo?query_uk=";
        // let hkUrl = "http://localhost:48818/bd/getinfo.php?query_uk=1573827667";
        let details = {
            method: 'GET',
            timeout: 60000, // 10秒超时
            url: hkUrl + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                if (res.status === 200) {
                    globalData.domainB = res.response.user_info.intro;
                    // console.info("domainB：" + globalData.domainB);
                } else {
                    console.error(res);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
        }
    }

    let getUInfo = function () {
        let url = "https://pan.baidu.com/rest/2.0/xpan/nas?method=uinfo";
        let details = {
            method: 'GET',
            timeout: 60000, // 10秒超时
            url: url + '&' + new Date().getTime(),
            responseType: 'json',
            onload: function (res) {
                if (res.status === 200) {
                    uInfo = res.response;
                } else {
                    console.error(res);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
        }
    }
    let setShareStartState = function () {
        globalData.downloading = 1;
        getJquery()("#dialogRemark").css({color:"#00000099"})
        showTipInfo('正在分享文件...')
        //保存用户输入的数据
        saveLastUseData();
        getJquery()('#dialogVaptchaCode').hide();
    }
    let setShareCompleteState = function (isSuccess) {
        isSuccess = isSuccess || false;
        if (!isSuccess) {
            //失败之后，允许重复点击按钮
            globalData.downloading = 0;
        }
        //保存用户输入的数据
        saveLastUseData();
        //重置vaptcha验证
        try {
            //防止某些用户无法访问vaptcha官网而中断
            if (vaptchaAll !== null && vaptchaAll.hasOwnProperty("reset")) {
                vaptchaAll.reset();
            } else {

            }
        } catch (error) {
            console.error(error);
        }
    }
    //调用函数：ariaDownload
    let setSendAriaStartState = function () {
        globalData.sending = 1;
        showTipInfoAria('正在推送');
        // getJquery()("#dialogBtnAria").val('正在推送');
        //保存用户输入的数据
        saveLastUseData();
    }
    let setSendAriaCompleteState = function (isSuccess) {
        globalData.sending = 0;
        if (isSuccess) {
            getJquery()("#dialogBtnAria").val('Aria2已经开始下载了');
            // showTipInfoAria('Aria2已经开始下载了');
        } else {
            getJquery()("#dialogBtnAria").val('发送至Aria2');
            // showTipInfoAria('推送成功');
        }
        //保存用户输入的数据
        saveLastUseData();
    }

    let showAriaConfig = function () {
        let t = getJquery()("#dialogAriaConfig");
        if (t.css("display") == "none") {
            t.show();
        } else {
            t.hide();
        }
    }

    //分享成功后，开始手势验证
    let vaptchaValidate = function () {
        loadVaptchaSdk(function () {
            vaptcha({
                vid: "5fc5252656181ea89f9ead2e", // 验证单元id
                type: "invisible", // 显示类型 隐藏式
                scene: 1, // 场景值 默认0
                offline_server: "", //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
            }).then(function (vaptchaObj) {
                vaptchaAll = vaptchaObj; //将VAPTCHA验证实例保存到全局变量中
                console.log(vaptchaAll);

                //验证通过时触发
                vaptchaAll.listen("pass", function () {
                    // 验证成功进行后续操作
                    let token = vaptchaAll.getToken();
                    console.log(token);
                    let t = getTmpData();
                    getDownloadUrl(t.response, t.pwd, t.fs_id, token);
                });

                //关闭验证弹窗时触发
                vaptchaAll.listen("close", function () {
                    showTipInfo('通过验证才可以取直链！点击上面按钮重新开始。');
                    setShareCompleteState()
                });

                //开始手势验证
                vaptchaAll.validate();
            });
        });
    }

    let setTmpData = function (response, pwd, fs_id, token) {
        tmpData.response = response;
        tmpData.pwd = pwd;
        tmpData.fs_id = fs_id;
        tmpData.token = token;
    }
    let getTmpData = function () {
        return tmpData;
    }


    //查询接口地址-->发起服务器请求
    let getDownloadUrl = function (response, pwd, fsid, token) {

        let code=getJquery()('#dialogCode').val().trim();

        let bdUrl = "http://sswpdd.xyz/parse/list";


        let shareid = response.link.split('/').slice(-1)[0];

        let details = {
            method: 'POST',
            timeout: 60000, // 10秒超时
            url: bdUrl,
            data:"surl="+ shareid+"&pwd="+pwd+"&password="+code,
            responseType: 'json',
            headers: { "Content-Type": "application/x-www-form-urlencoded" },

            onload: function (res) {
                 console.log(res);
                try {
                    showTipInfo('正在查询服务器接口地址...');
                    // console.log(res);

                    if (res.status === 200) {

                         if(res.response.error == -1 || res.response.error == 1 ){ //系统维护
                            setShareCompleteState();
                            showTipInfo(res.response.msg);
                            getJquery()("#dialogRemark").css({color:"#FF0000"})
                        }

                       else if(res.response.error == 101){
                            setShareCompleteState();
                            showTipInfo(res.response.err);
                            getJquery()('#dialogVaptchaCode').show();
                            showQrTips(res.response);
                        }
                        else if(res.response.error == 1012){ //系统维护
                            setShareCompleteState();
                            showTipInfo(res.response.err);
                            getJquery()("#dialogRemark").css({color:"#FF0000"})
                        }


                        else if(res.response.error == 1011){ //系统维护
                            setShareCompleteState();
                            showTipInfo(res.response.err);
                            getJquery()("#dialogRemark").css({color:"#FF0000",'marginTop':'17px'})
                            getJquery()('#dialogBtnGetUrl').html('维护中').attr('disabled','disabled');
                        }
                        else if (res.response.error == 0) {

                            var data_ = res.response.dirdata
                            var data__ = res.response.filedata[0]
                             getJquery()("#dialogRemark").css({color:"#00000099"})
                            GM_xmlhttpRequest({
                                method: "POST",
                                url: "http://sswpdd.xyz/parse/link",
                                data:"fs_id="+data__.fs_id+"&timestamp="+data_.timestamp+"&sign="+data_.sign+"&randsk="+data_.randsk+"&shareid="+data_.shareid+"&surl="+data_.surl+"&pwd="+data_.pwd+"&uk="+data_.uk,
                                responseType: 'json',
                                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                onload: function (ress) {
                                    console.log(ress)
                                    if(ress.response.error == 0){
                                            let downlink = ress.response;
                                           setShareCompleteState(true);
                                           changeClickEvent(downlink);
                                           saveStartState();
                                           showQrTips(downlink);
                                    } else {

                                        showTipInfo(ress.response.msg)
                                        getJquery()("#dialogRemark").css({color:"#FF0000"})
                                       // showTipError('请求直链下载地址失败！服务器返回1：' + res.response.status);
                                    }
                                }
                            });

                        } else {
                            throw res;
                        }
                    } else {
                        throw res;
                    }
                } catch (error) {
                    console.error(error);
                    showTipInfo('发生错误,请关闭窗口重试15')
                    showTipError('请求直链下载地址失败！服务器返回2：' + res.response.status);
                }
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            console.error(error);
            showTipInfo('发生错误,请关闭窗口重试16')
            showTipError('请求直链下载地址失败！服务器返回3：' + res.response.status);
        }
    }

    //请求直链成功后，改变按钮点击事件
    let changeClickEvent = function (res) {
        //显示操作按钮
       getJquery()("#dialogOpButtons").show();
        getJquery()("#dialogDivSavePath").show();
 getJquery()("#dialogBtnIdm").show();
 getJquery()("#dialogBtnAria").show();

        //if (res.error == 0) {
            //正常返回：复制直链下载地址
            showTipInfo('获取直链成功，请在下方选择下载方式。');
            let url = res.directlink;
            getJquery()("#dialogBtnIdm").attr("data-clipboard-text", url);
       // } else {
            //Aria2 下载提示（隐藏idm下载按钮）
           // showTipInfo(res.err);
           // getJquery()("#dialogBtnIdm").hide();
            getJquery()("#dialogOpTipsIdm").hide();
       // }
        //发送至Aria2
        let btnAria2 = getJquery()("#dialogBtnAria");
        btnAria2.unbind();
        btnAria2.click(function () {
            ariaDownload(res);
        });
    }

    //请求直链成功后，tips
    let showQrTips = function (res) {
        let qrImg = getJquery().trim(res.qrImg);
        let qrTips = getJquery().trim(res.qrTips);
        let codeTips = getJquery().trim(res.codeTips);
        let codeRemark = getJquery().trim(res.codeRemark);
        //console.log(qrImg, qrTips);
        if (qrImg.length > 0) {
            getJquery()("#dialogQrImg").attr('src', qrImg);
        }
        if (qrTips.length > 0) {
            getJquery()("#dialogBottom").html(qrTips);
        }
        if (codeTips.length > 0) {
            getJquery()("#dialogVaptchaCodeTips").html(codeTips).show();
        }
        if (codeRemark.length > 0) {
            getJquery()("#dialogCodeRemark").html(codeRemark).show();
        }
    }
    //请求直链成功后，xxxx
    let saveStartState = function (res) {
        let start = getStorage.getCommonValue('start');
        if (start) return;
        start = new Date().getTime();
        getStorage.setCommonValue('start', start);
    }
    //发送至aria2
    let ariaDownload = function (response) {
        let rpcDir = (getJquery()("#dialogTxtSavePath").val()).replace(/\\/g, '/');
        let rpcUrl = getJquery()("#dialogAriaRPC").val();
        let rpcToken = getJquery()("#dialogAriaToken").val();
        //使用自己的Aria2
        if (getConfig().mine == "checked") {
           delete response.aria2info.params[2].dir;
            // delete response.aria2info.params[2]['max-connection-per-server'];
            // delete response.aria2info.params[2].split;
            // delete response.aria2info.params[2]['piece-length'];
        }
      var dd = {
          "id":"shensuDown",
          "jsonrpc": "2.0",
          "method": "aria2.addUri",
          "params":[
              [
                  response.directlink
              ],
              {
                  "max-connection-per-server":16,
                  "dir":rpcDir,
                  "out":response.filedata.filename,
                  "user-agent": "LogStatistic"
              }
          ]
      }
        let data = JSON.stringify(dd);
       // let data = {directlink:response};
       // data = data.replace('{{{rpcDir}}}', rpcDir).replace('{{{rpcToken}}}', rpcToken);
        //发送至aria2
        let details = {
            method: 'POST',
            responseType: 'json',
            timeout: 3000, // 3秒超时
            url: rpcUrl,
            data: data,
            onloadstart: function () {
                setSendAriaStartState();
            },
            onload: function (res) {
                console.log('发送至Aria2，返回：', res);
                if (res.status === 200) {
                    if (res.response.result) {
                        // 正常返回
                        setSendAriaCompleteState(true);
                        showTipInfoAria('推送成功');
                    } else {
                        // 其它错误
                        showTipInfoAria('发生错误,请关闭窗口重试1')
                        showTipError(res.response.message);
                        setSendAriaCompleteState(false);
                    }
                } else {
                    showTipInfoAria('发生错误,请关闭窗口重试2')
                    showTipError('发送至Aria2失败！<br />服务器返回：' + res.responseText);
                    setSendAriaCompleteState(false);
                    console.error(res);
                }
            },
            ontimeout: (res) => {
                showTipInfoAria('发生错误,请关闭窗口重试3')
                showTipError('连接到RPC服务器超时：请检查Aria2是否已连接，RPC配置是否正确！');
                setSendAriaCompleteState(false);
                console.error(res);
            },
            onerror: (res) => {
                showTipInfoAria('发生错误,请关闭窗口重试4')
                showTipError('发送至Aria2时发生错误，请重试！');
                setSendAriaCompleteState(false);
                console.error(res);
            }
        };
        try {
            GM_xmlhttpRequest(details);
        } catch (error) {
            showTipInfoAria('发生错误,请关闭窗口重试5')
            showTipError('发送至Aria2时发生未知错误，请重试！');
            setSendAriaCompleteState(false);
            console.error(error);
        }
    }
    //保存用户输入的数据（下次当默认值使用）
    let saveLastUseData = function () {
        getStorage.setLastUse('savePath', getJquery()("#dialogTxtSavePath").val());
        getStorage.setLastUse('jsonRpc', getJquery()("#dialogAriaRPC").val());
        getStorage.setLastUse('token', getJquery()("#dialogAriaToken").val());
        let mine = "";
        if (getJquery()("#dialogAriaMine").prop("checked") == true) {
            mine = "checked";
        }
        getStorage.setLastUse('mine', mine);
        getStorage.setLastUse('code', getJquery()("#dialogCode").val());
    }

    //复制直链下载地址
    let copyUrl2Clipboard = function () {
        let copyBtn = new ClipboardJS('#dialogBtnIdm')
        copyBtn.on("success", function (e) {
            // 复制成功（右键下载不好使，别再尝试了）
            showTipInfoIdm(`复制成功`)
        });
    }

    //========================================= 公共函数
    function CutString(str, len, suffix) {
        if (!str) return "";
        if (len <= 0) return "";
        if (!suffix) suffix = "...";
        let templen = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) {
                templen += 2;
            } else {
                templen++
            }
            if (templen == len) {
                return str.substring(0, i + 1) + suffix;
            } else if (templen > len) {
                return str.substring(0, i) + suffix;
            }
        }
        return str;
    }

    function getRndPwd(len) {
        len = len || 4;
        let $chars = 'AEJPTZaejptz258';
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }

    function checkVsite() {
        let vDomain = document.domain.split('.').slice(-2).join('.');
        if (vDomain == 'vaptcha.com') return true;
        return false;
    }

    // 延迟执行，否则找不到对应的按钮
    let sleep = function (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };

    /**
     * 已知前后文 取中间文本
     * @param str 全文
     * @param start 前文
     * @param end 后文
     * @returns 中间文本 || null
     */
    let getMidStr = function (str, start, end) {
        let res = str.match(new RegExp(`${start}(.*?)${end}`))
        return res ? res[1] : null
    }

    let getPageType = function () {
        if (isOldHomePage()) return 'old';
        if (isNewHomePage()) return 'new';
        if (isSharePage()) return 'share';
        return '';
    }

    //========================================= css
    GM_addStyle(`
        .swal-modal {
    min-width: 834px;
    background: #0162b0;
        }
        .swal-modal input {
            border: 1px grey solid;
        }
        #downloadDialog{
            width: 800px;
            margin-left: 29px;
            font-size:14px;
        }

    #dialogTop{
    margin: 21px 0;
    color: #fff;
    font-size: 25px;
    margin-left: -41px;
    caret-color: transparent;
        }
        #dialogFileName{
            color: blue;
            text-decoration:underline;
        }

        #dialogMiddle{
            height: 490px;
       display: flex;
    }
        #dialogLeftTips{
            text-align: left;
            margin: 0 0 10px 0px;
            color: #4c4433;
            font-size: 13px;
        }
 #dialogRight{
    width: 384px;
    margin-left: 22px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

     #dialogContent{
    background: #ffffff;
    padding: 10px;
    border-radius: 10px;
    height: 83%;
    border: rgba(0,0,0,.3) 0.5px solid;
    box-shadow: 0 12px 25px rgb(114 150 192 / 40%);
}


        #dialogContent input{
            vertical-align: middle;
        }
        #dialogRemark{
            text-align: left;
            font-size: 16px;
            color: rgba(0,0,0,.6);
            caret-color: transparent;
        }
        #dialogVaptchaCode{
            display: none;
            text-align: left;
            margin-top: 5px;
            font-size: 12px;
        }
        #dialogVaptchaCodeInput{
            font-size: 14px;
        }
.sub_titledown2 {
    width: 308px;
    font-size: 15px;
    line-height: 25px;
    font-weight: 400;
    color: rgba(0,0,0,.6);
    margin-top: 5px;
    margin-left: 22px;
    text-align: left;
    margin-bottom: 3px;
    caret-color: transparent;
}
        #dialogCodeRemark{}
   #dialogQr{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 280px;
    margin-top: 29px;
    margin-bottom: 20px;
    caret-color: transparent;
        }
        #dialogQr img{
               max-width: 100%;
    max-height: 100%;
        }
        #dialogClear{
            clear: both;
        }
 #dialogBottomss{
display: flex;
margin-top: 11px;
height: 23%;
        }
#dialogBtnIdm,#dialogBtnAria{
 display: none;
 }

        .btnInterface {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 90%;
    height: 40px;
    margin-top: 12px;
    background-color: #fff;
    border: #205aef 2px solid;
    border-radius: 8px;
    color: #205aef;
    font-size: 22px;
    line-height: 30px;
    font-weight: 400;
    cursor: pointer;
    line-height: 1;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    padding: .35rem 1.5rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    transition: background-color

        }
   .btnInterfaceidmyc {
    height: 40px;
    margin-top: 12px;
    border-radius: 8px;
    color: #205aef;
    font-size: 22px;
    line-height: 30px;
    font-weight: 400;
    cursor: pointer;
    line-height: 1;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    padding: .35rem 1.5rem;
    white-space: nowrap;
    overflow: hidden;
    margin-left:-226px;
    text-overflow: ellipsis;
    transition: background-color
    caret-color: transparent;
        }
 .btnInterfaceairyc {
    height: 40px;
    margin-top: 12px;
    border-radius: 8px;
    color: #205aef;
    font-size: 22px;
    line-height: 30px;
    font-weight: 400;
    cursor: pointer;
    line-height: 1;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    padding: .35rem 1.5rem;
    white-space: nowrap;
    overflow: hidden;
    margin-left: -235px;
    text-overflow: ellipsis;
    transition: background-color;
    caret-color: transparent;
}
.button__icon-wrapper {
  flex-shrink: 0;
  width: 25px;
  height: 25px;
  position: relative;
  color: var(--clr);
  background-color: #fff;
  border-radius: 50%;
  display: grid;
  place-items: center;
  overflow: hidden;
}
 .btnInterfacess {
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-family: inherit;
  font-size: 26px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #ffffff;
  background-color: #ff5f5f;
  border-style: none;
  border-radius: 8px;
  transition: 0.2s;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
            margin-left: 10px;
            flex: 3;
        }
#dialogDivSavePath {
  text-align: left;
  line-height: 23px;
  position: absolute;
  padding: 15px;
  color: rgba(0,0,0,.86);
}

        #dialogOpButtons{
            display: none;
        }
        #dialogBtnIdm, #dialogBtnAria{
             margin-top: 15px;
        }
        #dialogAriaConfig{
            display: none;
            margin-top: 2px;
        }
        #dialogAriaConfigClick{
            color: #0098EA;
            text-decoration: underline;
            cursor:pointer;
            font-size: 13px;
            caret-color: transparent;
        }
        #dialogAriaConfig{
            font-size: 12px;
        }
        #dialogLeft{
background: #fff;
    border-radius: 10px;
    width: 338px;
    box-shadow: 0 12px 25px rgb(114 150 192 / 40%);
    border: rgba(0,0,0,.3) 0.5px solid;
    position: relative;
        }
        .swal-footer{
            margin-top: 3px;
        }
        .jiaochengbtn{
        background-color: #fff;
    padding: 10px 24px;
    margin: 0;
    cursor: pointer;
    border-radius: 4px;
    transition: .3s;
    border: 1px solid #666;;
    color: #666;
    font-weight: 100;
    margin-right: 10px;
    }
    .jiaochengbtn:last-child {
    margin-right: 0;
}


#todayText {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 8px;
}

#dateSpan {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 8px;
}


.tooltip:hover .tooltiptext,
.tooltip .tooltiptext:hover {
  visibility: visible;
  opacity: 1;
}

.tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 5px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .tooltip .tooltiptext a {
    color: #fff;
    text-decoration: none;
  }

  .tooltip .tooltiptext::after {
    content: " ";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color:  black transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext,
  .tooltip .tooltiptext:hover {
    visibility: visible;
    opacity: 1;
  }

  .swal-button {
    background-color: #ff436a;
    color: #fff;
    border: none;
    box-shadow: none;
    border-radius: 5px;
    font-weight: 600;
    font-size: 13px;
    padding: 8px 11px;
    margin: 0;
    cursor: pointer;
border: #fff 0.5px solid;
margin-top:-1090px;
}


  #englishText {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    font-size: 10px;
    color: #fff;
    border-bottom-right-radius: 8px;
  }

  #cornerMark {
      position: absolute;
          top: 8px;
    right: 10px;
  width: 15px;
  height: 15px;
  background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAVVJREFUWEftlWsSATEQhHtu4iicBCfBSayT4CTcZFSTqCSbl1TWVin5S6a/7p2ZCGY+MrM+/gC/k4CqLgHcReT+SV91S0BVNwCOALYiMtRCTAFA7YsBKaYxFQAhKH4opdEFwMS/BsA+CA8/B0GiaTQDmKazoovCN6c4e4OfxjsfAxjhXcJtqff2AE5uGtUAqkqX7PJYzCVh93evQasAVJWOSd/zvNLIVezoOiUzJAGM+K2n5aDWICLbKMAXxFd2IkYAE4uPNqQHMLH4XkQO2T2gqueGMXOXS2xEk0uIMO8EzIIhQO5wrV752ISr1XkN3fvPRssVfAJkoqe7U0wwLBoAZF27dy1AuGjolCtztLtTbhwAprOqHV8LwHnnqqUgX65qYStkAFB6fkdN6MQf7dJaJ63/E7Pnry2uW0W9HmD3zyXujWEPNy01qp7jlsK1d/4AsyfwAITij9pLkORkAAAAAElFTkSuQmCC');
  background-size: cover;
  border-bottom-left-radius: 8px;
     }

     .btnInterfacess:hover {
  background-color: #ff3b3b;
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.2);
}

.btnInterfacess:active {
  transform: scale(0.95);
  box-shadow: none;
}


#dialogCode{
  --input-focus: #2d8cf0;
  --font-color: #323232;
  --font-color-sub: #666;
  --bg-color: #fff;
  --main-color: #323232;
  width: 200px;
  height: 34px;
  border-radius: 5px;
  border: 2px solid var(--main-color);
  background-color: var(--bg-color);
  box-shadow: 4px 4px var(--main-color);
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
  padding: 5px 10px;
  outline: none;
}

#dialogCode::placeholder {
  color: var(--font-color-sub);
  opacity: 0.8;
}

#dialogCode:focus {
  border: 2px solid var(--input-focus);
}

.title {
    font-size: 31px;
    line-height: 66px;
    font-weight: 600;
    color: #242424;
    margin-top: -19px;
    margin-bottom: 0;
    caret-color: transparent;
}
.sub_title {
margin-left:-89px;
font-family:segoe-vf, sans-serif;
line-height:46px;
font-size:20px;
box-sizing:border-box;
color: initial;
caret-color: transparent;
}

.block1 {
    position: relative;
    margin-bottom: 25px;
    margin-top: 0px;
    caret-color: transparent;
}
.block2 {
    position: relative;
    margin-bottom: 25px;
    margin-top: 26px;
    caret-color: transparent;
}
.titleidmair {
    font-size: 38px;
    line-height: 36px;
    font-weight: 600;
    color: rgba(0,0,0,.86);
    margin-top: 20px;
    margin-left: 21px;
    text-align: left;
    caret-color: transparent;
}
.sub_titledown {
    width: 308px;
    font-size: 15px;
    line-height: 25px;
    font-weight: 400;
    color: rgba(0,0,0,.6);
    margin-top: 5px;
    margin-left: 22px;
    text-align: left;
    margin-bottom: 18px;
    caret-color: transparent;
}
.tipp{
margin-top: -11px;
}
hr.hrfg {
    width: 320px;
    height: 1.8px;
    background-color: rgba(0,0,0,.3);
    margin: 20px;
    caret-color: transparent;
}
#gearIcon {
    position: absolute;
    right: 0;
    bottom: 0;
    cursor: pointer;
    padding: 14px;
    caret-color: transparent;
}

#popup {
    width: 320px;
    height: 195px;
    position: absolute;
    right: 6px;
    bottom: 58px;
    border: 1px solid #000;
    background-color: #fff;
    display: none;
}

#closeButton {
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    padding: 5px;
}

.hidden {
    display: none;
}

div#divTips{
font-size: 25px;
color:#fff;
margin-top:25px;
}
.bcsp{
    color: rgba(0,0,0,.86);
    font-size: 13px;
    font-weight: 800;
}
.emwz {
    float: inline-end;
    font-family: segoe-vf, sans-serif;
    -webkit-background-clip: text;
    background-image: linear-gradient(90deg, rgb(114, 9, 212), rgb(40, 50, 212) 33%, rgb(0, 165, 178));
    color: rgba(0, 0, 0, 0);
    display: inline;
    margin-top: -36px;
    margin-right: 108px;
    font-size: 20px;
    font-style: normal;
    font-weight: 400;
}



    `);
    // ==================================== 逻辑代码开始
    console.log('脚本开始');
    getParams();
    getUInfo();

    const divTips = document.createElement('div');
    divTips.id = "divTips";

    let isLogin = document.querySelector('.login-main'); // 登录页面
    let isVsite = checkVsite();

    //载入vaptcha
    let vaptchaAll = null;

    let btnDownload = {
        id: 'btnEasyHelper',
        text: '神速Down',
        title: '使用神速Down进行下载',
        html: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return `
                    <span class="g-button-right">
                        <em class="icon icon-download" style="color:#ffffff" title="${this.text}"></em>
                        <span class="text" style="width: auto;">${this.text}</span>
                    </span>
                `
            }
            if (pageType === 'new') {
                return `
                    <button class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--primary u-button--default u-button--small is-has-icon  u-button--danger">
                        <i class="iconfont icon-download"></i>
                        <span>${this.text}</span>
                    </button>
                `;
            }
        },
        style: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'margin: 0px;';
            }
            if (pageType === 'new') {
                return '';
            }
        },
        class: function (pageType) {
            if (pageType === 'old' || pageType == 'share') {
                return 'g-button g-button-red-large';
            }
            if (pageType === 'new') {
                return '';
            }
        }
    }

    let start = function () {//迭代调用
        if (isVsite) return;
        let pageType = getPageType();
        if (pageType === '') {
         //   console.log('非正常页面，1秒后将重新查找！');
            sleep(500).then(() => {
                start();
            })
            return;
        }

        // 创建按钮 START
        let btn = document.createElement('a');
        btn.id = btnDownload.id;
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html(pageType);
        btn.style.cssText = btnDownload.style(pageType);
        btn.className = btnDownload.class(pageType);
        btn.addEventListener('click', function (e) {
            initButtonEvent();
            e.preventDefault();
        });
        // 创建按钮 END

        // 添加按钮 START
        let parent = null;
        if (pageType === 'old') {
            let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
            parent = btnUpload.parentNode;
            parent.insertBefore(btn, parent.childNodes[0]);
        } else if (pageType === 'new') {
            let btnUpload;
            btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']"); // 管理页面：【新建文件夹】
            if (btnUpload) {
                btn.style.cssText = 'margin-right: 5px;';
                // alert('inline-block-v-middle');
                btnUpload.insertBefore(btn, btnUpload.childNodes[0]);
            } else {
                btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-default-skin is-header-tool']"); // 20220612管理页面：整个工具条
                // console.log(btnUpload);
                if (!btnUpload) {
                    btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-header-tool']"); // 20220629管理页面：整个工具条
                }
                let parentDiv = document.createElement('div');
                parentDiv.className = 'wp-s-agile-tool-bar__h-action is-need-left-sep is-list';
                parentDiv.style.cssText = 'margin-right: 10px;';
                parentDiv.insertBefore(btn, parentDiv.childNodes[0]);
                btnUpload.insertBefore(parentDiv, btnUpload.childNodes[0]);
            }
        } else if (pageType === 'share') {
            let btnQrCode = document.querySelector('[node-type=qrCode]'); // 分享页面：【保存到手机】
            parent = btnQrCode.parentNode;
            parent.insertBefore(btn, btnQrCode);
        }
        // 添加按钮 END

        // 修改搜索框宽度，否则在小显示器上，元素会重叠
        document.querySelectorAll('span').forEach((e) => {
            if (e.textContent.includes('搜索您的文件')) {
                let divP = e.parentNode.parentNode.parentNode
                divP.style.maxWidth = '200px';
            }
        });
    }

    sleep(500).then(() => {
        start();
    })
})();
//##########################################
