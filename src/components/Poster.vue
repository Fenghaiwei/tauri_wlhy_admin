<template>
  <div
    class="poster-info-wrap"
    :class="{ stock: posterType == 'stock', bid: posterType == 'bid' }"
    ref="posterHtml"
    id="posterHtml"
  >
    <div class="bid-info">
      <div class="bid-addr start">{{ postData.senderAddress }}</div>
      <div class="bid-addr end">{{ postData.receiverAddress }}</div>
      <div class="bid-desc">
        <span class="bid-goods"
          ><span class="bid-goods-type">{{ postData.productType }}</span
          >/{{ postData.productCount }}</span
        >
        <span class="bid-date">{{ postData.productDate }}</span>
      </div>
      <div class="bid-price">
        <span>￥</span>
        <span class="bid-price-num">{{ postData.productPrice }}</span>
      </div>
    </div>
    <div class="bid-qrcode"><div id="qrcodeImg"></div></div>
  </div>
</template>
<script>
import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';
import utils from '@/utils/utils';
import html2canvas from 'html2canvas';
import QRcode from 'qrcodejs2';

export default {
  props: {
    postData: {
      type: Object,
      required: true,
      default: {}
    },
    posterType: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      posterImg: '' // 最终生成的海报图片
    };
  },
  computed: {},
  methods: {
    createQrcode() {
      // 生成二维码
      const qrcodeImgEl = document.getElementById('qrcodeImg');
      qrcodeImgEl.innerHTML = '';
      let qrcode = new QRcode(qrcodeImgEl, {
        width: 160,
        height: 160,
        colorDark: '#000000',
        colorLight: '#ffffff',
        correctLevel: QRcode.CorrectLevel.M
      });
      qrcode.makeCode(this.postData.shareUrl);
      this.createPoster();
    },
    createPoster() {
      // 生成海报
      const domObj = document.getElementById('posterHtml');
      html2canvas(domObj, {
        useCORS: true,
        allowTaint: false,
        logging: false,
        letterRendering: true,
        onclone(doc) {
          let e = doc.querySelector('#posterHtml');
          e.style.display = 'block';
        }
      }).then(canvas => {
        this.posterImg = canvas.toDataURL('image/png');
        let url = this.base64ToUrl(this.posterImg);
        window.open(url);
      });
    },
    base64ToUrl(base64) {
      const [type, data] = base64.split(',');
      const bytes = window.atob(data);
      const aryBuffer = new ArrayBuffer(bytes.length);
      new Uint8Array(aryBuffer).set(bytes.split('').map(v => v.charCodeAt(0)));
      return window.URL.createObjectURL(
        new Blob([aryBuffer], {
          type: type.match(/:(.*?);/)[1]
        })
      );
    }
  }
};
</script>
<style lang="postcss">
.poster-info-wrap {
  position: relative;
  width: 654px;
  height: 762px;

  margin: 0 auto;
  font-size: 14px;
  &.stock {
    background: url('../assets/img/pic_hb_stock.png') no-repeat;
    background-size: 654px 762px;
  }
  &.bid {
    background: url('../assets/img/pic_hb_bid.png') no-repeat;
    background-size: 654px 762px;
  }
  .bid-info {
    padding: 150px 60px;
  }
  .bid-addr {
    margin-bottom: 12px;
    position: relative;
    font-size: 34px;
    padding-left: 14px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    font-weight: bold;
  }

  .bid-addr.end {
    margin-top: 48px;
  }
  .bid-desc {
    position: relative;
    margin: 44px 0 0 30px;
    display: flex;
    align-items: center;
  }
  .bid-stock {
    margin: 0 3px 0 0;
    background: #01d28e;
    border-radius: 10px 0px 10px 0px;
    -moz-border-radius: 10px 0px 10px 0px;
    -o-border-radius: 10px 0px 10px 0px;
    -webkit-border-radius: 10px 0px 10px 0px;
    font-weight: 500;
    color: #ffffff;
    padding: 2px 5px;
  }
  .bid-date {
    position: absolute;
    left: 330px;
    font-size: 26px;
  }

  .bid-date-tag {
    margin: 0 5px;
    padding: 2px 5px;
    background: #f35856;
    border-radius: 10px 0px 10px 0px;
    -moz-border-radius: 10px 0px 10px 0px;
    -o-border-radius: 10px 0px 10px 0px;
    -webkit-border-radius: 10px 0px 10px 0px;
    color: #ffffff;
  }
  .bid-qrcode {
    position: absolute;
    right: 64px;
    bottom: 24px;
    width: 160px;
    height: 160px;
  }
  .bid-price {
    margin: 24px 0 0 -15px;
    color: #f35856;
    font-size: 30px;
  }
  .bid-goods {
    display: flex;
    max-width: 266px;
    font-size: 26px;
  }
  .bid-goods-type {
    flex: 1;
    min-width: 40px;
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .bid-qrcode canvas + img {
    width: 100%;
    height: 100%;
  }

  .bid-price-num {
    margin-left: -4px;
    font-size: 40px;
    font-weight: 600;
  }
}
</style>
