import { HttpStorageOptions } from './HttpStorageOptions';

export default class {
  constructor(httpLocation) {
    this.type = 'http'
    this.name = 'HTTP Source';
    this.httpLocation = httpLocation;
    this.canSave = false;
    this.options = HttpStorageOptions;
  }

  async load() {
    console.log('File load here...');
    const res = await fetch(this.httpLocation);
    return (await res.json());
  }

  async save() {
      console.log('file save unsupported...');
    }
}
