<template>
  <layout navActive="transport">
    <div class="address-mark-dtl">
      <div class="cancel_panel ms-controller">
        <div class="map-warp" :style="heightObj">
          <el-amap :vid="'amap-vue'" :events="eventsMap" :zoom="amap.zoom" :center="amap.center">
            <template v-if="pointType === 1">
              <el-amap-marker vid="component-marker" :position="[marker.longitude, marker.latitude]"> </el-amap-marker>
            </template>
            <template v-if="pointType === 2">
              <template v-if="startPoint.length > 0">
                <el-amap-marker
                  v-for="(marker, index) in startPoint"
                  :position="[marker.longitude, marker.latitude]"
                  :key="marker.id"
                  :vid="index"
                >
                  <div class="map-icon-common">
                    <img src="../../../assets/img/common/ico_gj_fazhan.png" width="100%" height="100%" alt="发站" />
                  </div>
                </el-amap-marker>
              </template>
              <template v-if="transportLine.length > 0">
                <el-amap-marker
                  v-for="(marker, index) in transportLine"
                  :position="[marker.longitude, marker.latitude]"
                  :key="marker.id"
                  :vid="index"
                  class="map-point-box"
                >
                  <div class="map-icon-common">
                    <img src="../../../assets/img/common/ico_gj_tj.png" width="100%" height="100%" alt="到站" />
                  </div>
                </el-amap-marker>
              </template>
              <el-amap-marker
                v-for="(marker, index) in endPoint"
                :position="[marker.longitude, marker.latitude]"
                :key="marker.id"
                :vid="index"
              >
                <div class="map-icon-common">
                  <img src="../../../assets/img/common/ico_gj_daozhan.png" width="100%" height="100%" alt="到站" />
                </div>
              </el-amap-marker>
            </template>
          </el-amap>
        </div>
      </div>
    </div>
    <div class="segment-foot mt-20">
      <el-button @click="onJumpList">返回</el-button>
    </div>
  </layout>
