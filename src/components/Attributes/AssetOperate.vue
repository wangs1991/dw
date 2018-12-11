<template>
  <div class="operate-panel__main">
    <div class="operate-item__wraper"
         @click="assetOpreteLevel(1)">
      置顶
    </div>
    <div class="operate-item__wraper"
         @click="assetOpreteLevel(-1)">
      置底
    </div>
    <div class="operate-item__wraper"
         :class="{'disabled': !isCopyable}"
         @click="assetOpreteCopy">
      复制
    </div>
    <div class="operate-item__wraper c-danger"
         @click="assetOpreteDelete">
      删除
    </div>
  </div>
</template>
<script>
import Bus from '../Bus'
export default{
  data () {
    return {}
  },
  props: {
    id: {
      type: String
    }
  },
  computed: {
    isCopyable () {
      return !!this.id
    }
  },
  methods: {
    assetOpreteDelete () {
      Bus.$emit('assetOprateDelete')
    },
    assetOpreteCopy () {
      Bus.$emit('assetOprateCopy')
    },
    assetOpreteLevel (step) {
      Bus.$emit('assetOprateLevel', step)
    }
  }
}
</script>
