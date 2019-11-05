import { nodeOrNew, register, wrapWithAttrCheck } from '../utils/adopter.js'
import { registerMethods } from '../utils/methods.js'
import Container from './Container.js'
import baseFind from '../modules/core/selector.js'

export default class ClipPath extends Container {
  constructor (node) {
    super(nodeOrNew('clipPath', node), node)
  }

  // Unclip all clipped elements and remove itself
  remove () {
    // unclip all targets
    this.targets().forEach(function (el) {
      el.unclip()
    })

    // remove clipPath from parent
    return super.remove()
  }

  targets () {
    return baseFind('svg [clip-path*="' + this.id() + '"]')
  }
}

registerMethods({
  Container: {
    // Create clipping element
    clip: wrapWithAttrCheck(function () {
      return this.defs().put(new ClipPath())
    })
  },
  Element: {
    // Distribute clipPath to svg element
    clipWith (element) {
      // use given clip or create a new one
      const clipper = element instanceof ClipPath
        ? element
        : this.parent().clip().add(element)

      // apply mask
      var base = ''
      var baseUrl
      if (document && document.querySelector
        && window && window.location && window.location.href
        && (baseUrl = (document.querySelector('base') || {}).href)
        && baseUrl !== window.location.href.split('?')[0]) {
        base = window.location.pathname
      }
      return this.attr('clip-path', 'url("' + base + '#' + clipper.id() + '")')
    },

    // Unclip element
    unclip () {
      return this.attr('clip-path', null)
    },

    clipper () {
      return this.reference('clip-path')
    }
  }
})

register(ClipPath, 'ClipPath')
