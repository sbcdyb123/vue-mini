import { isObject } from "@vue/shared";
import { mutableHandlers, ReactiveFlags } from "./baseHandler";
const reactiveMap = new WeakMap();

export function reactive(target) {
  return createReactiveObject(target);
}
export function shallowReactive(target) {}

function createReactiveObject(target) {
  // 判断是否为对象
  if (!isObject(target)) {
    return;
  }
  // 判断是否为reactive对象
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target;
  }
  const existProxy = reactiveMap.get(target);
  // 判断对象是否已经代理过
  if (existProxy) {
    return existProxy;
  } else {
    const proxy = new Proxy(target, mutableHandlers);
    // 根据对象缓存代理后的结果
    reactiveMap.set(target, proxy);
    return proxy;
  }
}
export function toReactive(value) {}
