<template>
  <div class="dialog-common__gather">
    <div class="dialog-common__cover" @click.stop="close('cover')"> </div>
    <div class="register-panel__main">
      <div class="register-panel__wrap">
        <div class="register-content__logo">
          番茄号
        </div>
        <h2 class="register-content__slogan">注册番茄号，创造更美的世界</h2>
        <div class="register-form__body">
          <el-form :model="register" status-icon :rules="registerRules" ref="register" label-width="90px">
            <el-form-item label="用户名" prop="name">
              <el-input v-model="register.name" maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="pwd1">
              <el-input type="password" v-model="register.pwd1" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="pwd2">
              <el-input type="password" v-model="register.pwd2" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitForm('register')">注册</el-button>
          <p class="register-info">
            注册即代表同意《番茄号用户协议》
          </p>
          <p class="register-login__href">
            已有账号？<a href="javascript:void(0);" @click="close('login')">登录</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {register} from '../../server/actions'
  import {validators} from '../../assets/js/validateRegs'
  export default {
    name: 'registerDialog',
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
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.register.pwd1) {
          callback(new Error('两次输入密码不一致!'))
        } else if (!validators.password.rule.test(value)) {
          callback(new Error(validators.password.error))
        } else {
          callback()
        }
      }
      return {
        register: {
          name: '',
          pwd1: '',
          pwd2: ''
        },
        registerRules: {
          name: [
            { validator: checkName, trigger: 'blur' }
          ],
          pwd1: [
            { validator: validatePass, trigger: 'blur' }
          ],
          pwd2: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            register(this.register).then(data => {
              this.$message({
                message: '注册成功，请登录',
                type: 'success'
              })
              this.$close()
              this.$login()
//              TODO: 优化点 - 登陆成功调到登录弹框自动填充用户名
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
        ;(arg === 'login') && this.$login()
      }
    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  .register-panel__main{
    position: absolute;
    z-index: 310;
    left: 50%;
    top: 50%;
    width: 452px;
    transform: translate(-50%, -50%);
    color: #EB5648;

    background: #fff;
    .register-panel__wrap{
      padding: 25px 40px;
    }

    .register-content__logo{
      font-size: 48px;
      font-weight: bold;
      text-align: center;
      line-height: 1em;
    }
    .register-content__slogan{
      font-size: 20px;
      text-align: center;
      line-height: 1em;
      margin: 22px 0 8px 0;
    }

    .register-form__body{
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

      .register-info{
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
