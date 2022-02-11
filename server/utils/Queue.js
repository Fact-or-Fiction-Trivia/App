export default class Queue {
  constructor(onLoad, options = { cascading: true }) {
    this.data = [];
    this.options = options;
    this.onLoad = onLoad;
  }
  /**
   * @param {any} obj
   */
  set enqueue(obj) {
    this.data.push(obj);
    if (this.data.length === 1) {
      this.load();
    }
  }
  load() {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.onLoaded());
      }, 1000);
    });
  }
  onLoaded() {
    if (this.data.length > 0) {
      this.onLoad(this.data.shift());
      this.options.cascading && this.peek() && this.load();
    }
  }
  peek() {
    return this.data[0];
  }
}

const onLoad = (data) => console.log("Grabbed", data);
const q = new Queue(onLoad);

for (let i = 0; i < 3; i++) {
  q.enqueue = { uri: i };
}
