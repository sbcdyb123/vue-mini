import { activeEffect, trackEffect, triggerEffects } from "./effect";

const targetMap = new WeakMap();
export const createDep = (cleanup?: () => void, key: string) => {
  const dep = new Map() as any;
  dep.cleanup = cleanup;
  dep.name = key;
  return dep;
};
export function track(target, key) {
  // activeEffect
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      // 新增
      targetMap.set(target, (depsMap = new Map()));
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key)));
    }
    // 将当前effect添加到dep中，后续可以通过值的变化，触发effect
    trackEffect(activeEffect, dep);
  }
}
export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  if (dep) {
    triggerEffects(dep);
  }
}
// export
