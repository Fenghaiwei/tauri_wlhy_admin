<template>
  <layout navActive="transport">
    <div class="rail-exception-dtl" :style="heightObj">
      <el-amap
        vid="amap-vue-track"
        ref="trackMap"
        :amap-manager="amapManager"
        :zoom="amap.zoom"
        :center="amap.center"
        :events="mapEvents"
      >
        <div>
          <el-amap-marker
            v-for="(marker, ind) in startPoint"
            :key="ind"
            :position="[marker.longitude, marker.latitude]"
          >
            <div class="map-icon-common">
              <img src="../../../assets/img/common/ico_hcgj_zhdz_z@2x.png" width="100%" height="100%" alt="装货地" />
            </div>
            <div class="map-car" v-if="!orderDtl.signUploadTime && transportLine.length === 0">
              <img src="../../../assets/img/logistics/ico_carl@2x.png" width="100%" height="100%" alt="车" />
            </div>
          </el-amap-marker>
        </div>
        <div>
          <el-amap-marker
            v-for="(marker, index) in transportLine"
            :key="index"
            :position="[marker.longitude, marker.latitude]"
            :zIndex="
              markerNow.pointType == marker.pointType &&
              markerNow.longitude == marker.longitude &&
              markerNow.latitude == marker.latitude
                ? 100
                : index
            "
          >
            <div
              v-if="marker.pointType == 2 || marker.pointType === 32 || marker.pointType === 512"
              class="zttc-point"
              @click="showWindowFn(marker, index, 2)"
            >
              <span class="zttc-point-left">停</span>
              <span class="zttc-point-right">{{ marker.ext.stayTimeLabel }}</span>
            </div>
            <div v-else class="map-icon-common-point" @click="showWindowFn(marker, index, 1)">
              <img
                v-if="marker.pointType == 0"
                src="../../../assets/img/logistics/ico_hcgj_zcd@2x.png"
                width="100%"
                height="100%"
                alt="正常点"
              />
              <img
                v-if="marker.pointType == 1 || marker.pointType == 128"
                src="../../../assets/img/logistics/ico_hcgj_wdw@2x.png"
                width="100%"
                height="100%"
                alt="无定位"
              />
              <!-- <img
                v-if="marker.pointType == 2 || marker.pointType === 32 || marker.pointType === 512"
                src="../../../assets/img/common/ico_hcgj_zttcc@2x.png"
                width="100%"
                height="100%"
                alt="中途停车点"
            /> -->

              <img
                v-if="marker.pointType == 8"
                src="../../../assets/img/common/ico_hcgj_wxx@2x.png"
                width="100%"
                height="100%"
                alt="APP离线"
              />
            </div>

            <div class="map-car" v-if="!orderDtl.signUploadTime && index === transportLine.length - 1">
              <img src="../../../assets/img/logistics/ico_carl@2x.png" width="100%" height="100%" alt="车" />
            </div>
          </el-amap-marker>
        </div>
        <div>
          <el-amap-marker v-for="(marker, ind) in endPoint" :key="ind" :position="[marker.longitude, marker.latitude]">
            <div class="map-icon-common">
              <img src="../../../assets/img/common/ico_hcgj_zhdz_x@2x.png" width="100%" height="100%" alt="卸货地" />
            </div>
            <div class="map-car" v-if="orderDtl.signUploadTime">
              <img src="../../../assets/img/logistics/ico_carl@2x.png" width="100%" height="100%" alt="车" />
            </div>
          </el-amap-marker>
        </div>
        <div>
          <el-amap-marker
            v-for="(marker, ind) in blackAddressGeopoint"
            :key="ind"
            :position="[marker.longitude, marker.latitude]"
          >
            <div class="map-icon-common" @click="hanldeBlack(marker, true)">
              <img
                src="../../../assets/img/logistics/ico_hcgj_hmddd_m@2x.png"
                width="100%"
                height="100%"
                alt="黑名单地址"
              />
            </div>
          </el-amap-marker>
        </div>
      </el-amap>
      <!-- 左上角司机信息 -->
      <div class="driver-info-con">
        <div class="driver-info-item" v-if="$route.name !== 'MatchOrderRailDetail'">
          <span class="font-bold">当前处理人：{{ orderDtl.currentHandler }}</span>
        </div>
        <div class="driver-info-item">
          <div>
            <span class="font-bold">司机姓名：{{ driverName }}</span>
            <span class="yellow-list-icon" v-if="addYellowbillByUser === 1">黄名单</span>
          </div>
        </div>
        <div class="driver-info-item">
          <div>
            <span>车牌号：{{ licensePlateNumber }}</span>
            <span class="yellow-list-icon" v-if="addYellowbillByCar === 1">黄名单</span>
          </div>
        </div>
      </div>
      <!-- 右上角信息 -->
      <div class="order-info-con">
        <div class="order-info-title">
          <span class="order-info-number">运单号：{{ orderNumber }}</span>
          <div class="order-appointment-status">
            <span @click="reserveHand" class="text-appointment pointer" v-if="orderDtl.subscribeStatus == 0"
              >预约处理</span
            >
            <template v-if="orderDtl.subscribeStatus == 1">
              <span class="text-appointment">已预约</span>
              <span @click="cancelReserveHand" class="reserve-hand-btn">取消预约</span>
            </template>
          </div>
        </div>
        <div class="order-info-item-warp" :style="warpHeightObj">
          <div
            class="order-info-item"
            :class="{
              'order-status-jd': val.orderState === 1,
              'order-status-zh': val.orderState === 2,
              'order-status-fmd': val.orderState === 6,
              'order-status-kcgb': val.orderState === 4,
              'order-status-zcgb': val.orderState === 5,
              'order-status-icon1': val.pointType === 1 || val.pointType === 128,
              'order-status-icon2': val.pointType === 2 || val.pointType === 32 || val.pointType === 512,
              'order-status-icon3': val.pointType === 4,
              'order-status-icon4': val.pointType === 8,
              'order-status-chaosu': val.pointType === 1024,
              'order-status-chaozai': val.pointType === 2048,
              'order-status-pljs': val.pointType === 4096,
              'order-status-fxcl': val.pointType === 8192,
              'order-status-fxsj': val.pointType === 16384,
              'order-status-xh': val.orderState === 3,
              'order-status-yszsc': val.orderState === 7,

              active: activeIndex === ind
            }"
            v-for="(val, ind) in vehicleAbnormalPoints"
            :key="ind"
          >
            <div class="order-item_left">
              <div @click="showWindowFn(val, ind, 2)">
                <div
                  :class="{
                    'text-gray': val.processingDetailStatus == 1,
                    'text-red': val.processingDetailStatus == 2
                  }"
                >
                  {{ val.msg }}
                  <!--黑名单地点停车-->
                  <span v-if="val.pointType === 32" class="font-red">【黑名单地点停车】</span>
                  <!--夜间停车-->
                  <span v-if="val.pointType === 512" class="font-red">【夜间停车】</span>
                  <!--全程无定位-->
                  <span v-if="val.pointType === 128" class="font-red">【全程无定位】</span>
                </div>
                <div
                  v-if="val.pointType === 32 && val.blackAddressGeopoint"
                  class="font-blue"
                  @click.stop="hanldeBlack(val)"
                >
                  查看黑名单地点
                </div>
                <div
                  class="order-info-time"
                  :class="{
                    'text-gray': val.processingDetailStatus == 1,
                    'text-red': val.processingDetailStatus == 2
                  }"
                >
                  {{ val.beginTime | dateFormat('YYYY-MM-DD HH:mm:ss') }}
                </div>
                <div
                  v-if="val.processingRemark"
                  class="order-info-remark"
                  :class="{
                    'text-gray': val.processingDetailStatus == 1,
                    'text-red': val.processingDetailStatus == 2
                  }"
                  :title="val.processingRemark"
                >
                  {{ val.processingRemark }}
                </div>
              </div>
            </div>
            <div class="order-item_right">
              <span class="btn pointer" @click.stop="hanldeAbnormal(val)" v-if="val.processingDetailStatus == 0"
                >处理</span
              >
              <span class="text-confirm" v-if="val.processingDetailStatus == 2">已确认</span>
              <span class="text-ignore" v-if="val.processingDetailStatus == 1">已忽略</span>
            </div>
          </div>
        </div>
        <div class="order-addr-num">
          <div class="order-addr-num-left">
            <div class="desc">中交定位点数：{{ monitorStat.zjLocationNum || 0 }}</div>
            <div class="font-red" v-if="monitorStat.zjNetTips">({{ monitorStat.zjNetTips }})</div>
            <div class="desc">app定位点数: {{ monitorStat.appLocationNum || 0 }}</div>
          </div>
          <div class="order-addr-num-right" v-if="orderDtl.handleBatchSwitch == 1">
            <el-button type="primary" @click="handleBatch">批量处理</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--异常处理-->
    <el-dialog title="处理" :visible="abnormalHandData.abnormalHandVisible" :show-close="false" width="500px">
      <div class="abnormal-handle-item">
        <span class="mr-20 abnormal-handle-item_label"><span class="font-red mr-5">*</span>处理结果</span>
        <el-radio-group v-model="abnormalHandData.processResultState">
          <el-radio :label="1">忽略异常</el-radio>
          <el-radio :label="2" v-if="handleType == 1">确认异常</el-radio>
        </el-radio-group>
      </div>
      <template v-if="handleType == 1 && abnormalHandData.processResultState == 2">
        <div class="abnormal-handle-item">
          <span class="mr-20 abnormal-handle-item_label"><span class="font-red mr-5">*</span>通知对象</span>
          <el-checkbox-group v-model="abnormalHandData.notifyObjects">
            <template v-for="(item, index) in notifyObjectsList">
              <el-checkbox :key="index" :label="item.val">{{ item.name }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
        <div class="abnormal-handle-item">
          <span class="mr-20 abnormal-handle-item_label">通知方式</span>
          <el-checkbox-group v-model="abnormalHandData.methodToInforme">
            <template v-for="(item, index) in methodToInformeList">
              <el-checkbox :key="index" :label="item.val">{{ item.name }}</el-checkbox>
            </template>
          </el-checkbox-group>
        </div>
      </template>
      <div class="abnormal-handle-item">
        <el-input
          v-model.trim="abnormalHandData.processingRemark"
          type="textarea"
          :rows="5"
          placeholder="请输入描述"
          :maxlength="128"
          show-word-limit
        />
      </div>
      <div slot="footer">
        <el-button @click="abnormalHandData.abnormalHandVisible = false">取消</el-button>
        <el-button type="primary" @click="abnormalHandSubmit">提交</el-button>
      </div>
    </el-dialog>
    <appointment-hand ref="appointmentHandRef" @appointFinish="init"></appointment-hand>
  </layout>
</template>
<script>
import Vue from 'vue';
import axios from '@/utils/axios';
import VueAMap from 'vue-amap';
import api from '@/api/api';
import dayjs from 'dayjs';
import AppointmentHand from './components/AppointmentHand';
Vue.use(VueAMap);
VueAMap.initAMapApiLoader({
  key: 'b9ca46cb108c4f95b883c5de0c070f6b',
  plugin: ['AMap.Driving', 'AMap.TruckDriving'],
  v: '1.4.13'
});
export default {
  components: { AppointmentHand },
  name: 'RailExceptionDtl',
  computed: {
    params() {
      return this.$route.params;
    }
  },
  data() {
    return {
      orderDtl: {},
      amapManager: null, // 地图实体
      Driving: '', // 轨迹对象
      DrivingBatch: [],
      flagArr: [],
      markers: [],
      markerNow: {}, // 当前点击的点
      amap: {
        pshow: false,
        visible: false,
        zoom: 7,
        center: [116.303843, 39.983412]
      },
      endPoint: [], // 卸货点
      startPoint: [], // 装货点
      // 途径点
      transportLine: [],
      lineType: 2, // 展示轨迹点还是轨迹线1.展示定位点2.展示定位点并连线
      addYellowbillByCar: '', //车辆是否加入黄名单
      addYellowbillByUser: '', //司机是否加入黄名单
      driverName: '',
      licensePlateNumber: '', // 车牌号
      vehicleAbnormalPoints: [], // 异常信息列表
      driverCode: '', //司机编码
      activeIndex: null,
      blackAddressGeopoint: [],
      mapEvents: {
        init: async map => {
          this.amapManager = map;
          this.init();
          this.infoWindow = new AMap.InfoWindow({
            anchor: 'top-left',
            isCustom: true,
            autoMove: true,
            offset: new AMap.Pixel(24, -56)
          });
        },
        click: () => {
          this.infoWindow.close();
        }
      },

      heightObj: {
        height: window.innerHeight - 60 - 58 - 20 - 50 + 'px'
      },
      warpHeightObj: {
        'max-height': window.innerHeight - 400 + 'px'
      },
      DrivingNew: [],
      monitorStat: {
        zjLocationNum: 0, //中交定位个数
        appLocationNum: 0, //APP定位点数
        zjNetTips: '' // 中交入网提示
      },
      abnormalHandData: {
        abnormalHandVisible: false,
        processResultState: '', //处理结果:1-忽略异常,2-确认异常
        methodToInforme: [], // 通知方式:1-短信,2-IVR语音
        processingRemark: '',
        notifyObjects: [1] // 通知对象:1-企业,2-司机
      },
      methodToInformeList: [
        { name: '短信', val: 1 },
        { name: 'IVR语音', val: 2 }
      ],
      notifyObjectsList: [
        { name: '企业', val: 1 },
        { name: '司机', val: 2 }
      ],
      pointNow: {},
      orderNumber: '',
      handleType: 1, //1单个处理，2批量处理
      abnormalMap: {
        1024: {
          title: '超速',
          icon: 'map-window-dtl-chaosu'
        },
        2048: {
          title: '超载',
          icon: 'map-window-dtl-chaozai'
        },
        4096: {
          title: '疲劳驾驶',
          icon: 'map-window-dtl-pljs'
        },
        8192: {
          title: '风险车辆',
          icon: 'map-window-dtl-fxcl'
        },
        16384: {
          title: '风险司机',
          icon: 'map-window-dtl-fxsj'
        }
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    axios.post(api.handlerLeaves, { orderNumber: this.orderNumber });
    next();
  },
  created() {
    this.$store.dispatch('setBreadcrumb', [{ title: '首页', path: '/transport' }, { title: '轨迹详情' }]);
    window.$vm = this;
    this.orderNumber = this.params.orderNumber;
  },
  methods: {
    async init() {
      let res = await axios.post(api.orderTrackDtl, {
        orderNumber: this.orderNumber
      });
      this.orderDtl = res.data;
      this.monitorStat = res.data.monitorStat || {};
      this.addYellowbillByCar = res.data.addYellowbillByCar; //车辆是否加入黄名单
      this.addYellowbillByUser = res.data.addYellowbillByUser; //司机是否加入黄名单
      this.driverName = res.data.driverName;
      this.licensePlateNumber = res.data.licensePlateNumber;
      this.startPoint = res.data.loadAddressPoints || [];
      this.endPoint = res.data.unloadAddressPoints || [];
      this.transportLine = res.data.vehicleTrackPoints.filter(el => {
        return el.longitude && el.latitude;
      });
      this.vehicleAbnormalPoints = res.data.vehicleAbnormalPoints || [];
      this.driverCode = res.data.driverCode;
      let trackStartPoint = [this.startPoint[0].longitude, this.startPoint[0].latitude];
      let trackendPoint = [this.endPoint[0].longitude, this.endPoint[0].latitude];

      // 如果没有途经点
      if (res.data.vehicleTrackPoints.length === 0) {
        this.setLine({
          color: '#B3C7DA',
          list: [
            {
              list: [trackStartPoint, trackendPoint]
            }
          ]
        });
        return;
      }
      let trackPoints = [];
      res.data.vehicleTrackPoints.forEach((point, index) => {
        if (point.longitude && point.latitude) trackPoints.push([point.longitude, point.latitude]);
      });
      let endPoint = [...trackendPoint];
      if (!res.data.signUploadTime) {
        endPoint = trackPoints[trackPoints.length - 1];
        trackPoints = trackPoints.slice(0, trackPoints.length - 1);
      }

      this.amapManager.plugin(['AMap.Driving'], () => {
        this.Driving = new AMap.Driving({
          map: this.amapManager,
          policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 距离最短
          autoFitView: true, // 自动调整地图视野
          hideMarkers: true, // 是否隐藏marker
          showTraffic: false // 是否显示实时路况信息
        });
        // 由于地图规划路线途经点最多只支持16个点，所以要分段规划
        this.setTrackWay(trackStartPoint, endPoint, trackPoints);
      });
      let orderTrack = {
        color: '#FF6600',
        list: []
      };
      res.data.nolocationPoints.map(el => {
        if (el.longitude && el.latitude) {
          orderTrack.list.push({
            list: [
              [el.longitude, el.latitude],
              [el.endLongitude, el.endLatitude]
            ]
          });
        }
      });
      if (orderTrack.list.length > 0) this.setLine(orderTrack);

      // 如果没有卸货
      if (!res.data.signUploadTime) {
        const transport = res.data.vehicleTrackPoints[res.data.vehicleTrackPoints.length - 1];
        this.setLine({
          color: '#B3C7DA',
          list: [{ list: [[transport.longitude, transport.latitude], trackendPoint] }]
        });
      }
    },
    setLine(orderTrack) {
      let arr = orderTrack.list;
      for (let i = 0; i < arr.length; i++) {
        let start = arr[i].list[0];
        let end = arr[i].list[arr[i].list.length - 1];
        this.DrivingNew[i] = new AMap.Driving({
          map: this.amapManager,
          policy: AMap.DrivingPolicy.LEAST_DISTANCE, // 距离最短
          autoFitView: false, // 自动调整地图视野
          hideMarkers: true, // 是否隐藏marker
          showTraffic: false // 是否显示实时路况信息
        });
        this.DrivingNew[i].search(start, end, (status, result) => {
          if (status == 'complete') {
            const { routes = [] } = result;
            const { steps = [] } = routes[0];
            const pathArr = steps.map(el => el.path);
            const path = this.flatten(pathArr);
            // 绘制轨迹
            const polyline = new window.AMap.Polyline({
              map: this.amapManager,
              path,
              showDir: true,
              strokeColor: orderTrack.color, // 线颜色
              strokeOpacity: 1, // 线透明度
              strokeWeight: 8, // 线宽
              strokeStyle: 'solid', // 线样式
              // lineJoin: 'round', // 折线拐点的绘制样式
              zIndex: 999
            });
            polyline.setMap(this.amapManager);
          }
        });
      }
      this.$nextTick(() => {
        this.amapManager.setFitView();
      });
    },
    flatten(arr) {
      // 合并多个数组
      const result = [];
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          result.push(arr[i][j]);
        }
      }
      return result;
    },
    setTrackWay(startPoint, endPoint, wayPoint) {
      console.log(startPoint, endPoint, wayPoint);
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
              console.log('111', this.checkTrackWayComplete());
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
    showWindowFn(marker, idx, type) {
      if (marker.pointType === 0 || marker.pointType === 4 || !marker.longitude || !marker.latitude) return;
      if (type === 2) this.activeIndex = idx;
      this.markerNow = marker;

      let content = this.handerRender(marker.pointType, marker);
      this.infoWindow.setContent(content);
      this.amap.center = [marker.longitude, marker.latitude];
      this.infoWindow.open(this.amapManager, [marker.longitude, marker.latitude]);
    },
    handerRender(abnormalType, marker) {
      // 中途停车异常2 黑名单地点停车32  夜间停车512
      if (abnormalType === 2 || abnormalType === 32 || abnormalType === 512) {
        let titleStr = '停车点';
        let titleRt = '';
        if (abnormalType === 32) titleStr = '黑名单地点停车';
        if (abnormalType === 512) titleStr = '夜间停车';
        if (abnormalType === 32 && marker.blackAddressGeopoint) {
          titleRt = `<span class="font-blue" onclick="showBlack()">查看黑名单地点</span>`;
        }
        return `<div class="map-window-dtl-warp">
                    <div class="map-window-dtl-title black">
                     <span class="map-window-dtl-zttc"></span>
                     <span class="map-window-black">
                     <span class="font-red">${titleStr}</span>
                        ${titleRt}
                     </span>
                    </div>
                    <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">停车时长：</div>
                    <div class="map-window-dtl-right">${marker.ext.stayTime || ''}</div>
                    </div>
                    <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">行驶距离：</div>
                    <div class="map-window-dtl-right">${marker.ext.distance}</div>
                    </div>
                    <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">开始时间：</div>
                    <div class="map-window-dtl-right">${marker.ext.beginTime}</div>
                    </div>
                    <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">定位地址：</div>
                    <div class="map-window-dtl-right">${marker.ext.locatAddress}</div>
                    </div>
                    <div class="map-window-dtl-arr"></div>
                </div>`;
      }

      // 无定位异常1 全程无定位 128
      if (abnormalType === 1 || abnormalType === 128) {
        let titleStr = '无定位';
        if (abnormalType === 128) titleStr = '全程无定位';
        let decStr = '';
        // 分段开始点
        if (marker.ext.position === 1) {
          // 无定位： 无定位时长 开始时间 结束时间 无定位地址
          let stayTimeStr = '',
            endTimeStr = '';
          if (marker.ext.stayTime) {
            stayTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">无定位时长: </div>
                    <div class="map-window-dtl-right">${marker.ext.stayTime}</div>
                    </div>`;
          }
          if (marker.ext.endTime) {
            endTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">结束时间: </div>
                    <div class="map-window-dtl-right">${marker.ext.endTime}</div>
                    </div>`;
          }
          decStr = `${stayTimeStr}
                  <div class="map-window-dtl-item">
                      <div class="map-window-dtl-left">开始时间：</div>
                      <div class="map-window-dtl-right">${marker.ext.beginTime}</div>
                  </div>
                  ${endTimeStr}
                    <div class="map-window-dtl-item">
                      <div class="map-window-dtl-left">无定位地址：</div>
                      <div class="map-window-dtl-right">${marker.ext.locatAddress}</div>
                  </div>`;
        }
        // 分段结束点
        if (marker.ext.position === 2) {
          decStr = ` <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">持续时长：</div>
                    <div class="map-window-dtl-right">${marker.ext.stayTime}</div>
                    </div>
                    <div class="map-window-dtl-item">
                        <div class="map-window-dtl-left">结束时间：</div>
                        <div class="map-window-dtl-right">${marker.ext.endTime}</div>
                    </div>
                    <div class="map-window-dtl-item">
                        <div class="map-window-dtl-left">结束地址：</div>
                        <div class="map-window-dtl-right">${marker.ext.endLocatAddress}</div>
                    </div>`;
        }
        return `<div class="map-window-dtl-warp wdw">
                    <div class="map-window-dtl-title">
                      <span class="map-window-dtl-wdw"></span>
                      <span class="font-orange">${titleStr}</span>
                    </div>
                    ${decStr}
                    <div class="map-window-dtl-arr"></div>
                </div>`;
      }
      // app离线异常8
      if (abnormalType === 8) {
        let locatAddressStr = '',
          stayTimeStr = '',
          beginTimeStr = '',
          endTimeStr = '';
        if (marker.ext.stayTime) {
          stayTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">离线时长：</div>
                    <div class="map-window-dtl-right">${marker.ext.stayTime}</div>
                    </div>`;
        }
        if (marker.ext.beginTime) {
          beginTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">开始时间：</div>
                    <div class="map-window-dtl-right">${marker.ext.beginTime}</div>
                    </div>`;
        }
        if (marker.ext.endTime) {
          endTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">结束时间：</div>
                    <div class="map-window-dtl-right">${marker.ext.endTime}</div>
                    </div>`;
        }
        if (marker.ext.locatAddress) {
          locatAddressStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">APP离线地址：</div>
                    <div class="map-window-dtl-right">${marker.ext.locatAddress}</div>
                    </div>`;
        }
        return `<div class="map-window-dtl-warp lx">
                    <div class="map-window-dtl-title">
                      <span class="map-window-dtl-lx"></span>
                      <span class="color-graycolor-gray">APP离线</span>
                    </div>
                    ${stayTimeStr}
                    ${beginTimeStr}
                    ${endTimeStr}
                    ${locatAddressStr}
                    <div class="map-window-dtl-arr"></div>
                </div>`;
      }
      //超速
      if (
        abnormalType === 1024 ||
        abnormalType === 2048 ||
        abnormalType === 4096 ||
        abnormalType === 8192 ||
        abnormalType === 16384
      ) {
        let locatAddressStr = '',
          stayTimeStr = '',
          beginTimeStr = '',
          endTimeStr = '';
        if (marker.ext.stayTime) {
          stayTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">${this.abnormalMap[abnormalType].title}时长：</div>
                    <div class="map-window-dtl-right">${marker.ext.stayTime}</div>
                    </div>`;
        }
        if (marker.ext.beginTime) {
          beginTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">开始时间：</div>
                    <div class="map-window-dtl-right">${marker.ext.beginTime}</div>
                    </div>`;
        }
        if (marker.ext.endTime) {
          endTimeStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">结束时间：</div>
                    <div class="map-window-dtl-right">${marker.ext.endTime}</div>
                    </div>`;
        }
        if (marker.ext.locatAddress) {
          locatAddressStr = `<div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">${this.abnormalMap[abnormalType].title}地址：</div>
                    <div class="map-window-dtl-right">${marker.ext.locatAddress}</div>
                    </div>`;
        }
        return `<div class="map-window-dtl-warp lx">
                    <div class="map-window-dtl-title">
                      <span class=${this.abnormalMap[abnormalType].icon}></span>
                      <span class="color-graycolor-gray">${this.abnormalMap[abnormalType].title}</span>
                    </div>
                    ${stayTimeStr}
                    ${beginTimeStr}
                    ${endTimeStr}
                    ${locatAddressStr}
                    <div class="map-window-dtl-arr"></div>
                </div>`;
      }
    },
    hanldeBlack(item, isItem = false) {
      this.blackAddressGeopoint = isItem ? [item] : [item.blackAddressGeopoint];
      let blackAddressGeopoint = isItem ? item : item.blackAddressGeopoint;
      let createTime = dayjs(blackAddressGeopoint.createTime).format('YYYY-MM-DD HH:mm');
      let content = `<div class="map-window-dtl-warp wdw">
                    <div class="map-window-dtl-title">
                      <span class="map-window-dtl-black"></span>
                      <span class="black-title">${blackAddressGeopoint.title || ''}（黑名单地址）</span>
                    </div>
                    <div class="map-window-dtl-item">
                    <div class="map-window-dtl-left">标签：</div>
                    <div class="map-window-dtl-right">${blackAddressGeopoint.label}</div>
                    </div>
                    <div class="map-window-dtl-item">
                        <div class="map-window-dtl-left">添加人：</div>
                        <div class="map-window-dtl-right">${blackAddressGeopoint.createName}</div>
                    </div>
                    <div class="map-window-dtl-item">
                        <div class="map-window-dtl-left">添加时间：</div>
                        <div class="map-window-dtl-right">${createTime}</div>
                    </div>
                    <div class="map-window-dtl-item">
                        <div class="map-window-dtl-left">添加地址：</div>
                        <div class="map-window-dtl-right">${blackAddressGeopoint.addressDetail}</div>
                    </div>
                    <div class="map-window-dtl-arr"></div>
                </div>`;
      this.infoWindow.setContent(content);
      this.amap.center = [blackAddressGeopoint.longitude, blackAddressGeopoint.latitude];
      this.infoWindow.open(this.amapManager, [blackAddressGeopoint.longitude, blackAddressGeopoint.latitude]);
    },
    // 预约处理
    reserveHand() {
      this.$refs.appointmentHandRef.openDialog(this.orderNumber);
    },
    // 取消预约
    cancelReserveHand() {
      this.$confirm(`确定取消预约 ？`, '取消预约', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(async () => {
          await axios.post(api.cancelAbnormalReserveHandling, {
            orderNumber: this.orderNumber
          });
          this.init();
        })
        .catch(() => {});
    },
    // 处理异常
    hanldeAbnormal(item) {
      this.pointNow = item;
      this.handleType = 1; //单个处理
      this.abnormalHandData.abnormalHandVisible = true;
      this.abnormalHandData.processResultState = '';
      this.abnormalHandData.methodToInforme = [];
      this.abnormalHandData.notifyObjects = [1];
      this.abnormalHandData.processingRemark = '';
    },
    // 批量处理异常
    handleBatch() {
      this.handleType = 2; //批量处理
      this.abnormalHandData.abnormalHandVisible = true;
      this.abnormalHandData.processResultState = '';
      this.abnormalHandData.processingRemark = '';
    },
    async abnormalHandSubmit() {
      let { processResultState, methodToInforme, processingRemark, notifyObjects } = this.abnormalHandData;
      let postUrl = '';
      let postData = '';
      if (!processResultState) {
        this.$message.error('请选择处理结果');
        return false;
      }
      if (this.handleType == 1 && processResultState == 2 && notifyObjects.length === 0) {
        this.$message.error('请选择通知对象');
        return false;
      }

      switch (this.handleType) {
        case 1:
          // 异常处理
          postUrl = api.abnormalHandling;
          postData = {
            methodToInforme,
            notifyObjects,
            processResultState,
            processingRemark,
            abnormalDetailId: this.pointNow.abnormalDetailId
          };
          break;
        case 2:
          // 批量异常处理
          postUrl = api.abnormalHandleBatch;
          postData = {
            processResultState,
            processingRemark,
            orderNumber: this.params.orderNumber
          };
          break;
        default:
          break;
      }
      await axios.post(postUrl, postData);
      this.abnormalHandData.abnormalHandVisible = false;
      this.init();
    }
  }
};
window.showBlack = function showBlack() {
  window.$vm.hanldeBlack(window.$vm.markerNow);
};
</script>
<style lang="postcss">
.rail-exception-dtl {
  width: 100%;
  line-height: 18px;
  position: relative;
  border: 1px solid #e8ecef;
  .map-icon-common {
    width: 27px;
    height: 34px;
  }
  .map-car {
    width: 54px;
    height: 52px;
    margin: 0 0 0 -22px;
  }
  .map-icon-common-point {
    width: 20px;
    height: 24px;
  }

  .driver-info-con {
    position: absolute;
    left: 16px;
    top: 17px;
    background: #fff;
    padding: 0 14px;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
    .driver-info-item {
      border-bottom: 1px solid #e8ecef;
      padding: 9px 5px;
      &:last-child {
        border: none;
      }

      .add-yellow-list {
        margin-left: 30px;
        color: #39f;
        cursor: pointer;
      }
      .yellow-list-icon {
        padding: 3px 10px;
        background: #fcf5eb;
        border: 1px solid #f8e5c9;
        color: #ff6600;
        font-size: 12px;
        margin-left: 5px;
      }
    }
  }

  .order-info-con {
    position: absolute;
    top: 17px;
    right: 15px;
    background: rgba(255, 255, 255);
    width: 367px;
    font-size: 14px;
    box-shadow: 0px 5px 16px 0px rgba(26, 62, 153, 0.12);
    border-radius: 2px;
    .order-info-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;

      .order-info-number {
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        color: #58626b;
        font-weight: bold;
      }
      .order-appointment-status {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .text-appointment {
          margin-right: 5px;
          font-size: 14px;
          color: #3399ff;
        }
        .reserve-hand-btn {
          font-size: 12px;
          width: 64px;
          height: 20px;
          line-height: 20px;
          background: #f6f7fb;
          border-radius: 2px;
          text-align: center;
          color: #aaa;
          cursor: pointer;
        }
      }
    }

    .order-info-item-warp {
      max-height: 400px;
      overflow-y: auto;
      margin: 0 16px;
      .order-info-item {
        display: flex;
        justify-content: space-between;
        /* margin: 0 7px; */
        padding: 6px 0;
        padding-left: 20px;
        color: #58626b;
        .order-info-time {
          color: #90a0b1;
          font-size: 12px;
        }
        .order-info-remark {
          font-size: 12px;
          word-break: break-all;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }

        &:first-child {
          border-top: 1px solid #e8ecef;
        }
        &:last-child {
          margin-bottom: 20px;
        }
        &.order-status-jd {
          background: url(' ../../../assets/img/common/ico_dzh_yqd@2x.png') no-repeat 10px 10px;
          background-size: 15px 16px;
          background-position: left 6px;
        }
        /*装货*/
        &.order-status-zh {
          background: url(' ../../../assets/img/logistics/ico_hcgj_zhdz_s@2x.png') no-repeat 10px 8px;
          background-size: 18px 23px;
          background-position: left 6px;
        }
        /*卸货*/
        &.order-status-xh {
          background: url(' ../../../assets/img/common/ico_hcgj_zhdz_x@2x.png') no-repeat 10px 8px;
          background-size: 18px 23px;
          background-position: left 6px;
        }
        /*发煤单 */
        &.order-status-fmd {
          background: url(' ../../../assets/img/logistics/ico_hcgj_dyfmd@2x.png') no-repeat 10px 8px;
          background-size: 18px 18px;
          background-position: left 6px;
        }
        /*重车过磅 */
        &.order-status-zcgb {
          background: url(' ../../../assets/img/logistics/ico_hcgj_zcgb@2x.png') no-repeat 10px 8px;
          background-size: 18px 18px;
          background-position: left 6px;
        }
        /*空车过磅 */
        &.order-status-kcgb {
          background: url(' ../../../assets/img/logistics/ico_hcgj_kcgb@2x.png') no-repeat 10px 8px;
          background-size: 18px 18px;
          background-position: left 6px;
        }
        /*运输总时长 */
        &.order-status-yszsc {
          background: url(' ../../../assets/img/logistics/ico_hcgj_zsc@2x.png') no-repeat 10px 8px;
          background-size: 15px 15px;
          background-position: left 6px;
        }
        /*无定位*/
        &.order-status-icon1 {
          background: url(' ../../../assets/img/logistics/ico_hcgj_wdw.png') no-repeat 10px 10px;
          background-size: 15px 20px;
          background-position: left 6px;
        }
        /*中途停车*/
        &.order-status-icon2 {
          background: url('../../../assets/img/common/ico_hcgj_zttcc@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*运输超时*/
        &.order-status-icon3 {
          background: url('../../../assets/img/logistics/ico_hcgj_tccs_s@2x.png') no-repeat 10px 10px;
          background-size: 15px 20px;
          background-position: left 6px;
        }
        /*app离线*/
        &.order-status-icon4 {
          background: url('../../../assets/img/common/ico_hcgj_wxx@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*超速*/
        &.order-status-chaosu {
          background: url('../../../assets/img/logistics/ico_hcgj_chaosu@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*超载*/
        &.order-status-chaozai {
          background: url('../../../assets/img/logistics/ico_hcgj_chaozai@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*疲劳驾驶*/
        &.order-status-pljs {
          background: url('../../../assets/img/logistics/ico_hcgj_pljs@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*风险车辆*/
        &.order-status-fxcl {
          background: url('../../../assets/img/logistics/ico_hcgj_fxcl@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        /*风险司机*/
        &.order-status-fxsj {
          background: url('../../../assets/img/logistics/ico_hcgj_fxsj@2x.png') no-repeat 10px 10px;
          background-size: 15px 18px;
          background-position: left 6px;
        }
        &.active {
          background-color: #f0f2f3;
        }
        .order-item_left {
          width: 240px;
        }
        .order-item_right {
          margin-left: 16px;
          .btn {
            display: block;
            width: 48px;
            height: 24px;
            line-height: 24px;
            background: #01d28e;
            border-radius: 2px;
            color: #fff;
            text-align: center;
            font-size: 12px;
          }
          .text-confirm {
            display: block;
            width: 48px;
            height: 24px;
            line-height: 24px;
            background: #f2fff6;
            border-radius: 2px;
            color: #01d28e;
            text-align: center;
            font-size: 12px;
          }
          .text-ignore {
            display: block;
            width: 48px;
            height: 24px;
            line-height: 24px;
            background: #f6f7fb;
            border-radius: 2px;
            color: #aaa;
            text-align: center;
            font-size: 12px;
          }
        }
      }
    }
    .order-addr-num {
      background: #fff;
      padding: 14px 20px;
      border-top: 1px solid #e8ecef;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .desc {
        position: relative;
        padding: 0 0 0 14px;
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 5px;
          width: 6px;
          height: 6px;
          background: #01d28e;
          border-radius: 50%;
        }
      }
    }
    .black-title {
      color: #2d4359;
    }
  }
  .text-gray {
    color: rgba(88, 98, 107, 0.4) !important;
  }
  .text-red {
    color: #f35856 !important;
  }
  .zttc-point {
    display: flex;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.12);
    position: relative;
    margin-left: -39px;
    .zttc-point-left {
      width: 24px !important;
      height: 24px;
      background: #f35856;
      border-radius: 4px 0px 0px 4px;
      color: #fff;
      text-align: center;
    }
    .zttc-point-right {
      background: #fff;
      width: 40px;
      text-align: center;
    }
    &:after {
      content: '';
      position: absolute;
      left: 30px;
      bottom: -6px;
      width: 0;
      height: 0;
      border-right: 6px solid transparent;
      border-left: 6px solid transparent;
      border-top: 6px solid #fff;
    }
  }

  .map-window-dtl-warp {
    background: #fff;
    padding: 5px 10px 15px;
    width: 286px;
    position: relative;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    color: #5a5e66;
    border-radius: 5px;
    border-top: 4px solid #f35856;
    &.wdw {
      border-top: 4px solid #ff6600;
    }
    &.lx {
      border-top: 4px solid #8a939b;
    }
    .map-window-dtl-arr {
      position: absolute;
      display: block;
      width: 0;
      height: 0;
      border-color: transparent;
      border-style: solid;
      border-width: 8px;
      filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
      top: 16px;
      left: -8px;
      margin-right: 4px;
      border-left-width: 0;
      border-right-color: #fff;
      box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    }
    .map-window-dtl-title {
      display: flex;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #e8ecef;
      padding-bottom: 5px;
      margin-bottom: 5px;
      .map-window-dtl-wdw {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_wdw@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-zttc {
        margin-right: 5px;
        width: 16px;
        height: 14px;
        background: url('../../../assets/img/common/ico_hcgj_tcd@2x.png') no-repeat;
        background-size: 16px 14px;
      }
      .map-window-black {
        flex: 1;
        display: flex;
        justify-content: space-between;
      }
      .map-window-dtl-lx {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/common/ico_hcgj_wxx@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-chaosu {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_chaosu@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-chaozai {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_chaozai@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-pljs {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_pljs@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-fxcl {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_fxcl@2x.png') no-repeat;
        background-size: 15px 18px;
      }
      .map-window-dtl-fxsj {
        margin-right: 5px;
        width: 15px;
        height: 18px;
        background: url('../../../assets/img/logistics/ico_hcgj_fxsj@2x.png') no-repeat;
        background-size: 15px 18px;
      }
    }

    .map-window-dtl-item {
      display: flex;
      line-height: 24px;
      .map-window-dtl-left {
        width: 100px;
        text-align: left;
      }
      .map-window-dtl-right {
        flex: 1;
        word-break: break-all;
      }
    }
  }

  /* .map-window-warp {
    background: #fff;
    padding: 16px;
    width: 360px;
    position: relative;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
    border: 1px solid rgba(228, 231, 237, 1);
    color: #5a5e66;
}
  .map-window-dtl-black {
    margin-right: 5px;
    width: 15px;
    height: 18px;
    background: url('../../assets/img/logistics/ico_hcgj_hmddd_m@2x.png') no-repeat;
    background-size: 15px 18px;
} */

  .map-window-item {
    display: flex;
    line-height: 24px;
  }

  .map-window-left {
    width: 70px;
    /* text-align-last: justify; */
    text-align: left;
  }
  .map-window-right {
    flex: 1;
    word-break: break-all;
  }
  .map-window-arr {
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    border-width: 8px;
    filter: drop-shadow(0 2px 12px rgba(0, 0, 0, 0.03));
    top: 16px;
    left: -8px;
    margin-right: 4px;
    border-left-width: 0;
    border-right-color: #fff;
    box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.06);
  }
  .map-warning-popper {
    min-width: 80px;
    padding: 13px 20px;
    /* top: 148px !important; */
  }
  .map-keyword-con {
    position: absolute;
    left: 20px;
    top: 20px;
    height: 48px;
    line-height: 48px;
    border-radius: 2px;
    width: 338px;
    padding: 0 15px;
    background: #fff;
    z-index: 9999;
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
  }
  .map-keyword-input {
    border: none;
    width: 100%;
  }
  .map-icon-con {
    position: absolute;
    height: 48px;
    width: 48px;
    line-height: 48px;
    top: 0;
    right: 0;
    text-align: center;
    background: #f8fafb;
    color: #58626b;
    cursor: pointer;
  }

  .map-keyword-con ::-webkit-input-placeholder {
    color: #c4cbd2;
  }

  /* Firefox 4-18 */
  .map-keyword-con :-moz-placeholder {
    color: #c4cbd2;
  }

  /* Firefox 19-50 */
  .map-keyword-con ::-moz-placeholder {
    color: #c4cbd2;
  }
  .color-gray {
    color: #5a5e66;
  }
  .timeState-box {
    width: 74px;
    position: relative;
  }
  .timeState-box:after {
    content: '';
    width: 1px;
    background: #cdd3d8;
    position: absolute;
    top: 8px;
    bottom: 8px;
    right: 9px;
  }
  .timeState-box input {
    border: none;
  }
  .timeState-box .el-input__suffix {
    right: 10px;
    top: 1px;
  }
}
.abnormal-handle-item {
  margin: 0 20px 10px 10px;
  display: flex;
  align-items: center;
  .abnormal-handle-item_label {
    width: 80px;
  }
}
</style>
