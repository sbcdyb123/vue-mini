import { track } from "./reactiveEffect";

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
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    // 找到属性让对应的effect重新执行
    // 触发更新
    return Reflect.set(target, key, value, receiver);
  },
};
