/* 业务公用脚本 */
import api from '@/api/api';
import axios from '@/utils/axios';
import dayjs from 'dayjs';
import store from '../store';
import { Message } from 'element-ui';

var utils = {
  /**
   * 获取地址栏参数
   * @param {string} name 参数名
   */
  getQuery(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  /**
   * 设置cookie
   * @param {string} name 参数名
   * @param {string} value 值
   * @param {exdays} name 过期时间
   */
  setCookie(name, value, exdays) {
    var d = new Date();
    exdays = exdays || 365;
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    var expires = 'expires=' + d.toUTCString();
    document.cookie = name + '=' + value + '; ' + expires;
  },
  /**
   * 获取cookie
   * @param {string} name 参数名
   */
  getCookie(nameParams) {
    var name = nameParams + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') c = c.substring(1);
      if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return '';
  },
  /**
   * 清除cookie
   * @param {string} name 参数名
   */
  clearCookie(name) {
    utils.setCookie(name, '', -1);
  },
  /**
   * 打开新的标签页
   * @param {string} url 地址
   */
  openNewTab(url) {
    var a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('target', '_blank');
    a.setAttribute('id', 'camnpr');
    document.body.appendChild(a);
    a.click();
  },
  /**
   * 设置localStorage数据 item值非json对象 请直接localStorage.getItem
   * @param {string} item 键名
   * @param {object} data 键值
   */
  setStorage(item, data) {
    if (!item || !data) return false;
    localStorage.setItem(item, JSON.stringify(data));
    return true;
  },
  /**
   * 获取localStorage数据 item值非json对象 请直接localStorage.getItem
   * @param {string} item 键名
   */
  getStorage(item) {
    if (!item) return null;
    var localdata = localStorage.getItem(item);
    if (localdata === undefined || localdata === null || localdata == '') {
      return null;
    } else {
      try {
        localdata = JSON.parse(localdata);
        return localdata;
      } catch (e) {
        return null;
      }
    }
  },
  /**
   * 获取字典数据 若不指定key则返回所有字典
   * @param {string} key 键名
   * @param {boolean} reload 是否重新获取
   */
  getSysDict(key, reload = false) {
    return new Promise(async (resolve, reject) => {
      const dict = this.getStorage('sysDict') || {};
      if (!reload && Object.keys(dict).length > 0) {
        if (key) {
          resolve(dict[key]);
        } else {
          resolve(dict);
        }
      } else {
        let options = { url: api.getSysDictByAll, params: {} };
        if (key) {
          options.url = api.getSysDictByType;
          options.params = { type: key };
        }
        const result = await axios.get(options.url, { params: options.params });
        if (!key) this.setStorage('sysDict', result.data);
        resolve(result.data);
      }
    });
  },
  /**
   * 查询企业证件
   * @param {Array} companyIdList 要查询的企业id集合
   */
  async queryCompanyFileList(companyIdList) {
    return new Promise(async (resolve, reject) => {
      const fileType = { LICENSE: '营业执照', IDCARD: '身份证正面', IDCARDB: '身份证反面', OTHER: '其他' };
      let certRes = await axios.post(api.queryCompanyFileList, {
        companyIdList: companyIdList
      });
      certRes = certRes.data || [];

      const fileList = companyIdList.map(companyId => {
        if (certRes.length === 0) return [];
        let certList = certRes.filter(el => el.companyId.toString() === companyId.toString());
        certList = certList[0] || {};
        certList = certList.fileList || [];
        certList = certList.map(el => {
          return { url: el.filePath, title: fileType[el.fileType] || '' };
        });
        return certList;
      });
      resolve(fileList);
    });
  },
  /**
   * 生成随机字符串
   * @param {number} len 长度(不包含时间戳)
   * @param {boolean} time 是否要在前面加时间戳  默认为true
   */
  randomName(len, time = true) {
    len = len || 16;
    time = time === false ? time : true;
    var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    var maxPos = chars.length;
    var str = '';
    for (var i = 0; i < len; i++) {
      str += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    if (time) {
      return new Date().getTime() + str;
    } else {
      return str;
    }
  },
  /**
   *
   * @param fn {Function}   实际要执行的函数
   * @param delay {Number}  延迟时间，单位是毫秒（ms）
   *
   * @return {Function}     返回一个“防反跳”了的函数
   */

  debounce(fn, delay) {
    // 定时器，用来 setTimeout
    var timer;

    // 返回一个函数，这个函数会在一个时间区间结束后的 delay 毫秒时执行 fn 函数
    return function (...args) {
      // 保存函数调用时的上下文和参数，传递给 fn

      // 每次这个返回的函数被调用，就清除定时器，以保证不执行 fn
      clearTimeout(timer);

      // 当返回的函数被最后一次调用后（也就是用户停止了某个连续的操作），
      // 再过 delay 毫秒就执行 fn
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, delay);
    };
  },
  /**
   *
   * @param fn {Function}   实际要执行的函数
   * @param delay {Number}  执行间隔，单位是毫秒（ms）
   *
   * @return {Function}     返回一个“节流”函数
   */
  throttle(fn, threshhold) {
    // 记录上次执行的时间
    var last;

    // 定时器
    var timer;

    // 默认间隔为 250ms
    threshhold || (threshhold = 250);

    // 返回的函数，每过 threshhold 毫秒就执行一次 fn 函数
    return function (...args) {
      // 保存函数调用时的上下文和参数，传递给 fn

      var now = +new Date();

      // 如果距离上次执行 fn 函数的时间小于 threshhold，那么就放弃
      // 执行 fn，并重新计时
      if (last && now < last + threshhold) {
        clearTimeout(timer);

        // 保证在当前时间区间结束后，再执行一次 fn
        timer = setTimeout(() => {
          last = now;
          fn.apply(this, args);
        }, threshhold);

        // 在时间区间的最开始和到达指定间隔的时候执行一次 fn
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },
  getCurrentMonth() {
    let date = new Date();
    let sDate = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/01 00:00:00`).getTime();
    let eDate = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 23:59:59`).getTime();
    let nowDate = new Date(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} 00:00:00`).getTime();
    return { sDate, eDate, nowDate };
  },

  /**
   * 预览图片
   * @param url 图片路径 支持字符串、字符串数组、逗号隔开的字符串、ImageViewer类型数组
   * @param title 图片预览时的title (url为object数组时 会优先展示object.title || object.name)
   * @returns
   */
  previewImage(url, title) {
    if (!url || (Array.isArray(url) && url.length === 0)) {
      Message.error('暂无图片');
      return;
    }

    let files = [];
    if (Array.isArray(url)) {
      files = url.map(el => {
        if (typeof el === 'string') {
          return { url: el, title };
        } else {
          return { url: el.url, title: el.title || el.name || title };
        }
      });
    } else {
      files = url.split(',').map(el => {
        return { url: el, title };
      });
    }

    store.dispatch('showViewer', { data: files });
  },

  /**
   *获取几个月前的输入日期
   * @param DateTime date 输入日期(YYYY-MM-DD)
   * @param number  monthNum 月数
   */
  getPreMonthDay(date, monthNum) {
    date = dayjs(date).format('YYYY-MM-DD');
    let dateArr = date.split('-');
    let year = dateArr[0]; //获取当前日期的年份
    let month = dateArr[1]; //获取当前日期的月份
    let day = dateArr[2]; //获取当前日期的日
    let days = new Date(year, month, 0);
    days = days.getDate(); //获取当前日期中月的天数
    let year2 = year;
    let month2 = parseInt(month) - monthNum;
    if (month2 <= 0) {
      let absM = Math.abs(month2);
      year2 = parseInt(year2) - Math.ceil(absM / 12 == 0 ? 1 : parseInt(absM) / 12);
      month2 = 12 - (absM % 12);
    }
    let day2 = day;
    let days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
      day2 = days2;
    }
    if (month2 < 10) {
      month2 = '0' + month2;
    }
    let t2 = year2 + '-' + month2 + '-' + day2;
    return t2;
  },

  // 获取文件前缀
  getFileUrlPrefix() {
    return new Promise(async (resolve, rej) => {
      axios.get(api.getPrefix).then(res => {
        if (res.code === 0) {
          resolve(res.data.filePrefix);
        } else {
          // Message.error(res.message);
          // rej(res.message);
        }
      });
    });
  },
  // 批量搜索处理以换行符或者,隔开
  batchSearchFilter(str) {
    return str ? str.split(/[\s\n\,]/).filter(el => el.length > 0) : [];
  },
  /**
   * 查询当前日期的前n天
   * @param n {number}
   * @returns {date}
   */
  getDatePre(n) {
    let now = new Date();
    now.setDate(now.getDate() - n);
    now.setHours(0, 0, 0, 0);
    return now;
  },
  /**
   * 退出登录清除缓存数据
   */
  logoutClear() {
    localStorage.removeItem('Authorization');
    store.dispatch('clearTabView', []);
    store.dispatch('clearKeepAlive', []);
    store.dispatch('setAuth', false);
  }
};
export default utils;
