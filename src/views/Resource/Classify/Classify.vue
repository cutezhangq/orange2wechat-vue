<template>
    <div ref="recommend" style="z-index:100">
        <div class="wrapper" ref="wrapper">
            <div class="content">
                <p class="title">全部分类
                    <span class="classifyNum">(共{{this.classifyLists.length}}个)</span>
                </p>
                <div class="recommend-list" ref="recommendList">
                    <ul v-if="classifyLists.length" class="classifyListsUl">
                        <li class="item" v-for="(classifyList,index) in classifyLists" :key="index"
                            @click="skipClassifyDetail(index)">
                            <div class="icon">
                                <div class="gradients">
                                    <p class="textClass">
                                        {{classifyList.title}}
                                    </p>
                                </div>
                                <img class="imgicon" :src="classifyList.iconUrl">
                            </div>
                            <div class="text"><p class="name"></p></div>
                        </li>
                    </ul>
                    <ul v-else>
                        <li v-for="item in 4" :key="item">
                            <img class="lodingClass" src="@/common/image/lodingClass2.svg">
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {axiosJWT} from "@/common/js/request"
    import BScroll from 'better-scroll'

    export default {
        data() {
            return {
                classifyLists: [],
                categoryId: 1,
            }
        },
        methods: {
            //分类  请求
            getClassfyCategory() {
                return axiosJWT({
                    url: "/category/icons",
                    method: 'get',
                    params: {
                        themeId: 0
                    }
                }).then(res => {
                    if (res.code === 200) {
                        this.$nextTick(() => {
                            this.classifyLists = res.data
                        })
                    }
                })
            },
            //分类专辑（详情）  请求
            skipClassifyDetail(i) {
                this.categoryId = i + 1
                this.categoryTitle = this.classifyLists[i].title
                this.saveCurCategoryDetails()
                //跳转分类详情页面
                this.$router.push({
                    name: 'classifyDetails',
                    params: {_categoryId: this.categoryId, _classifyTitle: this.classifyLists[i].title}
                })
            },
            //将分类id存入vuex中
            saveCurCategoryDetails() {
                this.$store.dispatch("curCategoryId", this.categoryId)
                this.$store.dispatch("curCategoryTitle", this.categoryTitle)
            }
        },
        created() {
            this.getClassfyCategory()
            //初 始 化 滚 动
            //this._initScroll()
        },
        activated(){
          // this.getClassfyCategory()
          //console.log('执行了activated...')
        },
        mounted() {
            this.$nextTick(() => {
                //$refs绑定元素
                if (!this.scroll) {
                    this.scroll = new BScroll(this.$refs.wrapper, {
                        //开启点击事件 默认为false
                        click: true,
                    })
                } else if (!this.$refs.wrapper) {
                    return
                } else {
                    this.scroll.refresh()
                }
            })
        }

    }
</script>

<style lang='less' scoped>
    @import url('~@/assets/css/common.less');

    .title {
        font-weight: bold;
        margin-top: 10px;
        font-size: 20px;
        margin-left: 1%;

        .classifyNum {
            font-size: 14px;
            color: #312e2e;
            font-weight: bold;
        }
    }

    .recommend-list {
        display: grid;
        align-items: center;
        justify-content: center;
        grid-template-columns: 360px;
        grid-template-rows: auto;
        grid-gap: 2px;
        position: relative;
        margin-top: 18px;

        .title {
            height: 65px;
            line-height: 65px;
            padding-left: 1.5%;
            text-align: left;
            font-size: 19px;
            font-weight: bold;
            color: #2E3030;
        }

        .item {
            position: relative;
            box-sizing: border-box;
            width: 50%;
            float: left;
            transform: scale(0.79);
            margin-bottom: -11%;
            margin-top: -4%;

            .icon {
                position: relative;
                display: inline-block;
                width: 100%;
                height: 0;
                padding-top: 100%;
                margin-bottom: 9px;
                overflow: hidden;
                border-radius: 8px;

                .gradients {
                    //background: linear-gradient(to right, #f7f9fa, #fcfcfcad);
                    background: rgba(255, 252, 252, 0.75);
                    position: absolute;
                    top: -19px;
                    left: -12px;
                    //width: 62%;
                    height: 59px;
                    border-radius: 16px;
                    z-index: 1;
                    overflow: hidden;

                    .textClass {
                        font-size: 27px;
                        color: #343434;
                        margin-top: 25px;
                        margin-left: 23px;
                        letter-spacing: 10px;
                    }
                }

                .imgicon {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    border-radius: 8px;
                    //box-shadow: 10px 11px 12px -13px;
                }

                .imgshadow {
                    position: absolute;
                    top: 0;
                    height: 100%;
                    width: 100%;
                    border-radius: 10px;
                    box-shadow: #ADADAD 0px 15px 5px 2px inset;
                    -webkit-box-shadow: #ADADAD 0px 15px 5px 2px inset;
                    opacity: 0.3;
                }
            }

            .text {
                height: 45px;
                // line-height: 22px;
                // height: 34px;
                // overflow: hidden;
                // margin: 0px 8px 9px 8px;
                // font-size: 20px;
                // color: #383737;
                // word-break: break-word;
                // text-align: center;
                // vertical-align: middle;
                .on {
                    letter-spacing: 14px;
                }
            }

            p { //使文字多出2行的用...表示
                overflow: hidden; /** 隐藏超出的内容 **/
                word-break: break-all;
                text-overflow: ellipsis; /** 多行 **/
                display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
                -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
                -webkit-line-clamp: 2; /** 显示的行数 **/
                //margin-bottom: .3rem;
            }
        }
    }

    .swiper {
        height: 100%;
    }

    .lodingClass {
        margin: 2% 0;
    }

    .classifyListsUl {
        margin: -13px -25px -15px -25px;
    }

    @media screen and  (max-width: 370px) {
        .recommend-list {
            grid-template-columns: 307px;
        }
    }
</style>

