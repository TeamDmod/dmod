class queue {
  queue: { delay: number; fn: Function }[] = [];
  index: number = -1;
  delay: number;

  constructor(delay?: number) {
    this.queue = [];
    this.delay = delay || 3000;
  }

  add(fn: () => void, delay?: number) {
    this.queue.push({ fn, delay });
  }

  run(index?: number) {
    index || (index === 0 && (this.index = index));
    this.play();
  }

  play() {
    const index = this.index + 1;
    const atPoint = this.queue[index];
    const next = this.queue[this.index];

    if (!atPoint) return;

    atPoint.fn();
    next &&
      setTimeout(() => {
        this.play();
      }, next.delay || this.delay);
  }

  kill() {
    this.index = 0;
    this.queue = [];
  }
}

export default queue;
