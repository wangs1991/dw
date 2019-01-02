export const validators = {
  name: {
    rule: /[\S]{1,20}/,
    empty: '请输入用户名',
    error: '用户名包含不合法字符'
  },
  password: {
    rule: /^[A-Za-z0-9]{6,12}$/,
    empty: '请输入密码',
    error: '密码格式为6-12位英文、数字或组合'
  }
}
