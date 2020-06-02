import { LocalstorageOptions } from './LocalstorageOptions';
import { fileNameForTemplate } from '../../contexts/AppTemplateContext';

const fileListKey = '____filelist';
const lastFileKey = '____lastfile';

export default class {

  constructor(localstoragePrefix) {
    this.type = 'browser';
    this.name = 'Browser file storage';
    this.localstoragePrefix = localstoragePrefix;
    this.settingsComponent = LocalstorageOptions;
    this.canSave = true;
  }

  async load(fileName) {
    let lastFile;
    if (!fileName) {
      lastFile = this.getLastFile();
    }

    const templateJSON = localStorage.getItem(this.lsKey(fileName || lastFile));
    if (fileName) { this.setLastFile(fileName); }
    return JSON.parse(templateJSON);
  }

  async save(appTemplate) {
    // TODO: should require a template name be set??
    const fileName = fileNameForTemplate(appTemplate);
    console.log('Saving .. ', fileName);
    localStorage.setItem(this.lsKey(fileName), JSON.stringify(appTemplate));
    this.addToFileList(fileName);
    this.setLastFile(fileName);
  }

  async delete(fileName) {
    localStorage.removeItem(this.lsKey(fileName))
    this.removeFromFileList(fileName);
    this.setLastFile(undefined);
  }

  async fileList() {
    return this.getFileList();
  }

  lsKey(name) {
    return `${this.localstoragePrefix}-${name}`;
  }

  getFileList() {
    const item = localStorage.getItem(this.lsKey(fileListKey));
    if (!item) { return []; }
    try {
      return JSON.parse(item);
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  setFileList(fileList) {
    if (!Array.isArray(fileList)) { throw new Error('filelist must be array'); }
    localStorage.setItem(this.lsKey(fileListKey), fileList);
  }

  addToFileList(fileName) {
    const fileList = this.getFileList();
    if (fileList.indexOf(fileName) > -1) { return; }
    localStorage.setItem(this.lsKey(fileListKey), JSON.stringify([...fileList, fileName]));
  }

  removeFromFileList(fileName) {
    const fileList = this.getFileList();
    const newList = fileList.filter(f => f === fileName);
    this.setFileList(newList);
  }

  setLastFile(fileName) {
    localStorage.setItem(this.lsKey(lastFileKey), fileName);
  }

  getLastFile() {
    return localStorage.getItem(this.lsKey(lastFileKey));
  }
};
