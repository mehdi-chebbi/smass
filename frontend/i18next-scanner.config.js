module.exports = {
  input: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/node_modules/**',
  ],
  output: './',
  options: {
    debug: true,
    removeUnusedKeys: false,
    sort: true,
    lngs: ['en', 'fr'],
    defaultLng: 'en',

    func: {
      list: ['t', 'i18n.t', 'i18next.t'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    resource: {
      loadPath: 'i18n/dictionaries/{{lng}}.json',
      savePath: 'i18n/dictionaries/{{lng}}.json',
    },

    ns: ['translation'],
    defaultNs: 'translation',
  },
};
