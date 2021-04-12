import io from 'socket.io-client'
import store from '../store'
let socket = null

export const socketConnection = () => {
    return socket || (socket = io(
        process.env.VUE_APP_SOCKET_URL,
        {
            transports : ['websocket', 'polling',],
            path : '/im',
            query:{
                'Agent-Authorization' : store.state.userInfo.agent_token,
                'Crm-Authorization' : store.state.userInfo.token
            },
            extraHeaders:{
                'Access-Control-Allow-Credentials' : 'false',
                'Crm-Authorization' : store.state.userInfo.token,
                'Agent-Authorization' : store.state.userInfo.agent_token
            }
        }
    ))
}
