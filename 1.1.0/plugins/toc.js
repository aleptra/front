app.plugin.toc = {
  __autoload: function (options) {
    this.plugin = options.name + '--'
  },

  set: function (object) {
    var target = object && object.exec ? object.exec.element : object
    if (!target || target.nodeType !== 1) return

    var generated = target.querySelectorAll('a[data-toc-generated="true"]')
    for (var g = 0; g < generated.length; g++) {
      generated[g].parentNode.removeChild(generated[g])
    }

    var root = this._findRoot(target)
    if (!root) return

    var headings = root.querySelectorAll('h1,h2,h3,h4,h5,h6'),
      entries = [],
      owners = this._getIdOwners(),
      baseLevel = 0

    for (var i = 0; i < headings.length; i++) {
      var heading = headings[i]
      if (heading.hasAttribute('toc--exclude')) continue
      if (target !== root && target.contains(heading)) continue

      var text = (heading.textContent || '').replace(/\s+/g, ' ').trim()
      if (!text) continue

      var level = parseInt(heading.tagName.substring(1), 10)
      if (!baseLevel) baseLevel = level

      this._assignId(heading, text, i + 1, owners)
      entries.push({ heading: heading, text: text, level: level })
    }

    if (!entries.length) return

    var links = this._buildLinks(entries)
    target.appendChild(links)
  },

  exclude: function () {
    // Marker action: set() omits headings with toc--exclude.
  },

  _findRoot: function (target) {
    for (var current = target; current; current = current.parentNode) {
      if (current.nodeType === 1 && /^(ARTICLE|MAIN)$/i.test(current.tagName)) return current
    }

    return target.parentNode && target.parentNode.nodeType === 1 ? target.parentNode : target
  },

  _getIdOwners: function () {
    var owners = {}, elements = document.querySelectorAll('[id]')
    for (var i = 0; i < elements.length; i++) {
      var id = elements[i].getAttribute('id')
      if (id && !owners[id]) owners[id] = elements[i]
    }
    return owners
  },

  _assignId: function (heading, text, index, owners) {
    var preferred = heading.getAttribute('id'),
      base = preferred || this._slug(text) || 'section-' + index,
      id = base,
      suffix = 2

    while (owners[id] && owners[id] !== heading) id = base + '-' + suffix++

    heading.setAttribute('id', id)
    owners[id] = heading
  },

  _slug: function (text) {
    return text.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  },

  _buildLinks: function (entries) {
    var fragment = document.createDocumentFragment()

    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i],
        link = document.createElement('a')

      link.setAttribute('href', '#' + entry.heading.id)
      link.setAttribute('data-toc-generated', 'true')
      link.setAttribute('data-toc-level', entry.heading.tagName.toLowerCase())
      link.textContent = entry.text
      fragment.appendChild(link)
    }

    return fragment
  }
}
