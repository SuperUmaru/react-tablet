export class InfiniteLoadGate {
  private armed = true;
  private activeKey:string | null = null;
  private lastStartedAt = Number.NEGATIVE_INFINITY;

  constructor(private readonly cooldownMs = 150) {}

  enter(key:string, now = Date.now()):boolean {
    if (!this.armed || this.activeKey !== null || now - this.lastStartedAt < this.cooldownMs) return false;
    this.armed = false;
    this.activeKey = key;
    this.lastStartedAt = now;
    return true;
  }

  leave():void { this.armed = true; }

  finish(key:string):void {
    if (this.activeKey === key) this.activeKey = null;
  }

  reset():void {
    this.armed = true;
    this.activeKey = null;
    this.lastStartedAt = Number.NEGATIVE_INFINITY;
  }
}
