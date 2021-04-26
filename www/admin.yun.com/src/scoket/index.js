import io from 'socket.io-client'
import store from '../store'
const { agent_token, token } = store.state.users.userInfo
let socket = null

export const socketConnection = () => {
    return socket || (socket = io(
        process.env.VUE_APP_SOCKET_URL,
        {
            transports: ['websocket', 'polling'],
            path: '/websocket',
            query:{
                'Agent-Authorization': agent_token,
                'Cfyf-Authorization': token
            },
            extraHeaders:{
                'Access-Control-Allow-Credentials' : 'false',
                'Cfyf-Authorization': token,
                'Agent-Authorization': agent_token
            }
        }
    ))
}
