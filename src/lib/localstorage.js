const localstorageKey = 'decentralhub';
//const localstorageKey = 'etherface';

export const saveAppTemplate = (appTemplate) => {
  localStorage.setItem(localstorageKey, JSON.stringify(appTemplate));
};

export const loadAppTemplate = () => {
  const templateJSON = localStorage.getItem(localstorageKey);
  return JSON.parse(templateJSON);
};

const OPTIONS = [
  'autosave',
];

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
  loadAppTemplate,
  saveAppTemplate,
  loadSettings,
  setSetting,
};
