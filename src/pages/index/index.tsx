import { Text, View } from '@tarojs/components'
import React from 'react'
import Taro from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.scss'

class Index extends React.Component {
  state = {
    title1: '',
    models: [
      { title: '大模型证件照高级版', model: 'hivisionidphotos' },
      { title: '大模型人像分割高级版', model: 'person-modnet' }
    ]
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

  jumpThirdPage = (model, event) => {
    console.log("jump to /pages/thirdpage/index,model=" + model)
    Taro.navigateTo({
      url: `/pages/thirdpage/index?openUrl=https://tech-ai-2023-${model}.demo.swanhub.co/`,
    })
  }

  render() {
    var buttons = [];
    this.state.models.forEach(element => {
      buttons.push(<AtButton type="primary" className='my-button' onClick={this.jumpThirdPage.bind(this, element.model)}>{element.title}</AtButton>);
   })
    return (
      <View>
        <AtButton type="primary" className='my-button' onClick={this.onClick}>证件照简洁版（推荐）</AtButton>
        {buttons}
      </View>
    )
  }
}

export default Index