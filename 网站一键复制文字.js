// ==UserScript==
// @name         🎺🎺🎺📄百度文库｜文库｜下载｜复制｜wenku|VIP｜WORD｜GPT｜文库GPT|文章生成|文档搜索｜欢迎反馈｜度文库｜不定时福利
// @version      0.5.1
// @description  百度文库，文库，wenku,获取 WORD 格式全文，文字复制，支持下载，导出为 WORD，GPT，文库GPT，免费GPT，文章生成，对话，支持一键复制文字，原创，持续更新百度文库,不定时限时免费；
// @author       You
// @match        *://wenku.baidu.com/view/*
// @match        *://wenku.baidu.com/tfview/*
// @match        *://百度文库.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.4/jquery.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
// @require      https://unpkg.com/docx@7.1.0/build/index.js
// @grant        GM_info
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      120.53.243.70
// @connect      wkretype.bdimg.com
// @connect      wkrtcs.bdimg.com
// @connect      wkretype.bdimg.com
// @antifeature  ads      脚本包含搜索文本时，附带的广告
// @antifeature  payment  脚本文字搜索、转化等功能，需对接第三方接口付费
// @namespace    https://greasyfork.org/users/1052410
// @downloadURL https://update.greasyfork.org/scripts/469354/%F0%9F%8E%BA%F0%9F%8E%BA%F0%9F%8E%BA%F0%9F%93%84%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BD%9C%E6%96%87%E5%BA%93%EF%BD%9C%E4%B8%8B%E8%BD%BD%EF%BD%9C%E5%A4%8D%E5%88%B6%EF%BD%9Cwenku%7CVIP%EF%BD%9CWORD%EF%BD%9CGPT%EF%BD%9C%E6%96%87%E5%BA%93GPT%7C%E6%96%87%E7%AB%A0%E7%94%9F%E6%88%90%7C%E6%96%87%E6%A1%A3%E6%90%9C%E7%B4%A2%EF%BD%9C%E6%AC%A2%E8%BF%8E%E5%8F%8D%E9%A6%88%EF%BD%9C%E5%BA%A6%E6%96%87%E5%BA%93%EF%BD%9C%E4%B8%8D%E5%AE%9A%E6%97%B6%E7%A6%8F%E5%88%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/469354/%F0%9F%8E%BA%F0%9F%8E%BA%F0%9F%8E%BA%F0%9F%93%84%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%EF%BD%9C%E6%96%87%E5%BA%93%EF%BD%9C%E4%B8%8B%E8%BD%BD%EF%BD%9C%E5%A4%8D%E5%88%B6%EF%BD%9Cwenku%7CVIP%EF%BD%9CWORD%EF%BD%9CGPT%EF%BD%9C%E6%96%87%E5%BA%93GPT%7C%E6%96%87%E7%AB%A0%E7%94%9F%E6%88%90%7C%E6%96%87%E6%A1%A3%E6%90%9C%E7%B4%A2%EF%BD%9C%E6%AC%A2%E8%BF%8E%E5%8F%8D%E9%A6%88%EF%BD%9C%E5%BA%A6%E6%96%87%E5%BA%93%EF%BD%9C%E4%B8%8D%E5%AE%9A%E6%97%B6%E7%A6%8F%E5%88%A9.meta.js
// ==/UserScript==
$(document).ready(function() {


  let baseUrl = 'http://120.53.243.70/wk'
  // let baseUrl = 'http://127.0.0.1/wk';

  let httpClient = GM。xmlHttpRequest ? GM.xmlHttpRequest : (GM_xmlhttpRequest || null);

  // TODO
  // setTimeout(() => {
  //   $('.wk-chat-modal').hide();
  // }， 2000)

  let fkingSetValue = (key， val) => {
    if (GM_setValue) {
      return new Promise(resolve => {
        resolve(GM_setValue(key， JSON.stringify(val)));
      });
    } else if (GM.getValue) {
      return GM.setValue(key， JSON.stringify(val));
    }
  }

  let fkingGetValue = (key) => {
    if (GM_getValue) {
      return new Promise(resolve => {
        resolve(GM_getValue(key， "{}"))
      })
    } else if (GM.getValue) {
      return GM.getValue(key);
    }
  }
  fkingGetValue('FKKEYCODE').then(keyCode => {
    if (keyCode) {
      $('#wkKeyInput').val(JSON.parse(keyCode).key);
    }
  })

  fkingSetValue('FKGPTCONTENT', [
    { label: 'gpt', content: '我可以为您做点什么？，例如您可以输入"帮我写一份端午节日记，要求提到龙舟"' },
  ]).then(res => {
    

    fkingGetValue('FKGPTCONTENT').then(res => {
      let oldGPTContent = JSON.parse(res) || [];
      let html = '';
      oldGPTContent.forEach(content => {
        console.log('content',content)
        if (content.label == 'gpt') {
          html += `<div class="fk-gpt">
          <img class="fk-gpt-avatar" src="https://i.ibb.co/stZ7KCR/ai-avatar.png" />
          <div class="fk-gpt-wrap">
            <div class="fk-time-line">${formatTime(new Date())}</div>
            <div class="fk-gpt-content">${content.content}</div>
          </div>
        </div>`
        } else if (content.label == 'user') {
          html += `<div class="fk-user">
          <img class="fk-user-avatar" src="https://i.ibb.co/WzLrWRn/user-avatar.png" />
          <div class="fk-user-wrap">
            <div class="fk-time-line">2024-01-02 23:34:34</div>
            <div class="fk-user-content">${content.content}</div>
          </div>
        </div>`
        }
      });
      $('#fk2Answer').html(html);
    });
  })

  if (!httpClient) {
    alert('警告：文库脚本服务不可用，请勿继续使用，推荐使用谷歌浏览器，并安装油猴');
  }

  var md4sum = pageData.readerInfo.md5sum;
  var md4Last = '';
  if (md4sum.indexOf('&rtcs_flag') > -1) {
    let idx = md4sum.indexOf('&rtcs_flag');
    md4Last = md4sum.substring(idx);
  }

  let fkingHttp = (method, url, config) => {
    let options = {
      timeout: 30000,
    }
    if (config) {
      Object.assign(options, config);
    }
    return new Promise((resolve, reject) => {
      httpClient(Object.assign({
        method: method,
        url: url.indexOf('http') > -1 ? url : baseUrl + url,
        onload: function(response) {
          resolve(response);
        },
        onerror: function (err) {
          reject(err);
        },
        ontimeout: function () {
          reject();
        }
      }, options));
    })
  }

  let FKingDocConfigList = {};

  addFKingDom();

  addFKingListener();

  getFKingOtherInfo();


  function addFKingListener() {

    $('#triggerBtn').on('click', () => {
      toggleFKingOuterWrap();
    });


    $('#wkIconClose').on('click', () => {
      toggleFKingOuterWrap();
    });

    // 获取 key
    $('#wkGetCodeBtn').on('click', () => {
      getFKingKeyCode();
    });

    // 全部文字
    $('#wkFullTextBtn').on('click', () => {
      getFKingFullText();
    });

    // Export
    $('#wkExportBtn').on('click', () => {
      getFKingWord();
    });


    // 复制
    $('#wkCopyBtn').on('click', () => {
      if (!navigator.clipboard) {
        alert('此浏览器不支持一键复制')
      } else {
        if (document.getElementById('FKingInnerContent')) {
          navigator.clipboard.writeText(document.getElementById('FKingInnerContent').innerText);
        } else {
          navigator.clipboard.writeText('');
        }
      }
    });

    // 
    $('#fkpanelOne').on('click', () => {
      $('#fkpanelTwo').removeClass('fkactive');
      $('#fkpanelOne').toggleClass('fkactive');
      $('#fkPanelTwoContent').hide();
      $('#fkPanelOneContent').show();
    });

    $('#fkpanelTwo').on('click', () => {
      $('#fkpanelOne').removeClass('fkactive');
      $('#fkpanelTwo').toggleClass('fkactive');
      $('#fkPanelOneContent').hide();
      $('#fkPanelTwoContent').show();
    });

    $('#fkSendGPT').on('click', () => {
      genGPTContent();
    })
  }

  // 全部内容
  function getFKingFullText() {
    let docInfo = getFKingDocInfo();
    if (!docInfo) {
      hideFKingLoading();
      return;
    };

    showFKingLoading();

    let key = document.getElementById('wkKeyInput').value;
    key = String(key).trim();
    if (!key) {
      alert('请输入测试码');
      document.getElementById('wkKeyInput').focus();
      hideFKingLoading();
      return;
    }

    if (!/^\d+$/.test(key)) {
      alert('请输入正确的测试码');
      document.getElementById('wkKeyInput').focus();
      hideFKingLoading();
      return;
    }

    fkingSetValue('FKKEYCODE', {
      key: key
    });
    fkingHttp('GET', `/docInfo?id=${docInfo.id}&docName=${docInfo.docName}&key=${key}`).then(res => {
      let docInfoData = JSON.parse(res.responseText);
      if (docInfoData.code != 1) {
        hideFKingLoading();
        alert(docInfoData.msg);
      } else {

        console.log(docInfoData.data);
        
        FKingDocConfigList = docInfoData.data.docInfo || [];
        $('#FKingInnerContent').scrollTop(0);
        $('#FKingInnerContent').html('');
        let allHtml = genFKIngDocHtml(FKingDocConfigList);
        showFKingNotice(`<div style="font-size: 16px;font-weght: bold;">剩余次数 <em style="color: #dc3545">${docInfoData.data.remainText}</em></div>`);
        showFKingInnerHtml(allHtml)

        hideFKingLoading();
      }
    }).catch(err => {
      console.log(err)
    });
  }

  // 配置
  function getFKingDocInfo() {
    try {
      var id = pageData.viewBiz.docInfo.showDocId;
      var docType = pageData.viewBiz.docInfo.fileType;
      var docName = pageData.viewBiz.docInfo.title;

      if (!id) {
        showFKingNotice('未获取到文档ID');
        return;
      }

      if (!docType || docType != 'word') {
        // 强化提醒
        showFKingNotice('当前仅支持WORD格式');
        return;
      }

      if (!docName) {
        showFKingNotice('未获取到文档名称');
        return;
      }

      return {
        id: String(id).trim(),
        docType: String(docType).trim(),
        docName: String(docName).trim(),
      }
    } catch {
      showFKingNotice('文档识别出错，请反馈')
      hideFKingLoading();
    }
  }

  // 生成 HTML
  function genFKIngDocHtml(pageConfigList) {
    let allHtml = `<div>`
    pageConfigList.forEach(page => {
      let pageDiv = '<div class="page-wrap">'
      page.children.forEach((para) => {
        let lineHtml = '';
        if (para.tag == 'p') {
          lineHtml += genPHtml(para);
        } else if (para.tag == 'table') {
          lineHtml += genTableHtml(para);
        }
        pageDiv += lineHtml;
      });
      pageDiv += '</div>';
      allHtml += pageDiv;
    });

    return allHtml;
  }

  function genPHtml(para) {
    let pHtml = `<p style="${genStyle(para.style)}">`;
    para.children.forEach((block) => {
      if (block.tag == 'span') {
        if (Array.isArray(block.content)) {
          let spanHtml = '';
          block.content.forEach(ele => {
            let { c = '', t } = ele;
            if (t == 'span') {
              spanHtml += `<span>${c}</span>`
            }
          })
          pHtml += `<span style="${genStyle(block.style)}">${spanHtml}</span>`
        } else {
          pHtml += `<span style="${genStyle(block.style)}">${block.content}</span>`
        }
      } else if (block.tag == 'img') {
        pHtml += `<img style="${genStyle(block.style)}height: auto;" src="${(block.url + md4Last)}" />`
      } else if (block.tag == 'table') {
        
      }
    });
    pHtml+= '</p>'
    return pHtml;
  }

  function genTableHtml(table) {
    let tableHtml = '<table border="1" style="border-collapse: collapse;">';
    table.rows.forEach((row) => {
      let rowHtml = '<tr>';
      row.cells.forEach((cellBox) => {
        let cellHtml = `<td`;
        const { colspan = 0, rowspan = 0 } = cellBox;
        if (colspan) {
          cellHtml += ` colspan="${colspan}"`;
        }
        if (rowspan) {
          cellHtml += ` rowspan="${rowspan}"`;
        }
        cellHtml += '>';
        (cellBox.childList || []).forEach((realCell) => {
          if (realCell.tag && realCell.tag == 'table') {
            cellHtml += genTableHtml(realCell)
          } else if (realCell.tag && realCell.tag == 'p')  {
            cellHtml += genPHtml(realCell)
          }
        });

        cellHtml += "</td>"
        rowHtml += cellHtml;
      });
      rowHtml += `</tr>`
      tableHtml += rowHtml;
    });
    tableHtml += '</table>'
    return tableHtml;
  }

  function genStyle(obj) {
    let styleStr = '';
    Object.keys(obj).forEach(key => {
      if (key == 'height' || key == 'width') {
        styleStr += `${key}: ${obj[key]}px;`;
      } else {
        styleStr += `${key}: ${obj[key]};`;
      }
    })
    return styleStr
  }

  // 生成 word
  async function getFKingWord() {

    if (!FKingDocConfigList.length) {
      alert('请先获取全文');
      return;
    }


    let b = confirm('导出 WORD 为最新的测试功能，不够完善，感谢理解。有图片的文档，速度慢。WORD 将会导出到浏览器默认下载地址，清注意查看。确认开始导出么？');
    if (!b) {
      return;
    }

    showFKingLoading('有图片的导出会比较慢，请耐心等待。。。');

    let paragraphList = [];
    let pageLen = FKingDocConfigList.length;
    for (let i = 0; i < pageLen; i++) {
      let page = FKingDocConfigList[i];
      let lineLen = page.children.length;
      for (let j = 0; j < lineLen;j++) {
        let line = page.children[j]
        const { tag } = line;
        if (tag == 'p') {
          paragraphList.push(await genParagraph(line));
        } else if (tag == 'table') {
          paragraphList.push(await genTable(line));
        }
      }
    }

    setTimeout(() => {
      const doc = new docx.Document({
        sections: [{
            children: paragraphList,
          },
        ]
      });
      docx.Packer.toBlob(doc).then(blob => {
        let docInfo = getFKingDocInfo();
        saveAs(blob, `${docInfo.docName || 'test'}.docx`);
        hideFKingLoading();
      }).catch(err => {
        alert('导出 WORD 出错了,请重试')
        hideFKingLoading();
      })
    }, 1000)  
  }

  async function genParagraph(pData) {
    const { children = [], style = {} } = pData;

    let config = genParaStyleConfig(style);
    let ch = [];
    let len = children.length;
    for (let i = 0; i< len;i++) {
      let block = children[i]
      let { tag } = block;
      if (tag == "span") {
        ch.push(genTextRun(block));
      } else if (tag == 'img') {
        ch.push(await genImageRun(block));
      }
    }
    config.children = ch;
    return new docx.Paragraph(config);
  }

  const genTextRun = (spanData) => {
    let { style, content } = spanData;
    let config = genSpanStyleConfig(style);
    let txt = '';
    if (Array.isArray(content)) {
      content.forEach(el => {
        txt += (el.c || '')
      });
    } else {
      txt = content
    }
    config.text = txt;
    return new docx.TextRun(config)
  }

  const genImageRun = (imgData) => {
    return new Promise((resolve) => {
      const { url, style = {} } = imgData;
      const { width, height} = style;
      fkingHttp('GET', url + md4Last, {
        responseType: 'blob'
      }).then(res => {
        const image = new docx.ImageRun({
          data: res.response,
          transformation: {
            width: Number(width),
            height: Number(height),
          }
        });
        resolve(image)
      }).catch(err => {
        console.log(err);
      })
    })
  }

  const genParaStyleConfig = (style) => {

    let config = {
      children: [],
      spacing: {
        before: 5,
        after: 5
      }
    }
  
    if (style['text-align']) {
      config.alignment = makeAlignment(style['text-align'])
    }
  
    if (style['padding-top']) {
      config.spacing.before = Number((style['padding-top']).replace('px', '').replace('em', '')) * 1.6
    }  
    return config;
  }

  const genSpanStyleConfig = (style) => {
    let config = {
      text: ''
    };

  
    if (style['font-size']) {
      // config.size = convertMillimetersToTwip(Number((allStyle['font-size']).replace('px', '')) * 0.2644)
      config.size = Number((style['font-size']).replace('px', '')) * 1.6
    }
    if (style['font-family']) {
      config.font = style['font-family']
    }
  
    // if (allStyle['font-weight'] && Number(allStyle['font-weight']) > 600) {
    //   config.bold = true
    // }
  
    return config;
  }

  const makeAlignment = (align) => {
    if (align == 'center') {
      return docx.AlignmentType.CENTER
    } else if (align == 'justify') {
      return docx.AlignmentType.JUSTIFIED
    }
  }

  async function genTable (tableData) {
    let tbRows = [];
    let rowsLen = tableData.rows.length;
    for (let i = 0; i < rowsLen; i++) {
      let trData = tableData.rows[i];
      let tdLen = trData.cells.length;
      let rowChildren = [];
      for (let j = 0; j < tdLen; j++) {
        let tdData = trData.cells[j];
        const { colspan = 0, rowspan = 0, childList = []} = tdData;
        let tdParaList = [];
        for (let m = 0; m < childList.length; m++) {
          let p = childList[m];
          tdParaList.push(await genParagraph(p));
        }
        let cellConfig = {
          children: tdParaList
        } 
        if (colspan) {
          //@ts-ignore
          cellConfig.columnSpan = colspan;
        }
        if (rowspan) {
          //@ts-ignore
          cellConfig.rowSpan = rowspan;
        }
        rowChildren.push(new docx.TableCell(cellConfig))
      }
      tbRows.push(
        new docx.TableRow({
          children: rowChildren
        })
      )
    }
    return new docx.Table({
      rows: tbRows
    });
  }

  // 获取 key
  function getFKingKeyCode() {
    if (!httpClient) {
      alert('警告：文库脚本服务不可用，请勿继续使用，推荐使用谷歌浏览器，并安装油猴');
      return;
    }
    fkingHttp('GET', `/key/create`).then(res => {
      let data = JSON.parse(res.responseText);
      if (data.url) {
        window.open(data.url, '_blank');
      }

      if (data.keyStr) {
        showFKingNotice(data.keyStr);
      }

      if (data.otherInfo) {
        showFKingInnerHtml(data.otherInfo);
      }
    }).catch(err => {});
  }

  // 其他信息
  function getFKingOtherInfo() {
    fkingHttp('GET', `/other`).then(res => {
      let data = JSON.parse(res.responseText);
      if (data.code == 1) {
        if (data.fuli) {
          $('#lineWrap').append($(data.fuli));
        }
        if (data.prompt) {
          $('#lineWrap').append($(data.prompt));
        }
        if (data.qUrl) {
          let $img = $(document.createElement('img'));
          $img.attr('src', data.qUrl);
          $img.css('height', data.qUrlHeight);
          $img.css('width', data.qUrlWidth);
          $('#FKQrBox').append($img);
        }
      }
    }).catch(err => {
      console.log(err)
    })
  }

  function showFKingLoading(msg) {
    $('#ovMsg').text(msg || '正在搜索，预计需要15秒钟...');
    $('#wkOverlay').show(1);
  }

  function hideFKingLoading() {
    $('#wkOverlay').hide();
  }

  function showFKingNotice(content) {
    $('#FKINGOUTERWRAP #FKINGWKMsg').html(content || '').show();
    $('#FKINGOUTERWRAP #FKINGWKMsg').css('font-weight', 'bold');
    $('#FKINGOUTERWRAP #FKINGWKMsg').css('border', 'dashed #dc3545 1px');
  }

  function showFKingInnerHtml(content) {
    $('#FKINGOUTERWRAP #FKingInnerContent').html(content || '').show();
  }

  function toggleFKingOuterWrap() {
    if ($('#FKINGOUTERWRAP').css('right') == '-1000px') {
      $('#FKINGOUTERWRAP').animate({right: '0px'}, 'fast');
    } else {
      $('#FKINGOUTERWRAP').animate({right: '-1000px'}, 'fast');
    }
  }

  function genGPTContent() {

    if (document.getElementById('fkLoadingContent')) {
      alert('正常生成内容，请稍等');
      return;
    }
    let qVal = $('#fk2QsArea').val();
    if (!qVal) { return }
    $('#fk2Answer').append($(`<div class="fk-user">
      <img class="fk-user-avatar" src="https://i.ibb.co/WzLrWRn/user-avatar.png" />
      <div class="fk-user-wrap">
        <div class="fk-time-line">${formatTime(new Date())}</div>
        <div class="fk-user-content">${qVal}</div>
      </div>
    </div>`));
    $('#fk2Answer').append($(`<div class="fk-gpt">
      <img class="fk-gpt-avatar" src="https://i.ibb.co/stZ7KCR/ai-avatar.png" />
      <div class="fk-gpt-wrap">
        <div class="fk-time-line">${formatTime(new Date())}</div>
        <div id="fkLoadingContent" class="fk-gpt-content">思考中...</div>
      </div>
    </div>`));
    $('#fk2Answer').scrollTop(99999999);

    $('#fk2QsArea').val('');
    fkingHttp('POST', `/gpt`, {
      headers: {
        "Content-Type": "application/json"
      },
      responseType: 'json',
      data: JSON.stringify({
        prompt: qVal
      }),
    }).then(res => {
      let data = JSON.parse(res.responseText);
      if (data.code != 1) {
        let loadingD = $('#fkLoadingContent');
        if (loadingD.text() == '思考中...') {
          loadingD.text('');
        }
        loadingD.html('出错了');
        $('#fk2Answer').scrollTop(99999999);
        $('#fkLoadingContent').removeAttr('id');
        alert(data.msg);
      } else {
        let loadingD = $('#fkLoadingContent');
        if (loadingD.text() == '思考中...') {
          loadingD.text('');
        }
        let moreContent = data.data;
        if (moreContent) {
          loadingD.html(moreContent.content);
          $('#fk2Answer').scrollTop(99999999);
          $('#fkLoadingContent').removeAttr('id');
        }
      }
    }).catch(err => {
      console.log(err)
    })

    // let ev = new EventSource(`${baseUrl}/gpt?prompt=${qVal}`);
    // $('#fk2QsArea').val('');
    // ev.onmessage =  (event) => {
    //   if (event.data == '[DONE]') {
    //     $('#fkLoadingContent').removeAttr('id');
    //     ev.close();
    //     $('#fk2Answer').scrollTop(99999999);
    //   } else {
    //     let loadingD = $('#fkLoadingContent');
    //     if (loadingD.text() == '思考中...') {
    //       loadingD.text('');
    //     }
    //     let res = JSON.parse(event.data);
    //     let moreContent = res.choices[0].delta.content || '';
    //     if (moreContent) {
    //       loadingD.text(loadingD.text() + moreContent);
    //       $('#fk2Answer').scrollTop(99999999);
    //     }
    //   }
    // }

    // ev.onerror = (err) => {
    //   let loadingD = $('#fkLoadingContent');
    //   loadingD.text('出错了');
    //   loadingD.removeAttr('id');
    // }
  }

  function formatTime(date) {
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    return `${year}-${month+1}-${day} ${hour}:${minute}:${second}`
  }

  function addFKingDom() {
    $(`<style type='text/css'>
      .FKINGOUTERWRAP {
        position: fixed;z-index: 9000;right: -1000px;top: 66px;width: 1000px;box-sizing: border-box;border: 1px solid #0075ff;border-right: none;
      }
      .FKINGOUTERWRAP .wk-icon-close {
        position: absolute;right: -14px;top: -12px;height: 36px;width: 36px;cursor: pointer;
      }
      .FKINGOUTERWRAP .wk-overlay {
        position: absolute;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(255,255,255,0.6);z-index: 9990;text-align: center;padding-top: 220px;color: #dc3545;display: none;
      }

      @keyframes spinner-border {
        100% { transform: rotate(360deg) };
      }

      .FKINGOUTERWRAP .wk-overlay .icon-loading {
        margin: 0 auto 12px auto; width: 32px; height: 32px; border: solid #dc3545 3px; border-radius: 50%;border-right-color: transparent; animation: spinner-border 0.75s linear infinite;
      }
      .FKINGOUTERWRAP .wk-overlay .txt {
        font-size: 18px; font-weight: bold;
      }
      .FKINGOUTERWRAP .trigger-btn {
        position: absolute;top: 50%;left: -50px;height: 200px;width: 50px;transform: translateY(-100px);background-color: #dc3545;border-top-left-radius: 10px;border-bottom-left-radius: 10px;color: #fff;font-size: 20px;cursor: pointer;text-align: center;padding: 24px 10px;box-sizing: border-box;
      }
      .FKINGOUTERWRAP .trigger-btn svg {
        margin-bottom: 5px;
      }
      .FKINGOUTERWRAP .top-content {
        height: 80px;display: flex;background-color: #fff;background-image: url(https://edu-wenku.bdimg.com/v1/pc/aigc/ai-chat-bg-1683892068238.png);background-repeat: no-repeat;background-size: 100% 100%;
      }
      .FKINGOUTERWRAP .top-content .line-wrap {
        flex: 1; display:flex; flex-direction: column; justify-content: space-between; position: relative; font-size: 12px;
      }
      .FKINGOUTERWRAP .top-content .line {
        position: relative; display: flex; align-items: center; flex: 1; border-bottom: 1px dashed #dee2e6; padding:0 12px 0 6px;
      }
      .FKINGOUTERWRAP .top-content .line .fkwk-tab-wrap {
        display: flex;
      }
      .FKINGOUTERWRAP .top-content .line .fkwk-tab-wrap .fkwk-tab {
        position: relative; top: 2px; width: 80px; height: 36px; line-height: 36px; font-size: 14px; text-align: center; cursor: pointer;
      }
      .FKINGOUTERWRAP .top-content .line .fkwk-tab-wrap .fkwk-tab.fkactive {
        border: solid #0075ff 1px; border-bottom: none; background-color: #fff; border-top-left-radius: 8px;border-top-right-radius: 8px; color: #4e6ef2;
      }
      .FKINGOUTERWRAP .top-content .line:last-child {
        border: none;
      }
      .FKINGOUTERWRAP .top-content .key-input {
        width: 212px; height: 24px; line-height: 24px;border: solid 1px #dee2e6; padding: 0 10px; transition: border-color .15s ease-in-out,box-shadow .15s ease-in-out;
      }
      .FKINGOUTERWRAP .btn {
        height: 26px; line-height: 24px; box-sizing: border-box;padding: 0 6px;font-size: 12px;text-align: center;;color: #fff; cursor: pointer; width: auto; min-width: 100px; letter-spacing: 1px;
      }
      .FKINGOUTERWRAP .btn .btn-icon {
        width: 12px; height: 12px; vertical-align: middle;
      }
      .FKINGOUTERWRAP .top-content .btn.full-text {
        margin-right: 12px; background-color: #0d6efd;border: 1px solid #0d6efd;border-top-right-radius: 4px;border-bottom-right-radius: 4px;
      }
      .FKINGOUTERWRAP .top-content .btn.key-btn {
        background-color: #dc3545; border: 1px solid #dc3545; color: #fff; border-top-left-radius: 4px;border-bottom-left-radius: 4px; font-weight: 600;
      }
      .FKINGOUTERWRAP .top-content .btn.wk-export-btn {
        line-height: 26px; background-color: #ffc107; border: none;border-top-left-radius: 4px;border-bottom-left-radius: 4px; color: #000;
      }
      .FKINGOUTERWRAP .top-content .btn.wk-copy-btn {
        line-height: 26px; background-color: #198754; border: none; color: #fff;border-top-right-radius: 4px;border-bottom-right-radius: 4px;
      }
      .FKINGOUTERWRAP .top-content .qr-box {
        padding: 8px 8px;border-left: dashed 1px #dee2e6;
      }
      .FKINGOUTERWRAP .top-content .qr-name {
        font-size: 18px; margin-bottom: 4px;text-align: center;
      }
      .FKINGOUTERWRAP .top-content .qr-box img {
        width: 64px; height: 64px;
      }
      .FKINGOUTERWRAP .wk-content-wrap {
        position:relative;height: 359px;color:#222;border-bottom-left-radius: 10px;border-top: dashed 1px #dee2e6;
      }
      .FKINGOUTERWRAP .wk-content-wrap .wk-inner-content {
        box-sizing:border-box; height: 100%; overflow: scroll; background-color: #fff; padding: 12px;
      }
      .FKINGOUTERWRAP #fkPanelTwoContent {
        display: none;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap {
        height: 400px; background-color: #fff; display: flex; flex-direction: column;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap .fk2-answer {
        flex: 1; padding: 6px; overflow-y: scroll;
      }
      .fk-panel-two-wrap .fk2-answer .fk-gpt {
        text-align: left; display: flex;
      }
      .fk2-answer .fk-gpt .fk-gpt-avatar {
        flex-basis: 30px;width: 30px;height: 30px; flex-shrink: 0; margin-right: 6px; padding-top: 20px;
      }
      .fk2-answer .fk-gpt .fk-gpt-wrap {
        flex: 1; padding-right: 100px;
      }
      .fk2-answer .fk-gpt .fk-gpt-wrap .fk-time-line {
        color: rgb(180 187 196);font-size: 12px;
      }
      .fk2-answer .fk-gpt .fk-gpt-wrap .fk-gpt-content {
        padding: 8px; background-color: rgb(244 246 248); border-radius: 4px; font-size: 14px;white-space: normal; width: fit-content;
      }
      .fk-panel-two-wrap .fk2-answer .fk-user {
        text-align: right;display: flex; flex-direction: row-reverse;
      }
      .fk2-answer .fk-user .fk-user-avatar {
        flex-basis: 30px;width: 30px;height: 30px; flex-shrink: 0; margin-left: 6px; border-radius: 50%; padding-top: 18px;
      }
      .fk2-answer .fk-user .fk-user-wrap {
        padding-left: 100px; display: flex; flex-direction: column; align-items: end;
      }
      .fk2-answer .fk-user .fk-user-wrap .fk-time-line {
        color: rgb(180 187 196);font-size: 12px;
      }
      .fk2-answer .fk-user .fk-user-wrap .fk-user-content {
        padding: 8px; background-color: #d2f9d1; border-radius: 4px; font-size: 14px; white-space: normal; text-align: left; width: fit-content;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap .fk2-qs {
        position: relative; box-sizing: border-box; height: 100px; padding: 6px;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap .fk2-qs .fk2-qs-area {
        width: 100%; height: 88px; padding: 6px 10px; box-sizing: border-box; border: solid #ccc 1px;border-radius: 5px;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap .fk2-qs .fk2-qs-area:hover {
        border-color: #0075ff;
      }
      .FKINGOUTERWRAP .fk-panel-two-wrap .fk2-qs .fk2-qs-btn {
        position: absolute; right: 12px; bottom: 12px; width: 50px;background-color: #4e6ef2;color: #fff;text-align: center;font-size: 14px;height: 24px;line-height: 24px;border-radius: 4px; cursor: pointer;
      }
    </style>`).appendTo("head");
    var wrap = $(`
      <div id="FKINGOUTERWRAP" class="FKINGOUTERWRAP">
        <div id="wkOverlay" class="wk-overlay">
          <div class="icon-loading"></div>
          <div id="ovMsg" class="txt">正在搜索，预计需要15秒钟...</div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" id="wkIconClose" class="wk-icon-close" viewBox="0 0 1024 1024" height="1em" width="1em">
          <path d="M685.4 354.8c0-4.4-3.6-8-8-8l-66 .3L512 465.6l-99.3-118.4-66.1-.3c-4.4 0-8 3.5-8 8 0 1.9.7 3.7 1.9 5.2l130.1 155L340.5 670a8.32 8.32 0 0 0-1.9 5.2c0 4.4 3.6 8 8 8l66.1-.3L512 564.4l99.3 118.4 66 .3c4.4 0 8-3.5 8-8 0-1.9-.7-3.7-1.9-5.2L553.5 515l130.1-155c1.2-1.4 1.8-3.3 1.8-5.2z"/>
          <path d="M512 65C264.6 65 64 265.6 64 513s200.6 448 448 448 448-200.6 448-448S759.4 65 512 65zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/>
        </svg>

        <div id="triggerBtn" class="trigger-btn">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 1024 1024" height="1em" width="1em">
            <path d="M904 160H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0 624H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8zm0-312H120c-4.4 0-8 3.6-8 8v64c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-64c0-4.4-3.6-8-8-8z" fill="#fff"/>
          </svg>文库助手
        </div>
        <div id="topContent" class="top-content">
          <div id="lineWrap" class="line-wrap">
            <div class="line">
              <input class="key-input" id="wkKeyInput" placeholder="请输入测试码" maxlength="24" type="text" />
              <button id="wkGetCodeBtn" class="btn key-btn">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" class="btn-icon">
              <title></title>
              <g id="icomoon-ignore">
              </g>
              <path d="M352 0c-88.368 0-160 71.632-160 160 0 10.016 0.935 19.808 2.688 29.312l-194.688 194.688v96c0 17.68 14.32 32 32 32h32v-32h64v-64h64v-64h64l41.528-41.528c17 6.159 35.344 9.527 54.472 9.527 88.368 0 160-71.632 160-160s-71.632-160-160-160zM399.937 160.056c-26.505 0-48-21.495-48-48s21.495-48 48-48 48 21.495 48 48-21.488 48-48 48z"></path>
              </svg>
              获取测试码</button>
            </div>
            <div class="line" style="border-bottom: solid #0075ff 1px;">
              <div class="fkwk-tab-wrap">
                <div id="fkpanelOne" class="fkwk-tab fkactive">文章获取</div>
                <div id="fkpanelTwo" class="fkwk-tab">GPT</div>
              </div>
            </div>
          </div>
          <div id="FKQrBox" class="qr-box">
          </div>
        </div>
        <div id="fkPanelOneContent">
          <div class="top-content" style="height: auto;">
            <div class="line-wrap" style="flex-direction: row; height: 40px;">
              <div id="otherBtns" class="line">
              <button id="wkFullTextBtn" class="btn full-text">获取全文文字</button>
              <button id="wkExportBtn" class="btn wk-export-btn">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" class="btn-icon">
                  <title></title>
                  <g id="icomoon-ignore">
                  </g>
                  <path d="M256 288l128-128h-96v-128h-64v128h-96zM372.363 235.636l-35.87 35.871 130.040 48.493-210.533 78.509-210.533-78.509 130.040-48.493-35.871-35.871-139.636 52.364v128l256 96 256-96v-128z"></path>
                </svg>
                导出为WORD
              </button>
              <button id="wkCopyBtn" class="btn wk-copy-btn">一键复制</button>
              （获取全文后才有效）
              </div>
              <div id="FKINGWKMsg" class="line"></div>
            </div>
          </div>
          <div class="wk-content-wrap">
            <div id="FKingInnerContent" class="wk-inner-content"></div>
          </div>
        </div>
        <div id="fkPanelTwoContent">
          <div class="fk-panel-two-wrap">
            <div id="fk2Answer" class="fk2-answer">
              <div class="fk-gpt">
                <img class="fk-gpt-avatar" src="https://i.ibb.co/stZ7KCR/ai-avatar.png" />
                <div class="fk-gpt-wrap">
                  <div class="fk-time-line"></div>
                  <div class="fk-gpt-content"></div>
                </div>
              </div>
              <div class="fk-user">
                <img class="fk-user-avatar" src="https://i.ibb.co/WzLrWRn/user-avatar.png" />
                <div class="fk-user-wrap">
                  <div class="fk-time-line"></div>
                  <div class="fk-user-content"></div>
                </div>
              </div>
            </div>
            <div class="fk2-qs">
              <textarea id="fk2QsArea" class="fk2-qs-area" maxlength="300" placeholder="请输入，最多300字"></textarea>
              <div id="fkSendGPT" class="fk2-qs-btn">发送</div>
            </div>
          </div>
        </div>
      </div>
    `);
    $('html').append(wrap);
  }

})
