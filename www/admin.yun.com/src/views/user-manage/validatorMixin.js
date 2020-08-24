export default {
    methods: {
        usernameValidator(rule, value, callback) { // eslint-disable-line
            if (/[^a-zA-Z0-9]/.test(value) || value.length < 5) {
                return callback(new Error('账号只能包含字母或数字且不少于5位字符'))
            }
            callback()
        },
        pwdValidator(rule, value, callback) {
            if (value.length < 5) {
                return callback(new Error('密码至少是5位任意字符'))
            }
            callback()
        },
        emailValidator(rule, value, callback) { // eslint-disable-line
            if(!/^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/.test(value)) {
                return callback(new Error('请输入正确的email格式'))
            }
            callback()
        },
        moblieValidator(rule, value, callback) { // eslint-disable-line
            if (!/^1[3456789]\d{9}$/.test(value)) {
                return callback(new Error('请输入正确的手机格式'))
            }
            callback()
        }
    }
}