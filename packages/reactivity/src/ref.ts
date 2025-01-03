import { activeEffect, trackEffect, triggerEffects } from "./effect";
import { toReactive } from "./reactive";
import { createDep } from "./reactiveEffect";

export function ref(value) {
  return createRef(value);
}
function createRef(rawValue) {
  return new RefImpl(rawValue);
}

class RefImpl {
  public __v_isRef = true; // 唯一标识
  public _value; // 值
  public dep;
  constructor(public rawValue) {
    this._value = toReactive(rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newValue) {
    if (newValue !== this.rawValue) {
      // 更新值
      this.rawValue = newValue;
      this._value = newValue;
      triggerRefValue(this);
    }
  }
}
function trackRefValue(ref) {
  if (activeEffect) {
    trackEffect(
      activeEffect,
      (ref.dep = createDep(() => (ref.dep = undefined), "undefined"))
    );
  }
}
function triggerRefValue(ref) {
  const dep = ref.dep;
  if (dep) {
    triggerEffects(dep);
  }
}
