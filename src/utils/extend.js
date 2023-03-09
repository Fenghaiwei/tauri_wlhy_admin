// 扩展脚本
import Vue from 'vue';
import dayjs from 'dayjs';
import calc from './calc';
import { isNull, isUndefined, isNumber } from '@fe/utils';

// 兼容写法 实现传统的四舍五入
Number.prototype.toFixedNew = function (len) {
  var num = this;
  if (num < 0) {
    num = num * -1;
    return (Math.round(calc.multiply(num, Math.pow(10, len))) / Math.pow(10, len)) * -1;
  }
  return Math.round(calc.multiply(num, Math.pow(10, len))) / Math.pow(10, len);
};

/** *********vue 过滤器拓展************/

/**
 * 通用状态字典 过滤器
 * 将键值转换为label显示
 *
 * @param {array} dictList 状态数组 例如：[{label:'label',value:'value'}]
 */
Vue.filter('valueToLabel', function (value, dictList) {
  if (value === null || value === undefined || value === '') return value;
  if (!Array.isArray(dictList)) return value;
  let item = dictList.filter(el => el.value.toString() === value.toString());
  if (item.length > 0) {
    return item[0].label || '';
  }
  return value;
});

/**
 * 千分位 过滤器
 *
 * @param {number} precision 保留几位小数
 * @param {string} fillZero 实际小数位小于precision时 是否补零
 * @param {string} separator 分隔符 默认为","
 */
Vue.filter('thousands', function (value, precision, fillZero, separator) {
  if (precision === void 0) precision = 2;
  if (fillZero === void 0) fillZero = true;
  if (separator === void 0) separator = ',';

  var num = Number(value);
  // 判断是否为数字
  if (isNumber(num)) {
    var numStr = '';
    if (isNumber(precision)) {
      if (fillZero) {
        numStr = num.toFixedNew(precision).toString();
      } else {
        var decimals = String(num).split('.')[1];
        decimals = decimals ? decimals.length : 0;
        if (decimals > precision) {
          decimals = precision;
        }
        numStr = num.toFixedNew(decimals).toString();
      }
    } else {
      numStr = num.toString();
    }

    var parts = numStr.split('.');
    parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));
    return parts.join('.');
  }
  return value;
});

/**
 * 数字精确位数过滤
 *
 * @param {number} precision 保留几位小数
 */
Vue.filter('toFixed', function (value, precision) {
  // 判断是否为数字
  if (typeof value === 'number' && !isNaN(value)) {
    var num = Number(value);
    if (typeof precision === 'number' && !isNaN(precision)) {
      num = num.toFixedNew(precision);
    }
    return num.toString();
  }
  return value;
});

/*
 * 时间差转换 倒计时 过滤器
 * value 进参(相差的毫秒数)
 */
Vue.filter('countDown', function (value) {
  if (value == '' || value == 0) {
    return '00:00:00';
  }
  var hour = Math.floor(value / 3600);
  var minute = Math.floor((value - hour * 3600) / 60);
  var second = Math.floor(value - hour * 3600 - minute * 60);
  hour = hour < 10 ? '0' + hour : hour;
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  return hour + ':' + minute + ':' + second;
});

/**
 * 时间转换过滤器
 * 依赖dayjs
 * YYYY-MM-DD HH:mm:ss.SSS A

 * @param {string} format format格式 (dayjs的format)
 */
Vue.filter('dateFormat', function (value, format) {
  if (!value) return '';
  if (!dayjs(value).isValid()) return '';
  return dayjs(value).format(format);
});

/**
 * 银行卡打*号
 *
 * @param {number} endLen 后面保留显示位数
 * @param {number} total 银行卡脱敏替换后总长度
 */
Vue.filter('bankSen', function (value, endLen, total) {
  if (!value) return '';
  endLen = endLen || 4;
  total = total || 4;
  var xing = '';
  for (var i = 0; i < total - endLen; i++) {
    xing += '*';
  }
  return xing + value.substr(value.length - 4);
});

/**
 * 身份证打*号
 *
 * @param {number} frontLen 前面保留位数
 * @param {number} endLen 后面保留位数
 */
