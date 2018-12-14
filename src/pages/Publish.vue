<template>
  <el-dialog
    class="dialog-style-publish"
    :title="dialogTitle"
    :top="'6vh'"
    :visible.sync="isPublish"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    width="820px"
    center>
    {{bookForm.dataPath}}
    <el-form :model="bookForm" :rules="rules" ref="bookForm" label-width="100px">
      <el-form-item label="封面" prop="cover">
        <el-upload
          class="avatar-uploader"
          action="/tomato/uploadImg"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload">
          <img v-if="bookForm.cover" :src="bookForm.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="绘本书名" prop="name">
        <el-input v-model="bookForm.name"></el-input>
      </el-form-item>
      <el-form-item label="简介信息" prop="describeInfo">
        <el-input type="textarea" v-model="bookForm.describeInfo"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('bookForm')">立即创建</el-button>
        <!--<el-button @click="resetForm('bookForm')">重置</el-button>-->
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import {publishBook} from '../server/actions'
  export default {
    name: 'Publish',
    data () {
      return {
        dialogTitle: '发布设置',
        bookForm: {
          cover: 'asdfasdfasdf.jpg', // 绘本封面路径
          name: '', // 绘本名字
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
    props: {
      isPublish: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      baseConfig () {
        return this.$store.state.Editor.bookBaseConfig
      }
    },
    watch: {
      baseConfig: {
        deep: true,
        handler (n) {
          this.bookForm.dataPath = n.dataPath
          this.bookForm.custom = n.style
        }
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
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            publishBook(this.bookForm).then(data => {
              console.log(data)
            })
          } else {
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss">
  .dialog-style-publish{
    width: 100%;
    background: rgba(255, 255, 255, 1);
    .el-dialog--center{
      background: transparent;
      box-shadow: none;
    }
  }
  .avatar-uploader .el-upload {
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
</style>
