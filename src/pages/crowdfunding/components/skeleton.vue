<template>
  <div class="skeleton">
      <div class="skeleton-item" :style="'height:' + height + 'px'"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  props: {
    height: 0
  },
  created () {
  },
  mounted () {
  },
  methods: {
  }
};
</script>
<style lang="less">
.skeleton {
    width: 100%;
    .skeleton-item {
        margin-bottom: 10px;
        .animate-type()
    }
}
@-webkit-keyframes skeleton-blink {
    0% {
        background-position: 100% 50%
    }
    to {
        background-position: 0 50%
    }
}
 
@keyframes skeleton-blink {
    0% {
        background-position: 100% 50%
    } to {
        background-position: 0 50%
    }
};
@skeleton-animation: skeleton-blink 1s ease-in-out infinite;
.animate-type {
    animation: skeleton-blink 1.2s ease infinite;
    -webkit-animation: skeleton-blink 1.2s ease infinite;
    background-image: -webkit-gradient(linear, left top, right top, color-stop(25%, #f9f9f9), color-stop(37%, #f6f6f6), color-stop(63%, #f9f9f9));
    background-image: -o-linear-gradient(left, #f9f9f9 25%, #f6f6f6 37%, #f9f9f9 63%);
    background-image: linear-gradient(90deg, #f9f9f9 25%, #f6f6f6 37%, #f9f9f9 63%);
    background-size: 400% 100%
}
</style>
