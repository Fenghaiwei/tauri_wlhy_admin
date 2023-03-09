<template>
  <div class="audit-data-history mb-20">
    <div class="segment segment-panels">
      <div class="segment-header">{{ auditData.title }}信息</div>
      <div class="segment-audit">
        <div class="segment-audit-left">
          <fe-viewer
            v-if="auditData.viewerData && auditData.viewerData.length"
            :source="auditData.viewerData"
            ref="idVewerRef"
          ></fe-viewer>
          <div class="segment-audit-noimg" v-else>暂无图片</div>
        </div>
        <div class="segment-audit-right">
          <div class="segment-audit-main">
            <div class="segment-item" v-for="(item, idx) in auditData.auditItemList" :key="idx">
              <div class="segment-label">{{ item.label }}：</div>
              <div class="segment-content">
                <template v-if="item.filter">
                  <template v-if="item.parentKey">{{
                    item.filter(auditData.otherData[item.parentKey][item.key], ...(item.filterParams || []))
                  }}</template>
                  <template v-else>{{
                    item.filter(auditData.otherData[item.key], ...(item.filterParams || []))
                  }}</template>
                </template>
                <template v-else>
                  <span v-if="item.parentKey" :title="auditData.otherData[item.parentKey][item.key]">{{
                    auditData.otherData[item.parentKey][item.key]
                  }}</span>
                  <span v-else :title="auditData.otherData[item.key]">{{ auditData.otherData[item.key] }}</span>
                </template>
              </div>
            </div>
          </div>
          <div class="mt-10" v-if="!auditData.otherData.plateNumberType">
            <el-button type="primary" plain @click="showCertificateData('show', auditData.key, auditData.otherData)"
              >查看更多信息</el-button
            >
          </div>
        </div>
      </div>
    </div>

    <certificate-data-dialog
      v-if="showCertificateMore"
      ref="certificateDataRef"
      :certificateParam="certificateParam"
      :certificateData="certificateData"
      :certificateCanEdit="false"
      :historySource="true"
    />
  </div>
</template>
<script>
import CertificateDataDialog from './CertificateDataDialog';
export default {
  components: { CertificateDataDialog },
  props: {
    auditData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showCertificateMore: false,
      certificateParam: {},
      certificateData: {}
    };
  },
  mounted() {},
  methods: {
    showViewerData() {
      if (this.auditData.viewerData && this.auditData.viewerData.length > 0)
        this.$refs.idVewerRef.show({
          inline: true,
          viewed(el) {
            el.target.viewer.zoomTo(0.9);
          }
        });
    },
    // 查看更多
    showCertificateData(showType, certificateType, certificateDataMap) {
      this.certificateParam = { showType, certificateType };
      this.certificateData = certificateDataMap;
      this.showCertificateMore = true;
      this.$nextTick(() => {
        this.$refs.certificateDataRef.openDia();
      });
    }
  }
};
</script>
<style lang="postcss" scoped>
.audit-data-history {
  position: relative;
  .segment-audit {
    display: flex;
    flex-wrap: wrap;
    margin: 20px;
  }
  .segment-audit-left {
    flex: 1;
    height: 500px;
    margin-right: 20px;
  }
  .segment-audit-right {
    width: 580px;
  }
  .segment-audit-main {
    .segment-content {
      padding: 0 20px;
    }
  }
  .segment-audit-noimg {
    width: 100%;
    height: 500px;
    line-height: 500px;
    background: #f7f8fa;
    text-align: center;
    color: #dbdee0;
    font-size: 24px;
  }
}
</style>
