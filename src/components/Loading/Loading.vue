<template>
  <div class="vue-loaing"></div>
</template>

<script>
export default {
    name : 'Loading'
}
</script>

<style lang='less' scoped>
.vue-loaing {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 80px;
  height: 80px;
  transform: translate3d(-50%, -50% , 0) rotate(165deg);
  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 18px;
    transform: translate(-50%, -50%);
  }
  &::before {
    animation: before 2s infinite;
  }
  &::after {
    animation: after 2s infinite;
  }
}

@keyframes before {
  0% {
    width: 6px;
    box-shadow: 12px -6px rgba(225, 20, 98, 0.75),
      -12px 6px rgba(111, 202, 220, 0.75);
  }
  35% {
    width: 30px;
    box-shadow: 0 -6px rgba(225, 20, 98, 0.75),
      0 6px rgba(111, 202, 220, 0.75);
  }
  70% {
    width: 6px;
    box-shadow: -12px -6px rgba(225, 20, 98, 0.75),
      12px 6px rgba(111, 202, 220, 0.75);
  }
  100% {
    box-shadow: 12px -6px rgba(225, 20, 98, 0.75),
      -12px 6px rgba(111, 202, 220, 0.75);
  }
}

@keyframes after {
  0% {
    height: 6px;
    box-shadow: 6px 12px rgba(61, 184, 143, 0.75),
      -6px -12px rgba(233, 169, 32, 0.75);
  }
  35% {
    height: 30px;
    box-shadow: 6px 0 rgba(61, 184, 143, 0.75),
      -6px 0 rgba(233, 169, 32, 0.75);
  }
  70% {
    height: 6px;
    box-shadow: 6px -12px rgba(61, 184, 143, 0.75),
      -6px 12px rgba(233, 169, 32, 0.75);
  }
  100% {
    box-shadow: 6px 12px rgba(61, 184, 143, 0.75),
      -6px -12px rgba(233, 169, 32, 0.75);
  }
}
</style>