var popup = function () {

  this.id = 'popup' // The name of the div that will be created

  this.open = function (modal, data) {

    var data = (data) ? data : ''

    if (data) {
      data.unshift(modal)
    } else {
      data = [modal]
    }

    dom.create('div', this.id)
    dom.show(this.id)
    this.create()

    // This is temporary
    if (dom.exists('menu')) {
      dom.hide('menu')
    }
    //

    xhr('modal', data, 'xhrModal', [
      ['content', 'xhrModal']
    ])
    return false
  }

  this.create = function () {
    dom.content(this.id, '<div id="popup-dialog" onclick="modal.close()"><div id="mypopup"><div id="popup-content" class="loaderb"><div class="m" onclick="window.event.stopPropagation()"><a onclick="modal.close()" class="close">Ã—</a><span id="xhrModal"></span></div></div></div></div>')
  }

  this.close = function () {
    dom.hide(this.id)
    dom.remove(this.id)
  }
}

var popup = new popup(),
  modal = popup