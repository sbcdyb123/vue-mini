export function effect(fn, options?) {
  // 创建一个响应式effect 数据变化后可以重新执行
  // 创建一个effect，只要依赖的属性变化，就要执行回调
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if (options) {
    Object.assign(_effect, options);
  }
  const runner = _effect.run.bind(_effect);
  return runner;
}
function preCleanEffect(effect) {
  effect._depsLength = 0;
  effect._trackIds++;
}
function postCleanEffect(effect) {
  if (effect.deps.length > effect._depsLength) {
    for (let i = effect._depsLength; i < effect.deps.length; i++) {
      let dep = effect.deps[i];
      cleanDepEffect(dep, effect);
    }
    effect.deps.length = effect._depsLength;
  }
}
export let activeEffect;
class ReactiveEffect {
  _trackIds = 0; //用于记录当前effect执行了几次
  _depsLength = 0;
  _running = 0;
  deps = [];
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
      // effect重新执行前需要将上一次的依赖清空
      preCleanEffect(this);
      this._running++;
      return this.fn(); //依赖收集
    } finally {
      this._running--;
      postCleanEffect(this);
      activeEffect = lastEffect;
    }
  }
}
// 双向记忆
// 1._trackIds用于记录执行次数（防止出现一个属性在当前effect中多次依赖收集），至收集一次
// 2.拿到上一次依赖的最后一个和这次的比较
// {flag,name}
// {flag,age}
function cleanDepEffect(dep, effect) {
  dep.delete(effect);
  if (dep.size === 0) {
    dep.cleanup();
  }
}
export function trackEffect(effect, dep) {
  // 需要重新收集依赖，将不需要的清除
  if (dep.get(effect) !== effect._trackIds) {
    // 优化了多于的收集
    dep.set(effect, effect._trackIds);

    let oldDep = effect.deps[effect._depsLength];
    // 如果没有存过
    if (oldDep !== dep) {
      if (oldDep) {
        // 删除老的
        cleanDepEffect(oldDep, effect);
      }
      // 换成新的
      effect.deps[effect._depsLength++] = dep;
    } else {
      effect._depsLength++;
    }
  }

  // 双向记忆
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (!effect._running) {
      if (effect.scheduler) {
        // 如果不是正在执行才能执行
        effect.scheduler();
      }
    }
  }
}
