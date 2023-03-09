// 全局验证rules
var validator = {
  // 验证手机号码
  phone: function(val) {
    return /^1[0-9]{10}$/.test(val);
  },
  // 验证邮箱
  email: function(val) {
    return /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(val);
  },

  // 验证版本号
  version: function(val) {
    return /^([1-9]\d|[1-9])(\.([1-9]\d|\d)){2}$/.test(val);
  },

  /**
   * 大于或等于0 的整数
   * @param {string} val value
   * @param {boolean} isZero 是否允许为0
   * @param {boolean} neg 是否允许为负数
   */
  int: function(val, isZero = true, neg = false) {
    if (Math.floor(val).toString() === val.toString()) {
      if (!isZero && Math.floor(val) === 0) {
        return false;
      }
      if (!neg && Math.floor(val) < 0) {
        return false;
      }
      return true;
    } else {
      return false;
    }
  },
  /**
   * 验证数字和小数 不要在input上使用.number修饰符
   * @param {string} val value
   * @param {boolean} isZero 是否允许为0
   * @param {number} num 保留几位小数
   */
  number: function(val, isZero = true, num = 2) {
    // 允许0 直接通过
    if (isZero && (val === '0' || val === 0)) {
      return true;
    }
    //是否为 0.0 0.00 0.000  这种情况直接拒绝通过
    var parts = val.toString().split('.');
    if (parseInt(parts[0]) === 0 && parseInt(parts[1]) === 0) {
      return false;
    }

    // 正常数字通过, 0.0 0.00 0.000通过, 0不通过
    var reg = new RegExp('^(([1-9][0-9]*)|(([0]\\.\\d{1,' + num + '}|[1-9][0-9]*\\.\\d{1,' + num + '})))$');
    return reg.test(val);
  },
  //验证汉字
  chinese: function(val, s = 1, e = 20) {
    // s 最小长度
    // e 最大长度
    var reg = new RegExp('^[\u4E00-\u9FA5]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  // 6位数 数字验证(支付密码)
  paypwd: function(val) {
    return /^[0-9]{6}$/.test(val);
  },

  // 4、6位数 数字验证(验证码)
  yzm: function(val) {
    return /^[0-9]{4}$|^[0-9]{6}$/.test(val);
  },
  /**
   * 验证数字、字母、数字+字母 组合
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  string: function(val, s = 1, e = 60) {
    var reg = new RegExp('^[a-zA-Z0-9]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  /**
   * 验证大写字母
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  capital: function(val, s = 1, e = 60) {
    var reg = new RegExp('^[A-Z]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  /**
   * 验证小写字母
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */ lower: function(val, s = 1, e = 60) {
    var reg = new RegExp('^[a-z]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  /**
   * 数字、字母、下划线组合(一般用于登录密码)
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  password: function(val, s = 1, e = 60) {
    var reg = new RegExp('^[A-Za-z0-9_]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  /**
   * 验证中文姓名 包含·
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  name: function(val, s = 2, e = 20) {
    if (val.substring(0, 1) === '·') return false;
    if (val.substring(val.length - 1, val.length) === '·') return false;
    //不在\u3400-\u9fa5编码范围内的特殊汉字 见到一个加一个
    const allowChars = ['·', '𥖄', '𤰉'];
    const allowCharsStr = allowChars.join('');
    const range = `[\u3400-\u9fa5${allowCharsStr}]`;
    var reg = new RegExp(`^${range}{${s},${e}}$`, 'g');
    return reg.test(val);
  },
  // 是否含有全角符号
  hasAngle: function(str) {
    var reg = /[\uFF00-\uFFEF]/;
    return reg.test(str);
  },
  /**
   * 验证银行卡号
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  bankCard: function(val, s = 10, e = 40) {
    var reg = new RegExp('^[0-9]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  // 验证车牌号
  plate: function(val) {
    var reg = /^[澳_川_鄂_甘_赣_贵_桂_港_黑_沪_京_津_冀_吉_晋_辽_鲁_蒙_闽_宁_青_琼_陕_苏_皖_湘_新_渝_豫_粤_云_藏_浙]{1}[A-Z]{1}[A-Z_0-9]{4}[A-Z_0-9_挂]{1}$/;
    return reg.test(val);
  },
  // 验证身份证
  idCard: function(val) {
    // 去掉所有的空格
    var cardNo = val.replace(/\s/g, '');

    var info = { isTrue: false, year: null, month: null, day: null, isMale: false, isFemale: false };
    if (!cardNo && cardNo.length != 18) {
      info.isTrue = false;
      return info;
    }

    if (cardNo.length == 18) {
      var year = cardNo.substring(6, 10);
      var month = cardNo.substring(10, 12);
      var day = cardNo.substring(12, 14);
      var p = cardNo.substring(14, 17);
      var birthday = new Date(year, parseFloat(month) - 1, parseFloat(day));
      // 这里用getFullYear()获取年份，避免千年虫问题
      if (
        birthday.getFullYear() != parseFloat(year) ||
        birthday.getMonth() != parseFloat(month) - 1 ||
        birthday.getDate() != parseFloat(day)
      ) {
        info.isTrue = false;
        return info;
      }
      var Wi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1]; // 加权因子
      var Y = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2]; // 身份证验证位值.10代表X
      // 验证校验位
      var sum = 0; // 声明加权求和变量
      var _cardNo = cardNo.split('');

      if (_cardNo[17].toLowerCase() == 'x') {
        _cardNo[17] = 10; // 将最后位为x的验证码替换为10方便后续操作
      }
      for (var i = 0; i < 17; i++) {
        sum += Wi[i] * _cardNo[i]; // 加权求和
      }
      var s = sum % 11; // 得到验证码所位置

      if (_cardNo[17] != Y[s]) {
        info.isTrue = false;
        return info;
      }
      info.isTrue = true;
      info.year = birthday.getFullYear();
      info.month = birthday.getMonth() + 1;
      info.day = birthday.getDate();
      if (p % 2 == 0) {
        info.isFemale = true;
        info.isMale = false;
      } else {
        info.isFemale = false;
        info.isMale = true;
      }
      return info;
    }
    // 判断info.isTrue即可
    return info;
  },
  // 图片上传大小限制为3M
  imgLimit: 3,
  /**
   * 验证公司名称 常规中文验证
   * @param {string} val value
   * @param {boolean} s 最小长度
   * @param {number} e 最大长度
   */
  companyName: function(val, s = 1, e = 20) {
    var reg = new RegExp('^[a-zA-Z0-9\u3400-\u9fa5()]{' + s + ',' + e + '}$');
    return reg.test(val);
  },
  // 验证统一社会信用代码
  companyCode: function(Code) {
    /*
     * 统一社会信用代码构成： https://www.cods.org.cn/c/2017-04-19/564.html
     * 统一社会信用代码验证码规则： https://zh.wikisource.org/zh-hans/GB_32100-2015_法人和其他组织统一社会信用代码编码规则
     * 第一部分（第1位）：登记管理部门代码，使用阿拉伯数字或英文字母表示。
     * 第二部分（第2位）：机构类别代码，使用阿拉伯 数字或英文字母表示。
     * 第三部分（第3—8位）：登记管理机关行政区划码，使 用阿拉伯数字表示。
     * 第四部分（第9—17位）：主体标识码（组织机构代码），使用阿拉伯数字或英文字母表示。
     * 第五部分（第18位）：校验码，使用阿拉伯数字或英文字母 表示。
     */
    let reg = /^[0-9a-zA-Z]{2}[0-9]{6}[0-9a-zA-Z]{10}$/;
    if (Code.length != 18 || !reg.test(Code)) {
      return false;
    }
    // 校验第18位验证码 代码字符与代码字符数值对应规则
    // prettier-ignore
    const CI = {"0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,"7":7,"8":8,"9":9,"A":10,"B":11,"C":12,"D":13,"E":14,"F":15,"G":16,"H":17,"J":18,"K":19,"L":20,"M":21,"N":22,"P":23,"Q":24,"R":25,"T":26,"U":27,"W":28,"X":29,"Y":30};

    const WI = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28]; //加权因子
    let sArr = Code.split('');
    let U18 = sArr[17]; //用户输入第18位
    let sum = 0;

    for (let i = 0; i < 17; i++) {
      let s = sArr[i];
      if (CI[s]) {
        sum += CI[s] * WI[i];
      }
    }
    let C18 = sum % 31 === 0 ? 0 : 31 - (sum % 31); // 校验码值, 当校验码为31时，转换为0
    let checkCode;
    for (let key in CI) {
      // 校验码转换成字符串
      if (CI[key] === C18) {
        checkCode = key;
      }
    }
    if (checkCode === U18) {
      return true;
    } else {
      return false;
    }
  },
  // 验证组织机构代码代码
  companyOrigin: function(Code) {
    return /^[A-Z0-9]$/.test(Code);
  },
  //大于0的数字 最多2位小数
  isTwoDecimal: function(val) {
    return /^([1-9]\d{0,7}|0)(\.\d{1,2})?$/.test(val);
  }
};
export default validator;
