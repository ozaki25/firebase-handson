const dayjs = require('dayjs');

module.exports = {
  title: 'Firebase Handson',
  themeConfig: {
    domain: 'https://firebase-authentication-handson.ozaki25.now.sh',
    sidebar: ['/page1', '/page2', '/page3', '/page4'],
  },
  markdown: {
    lineNumbers: true,
  },
  plugins: {
    '@vuepress/last-updated': {
      transformer: (timestamp, lang) => {
        return dayjs(timestamp).format('YYYY/MM/DD');
      },
    },
    '@vuepress/medium-zoom': {},
    '@vuepress/back-to-top': {},
    seo: {
      description: () => 'ハンズオン資料',
    },
  },
};
