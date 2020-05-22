const OPTIONS = {
  autosave: {default: true},
};

const localstorageKey = 'etherface-setting';

const optionsKey = (key, opt) => `${key}.options.${opt}`;

export const loadSettings = () => {
  let options = {};
  Object.keys(OPTIONS).forEach(opt => {
    const optionVal = localStorage.getItem(optionsKey(opt, localstorageKey));
    if (optionVal === null && OPTIONS[opt].default !== undefined) {
      options[opt] = OPTIONS[opt].default;
    } else {
      options[opt] = JSON.parse(optionVal);
    }
  });
  return options;
};

export const setSetting = (setting, val) => {
  localStorage.setItem(optionsKey(setting, localstorageKey), JSON.stringify(val));
};

export default {
  loadSettings,
  setSetting,
};
