<template>
  <div class="about-detail">
        <div class="header">
            <i class="iconfont tc-back01" @click="back"></i>
            <h1 class="title">{{this.$route.params.tip}}</h1>
        </div>
    <div v-if="this.$route.params.tip==='版权说明'" class="copyright">
      <li v-for="(item,index) in copyrightItem" :key="index">
        <div class="labelImfo">
          <h1 class="title">{{item.text}}</h1>
          <div v-if="Array.isArray(item.value)">
            <li v-for="content in item.value" :key="content">
              <div>{{content}}</div>
            </li>
          </div>
          <div v-else>{{item.value}}</div>
        </div>
      </li>
    </div>
    <div v-if="this.$route.params.tip ==='联系我们'" class="connection">
        <div class="connectionOne">
            <div class="connectTip">
                <i class="iconfont tc-icon-test2"></i>
                <h1>微信在线客服</h1>
            </div>
            <div class="description">
                微信公众号提供在线客服功能。
                您可以在微信公众号中直接编辑、发送文字问题，官方微信客服将为您解答各种疑问。
                客服会集中时间处理问题，所以答复会有延迟。请耐心等待，不要着急。
            </div>
            <img src="@/common/image/wei.jpg" width="60%"/>
        </div>
        <div class="connectionTwo">
            <div class="connectTip">
                <i class="iconfont tc-icon-test3"></i>
                <h1>使用QQ客服群</h1>
            </div>
            <div class="description">添加QQ服务群号，在QQ群中您可以得到服务人员的帮助。</div>
            <img src="@/common/image/qq.png" width="60%"/>
        </div>
    </div>
    <div v-else class="privateTip">
        南京橙子信息科技有限公司（以下简称橙子公司）承诺尊重您的隐私和您的个人信息安全。
        橙子公司所使用的后台算法会自动处理您的点播信息，用以改善产品品质和服务水平，橙子公司的服务器和算法不会将信息透露给其他用户。橙子公司会尽力保护您的信息，包括设备绑定信息、点播记录等。橙子公司不会向任何其他人出售或出租您的个人信息。但如出于改善产品服务质量的需要，橙子公司可能会对点播记录进行扫描和统计，并有可能与第三方服务机构合作来改善算法性能和提升内容品质。橙子公司承诺与任何第三方的合作都会签署有关保护用户隐私的条款，并将尽可能保护用户的个人信息和数据。在极端特殊情况下，橙子公司可以透露特定的信息，例如，所在国政府或联合国机构请求、法院调查令等法律规定的情况，以及为执行本公司的政策或应用户本人请求及保护他人的权益、财产和安全等。橙子公司在法律范围内会响应法院指令，以便加强本网站的管理或保护他人的权利。橙子公司不会提供信息给那些推销组织以及具有商业目的的公司或代理机构。橙子公司将会非常认真地保护您的个人信息。然而，尽管公司会尽力，但是仍然存在第三方通过非法手段中途截取发送的信息的风险。这在所有互联网应用使用中都是真实、客观存在的。橙子公司无法完全保证您传送的任何信息的安全，尤其是橙子公司服务器可能遭遇非法入侵和破坏时。因此，发送任何消息的风险需要由您自行承担。橙子公司将采取所有合理的预防措施来确保您的个人信息和点播记录的安全，除非橙子公司存在疏忽，否则橙子公司将不承担因您提供的信息被非法侵入而造成您和第三方的损失。橙子公司永远不会发送电子邮件或手机短信来向您索要任何账号信息。如果您接收了这样的电子邮件或短信息，绝对不要回复。
        本应用中的播放资源由喜马拉雅提供。
    </div>
  </div>
</template>

<script>
    const copyrightNote = [
        {
            text: " 一、版权说明",
            value:
                "听橙儿童英语对话训练机器人涉及的内容其版权按照以下规定分别由南京橙子信息科技有限公司（以下简称橙子公司）和其他机构拥有。橙子公司自行创作或提供的内容，版权由自身全权拥有，并拥有处置和取得收益的权利。橙子公司的战略合作伙伴所提供的内容，版权按法律规定由创作者或所有者拥有。本应用中的播放资源由喜马拉雅提供。"
        },
        {
            text: "二、版权保护",
            value: [
                "1、南京橙子信息科技有限公司（以下简称橙子公司）作为基于网络的内容服务提供者，坚决反对剽窃和抄袭行为，但是对剽窃、抄袭行为的发生不具备充分的监控能力。但是一经发现，负有移除剽窃和抄袭的作品并停止继续传播的义务。橙子公司对他人实施的此类侵权行为不承担法律责任，侵权的法律责任由剽窃、抄袭者本人承担。",
                "2、在向橙子公司产品和服务中发布的作品提出侵权时，指控者向橙子公司提出警告必须具备一定的条件，必须提供三类资料：一是著作权人的身份证明，包括身份证、法人执照、营业执照等有效身份证件；二是著作权权属证明，包括发表网站、创作手稿或文件等；三是侵权情况证明，包括被控侵权信息的内容、所在的位置等。只要符合以上条件，橙子公司将采取包括移除等相应措施；如果不符合上述条件，则暂不采取包括移除等的相应措施。",
                "3、橙子公司将努力保护签约作者和合作伙伴，以及用户创作的作品在橙子公司产品中得到符合规定的使用和保护。但因作品提交人侵犯他人版权而引起的纠纷，橙子公司不承担任何责任，上述合作者同意承担由此类事项导致的全部法律责任并保证橙子公司无须承担任何连带责任。",
                "4、橙子公司发现其他网站、公司或个人抄袭或未经同意使用与橙子公司合作的创作者作品，橙子公司有权代表创作者追究对方法律责任。"
            ]
        },
        {
            text: "三、版权声明",
            value:
                "未经南京橙子信息科技有限公司及版权所有人的明确书面特别授权，任何人不得发行、变更、转载、复制、重制、散布本公司服务器上的局部或全部的内容，否则视作侵权，依法追究法律责任。"
        }
    ];
    export default {
        data() {
            return {
                copyrightItem: copyrightNote
            };
        },
        methods: {
            back() {
                this.$router.back();
            }
        }
    };
</script>

<style lang="less" scoped>
    .about-detail {
        .header {
            position: fixed;
            left: 0;
            top: 0;
            display: flex;
            width: 100%;
            height: 50px;
            line-height: 50px;
            color: gray;
            font-size: 20px;
            background: white;

            .tc-back01 {
                width: 50px;
                height: 50px;
                text-align: center;
                flex: 0 0 50px;
                font-size: 20px;
            }

            .title {
                width: 75%;
                font-size: 20px;
                text-align: center;

            }
        }

        .copyright,
        .privateTip,
        .connection {
            padding: 15% 5% 5% 5%;
            line-height: 25px;
            overflow: scroll;
            color: rgb(73, 72, 72);
        }

        .copyright {
            .labelImfo {
                .title {
                    font-size: 24px;
                    margin: 2%;
                }
            }
        }

        .connection {
            .connectionTwo,
            .connectionOne {
                .connectTip {
                    height: 50px;
                    line-height: 50px;

                    .iconfont {
                        display: inline-block;
                        width: 40px;
                        height: 50px;
                        /* text-align: center; */
                        color: orange;
                        font-size: 24px;
                    }

                    h1 {
                        display: inline-block;
                        flex: 0 0 50px;
                        font-size: 24px;
                    }
                }

                .description {
                    text-indent: 2em;
                    margin: 0 2%;
                }

                img {
                    width: 60%;
                    margin: auto 20%;
                }
            }
        }
    }
</style>