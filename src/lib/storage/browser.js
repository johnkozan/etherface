import { LocalstorageOptions } from './LocalstorageOptions';

export default class {

  constructor(localstoragePrefix) {
    this.type = 'browser';
    this.name = 'Browser file storage';
    this.localstoragePrefix = localstoragePrefix;
    this.settingsComponent = LocalstorageOptions;
    this.canSave = true;
  }

  async load() {
    const templateJSON = localStorage.getItem(this.localstoragePrefix);
    return JSON.parse(templateJSON);
  }

  async save(appTemplate) {
    localStorage.setItem(this.localstoragePrefix, JSON.stringify(appTemplate));
  }

  async delete() {
    localStorage.removeItem(this.localstoragePrefix);
  }

};
