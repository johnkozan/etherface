


const localstorageKey = 'decentralhub';

export const saveAppTemplate = (appTemplate) => {

  localStorage.setItem(localstorageKey, JSON.stringify(appTemplate));

};

export const loadAppTemplate = () => {

  const templateJSON = localStorage.getItem(localstorageKey);

  console.log('Loaded:::: ' , templateJSON);

  return JSON.parse(templateJSON);
};


export default {
  loadAppTemplate,
  saveAppTemplate,
};
