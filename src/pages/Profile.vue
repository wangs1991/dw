<template>
  <div class="page-profile__container">
    <!--头部导航-->
    <BaseHeader/>

    <div class="lyt-block__wraper profile-block__bg profile-info__main">
      <div class="info-avator">
        <div class="info-wraper">
          <div class="info-avator__wp">
            <img src="" alt="">
          </div>
          <h1>{{udata.name}}</h1>
          <h2>番茄号ID： {{udata.id}}</h2>
        </div>
      </div>
      <div class="info-data">
        <div class="info-data__item">
          <label for="">原创绘本</label>
          <div class="info-data__num">
            1000
          </div>
        </div>
        <div class="info-data__item">
          <label for="">获得喜欢</label>
          <div class="info-data__num">
            1000
          </div>
        </div>
        <div class="info-data__item">
          <label for="">我的关注</label>
          <div class="info-data__num">
            1000
          </div>
        </div>
        <div class="info-data__item">
          <label for="">关注我的</label>
          <div class="info-data__num">
            1000
          </div>
        </div>
      </div>
    </div>

    <div class="lyt-block__wraper profile-block__bg profile-info__detail">
      <div class="profile-detail__header">
        <label class="header__tab active">我的信息</label>
      </div>

      <div class="profile-detail__content">
        <div class="profile-detail-wraper">
          <el-form :model="profile" status-icon :rules="profileRules" ref="profile" label-width="90px">
            <el-upload
              class="avatar-uploader"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="profile.avator" :src="profile.avator" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <el-form-item label="番茄号ID" prop="uid">
              <el-input
                v-model="profile.uid"
                :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="name">
              <el-input
                v-model="profile.name"
                maxlength="20"
                :disabled="true"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!--底部-->
    <BaseFooter/>
  </div>
</template>

<script>
  import {getBookList} from '../server/actions'
  import {validators} from '../assets/js/validateRegs'

  import BaseHeader from '../components/BaseHeader.vue'
  import BaseFooter from '../components/BaseFooter.vue'

  export default {
    name: 'Index',
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
      return {
        profile: {
          name: '',
          uid: 1,
          avator: ''
        },
        profileRules: {
          name: [
            { validator: checkName, trigger: 'blur' }
          ]
        }
      }
    },
    computed: {
      udata () {
        return this.$store.state.userData
      },
      uploadUrl () {
        if (window.globalConfig.env !== 'development') {
          return window.globalConfig.host + '/tomato/uploadImg'
        } else {
          return '/tomato/uploadImg'
        }
      }
    },
    watch: {
      udata (n) {
        this.profile.name = n.name
        this.profile.uid = n.id
        this.profile.avator = n.avator
      }
    },
    methods: {
      switchBooks (tab, event) {}
    },
    components: {
      BaseHeader,
      BaseFooter
    },
    mounted () {
      this.$nextTick(() => {
        getBookList().then(data => {
          this.bookList = data
        })
      })
    }
  }
</script>

<style lang="scss">
  @import '../assets/style/common.scss';

  .page-profile__container{
    background: #E6E7EA;
    min-height: 100%;
    .profile-block__bg{
      background: #fff;
    }

    .profile-info__main{
      padding: 35px;
      display: flex;
      .info-avator{
        width: 400px;
        .info-wraper{
          padding-left: 120px;
          .info-avator__wp{
            float: left;
            margin-left: -120px;
            display: block;
            width: 100px;
            height: 100px;
            background: #E6E7EA;
            img{
              display: block;
              max-width: 100%;
            }
          }
          h1,
          h2{
            @include els();
            margin: 0;
            font-weight: normal;
            color: #080808;
          }
          h1{
            font-size: 20px;
            padding-top: 22px;
            margin-bottom: 8px;
          }
          h2{
            font-size: 14px;
          }
        }
      }
      .info-data{
        text-align: center;
        display: table;
        margin-top: 20px;
        .info-data__item{
          display: table-cell;
          width: 120px;
          label{
            font-size: 14px;
            color: #6A6C8A;
            margin-bottom: 8px;
          }
          .info-data__num{
            font-size: 28px;
            color: #080808;
          }
        }
      }
    }

    .profile-info__detail{
      padding: 10px 35px 35px 35px;
      .profile-detail__header{
        height: 50px;
        line-height: 48px;
        border-bottom: 1px solid #bbb;
        .header__tab{
          display: inline-block;
          height: 48px;
          &.active{
            color: #EB5648;
            border-bottom: 3px solid #EB5648;
          }
        }
      }
      .profile-detail__content{
        padding-top: 50px;
        padding-bottom: 50px;
        .profile-detail-wraper{
          width: 450px;
          margin: 0 auto;

          .avatar-uploader .el-upload {
            margin-left: 90px;
            margin-bottom: 20px;
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
          }
          .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
          }
          .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
          }
          .avatar {
            width: 178px;
            height: 178px;
            display: block;
          }

        }
      }
    }
  }
</style>
