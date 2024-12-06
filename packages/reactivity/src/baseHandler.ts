import { isObject } from "@vue/shared";
import { track, trigger } from "./reactiveEffect";
import { reactive } from "./reactive";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive", // 唯一
}
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    // 判断是否为响应式对象
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true;
    }
    // 当取值的时候 应该让响应式属性和effect映射起来
    track(target, key); // 依赖收集

    const res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res); // 深度代理
    }
    return res;
  },
  set(target, key, value, receiver) {
    // 找到属性让对应的effect重新执行
    let oldValue = target[key];
    let result = Reflect.set(target, key, value, receiver);

    if (oldValue !== value) {
      // 触发更新
      trigger(target, key, value, oldValue);
    }
    return result;
  },
};
