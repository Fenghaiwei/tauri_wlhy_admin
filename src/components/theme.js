const version = require('element-ui/package.json').version;
localStorage.setItem('theme', '#01D28EFF');
const theme = {
  init() {
    return new Promise(async (resolve, reject) => {
      const default_theme = '#2772c0'; // 系统默认主题色
      const local_theme = localStorage.getItem('theme') || default_theme; // 本地保存的的主题色
      if (local_theme.toLowerCase() !== default_theme.toLowerCase()) {
        await theme.update(local_theme, default_theme);
      }
      resolve();
    });
  },
  update(val, oldVal) {
    return new Promise((resolve, reject) => {
      const ORIGINAL_THEME = '#409EFF'; // element-ui默认主题色

      const themeCluster = this.getThemeCluster(val.replace('#', ''));
      let originalCluster = this.getThemeCluster(oldVal.replace('#', ''));

      const getHandler = (variable, id) => {
        return () => {
          originalCluster = this.getThemeCluster(ORIGINAL_THEME.replace('#', ''));
          const newStyle = this.updateStyle(this[variable], originalCluster, themeCluster);

          let styleTag = document.getElementById(id);

          if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.setAttribute('id', id);
            document.head.appendChild(styleTag);
          }
          styleTag.innerText = newStyle;
        };
      };

      const chalkHandler = getHandler('chalk', 'chalk-style');

      if (!this.chalk) {
        const url = `https://unpkg.com/element-ui@${version}/lib/theme-chalk/index.css`;

        this.getCSSString(url, chalkHandler, 'chalk');
      } else {
        chalkHandler();
      }

      const styles = [].slice.call(document.querySelectorAll('style')).filter(style => {
        const text = style.innerText;

        return new RegExp(oldVal, 'i').test(text) && !/Chalk Variables/.test(text);
      });

      styles.forEach(style => {
        const { innerText } = style;

        if (typeof innerText !== 'string') {
          return;
        }
        style.innerText = this.updateStyle(innerText, originalCluster, themeCluster);
      });

      // let postThemeTag = document.getElementById('post-theme-tag');
      // if (!postThemeTag) {
      //   postThemeTag = document.createElement('style');
      //   postThemeTag.setAttribute('id', 'post-theme-tag');
      //   document.head.appendChild(postThemeTag);
      // }
      // postThemeTag.innerText = ':root { --base-color: ' + val + ';}';

      // 设置postcss变量
      document.body.style.setProperty('--base-color', val);
      //存入localStorage
      localStorage.setItem('theme', val);
      resolve();
    });
  },
  updateStyle(style, oldCluster, newCluster) {
    let newStyle = style;

    oldCluster.forEach((color, index) => {
      newStyle = newStyle.replace(new RegExp(color, 'ig'), newCluster[index]);
    });
    return newStyle;
  },

  getCSSString(url, callback, variable) {
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this[variable] = xhr.responseText.replace(/@font-face{[^}]+}/, '');
        callback();
      }
    };
    xhr.open('GET', url);
    xhr.send();
  },

  getThemeCluster(theme) {
    const tintColor = (color, tint) => {
      let red = parseInt(color.slice(0, 2), 16);
      let green = parseInt(color.slice(2, 4), 16);
      let blue = parseInt(color.slice(4, 6), 16);

      if (tint === 0) {
        // when primary color is in its rgb space
        return [red, green, blue].join(',');
      } else {
        red += Math.round(tint * (255 - red));
        green += Math.round(tint * (255 - green));
        blue += Math.round(tint * (255 - blue));

        red = red.toString(16);
        green = green.toString(16);
        blue = blue.toString(16);

        return `#${red}${green}${blue}`;
      }
    };

    const shadeColor = (color, shade) => {
      let red = parseInt(color.slice(0, 2), 16);
      let green = parseInt(color.slice(2, 4), 16);
      let blue = parseInt(color.slice(4, 6), 16);

      red = Math.round((1 - shade) * red);
      green = Math.round((1 - shade) * green);
      blue = Math.round((1 - shade) * blue);

      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);

      return `#${red}${green}${blue}`;
    };

    let clusters = [theme];

    for (let i = 0; i <= 9; i++) {
      clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
    }
    clusters.push(shadeColor(theme, 0.1));
    return clusters;
  }
};
export default theme;