Vue.filter('idCardSen', function (value, frontLen, endLen) {
  frontLen = frontLen || 4;
  endLen = endLen || 4;
  if (value) {
    var len = value.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return value.substring(0, frontLen) + xing + value.substring(value.length - endLen);
  } else {
    return '';
  }
});

/**
 * 金额转大写
 */
Vue.filter('bigMoney', function (value) {
  if (value == '' || value == 0) {
    return '零元整';
  }
  var fraction = ['角', '分'];
  var digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  var unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];
  var head = value < 0 ? '欠' : '';
  value = Math.abs(value);
  var s = '';
  for (var m = 0; m < fraction.length; m++) {
    s += (digit[Math.floor(value * 10 * Math.pow(10, m)) % 10] + fraction[m]).replace(/零./, '');
  }
  s = s || '整';
  value = Math.floor(value);
  for (var i = 0; i < unit[0].length && value > 0; i++) {
    var p = '';
    for (var j = 0; j < unit[1].length && value > 0; j++) {
      p = digit[value % 10] + unit[1][j] + p;
      value = Math.floor(value / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
});

/**
 * 转换产品期限
 *
 *   */
Vue.filter('termFormat', function (value) {
  if (value) {
    let arr = value.split(',');
    arr = arr.map(el => el + '个月');
    return arr.join(',');
  } else {
    return '';
  }
});

/**
 * 允许输入的内容  其他内容将全部替换为空
 * 此指令仅仅用来限制输入  对内容格式的合法性校验  还是要使用form表单校验
 * 汉字匹配过于复杂 不做处理 详情查询cjk(中日韩统一表意文字)
 *
 * @param {string} en 允许大小写英文
 * @param {string} number 允许数字
 * @param {string} symbol 允许特殊符号(半角符号 即键盘可以直接打出的英文状态下的符号)
 *   */
Vue.directive('allow', {
  update: function (el, { value, modifiers }, vnode) {
    try {
      const dom = el.children[0];
      // 文本框被清空不做处理
      if (!dom.value) return false;

      let _value = dom.value;
      let regstr = '';
      if (modifiers.en) regstr += 'a-zA-Z';
      if (modifiers.number) regstr += '0-9';
      if (modifiers.float) regstr += '.';
      if (modifiers.minus) regstr += '-';
      if (modifiers.symbol) regstr += '[-_,.!|~`()#@%-+=/\'$%^&*{}:;"<>?\\]';

      const reg = new RegExp('[^' + regstr + ']', 'gi');

      _value = _value.replace(reg, '');

      // 没有特殊字符不做处理(也能同时避免重复触发事件)
      if (dom.value !== _value) {
        dom.value = _value;
        // chrome、ie10+、edge都支持dispatchEvent
        if (dom.dispatchEvent) {
          var event = document.createEvent('Event');
          event.initEvent('input', true, true);
          dom.addEventListener('input', function (e) {}, false);
          dom.dispatchEvent(event);
        } else if (element.fireEvent) {
          // 老版IE 使用fireEvent 但我们系统不支持低版本ie 应该不会走到这里
          var evt = document.createEventObject();
          dom.fireEvent('oninput', evt);
        } else {
          throw new Error("Don't Support Event");
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }
});

/**
 * 判断IE浏览器版本
 * 最低支持ie10
 */
function IEVersion() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器
  var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器
  var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;
  if (isIE) {
    var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp['$1']);
    if (fIEVersion === 7) {
      return 7;
    } else if (fIEVersion === 8) {
      return 8;
    } else if (fIEVersion === 9) {
      return 9;
    } else if (fIEVersion === 10) {
      return 10;
    } else {
      return 6; //IE版本<=7
    }
  } else if (isEdge) {
    return 'edge'; //edge
  } else if (isIE11) {
    return 11; //IE11
  } else {
    return -1; //不是ie浏览器
  }
}
const tag = IEVersion();
window.IEtag = tag;
if (tag !== -1 && tag !== 'edge') {
  console.log('IE' + tag);
  window.location.href = './static/browser.html';
  // if (tag < 10) {
  //   window.location.href = './static/browser.html';
  // }
}
