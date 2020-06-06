<template>
  <canvas class="gradient-wrap" ref="bg">
    <img
      src="https://i.loli.net/2019/12/01/6YjPnpFw8CMOXsh.jpg"
      width="100"
      height="100"
      ref="img"
      id="img"
    />
    <!-- <img src="@/common/image/1.png" width="100" height="100" cross-origin="anonymous"/> -->
  </canvas>
</template>

<style lang="less" scoped>
.gradient-wrap {
  width: 200px;
  height: 300px;
}
</style>

<script>
// import Grade from "grade-js";
export default {
  mounted(){
    // Grade(document.querySelectorAll(".gradient-wrap"));
    this.getColor();
  },
  methods: {
        getColor() {
      const canvas =this.$refs.bg
      const image = document.querySelector("#img");
      this._setWheelBgtcMainTonal(canvas,img)
      
    },
          _setWheelBgtcMainTonal(canvas, img){
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext("2d");

        context.drawImage(img, 0, 0);

        // 获取像素数据
        let data = context.getImageData(0, 0, img.width, img.height).data;
        console.log(data);
        let r = 0,
          g = 0,
          b = 0;
        // 取所有像素的平均值
        for (let row = 0; row < img.height; row++) {
          for (let col = 0; col < img.width; col++) {
            r += data[(img.width * row + col) * 4];
            g += data[(img.width * row + col) * 4 + 1];
            b += data[(img.width * row + col) * 4 + 2];
          }
        }
        // 求取平均值
        r /= img.width * img.height;
        g /= img.width * img.height;
        b /= img.width * img.height;

        // 将最终的值取整
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

        //rgb转16进制 位运算
        const color = ((r << 16) | (g << 8) | b).toString(16);
        return color;
      }
  }
};
// window.onscroll = function() {
//   let scrollHeight = Math.max(
//     document.documentElement.scrollHeight,
//     document.body.scrollHeight
//   );
//   let scrollTop =
//     window.pageYOffset ||
//     document.documentElement.scrollTop ||
//     document.body.scrollTop;
//   let clientHeight =
//     window.innerHeight ||
//     Math.min(document.documentElement.clientHeight, document.body.clientHeight);
//   // if (clientHeight + scrollTop >= scrollHeight) {
//   //   console.log("===加载更多内容……===");
//   // }
//   console.log(scrollHeight, scrollTop, clientHeight);
// };
</script>