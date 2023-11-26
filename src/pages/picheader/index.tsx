import './index.scss'
import { View, Text, Image } from '@tarojs/components'
import girlHeader from './girl_header.png'
import { AtButton } from 'taro-ui'
import React from 'react'
import Taro from '@tarojs/taro'
import { resolve } from 'path'
import { rejects } from 'assert/strict'
import { TaroHooks } from '@tarojs/shared'
import CustomSocket from '../../CustomSocket'
import requestData from './data.json'



/**
* 本地图片转Base64
* @param param.path 文件路径
* @returns Base64图片字符串
*/
async function imgToBase64(url) {
  let res = "";
  // 图片链接必填
  if (!url) {
    return res;
  }
  try {
    // 获取图片信息(本地图片链接)
    const successCallback = await Taro.getImageInfo({
      src: url
    });
    const { path, type } = successCallback;
    if (!path) {
      return res;
    }
    // 本地图片转Base64
    const base64 = Taro.getFileSystemManager().readFileSync(path, "base64");
    res = 'data:image/png;base64,' + base64;
  } catch (error) {
    console.warn("=> utilssearch.ts error imgToBase64", error);
    throw error;
  } finally {
    return res;
  }
}

class PicHeader extends React.Component {
  state = {
    localPic: '',
    stateMsg: ''
  }
  onClick = (e) => {
    console.log("更换1一寸证件照")
    var _this = this;
    Taro.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        if (res.tempFilePaths != null && res.tempFilePaths.length >= 1) {
          console.log("本地照片：" + res.tempFilePaths[0])
          _this.setState({ localPic: res.tempFilePaths[0] })
        }
      }
    })
  }

  /**
   * 演示空间：https://swanhub.co/tech_ai_2023/HivisionIDPhotos/demo
   * https://tech-ai-2023-hivisionidphotos.demo.swanhub.co/ demo服务器
   * 每张照片请求处理，需要先和服务器建立连接，然后处理N个消息，最终服务端关闭socket
   * @param e 
   */
  generatePic = (e) => {
    console.log("调用算法模型，生成更换1一寸证件照")
    var _this = this;
    _this.setState({ stateMsg: "正在处理之中..." })
    const requestSocket = new CustomSocket("wss://tech-ai-2023-hivisionidphotos.demo.swanhub.co/queue/join",{
      'Cookie':'_gid=GA1.2.1350922936.1700894109; _gat_gtag_UA_156449732_1=1; _ga_R1FN4KJKJH=GS1.1.1700899333.4.1.1700899749.0.0.0; _ga=GA1.1.349014903.1700747371; _ga_XPT3RCV5KD=GS1.1.1700899355.5.0.1700899760.0.0.0',
              'content-type':'application/json',
              'Connection':'Upgrade'
    })
    requestSocket.onSocketMessage(msg => {
      switch (msg.msg) {
        case 'send_hash':
          console.log(msg)
          requestSocket.sendSocketMessage('{"fn_index":3,"session_hash":"8n1yo22thes"}')
          break;
        case 'send_data':
          imgToBase64(_this.state.localPic).then(base64Data=>{
             //requestSocket.sendSocketMessage(JSON.stringify(requestData))
              requestSocket.sendSocketMessage(JSON.stringify({"data":[base64Data,"尺寸列表","一寸","蓝色","纯色",0,0,0,413,295],"event_data":null,"fn_index":2,"session_hash":"8n1yo22thes"}))
          })
          break;
        case 'estimation':
          console.log(msg)
          break;
        case 'process_starts':
          console.log(msg)
          break;
        case 'process_completed':
          var result = msg.output.data[0]
          if( typeof(result)=='string'){
            _this.setState({localPic:result,stateMsg:"处理成功！"})
          }else{
            _this.setState({stateMsg:"处理失败:"+ msg.output.data[3].value})
          }
          break;
        default:
          console.error("no handle for this msg type!!!")
          _this.setState({stateMsg:"处理失败:"+ JSON.stringify(msg).substr(0,30)})
          break;
      }
    })
  }

  render() {
    return (
      <View className='picheader'>
        <View>
          <Text>欢迎使用证件照处理服务！</Text>
          <Image className='image' src={this.state.localPic} />
        </View>
        <AtButton type="primary" className='my-button' onClick={this.onClick}>选择本地相册个人头像照片</AtButton>
        <AtButton type="primary" className='my-button' onClick={this.generatePic}>开始生成1寸证件照</AtButton>
        <View>{this.state.stateMsg}</View>
      </View>
    )
  }
}
export default PicHeader