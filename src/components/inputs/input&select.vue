<template>
  <div class="input-select-elem">
    <input type="text" v-model="result" @input="getValue" :readonly="readonly"/>
    <em class="d-toggle" @click="toggleSelect"></em>
    <ul class="float-to-select" v-show="isShow">
      <li :key="item.value"
          :value="item.value"
          @click="selectValue(item)"
          v-for="item in list">{{item.label}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'inputSelect',
  data () {
    return {
      isShow: false,
      result: 12
    }
  },
  props: {
    list: {
      type: Array,
      required: true
    },
    value: {
      require: true
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    result (n, o) {
      if ((parseFloat(n, 10) + '' !== n) && n !== '') {
        this.result = parseFloat(n, 10)
      }
    },
    value: {
      deep: true,
      handler (n) {
        this.result = parseFloat(n.value, 10)
      }
    }
  },
  methods: {
    getValue () {
      this.$emit('change', this.result)
    },
    selectValue (item) {
      this.isShow = false
      this.result = item.value
      this.getValue()
    },
    toggleSelect () {
      this.isShow = !this.isShow
    }
  }
}
</script>

<style>
  .input-select-elem{
    position: relative;
    z-index: 100;
    border: 1px solid rgba(60,60,60,.26);
    border-radius: 3px;
    font-size: inherit;
    padding: 0 10px;
  }
  .input-select-elem em.d-toggle{
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 2em;
    text-align: center;
    line-height: 45px;
    cursor: pointer;
  }
  .input-select-elem em.d-toggle:after{
    content: '';
    display: inline-block;
    border: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, .3);
  }
  .input-select-elem input{
    display: block;
    width: 100%;
    border: 0;
    outline: 0;
    height: 35px;
  }
  .input-select-elem .float-to-select{
    position: absolute;
    top: 103%;
    left: 0;
    right: 0;
    background: #fff;
    max-height: 150px;
    overflow: auto;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .3);
    border-radius: 0 0 5px 5px;
  }
  .input-select-elem .float-to-select li {
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
    border-bottom: 1px solid #ddd;
  }
  .input-select-elem .float-to-select li:hover{
    background: #efefef;
  }
</style>
