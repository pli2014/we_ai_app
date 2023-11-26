import Taro from '@tarojs/taro'

class CustomSocket {
    public socketOpen: boolean = false
    public socketMsgQueue: string[] = []
    private lockReConnect: boolean = false
    private timer: any = null
    private limit: number = 0
    private url:string = ''
    private header:object = {}
    constructor(url:string, header:object) {
        console.log('init CustomSocket1')
        const _this = this;
        _this.url = url;
        Object.keys(header).forEach((k) => {
          _this.header[k] = header[k];
        });
        _this.connectSocket();
        console.log('init CustomSocket2');
    }
    connectSocket() {
        const _this = this
        Taro.connectSocket({
            url: _this.url,
            header:_this.header,
            success: (response: any) => {
                console.log('connectSocket success:', response)
                _this.initSocketEvent()
            },
            fail: (e: any) => {
                console.log('connectSocket fail:', e)
            }
        })
    }

    initSocketEvent() {
        const _this = this
        Taro.onSocketOpen(() => {
            console.log('onSocketOpen')
            _this.socketOpen = true
            for (const item of _this.socketMsgQueue) {
                _this.sendSocketMessage(item)
            }
            _this.socketMsgQueue = []
        })
        Taro.onSocketError((e: any) => {
            console.log("WebSocket error", e)
        })
        Taro.onSocketClose(() => {
            console.log('WebSocket close！')
            _this.reconnectSocket()
        })
    }

    reconnectSocket() {
        const _this = this
        if (_this.lockReConnect) {
            return
        }
        _this.lockReConnect = true
        clearTimeout(_this.timer)
        if (_this.limit < 0) {
            _this.timer = setTimeout(() => {
                _this.connectSocket()
                _this.lockReConnect = false
            }, 5000)
            _this.limit = _this.limit + 1
        }
    }

    public sendSocketMessage(messgage: string, errorCallback: (any) => void = () => { }) {
        const _this = this
        if (_this.socketOpen) {
            Taro.sendSocketMessage({
                data: messgage,
                success: () => {
                    console.log('sendSocketMessage succ')
                },
                fail: (e: any) => {
                    console.log('sendSocketMessage fail', e)
                    errorCallback && errorCallback(true)
                }
            })
        } else {
            _this.socketMsgQueue = []
        }
    }

    public onSocketMessage(callback: (string) => void) {
        Taro.onSocketMessage((response: any) => {
            const message: any = JSON.parse(response.data)
            console.log('onSocketMessage:', message)
            callback(message)
        })
    }

    public closeSocket() {
        if (this.socketOpen) {
            Taro.closeSocket()
        }
    }

}

export default CustomSocket