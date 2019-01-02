<template>
  <el-form :model="bookForm"
           :rules="rules"
           :class="'publish-form'"
           ref="bookForm"
           label-width="100px">
    <div class="panel-lyt-clear">
      <div class="panel-lyt__left">
        <el-form-item label="绘本书名" prop="name">
          <el-input v-model="bookForm.name"></el-input>
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input type="input" v-model="bookForm.author"></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="describeInfo">
          <el-input type="input" v-model="bookForm.describeInfo"></el-input>
        </el-form-item>
      </div>
      <div class="panel-lyt__right">
        <el-upload
          class="avatar-uploader"
          :action="uploadUrl"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="bookForm.cover" :src="bookForm.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
    </div>
    <div class="publish-tips">绘本分享后，您可以通过私有链接发送给朋友们。</div>
    <div class="publish-block">
      <el-button type="primary" :class="'btn-pusblish'" @click="submitForm('bookForm')">立即创建</el-button>
    </div>
  </el-form>
</template>

<script>
  import {publishBook} from '../server/actions'
  export default {
    name: 'Publish',
    data () {
      return {
        bookForm: {
          cover: '', // 绘本封面路径
          name: '', // 绘本名字
          author: '',
          dataPath: '', // 数据配置文件的连接地址
          describeInfo: '', // 描述信息
          custom: '', // 自定义的风格
          sysType: 'BOOK', // 数据类型的定义
          userId: ''
        },
        rules: {
          cover: [
            {required: true, message: '请上传封面图', trigger: 'change'}
          ],
          name: [
            {required: true, message: '请输入绘本书名', trigger: 'change'}
          ],
          describeInfo: [
            {required: true, message: '请输入简介信息', trigger: 'blur'}
          ]
        }
      }
    },
    computed: {
      uploadUrl () {
        if (window.globalConfig.env !== 'development') {
          return window.globalConfig.host + '/tomato/uploadImg'
        } else {
          return '/tomato/uploadImg'
        }
      },
      bookBaseConfig () {
        return this.$store.state.Editor.bookBaseConfig
      }
    },
    methods: {
      handleAvatarSuccess (res, file) {
        this.bookForm.cover = res.data
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          alert('封面图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          alert('封面图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            publishBook(this.bookForm).then(data => {
              this.$store.commit('tooglePublish', false)
              this.resetForm('bookForm')
              this.$router.push({
                name: 'BookList'
              })
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.bookForm.dataPath = this.bookBaseConfig.dataPath
        this.bookForm.custom = this.bookBaseConfig.style
      })
    }
  }
</script>

<style lang="scss">
  @import "../assets/style/common";

  .publish-form{
    .panel-lyt-clear{
      @include clear();
    }
    .panel-lyt__left,
    .panel-lyt__right{
      float: left;
    }
    .panel-lyt__left{
      width: 260px;
      padding-right: 40px;
    }
    .panel-lyt__right{
      width: 210px;
    }
    .publish-tips{
      text-align: center;
      font-size: 14px;
      color: #8A8B93;
      margin-top: 20px;
      margin-bottom: 30px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .el-form-item{
      margin-bottom: 15px;
      .el-form-item__label{
        float: none;
        font-size: 14px;
        color: #101010;
        line-height: 18px;
      }
      .el-form-item__content{
        margin-left: 0!important;
        input{
          border: 0;
          border-radius: 0;
          border-bottom: 1px solid #BBBBBB;
          font-size: 16px;
          padding-left: 5px;
          padding-right: 5px;
        }
      }
    }
    .publish-block{
      text-align: center;
      .btn-pusblish{
        width: 186px;
        height: 50px;
        border-radius: 4px;
        background: #F2575C;
        border: 0;
        font-size: 20px;
      }
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 210px;
      height: 138px;
      line-height: 138px;
      text-align: center;
    }
    .avatar {
      width: 210px;
      height: 138px;
      display: block;
    }
  }
</style>