</template>
<script>
import Vue from 'vue';
import VueAMap from 'vue-amap';
import axios from '@/utils/axios';
import api from '@/api/api';
import dayjs from 'dayjs';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'b9ca46cb108c4f95b883c5de0c070f6b',
  plugin: ['AMap.Geocoder', 'AMap.DistrictSearch', 'AMap.Polygon', 'AMap.Driving', 'AMap.TruckDriving'],
  v: '1.4.13'
});
export default {
  name: 'AddressMarkDtl',
  data() {
    return {
      id: '',
      pointType: 1, // 点类型 1点 2线
      amapManager: null, // 地图实体
      Driving: '', // 轨迹对象
      DrivingBatch: [],
      flagArr: [],
      startPoint: [], // 装货点
      endPoint: [], // 卸货点
      transportLine: [], // 途径点
      marker: {
        longitude: 116.303843,
        latitude: 39.983412
      },
      amap: {
        zoom: 10,
        center: [116.303843, 39.983412]
      },
      eventsMap: {
        init: async map => {
          this.id = this.$route.params.id;
          this.amapManager = map;
          this.init();
          this.infoWindow = new AMap.InfoWindow({
            anchor: 'middle-left',
            isCustom: true,
            autoMove: true,
            offset: new AMap.Pixel(20, -15)
          });
        }
      },

      heightObj: {
        height: window.innerHeight - 60 - 58 - 20 + 'px'
      }
    };
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '地址标记详情' }]);
  },
  methods: {
    async init() {
      let res = await axios.post(api.markAddressDetail, { id: this.id });
      // 兼容处理
      if (!res.data) {
        this.$message.error('暂无位置信息');
        return;
      }
      this.pointType = res.data.pointType || 1;
      if (this.pointType === 1) {
        let markPoint = res.data.markPoint;
        this.amap.center = [markPoint.point.longitude, markPoint.point.latitude];
        this.marker.longitude = markPoint.point.longitude;
        this.marker.latitude = markPoint.point.latitude;
        this.renderPoint(res);
      } else {
        let markLine = res.data.markLine;
        this.startPoint = [markLine.startPoint];
        this.endPoint = [markLine.endPoint];
        this.transportLine = markLine.passingPoints || [];
        if (this.startPoint.length === 0 || !this.endPoint.length === 0) return;
        let trackPoints = [];
        if (this.transportLine && this.transportLine.length > 0) {
          trackPoints = this.transportLine.map(el => [el.longitude, el.latitude]);
        }
        console.log(this.startPoint);
        console.log(this.endPoint);
        console.log(this.transportLine);
        let trackStartPoint = [this.startPoint[0].longitude, this.startPoint[0].latitude];
        let trackendPoint = [this.endPoint[0].longitude, this.endPoint[0].latitude];
        this.amapManager.plugin(['AMap.Driving'], () => {
          this.Driving = new AMap.Driving({
            map: this.amapManager,
            policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 距离最短
            autoFitView: true, // 自动调整地图视野
            hideMarkers: true, // 是否隐藏marker
            showTraffic: false // 是否显示实时路况信息
          });
          // 由于地图规划路线途经点最多只支持16个点，所以要分段规划
          this.setTrackWay(trackStartPoint, trackendPoint, trackPoints);
        });
      }
    },

    setTrackWay(startPoint, endPoint, wayPoint) {
      /* startPoint起点，endPoint终点，wayPoint途径点 */
      // 分段规划路线--由于高德地图API规划路线途经点最多只支持16个，所以需要分段规划路线
      // 一、途经点小于16个的直接规划
      // 二、途径点大于16个点分几种情况
      //  1.17个途径点---起点16/途径点17/终点卸货地点

      let start = startPoint;
      let end = endPoint;
      let point = wayPoint;

      let len = wayPoint.length;
      if (len <= 16) {
        this.Driving.search(start, end, { waypoints: point }, (status, result) => {
          if (status !== 'complete') {
            this.$message.error('轨迹规划失败');
          }
        });
      } else {
        // 分段规划的数量，向上取整
        let trackCount = Math.ceil(len / 16);
        for (let i = 0; i < trackCount; i++) {
          if (i === 0) {
            // 第一段
            // 起点为装货地地点
            start = startPoint;
            // 途径点直接取前16个点
            point = wayPoint.slice(0, 16);
            // 卸货地取
            end = wayPoint[16];
          } else if (i == trackCount - 1) {
            // 最后一段
            start = wayPoint[16 * i];
            // 途径点直接取16*i到最后的点
            point = wayPoint.slice(16 * i);
            // 卸货地取
            end = endPoint;
          } else {
            // 中间线路
            start = wayPoint[16 * i];
            // 途径点
            point = wayPoint.slice(16 * i, 16 * i + 16);
            // point = wayPoint.slice(16 * i, 16);
            // 卸货地取
            end = wayPoint[16 * i + 16];
          }
          this.flagArr[i] = false;
          this.DrivingBatch[i] = new AMap.Driving({
            map: this.amapManager,
            policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 距离最短
            autoFitView: false, // 自动调整地图视野
            hideMarkers: true, // 是否隐藏marker
            showTraffic: false // 是否显示实时路况信息
          });
          this.DrivingBatch[i].search(start, end, { waypoints: point }, (status, result) => {
            if (status == 'complete') {
              this.flagArr[i] = true;
              if (this.checkTrackWayComplete()) {
                this.loading = false;
              }
            }
            if (status !== 'complete') {
              this.$message.error('轨迹规划失败');
              this.loading = false;
            }
          });
        }
      }
      this.$nextTick(() => {
        this.amapManager.setFitView();
      });
    },
    // 检查分段规划是否完成
    checkTrackWayComplete() {
      return this.flagArr.every(flag => {
        return flag;
      });
    },
    renderPoint(res) {
      let createTime = dayjs(res.data.createTime).format('YYYY-MM-DD HH:mm');
      let addressTarget = '';
      if (res.data.endAddressName) {
        addressTarget = `<div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">起点：</div>
                          <div class="map-window-dtl-right">${res.data.endAddressName}</div>
                        </div>`;
      }
      let content = `<div class="map-window-dtl-warp">
                        <div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">地址类型：</div>
                          <div class="map-window-dtl-right">${res.data.addressTypeName}</div>
                        </div>
                        <div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">地址名称：</div>
                          <div class="map-window-dtl-right">${res.data.addressName}</div>
                        </div>
                        <div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">起点：</div>
                          <div class="map-window-dtl-right">${res.data.markPoint.addressDetail}</div>
                        </div>
                        ${addressTarget}
                        <div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">添加人：</div>
                          <div class="map-window-dtl-right">${res.data.createName || ''}</div>
                        </div>
                        <div class="map-window-dtl-item">
                          <div class="map-window-dtl-left">添加时间：</div>
                          <div class="map-window-dtl-right">${createTime}</div>
                        </div>
                      </div>`;
      this.infoWindow.setContent(content);
      this.infoWindow.open(this.amapManager, this.amap.center);
    },
    onJumpList() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="postcss">
.address-mark-dtl {
  .amap-wrapper {
    width: 100%;
    height: 800px;
  }
  .map-icon-common {
    width: 26px;
    height: 26px;
  }
  .map-window-dtl-warp {
    background: #fff;
    padding: 5px;
    width: 280px;
    position: relative;
    border: 1px solid #e4e7ed;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    color: #5a5e66;
    font-size: 14px;
  }
  .map-window-dtl-warp:before {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    top: 50%;
    margin-top: -5px;
    left: -6px;
    border-top: 6px solid transparent;
    border-right: 6px solid #fff;
    border-bottom: 6px solid transparent;
  }
  .map-window-dtl-item {
    display: flex;
    line-height: 24px;
  }
  .map-window-dtl-left {
    width: 100px;
    text-align: left;
  }
  .map-window-dtl-right {
    flex: 1;
    word-break: break-all;
  }
}
</style>
