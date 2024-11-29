export function effect(fn, options?) {
  // 创建一个响应式effect 数据变化后可以重新执行
  // 创建一个effect，只要依赖的属性变化，就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
}
export let activeEffect;
class ReactiveEffect {
  public active = true;
  // fn用户编写的函数  如果fn中依赖的数据发生变化后，需要重新调用run
  constructor(public fn, public scheduler) {}
  run() {
    // fn执行
    if (!this.active) {
      // 不是激活的。执行都什么都不做
      return this.fn();
    }
    let lastEffect = activeEffect;
    try {
      activeEffect = this;
      return this.fn(); //依赖收集
    } finally {
      activeEffect = lastEffect;
    }
  }
}
