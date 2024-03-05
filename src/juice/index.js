export function juice() {
  return {
    name: "juice",
    config: () => ({
      esbuild: {
        jsxFactory: "create",
        jsxFragment: "Fragment",
        jsxInject: `import { create, Fragment } from '@/juice'`,
      },
    }),
  };
}

export function create(element, props, ...children) {
  children = children.flat();
  if (typeof element === "string") return createIntrinsic(element, props, children);
  else return createComponent(element, props, children);
}

function createIntrinsic(tag, attributes, children) {
  const element = document.createElement(tag);
  Object.entries(attributes ?? {}).forEach(([key, value]) => {
    if (key.startsWith("on")) element.addEventListener(key.substring(2), value);
    else element.setAttribute(key, value);
  });
  children.forEach((child) => element.append(child instanceof Ref ? createRefNode(child) : child));
  return element;
}

function createRefNode(ref) {
  const createNode = (value) => {
    if (value === false) return document.createTextNode("");
    if (["string", "number", "boolean"].includes(typeof value)) return document.createTextNode(value);
    else return value;
  };
  let node = createNode(ref.value);
  ref.watch((value) => {
    const newNode = createNode(value);
    node.replaceWith(newNode);
    node = newNode;
  });
  return node;
}

function createComponent(component, props, children) {
  return component({ ...props, children });
}

export function Fragment(props) {
  const fragment = document.createDocumentFragment();
  props.children.forEach((child) => fragment.append(child));
  return fragment;
}

let activeEffect;

export const ref = (initialValue) => new Ref(initialValue);
class Ref {
  constructor(initialValue) {
    this._value = initialValue;
    this.observers = new Set();
    this.effects = new Set();
  }
  get value() {
    if (activeEffect) this.effects.add(activeEffect);
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._value;
    this._value = newValue;
    [...this.observers].forEach((ob) => ob(newValue, oldValue));
    [...this.effects].forEach((effect) => effect());
  }
  watch(cb) {
    this.observers.add(cb);
  }
}

export function computed(getter) {
  const computedRef = ref();
  const effect = () => {
    activeEffect = effect;
    computedRef.value = getter();
    activeEffect = null;
  };
  effect();
  return computedRef;
}
