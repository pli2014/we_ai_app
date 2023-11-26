import { View, Text, WebView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'
import React from 'react'
import PropTypes from 'prop-types';

export default class ThirdPage extends React.Component {
  componentWillMount() {
    // 获取路由参数
    const router = Taro.getCurrentInstance().router
    console.log(router.params)
    this.setState({openUrl:router.params['openUrl']})
  }
  onShareAppMessage(res) {
    console.log(res.target)
  }
  handleMessage(e) {
    console.log("webview is error, " + e)
  }
  render() {
  return (
      <View>
         <WebView src={this.state.openUrl} onMessage={this.handleMessage}>
         </WebView>
      </View>
    )
  }
}
