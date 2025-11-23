'use strict'

app.plugin.share = {
  open: function (el) {
    this._share(el)
  },

  _share: function (el) {
    el = app.element.resolveCall(el)
    var platform = el.getAttribute('share--platform')
    var title = el.getAttribute('share--title') || document.title
    var urlAttr = el.getAttribute('share--url') || window.location.href
    var url = urlAttr[0] === '/' ? window.origin + urlAttr.slice(0) : urlAttr

    var shareUrl = ''
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`
        break
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(title)}`
        break
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title)}%20${url}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${encodeURIComponent(title)}`
        break
      default:
        console.warn('Unsupported share platform:', platform)
        return
    }

    window.open(shareUrl, '_blank')
  }
}