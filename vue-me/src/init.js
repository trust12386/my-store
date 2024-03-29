import { compileToFunction } from "./compiler/index"
import { callHook, mountComponent } from "./liftcycle"
import { initState } from "./state"
import { mergeOptions } from "./utils"


export function initMixin (Vue) {
  Vue.prototype._init = function(options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options,options)
    initState(vm)

    callHook(vm,'created')

    if(options.el) {
      vm.$mount(options.el)
    }
  }

  Vue.prototype.$mount = function(el) {
    const vm = this
    el = document.querySelector(el)
    let ops = vm.$options
    if(!ops.render) {
      let template
      if(!ops.template && el) {
        template = el.outerHTML
      } else {
        if(el) {
          template = ops.template
        }
      }
      if(template) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }
    mountComponent(vm,el)
  }
}

