const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'ar'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  queryParameter: 'lang',
  autoReload: false,
  syncFiles: false,
  objectNotation: true,
  parseQuery: false
});

module.exports = i18n;
