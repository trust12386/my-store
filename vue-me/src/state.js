import Dep from "./observe/dep"
import { observe } from "./observe/index"
import Watcher from "./observe/watcher"

export function initState(vm) {
  const options = vm.$options
  if(options.data) {
    initData(vm)
  }
  if(options.computed) {
    initComputed(vm)
  }
  if(options.watch){
    initWatch(vm)
  }
}

function initWatch(vm) {
  let watch = vm.$options.watch
  
  for(let key in watch) {
    const handler = watch[key] // 字符串 数组 函数

    if(Array.isArray(handler)) {
      for(let i=0;i<handler.length;i++){
        createWatcher(vm,key,handler[i])
      }
    }else {
      createWatcher(vm,key,handler)
    }
  }
}

function createWatcher(vm,key,handler) {
  if(typeof handler === 'string'){
    handler = vm[handler]
  }
  return vm.$watch(key,handler)
}

function proxy (vm,target,key) {
  Object.defineProperty(vm,key,{
    get() {
      return vm[target][key]
    },
    set(newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  observe(data)
  Object.keys(data).forEach(key => proxy(vm,'_data',key))
}

function initComputed(vm) {
  const computed = vm.$options.computed
  const watchers = vm._computedWathers = {} //将计算属性watcher保存到vm上
  for(let key in computed) {
    let userDef = computed[key]
    let fn = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm,fn,{lazy:true})
    defineComputed(vm,key,userDef)
  }
}

function defineComputed(target,key,userDef){
  const getter = typeof userDef === 'function' ? userDef : userDef.get
  const setter = userDef.set || (() => {})

  Object.defineProperty(target,key,{
    get:createComputedGetter(key),
    set:setter
  })
}

function createComputedGetter(key){
  return function() {
    const watcher = this._computedWathers[key]
    if(watcher.dirty) {
      watcher.evaluate()
    }
    if(Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}