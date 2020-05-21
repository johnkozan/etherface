const OPTIONS = [
  'autosave',
];


const localstorageKey = 'etherface-setting';

const optionsKey = (key, opt) => `${key}.options.${opt}`;

export const loadSettings = () => {
  let options = {};
  OPTIONS.forEach(opt => options[opt] = JSON.parse(localStorage.getItem(optionsKey(opt, localstorageKey))));
  return options;
};

export const setSetting = (setting, val) => {
  localStorage.setItem(optionsKey(setting, localstorageKey), JSON.stringify(val));
};

export default {
  loadSettings,
  setSetting,
};
