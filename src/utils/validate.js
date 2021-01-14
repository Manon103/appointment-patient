/**
 * Created by cdd on 18/11/02.
 */

export function isvalidUsername(str) {
    const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)^[a-zA-Z0-9]\w+$/;
    if(!str){
        return '请输入账号名';
    } else if(!reg.test(str)){
        return '用户名需由字母、数字、下划线组成，并至少包含其中两种，且不以下划线开头';
    } else if(str.length > 20){
        return '用户名最大长度不得超过20个字符';
    } else {
        return '';
    }
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}
/**
 * 判断是否为空
 */
export function validatenull(val) {
    if (typeof val === 'boolean') {
        return false
    }
    if (val instanceof Array) {
        if (val.length === 0) return true
    } else if (val instanceof Object) {
        if (JSON.stringify(val) === '{}') return true
    } else {
        if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
        return false
    }
    return false
}

/**
 * 判断手机号码是否正确
 */
export function isvalidatemobile(phone) {
    const list = []
    let result = true
    let msg = ''
    var isPhone = /^1[3456789]\d{9}$/
    // 增加134 减少|1349[0-9]{7}，增加181,增加145，增加17[678]
    // const isMob = /^((\+?86)|(\(\+86\)))?(13[0123456789][0-9]{8}|15[012356789][0-9]{8}|18[012356789][0-9]{8}|14[57][0-9]{8}|17[3678][0-9]{8})$/
    if (!validatenull(phone)) {
        if (phone.length === 11) {
            if (!isPhone.test(phone)) {
                msg = '手机号码格式不正确'
            } else {
                result = false
            }
        } else {
            msg = '手机号码长度不为11位'
        }
    } else {
        msg = '手机号码不能为空'
    }
    list.push(result)
    list.push(msg)
    return list
}

export function validateEmail(email){
    const rxg = /^([a-zA-Z\d])(\w|\-)+@[a-zA-Z\d]+\.[a-zA-Z]{2,4}$/;
    return rxg.test(email);
}

export function validatePassword(password){
    const pwdRegex = new RegExp('(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).{8,30}');
    return pwdRegex.test(password);
}

export function validateRechargeNum(number){
    if(parseFloat(number) === 0){
        return false;
    }
    const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
    return reg.test(number);
}
