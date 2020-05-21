import { HttpStorageOptions } from './HttpStorageOptions';

export default class {
  constructor(httpLocation) {
    this.type = 'http'
    this.name = 'HTTP Source';
    this.httpLocation = httpLocation;
    this.canSave = false;
    this.settingsComponent = HttpStorageOptions;
  }

  async load() {
    console.log('File load here...');
    const res = await fetch(this.httpLocation);
    return (await res.json());
  }

  async save() {
    console.error('save to http source not implemented');
  }

  async delete() {
    console.error('Delete from http source not implemented');
  }

}
