import { Text,View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.scss'

class Index extends React.Component {
  state = {
    title1: '证件照简洁版（推荐）',
    title2:'大模型证件照高级版'
  }

  onReady() {
    console.log('onReady')
  }

  onClick = (e) => {
    console.log("jump to /pages/picheader/index")
    Taro.navigateTo({
      url: '/pages/picheader/index',
    })    
  }

  jumpThirdPage=()=>{
    console.log("jump to /pages/thirdpage/index")
    Taro.navigateTo({
      url: '/pages/thirdpage/index?openUrl=https://tech-ai-2023-hivisionidphotos.demo.swanhub.co/',
    }) 
  }

  render() {
    return (
    <View>
      <AtButton type="primary" className='my-button' onClick={this.onClick}>{this.state.title1}</AtButton>
      <AtButton type="primary" className='my-button' onClick={this.jumpThirdPage}>{this.state.title2}</AtButton>
    </View>
    )
  }
}

export default Index