<template>
  <div class="dialog-common__cover">
    <div class="dialog-common__cover" @click.stop="close('cover')"> </div>
    <div class="login-panel__main">
      <div class="login-panel__wrap">
        <div class="login-content__logo">
          番茄号
        </div>
        <h2 class="login-content__slogan">登录番茄号，创造更美的世界</h2>
        <div class="login-form__body">
          <el-form :model="login" status-icon :rules="loginRules" ref="login" label-width="90px">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="login.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd1">
              <el-input type="password" v-model="login.pwd1" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitForm('login')">登录</el-button>
          <p class="login-info">
            二维码登录  .  社交账户登录  .  海外手机登录
          </p>
          <p class="register-login__href">
            没有账号？现在<a href="javascript:void(0);" @click="close('register')">注册</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {login} from '../../server/actions'
  import {validators} from '../../assets/js/validateRegs'
  export default {
    name: 'loginDialog',
    data () {
      var checkName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(validators.name.empty))
        } else {
          if (!validators.name.rule.test(value)) {
            callback(new Error(validators.name.error))
            return false
          }
          callback()
        }
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(validators.password.empty))
        } else {
          if (!validators.password.rule.test(value)) {
            callback(new Error(validators.password.error))
            return false
          }
          callback()
        }
      }
      return {
        login: {
          name: '',
          pwd1: ''
        },
        loginRules: {
          name: [
            { validator: checkName, trigger: 'blur' }
          ],
          pwd1: [
            { validator: validatePass, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            login(this.login).then(data => {
              console.log(data)
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              this.$close()
//              缓存用户的信息
              this.$store.commit('cacheUser', data)
            }, res => { }).catch(e => {
              console.log(e)
            })
          } else {
            return false
          }
        })
      },
      close (arg) {
        this.$close(arg)
        ;(arg === 'register') && this.$register()
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  .login-panel__main{
    position: absolute;
    z-index: 310;
    left: 50%;
    top: 50%;
    width: 452px;
    transform: translate(-50%, -50%);
    color: #EB5648;

    background: #fff;
    .login-panel__wrap{
      padding: 25px 40px;
    }

    .login-content__logo{
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      line-height: 1em;
    }
    .login-content__slogan{
      font-size: 20px;
      text-align: center;
      line-height: 1em;
      margin: 22px 0 8px 0;
    }

    .login-form__body{
      margin-top: 20px;
      .el-form-item{
        border-bottom: 1px solid #BBBBBB;
        margin-bottom: 24px;
        &.is-error{
          border-color: #EB5648;
        }
        .el-form-item__label{
          text-align: left;
          padding-left: 10px;
        }
      }
      input {
        border: 0;
      }
      .el-button{
        margin-top: 45px;
        width: 100%;
        background: #EB5648;
        border: 0;
        font-size: 18px;
      }

      .login-info{
        font-size: 16px;
        text-align: center;
        color: #76778A;
        margin-top: 15px;
        margin-bottom: 55px;
      }

      .register-login__href{
        text-align: center;
        font-size: 16px;
        color: #080808;
        a{
          color: #EB5648;
        }
      }
    }
  }
</style>
