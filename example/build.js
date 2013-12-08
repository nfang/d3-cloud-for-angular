
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module._resolving && !module.exports) {
    var mod = {};
    mod.exports = {};
    mod.client = mod.component = true;
    module._resolving = true;
    module.call(this, mod.exports, require.relative(resolved), mod);
    delete module._resolving;
    module.exports = mod.exports;
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("mbostock-d3/d3.js", Function("exports, require, module",
"d3 = function() {\n\
  var d3 = {\n\
    version: \"3.3.11\"\n\
  };\n\
  if (!Date.now) Date.now = function() {\n\
    return +new Date();\n\
  };\n\
  var d3_arraySlice = [].slice, d3_array = function(list) {\n\
    return d3_arraySlice.call(list);\n\
  };\n\
  var d3_document = document, d3_documentElement = d3_document.documentElement, d3_window = window;\n\
  try {\n\
    d3_array(d3_documentElement.childNodes)[0].nodeType;\n\
  } catch (e) {\n\
    d3_array = function(list) {\n\
      var i = list.length, array = new Array(i);\n\
      while (i--) array[i] = list[i];\n\
      return array;\n\
    };\n\
  }\n\
  try {\n\
    d3_document.createElement(\"div\").style.setProperty(\"opacity\", 0, \"\");\n\
  } catch (error) {\n\
    var d3_element_prototype = d3_window.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = d3_window.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;\n\
    d3_element_prototype.setAttribute = function(name, value) {\n\
      d3_element_setAttribute.call(this, name, value + \"\");\n\
    };\n\
    d3_element_prototype.setAttributeNS = function(space, local, value) {\n\
      d3_element_setAttributeNS.call(this, space, local, value + \"\");\n\
    };\n\
    d3_style_prototype.setProperty = function(name, value, priority) {\n\
      d3_style_setProperty.call(this, name, value + \"\", priority);\n\
    };\n\
  }\n\
  d3.ascending = function(a, b) {\n\
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;\n\
  };\n\
  d3.descending = function(a, b) {\n\
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;\n\
  };\n\
  d3.min = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.max = function(array, f) {\n\
    var i = -1, n = array.length, a, b;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = array[i]) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;\n\
    } else {\n\
      while (++i < n && !((a = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;\n\
    }\n\
    return a;\n\
  };\n\
  d3.extent = function(array, f) {\n\
    var i = -1, n = array.length, a, b, c;\n\
    if (arguments.length === 1) {\n\
      while (++i < n && !((a = c = array[i]) != null && a <= a)) a = c = undefined;\n\
      while (++i < n) if ((b = array[i]) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    } else {\n\
      while (++i < n && !((a = c = f.call(array, array[i], i)) != null && a <= a)) a = undefined;\n\
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {\n\
        if (a > b) a = b;\n\
        if (c < b) c = b;\n\
      }\n\
    }\n\
    return [ a, c ];\n\
  };\n\
  d3.sum = function(array, f) {\n\
    var s = 0, n = array.length, a, i = -1;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (!isNaN(a = +array[i])) s += a;\n\
    } else {\n\
      while (++i < n) if (!isNaN(a = +f.call(array, array[i], i))) s += a;\n\
    }\n\
    return s;\n\
  };\n\
  function d3_number(x) {\n\
    return x != null && !isNaN(x);\n\
  }\n\
  d3.mean = function(array, f) {\n\
    var n = array.length, a, m = 0, i = -1, j = 0;\n\
    if (arguments.length === 1) {\n\
      while (++i < n) if (d3_number(a = array[i])) m += (a - m) / ++j;\n\
    } else {\n\
      while (++i < n) if (d3_number(a = f.call(array, array[i], i))) m += (a - m) / ++j;\n\
    }\n\
    return j ? m : undefined;\n\
  };\n\
  d3.quantile = function(values, p) {\n\
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;\n\
    return e ? v + e * (values[h] - v) : v;\n\
  };\n\
  d3.median = function(array, f) {\n\
    if (arguments.length > 1) array = array.map(f);\n\
    array = array.filter(d3_number);\n\
    return array.length ? d3.quantile(array.sort(d3.ascending), .5) : undefined;\n\
  };\n\
  d3.bisector = function(f) {\n\
    return {\n\
      left: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (f.call(a, a[mid], mid) < x) lo = mid + 1; else hi = mid;\n\
        }\n\
        return lo;\n\
      },\n\
      right: function(a, x, lo, hi) {\n\
        if (arguments.length < 3) lo = 0;\n\
        if (arguments.length < 4) hi = a.length;\n\
        while (lo < hi) {\n\
          var mid = lo + hi >>> 1;\n\
          if (x < f.call(a, a[mid], mid)) hi = mid; else lo = mid + 1;\n\
        }\n\
        return lo;\n\
      }\n\
    };\n\
  };\n\
  var d3_bisector = d3.bisector(function(d) {\n\
    return d;\n\
  });\n\
  d3.bisectLeft = d3_bisector.left;\n\
  d3.bisect = d3.bisectRight = d3_bisector.right;\n\
  d3.shuffle = function(array) {\n\
    var m = array.length, t, i;\n\
    while (m) {\n\
      i = Math.random() * m-- | 0;\n\
      t = array[m], array[m] = array[i], array[i] = t;\n\
    }\n\
    return array;\n\
  };\n\
  d3.permute = function(array, indexes) {\n\
    var i = indexes.length, permutes = new Array(i);\n\
    while (i--) permutes[i] = array[indexes[i]];\n\
    return permutes;\n\
  };\n\
  d3.pairs = function(array) {\n\
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);\n\
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];\n\
    return pairs;\n\
  };\n\
  d3.zip = function() {\n\
    if (!(n = arguments.length)) return [];\n\
    for (var i = -1, m = d3.min(arguments, d3_zipLength), zips = new Array(m); ++i < m; ) {\n\
      for (var j = -1, n, zip = zips[i] = new Array(n); ++j < n; ) {\n\
        zip[j] = arguments[j][i];\n\
      }\n\
    }\n\
    return zips;\n\
  };\n\
  function d3_zipLength(d) {\n\
    return d.length;\n\
  }\n\
  d3.transpose = function(matrix) {\n\
    return d3.zip.apply(d3, matrix);\n\
  };\n\
  d3.keys = function(map) {\n\
    var keys = [];\n\
    for (var key in map) keys.push(key);\n\
    return keys;\n\
  };\n\
  d3.values = function(map) {\n\
    var values = [];\n\
    for (var key in map) values.push(map[key]);\n\
    return values;\n\
  };\n\
  d3.entries = function(map) {\n\
    var entries = [];\n\
    for (var key in map) entries.push({\n\
      key: key,\n\
      value: map[key]\n\
    });\n\
    return entries;\n\
  };\n\
  d3.merge = function(arrays) {\n\
    var n = arrays.length, m, i = -1, j = 0, merged, array;\n\
    while (++i < n) j += arrays[i].length;\n\
    merged = new Array(j);\n\
    while (--n >= 0) {\n\
      array = arrays[n];\n\
      m = array.length;\n\
      while (--m >= 0) {\n\
        merged[--j] = array[m];\n\
      }\n\
    }\n\
    return merged;\n\
  };\n\
  var abs = Math.abs;\n\
  d3.range = function(start, stop, step) {\n\
    if (arguments.length < 3) {\n\
      step = 1;\n\
      if (arguments.length < 2) {\n\
        stop = start;\n\
        start = 0;\n\
      }\n\
    }\n\
    if ((stop - start) / step === Infinity) throw new Error(\"infinite range\");\n\
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;\n\
    start *= k, stop *= k, step *= k;\n\
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);\n\
    return range;\n\
  };\n\
  function d3_range_integerScale(x) {\n\
    var k = 1;\n\
    while (x * k % 1) k *= 10;\n\
    return k;\n\
  }\n\
  function d3_class(ctor, properties) {\n\
    try {\n\
      for (var key in properties) {\n\
        Object.defineProperty(ctor.prototype, key, {\n\
          value: properties[key],\n\
          enumerable: false\n\
        });\n\
      }\n\
    } catch (e) {\n\
      ctor.prototype = properties;\n\
    }\n\
  }\n\
  d3.map = function(object) {\n\
    var map = new d3_Map();\n\
    if (object instanceof d3_Map) object.forEach(function(key, value) {\n\
      map.set(key, value);\n\
    }); else for (var key in object) map.set(key, object[key]);\n\
    return map;\n\
  };\n\
  function d3_Map() {}\n\
  d3_class(d3_Map, {\n\
    has: function(key) {\n\
      return d3_map_prefix + key in this;\n\
    },\n\
    get: function(key) {\n\
      return this[d3_map_prefix + key];\n\
    },\n\
    set: function(key, value) {\n\
      return this[d3_map_prefix + key] = value;\n\
    },\n\
    remove: function(key) {\n\
      key = d3_map_prefix + key;\n\
      return key in this && delete this[key];\n\
    },\n\
    keys: function() {\n\
      var keys = [];\n\
      this.forEach(function(key) {\n\
        keys.push(key);\n\
      });\n\
      return keys;\n\
    },\n\
    values: function() {\n\
      var values = [];\n\
      this.forEach(function(key, value) {\n\
        values.push(value);\n\
      });\n\
      return values;\n\
    },\n\
    entries: function() {\n\
      var entries = [];\n\
      this.forEach(function(key, value) {\n\
        entries.push({\n\
          key: key,\n\
          value: value\n\
        });\n\
      });\n\
      return entries;\n\
    },\n\
    forEach: function(f) {\n\
      for (var key in this) {\n\
        if (key.charCodeAt(0) === d3_map_prefixCode) {\n\
          f.call(this, key.substring(1), this[key]);\n\
        }\n\
      }\n\
    }\n\
  });\n\
  var d3_map_prefix = \"\\x00\", d3_map_prefixCode = d3_map_prefix.charCodeAt(0);\n\
  d3.nest = function() {\n\
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;\n\
    function map(mapType, array, depth) {\n\
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;\n\
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;\n\
      while (++i < n) {\n\
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {\n\
          values.push(object);\n\
        } else {\n\
          valuesByKey.set(keyValue, [ object ]);\n\
        }\n\
      }\n\
      if (mapType) {\n\
        object = mapType();\n\
        setter = function(keyValue, values) {\n\
          object.set(keyValue, map(mapType, values, depth));\n\
        };\n\
      } else {\n\
        object = {};\n\
        setter = function(keyValue, values) {\n\
          object[keyValue] = map(mapType, values, depth);\n\
        };\n\
      }\n\
      valuesByKey.forEach(setter);\n\
      return object;\n\
    }\n\
    function entries(map, depth) {\n\
      if (depth >= keys.length) return map;\n\
      var array = [], sortKey = sortKeys[depth++];\n\
      map.forEach(function(key, keyMap) {\n\
        array.push({\n\
          key: key,\n\
          values: entries(keyMap, depth)\n\
        });\n\
      });\n\
      return sortKey ? array.sort(function(a, b) {\n\
        return sortKey(a.key, b.key);\n\
      }) : array;\n\
    }\n\
    nest.map = function(array, mapType) {\n\
      return map(mapType, array, 0);\n\
    };\n\
    nest.entries = function(array) {\n\
      return entries(map(d3.map, array, 0), 0);\n\
    };\n\
    nest.key = function(d) {\n\
      keys.push(d);\n\
      return nest;\n\
    };\n\
    nest.sortKeys = function(order) {\n\
      sortKeys[keys.length - 1] = order;\n\
      return nest;\n\
    };\n\
    nest.sortValues = function(order) {\n\
      sortValues = order;\n\
      return nest;\n\
    };\n\
    nest.rollup = function(f) {\n\
      rollup = f;\n\
      return nest;\n\
    };\n\
    return nest;\n\
  };\n\
  d3.set = function(array) {\n\
    var set = new d3_Set();\n\
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);\n\
    return set;\n\
  };\n\
  function d3_Set() {}\n\
  d3_class(d3_Set, {\n\
    has: function(value) {\n\
      return d3_map_prefix + value in this;\n\
    },\n\
    add: function(value) {\n\
      this[d3_map_prefix + value] = true;\n\
      return value;\n\
    },\n\
    remove: function(value) {\n\
      value = d3_map_prefix + value;\n\
      return value in this && delete this[value];\n\
    },\n\
    values: function() {\n\
      var values = [];\n\
      this.forEach(function(value) {\n\
        values.push(value);\n\
      });\n\
      return values;\n\
    },\n\
    forEach: function(f) {\n\
      for (var value in this) {\n\
        if (value.charCodeAt(0) === d3_map_prefixCode) {\n\
          f.call(this, value.substring(1));\n\
        }\n\
      }\n\
    }\n\
  });\n\
  d3.behavior = {};\n\
  d3.rebind = function(target, source) {\n\
    var i = 1, n = arguments.length, method;\n\
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);\n\
    return target;\n\
  };\n\
  function d3_rebind(target, source, method) {\n\
    return function() {\n\
      var value = method.apply(source, arguments);\n\
      return value === source ? target : value;\n\
    };\n\
  }\n\
  function d3_vendorSymbol(object, name) {\n\
    if (name in object) return name;\n\
    name = name.charAt(0).toUpperCase() + name.substring(1);\n\
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {\n\
      var prefixName = d3_vendorPrefixes[i] + name;\n\
      if (prefixName in object) return prefixName;\n\
    }\n\
  }\n\
  var d3_vendorPrefixes = [ \"webkit\", \"ms\", \"moz\", \"Moz\", \"o\", \"O\" ];\n\
  function d3_noop() {}\n\
  d3.dispatch = function() {\n\
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    return dispatch;\n\
  };\n\
  function d3_dispatch() {}\n\
  d3_dispatch.prototype.on = function(type, listener) {\n\
    var i = type.indexOf(\".\"), name = \"\";\n\
    if (i >= 0) {\n\
      name = type.substring(i + 1);\n\
      type = type.substring(0, i);\n\
    }\n\
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);\n\
    if (arguments.length === 2) {\n\
      if (listener == null) for (type in this) {\n\
        if (this.hasOwnProperty(type)) this[type].on(name, null);\n\
      }\n\
      return this;\n\
    }\n\
  };\n\
  function d3_dispatch_event(dispatch) {\n\
    var listeners = [], listenerByName = new d3_Map();\n\
    function event() {\n\
      var z = listeners, i = -1, n = z.length, l;\n\
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);\n\
      return dispatch;\n\
    }\n\
    event.on = function(name, listener) {\n\
      var l = listenerByName.get(name), i;\n\
      if (arguments.length < 2) return l && l.on;\n\
      if (l) {\n\
        l.on = null;\n\
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));\n\
        listenerByName.remove(name);\n\
      }\n\
      if (listener) listeners.push(listenerByName.set(name, {\n\
        on: listener\n\
      }));\n\
      return dispatch;\n\
    };\n\
    return event;\n\
  }\n\
  d3.event = null;\n\
  function d3_eventPreventDefault() {\n\
    d3.event.preventDefault();\n\
  }\n\
  function d3_eventSource() {\n\
    var e = d3.event, s;\n\
    while (s = e.sourceEvent) e = s;\n\
    return e;\n\
  }\n\
  function d3_eventDispatch(target) {\n\
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;\n\
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);\n\
    dispatch.of = function(thiz, argumentz) {\n\
      return function(e1) {\n\
        try {\n\
          var e0 = e1.sourceEvent = d3.event;\n\
          e1.target = target;\n\
          d3.event = e1;\n\
          dispatch[e1.type].apply(thiz, argumentz);\n\
        } finally {\n\
          d3.event = e0;\n\
        }\n\
      };\n\
    };\n\
    return dispatch;\n\
  }\n\
  d3.requote = function(s) {\n\
    return s.replace(d3_requote_re, \"\\\\$&\");\n\
  };\n\
  var d3_requote_re = /[\\\\\\^\\$\\*\\+\\?\\|\\[\\]\\(\\)\\.\\{\\}]/g;\n\
  var d3_subclass = {}.__proto__ ? function(object, prototype) {\n\
    object.__proto__ = prototype;\n\
  } : function(object, prototype) {\n\
    for (var property in prototype) object[property] = prototype[property];\n\
  };\n\
  function d3_selection(groups) {\n\
    d3_subclass(groups, d3_selectionPrototype);\n\
    return groups;\n\
  }\n\
  var d3_select = function(s, n) {\n\
    return n.querySelector(s);\n\
  }, d3_selectAll = function(s, n) {\n\
    return n.querySelectorAll(s);\n\
  }, d3_selectMatcher = d3_documentElement[d3_vendorSymbol(d3_documentElement, \"matchesSelector\")], d3_selectMatches = function(n, s) {\n\
    return d3_selectMatcher.call(n, s);\n\
  };\n\
  if (typeof Sizzle === \"function\") {\n\
    d3_select = function(s, n) {\n\
      return Sizzle(s, n)[0] || null;\n\
    };\n\
    d3_selectAll = function(s, n) {\n\
      return Sizzle.uniqueSort(Sizzle(s, n));\n\
    };\n\
    d3_selectMatches = Sizzle.matchesSelector;\n\
  }\n\
  d3.selection = function() {\n\
    return d3_selectionRoot;\n\
  };\n\
  var d3_selectionPrototype = d3.selection.prototype = [];\n\
  d3_selectionPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, group, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));\n\
          if (subnode && \"__data__\" in node) subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selector(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_select(selector, this);\n\
    };\n\
  }\n\
  d3_selectionPrototype.selectAll = function(selector) {\n\
    var subgroups = [], subgroup, node;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));\n\
          subgroup.parentNode = node;\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_selectorAll(selector) {\n\
    return typeof selector === \"function\" ? selector : function() {\n\
      return d3_selectAll(selector, this);\n\
    };\n\
  }\n\
  var d3_nsPrefix = {\n\
    svg: \"http://www.w3.org/2000/svg\",\n\
    xhtml: \"http://www.w3.org/1999/xhtml\",\n\
    xlink: \"http://www.w3.org/1999/xlink\",\n\
    xml: \"http://www.w3.org/XML/1998/namespace\",\n\
    xmlns: \"http://www.w3.org/2000/xmlns/\"\n\
  };\n\
  d3.ns = {\n\
    prefix: d3_nsPrefix,\n\
    qualify: function(name) {\n\
      var i = name.indexOf(\":\"), prefix = name;\n\
      if (i >= 0) {\n\
        prefix = name.substring(0, i);\n\
        name = name.substring(i + 1);\n\
      }\n\
      return d3_nsPrefix.hasOwnProperty(prefix) ? {\n\
        space: d3_nsPrefix[prefix],\n\
        local: name\n\
      } : name;\n\
    }\n\
  };\n\
  d3_selectionPrototype.attr = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node();\n\
        name = d3.ns.qualify(name);\n\
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);\n\
      }\n\
      for (value in name) this.each(d3_selection_attr(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_attr(name, value));\n\
  };\n\
  function d3_selection_attr(name, value) {\n\
    name = d3.ns.qualify(name);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrConstant() {\n\
      this.setAttribute(name, value);\n\
    }\n\
    function attrConstantNS() {\n\
      this.setAttributeNS(name.space, name.local, value);\n\
    }\n\
    function attrFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);\n\
    }\n\
    function attrFunctionNS() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);\n\
    }\n\
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === \"function\" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;\n\
  }\n\
  function d3_collapse(s) {\n\
    return s.trim().replace(/\\s+/g, \" \");\n\
  }\n\
  d3_selectionPrototype.classed = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") {\n\
        var node = this.node(), n = (name = name.trim().split(/^|\\s+/g)).length, i = -1;\n\
        if (value = node.classList) {\n\
          while (++i < n) if (!value.contains(name[i])) return false;\n\
        } else {\n\
          value = node.getAttribute(\"class\");\n\
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;\n\
        }\n\
        return true;\n\
      }\n\
      for (value in name) this.each(d3_selection_classed(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_classed(name, value));\n\
  };\n\
  function d3_selection_classedRe(name) {\n\
    return new RegExp(\"(?:^|\\\\s+)\" + d3.requote(name) + \"(?:\\\\s+|$)\", \"g\");\n\
  }\n\
  function d3_selection_classed(name, value) {\n\
    name = name.trim().split(/\\s+/).map(d3_selection_classedName);\n\
    var n = name.length;\n\
    function classedConstant() {\n\
      var i = -1;\n\
      while (++i < n) name[i](this, value);\n\
    }\n\
    function classedFunction() {\n\
      var i = -1, x = value.apply(this, arguments);\n\
      while (++i < n) name[i](this, x);\n\
    }\n\
    return typeof value === \"function\" ? classedFunction : classedConstant;\n\
  }\n\
  function d3_selection_classedName(name) {\n\
    var re = d3_selection_classedRe(name);\n\
    return function(node, value) {\n\
      if (c = node.classList) return value ? c.add(name) : c.remove(name);\n\
      var c = node.getAttribute(\"class\") || \"\";\n\
      if (value) {\n\
        re.lastIndex = 0;\n\
        if (!re.test(c)) node.setAttribute(\"class\", d3_collapse(c + \" \" + name));\n\
      } else {\n\
        node.setAttribute(\"class\", d3_collapse(c.replace(re, \" \")));\n\
      }\n\
    };\n\
  }\n\
  d3_selectionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));\n\
        return this;\n\
      }\n\
      if (n < 2) return d3_window.getComputedStyle(this.node(), null).getPropertyValue(name);\n\
      priority = \"\";\n\
    }\n\
    return this.each(d3_selection_style(name, value, priority));\n\
  };\n\
  function d3_selection_style(name, value, priority) {\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleConstant() {\n\
      this.style.setProperty(name, value, priority);\n\
    }\n\
    function styleFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);\n\
    }\n\
    return value == null ? styleNull : typeof value === \"function\" ? styleFunction : styleConstant;\n\
  }\n\
  d3_selectionPrototype.property = function(name, value) {\n\
    if (arguments.length < 2) {\n\
      if (typeof name === \"string\") return this.node()[name];\n\
      for (value in name) this.each(d3_selection_property(value, name[value]));\n\
      return this;\n\
    }\n\
    return this.each(d3_selection_property(name, value));\n\
  };\n\
  function d3_selection_property(name, value) {\n\
    function propertyNull() {\n\
      delete this[name];\n\
    }\n\
    function propertyConstant() {\n\
      this[name] = value;\n\
    }\n\
    function propertyFunction() {\n\
      var x = value.apply(this, arguments);\n\
      if (x == null) delete this[name]; else this[name] = x;\n\
    }\n\
    return value == null ? propertyNull : typeof value === \"function\" ? propertyFunction : propertyConstant;\n\
  }\n\
  d3_selectionPrototype.text = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.textContent = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.textContent = \"\";\n\
    } : function() {\n\
      this.textContent = value;\n\
    }) : this.node().textContent;\n\
  };\n\
  d3_selectionPrototype.html = function(value) {\n\
    return arguments.length ? this.each(typeof value === \"function\" ? function() {\n\
      var v = value.apply(this, arguments);\n\
      this.innerHTML = v == null ? \"\" : v;\n\
    } : value == null ? function() {\n\
      this.innerHTML = \"\";\n\
    } : function() {\n\
      this.innerHTML = value;\n\
    }) : this.node().innerHTML;\n\
  };\n\
  d3_selectionPrototype.append = function(name) {\n\
    name = d3_selection_creator(name);\n\
    return this.select(function() {\n\
      return this.appendChild(name.apply(this, arguments));\n\
    });\n\
  };\n\
  function d3_selection_creator(name) {\n\
    return typeof name === \"function\" ? name : (name = d3.ns.qualify(name)).local ? function() {\n\
      return this.ownerDocument.createElementNS(name.space, name.local);\n\
    } : function() {\n\
      return this.ownerDocument.createElementNS(this.namespaceURI, name);\n\
    };\n\
  }\n\
  d3_selectionPrototype.insert = function(name, before) {\n\
    name = d3_selection_creator(name);\n\
    before = d3_selection_selector(before);\n\
    return this.select(function() {\n\
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);\n\
    });\n\
  };\n\
  d3_selectionPrototype.remove = function() {\n\
    return this.each(function() {\n\
      var parent = this.parentNode;\n\
      if (parent) parent.removeChild(this);\n\
    });\n\
  };\n\
  d3_selectionPrototype.data = function(value, key) {\n\
    var i = -1, n = this.length, group, node;\n\
    if (!arguments.length) {\n\
      value = new Array(n = (group = this[0]).length);\n\
      while (++i < n) {\n\
        if (node = group[i]) {\n\
          value[i] = node.__data__;\n\
        }\n\
      }\n\
      return value;\n\
    }\n\
    function bind(group, groupData) {\n\
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;\n\
      if (key) {\n\
        var nodeByKeyValue = new d3_Map(), dataByKeyValue = new d3_Map(), keyValues = [], keyValue;\n\
        for (i = -1; ++i < n; ) {\n\
          keyValue = key.call(node = group[i], node.__data__, i);\n\
          if (nodeByKeyValue.has(keyValue)) {\n\
            exitNodes[i] = node;\n\
          } else {\n\
            nodeByKeyValue.set(keyValue, node);\n\
          }\n\
          keyValues.push(keyValue);\n\
        }\n\
        for (i = -1; ++i < m; ) {\n\
          keyValue = key.call(groupData, nodeData = groupData[i], i);\n\
          if (node = nodeByKeyValue.get(keyValue)) {\n\
            updateNodes[i] = node;\n\
            node.__data__ = nodeData;\n\
          } else if (!dataByKeyValue.has(keyValue)) {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
          dataByKeyValue.set(keyValue, nodeData);\n\
          nodeByKeyValue.remove(keyValue);\n\
        }\n\
        for (i = -1; ++i < n; ) {\n\
          if (nodeByKeyValue.has(keyValues[i])) {\n\
            exitNodes[i] = group[i];\n\
          }\n\
        }\n\
      } else {\n\
        for (i = -1; ++i < n0; ) {\n\
          node = group[i];\n\
          nodeData = groupData[i];\n\
          if (node) {\n\
            node.__data__ = nodeData;\n\
            updateNodes[i] = node;\n\
          } else {\n\
            enterNodes[i] = d3_selection_dataNode(nodeData);\n\
          }\n\
        }\n\
        for (;i < m; ++i) {\n\
          enterNodes[i] = d3_selection_dataNode(groupData[i]);\n\
        }\n\
        for (;i < n; ++i) {\n\
          exitNodes[i] = group[i];\n\
        }\n\
      }\n\
      enterNodes.update = updateNodes;\n\
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;\n\
      enter.push(enterNodes);\n\
      update.push(updateNodes);\n\
      exit.push(exitNodes);\n\
    }\n\
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);\n\
    if (typeof value === \"function\") {\n\
      while (++i < n) {\n\
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));\n\
      }\n\
    } else {\n\
      while (++i < n) {\n\
        bind(group = this[i], value);\n\
      }\n\
    }\n\
    update.enter = function() {\n\
      return enter;\n\
    };\n\
    update.exit = function() {\n\
      return exit;\n\
    };\n\
    return update;\n\
  };\n\
  function d3_selection_dataNode(data) {\n\
    return {\n\
      __data__: data\n\
    };\n\
  }\n\
  d3_selectionPrototype.datum = function(value) {\n\
    return arguments.length ? this.property(\"__data__\", value) : this.property(\"__data__\");\n\
  };\n\
  d3_selectionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = (group = this[j]).parentNode;\n\
      for (var i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  function d3_selection_filter(selector) {\n\
    return function() {\n\
      return d3_selectMatches(this, selector);\n\
    };\n\
  }\n\
  d3_selectionPrototype.order = function() {\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {\n\
        if (node = group[i]) {\n\
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);\n\
          next = node;\n\
        }\n\
      }\n\
    }\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.sort = function(comparator) {\n\
    comparator = d3_selection_sortComparator.apply(this, arguments);\n\
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);\n\
    return this.order();\n\
  };\n\
  function d3_selection_sortComparator(comparator) {\n\
    if (!arguments.length) comparator = d3.ascending;\n\
    return function(a, b) {\n\
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;\n\
    };\n\
  }\n\
  d3_selectionPrototype.each = function(callback) {\n\
    return d3_selection_each(this, function(node, i, j) {\n\
      callback.call(node, node.__data__, i, j);\n\
    });\n\
  };\n\
  function d3_selection_each(groups, callback) {\n\
    for (var j = 0, m = groups.length; j < m; j++) {\n\
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {\n\
        if (node = group[i]) callback(node, i, j);\n\
      }\n\
    }\n\
    return groups;\n\
  }\n\
  d3_selectionPrototype.call = function(callback) {\n\
    var args = d3_array(arguments);\n\
    callback.apply(args[0] = this, args);\n\
    return this;\n\
  };\n\
  d3_selectionPrototype.empty = function() {\n\
    return !this.node();\n\
  };\n\
  d3_selectionPrototype.node = function() {\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        var node = group[i];\n\
        if (node) return node;\n\
      }\n\
    }\n\
    return null;\n\
  };\n\
  d3_selectionPrototype.size = function() {\n\
    var n = 0;\n\
    this.each(function() {\n\
      ++n;\n\
    });\n\
    return n;\n\
  };\n\
  function d3_selection_enter(selection) {\n\
    d3_subclass(selection, d3_selection_enterPrototype);\n\
    return selection;\n\
  }\n\
  var d3_selection_enterPrototype = [];\n\
  d3.selection.enter = d3_selection_enter;\n\
  d3.selection.enter.prototype = d3_selection_enterPrototype;\n\
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;\n\
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;\n\
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;\n\
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;\n\
  d3_selection_enterPrototype.select = function(selector) {\n\
    var subgroups = [], subgroup, subnode, upgroup, group, node;\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      upgroup = (group = this[j]).update;\n\
      subgroups.push(subgroup = []);\n\
      subgroup.parentNode = group.parentNode;\n\
      for (var i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));\n\
          subnode.__data__ = node.__data__;\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_selection(subgroups);\n\
  };\n\
  d3_selection_enterPrototype.insert = function(name, before) {\n\
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);\n\
    return d3_selectionPrototype.insert.call(this, name, before);\n\
  };\n\
  function d3_selection_enterInsertBefore(enter) {\n\
    var i0, j0;\n\
    return function(d, i, j) {\n\
      var group = enter[j].update, n = group.length, node;\n\
      if (j != j0) j0 = j, i0 = 0;\n\
      if (i >= i0) i0 = i + 1;\n\
      while (!(node = group[i0]) && ++i0 < n) ;\n\
      return node;\n\
    };\n\
  }\n\
  d3_selectionPrototype.transition = function() {\n\
    var id = d3_transitionInheritId || ++d3_transitionId, subgroups = [], subgroup, node, transition = d3_transitionInherit || {\n\
      time: Date.now(),\n\
      ease: d3_ease_cubicInOut,\n\
      delay: 0,\n\
      duration: 250\n\
    };\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) d3_transitionNode(node, i, id, transition);\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_selectionPrototype.interrupt = function() {\n\
    return this.each(d3_selection_interrupt);\n\
  };\n\
  function d3_selection_interrupt() {\n\
    var lock = this.__transition__;\n\
    if (lock) ++lock.active;\n\
  }\n\
  d3.select = function(node) {\n\
    var group = [ typeof node === \"string\" ? d3_select(node, d3_document) : node ];\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  d3.selectAll = function(nodes) {\n\
    var group = d3_array(typeof nodes === \"string\" ? d3_selectAll(nodes, d3_document) : nodes);\n\
    group.parentNode = d3_documentElement;\n\
    return d3_selection([ group ]);\n\
  };\n\
  var d3_selectionRoot = d3.select(d3_documentElement);\n\
  d3_selectionPrototype.on = function(type, listener, capture) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof type !== \"string\") {\n\
        if (n < 2) listener = false;\n\
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));\n\
        return this;\n\
      }\n\
      if (n < 2) return (n = this.node()[\"__on\" + type]) && n._;\n\
      capture = false;\n\
    }\n\
    return this.each(d3_selection_on(type, listener, capture));\n\
  };\n\
  function d3_selection_on(type, listener, capture) {\n\
    var name = \"__on\" + type, i = type.indexOf(\".\"), wrap = d3_selection_onListener;\n\
    if (i > 0) type = type.substring(0, i);\n\
    var filter = d3_selection_onFilters.get(type);\n\
    if (filter) type = filter, wrap = d3_selection_onFilter;\n\
    function onRemove() {\n\
      var l = this[name];\n\
      if (l) {\n\
        this.removeEventListener(type, l, l.$);\n\
        delete this[name];\n\
      }\n\
    }\n\
    function onAdd() {\n\
      var l = wrap(listener, d3_array(arguments));\n\
      onRemove.call(this);\n\
      this.addEventListener(type, this[name] = l, l.$ = capture);\n\
      l._ = listener;\n\
    }\n\
    function removeAll() {\n\
      var re = new RegExp(\"^__on([^.]+)\" + d3.requote(type) + \"$\"), match;\n\
      for (var name in this) {\n\
        if (match = name.match(re)) {\n\
          var l = this[name];\n\
          this.removeEventListener(match[1], l, l.$);\n\
          delete this[name];\n\
        }\n\
      }\n\
    }\n\
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;\n\
  }\n\
  var d3_selection_onFilters = d3.map({\n\
    mouseenter: \"mouseover\",\n\
    mouseleave: \"mouseout\"\n\
  });\n\
  d3_selection_onFilters.forEach(function(k) {\n\
    if (\"on\" + k in d3_document) d3_selection_onFilters.remove(k);\n\
  });\n\
  function d3_selection_onListener(listener, argumentz) {\n\
    return function(e) {\n\
      var o = d3.event;\n\
      d3.event = e;\n\
      argumentz[0] = this.__data__;\n\
      try {\n\
        listener.apply(this, argumentz);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
  }\n\
  function d3_selection_onFilter(listener, argumentz) {\n\
    var l = d3_selection_onListener(listener, argumentz);\n\
    return function(e) {\n\
      var target = this, related = e.relatedTarget;\n\
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {\n\
        l.call(target, e);\n\
      }\n\
    };\n\
  }\n\
  var d3_event_dragSelect = \"onselectstart\" in d3_document ? null : d3_vendorSymbol(d3_documentElement.style, \"userSelect\"), d3_event_dragId = 0;\n\
  function d3_event_dragSuppress() {\n\
    var name = \".dragsuppress-\" + ++d3_event_dragId, click = \"click\" + name, w = d3.select(d3_window).on(\"touchmove\" + name, d3_eventPreventDefault).on(\"dragstart\" + name, d3_eventPreventDefault).on(\"selectstart\" + name, d3_eventPreventDefault);\n\
    if (d3_event_dragSelect) {\n\
      var style = d3_documentElement.style, select = style[d3_event_dragSelect];\n\
      style[d3_event_dragSelect] = \"none\";\n\
    }\n\
    return function(suppressClick) {\n\
      w.on(name, null);\n\
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;\n\
      if (suppressClick) {\n\
        function off() {\n\
          w.on(click, null);\n\
        }\n\
        w.on(click, function() {\n\
          d3_eventPreventDefault();\n\
          off();\n\
        }, true);\n\
        setTimeout(off, 0);\n\
      }\n\
    };\n\
  }\n\
  d3.mouse = function(container) {\n\
    return d3_mousePoint(container, d3_eventSource());\n\
  };\n\
  var d3_mouse_bug44083 = /WebKit/.test(d3_window.navigator.userAgent) ? -1 : 0;\n\
  function d3_mousePoint(container, e) {\n\
    if (e.changedTouches) e = e.changedTouches[0];\n\
    var svg = container.ownerSVGElement || container;\n\
    if (svg.createSVGPoint) {\n\
      var point = svg.createSVGPoint();\n\
      if (d3_mouse_bug44083 < 0 && (d3_window.scrollX || d3_window.scrollY)) {\n\
        svg = d3.select(\"body\").append(\"svg\").style({\n\
          position: \"absolute\",\n\
          top: 0,\n\
          left: 0,\n\
          margin: 0,\n\
          padding: 0,\n\
          border: \"none\"\n\
        }, \"important\");\n\
        var ctm = svg[0][0].getScreenCTM();\n\
        d3_mouse_bug44083 = !(ctm.f || ctm.e);\n\
        svg.remove();\n\
      }\n\
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, \n\
      point.y = e.clientY;\n\
      point = point.matrixTransform(container.getScreenCTM().inverse());\n\
      return [ point.x, point.y ];\n\
    }\n\
    var rect = container.getBoundingClientRect();\n\
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];\n\
  }\n\
  d3.touches = function(container, touches) {\n\
    if (arguments.length < 2) touches = d3_eventSource().touches;\n\
    return touches ? d3_array(touches).map(function(touch) {\n\
      var point = d3_mousePoint(container, touch);\n\
      point.identifier = touch.identifier;\n\
      return point;\n\
    }) : [];\n\
  };\n\
  d3.behavior.drag = function() {\n\
    var event = d3_eventDispatch(drag, \"drag\", \"dragstart\", \"dragend\"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, \"mousemove\", \"mouseup\"), touchstart = dragstart(touchid, touchposition, \"touchmove\", \"touchend\");\n\
    function drag() {\n\
      this.on(\"mousedown.drag\", mousedown).on(\"touchstart.drag\", touchstart);\n\
    }\n\
    function touchid() {\n\
      return d3.event.changedTouches[0].identifier;\n\
    }\n\
    function touchposition(parent, id) {\n\
      return d3.touches(parent).filter(function(p) {\n\
        return p.identifier === id;\n\
      })[0];\n\
    }\n\
    function dragstart(id, position, move, end) {\n\
      return function() {\n\
        var target = this, parent = target.parentNode, event_ = event.of(target, arguments), eventTarget = d3.event.target, eventId = id(), drag = eventId == null ? \"drag\" : \"drag-\" + eventId, origin_ = position(parent, eventId), dragged = 0, offset, w = d3.select(d3_window).on(move + \".\" + drag, moved).on(end + \".\" + drag, ended), dragRestore = d3_event_dragSuppress();\n\
        if (origin) {\n\
          offset = origin.apply(target, arguments);\n\
          offset = [ offset.x - origin_[0], offset.y - origin_[1] ];\n\
        } else {\n\
          offset = [ 0, 0 ];\n\
        }\n\
        event_({\n\
          type: \"dragstart\"\n\
        });\n\
        function moved() {\n\
          var p = position(parent, eventId), dx = p[0] - origin_[0], dy = p[1] - origin_[1];\n\
          dragged |= dx | dy;\n\
          origin_ = p;\n\
          event_({\n\
            type: \"drag\",\n\
            x: p[0] + offset[0],\n\
            y: p[1] + offset[1],\n\
            dx: dx,\n\
            dy: dy\n\
          });\n\
        }\n\
        function ended() {\n\
          w.on(move + \".\" + drag, null).on(end + \".\" + drag, null);\n\
          dragRestore(dragged && d3.event.target === eventTarget);\n\
          event_({\n\
            type: \"dragend\"\n\
          });\n\
        }\n\
      };\n\
    }\n\
    drag.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return drag;\n\
    };\n\
    return d3.rebind(drag, event, \"on\");\n\
  };\n\
  var π = Math.PI, τ = 2 * π, halfπ = π / 2, ε = 1e-6, ε2 = ε * ε, d3_radians = π / 180, d3_degrees = 180 / π;\n\
  function d3_sgn(x) {\n\
    return x > 0 ? 1 : x < 0 ? -1 : 0;\n\
  }\n\
  function d3_acos(x) {\n\
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);\n\
  }\n\
  function d3_asin(x) {\n\
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);\n\
  }\n\
  function d3_sinh(x) {\n\
    return ((x = Math.exp(x)) - 1 / x) / 2;\n\
  }\n\
  function d3_cosh(x) {\n\
    return ((x = Math.exp(x)) + 1 / x) / 2;\n\
  }\n\
  function d3_tanh(x) {\n\
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);\n\
  }\n\
  function d3_haversin(x) {\n\
    return (x = Math.sin(x / 2)) * x;\n\
  }\n\
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;\n\
  d3.interpolateZoom = function(p0, p1) {\n\
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2];\n\
    var dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1), dr = r1 - r0, S = (dr || Math.log(w1 / w0)) / ρ;\n\
    function interpolate(t) {\n\
      var s = t * S;\n\
      if (dr) {\n\
        var coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));\n\
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];\n\
      }\n\
      return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * s) ];\n\
    }\n\
    interpolate.duration = S * 1e3;\n\
    return interpolate;\n\
  };\n\
  d3.behavior.zoom = function() {\n\
    var view = {\n\
      x: 0,\n\
      y: 0,\n\
      k: 1\n\
    }, translate0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, mousedown = \"mousedown.zoom\", mousemove = \"mousemove.zoom\", mouseup = \"mouseup.zoom\", mousewheelTimer, touchstart = \"touchstart.zoom\", touchtime, event = d3_eventDispatch(zoom, \"zoomstart\", \"zoom\", \"zoomend\"), x0, x1, y0, y1;\n\
    function zoom(g) {\n\
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + \".zoom\", mousewheeled).on(mousemove, mousewheelreset).on(\"dblclick.zoom\", dblclicked).on(touchstart, touchstarted);\n\
    }\n\
    zoom.event = function(g) {\n\
      g.each(function() {\n\
        var event_ = event.of(this, arguments), view1 = view;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.zoom\", function() {\n\
            view = this.__chart__ || {\n\
              x: 0,\n\
              y: 0,\n\
              k: 1\n\
            };\n\
            zoomstarted(event_);\n\
          }).tween(\"zoom:zoom\", function() {\n\
            var dx = size[0], dy = size[1], cx = dx / 2, cy = dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);\n\
            return function(t) {\n\
              var l = i(t), k = dx / l[2];\n\
              this.__chart__ = view = {\n\
                x: cx - l[0] * k,\n\
                y: cy - l[1] * k,\n\
                k: k\n\
              };\n\
              zoomed(event_);\n\
            };\n\
          }).each(\"end.zoom\", function() {\n\
            zoomended(event_);\n\
          });\n\
        } else {\n\
          this.__chart__ = view;\n\
          zoomstarted(event_);\n\
          zoomed(event_);\n\
          zoomended(event_);\n\
        }\n\
      });\n\
    };\n\
    zoom.translate = function(_) {\n\
      if (!arguments.length) return [ view.x, view.y ];\n\
      view = {\n\
        x: +_[0],\n\
        y: +_[1],\n\
        k: view.k\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scale = function(_) {\n\
      if (!arguments.length) return view.k;\n\
      view = {\n\
        x: view.x,\n\
        y: view.y,\n\
        k: +_\n\
      };\n\
      rescale();\n\
      return zoom;\n\
    };\n\
    zoom.scaleExtent = function(_) {\n\
      if (!arguments.length) return scaleExtent;\n\
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.center = function(_) {\n\
      if (!arguments.length) return center;\n\
      center = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _ && [ +_[0], +_[1] ];\n\
      return zoom;\n\
    };\n\
    zoom.x = function(z) {\n\
      if (!arguments.length) return x1;\n\
      x1 = z;\n\
      x0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    zoom.y = function(z) {\n\
      if (!arguments.length) return y1;\n\
      y1 = z;\n\
      y0 = z.copy();\n\
      view = {\n\
        x: 0,\n\
        y: 0,\n\
        k: 1\n\
      };\n\
      return zoom;\n\
    };\n\
    function location(p) {\n\
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];\n\
    }\n\
    function point(l) {\n\
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];\n\
    }\n\
    function scaleTo(s) {\n\
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));\n\
    }\n\
    function translateTo(p, l) {\n\
      l = point(l);\n\
      view.x += p[0] - l[0];\n\
      view.y += p[1] - l[1];\n\
    }\n\
    function rescale() {\n\
      if (x1) x1.domain(x0.range().map(function(x) {\n\
        return (x - view.x) / view.k;\n\
      }).map(x0.invert));\n\
      if (y1) y1.domain(y0.range().map(function(y) {\n\
        return (y - view.y) / view.k;\n\
      }).map(y0.invert));\n\
    }\n\
    function zoomstarted(event) {\n\
      event({\n\
        type: \"zoomstart\"\n\
      });\n\
    }\n\
    function zoomed(event) {\n\
      rescale();\n\
      event({\n\
        type: \"zoom\",\n\
        scale: view.k,\n\
        translate: [ view.x, view.y ]\n\
      });\n\
    }\n\
    function zoomended(event) {\n\
      event({\n\
        type: \"zoomend\"\n\
      });\n\
    }\n\
    function mousedowned() {\n\
      var target = this, event_ = event.of(target, arguments), eventTarget = d3.event.target, dragged = 0, w = d3.select(d3_window).on(mousemove, moved).on(mouseup, ended), l = location(d3.mouse(target)), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(target);\n\
      zoomstarted(event_);\n\
      function moved() {\n\
        dragged = 1;\n\
        translateTo(d3.mouse(target), l);\n\
        zoomed(event_);\n\
      }\n\
      function ended() {\n\
        w.on(mousemove, d3_window === target ? mousewheelreset : null).on(mouseup, null);\n\
        dragRestore(dragged && d3.event.target === eventTarget);\n\
        zoomended(event_);\n\
      }\n\
    }\n\
    function touchstarted() {\n\
      var target = this, event_ = event.of(target, arguments), locations0 = {}, distance0 = 0, scale0, eventId = d3.event.changedTouches[0].identifier, touchmove = \"touchmove.zoom-\" + eventId, touchend = \"touchend.zoom-\" + eventId, w = d3.select(d3_window).on(touchmove, moved).on(touchend, ended), t = d3.select(target).on(mousedown, null).on(touchstart, started), dragRestore = d3_event_dragSuppress();\n\
      d3_selection_interrupt.call(target);\n\
      started();\n\
      zoomstarted(event_);\n\
      function relocate() {\n\
        var touches = d3.touches(target);\n\
        scale0 = view.k;\n\
        touches.forEach(function(t) {\n\
          if (t.identifier in locations0) locations0[t.identifier] = location(t);\n\
        });\n\
        return touches;\n\
      }\n\
      function started() {\n\
        var changed = d3.event.changedTouches;\n\
        for (var i = 0, n = changed.length; i < n; ++i) {\n\
          locations0[changed[i].identifier] = null;\n\
        }\n\
        var touches = relocate(), now = Date.now();\n\
        if (touches.length === 1) {\n\
          if (now - touchtime < 500) {\n\
            var p = touches[0], l = locations0[p.identifier];\n\
            scaleTo(view.k * 2);\n\
            translateTo(p, l);\n\
            d3_eventPreventDefault();\n\
            zoomed(event_);\n\
          }\n\
          touchtime = now;\n\
        } else if (touches.length > 1) {\n\
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];\n\
          distance0 = dx * dx + dy * dy;\n\
        }\n\
      }\n\
      function moved() {\n\
        var touches = d3.touches(target), p0, l0, p1, l1;\n\
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {\n\
          p1 = touches[i];\n\
          if (l1 = locations0[p1.identifier]) {\n\
            if (l0) break;\n\
            p0 = p1, l0 = l1;\n\
          }\n\
        }\n\
        if (l1) {\n\
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);\n\
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];\n\
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];\n\
          scaleTo(scale1 * scale0);\n\
        }\n\
        touchtime = null;\n\
        translateTo(p0, l0);\n\
        zoomed(event_);\n\
      }\n\
      function ended() {\n\
        if (d3.event.touches.length) {\n\
          var changed = d3.event.changedTouches;\n\
          for (var i = 0, n = changed.length; i < n; ++i) {\n\
            delete locations0[changed[i].identifier];\n\
          }\n\
          for (var identifier in locations0) {\n\
            return void relocate();\n\
          }\n\
        }\n\
        w.on(touchmove, null).on(touchend, null);\n\
        t.on(mousedown, mousedowned).on(touchstart, touchstarted);\n\
        dragRestore();\n\
        zoomended(event_);\n\
      }\n\
    }\n\
    function mousewheeled() {\n\
      var event_ = event.of(this, arguments);\n\
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), \n\
      zoomstarted(event_);\n\
      mousewheelTimer = setTimeout(function() {\n\
        mousewheelTimer = null;\n\
        zoomended(event_);\n\
      }, 50);\n\
      d3_eventPreventDefault();\n\
      var point = center || d3.mouse(this);\n\
      if (!translate0) translate0 = location(point);\n\
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);\n\
      translateTo(point, translate0);\n\
      zoomed(event_);\n\
    }\n\
    function mousewheelreset() {\n\
      translate0 = null;\n\
    }\n\
    function dblclicked() {\n\
      var event_ = event.of(this, arguments), p = d3.mouse(this), l = location(p), k = Math.log(view.k) / Math.LN2;\n\
      zoomstarted(event_);\n\
      scaleTo(Math.pow(2, d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1));\n\
      translateTo(p, l);\n\
      zoomed(event_);\n\
      zoomended(event_);\n\
    }\n\
    return d3.rebind(zoom, event, \"on\");\n\
  };\n\
  var d3_behavior_zoomInfinity = [ 0, Infinity ];\n\
  var d3_behavior_zoomDelta, d3_behavior_zoomWheel = \"onwheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);\n\
  }, \"wheel\") : \"onmousewheel\" in d3_document ? (d3_behavior_zoomDelta = function() {\n\
    return d3.event.wheelDelta;\n\
  }, \"mousewheel\") : (d3_behavior_zoomDelta = function() {\n\
    return -d3.event.detail;\n\
  }, \"MozMousePixelScroll\");\n\
  function d3_Color() {}\n\
  d3_Color.prototype.toString = function() {\n\
    return this.rgb() + \"\";\n\
  };\n\
  d3.hsl = function(h, s, l) {\n\
    return arguments.length === 1 ? h instanceof d3_Hsl ? d3_hsl(h.h, h.s, h.l) : d3_rgb_parse(\"\" + h, d3_rgb_hsl, d3_hsl) : d3_hsl(+h, +s, +l);\n\
  };\n\
  function d3_hsl(h, s, l) {\n\
    return new d3_Hsl(h, s, l);\n\
  }\n\
  function d3_Hsl(h, s, l) {\n\
    this.h = h;\n\
    this.s = s;\n\
    this.l = l;\n\
  }\n\
  var d3_hslPrototype = d3_Hsl.prototype = new d3_Color();\n\
  d3_hslPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_hsl(this.h, this.s, this.l / k);\n\
  };\n\
  d3_hslPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_hsl(this.h, this.s, k * this.l);\n\
  };\n\
  d3_hslPrototype.rgb = function() {\n\
    return d3_hsl_rgb(this.h, this.s, this.l);\n\
  };\n\
  function d3_hsl_rgb(h, s, l) {\n\
    var m1, m2;\n\
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;\n\
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;\n\
    l = l < 0 ? 0 : l > 1 ? 1 : l;\n\
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;\n\
    m1 = 2 * l - m2;\n\
    function v(h) {\n\
      if (h > 360) h -= 360; else if (h < 0) h += 360;\n\
      if (h < 60) return m1 + (m2 - m1) * h / 60;\n\
      if (h < 180) return m2;\n\
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;\n\
      return m1;\n\
    }\n\
    function vv(h) {\n\
      return Math.round(v(h) * 255);\n\
    }\n\
    return d3_rgb(vv(h + 120), vv(h), vv(h - 120));\n\
  }\n\
  d3.hcl = function(h, c, l) {\n\
    return arguments.length === 1 ? h instanceof d3_Hcl ? d3_hcl(h.h, h.c, h.l) : h instanceof d3_Lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : d3_hcl(+h, +c, +l);\n\
  };\n\
  function d3_hcl(h, c, l) {\n\
    return new d3_Hcl(h, c, l);\n\
  }\n\
  function d3_Hcl(h, c, l) {\n\
    this.h = h;\n\
    this.c = c;\n\
    this.l = l;\n\
  }\n\
  var d3_hclPrototype = d3_Hcl.prototype = new d3_Color();\n\
  d3_hclPrototype.brighter = function(k) {\n\
    return d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.darker = function(k) {\n\
    return d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));\n\
  };\n\
  d3_hclPrototype.rgb = function() {\n\
    return d3_hcl_lab(this.h, this.c, this.l).rgb();\n\
  };\n\
  function d3_hcl_lab(h, c, l) {\n\
    if (isNaN(h)) h = 0;\n\
    if (isNaN(c)) c = 0;\n\
    return d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);\n\
  }\n\
  d3.lab = function(l, a, b) {\n\
    return arguments.length === 1 ? l instanceof d3_Lab ? d3_lab(l.l, l.a, l.b) : l instanceof d3_Hcl ? d3_hcl_lab(l.l, l.c, l.h) : d3_rgb_lab((l = d3.rgb(l)).r, l.g, l.b) : d3_lab(+l, +a, +b);\n\
  };\n\
  function d3_lab(l, a, b) {\n\
    return new d3_Lab(l, a, b);\n\
  }\n\
  function d3_Lab(l, a, b) {\n\
    this.l = l;\n\
    this.a = a;\n\
    this.b = b;\n\
  }\n\
  var d3_lab_K = 18;\n\
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;\n\
  var d3_labPrototype = d3_Lab.prototype = new d3_Color();\n\
  d3_labPrototype.brighter = function(k) {\n\
    return d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.darker = function(k) {\n\
    return d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);\n\
  };\n\
  d3_labPrototype.rgb = function() {\n\
    return d3_lab_rgb(this.l, this.a, this.b);\n\
  };\n\
  function d3_lab_rgb(l, a, b) {\n\
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;\n\
    x = d3_lab_xyz(x) * d3_lab_X;\n\
    y = d3_lab_xyz(y) * d3_lab_Y;\n\
    z = d3_lab_xyz(z) * d3_lab_Z;\n\
    return d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));\n\
  }\n\
  function d3_lab_hcl(l, a, b) {\n\
    return l > 0 ? d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : d3_hcl(NaN, NaN, l);\n\
  }\n\
  function d3_lab_xyz(x) {\n\
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;\n\
  }\n\
  function d3_xyz_lab(x) {\n\
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;\n\
  }\n\
  function d3_xyz_rgb(r) {\n\
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));\n\
  }\n\
  d3.rgb = function(r, g, b) {\n\
    return arguments.length === 1 ? r instanceof d3_Rgb ? d3_rgb(r.r, r.g, r.b) : d3_rgb_parse(\"\" + r, d3_rgb, d3_hsl_rgb) : d3_rgb(~~r, ~~g, ~~b);\n\
  };\n\
  function d3_rgbNumber(value) {\n\
    return d3_rgb(value >> 16, value >> 8 & 255, value & 255);\n\
  }\n\
  function d3_rgbString(value) {\n\
    return d3_rgbNumber(value) + \"\";\n\
  }\n\
  function d3_rgb(r, g, b) {\n\
    return new d3_Rgb(r, g, b);\n\
  }\n\
  function d3_Rgb(r, g, b) {\n\
    this.r = r;\n\
    this.g = g;\n\
    this.b = b;\n\
  }\n\
  var d3_rgbPrototype = d3_Rgb.prototype = new d3_Color();\n\
  d3_rgbPrototype.brighter = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    var r = this.r, g = this.g, b = this.b, i = 30;\n\
    if (!r && !g && !b) return d3_rgb(i, i, i);\n\
    if (r && r < i) r = i;\n\
    if (g && g < i) g = i;\n\
    if (b && b < i) b = i;\n\
    return d3_rgb(Math.min(255, ~~(r / k)), Math.min(255, ~~(g / k)), Math.min(255, ~~(b / k)));\n\
  };\n\
  d3_rgbPrototype.darker = function(k) {\n\
    k = Math.pow(.7, arguments.length ? k : 1);\n\
    return d3_rgb(~~(k * this.r), ~~(k * this.g), ~~(k * this.b));\n\
  };\n\
  d3_rgbPrototype.hsl = function() {\n\
    return d3_rgb_hsl(this.r, this.g, this.b);\n\
  };\n\
  d3_rgbPrototype.toString = function() {\n\
    return \"#\" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);\n\
  };\n\
  function d3_rgb_hex(v) {\n\
    return v < 16 ? \"0\" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);\n\
  }\n\
  function d3_rgb_parse(format, rgb, hsl) {\n\
    var r = 0, g = 0, b = 0, m1, m2, name;\n\
    m1 = /([a-z]+)\\((.*)\\)/i.exec(format);\n\
    if (m1) {\n\
      m2 = m1[2].split(\",\");\n\
      switch (m1[1]) {\n\
       case \"hsl\":\n\
        {\n\
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);\n\
        }\n\
\n\
       case \"rgb\":\n\
        {\n\
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));\n\
        }\n\
      }\n\
    }\n\
    if (name = d3_rgb_names.get(format)) return rgb(name.r, name.g, name.b);\n\
    if (format != null && format.charAt(0) === \"#\") {\n\
      if (format.length === 4) {\n\
        r = format.charAt(1);\n\
        r += r;\n\
        g = format.charAt(2);\n\
        g += g;\n\
        b = format.charAt(3);\n\
        b += b;\n\
      } else if (format.length === 7) {\n\
        r = format.substring(1, 3);\n\
        g = format.substring(3, 5);\n\
        b = format.substring(5, 7);\n\
      }\n\
      r = parseInt(r, 16);\n\
      g = parseInt(g, 16);\n\
      b = parseInt(b, 16);\n\
    }\n\
    return rgb(r, g, b);\n\
  }\n\
  function d3_rgb_hsl(r, g, b) {\n\
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;\n\
    if (d) {\n\
      s = l < .5 ? d / (max + min) : d / (2 - max - min);\n\
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;\n\
      h *= 60;\n\
    } else {\n\
      h = NaN;\n\
      s = l > 0 && l < 1 ? 0 : h;\n\
    }\n\
    return d3_hsl(h, s, l);\n\
  }\n\
  function d3_rgb_lab(r, g, b) {\n\
    r = d3_rgb_xyz(r);\n\
    g = d3_rgb_xyz(g);\n\
    b = d3_rgb_xyz(b);\n\
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);\n\
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));\n\
  }\n\
  function d3_rgb_xyz(r) {\n\
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);\n\
  }\n\
  function d3_rgb_parseNumber(c) {\n\
    var f = parseFloat(c);\n\
    return c.charAt(c.length - 1) === \"%\" ? Math.round(f * 2.55) : f;\n\
  }\n\
  var d3_rgb_names = d3.map({\n\
    aliceblue: 15792383,\n\
    antiquewhite: 16444375,\n\
    aqua: 65535,\n\
    aquamarine: 8388564,\n\
    azure: 15794175,\n\
    beige: 16119260,\n\
    bisque: 16770244,\n\
    black: 0,\n\
    blanchedalmond: 16772045,\n\
    blue: 255,\n\
    blueviolet: 9055202,\n\
    brown: 10824234,\n\
    burlywood: 14596231,\n\
    cadetblue: 6266528,\n\
    chartreuse: 8388352,\n\
    chocolate: 13789470,\n\
    coral: 16744272,\n\
    cornflowerblue: 6591981,\n\
    cornsilk: 16775388,\n\
    crimson: 14423100,\n\
    cyan: 65535,\n\
    darkblue: 139,\n\
    darkcyan: 35723,\n\
    darkgoldenrod: 12092939,\n\
    darkgray: 11119017,\n\
    darkgreen: 25600,\n\
    darkgrey: 11119017,\n\
    darkkhaki: 12433259,\n\
    darkmagenta: 9109643,\n\
    darkolivegreen: 5597999,\n\
    darkorange: 16747520,\n\
    darkorchid: 10040012,\n\
    darkred: 9109504,\n\
    darksalmon: 15308410,\n\
    darkseagreen: 9419919,\n\
    darkslateblue: 4734347,\n\
    darkslategray: 3100495,\n\
    darkslategrey: 3100495,\n\
    darkturquoise: 52945,\n\
    darkviolet: 9699539,\n\
    deeppink: 16716947,\n\
    deepskyblue: 49151,\n\
    dimgray: 6908265,\n\
    dimgrey: 6908265,\n\
    dodgerblue: 2003199,\n\
    firebrick: 11674146,\n\
    floralwhite: 16775920,\n\
    forestgreen: 2263842,\n\
    fuchsia: 16711935,\n\
    gainsboro: 14474460,\n\
    ghostwhite: 16316671,\n\
    gold: 16766720,\n\
    goldenrod: 14329120,\n\
    gray: 8421504,\n\
    green: 32768,\n\
    greenyellow: 11403055,\n\
    grey: 8421504,\n\
    honeydew: 15794160,\n\
    hotpink: 16738740,\n\
    indianred: 13458524,\n\
    indigo: 4915330,\n\
    ivory: 16777200,\n\
    khaki: 15787660,\n\
    lavender: 15132410,\n\
    lavenderblush: 16773365,\n\
    lawngreen: 8190976,\n\
    lemonchiffon: 16775885,\n\
    lightblue: 11393254,\n\
    lightcoral: 15761536,\n\
    lightcyan: 14745599,\n\
    lightgoldenrodyellow: 16448210,\n\
    lightgray: 13882323,\n\
    lightgreen: 9498256,\n\
    lightgrey: 13882323,\n\
    lightpink: 16758465,\n\
    lightsalmon: 16752762,\n\
    lightseagreen: 2142890,\n\
    lightskyblue: 8900346,\n\
    lightslategray: 7833753,\n\
    lightslategrey: 7833753,\n\
    lightsteelblue: 11584734,\n\
    lightyellow: 16777184,\n\
    lime: 65280,\n\
    limegreen: 3329330,\n\
    linen: 16445670,\n\
    magenta: 16711935,\n\
    maroon: 8388608,\n\
    mediumaquamarine: 6737322,\n\
    mediumblue: 205,\n\
    mediumorchid: 12211667,\n\
    mediumpurple: 9662683,\n\
    mediumseagreen: 3978097,\n\
    mediumslateblue: 8087790,\n\
    mediumspringgreen: 64154,\n\
    mediumturquoise: 4772300,\n\
    mediumvioletred: 13047173,\n\
    midnightblue: 1644912,\n\
    mintcream: 16121850,\n\
    mistyrose: 16770273,\n\
    moccasin: 16770229,\n\
    navajowhite: 16768685,\n\
    navy: 128,\n\
    oldlace: 16643558,\n\
    olive: 8421376,\n\
    olivedrab: 7048739,\n\
    orange: 16753920,\n\
    orangered: 16729344,\n\
    orchid: 14315734,\n\
    palegoldenrod: 15657130,\n\
    palegreen: 10025880,\n\
    paleturquoise: 11529966,\n\
    palevioletred: 14381203,\n\
    papayawhip: 16773077,\n\
    peachpuff: 16767673,\n\
    peru: 13468991,\n\
    pink: 16761035,\n\
    plum: 14524637,\n\
    powderblue: 11591910,\n\
    purple: 8388736,\n\
    red: 16711680,\n\
    rosybrown: 12357519,\n\
    royalblue: 4286945,\n\
    saddlebrown: 9127187,\n\
    salmon: 16416882,\n\
    sandybrown: 16032864,\n\
    seagreen: 3050327,\n\
    seashell: 16774638,\n\
    sienna: 10506797,\n\
    silver: 12632256,\n\
    skyblue: 8900331,\n\
    slateblue: 6970061,\n\
    slategray: 7372944,\n\
    slategrey: 7372944,\n\
    snow: 16775930,\n\
    springgreen: 65407,\n\
    steelblue: 4620980,\n\
    tan: 13808780,\n\
    teal: 32896,\n\
    thistle: 14204888,\n\
    tomato: 16737095,\n\
    turquoise: 4251856,\n\
    violet: 15631086,\n\
    wheat: 16113331,\n\
    white: 16777215,\n\
    whitesmoke: 16119285,\n\
    yellow: 16776960,\n\
    yellowgreen: 10145074\n\
  });\n\
  d3_rgb_names.forEach(function(key, value) {\n\
    d3_rgb_names.set(key, d3_rgbNumber(value));\n\
  });\n\
  function d3_functor(v) {\n\
    return typeof v === \"function\" ? v : function() {\n\
      return v;\n\
    };\n\
  }\n\
  d3.functor = d3_functor;\n\
  function d3_identity(d) {\n\
    return d;\n\
  }\n\
  d3.xhr = d3_xhrType(d3_identity);\n\
  function d3_xhrType(response) {\n\
    return function(url, mimeType, callback) {\n\
      if (arguments.length === 2 && typeof mimeType === \"function\") callback = mimeType, \n\
      mimeType = null;\n\
      return d3_xhr(url, mimeType, response, callback);\n\
    };\n\
  }\n\
  function d3_xhr(url, mimeType, response, callback) {\n\
    var xhr = {}, dispatch = d3.dispatch(\"beforesend\", \"progress\", \"load\", \"error\"), headers = {}, request = new XMLHttpRequest(), responseType = null;\n\
    if (d3_window.XDomainRequest && !(\"withCredentials\" in request) && /^(http(s)?:)?\\/\\//.test(url)) request = new XDomainRequest();\n\
    \"onload\" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {\n\
      request.readyState > 3 && respond();\n\
    };\n\
    function respond() {\n\
      var status = request.status, result;\n\
      if (!status && request.responseText || status >= 200 && status < 300 || status === 304) {\n\
        try {\n\
          result = response.call(xhr, request);\n\
        } catch (e) {\n\
          dispatch.error.call(xhr, e);\n\
          return;\n\
        }\n\
        dispatch.load.call(xhr, result);\n\
      } else {\n\
        dispatch.error.call(xhr, request);\n\
      }\n\
    }\n\
    request.onprogress = function(event) {\n\
      var o = d3.event;\n\
      d3.event = event;\n\
      try {\n\
        dispatch.progress.call(xhr, request);\n\
      } finally {\n\
        d3.event = o;\n\
      }\n\
    };\n\
    xhr.header = function(name, value) {\n\
      name = (name + \"\").toLowerCase();\n\
      if (arguments.length < 2) return headers[name];\n\
      if (value == null) delete headers[name]; else headers[name] = value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.mimeType = function(value) {\n\
      if (!arguments.length) return mimeType;\n\
      mimeType = value == null ? null : value + \"\";\n\
      return xhr;\n\
    };\n\
    xhr.responseType = function(value) {\n\
      if (!arguments.length) return responseType;\n\
      responseType = value;\n\
      return xhr;\n\
    };\n\
    xhr.response = function(value) {\n\
      response = value;\n\
      return xhr;\n\
    };\n\
    [ \"get\", \"post\" ].forEach(function(method) {\n\
      xhr[method] = function() {\n\
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));\n\
      };\n\
    });\n\
    xhr.send = function(method, data, callback) {\n\
      if (arguments.length === 2 && typeof data === \"function\") callback = data, data = null;\n\
      request.open(method, url, true);\n\
      if (mimeType != null && !(\"accept\" in headers)) headers[\"accept\"] = mimeType + \",*/*\";\n\
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);\n\
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);\n\
      if (responseType != null) request.responseType = responseType;\n\
      if (callback != null) xhr.on(\"error\", callback).on(\"load\", function(request) {\n\
        callback(null, request);\n\
      });\n\
      dispatch.beforesend.call(xhr, request);\n\
      request.send(data == null ? null : data);\n\
      return xhr;\n\
    };\n\
    xhr.abort = function() {\n\
      request.abort();\n\
      return xhr;\n\
    };\n\
    d3.rebind(xhr, dispatch, \"on\");\n\
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));\n\
  }\n\
  function d3_xhr_fixCallback(callback) {\n\
    return callback.length === 1 ? function(error, request) {\n\
      callback(error == null ? request : null);\n\
    } : callback;\n\
  }\n\
  d3.dsv = function(delimiter, mimeType) {\n\
    var reFormat = new RegExp('[\"' + delimiter + \"\\n\
]\"), delimiterCode = delimiter.charCodeAt(0);\n\
    function dsv(url, row, callback) {\n\
      if (arguments.length < 3) callback = row, row = null;\n\
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);\n\
      xhr.row = function(_) {\n\
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;\n\
      };\n\
      return xhr;\n\
    }\n\
    function response(request) {\n\
      return dsv.parse(request.responseText);\n\
    }\n\
    function typedResponse(f) {\n\
      return function(request) {\n\
        return dsv.parse(request.responseText, f);\n\
      };\n\
    }\n\
    dsv.parse = function(text, f) {\n\
      var o;\n\
      return dsv.parseRows(text, function(row, i) {\n\
        if (o) return o(row, i - 1);\n\
        var a = new Function(\"d\", \"return {\" + row.map(function(name, i) {\n\
          return JSON.stringify(name) + \": d[\" + i + \"]\";\n\
        }).join(\",\") + \"}\");\n\
        o = f ? function(row, i) {\n\
          return f(a(row), i);\n\
        } : a;\n\
      });\n\
    };\n\
    dsv.parseRows = function(text, f) {\n\
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;\n\
      function token() {\n\
        if (I >= N) return EOF;\n\
        if (eol) return eol = false, EOL;\n\
        var j = I;\n\
        if (text.charCodeAt(j) === 34) {\n\
          var i = j;\n\
          while (i++ < N) {\n\
            if (text.charCodeAt(i) === 34) {\n\
              if (text.charCodeAt(i + 1) !== 34) break;\n\
              ++i;\n\
            }\n\
          }\n\
          I = i + 2;\n\
          var c = text.charCodeAt(i + 1);\n\
          if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(i + 2) === 10) ++I;\n\
          } else if (c === 10) {\n\
            eol = true;\n\
          }\n\
          return text.substring(j + 1, i).replace(/\"\"/g, '\"');\n\
        }\n\
        while (I < N) {\n\
          var c = text.charCodeAt(I++), k = 1;\n\
          if (c === 10) eol = true; else if (c === 13) {\n\
            eol = true;\n\
            if (text.charCodeAt(I) === 10) ++I, ++k;\n\
          } else if (c !== delimiterCode) continue;\n\
          return text.substring(j, I - k);\n\
        }\n\
        return text.substring(j);\n\
      }\n\
      while ((t = token()) !== EOF) {\n\
        var a = [];\n\
        while (t !== EOL && t !== EOF) {\n\
          a.push(t);\n\
          t = token();\n\
        }\n\
        if (f && !(a = f(a, n++))) continue;\n\
        rows.push(a);\n\
      }\n\
      return rows;\n\
    };\n\
    dsv.format = function(rows) {\n\
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);\n\
      var fieldSet = new d3_Set(), fields = [];\n\
      rows.forEach(function(row) {\n\
        for (var field in row) {\n\
          if (!fieldSet.has(field)) {\n\
            fields.push(fieldSet.add(field));\n\
          }\n\
        }\n\
      });\n\
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {\n\
        return fields.map(function(field) {\n\
          return formatValue(row[field]);\n\
        }).join(delimiter);\n\
      })).join(\"\\n\
\");\n\
    };\n\
    dsv.formatRows = function(rows) {\n\
      return rows.map(formatRow).join(\"\\n\
\");\n\
    };\n\
    function formatRow(row) {\n\
      return row.map(formatValue).join(delimiter);\n\
    }\n\
    function formatValue(text) {\n\
      return reFormat.test(text) ? '\"' + text.replace(/\\\"/g, '\"\"') + '\"' : text;\n\
    }\n\
    return dsv;\n\
  };\n\
  d3.csv = d3.dsv(\",\", \"text/csv\");\n\
  d3.tsv = d3.dsv(\"\t\", \"text/tab-separated-values\");\n\
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_active, d3_timer_frame = d3_window[d3_vendorSymbol(d3_window, \"requestAnimationFrame\")] || function(callback) {\n\
    setTimeout(callback, 17);\n\
  };\n\
  d3.timer = function(callback, delay, then) {\n\
    var n = arguments.length;\n\
    if (n < 2) delay = 0;\n\
    if (n < 3) then = Date.now();\n\
    var time = then + delay, timer = {\n\
      c: callback,\n\
      t: time,\n\
      f: false,\n\
      n: null\n\
    };\n\
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;\n\
    d3_timer_queueTail = timer;\n\
    if (!d3_timer_interval) {\n\
      d3_timer_timeout = clearTimeout(d3_timer_timeout);\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  };\n\
  function d3_timer_step() {\n\
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;\n\
    if (delay > 24) {\n\
      if (isFinite(delay)) {\n\
        clearTimeout(d3_timer_timeout);\n\
        d3_timer_timeout = setTimeout(d3_timer_step, delay);\n\
      }\n\
      d3_timer_interval = 0;\n\
    } else {\n\
      d3_timer_interval = 1;\n\
      d3_timer_frame(d3_timer_step);\n\
    }\n\
  }\n\
  d3.timer.flush = function() {\n\
    d3_timer_mark();\n\
    d3_timer_sweep();\n\
  };\n\
  function d3_timer_mark() {\n\
    var now = Date.now();\n\
    d3_timer_active = d3_timer_queueHead;\n\
    while (d3_timer_active) {\n\
      if (now >= d3_timer_active.t) d3_timer_active.f = d3_timer_active.c(now - d3_timer_active.t);\n\
      d3_timer_active = d3_timer_active.n;\n\
    }\n\
    return now;\n\
  }\n\
  function d3_timer_sweep() {\n\
    var t0, t1 = d3_timer_queueHead, time = Infinity;\n\
    while (t1) {\n\
      if (t1.f) {\n\
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;\n\
      } else {\n\
        if (t1.t < time) time = t1.t;\n\
        t1 = (t0 = t1).n;\n\
      }\n\
    }\n\
    d3_timer_queueTail = t0;\n\
    return time;\n\
  }\n\
  var d3_format_decimalPoint = \".\", d3_format_thousandsSeparator = \",\", d3_format_grouping = [ 3, 3 ], d3_format_currencySymbol = \"$\";\n\
  var d3_formatPrefixes = [ \"y\", \"z\", \"a\", \"f\", \"p\", \"n\", \"µ\", \"m\", \"\", \"k\", \"M\", \"G\", \"T\", \"P\", \"E\", \"Z\", \"Y\" ].map(d3_formatPrefix);\n\
  d3.formatPrefix = function(value, precision) {\n\
    var i = 0;\n\
    if (value) {\n\
      if (value < 0) value *= -1;\n\
      if (precision) value = d3.round(value, d3_format_precision(value, precision));\n\
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);\n\
      i = Math.max(-24, Math.min(24, Math.floor((i <= 0 ? i + 1 : i - 1) / 3) * 3));\n\
    }\n\
    return d3_formatPrefixes[8 + i / 3];\n\
  };\n\
  function d3_formatPrefix(d, i) {\n\
    var k = Math.pow(10, abs(8 - i) * 3);\n\
    return {\n\
      scale: i > 8 ? function(d) {\n\
        return d / k;\n\
      } : function(d) {\n\
        return d * k;\n\
      },\n\
      symbol: d\n\
    };\n\
  }\n\
  d3.round = function(x, n) {\n\
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);\n\
  };\n\
  d3.format = function(specifier) {\n\
    var match = d3_format_re.exec(specifier), fill = match[1] || \" \", align = match[2] || \">\", sign = match[3] || \"\", symbol = match[4] || \"\", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, suffix = \"\", integer = false;\n\
    if (precision) precision = +precision.substring(1);\n\
    if (zfill || fill === \"0\" && align === \"=\") {\n\
      zfill = fill = \"0\";\n\
      align = \"=\";\n\
      if (comma) width -= Math.floor((width - 1) / 4);\n\
    }\n\
    switch (type) {\n\
     case \"n\":\n\
      comma = true;\n\
      type = \"g\";\n\
      break;\n\
\n\
     case \"%\":\n\
      scale = 100;\n\
      suffix = \"%\";\n\
      type = \"f\";\n\
      break;\n\
\n\
     case \"p\":\n\
      scale = 100;\n\
      suffix = \"%\";\n\
      type = \"r\";\n\
      break;\n\
\n\
     case \"b\":\n\
     case \"o\":\n\
     case \"x\":\n\
     case \"X\":\n\
      if (symbol === \"#\") symbol = \"0\" + type.toLowerCase();\n\
\n\
     case \"c\":\n\
     case \"d\":\n\
      integer = true;\n\
      precision = 0;\n\
      break;\n\
\n\
     case \"s\":\n\
      scale = -1;\n\
      type = \"r\";\n\
      break;\n\
    }\n\
    if (symbol === \"#\") symbol = \"\"; else if (symbol === \"$\") symbol = d3_format_currencySymbol;\n\
    if (type == \"r\" && !precision) type = \"g\";\n\
    if (precision != null) {\n\
      if (type == \"g\") precision = Math.max(1, Math.min(21, precision)); else if (type == \"e\" || type == \"f\") precision = Math.max(0, Math.min(20, precision));\n\
    }\n\
    type = d3_format_types.get(type) || d3_format_typeDefault;\n\
    var zcomma = zfill && comma;\n\
    return function(value) {\n\
      if (integer && value % 1) return \"\";\n\
      var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, \"-\") : sign;\n\
      if (scale < 0) {\n\
        var prefix = d3.formatPrefix(value, precision);\n\
        value = prefix.scale(value);\n\
        suffix = prefix.symbol;\n\
      } else {\n\
        value *= scale;\n\
      }\n\
      value = type(value, precision);\n\
      var i = value.lastIndexOf(\".\"), before = i < 0 ? value : value.substring(0, i), after = i < 0 ? \"\" : d3_format_decimalPoint + value.substring(i + 1);\n\
      if (!zfill && comma) before = d3_format_group(before);\n\
      var length = symbol.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : \"\";\n\
      if (zcomma) before = d3_format_group(padding + before);\n\
      negative += symbol;\n\
      value = before + after;\n\
      return (align === \"<\" ? negative + value + padding : align === \">\" ? padding + negative + value : align === \"^\" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + suffix;\n\
    };\n\
  };\n\
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\\- ])?([$#])?(0)?(\\d+)?(,)?(\\.-?\\d+)?([a-z%])?/i;\n\
  var d3_format_types = d3.map({\n\
    b: function(x) {\n\
      return x.toString(2);\n\
    },\n\
    c: function(x) {\n\
      return String.fromCharCode(x);\n\
    },\n\
    o: function(x) {\n\
      return x.toString(8);\n\
    },\n\
    x: function(x) {\n\
      return x.toString(16);\n\
    },\n\
    X: function(x) {\n\
      return x.toString(16).toUpperCase();\n\
    },\n\
    g: function(x, p) {\n\
      return x.toPrecision(p);\n\
    },\n\
    e: function(x, p) {\n\
      return x.toExponential(p);\n\
    },\n\
    f: function(x, p) {\n\
      return x.toFixed(p);\n\
    },\n\
    r: function(x, p) {\n\
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));\n\
    }\n\
  });\n\
  function d3_format_precision(x, p) {\n\
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);\n\
  }\n\
  function d3_format_typeDefault(x) {\n\
    return x + \"\";\n\
  }\n\
  var d3_format_group = d3_identity;\n\
  if (d3_format_grouping) {\n\
    var d3_format_groupingLength = d3_format_grouping.length;\n\
    d3_format_group = function(value) {\n\
      var i = value.length, t = [], j = 0, g = d3_format_grouping[0];\n\
      while (i > 0 && g > 0) {\n\
        t.push(value.substring(i -= g, i + g));\n\
        g = d3_format_grouping[j = (j + 1) % d3_format_groupingLength];\n\
      }\n\
      return t.reverse().join(d3_format_thousandsSeparator);\n\
    };\n\
  }\n\
  d3.geo = {};\n\
  function d3_adder() {}\n\
  d3_adder.prototype = {\n\
    s: 0,\n\
    t: 0,\n\
    add: function(y) {\n\
      d3_adderSum(y, this.t, d3_adderTemp);\n\
      d3_adderSum(d3_adderTemp.s, this.s, this);\n\
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;\n\
    },\n\
    reset: function() {\n\
      this.s = this.t = 0;\n\
    },\n\
    valueOf: function() {\n\
      return this.s;\n\
    }\n\
  };\n\
  var d3_adderTemp = new d3_adder();\n\
  function d3_adderSum(a, b, o) {\n\
    var x = o.s = a + b, bv = x - a, av = x - bv;\n\
    o.t = a - av + (b - bv);\n\
  }\n\
  d3.geo.stream = function(object, listener) {\n\
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {\n\
      d3_geo_streamObjectType[object.type](object, listener);\n\
    } else {\n\
      d3_geo_streamGeometry(object, listener);\n\
    }\n\
  };\n\
  function d3_geo_streamGeometry(geometry, listener) {\n\
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {\n\
      d3_geo_streamGeometryType[geometry.type](geometry, listener);\n\
    }\n\
  }\n\
  var d3_geo_streamObjectType = {\n\
    Feature: function(feature, listener) {\n\
      d3_geo_streamGeometry(feature.geometry, listener);\n\
    },\n\
    FeatureCollection: function(object, listener) {\n\
      var features = object.features, i = -1, n = features.length;\n\
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);\n\
    }\n\
  };\n\
  var d3_geo_streamGeometryType = {\n\
    Sphere: function(object, listener) {\n\
      listener.sphere();\n\
    },\n\
    Point: function(object, listener) {\n\
      object = object.coordinates;\n\
      listener.point(object[0], object[1], object[2]);\n\
    },\n\
    MultiPoint: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);\n\
    },\n\
    LineString: function(object, listener) {\n\
      d3_geo_streamLine(object.coordinates, listener, 0);\n\
    },\n\
    MultiLineString: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);\n\
    },\n\
    Polygon: function(object, listener) {\n\
      d3_geo_streamPolygon(object.coordinates, listener);\n\
    },\n\
    MultiPolygon: function(object, listener) {\n\
      var coordinates = object.coordinates, i = -1, n = coordinates.length;\n\
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);\n\
    },\n\
    GeometryCollection: function(object, listener) {\n\
      var geometries = object.geometries, i = -1, n = geometries.length;\n\
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);\n\
    }\n\
  };\n\
  function d3_geo_streamLine(coordinates, listener, closed) {\n\
    var i = -1, n = coordinates.length - closed, coordinate;\n\
    listener.lineStart();\n\
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);\n\
    listener.lineEnd();\n\
  }\n\
  function d3_geo_streamPolygon(coordinates, listener) {\n\
    var i = -1, n = coordinates.length;\n\
    listener.polygonStart();\n\
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);\n\
    listener.polygonEnd();\n\
  }\n\
  d3.geo.area = function(object) {\n\
    d3_geo_areaSum = 0;\n\
    d3.geo.stream(object, d3_geo_area);\n\
    return d3_geo_areaSum;\n\
  };\n\
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();\n\
  var d3_geo_area = {\n\
    sphere: function() {\n\
      d3_geo_areaSum += 4 * π;\n\
    },\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_areaRingSum.reset();\n\
      d3_geo_area.lineStart = d3_geo_areaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      var area = 2 * d3_geo_areaRingSum;\n\
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;\n\
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;\n\
    }\n\
  };\n\
  function d3_geo_areaRingStart() {\n\
    var λ00, φ00, λ0, cosφ0, sinφ0;\n\
    d3_geo_area.point = function(λ, φ) {\n\
      d3_geo_area.point = nextPoint;\n\
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), \n\
      sinφ0 = Math.sin(φ);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      φ = φ * d3_radians / 2 + π / 4;\n\
      var dλ = λ - λ0, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(dλ), v = k * Math.sin(dλ);\n\
      d3_geo_areaRingSum.add(Math.atan2(v, u));\n\
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;\n\
    }\n\
    d3_geo_area.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
    };\n\
  }\n\
  function d3_geo_cartesian(spherical) {\n\
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);\n\
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];\n\
  }\n\
  function d3_geo_cartesianDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];\n\
  }\n\
  function d3_geo_cartesianCross(a, b) {\n\
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];\n\
  }\n\
  function d3_geo_cartesianAdd(a, b) {\n\
    a[0] += b[0];\n\
    a[1] += b[1];\n\
    a[2] += b[2];\n\
  }\n\
  function d3_geo_cartesianScale(vector, k) {\n\
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];\n\
  }\n\
  function d3_geo_cartesianNormalize(d) {\n\
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);\n\
    d[0] /= l;\n\
    d[1] /= l;\n\
    d[2] /= l;\n\
  }\n\
  function d3_geo_spherical(cartesian) {\n\
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];\n\
  }\n\
  function d3_geo_sphericalEqual(a, b) {\n\
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;\n\
  }\n\
  d3.geo.bounds = function() {\n\
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;\n\
    var bound = {\n\
      point: point,\n\
      lineStart: lineStart,\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        bound.point = ringPoint;\n\
        bound.lineStart = ringStart;\n\
        bound.lineEnd = ringEnd;\n\
        dλSum = 0;\n\
        d3_geo_area.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        d3_geo_area.polygonEnd();\n\
        bound.point = point;\n\
        bound.lineStart = lineStart;\n\
        bound.lineEnd = lineEnd;\n\
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;\n\
        range[0] = λ0, range[1] = λ1;\n\
      }\n\
    };\n\
    function point(λ, φ) {\n\
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);\n\
      if (φ < φ0) φ0 = φ;\n\
      if (φ > φ1) φ1 = φ;\n\
    }\n\
    function linePoint(λ, φ) {\n\
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);\n\
      if (p0) {\n\
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);\n\
        d3_geo_cartesianNormalize(inflection);\n\
        inflection = d3_geo_spherical(inflection);\n\
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;\n\
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = inflection[1] * d3_degrees;\n\
          if (φi > φ1) φ1 = φi;\n\
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {\n\
          var φi = -inflection[1] * d3_degrees;\n\
          if (φi < φ0) φ0 = φi;\n\
        } else {\n\
          if (φ < φ0) φ0 = φ;\n\
          if (φ > φ1) φ1 = φ;\n\
        }\n\
        if (antimeridian) {\n\
          if (λ < λ_) {\n\
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
          } else {\n\
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
          }\n\
        } else {\n\
          if (λ1 >= λ0) {\n\
            if (λ < λ0) λ0 = λ;\n\
            if (λ > λ1) λ1 = λ;\n\
          } else {\n\
            if (λ > λ_) {\n\
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;\n\
            } else {\n\
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;\n\
            }\n\
          }\n\
        }\n\
      } else {\n\
        point(λ, φ);\n\
      }\n\
      p0 = p, λ_ = λ;\n\
    }\n\
    function lineStart() {\n\
      bound.point = linePoint;\n\
    }\n\
    function lineEnd() {\n\
      range[0] = λ0, range[1] = λ1;\n\
      bound.point = point;\n\
      p0 = null;\n\
    }\n\
    function ringPoint(λ, φ) {\n\
      if (p0) {\n\
        var dλ = λ - λ_;\n\
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;\n\
      } else λ__ = λ, φ__ = φ;\n\
      d3_geo_area.point(λ, φ);\n\
      linePoint(λ, φ);\n\
    }\n\
    function ringStart() {\n\
      d3_geo_area.lineStart();\n\
    }\n\
    function ringEnd() {\n\
      ringPoint(λ__, φ__);\n\
      d3_geo_area.lineEnd();\n\
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);\n\
      range[0] = λ0, range[1] = λ1;\n\
      p0 = null;\n\
    }\n\
    function angle(λ0, λ1) {\n\
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;\n\
    }\n\
    function compareRanges(a, b) {\n\
      return a[0] - b[0];\n\
    }\n\
    function withinRange(x, range) {\n\
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;\n\
    }\n\
    return function(feature) {\n\
      φ1 = λ1 = -(λ0 = φ0 = Infinity);\n\
      ranges = [];\n\
      d3.geo.stream(feature, bound);\n\
      var n = ranges.length;\n\
      if (n) {\n\
        ranges.sort(compareRanges);\n\
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {\n\
          b = ranges[i];\n\
          if (withinRange(b[0], a) || withinRange(b[1], a)) {\n\
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];\n\
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];\n\
          } else {\n\
            merged.push(a = b);\n\
          }\n\
        }\n\
        var best = -Infinity, dλ;\n\
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {\n\
          b = merged[i];\n\
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];\n\
        }\n\
      }\n\
      ranges = range = null;\n\
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];\n\
    };\n\
  }();\n\
  d3.geo.centroid = function(object) {\n\
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
    d3.geo.stream(object, d3_geo_centroid);\n\
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;\n\
    if (m < ε2) {\n\
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;\n\
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;\n\
      m = x * x + y * y + z * z;\n\
      if (m < ε2) return [ NaN, NaN ];\n\
    }\n\
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];\n\
  };\n\
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;\n\
  var d3_geo_centroid = {\n\
    sphere: d3_noop,\n\
    point: d3_geo_centroidPoint,\n\
    lineStart: d3_geo_centroidLineStart,\n\
    lineEnd: d3_geo_centroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;\n\
    }\n\
  };\n\
  function d3_geo_centroidPoint(λ, φ) {\n\
    λ *= d3_radians;\n\
    var cosφ = Math.cos(φ *= d3_radians);\n\
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));\n\
  }\n\
  function d3_geo_centroidPointXYZ(x, y, z) {\n\
    ++d3_geo_centroidW0;\n\
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;\n\
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;\n\
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;\n\
  }\n\
  function d3_geo_centroidLineStart() {\n\
    var x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroid.point = nextPoint;\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_geo_centroidLineEnd() {\n\
    d3_geo_centroid.point = d3_geo_centroidPoint;\n\
  }\n\
  function d3_geo_centroidRingStart() {\n\
    var λ00, φ00, x0, y0, z0;\n\
    d3_geo_centroid.point = function(λ, φ) {\n\
      λ00 = λ, φ00 = φ;\n\
      d3_geo_centroid.point = nextPoint;\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians);\n\
      x0 = cosφ * Math.cos(λ);\n\
      y0 = cosφ * Math.sin(λ);\n\
      z0 = Math.sin(φ);\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    };\n\
    d3_geo_centroid.lineEnd = function() {\n\
      nextPoint(λ00, φ00);\n\
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;\n\
      d3_geo_centroid.point = d3_geo_centroidPoint;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      λ *= d3_radians;\n\
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);\n\
      d3_geo_centroidX2 += v * cx;\n\
      d3_geo_centroidY2 += v * cy;\n\
      d3_geo_centroidZ2 += v * cz;\n\
      d3_geo_centroidW1 += w;\n\
      d3_geo_centroidX1 += w * (x0 + (x0 = x));\n\
      d3_geo_centroidY1 += w * (y0 + (y0 = y));\n\
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));\n\
      d3_geo_centroidPointXYZ(x0, y0, z0);\n\
    }\n\
  }\n\
  function d3_true() {\n\
    return true;\n\
  }\n\
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {\n\
    var subject = [], clip = [];\n\
    segments.forEach(function(segment) {\n\
      if ((n = segment.length - 1) <= 0) return;\n\
      var n, p0 = segment[0], p1 = segment[n];\n\
      if (d3_geo_sphericalEqual(p0, p1)) {\n\
        listener.lineStart();\n\
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);\n\
        listener.lineEnd();\n\
        return;\n\
      }\n\
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);\n\
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);\n\
      a.o = b;\n\
      subject.push(a);\n\
      clip.push(b);\n\
    });\n\
    clip.sort(compare);\n\
    d3_geo_clipPolygonLinkCircular(subject);\n\
    d3_geo_clipPolygonLinkCircular(clip);\n\
    if (!subject.length) return;\n\
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {\n\
      clip[i].e = entry = !entry;\n\
    }\n\
    var start = subject[0], points, point;\n\
    while (1) {\n\
      var current = start, isSubject = true;\n\
      while (current.v) if ((current = current.n) === start) return;\n\
      points = current.z;\n\
      listener.lineStart();\n\
      do {\n\
        current.v = current.o.v = true;\n\
        if (current.e) {\n\
          if (isSubject) {\n\
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.n.x, 1, listener);\n\
          }\n\
          current = current.n;\n\
        } else {\n\
          if (isSubject) {\n\
            points = current.p.z;\n\
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);\n\
          } else {\n\
            interpolate(current.x, current.p.x, -1, listener);\n\
          }\n\
          current = current.p;\n\
        }\n\
        current = current.o;\n\
        points = current.z;\n\
        isSubject = !isSubject;\n\
      } while (!current.v);\n\
      listener.lineEnd();\n\
    }\n\
  }\n\
  function d3_geo_clipPolygonLinkCircular(array) {\n\
    if (!(n = array.length)) return;\n\
    var n, i = 0, a = array[0], b;\n\
    while (++i < n) {\n\
      a.n = b = array[i];\n\
      b.p = a;\n\
      a = b;\n\
    }\n\
    a.n = b = array[0];\n\
    b.p = a;\n\
  }\n\
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {\n\
    this.x = point;\n\
    this.z = points;\n\
    this.o = other;\n\
    this.e = entry;\n\
    this.v = false;\n\
    this.n = this.p = null;\n\
  }\n\
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {\n\
    return function(rotate, listener) {\n\
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          clip.point = pointRing;\n\
          clip.lineStart = ringStart;\n\
          clip.lineEnd = ringEnd;\n\
          segments = [];\n\
          polygon = [];\n\
          listener.polygonStart();\n\
        },\n\
        polygonEnd: function() {\n\
          clip.point = point;\n\
          clip.lineStart = lineStart;\n\
          clip.lineEnd = lineEnd;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);\n\
          if (segments.length) {\n\
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);\n\
          } else if (clipStartInside) {\n\
            listener.lineStart();\n\
            interpolate(null, null, 1, listener);\n\
            listener.lineEnd();\n\
          }\n\
          listener.polygonEnd();\n\
          segments = polygon = null;\n\
        },\n\
        sphere: function() {\n\
          listener.polygonStart();\n\
          listener.lineStart();\n\
          interpolate(null, null, 1, listener);\n\
          listener.lineEnd();\n\
          listener.polygonEnd();\n\
        }\n\
      };\n\
      function point(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);\n\
      }\n\
      function pointLine(λ, φ) {\n\
        var point = rotate(λ, φ);\n\
        line.point(point[0], point[1]);\n\
      }\n\
      function lineStart() {\n\
        clip.point = pointLine;\n\
        line.lineStart();\n\
      }\n\
      function lineEnd() {\n\
        clip.point = point;\n\
        line.lineEnd();\n\
      }\n\
      var segments;\n\
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygon, ring;\n\
      function pointRing(λ, φ) {\n\
        ring.push([ λ, φ ]);\n\
        var point = rotate(λ, φ);\n\
        ringListener.point(point[0], point[1]);\n\
      }\n\
      function ringStart() {\n\
        ringListener.lineStart();\n\
        ring = [];\n\
      }\n\
      function ringEnd() {\n\
        pointRing(ring[0][0], ring[0][1]);\n\
        ringListener.lineEnd();\n\
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;\n\
        ring.pop();\n\
        polygon.push(ring);\n\
        ring = null;\n\
        if (!n) return;\n\
        if (clean & 1) {\n\
          segment = ringSegments[0];\n\
          var n = segment.length - 1, i = -1, point;\n\
          listener.lineStart();\n\
          while (++i < n) listener.point((point = segment[i])[0], point[1]);\n\
          listener.lineEnd();\n\
          return;\n\
        }\n\
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));\n\
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));\n\
      }\n\
      return clip;\n\
    };\n\
  }\n\
  function d3_geo_clipSegmentLength1(segment) {\n\
    return segment.length > 1;\n\
  }\n\
  function d3_geo_clipBufferListener() {\n\
    var lines = [], line;\n\
    return {\n\
      lineStart: function() {\n\
        lines.push(line = []);\n\
      },\n\
      point: function(λ, φ) {\n\
        line.push([ λ, φ ]);\n\
      },\n\
      lineEnd: d3_noop,\n\
      buffer: function() {\n\
        var buffer = lines;\n\
        lines = [];\n\
        line = null;\n\
        return buffer;\n\
      },\n\
      rejoin: function() {\n\
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipSort(a, b) {\n\
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);\n\
  }\n\
  function d3_geo_pointInPolygon(point, polygon) {\n\
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;\n\
    d3_geo_areaRingSum.reset();\n\
    for (var i = 0, n = polygon.length; i < n; ++i) {\n\
      var ring = polygon[i], m = ring.length;\n\
      if (!m) continue;\n\
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;\n\
      while (true) {\n\
        if (j === m) j = 0;\n\
        point = ring[j];\n\
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, antimeridian = abs(dλ) > π, k = sinφ0 * sinφ;\n\
        d3_geo_areaRingSum.add(Math.atan2(k * Math.sin(dλ), cosφ0 * cosφ + k * Math.cos(dλ)));\n\
        polarAngle += antimeridian ? dλ + (dλ >= 0 ? τ : -τ) : dλ;\n\
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {\n\
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));\n\
          d3_geo_cartesianNormalize(arc);\n\
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);\n\
          d3_geo_cartesianNormalize(intersection);\n\
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);\n\
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {\n\
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;\n\
          }\n\
        }\n\
        if (!j++) break;\n\
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;\n\
      }\n\
    }\n\
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < 0) ^ winding & 1;\n\
  }\n\
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);\n\
  function d3_geo_clipAntimeridianLine(listener) {\n\
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;\n\
    return {\n\
      lineStart: function() {\n\
        listener.lineStart();\n\
        clean = 1;\n\
      },\n\
      point: function(λ1, φ1) {\n\
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);\n\
        if (abs(dλ - π) < ε) {\n\
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          listener.point(λ1, φ0);\n\
          clean = 0;\n\
        } else if (sλ0 !== sλ1 && dλ >= π) {\n\
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;\n\
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;\n\
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);\n\
          listener.point(sλ0, φ0);\n\
          listener.lineEnd();\n\
          listener.lineStart();\n\
          listener.point(sλ1, φ0);\n\
          clean = 0;\n\
        }\n\
        listener.point(λ0 = λ1, φ0 = φ1);\n\
        sλ0 = sλ1;\n\
      },\n\
      lineEnd: function() {\n\
        listener.lineEnd();\n\
        λ0 = φ0 = NaN;\n\
      },\n\
      clean: function() {\n\
        return 2 - clean;\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {\n\
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);\n\
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;\n\
  }\n\
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {\n\
    var φ;\n\
    if (from == null) {\n\
      φ = direction * halfπ;\n\
      listener.point(-π, φ);\n\
      listener.point(0, φ);\n\
      listener.point(π, φ);\n\
      listener.point(π, 0);\n\
      listener.point(π, -φ);\n\
      listener.point(0, -φ);\n\
      listener.point(-π, -φ);\n\
      listener.point(-π, 0);\n\
      listener.point(-π, φ);\n\
    } else if (abs(from[0] - to[0]) > ε) {\n\
      var s = from[0] < to[0] ? π : -π;\n\
      φ = direction * s / 2;\n\
      listener.point(-s, φ);\n\
      listener.point(0, φ);\n\
      listener.point(s, φ);\n\
    } else {\n\
      listener.point(to[0], to[1]);\n\
    }\n\
  }\n\
  function d3_geo_clipCircle(radius) {\n\
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);\n\
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);\n\
    function visible(λ, φ) {\n\
      return Math.cos(λ) * Math.cos(φ) > cr;\n\
    }\n\
    function clipLine(listener) {\n\
      var point0, c0, v0, v00, clean;\n\
      return {\n\
        lineStart: function() {\n\
          v00 = v0 = false;\n\
          clean = 1;\n\
        },\n\
        point: function(λ, φ) {\n\
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;\n\
          if (!point0 && (v00 = v0 = v)) listener.lineStart();\n\
          if (v !== v0) {\n\
            point2 = intersect(point0, point1);\n\
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {\n\
              point1[0] += ε;\n\
              point1[1] += ε;\n\
              v = visible(point1[0], point1[1]);\n\
            }\n\
          }\n\
          if (v !== v0) {\n\
            clean = 0;\n\
            if (v) {\n\
              listener.lineStart();\n\
              point2 = intersect(point1, point0);\n\
              listener.point(point2[0], point2[1]);\n\
            } else {\n\
              point2 = intersect(point0, point1);\n\
              listener.point(point2[0], point2[1]);\n\
              listener.lineEnd();\n\
            }\n\
            point0 = point2;\n\
          } else if (notHemisphere && point0 && smallRadius ^ v) {\n\
            var t;\n\
            if (!(c & c0) && (t = intersect(point1, point0, true))) {\n\
              clean = 0;\n\
              if (smallRadius) {\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
              } else {\n\
                listener.point(t[1][0], t[1][1]);\n\
                listener.lineEnd();\n\
                listener.lineStart();\n\
                listener.point(t[0][0], t[0][1]);\n\
              }\n\
            }\n\
          }\n\
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {\n\
            listener.point(point1[0], point1[1]);\n\
          }\n\
          point0 = point1, v0 = v, c0 = c;\n\
        },\n\
        lineEnd: function() {\n\
          if (v0) listener.lineEnd();\n\
          point0 = null;\n\
        },\n\
        clean: function() {\n\
          return clean | (v00 && v0) << 1;\n\
        }\n\
      };\n\
    }\n\
    function intersect(a, b, two) {\n\
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);\n\
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;\n\
      if (!determinant) return !two && a;\n\
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);\n\
      d3_geo_cartesianAdd(A, B);\n\
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);\n\
      if (t2 < 0) return;\n\
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);\n\
      d3_geo_cartesianAdd(q, A);\n\
      q = d3_geo_spherical(q);\n\
      if (!two) return q;\n\
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;\n\
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;\n\
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;\n\
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;\n\
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {\n\
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);\n\
        d3_geo_cartesianAdd(q1, A);\n\
        return [ q, d3_geo_spherical(q1) ];\n\
      }\n\
    }\n\
    function code(λ, φ) {\n\
      var r = smallRadius ? radius : π - radius, code = 0;\n\
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;\n\
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;\n\
      return code;\n\
    }\n\
  }\n\
  function d3_geom_clipLine(x0, y0, x1, y1) {\n\
    return function(line) {\n\
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;\n\
      r = x0 - ax;\n\
      if (!dx && r > 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dx > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = x1 - ax;\n\
      if (!dx && r < 0) return;\n\
      r /= dx;\n\
      if (dx < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dx > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      r = y0 - ay;\n\
      if (!dy && r > 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      } else if (dy > 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      }\n\
      r = y1 - ay;\n\
      if (!dy && r < 0) return;\n\
      r /= dy;\n\
      if (dy < 0) {\n\
        if (r > t1) return;\n\
        if (r > t0) t0 = r;\n\
      } else if (dy > 0) {\n\
        if (r < t0) return;\n\
        if (r < t1) t1 = r;\n\
      }\n\
      if (t0 > 0) line.a = {\n\
        x: ax + t0 * dx,\n\
        y: ay + t0 * dy\n\
      };\n\
      if (t1 < 1) line.b = {\n\
        x: ax + t1 * dx,\n\
        y: ay + t1 * dy\n\
      };\n\
      return line;\n\
    };\n\
  }\n\
  var d3_geo_clipExtentMAX = 1e9;\n\
  d3.geo.clipExtent = function() {\n\
    var x0, y0, x1, y1, stream, clip, clipExtent = {\n\
      stream: function(output) {\n\
        if (stream) stream.valid = false;\n\
        stream = clip(output);\n\
        stream.valid = true;\n\
        return stream;\n\
      },\n\
      extent: function(_) {\n\
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);\n\
        if (stream) stream.valid = false, stream = null;\n\
        return clipExtent;\n\
      }\n\
    };\n\
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);\n\
  };\n\
  function d3_geo_clipExtent(x0, y0, x1, y1) {\n\
    return function(listener) {\n\
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;\n\
      var clip = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          listener = bufferListener;\n\
          segments = [];\n\
          polygon = [];\n\
          clean = true;\n\
        },\n\
        polygonEnd: function() {\n\
          listener = listener_;\n\
          segments = d3.merge(segments);\n\
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;\n\
          if (inside || visible) {\n\
            listener.polygonStart();\n\
            if (inside) {\n\
              listener.lineStart();\n\
              interpolate(null, null, 1, listener);\n\
              listener.lineEnd();\n\
            }\n\
            if (visible) {\n\
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);\n\
            }\n\
            listener.polygonEnd();\n\
          }\n\
          segments = polygon = ring = null;\n\
        }\n\
      };\n\
      function insidePolygon(p) {\n\
        var wn = 0, n = polygon.length, y = p[1];\n\
        for (var i = 0; i < n; ++i) {\n\
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {\n\
            b = v[j];\n\
            if (a[1] <= y) {\n\
              if (b[1] > y && isLeft(a, b, p) > 0) ++wn;\n\
            } else {\n\
              if (b[1] <= y && isLeft(a, b, p) < 0) --wn;\n\
            }\n\
            a = b;\n\
          }\n\
        }\n\
        return wn !== 0;\n\
      }\n\
      function isLeft(a, b, c) {\n\
        return (b[0] - a[0]) * (c[1] - a[1]) - (c[0] - a[0]) * (b[1] - a[1]);\n\
      }\n\
      function interpolate(from, to, direction, listener) {\n\
        var a = 0, a1 = 0;\n\
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {\n\
          do {\n\
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);\n\
          } while ((a = (a + direction + 4) % 4) !== a1);\n\
        } else {\n\
          listener.point(to[0], to[1]);\n\
        }\n\
      }\n\
      function pointVisible(x, y) {\n\
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;\n\
      }\n\
      function point(x, y) {\n\
        if (pointVisible(x, y)) listener.point(x, y);\n\
      }\n\
      var x__, y__, v__, x_, y_, v_, first, clean;\n\
      function lineStart() {\n\
        clip.point = linePoint;\n\
        if (polygon) polygon.push(ring = []);\n\
        first = true;\n\
        v_ = false;\n\
        x_ = y_ = NaN;\n\
      }\n\
      function lineEnd() {\n\
        if (segments) {\n\
          linePoint(x__, y__);\n\
          if (v__ && v_) bufferListener.rejoin();\n\
          segments.push(bufferListener.buffer());\n\
        }\n\
        clip.point = point;\n\
        if (v_) listener.lineEnd();\n\
      }\n\
      function linePoint(x, y) {\n\
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));\n\
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));\n\
        var v = pointVisible(x, y);\n\
        if (polygon) ring.push([ x, y ]);\n\
        if (first) {\n\
          x__ = x, y__ = y, v__ = v;\n\
          first = false;\n\
          if (v) {\n\
            listener.lineStart();\n\
            listener.point(x, y);\n\
          }\n\
        } else {\n\
          if (v && v_) listener.point(x, y); else {\n\
            var l = {\n\
              a: {\n\
                x: x_,\n\
                y: y_\n\
              },\n\
              b: {\n\
                x: x,\n\
                y: y\n\
              }\n\
            };\n\
            if (clipLine(l)) {\n\
              if (!v_) {\n\
                listener.lineStart();\n\
                listener.point(l.a.x, l.a.y);\n\
              }\n\
              listener.point(l.b.x, l.b.y);\n\
              if (!v) listener.lineEnd();\n\
              clean = false;\n\
            } else if (v) {\n\
              listener.lineStart();\n\
              listener.point(x, y);\n\
              clean = false;\n\
            }\n\
          }\n\
        }\n\
        x_ = x, y_ = y, v_ = v;\n\
      }\n\
      return clip;\n\
    };\n\
    function corner(p, direction) {\n\
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;\n\
    }\n\
    function compare(a, b) {\n\
      return comparePoints(a.x, b.x);\n\
    }\n\
    function comparePoints(a, b) {\n\
      var ca = corner(a, 1), cb = corner(b, 1);\n\
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];\n\
    }\n\
  }\n\
  function d3_geo_compose(a, b) {\n\
    function compose(x, y) {\n\
      return x = a(x, y), b(x[0], x[1]);\n\
    }\n\
    if (a.invert && b.invert) compose.invert = function(x, y) {\n\
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);\n\
    };\n\
    return compose;\n\
  }\n\
  function d3_geo_conic(projectAt) {\n\
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);\n\
    p.parallels = function(_) {\n\
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];\n\
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);\n\
    };\n\
    return p;\n\
  }\n\
  function d3_geo_conicEqualArea(φ0, φ1) {\n\
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;\n\
    function forward(λ, φ) {\n\
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;\n\
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = ρ0 - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEqualArea = function() {\n\
    return d3_geo_conic(d3_geo_conicEqualArea);\n\
  }).raw = d3_geo_conicEqualArea;\n\
  d3.geo.albers = function() {\n\
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);\n\
  };\n\
  d3.geo.albersUsa = function() {\n\
    var lower48 = d3.geo.albers();\n\
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);\n\
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);\n\
    var point, pointStream = {\n\
      point: function(x, y) {\n\
        point = [ x, y ];\n\
      }\n\
    }, lower48Point, alaskaPoint, hawaiiPoint;\n\
    function albersUsa(coordinates) {\n\
      var x = coordinates[0], y = coordinates[1];\n\
      point = null;\n\
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);\n\
      return point;\n\
    }\n\
    albersUsa.invert = function(coordinates) {\n\
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;\n\
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);\n\
    };\n\
    albersUsa.stream = function(stream) {\n\
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);\n\
      return {\n\
        point: function(x, y) {\n\
          lower48Stream.point(x, y);\n\
          alaskaStream.point(x, y);\n\
          hawaiiStream.point(x, y);\n\
        },\n\
        sphere: function() {\n\
          lower48Stream.sphere();\n\
          alaskaStream.sphere();\n\
          hawaiiStream.sphere();\n\
        },\n\
        lineStart: function() {\n\
          lower48Stream.lineStart();\n\
          alaskaStream.lineStart();\n\
          hawaiiStream.lineStart();\n\
        },\n\
        lineEnd: function() {\n\
          lower48Stream.lineEnd();\n\
          alaskaStream.lineEnd();\n\
          hawaiiStream.lineEnd();\n\
        },\n\
        polygonStart: function() {\n\
          lower48Stream.polygonStart();\n\
          alaskaStream.polygonStart();\n\
          hawaiiStream.polygonStart();\n\
        },\n\
        polygonEnd: function() {\n\
          lower48Stream.polygonEnd();\n\
          alaskaStream.polygonEnd();\n\
          hawaiiStream.polygonEnd();\n\
        }\n\
      };\n\
    };\n\
    albersUsa.precision = function(_) {\n\
      if (!arguments.length) return lower48.precision();\n\
      lower48.precision(_);\n\
      alaska.precision(_);\n\
      hawaii.precision(_);\n\
      return albersUsa;\n\
    };\n\
    albersUsa.scale = function(_) {\n\
      if (!arguments.length) return lower48.scale();\n\
      lower48.scale(_);\n\
      alaska.scale(_ * .35);\n\
      hawaii.scale(_);\n\
      return albersUsa.translate(lower48.translate());\n\
    };\n\
    albersUsa.translate = function(_) {\n\
      if (!arguments.length) return lower48.translate();\n\
      var k = lower48.scale(), x = +_[0], y = +_[1];\n\
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;\n\
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;\n\
      return albersUsa;\n\
    };\n\
    return albersUsa.scale(1070);\n\
  };\n\
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {\n\
    point: d3_noop,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: function() {\n\
      d3_geo_pathAreaPolygon = 0;\n\
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;\n\
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);\n\
    }\n\
  };\n\
  function d3_geo_pathAreaRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathArea.point = function(x, y) {\n\
      d3_geo_pathArea.point = nextPoint;\n\
      x00 = x0 = x, y00 = y0 = y;\n\
    };\n\
    function nextPoint(x, y) {\n\
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;\n\
      x0 = x, y0 = y;\n\
    }\n\
    d3_geo_pathArea.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;\n\
  var d3_geo_pathBounds = {\n\
    point: d3_geo_pathBoundsPoint,\n\
    lineStart: d3_noop,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_pathBoundsPoint(x, y) {\n\
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;\n\
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;\n\
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;\n\
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;\n\
  }\n\
  function d3_geo_pathBuffer() {\n\
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointCircle = d3_geo_pathBufferCircle(_);\n\
        return stream;\n\
      },\n\
      result: function() {\n\
        if (buffer.length) {\n\
          var result = buffer.join(\"\");\n\
          buffer = [];\n\
          return result;\n\
        }\n\
      }\n\
    };\n\
    function point(x, y) {\n\
      buffer.push(\"M\", x, \",\", y, pointCircle);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      buffer.push(\"M\", x, \",\", y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      buffer.push(\"L\", x, \",\", y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      buffer.push(\"Z\");\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_pathBufferCircle(radius) {\n\
    return \"m0,\" + radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + -2 * radius + \"a\" + radius + \",\" + radius + \" 0 1,1 0,\" + 2 * radius + \"z\";\n\
  }\n\
  var d3_geo_pathCentroid = {\n\
    point: d3_geo_pathCentroidPoint,\n\
    lineStart: d3_geo_pathCentroidLineStart,\n\
    lineEnd: d3_geo_pathCentroidLineEnd,\n\
    polygonStart: function() {\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;\n\
    },\n\
    polygonEnd: function() {\n\
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;\n\
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;\n\
    }\n\
  };\n\
  function d3_geo_pathCentroidPoint(x, y) {\n\
    d3_geo_centroidX0 += x;\n\
    d3_geo_centroidY0 += y;\n\
    ++d3_geo_centroidZ0;\n\
  }\n\
  function d3_geo_pathCentroidLineStart() {\n\
    var x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
  }\n\
  function d3_geo_pathCentroidLineEnd() {\n\
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;\n\
  }\n\
  function d3_geo_pathCentroidRingStart() {\n\
    var x00, y00, x0, y0;\n\
    d3_geo_pathCentroid.point = function(x, y) {\n\
      d3_geo_pathCentroid.point = nextPoint;\n\
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);\n\
    };\n\
    function nextPoint(x, y) {\n\
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);\n\
      d3_geo_centroidX1 += z * (x0 + x) / 2;\n\
      d3_geo_centroidY1 += z * (y0 + y) / 2;\n\
      d3_geo_centroidZ1 += z;\n\
      z = y0 * x - x0 * y;\n\
      d3_geo_centroidX2 += z * (x0 + x);\n\
      d3_geo_centroidY2 += z * (y0 + y);\n\
      d3_geo_centroidZ2 += z * 3;\n\
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);\n\
    }\n\
    d3_geo_pathCentroid.lineEnd = function() {\n\
      nextPoint(x00, y00);\n\
    };\n\
  }\n\
  function d3_geo_pathContext(context) {\n\
    var pointRadius = 4.5;\n\
    var stream = {\n\
      point: point,\n\
      lineStart: function() {\n\
        stream.point = pointLineStart;\n\
      },\n\
      lineEnd: lineEnd,\n\
      polygonStart: function() {\n\
        stream.lineEnd = lineEndPolygon;\n\
      },\n\
      polygonEnd: function() {\n\
        stream.lineEnd = lineEnd;\n\
        stream.point = point;\n\
      },\n\
      pointRadius: function(_) {\n\
        pointRadius = _;\n\
        return stream;\n\
      },\n\
      result: d3_noop\n\
    };\n\
    function point(x, y) {\n\
      context.moveTo(x, y);\n\
      context.arc(x, y, pointRadius, 0, τ);\n\
    }\n\
    function pointLineStart(x, y) {\n\
      context.moveTo(x, y);\n\
      stream.point = pointLine;\n\
    }\n\
    function pointLine(x, y) {\n\
      context.lineTo(x, y);\n\
    }\n\
    function lineEnd() {\n\
      stream.point = point;\n\
    }\n\
    function lineEndPolygon() {\n\
      context.closePath();\n\
    }\n\
    return stream;\n\
  }\n\
  function d3_geo_resample(project) {\n\
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;\n\
    function resample(stream) {\n\
      return (maxDepth ? resampleRecursive : resampleNone)(stream);\n\
    }\n\
    function resampleNone(stream) {\n\
      return d3_geo_transformPoint(stream, function(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      });\n\
    }\n\
    function resampleRecursive(stream) {\n\
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;\n\
      var resample = {\n\
        point: point,\n\
        lineStart: lineStart,\n\
        lineEnd: lineEnd,\n\
        polygonStart: function() {\n\
          stream.polygonStart();\n\
          resample.lineStart = ringStart;\n\
        },\n\
        polygonEnd: function() {\n\
          stream.polygonEnd();\n\
          resample.lineStart = lineStart;\n\
        }\n\
      };\n\
      function point(x, y) {\n\
        x = project(x, y);\n\
        stream.point(x[0], x[1]);\n\
      }\n\
      function lineStart() {\n\
        x0 = NaN;\n\
        resample.point = linePoint;\n\
        stream.lineStart();\n\
      }\n\
      function linePoint(λ, φ) {\n\
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);\n\
        stream.point(x0, y0);\n\
      }\n\
      function lineEnd() {\n\
        resample.point = point;\n\
        stream.lineEnd();\n\
      }\n\
      function ringStart() {\n\
        lineStart();\n\
        resample.point = ringPoint;\n\
        resample.lineEnd = ringEnd;\n\
      }\n\
      function ringPoint(λ, φ) {\n\
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;\n\
        resample.point = linePoint;\n\
      }\n\
      function ringEnd() {\n\
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);\n\
        resample.lineEnd = lineEnd;\n\
        lineEnd();\n\
      }\n\
      return resample;\n\
    }\n\
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {\n\
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;\n\
      if (d2 > 4 * δ2 && depth--) {\n\
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;\n\
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {\n\
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);\n\
          stream.point(x2, y2);\n\
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);\n\
        }\n\
      }\n\
    }\n\
    resample.precision = function(_) {\n\
      if (!arguments.length) return Math.sqrt(δ2);\n\
      maxDepth = (δ2 = _ * _) > 0 && 16;\n\
      return resample;\n\
    };\n\
    return resample;\n\
  }\n\
  d3.geo.path = function() {\n\
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;\n\
    function path(object) {\n\
      if (object) {\n\
        if (typeof pointRadius === \"function\") contextStream.pointRadius(+pointRadius.apply(this, arguments));\n\
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);\n\
        d3.geo.stream(object, cacheStream);\n\
      }\n\
      return contextStream.result();\n\
    }\n\
    path.area = function(object) {\n\
      d3_geo_pathAreaSum = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathArea));\n\
      return d3_geo_pathAreaSum;\n\
    };\n\
    path.centroid = function(object) {\n\
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;\n\
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));\n\
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];\n\
    };\n\
    path.bounds = function(object) {\n\
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);\n\
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));\n\
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];\n\
    };\n\
    path.projection = function(_) {\n\
      if (!arguments.length) return projection;\n\
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;\n\
      return reset();\n\
    };\n\
    path.context = function(_) {\n\
      if (!arguments.length) return context;\n\
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);\n\
      if (typeof pointRadius !== \"function\") contextStream.pointRadius(pointRadius);\n\
      return reset();\n\
    };\n\
    path.pointRadius = function(_) {\n\
      if (!arguments.length) return pointRadius;\n\
      pointRadius = typeof _ === \"function\" ? _ : (contextStream.pointRadius(+_), +_);\n\
      return path;\n\
    };\n\
    function reset() {\n\
      cacheStream = null;\n\
      return path;\n\
    }\n\
    return path.projection(d3.geo.albersUsa()).context(null);\n\
  };\n\
  function d3_geo_pathProjectStream(project) {\n\
    var resample = d3_geo_resample(function(x, y) {\n\
      return project([ x * d3_degrees, y * d3_degrees ]);\n\
    });\n\
    return function(stream) {\n\
      return d3_geo_projectionRadians(resample(stream));\n\
    };\n\
  }\n\
  d3.geo.transform = function(methods) {\n\
    return {\n\
      stream: function(stream) {\n\
        var transform = new d3_geo_transform(stream);\n\
        for (var k in methods) transform[k] = methods[k];\n\
        return transform;\n\
      }\n\
    };\n\
  };\n\
  function d3_geo_transform(stream) {\n\
    this.stream = stream;\n\
  }\n\
  d3_geo_transform.prototype = {\n\
    point: function(x, y) {\n\
      this.stream.point(x, y);\n\
    },\n\
    sphere: function() {\n\
      this.stream.sphere();\n\
    },\n\
    lineStart: function() {\n\
      this.stream.lineStart();\n\
    },\n\
    lineEnd: function() {\n\
      this.stream.lineEnd();\n\
    },\n\
    polygonStart: function() {\n\
      this.stream.polygonStart();\n\
    },\n\
    polygonEnd: function() {\n\
      this.stream.polygonEnd();\n\
    }\n\
  };\n\
  function d3_geo_transformPoint(stream, point) {\n\
    return {\n\
      point: point,\n\
      sphere: function() {\n\
        stream.sphere();\n\
      },\n\
      lineStart: function() {\n\
        stream.lineStart();\n\
      },\n\
      lineEnd: function() {\n\
        stream.lineEnd();\n\
      },\n\
      polygonStart: function() {\n\
        stream.polygonStart();\n\
      },\n\
      polygonEnd: function() {\n\
        stream.polygonEnd();\n\
      }\n\
    };\n\
  }\n\
  d3.geo.projection = d3_geo_projection;\n\
  d3.geo.projectionMutator = d3_geo_projectionMutator;\n\
  function d3_geo_projection(project) {\n\
    return d3_geo_projectionMutator(function() {\n\
      return project;\n\
    })();\n\
  }\n\
  function d3_geo_projectionMutator(projectAt) {\n\
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {\n\
      x = project(x, y);\n\
      return [ x[0] * k + δx, δy - x[1] * k ];\n\
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;\n\
    function projection(point) {\n\
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);\n\
      return [ point[0] * k + δx, δy - point[1] * k ];\n\
    }\n\
    function invert(point) {\n\
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);\n\
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];\n\
    }\n\
    projection.stream = function(output) {\n\
      if (stream) stream.valid = false;\n\
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));\n\
      stream.valid = true;\n\
      return stream;\n\
    };\n\
    projection.clipAngle = function(_) {\n\
      if (!arguments.length) return clipAngle;\n\
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);\n\
      return invalidate();\n\
    };\n\
    projection.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent;\n\
      clipExtent = _;\n\
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;\n\
      return invalidate();\n\
    };\n\
    projection.scale = function(_) {\n\
      if (!arguments.length) return k;\n\
      k = +_;\n\
      return reset();\n\
    };\n\
    projection.translate = function(_) {\n\
      if (!arguments.length) return [ x, y ];\n\
      x = +_[0];\n\
      y = +_[1];\n\
      return reset();\n\
    };\n\
    projection.center = function(_) {\n\
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];\n\
      λ = _[0] % 360 * d3_radians;\n\
      φ = _[1] % 360 * d3_radians;\n\
      return reset();\n\
    };\n\
    projection.rotate = function(_) {\n\
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];\n\
      δλ = _[0] % 360 * d3_radians;\n\
      δφ = _[1] % 360 * d3_radians;\n\
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;\n\
      return reset();\n\
    };\n\
    d3.rebind(projection, projectResample, \"precision\");\n\
    function reset() {\n\
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);\n\
      var center = project(λ, φ);\n\
      δx = x - center[0] * k;\n\
      δy = y + center[1] * k;\n\
      return invalidate();\n\
    }\n\
    function invalidate() {\n\
      if (stream) stream.valid = false, stream = null;\n\
      return projection;\n\
    }\n\
    return function() {\n\
      project = projectAt.apply(this, arguments);\n\
      projection.invert = project.invert && invert;\n\
      return reset();\n\
    };\n\
  }\n\
  function d3_geo_projectionRadians(stream) {\n\
    return d3_geo_transformPoint(stream, function(x, y) {\n\
      stream.point(x * d3_radians, y * d3_radians);\n\
    });\n\
  }\n\
  function d3_geo_equirectangular(λ, φ) {\n\
    return [ λ, φ ];\n\
  }\n\
  (d3.geo.equirectangular = function() {\n\
    return d3_geo_projection(d3_geo_equirectangular);\n\
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;\n\
  d3.geo.rotation = function(rotate) {\n\
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);\n\
    function forward(coordinates) {\n\
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    }\n\
    forward.invert = function(coordinates) {\n\
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);\n\
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;\n\
    };\n\
    return forward;\n\
  };\n\
  function d3_geo_identityRotation(λ, φ) {\n\
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
  }\n\
  d3_geo_identityRotation.invert = d3_geo_equirectangular;\n\
  function d3_geo_rotation(δλ, δφ, δγ) {\n\
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;\n\
  }\n\
  function d3_geo_forwardRotationλ(δλ) {\n\
    return function(λ, φ) {\n\
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];\n\
    };\n\
  }\n\
  function d3_geo_rotationλ(δλ) {\n\
    var rotation = d3_geo_forwardRotationλ(δλ);\n\
    rotation.invert = d3_geo_forwardRotationλ(-δλ);\n\
    return rotation;\n\
  }\n\
  function d3_geo_rotationφγ(δφ, δγ) {\n\
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);\n\
    function rotation(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;\n\
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];\n\
    }\n\
    rotation.invert = function(λ, φ) {\n\
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;\n\
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];\n\
    };\n\
    return rotation;\n\
  }\n\
  d3.geo.circle = function() {\n\
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;\n\
    function circle() {\n\
      var center = typeof origin === \"function\" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];\n\
      interpolate(null, null, 1, {\n\
        point: function(x, y) {\n\
          ring.push(x = rotate(x, y));\n\
          x[0] *= d3_degrees, x[1] *= d3_degrees;\n\
        }\n\
      });\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ ring ]\n\
      };\n\
    }\n\
    circle.origin = function(x) {\n\
      if (!arguments.length) return origin;\n\
      origin = x;\n\
      return circle;\n\
    };\n\
    circle.angle = function(x) {\n\
      if (!arguments.length) return angle;\n\
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);\n\
      return circle;\n\
    };\n\
    circle.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);\n\
      return circle;\n\
    };\n\
    return circle.angle(90);\n\
  };\n\
  function d3_geo_circleInterpolate(radius, precision) {\n\
    var cr = Math.cos(radius), sr = Math.sin(radius);\n\
    return function(from, to, direction, listener) {\n\
      var step = direction * precision;\n\
      if (from != null) {\n\
        from = d3_geo_circleAngle(cr, from);\n\
        to = d3_geo_circleAngle(cr, to);\n\
        if (direction > 0 ? from < to : from > to) from += direction * τ;\n\
      } else {\n\
        from = radius + direction * τ;\n\
        to = radius - .5 * step;\n\
      }\n\
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {\n\
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);\n\
      }\n\
    };\n\
  }\n\
  function d3_geo_circleAngle(cr, point) {\n\
    var a = d3_geo_cartesian(point);\n\
    a[0] -= cr;\n\
    d3_geo_cartesianNormalize(a);\n\
    var angle = d3_acos(-a[1]);\n\
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);\n\
  }\n\
  d3.geo.distance = function(a, b) {\n\
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;\n\
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);\n\
  };\n\
  d3.geo.graticule = function() {\n\
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;\n\
    function graticule() {\n\
      return {\n\
        type: \"MultiLineString\",\n\
        coordinates: lines()\n\
      };\n\
    }\n\
    function lines() {\n\
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {\n\
        return abs(x % DX) > ε;\n\
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {\n\
        return abs(y % DY) > ε;\n\
      }).map(y));\n\
    }\n\
    graticule.lines = function() {\n\
      return lines().map(function(coordinates) {\n\
        return {\n\
          type: \"LineString\",\n\
          coordinates: coordinates\n\
        };\n\
      });\n\
    };\n\
    graticule.outline = function() {\n\
      return {\n\
        type: \"Polygon\",\n\
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]\n\
      };\n\
    };\n\
    graticule.extent = function(_) {\n\
      if (!arguments.length) return graticule.minorExtent();\n\
      return graticule.majorExtent(_).minorExtent(_);\n\
    };\n\
    graticule.majorExtent = function(_) {\n\
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];\n\
      X0 = +_[0][0], X1 = +_[1][0];\n\
      Y0 = +_[0][1], Y1 = +_[1][1];\n\
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;\n\
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.minorExtent = function(_) {\n\
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];\n\
      x0 = +_[0][0], x1 = +_[1][0];\n\
      y0 = +_[0][1], y1 = +_[1][1];\n\
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;\n\
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;\n\
      return graticule.precision(precision);\n\
    };\n\
    graticule.step = function(_) {\n\
      if (!arguments.length) return graticule.minorStep();\n\
      return graticule.majorStep(_).minorStep(_);\n\
    };\n\
    graticule.majorStep = function(_) {\n\
      if (!arguments.length) return [ DX, DY ];\n\
      DX = +_[0], DY = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.minorStep = function(_) {\n\
      if (!arguments.length) return [ dx, dy ];\n\
      dx = +_[0], dy = +_[1];\n\
      return graticule;\n\
    };\n\
    graticule.precision = function(_) {\n\
      if (!arguments.length) return precision;\n\
      precision = +_;\n\
      x = d3_geo_graticuleX(y0, y1, 90);\n\
      y = d3_geo_graticuleY(x0, x1, precision);\n\
      X = d3_geo_graticuleX(Y0, Y1, 90);\n\
      Y = d3_geo_graticuleY(X0, X1, precision);\n\
      return graticule;\n\
    };\n\
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);\n\
  };\n\
  function d3_geo_graticuleX(y0, y1, dy) {\n\
    var y = d3.range(y0, y1 - ε, dy).concat(y1);\n\
    return function(x) {\n\
      return y.map(function(y) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_geo_graticuleY(x0, x1, dx) {\n\
    var x = d3.range(x0, x1 - ε, dx).concat(x1);\n\
    return function(y) {\n\
      return x.map(function(x) {\n\
        return [ x, y ];\n\
      });\n\
    };\n\
  }\n\
  function d3_source(d) {\n\
    return d.source;\n\
  }\n\
  function d3_target(d) {\n\
    return d.target;\n\
  }\n\
  d3.geo.greatArc = function() {\n\
    var source = d3_source, source_, target = d3_target, target_;\n\
    function greatArc() {\n\
      return {\n\
        type: \"LineString\",\n\
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]\n\
      };\n\
    }\n\
    greatArc.distance = function() {\n\
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));\n\
    };\n\
    greatArc.source = function(_) {\n\
      if (!arguments.length) return source;\n\
      source = _, source_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.target = function(_) {\n\
      if (!arguments.length) return target;\n\
      target = _, target_ = typeof _ === \"function\" ? null : _;\n\
      return greatArc;\n\
    };\n\
    greatArc.precision = function() {\n\
      return arguments.length ? greatArc : 0;\n\
    };\n\
    return greatArc;\n\
  };\n\
  d3.geo.interpolate = function(source, target) {\n\
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);\n\
  };\n\
  function d3_geo_interpolate(x0, y0, x1, y1) {\n\
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);\n\
    var interpolate = d ? function(t) {\n\
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;\n\
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];\n\
    } : function() {\n\
      return [ x0 * d3_degrees, y0 * d3_degrees ];\n\
    };\n\
    interpolate.distance = d;\n\
    return interpolate;\n\
  }\n\
  d3.geo.length = function(object) {\n\
    d3_geo_lengthSum = 0;\n\
    d3.geo.stream(object, d3_geo_length);\n\
    return d3_geo_lengthSum;\n\
  };\n\
  var d3_geo_lengthSum;\n\
  var d3_geo_length = {\n\
    sphere: d3_noop,\n\
    point: d3_noop,\n\
    lineStart: d3_geo_lengthLineStart,\n\
    lineEnd: d3_noop,\n\
    polygonStart: d3_noop,\n\
    polygonEnd: d3_noop\n\
  };\n\
  function d3_geo_lengthLineStart() {\n\
    var λ0, sinφ0, cosφ0;\n\
    d3_geo_length.point = function(λ, φ) {\n\
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);\n\
      d3_geo_length.point = nextPoint;\n\
    };\n\
    d3_geo_length.lineEnd = function() {\n\
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;\n\
    };\n\
    function nextPoint(λ, φ) {\n\
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);\n\
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);\n\
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;\n\
    }\n\
  }\n\
  function d3_geo_azimuthal(scale, angle) {\n\
    function azimuthal(λ, φ) {\n\
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);\n\
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];\n\
    }\n\
    azimuthal.invert = function(x, y) {\n\
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);\n\
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];\n\
    };\n\
    return azimuthal;\n\
  }\n\
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return Math.sqrt(2 / (1 + cosλcosφ));\n\
  }, function(ρ) {\n\
    return 2 * Math.asin(ρ / 2);\n\
  });\n\
  (d3.geo.azimuthalEqualArea = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEqualArea);\n\
  }).raw = d3_geo_azimuthalEqualArea;\n\
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {\n\
    var c = Math.acos(cosλcosφ);\n\
    return c && c / Math.sin(c);\n\
  }, d3_identity);\n\
  (d3.geo.azimuthalEquidistant = function() {\n\
    return d3_geo_projection(d3_geo_azimuthalEquidistant);\n\
  }).raw = d3_geo_azimuthalEquidistant;\n\
  function d3_geo_conicConformal(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), t = function(φ) {\n\
      return Math.tan(π / 4 + φ / 2);\n\
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;\n\
    if (!n) return d3_geo_mercator;\n\
    function forward(λ, φ) {\n\
      var ρ = abs(abs(φ) - halfπ) < ε ? 0 : F / Math.pow(t(φ), n);\n\
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);\n\
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicConformal = function() {\n\
    return d3_geo_conic(d3_geo_conicConformal);\n\
  }).raw = d3_geo_conicConformal;\n\
  function d3_geo_conicEquidistant(φ0, φ1) {\n\
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;\n\
    if (abs(n) < ε) return d3_geo_equirectangular;\n\
    function forward(λ, φ) {\n\
      var ρ = G - φ;\n\
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];\n\
    }\n\
    forward.invert = function(x, y) {\n\
      var ρ0_y = G - y;\n\
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];\n\
    };\n\
    return forward;\n\
  }\n\
  (d3.geo.conicEquidistant = function() {\n\
    return d3_geo_conic(d3_geo_conicEquidistant);\n\
  }).raw = d3_geo_conicEquidistant;\n\
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / cosλcosφ;\n\
  }, Math.atan);\n\
  (d3.geo.gnomonic = function() {\n\
    return d3_geo_projection(d3_geo_gnomonic);\n\
  }).raw = d3_geo_gnomonic;\n\
  function d3_geo_mercator(λ, φ) {\n\
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];\n\
  }\n\
  d3_geo_mercator.invert = function(x, y) {\n\
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];\n\
  };\n\
  function d3_geo_mercatorProjection(project) {\n\
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;\n\
    m.scale = function() {\n\
      var v = scale.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.translate = function() {\n\
      var v = translate.apply(m, arguments);\n\
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;\n\
    };\n\
    m.clipExtent = function(_) {\n\
      var v = clipExtent.apply(m, arguments);\n\
      if (v === m) {\n\
        if (clipAuto = _ == null) {\n\
          var k = π * scale(), t = translate();\n\
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);\n\
        }\n\
      } else if (clipAuto) {\n\
        v = null;\n\
      }\n\
      return v;\n\
    };\n\
    return m.clipExtent(null);\n\
  }\n\
  (d3.geo.mercator = function() {\n\
    return d3_geo_mercatorProjection(d3_geo_mercator);\n\
  }).raw = d3_geo_mercator;\n\
  var d3_geo_orthographic = d3_geo_azimuthal(function() {\n\
    return 1;\n\
  }, Math.asin);\n\
  (d3.geo.orthographic = function() {\n\
    return d3_geo_projection(d3_geo_orthographic);\n\
  }).raw = d3_geo_orthographic;\n\
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {\n\
    return 1 / (1 + cosλcosφ);\n\
  }, function(ρ) {\n\
    return 2 * Math.atan(ρ);\n\
  });\n\
  (d3.geo.stereographic = function() {\n\
    return d3_geo_projection(d3_geo_stereographic);\n\
  }).raw = d3_geo_stereographic;\n\
  function d3_geo_transverseMercator(λ, φ) {\n\
    var B = Math.cos(φ) * Math.sin(λ);\n\
    return [ Math.log((1 + B) / (1 - B)) / 2, Math.atan2(Math.tan(φ), Math.cos(λ)) ];\n\
  }\n\
  d3_geo_transverseMercator.invert = function(x, y) {\n\
    return [ Math.atan2(d3_sinh(x), Math.cos(y)), d3_asin(Math.sin(y) / d3_cosh(x)) ];\n\
  };\n\
  (d3.geo.transverseMercator = function() {\n\
    return d3_geo_mercatorProjection(d3_geo_transverseMercator);\n\
  }).raw = d3_geo_transverseMercator;\n\
  d3.geom = {};\n\
  function d3_geom_pointX(d) {\n\
    return d[0];\n\
  }\n\
  function d3_geom_pointY(d) {\n\
    return d[1];\n\
  }\n\
  d3.geom.hull = function(vertices) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY;\n\
    if (arguments.length) return hull(vertices);\n\
    function hull(data) {\n\
      if (data.length < 3) return [];\n\
      var fx = d3_functor(x), fy = d3_functor(y), n = data.length, vertices, plen = n - 1, points = [], stack = [], d, i, j, h = 0, x1, y1, x2, y2, u, v, a, sp;\n\
      if (fx === d3_geom_pointX && y === d3_geom_pointY) vertices = data; else for (i = 0, \n\
      vertices = []; i < n; ++i) {\n\
        vertices.push([ +fx.call(this, d = data[i], i), +fy.call(this, d, i) ]);\n\
      }\n\
      for (i = 1; i < n; ++i) {\n\
        if (vertices[i][1] < vertices[h][1] || vertices[i][1] == vertices[h][1] && vertices[i][0] < vertices[h][0]) h = i;\n\
      }\n\
      for (i = 0; i < n; ++i) {\n\
        if (i === h) continue;\n\
        y1 = vertices[i][1] - vertices[h][1];\n\
        x1 = vertices[i][0] - vertices[h][0];\n\
        points.push({\n\
          angle: Math.atan2(y1, x1),\n\
          index: i\n\
        });\n\
      }\n\
      points.sort(function(a, b) {\n\
        return a.angle - b.angle;\n\
      });\n\
      a = points[0].angle;\n\
      v = points[0].index;\n\
      u = 0;\n\
      for (i = 1; i < plen; ++i) {\n\
        j = points[i].index;\n\
        if (a == points[i].angle) {\n\
          x1 = vertices[v][0] - vertices[h][0];\n\
          y1 = vertices[v][1] - vertices[h][1];\n\
          x2 = vertices[j][0] - vertices[h][0];\n\
          y2 = vertices[j][1] - vertices[h][1];\n\
          if (x1 * x1 + y1 * y1 >= x2 * x2 + y2 * y2) {\n\
            points[i].index = -1;\n\
            continue;\n\
          } else {\n\
            points[u].index = -1;\n\
          }\n\
        }\n\
        a = points[i].angle;\n\
        u = i;\n\
        v = j;\n\
      }\n\
      stack.push(h);\n\
      for (i = 0, j = 0; i < 2; ++j) {\n\
        if (points[j].index > -1) {\n\
          stack.push(points[j].index);\n\
          i++;\n\
        }\n\
      }\n\
      sp = stack.length;\n\
      for (;j < plen; ++j) {\n\
        if (points[j].index < 0) continue;\n\
        while (!d3_geom_hullCCW(stack[sp - 2], stack[sp - 1], points[j].index, vertices)) {\n\
          --sp;\n\
        }\n\
        stack[sp++] = points[j].index;\n\
      }\n\
      var poly = [];\n\
      for (i = sp - 1; i >= 0; --i) poly.push(data[stack[i]]);\n\
      return poly;\n\
    }\n\
    hull.x = function(_) {\n\
      return arguments.length ? (x = _, hull) : x;\n\
    };\n\
    hull.y = function(_) {\n\
      return arguments.length ? (y = _, hull) : y;\n\
    };\n\
    return hull;\n\
  };\n\
  function d3_geom_hullCCW(i1, i2, i3, v) {\n\
    var t, a, b, c, d, e, f;\n\
    t = v[i1];\n\
    a = t[0];\n\
    b = t[1];\n\
    t = v[i2];\n\
    c = t[0];\n\
    d = t[1];\n\
    t = v[i3];\n\
    e = t[0];\n\
    f = t[1];\n\
    return (f - b) * (c - a) - (d - b) * (e - a) > 0;\n\
  }\n\
  d3.geom.polygon = function(coordinates) {\n\
    d3_subclass(coordinates, d3_geom_polygonPrototype);\n\
    return coordinates;\n\
  };\n\
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];\n\
  d3_geom_polygonPrototype.area = function() {\n\
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      area += a[1] * b[0] - a[0] * b[1];\n\
    }\n\
    return area * .5;\n\
  };\n\
  d3_geom_polygonPrototype.centroid = function(k) {\n\
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;\n\
    if (!arguments.length) k = -1 / (6 * this.area());\n\
    while (++i < n) {\n\
      a = b;\n\
      b = this[i];\n\
      c = a[0] * b[1] - b[0] * a[1];\n\
      x += (a[0] + b[0]) * c;\n\
      y += (a[1] + b[1]) * c;\n\
    }\n\
    return [ x * k, y * k ];\n\
  };\n\
  d3_geom_polygonPrototype.clip = function(subject) {\n\
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;\n\
    while (++i < n) {\n\
      input = subject.slice();\n\
      subject.length = 0;\n\
      b = this[i];\n\
      c = input[(m = input.length - closed) - 1];\n\
      j = -1;\n\
      while (++j < m) {\n\
        d = input[j];\n\
        if (d3_geom_polygonInside(d, a, b)) {\n\
          if (!d3_geom_polygonInside(c, a, b)) {\n\
            subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
          }\n\
          subject.push(d);\n\
        } else if (d3_geom_polygonInside(c, a, b)) {\n\
          subject.push(d3_geom_polygonIntersect(c, d, a, b));\n\
        }\n\
        c = d;\n\
      }\n\
      if (closed) subject.push(subject[0]);\n\
      a = b;\n\
    }\n\
    return subject;\n\
  };\n\
  function d3_geom_polygonInside(p, a, b) {\n\
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);\n\
  }\n\
  function d3_geom_polygonIntersect(c, d, a, b) {\n\
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);\n\
    return [ x1 + ua * x21, y1 + ua * y21 ];\n\
  }\n\
  function d3_geom_polygonClosed(coordinates) {\n\
    var a = coordinates[0], b = coordinates[coordinates.length - 1];\n\
    return !(a[0] - b[0] || a[1] - b[1]);\n\
  }\n\
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];\n\
  function d3_geom_voronoiBeach() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.edge = this.site = this.circle = null;\n\
  }\n\
  function d3_geom_voronoiCreateBeach(site) {\n\
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();\n\
    beach.site = site;\n\
    return beach;\n\
  }\n\
  function d3_geom_voronoiDetachBeach(beach) {\n\
    d3_geom_voronoiDetachCircle(beach);\n\
    d3_geom_voronoiBeaches.remove(beach);\n\
    d3_geom_voronoiBeachPool.push(beach);\n\
    d3_geom_voronoiRedBlackNode(beach);\n\
  }\n\
  function d3_geom_voronoiRemoveBeach(beach) {\n\
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {\n\
      x: x,\n\
      y: y\n\
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];\n\
    d3_geom_voronoiDetachBeach(beach);\n\
    var lArc = previous;\n\
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {\n\
      previous = lArc.P;\n\
      disappearing.unshift(lArc);\n\
      d3_geom_voronoiDetachBeach(lArc);\n\
      lArc = previous;\n\
    }\n\
    disappearing.unshift(lArc);\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    var rArc = next;\n\
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {\n\
      next = rArc.N;\n\
      disappearing.push(rArc);\n\
      d3_geom_voronoiDetachBeach(rArc);\n\
      rArc = next;\n\
    }\n\
    disappearing.push(rArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var nArcs = disappearing.length, iArc;\n\
    for (iArc = 1; iArc < nArcs; ++iArc) {\n\
      rArc = disappearing[iArc];\n\
      lArc = disappearing[iArc - 1];\n\
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);\n\
    }\n\
    lArc = disappearing[0];\n\
    rArc = disappearing[nArcs - 1];\n\
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiAddBeach(site) {\n\
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;\n\
    while (node) {\n\
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;\n\
      if (dxl > ε) node = node.L; else {\n\
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);\n\
        if (dxr > ε) {\n\
          if (!node.R) {\n\
            lArc = node;\n\
            break;\n\
          }\n\
          node = node.R;\n\
        } else {\n\
          if (dxl > -ε) {\n\
            lArc = node.P;\n\
            rArc = node;\n\
          } else if (dxr > -ε) {\n\
            lArc = node;\n\
            rArc = node.N;\n\
          } else {\n\
            lArc = rArc = node;\n\
          }\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    var newArc = d3_geom_voronoiCreateBeach(site);\n\
    d3_geom_voronoiBeaches.insert(lArc, newArc);\n\
    if (!lArc && !rArc) return;\n\
    if (lArc === rArc) {\n\
      d3_geom_voronoiDetachCircle(lArc);\n\
      rArc = d3_geom_voronoiCreateBeach(lArc.site);\n\
      d3_geom_voronoiBeaches.insert(newArc, rArc);\n\
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      d3_geom_voronoiAttachCircle(lArc);\n\
      d3_geom_voronoiAttachCircle(rArc);\n\
      return;\n\
    }\n\
    if (!rArc) {\n\
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);\n\
      return;\n\
    }\n\
    d3_geom_voronoiDetachCircle(lArc);\n\
    d3_geom_voronoiDetachCircle(rArc);\n\
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {\n\
      x: (cy * hb - by * hc) / d + ax,\n\
      y: (bx * hc - cx * hb) / d + ay\n\
    };\n\
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);\n\
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);\n\
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);\n\
    d3_geom_voronoiAttachCircle(lArc);\n\
    d3_geom_voronoiAttachCircle(rArc);\n\
  }\n\
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {\n\
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;\n\
    if (!pby2) return rfocx;\n\
    var lArc = arc.P;\n\
    if (!lArc) return -Infinity;\n\
    site = lArc.site;\n\
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;\n\
    if (!plby2) return lfocx;\n\
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;\n\
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;\n\
    return (rfocx + lfocx) / 2;\n\
  }\n\
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {\n\
    var rArc = arc.N;\n\
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);\n\
    var site = arc.site;\n\
    return site.y === directrix ? site.x : Infinity;\n\
  }\n\
  function d3_geom_voronoiCell(site) {\n\
    this.site = site;\n\
    this.edges = [];\n\
  }\n\
  d3_geom_voronoiCell.prototype.prepare = function() {\n\
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;\n\
    while (iHalfEdge--) {\n\
      edge = halfEdges[iHalfEdge].edge;\n\
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);\n\
    }\n\
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);\n\
    return halfEdges.length;\n\
  };\n\
  function d3_geom_voronoiCloseCells(extent) {\n\
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;\n\
    while (iCell--) {\n\
      cell = cells[iCell];\n\
      if (!cell || !cell.prepare()) continue;\n\
      halfEdges = cell.edges;\n\
      nHalfEdges = halfEdges.length;\n\
      iHalfEdge = 0;\n\
      while (iHalfEdge < nHalfEdges) {\n\
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;\n\
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;\n\
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {\n\
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {\n\
            x: x0,\n\
            y: abs(x2 - x0) < ε ? y2 : y1\n\
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {\n\
            x: abs(y2 - y1) < ε ? x2 : x1,\n\
            y: y1\n\
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {\n\
            x: x1,\n\
            y: abs(x2 - x1) < ε ? y2 : y0\n\
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {\n\
            x: abs(y2 - y0) < ε ? x2 : x0,\n\
            y: y0\n\
          } : null), cell.site, null));\n\
          ++nHalfEdges;\n\
        }\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdgeOrder(a, b) {\n\
    return b.angle - a.angle;\n\
  }\n\
  function d3_geom_voronoiCircle() {\n\
    d3_geom_voronoiRedBlackNode(this);\n\
    this.x = this.y = this.arc = this.site = this.cy = null;\n\
  }\n\
  function d3_geom_voronoiAttachCircle(arc) {\n\
    var lArc = arc.P, rArc = arc.N;\n\
    if (!lArc || !rArc) return;\n\
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;\n\
    if (lSite === rSite) return;\n\
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;\n\
    var d = 2 * (ax * cy - ay * cx);\n\
    if (d >= -ε2) return;\n\
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;\n\
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();\n\
    circle.arc = arc;\n\
    circle.site = cSite;\n\
    circle.x = x + bx;\n\
    circle.y = cy + Math.sqrt(x * x + y * y);\n\
    circle.cy = cy;\n\
    arc.circle = circle;\n\
    var before = null, node = d3_geom_voronoiCircles._;\n\
    while (node) {\n\
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {\n\
        if (node.L) node = node.L; else {\n\
          before = node.P;\n\
          break;\n\
        }\n\
      } else {\n\
        if (node.R) node = node.R; else {\n\
          before = node;\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    d3_geom_voronoiCircles.insert(before, circle);\n\
    if (!before) d3_geom_voronoiFirstCircle = circle;\n\
  }\n\
  function d3_geom_voronoiDetachCircle(arc) {\n\
    var circle = arc.circle;\n\
    if (circle) {\n\
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;\n\
      d3_geom_voronoiCircles.remove(circle);\n\
      d3_geom_voronoiCirclePool.push(circle);\n\
      d3_geom_voronoiRedBlackNode(circle);\n\
      arc.circle = null;\n\
    }\n\
  }\n\
  function d3_geom_voronoiClipEdges(extent) {\n\
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;\n\
    while (i--) {\n\
      e = edges[i];\n\
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {\n\
        e.a = e.b = null;\n\
        edges.splice(i, 1);\n\
      }\n\
    }\n\
  }\n\
  function d3_geom_voronoiConnectEdge(edge, extent) {\n\
    var vb = edge.b;\n\
    if (vb) return true;\n\
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;\n\
    if (ry === ly) {\n\
      if (fx < x0 || fx >= x1) return;\n\
      if (lx > rx) {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y0\n\
        }; else if (va.y >= y1) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y1\n\
        };\n\
      } else {\n\
        if (!va) va = {\n\
          x: fx,\n\
          y: y1\n\
        }; else if (va.y < y0) return;\n\
        vb = {\n\
          x: fx,\n\
          y: y0\n\
        };\n\
      }\n\
    } else {\n\
      fm = (lx - rx) / (ry - ly);\n\
      fb = fy - fm * fx;\n\
      if (fm < -1 || fm > 1) {\n\
        if (lx > rx) {\n\
          if (!va) va = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          }; else if (va.y >= y1) return;\n\
          vb = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: (y1 - fb) / fm,\n\
            y: y1\n\
          }; else if (va.y < y0) return;\n\
          vb = {\n\
            x: (y0 - fb) / fm,\n\
            y: y0\n\
          };\n\
        }\n\
      } else {\n\
        if (ly < ry) {\n\
          if (!va) va = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          }; else if (va.x >= x1) return;\n\
          vb = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          };\n\
        } else {\n\
          if (!va) va = {\n\
            x: x1,\n\
            y: fm * x1 + fb\n\
          }; else if (va.x < x0) return;\n\
          vb = {\n\
            x: x0,\n\
            y: fm * x0 + fb\n\
          };\n\
        }\n\
      }\n\
    }\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    return true;\n\
  }\n\
  function d3_geom_voronoiEdge(lSite, rSite) {\n\
    this.l = lSite;\n\
    this.r = rSite;\n\
    this.a = this.b = null;\n\
  }\n\
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, rSite);\n\
    d3_geom_voronoiEdges.push(edge);\n\
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);\n\
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);\n\
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));\n\
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {\n\
    var edge = new d3_geom_voronoiEdge(lSite, null);\n\
    edge.a = va;\n\
    edge.b = vb;\n\
    d3_geom_voronoiEdges.push(edge);\n\
    return edge;\n\
  }\n\
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {\n\
    if (!edge.a && !edge.b) {\n\
      edge.a = vertex;\n\
      edge.l = lSite;\n\
      edge.r = rSite;\n\
    } else if (edge.l === rSite) {\n\
      edge.b = vertex;\n\
    } else {\n\
      edge.a = vertex;\n\
    }\n\
  }\n\
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {\n\
    var va = edge.a, vb = edge.b;\n\
    this.edge = edge;\n\
    this.site = lSite;\n\
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);\n\
  }\n\
  d3_geom_voronoiHalfEdge.prototype = {\n\
    start: function() {\n\
      return this.edge.l === this.site ? this.edge.a : this.edge.b;\n\
    },\n\
    end: function() {\n\
      return this.edge.l === this.site ? this.edge.b : this.edge.a;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackTree() {\n\
    this._ = null;\n\
  }\n\
  function d3_geom_voronoiRedBlackNode(node) {\n\
    node.U = node.C = node.L = node.R = node.P = node.N = null;\n\
  }\n\
  d3_geom_voronoiRedBlackTree.prototype = {\n\
    insert: function(after, node) {\n\
      var parent, grandpa, uncle;\n\
      if (after) {\n\
        node.P = after;\n\
        node.N = after.N;\n\
        if (after.N) after.N.P = node;\n\
        after.N = node;\n\
        if (after.R) {\n\
          after = after.R;\n\
          while (after.L) after = after.L;\n\
          after.L = node;\n\
        } else {\n\
          after.R = node;\n\
        }\n\
        parent = after;\n\
      } else if (this._) {\n\
        after = d3_geom_voronoiRedBlackFirst(this._);\n\
        node.P = null;\n\
        node.N = after;\n\
        after.P = after.L = node;\n\
        parent = after;\n\
      } else {\n\
        node.P = node.N = null;\n\
        this._ = node;\n\
        parent = null;\n\
      }\n\
      node.L = node.R = null;\n\
      node.U = parent;\n\
      node.C = true;\n\
      after = node;\n\
      while (parent && parent.C) {\n\
        grandpa = parent.U;\n\
        if (parent === grandpa.L) {\n\
          uncle = grandpa.R;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.R) {\n\
              d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);\n\
          }\n\
        } else {\n\
          uncle = grandpa.L;\n\
          if (uncle && uncle.C) {\n\
            parent.C = uncle.C = false;\n\
            grandpa.C = true;\n\
            after = grandpa;\n\
          } else {\n\
            if (after === parent.L) {\n\
              d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
              after = parent;\n\
              parent = after.U;\n\
            }\n\
            parent.C = false;\n\
            grandpa.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);\n\
          }\n\
        }\n\
        parent = after.U;\n\
      }\n\
      this._.C = false;\n\
    },\n\
    remove: function(node) {\n\
      if (node.N) node.N.P = node.P;\n\
      if (node.P) node.P.N = node.N;\n\
      node.N = node.P = null;\n\
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;\n\
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);\n\
      if (parent) {\n\
        if (parent.L === node) parent.L = next; else parent.R = next;\n\
      } else {\n\
        this._ = next;\n\
      }\n\
      if (left && right) {\n\
        red = next.C;\n\
        next.C = node.C;\n\
        next.L = left;\n\
        left.U = next;\n\
        if (next !== right) {\n\
          parent = next.U;\n\
          next.U = node.U;\n\
          node = next.R;\n\
          parent.L = node;\n\
          next.R = right;\n\
          right.U = next;\n\
        } else {\n\
          next.U = parent;\n\
          parent = next;\n\
          node = next.R;\n\
        }\n\
      } else {\n\
        red = node.C;\n\
        node = next;\n\
      }\n\
      if (node) node.U = parent;\n\
      if (red) return;\n\
      if (node && node.C) {\n\
        node.C = false;\n\
        return;\n\
      }\n\
      do {\n\
        if (node === this._) break;\n\
        if (node === parent.L) {\n\
          sibling = parent.R;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            sibling = parent.R;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.R || !sibling.R.C) {\n\
              sibling.L.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateRight(this, sibling);\n\
              sibling = parent.R;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.R.C = false;\n\
            d3_geom_voronoiRedBlackRotateLeft(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        } else {\n\
          sibling = parent.L;\n\
          if (sibling.C) {\n\
            sibling.C = false;\n\
            parent.C = true;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            sibling = parent.L;\n\
          }\n\
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {\n\
            if (!sibling.L || !sibling.L.C) {\n\
              sibling.R.C = false;\n\
              sibling.C = true;\n\
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);\n\
              sibling = parent.L;\n\
            }\n\
            sibling.C = parent.C;\n\
            parent.C = sibling.L.C = false;\n\
            d3_geom_voronoiRedBlackRotateRight(this, parent);\n\
            node = this._;\n\
            break;\n\
          }\n\
        }\n\
        sibling.C = true;\n\
        node = parent;\n\
        parent = parent.U;\n\
      } while (!node.C);\n\
      if (node) node.C = false;\n\
    }\n\
  };\n\
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {\n\
    var p = node, q = node.R, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.R = q.L;\n\
    if (p.R) p.R.U = p;\n\
    q.L = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {\n\
    var p = node, q = node.L, parent = p.U;\n\
    if (parent) {\n\
      if (parent.L === p) parent.L = q; else parent.R = q;\n\
    } else {\n\
      tree._ = q;\n\
    }\n\
    q.U = parent;\n\
    p.U = q;\n\
    p.L = q.R;\n\
    if (p.L) p.L.U = p;\n\
    q.R = p;\n\
  }\n\
  function d3_geom_voronoiRedBlackFirst(node) {\n\
    while (node.L) node = node.L;\n\
    return node;\n\
  }\n\
  function d3_geom_voronoi(sites, bbox) {\n\
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;\n\
    d3_geom_voronoiEdges = [];\n\
    d3_geom_voronoiCells = new Array(sites.length);\n\
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();\n\
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();\n\
    while (true) {\n\
      circle = d3_geom_voronoiFirstCircle;\n\
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {\n\
        if (site.x !== x0 || site.y !== y0) {\n\
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);\n\
          d3_geom_voronoiAddBeach(site);\n\
          x0 = site.x, y0 = site.y;\n\
        }\n\
        site = sites.pop();\n\
      } else if (circle) {\n\
        d3_geom_voronoiRemoveBeach(circle.arc);\n\
      } else {\n\
        break;\n\
      }\n\
    }\n\
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);\n\
    var diagram = {\n\
      cells: d3_geom_voronoiCells,\n\
      edges: d3_geom_voronoiEdges\n\
    };\n\
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;\n\
    return diagram;\n\
  }\n\
  function d3_geom_voronoiVertexOrder(a, b) {\n\
    return b.y - a.y || b.x - a.x;\n\
  }\n\
  d3.geom.voronoi = function(points) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;\n\
    if (points) return voronoi(points);\n\
    function voronoi(data) {\n\
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];\n\
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {\n\
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {\n\
          var s = e.start();\n\
          return [ s.x, s.y ];\n\
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];\n\
        polygon.point = data[i];\n\
      });\n\
      return polygons;\n\
    }\n\
    function sites(data) {\n\
      return data.map(function(d, i) {\n\
        return {\n\
          x: Math.round(fx(d, i) / ε) * ε,\n\
          y: Math.round(fy(d, i) / ε) * ε,\n\
          i: i\n\
        };\n\
      });\n\
    }\n\
    voronoi.links = function(data) {\n\
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {\n\
        return edge.l && edge.r;\n\
      }).map(function(edge) {\n\
        return {\n\
          source: data[edge.l.i],\n\
          target: data[edge.r.i]\n\
        };\n\
      });\n\
    };\n\
    voronoi.triangles = function(data) {\n\
      var triangles = [];\n\
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {\n\
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;\n\
        while (++j < m) {\n\
          e0 = e1;\n\
          s0 = s1;\n\
          e1 = edges[j].edge;\n\
          s1 = e1.l === site ? e1.r : e1.l;\n\
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {\n\
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);\n\
          }\n\
        }\n\
      });\n\
      return triangles;\n\
    };\n\
    voronoi.x = function(_) {\n\
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;\n\
    };\n\
    voronoi.y = function(_) {\n\
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;\n\
    };\n\
    voronoi.clipExtent = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;\n\
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;\n\
      return voronoi;\n\
    };\n\
    voronoi.size = function(_) {\n\
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];\n\
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);\n\
    };\n\
    return voronoi;\n\
  };\n\
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];\n\
  function d3_geom_voronoiTriangleArea(a, b, c) {\n\
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);\n\
  }\n\
  d3.geom.delaunay = function(vertices) {\n\
    return d3.geom.voronoi().triangles(vertices);\n\
  };\n\
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;\n\
    if (compat = arguments.length) {\n\
      x = d3_geom_quadtreeCompatX;\n\
      y = d3_geom_quadtreeCompatY;\n\
      if (compat === 3) {\n\
        y2 = y1;\n\
        x2 = x1;\n\
        y1 = x1 = 0;\n\
      }\n\
      return quadtree(points);\n\
    }\n\
    function quadtree(data) {\n\
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;\n\
      if (x1 != null) {\n\
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;\n\
      } else {\n\
        x2_ = y2_ = -(x1_ = y1_ = Infinity);\n\
        xs = [], ys = [];\n\
        n = data.length;\n\
        if (compat) for (i = 0; i < n; ++i) {\n\
          d = data[i];\n\
          if (d.x < x1_) x1_ = d.x;\n\
          if (d.y < y1_) y1_ = d.y;\n\
          if (d.x > x2_) x2_ = d.x;\n\
          if (d.y > y2_) y2_ = d.y;\n\
          xs.push(d.x);\n\
          ys.push(d.y);\n\
        } else for (i = 0; i < n; ++i) {\n\
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);\n\
          if (x_ < x1_) x1_ = x_;\n\
          if (y_ < y1_) y1_ = y_;\n\
          if (x_ > x2_) x2_ = x_;\n\
          if (y_ > y2_) y2_ = y_;\n\
          xs.push(x_);\n\
          ys.push(y_);\n\
        }\n\
      }\n\
      var dx = x2_ - x1_, dy = y2_ - y1_;\n\
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;\n\
      function insert(n, d, x, y, x1, y1, x2, y2) {\n\
        if (isNaN(x) || isNaN(y)) return;\n\
        if (n.leaf) {\n\
          var nx = n.x, ny = n.y;\n\
          if (nx != null) {\n\
            if (abs(nx - x) + abs(ny - y) < .01) {\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            } else {\n\
              var nPoint = n.point;\n\
              n.x = n.y = n.point = null;\n\
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);\n\
              insertChild(n, d, x, y, x1, y1, x2, y2);\n\
            }\n\
          } else {\n\
            n.x = x, n.y = y, n.point = d;\n\
          }\n\
        } else {\n\
          insertChild(n, d, x, y, x1, y1, x2, y2);\n\
        }\n\
      }\n\
      function insertChild(n, d, x, y, x1, y1, x2, y2) {\n\
        var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, right = x >= sx, bottom = y >= sy, i = (bottom << 1) + right;\n\
        n.leaf = false;\n\
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());\n\
        if (right) x1 = sx; else x2 = sx;\n\
        if (bottom) y1 = sy; else y2 = sy;\n\
        insert(n, d, x, y, x1, y1, x2, y2);\n\
      }\n\
      var root = d3_geom_quadtreeNode();\n\
      root.add = function(d) {\n\
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);\n\
      };\n\
      root.visit = function(f) {\n\
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);\n\
      };\n\
      i = -1;\n\
      if (x1 == null) {\n\
        while (++i < n) {\n\
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);\n\
        }\n\
        --i;\n\
      } else data.forEach(root.add);\n\
      xs = ys = data = d = null;\n\
      return root;\n\
    }\n\
    quadtree.x = function(_) {\n\
      return arguments.length ? (x = _, quadtree) : x;\n\
    };\n\
    quadtree.y = function(_) {\n\
      return arguments.length ? (y = _, quadtree) : y;\n\
    };\n\
    quadtree.extent = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], \n\
      y2 = +_[1][1];\n\
      return quadtree;\n\
    };\n\
    quadtree.size = function(_) {\n\
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];\n\
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];\n\
      return quadtree;\n\
    };\n\
    return quadtree;\n\
  };\n\
  function d3_geom_quadtreeCompatX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_geom_quadtreeCompatY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_geom_quadtreeNode() {\n\
    return {\n\
      leaf: true,\n\
      nodes: [],\n\
      point: null,\n\
      x: null,\n\
      y: null\n\
    };\n\
  }\n\
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {\n\
    if (!f(node, x1, y1, x2, y2)) {\n\
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;\n\
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);\n\
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);\n\
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);\n\
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);\n\
    }\n\
  }\n\
  d3.interpolateRgb = d3_interpolateRgb;\n\
  function d3_interpolateRgb(a, b) {\n\
    a = d3.rgb(a);\n\
    b = d3.rgb(b);\n\
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;\n\
    return function(t) {\n\
      return \"#\" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));\n\
    };\n\
  }\n\
  d3.interpolateObject = d3_interpolateObject;\n\
  function d3_interpolateObject(a, b) {\n\
    var i = {}, c = {}, k;\n\
    for (k in a) {\n\
      if (k in b) {\n\
        i[k] = d3_interpolate(a[k], b[k]);\n\
      } else {\n\
        c[k] = a[k];\n\
      }\n\
    }\n\
    for (k in b) {\n\
      if (!(k in a)) {\n\
        c[k] = b[k];\n\
      }\n\
    }\n\
    return function(t) {\n\
      for (k in i) c[k] = i[k](t);\n\
      return c;\n\
    };\n\
  }\n\
  d3.interpolateNumber = d3_interpolateNumber;\n\
  function d3_interpolateNumber(a, b) {\n\
    b -= a = +a;\n\
    return function(t) {\n\
      return a + b * t;\n\
    };\n\
  }\n\
  d3.interpolateString = d3_interpolateString;\n\
  function d3_interpolateString(a, b) {\n\
    var m, i, j, s0 = 0, s1 = 0, s = [], q = [], n, o;\n\
    a = a + \"\", b = b + \"\";\n\
    d3_interpolate_number.lastIndex = 0;\n\
    for (i = 0; m = d3_interpolate_number.exec(b); ++i) {\n\
      if (m.index) s.push(b.substring(s0, s1 = m.index));\n\
      q.push({\n\
        i: s.length,\n\
        x: m[0]\n\
      });\n\
      s.push(null);\n\
      s0 = d3_interpolate_number.lastIndex;\n\
    }\n\
    if (s0 < b.length) s.push(b.substring(s0));\n\
    for (i = 0, n = q.length; (m = d3_interpolate_number.exec(a)) && i < n; ++i) {\n\
      o = q[i];\n\
      if (o.x == m[0]) {\n\
        if (o.i) {\n\
          if (s[o.i + 1] == null) {\n\
            s[o.i - 1] += o.x;\n\
            s.splice(o.i, 1);\n\
            for (j = i + 1; j < n; ++j) q[j].i--;\n\
          } else {\n\
            s[o.i - 1] += o.x + s[o.i + 1];\n\
            s.splice(o.i, 2);\n\
            for (j = i + 1; j < n; ++j) q[j].i -= 2;\n\
          }\n\
        } else {\n\
          if (s[o.i + 1] == null) {\n\
            s[o.i] = o.x;\n\
          } else {\n\
            s[o.i] = o.x + s[o.i + 1];\n\
            s.splice(o.i + 1, 1);\n\
            for (j = i + 1; j < n; ++j) q[j].i--;\n\
          }\n\
        }\n\
        q.splice(i, 1);\n\
        n--;\n\
        i--;\n\
      } else {\n\
        o.x = d3_interpolateNumber(parseFloat(m[0]), parseFloat(o.x));\n\
      }\n\
    }\n\
    while (i < n) {\n\
      o = q.pop();\n\
      if (s[o.i + 1] == null) {\n\
        s[o.i] = o.x;\n\
      } else {\n\
        s[o.i] = o.x + s[o.i + 1];\n\
        s.splice(o.i + 1, 1);\n\
      }\n\
      n--;\n\
    }\n\
    if (s.length === 1) {\n\
      return s[0] == null ? (o = q[0].x, function(t) {\n\
        return o(t) + \"\";\n\
      }) : function() {\n\
        return b;\n\
      };\n\
    }\n\
    return function(t) {\n\
      for (i = 0; i < n; ++i) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    };\n\
  }\n\
  var d3_interpolate_number = /[-+]?(?:\\d+\\.?\\d*|\\.?\\d+)(?:[eE][-+]?\\d+)?/g;\n\
  d3.interpolate = d3_interpolate;\n\
  function d3_interpolate(a, b) {\n\
    var i = d3.interpolators.length, f;\n\
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;\n\
    return f;\n\
  }\n\
  d3.interpolators = [ function(a, b) {\n\
    var t = typeof b;\n\
    return (t === \"string\" ? d3_rgb_names.has(b) || /^(#|rgb\\(|hsl\\()/.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_Color ? d3_interpolateRgb : t === \"object\" ? Array.isArray(b) ? d3_interpolateArray : d3_interpolateObject : d3_interpolateNumber)(a, b);\n\
  } ];\n\
  d3.interpolateArray = d3_interpolateArray;\n\
  function d3_interpolateArray(a, b) {\n\
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;\n\
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));\n\
    for (;i < na; ++i) c[i] = a[i];\n\
    for (;i < nb; ++i) c[i] = b[i];\n\
    return function(t) {\n\
      for (i = 0; i < n0; ++i) c[i] = x[i](t);\n\
      return c;\n\
    };\n\
  }\n\
  var d3_ease_default = function() {\n\
    return d3_identity;\n\
  };\n\
  var d3_ease = d3.map({\n\
    linear: d3_ease_default,\n\
    poly: d3_ease_poly,\n\
    quad: function() {\n\
      return d3_ease_quad;\n\
    },\n\
    cubic: function() {\n\
      return d3_ease_cubic;\n\
    },\n\
    sin: function() {\n\
      return d3_ease_sin;\n\
    },\n\
    exp: function() {\n\
      return d3_ease_exp;\n\
    },\n\
    circle: function() {\n\
      return d3_ease_circle;\n\
    },\n\
    elastic: d3_ease_elastic,\n\
    back: d3_ease_back,\n\
    bounce: function() {\n\
      return d3_ease_bounce;\n\
    }\n\
  });\n\
  var d3_ease_mode = d3.map({\n\
    \"in\": d3_identity,\n\
    out: d3_ease_reverse,\n\
    \"in-out\": d3_ease_reflect,\n\
    \"out-in\": function(f) {\n\
      return d3_ease_reflect(d3_ease_reverse(f));\n\
    }\n\
  });\n\
  d3.ease = function(name) {\n\
    var i = name.indexOf(\"-\"), t = i >= 0 ? name.substring(0, i) : name, m = i >= 0 ? name.substring(i + 1) : \"in\";\n\
    t = d3_ease.get(t) || d3_ease_default;\n\
    m = d3_ease_mode.get(m) || d3_identity;\n\
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));\n\
  };\n\
  function d3_ease_clamp(f) {\n\
    return function(t) {\n\
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);\n\
    };\n\
  }\n\
  function d3_ease_reverse(f) {\n\
    return function(t) {\n\
      return 1 - f(1 - t);\n\
    };\n\
  }\n\
  function d3_ease_reflect(f) {\n\
    return function(t) {\n\
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));\n\
    };\n\
  }\n\
  function d3_ease_quad(t) {\n\
    return t * t;\n\
  }\n\
  function d3_ease_cubic(t) {\n\
    return t * t * t;\n\
  }\n\
  function d3_ease_cubicInOut(t) {\n\
    if (t <= 0) return 0;\n\
    if (t >= 1) return 1;\n\
    var t2 = t * t, t3 = t2 * t;\n\
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);\n\
  }\n\
  function d3_ease_poly(e) {\n\
    return function(t) {\n\
      return Math.pow(t, e);\n\
    };\n\
  }\n\
  function d3_ease_sin(t) {\n\
    return 1 - Math.cos(t * halfπ);\n\
  }\n\
  function d3_ease_exp(t) {\n\
    return Math.pow(2, 10 * (t - 1));\n\
  }\n\
  function d3_ease_circle(t) {\n\
    return 1 - Math.sqrt(1 - t * t);\n\
  }\n\
  function d3_ease_elastic(a, p) {\n\
    var s;\n\
    if (arguments.length < 2) p = .45;\n\
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;\n\
    return function(t) {\n\
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);\n\
    };\n\
  }\n\
  function d3_ease_back(s) {\n\
    if (!s) s = 1.70158;\n\
    return function(t) {\n\
      return t * t * ((s + 1) * t - s);\n\
    };\n\
  }\n\
  function d3_ease_bounce(t) {\n\
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;\n\
  }\n\
  d3.interpolateHcl = d3_interpolateHcl;\n\
  function d3_interpolateHcl(a, b) {\n\
    a = d3.hcl(a);\n\
    b = d3.hcl(b);\n\
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;\n\
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateHsl = d3_interpolateHsl;\n\
  function d3_interpolateHsl(a, b) {\n\
    a = d3.hsl(a);\n\
    b = d3.hsl(b);\n\
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;\n\
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;\n\
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;\n\
    return function(t) {\n\
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateLab = d3_interpolateLab;\n\
  function d3_interpolateLab(a, b) {\n\
    a = d3.lab(a);\n\
    b = d3.lab(b);\n\
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;\n\
    return function(t) {\n\
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + \"\";\n\
    };\n\
  }\n\
  d3.interpolateRound = d3_interpolateRound;\n\
  function d3_interpolateRound(a, b) {\n\
    b -= a;\n\
    return function(t) {\n\
      return Math.round(a + b * t);\n\
    };\n\
  }\n\
  d3.transform = function(string) {\n\
    var g = d3_document.createElementNS(d3.ns.prefix.svg, \"g\");\n\
    return (d3.transform = function(string) {\n\
      if (string != null) {\n\
        g.setAttribute(\"transform\", string);\n\
        var t = g.transform.baseVal.consolidate();\n\
      }\n\
      return new d3_transform(t ? t.matrix : d3_transformIdentity);\n\
    })(string);\n\
  };\n\
  function d3_transform(m) {\n\
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;\n\
    if (r0[0] * r1[1] < r1[0] * r0[1]) {\n\
      r0[0] *= -1;\n\
      r0[1] *= -1;\n\
      kx *= -1;\n\
      kz *= -1;\n\
    }\n\
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;\n\
    this.translate = [ m.e, m.f ];\n\
    this.scale = [ kx, ky ];\n\
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;\n\
  }\n\
  d3_transform.prototype.toString = function() {\n\
    return \"translate(\" + this.translate + \")rotate(\" + this.rotate + \")skewX(\" + this.skew + \")scale(\" + this.scale + \")\";\n\
  };\n\
  function d3_transformDot(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1];\n\
  }\n\
  function d3_transformNormalize(a) {\n\
    var k = Math.sqrt(d3_transformDot(a, a));\n\
    if (k) {\n\
      a[0] /= k;\n\
      a[1] /= k;\n\
    }\n\
    return k;\n\
  }\n\
  function d3_transformCombine(a, b, k) {\n\
    a[0] += k * b[0];\n\
    a[1] += k * b[1];\n\
    return a;\n\
  }\n\
  var d3_transformIdentity = {\n\
    a: 1,\n\
    b: 0,\n\
    c: 0,\n\
    d: 1,\n\
    e: 0,\n\
    f: 0\n\
  };\n\
  d3.interpolateTransform = d3_interpolateTransform;\n\
  function d3_interpolateTransform(a, b) {\n\
    var s = [], q = [], n, A = d3.transform(a), B = d3.transform(b), ta = A.translate, tb = B.translate, ra = A.rotate, rb = B.rotate, wa = A.skew, wb = B.skew, ka = A.scale, kb = B.scale;\n\
    if (ta[0] != tb[0] || ta[1] != tb[1]) {\n\
      s.push(\"translate(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: 1,\n\
        x: d3_interpolateNumber(ta[0], tb[0])\n\
      }, {\n\
        i: 3,\n\
        x: d3_interpolateNumber(ta[1], tb[1])\n\
      });\n\
    } else if (tb[0] || tb[1]) {\n\
      s.push(\"translate(\" + tb + \")\");\n\
    } else {\n\
      s.push(\"\");\n\
    }\n\
    if (ra != rb) {\n\
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;\n\
      q.push({\n\
        i: s.push(s.pop() + \"rotate(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(ra, rb)\n\
      });\n\
    } else if (rb) {\n\
      s.push(s.pop() + \"rotate(\" + rb + \")\");\n\
    }\n\
    if (wa != wb) {\n\
      q.push({\n\
        i: s.push(s.pop() + \"skewX(\", null, \")\") - 2,\n\
        x: d3_interpolateNumber(wa, wb)\n\
      });\n\
    } else if (wb) {\n\
      s.push(s.pop() + \"skewX(\" + wb + \")\");\n\
    }\n\
    if (ka[0] != kb[0] || ka[1] != kb[1]) {\n\
      n = s.push(s.pop() + \"scale(\", null, \",\", null, \")\");\n\
      q.push({\n\
        i: n - 4,\n\
        x: d3_interpolateNumber(ka[0], kb[0])\n\
      }, {\n\
        i: n - 2,\n\
        x: d3_interpolateNumber(ka[1], kb[1])\n\
      });\n\
    } else if (kb[0] != 1 || kb[1] != 1) {\n\
      s.push(s.pop() + \"scale(\" + kb + \")\");\n\
    }\n\
    n = q.length;\n\
    return function(t) {\n\
      var i = -1, o;\n\
      while (++i < n) s[(o = q[i]).i] = o.x(t);\n\
      return s.join(\"\");\n\
    };\n\
  }\n\
  function d3_uninterpolateNumber(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return (x - a) * b;\n\
    };\n\
  }\n\
  function d3_uninterpolateClamp(a, b) {\n\
    b = b - (a = +a) ? 1 / (b - a) : 0;\n\
    return function(x) {\n\
      return Math.max(0, Math.min(1, (x - a) * b));\n\
    };\n\
  }\n\
  d3.layout = {};\n\
  d3.layout.bundle = function() {\n\
    return function(links) {\n\
      var paths = [], i = -1, n = links.length;\n\
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));\n\
      return paths;\n\
    };\n\
  };\n\
  function d3_layout_bundlePath(link) {\n\
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];\n\
    while (start !== lca) {\n\
      start = start.parent;\n\
      points.push(start);\n\
    }\n\
    var k = points.length;\n\
    while (end !== lca) {\n\
      points.splice(k, 0, end);\n\
      end = end.parent;\n\
    }\n\
    return points;\n\
  }\n\
  function d3_layout_bundleAncestors(node) {\n\
    var ancestors = [], parent = node.parent;\n\
    while (parent != null) {\n\
      ancestors.push(node);\n\
      node = parent;\n\
      parent = parent.parent;\n\
    }\n\
    ancestors.push(node);\n\
    return ancestors;\n\
  }\n\
  function d3_layout_bundleLeastCommonAncestor(a, b) {\n\
    if (a === b) return a;\n\
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;\n\
    while (aNode === bNode) {\n\
      sharedNode = aNode;\n\
      aNode = aNodes.pop();\n\
      bNode = bNodes.pop();\n\
    }\n\
    return sharedNode;\n\
  }\n\
  d3.layout.chord = function() {\n\
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;\n\
    function relayout() {\n\
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;\n\
      chords = [];\n\
      groups = [];\n\
      k = 0, i = -1;\n\
      while (++i < n) {\n\
        x = 0, j = -1;\n\
        while (++j < n) {\n\
          x += matrix[i][j];\n\
        }\n\
        groupSums.push(x);\n\
        subgroupIndex.push(d3.range(n));\n\
        k += x;\n\
      }\n\
      if (sortGroups) {\n\
        groupIndex.sort(function(a, b) {\n\
          return sortGroups(groupSums[a], groupSums[b]);\n\
        });\n\
      }\n\
      if (sortSubgroups) {\n\
        subgroupIndex.forEach(function(d, i) {\n\
          d.sort(function(a, b) {\n\
            return sortSubgroups(matrix[i][a], matrix[i][b]);\n\
          });\n\
        });\n\
      }\n\
      k = (τ - padding * n) / k;\n\
      x = 0, i = -1;\n\
      while (++i < n) {\n\
        x0 = x, j = -1;\n\
        while (++j < n) {\n\
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;\n\
          subgroups[di + \"-\" + dj] = {\n\
            index: di,\n\
            subindex: dj,\n\
            startAngle: a0,\n\
            endAngle: a1,\n\
            value: v\n\
          };\n\
        }\n\
        groups[di] = {\n\
          index: di,\n\
          startAngle: x0,\n\
          endAngle: x,\n\
          value: (x - x0) / k\n\
        };\n\
        x += padding;\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        j = i - 1;\n\
        while (++j < n) {\n\
          var source = subgroups[i + \"-\" + j], target = subgroups[j + \"-\" + i];\n\
          if (source.value || target.value) {\n\
            chords.push(source.value < target.value ? {\n\
              source: target,\n\
              target: source\n\
            } : {\n\
              source: source,\n\
              target: target\n\
            });\n\
          }\n\
        }\n\
      }\n\
      if (sortChords) resort();\n\
    }\n\
    function resort() {\n\
      chords.sort(function(a, b) {\n\
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);\n\
      });\n\
    }\n\
    chord.matrix = function(x) {\n\
      if (!arguments.length) return matrix;\n\
      n = (matrix = x) && matrix.length;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      padding = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortGroups = function(x) {\n\
      if (!arguments.length) return sortGroups;\n\
      sortGroups = x;\n\
      chords = groups = null;\n\
      return chord;\n\
    };\n\
    chord.sortSubgroups = function(x) {\n\
      if (!arguments.length) return sortSubgroups;\n\
      sortSubgroups = x;\n\
      chords = null;\n\
      return chord;\n\
    };\n\
    chord.sortChords = function(x) {\n\
      if (!arguments.length) return sortChords;\n\
      sortChords = x;\n\
      if (chords) resort();\n\
      return chord;\n\
    };\n\
    chord.chords = function() {\n\
      if (!chords) relayout();\n\
      return chords;\n\
    };\n\
    chord.groups = function() {\n\
      if (!groups) relayout();\n\
      return groups;\n\
    };\n\
    return chord;\n\
  };\n\
  d3.layout.force = function() {\n\
    var force = {}, event = d3.dispatch(\"start\", \"tick\", \"end\"), size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, gravity = .1, theta = .8, nodes = [], links = [], distances, strengths, charges;\n\
    function repulse(node) {\n\
      return function(quad, x1, _, x2) {\n\
        if (quad.point !== node) {\n\
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dn = 1 / Math.sqrt(dx * dx + dy * dy);\n\
          if ((x2 - x1) * dn < theta) {\n\
            var k = quad.charge * dn * dn;\n\
            node.px -= dx * k;\n\
            node.py -= dy * k;\n\
            return true;\n\
          }\n\
          if (quad.point && isFinite(dn)) {\n\
            var k = quad.pointCharge * dn * dn;\n\
            node.px -= dx * k;\n\
            node.py -= dy * k;\n\
          }\n\
        }\n\
        return !quad.charge;\n\
      };\n\
    }\n\
    force.tick = function() {\n\
      if ((alpha *= .99) < .005) {\n\
        event.end({\n\
          type: \"end\",\n\
          alpha: alpha = 0\n\
        });\n\
        return true;\n\
      }\n\
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        s = o.source;\n\
        t = o.target;\n\
        x = t.x - s.x;\n\
        y = t.y - s.y;\n\
        if (l = x * x + y * y) {\n\
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;\n\
          x *= l;\n\
          y *= l;\n\
          t.x -= x * (k = s.weight / (t.weight + s.weight));\n\
          t.y -= y * k;\n\
          s.x += x * (k = 1 - k);\n\
          s.y += y * k;\n\
        }\n\
      }\n\
      if (k = alpha * gravity) {\n\
        x = size[0] / 2;\n\
        y = size[1] / 2;\n\
        i = -1;\n\
        if (k) while (++i < n) {\n\
          o = nodes[i];\n\
          o.x += (x - o.x) * k;\n\
          o.y += (y - o.y) * k;\n\
        }\n\
      }\n\
      if (charge) {\n\
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);\n\
        i = -1;\n\
        while (++i < n) {\n\
          if (!(o = nodes[i]).fixed) {\n\
            q.visit(repulse(o));\n\
          }\n\
        }\n\
      }\n\
      i = -1;\n\
      while (++i < n) {\n\
        o = nodes[i];\n\
        if (o.fixed) {\n\
          o.x = o.px;\n\
          o.y = o.py;\n\
        } else {\n\
          o.x -= (o.px - (o.px = o.x)) * friction;\n\
          o.y -= (o.py - (o.py = o.y)) * friction;\n\
        }\n\
      }\n\
      event.tick({\n\
        type: \"tick\",\n\
        alpha: alpha\n\
      });\n\
    };\n\
    force.nodes = function(x) {\n\
      if (!arguments.length) return nodes;\n\
      nodes = x;\n\
      return force;\n\
    };\n\
    force.links = function(x) {\n\
      if (!arguments.length) return links;\n\
      links = x;\n\
      return force;\n\
    };\n\
    force.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return force;\n\
    };\n\
    force.linkDistance = function(x) {\n\
      if (!arguments.length) return linkDistance;\n\
      linkDistance = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.distance = force.linkDistance;\n\
    force.linkStrength = function(x) {\n\
      if (!arguments.length) return linkStrength;\n\
      linkStrength = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.friction = function(x) {\n\
      if (!arguments.length) return friction;\n\
      friction = +x;\n\
      return force;\n\
    };\n\
    force.charge = function(x) {\n\
      if (!arguments.length) return charge;\n\
      charge = typeof x === \"function\" ? x : +x;\n\
      return force;\n\
    };\n\
    force.gravity = function(x) {\n\
      if (!arguments.length) return gravity;\n\
      gravity = +x;\n\
      return force;\n\
    };\n\
    force.theta = function(x) {\n\
      if (!arguments.length) return theta;\n\
      theta = +x;\n\
      return force;\n\
    };\n\
    force.alpha = function(x) {\n\
      if (!arguments.length) return alpha;\n\
      x = +x;\n\
      if (alpha) {\n\
        if (x > 0) alpha = x; else alpha = 0;\n\
      } else if (x > 0) {\n\
        event.start({\n\
          type: \"start\",\n\
          alpha: alpha = x\n\
        });\n\
        d3.timer(force.tick);\n\
      }\n\
      return force;\n\
    };\n\
    force.start = function() {\n\
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;\n\
      for (i = 0; i < n; ++i) {\n\
        (o = nodes[i]).index = i;\n\
        o.weight = 0;\n\
      }\n\
      for (i = 0; i < m; ++i) {\n\
        o = links[i];\n\
        if (typeof o.source == \"number\") o.source = nodes[o.source];\n\
        if (typeof o.target == \"number\") o.target = nodes[o.target];\n\
        ++o.source.weight;\n\
        ++o.target.weight;\n\
      }\n\
      for (i = 0; i < n; ++i) {\n\
        o = nodes[i];\n\
        if (isNaN(o.x)) o.x = position(\"x\", w);\n\
        if (isNaN(o.y)) o.y = position(\"y\", h);\n\
        if (isNaN(o.px)) o.px = o.x;\n\
        if (isNaN(o.py)) o.py = o.y;\n\
      }\n\
      distances = [];\n\
      if (typeof linkDistance === \"function\") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;\n\
      strengths = [];\n\
      if (typeof linkStrength === \"function\") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;\n\
      charges = [];\n\
      if (typeof charge === \"function\") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;\n\
      function position(dimension, size) {\n\
        if (!neighbors) {\n\
          neighbors = new Array(n);\n\
          for (j = 0; j < n; ++j) {\n\
            neighbors[j] = [];\n\
          }\n\
          for (j = 0; j < m; ++j) {\n\
            var o = links[j];\n\
            neighbors[o.source.index].push(o.target);\n\
            neighbors[o.target.index].push(o.source);\n\
          }\n\
        }\n\
        var candidates = neighbors[i], j = -1, m = candidates.length, x;\n\
        while (++j < m) if (!isNaN(x = candidates[j][dimension])) return x;\n\
        return Math.random() * size;\n\
      }\n\
      return force.resume();\n\
    };\n\
    force.resume = function() {\n\
      return force.alpha(.1);\n\
    };\n\
    force.stop = function() {\n\
      return force.alpha(0);\n\
    };\n\
    force.drag = function() {\n\
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on(\"dragstart.force\", d3_layout_forceDragstart).on(\"drag.force\", dragmove).on(\"dragend.force\", d3_layout_forceDragend);\n\
      if (!arguments.length) return drag;\n\
      this.on(\"mouseover.force\", d3_layout_forceMouseover).on(\"mouseout.force\", d3_layout_forceMouseout).call(drag);\n\
    };\n\
    function dragmove(d) {\n\
      d.px = d3.event.x, d.py = d3.event.y;\n\
      force.resume();\n\
    }\n\
    return d3.rebind(force, event, \"on\");\n\
  };\n\
  function d3_layout_forceDragstart(d) {\n\
    d.fixed |= 2;\n\
  }\n\
  function d3_layout_forceDragend(d) {\n\
    d.fixed &= ~6;\n\
  }\n\
  function d3_layout_forceMouseover(d) {\n\
    d.fixed |= 4;\n\
    d.px = d.x, d.py = d.y;\n\
  }\n\
  function d3_layout_forceMouseout(d) {\n\
    d.fixed &= ~4;\n\
  }\n\
  function d3_layout_forceAccumulate(quad, alpha, charges) {\n\
    var cx = 0, cy = 0;\n\
    quad.charge = 0;\n\
    if (!quad.leaf) {\n\
      var nodes = quad.nodes, n = nodes.length, i = -1, c;\n\
      while (++i < n) {\n\
        c = nodes[i];\n\
        if (c == null) continue;\n\
        d3_layout_forceAccumulate(c, alpha, charges);\n\
        quad.charge += c.charge;\n\
        cx += c.charge * c.cx;\n\
        cy += c.charge * c.cy;\n\
      }\n\
    }\n\
    if (quad.point) {\n\
      if (!quad.leaf) {\n\
        quad.point.x += Math.random() - .5;\n\
        quad.point.y += Math.random() - .5;\n\
      }\n\
      var k = alpha * charges[quad.point.index];\n\
      quad.charge += quad.pointCharge = k;\n\
      cx += k * quad.point.x;\n\
      cy += k * quad.point.y;\n\
    }\n\
    quad.cx = cx / quad.charge;\n\
    quad.cy = cy / quad.charge;\n\
  }\n\
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1;\n\
  d3.layout.hierarchy = function() {\n\
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;\n\
    function recurse(node, depth, nodes) {\n\
      var childs = children.call(hierarchy, node, depth);\n\
      node.depth = depth;\n\
      nodes.push(node);\n\
      if (childs && (n = childs.length)) {\n\
        var i = -1, n, c = node.children = new Array(n), v = 0, j = depth + 1, d;\n\
        while (++i < n) {\n\
          d = c[i] = recurse(childs[i], j, nodes);\n\
          d.parent = node;\n\
          v += d.value;\n\
        }\n\
        if (sort) c.sort(sort);\n\
        if (value) node.value = v;\n\
      } else {\n\
        delete node.children;\n\
        if (value) {\n\
          node.value = +value.call(hierarchy, node, depth) || 0;\n\
        }\n\
      }\n\
      return node;\n\
    }\n\
    function revalue(node, depth) {\n\
      var children = node.children, v = 0;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n, j = depth + 1;\n\
        while (++i < n) v += revalue(children[i], j);\n\
      } else if (value) {\n\
        v = +value.call(hierarchy, node, depth) || 0;\n\
      }\n\
      if (value) node.value = v;\n\
      return v;\n\
    }\n\
    function hierarchy(d) {\n\
      var nodes = [];\n\
      recurse(d, 0, nodes);\n\
      return nodes;\n\
    }\n\
    hierarchy.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.children = function(x) {\n\
      if (!arguments.length) return children;\n\
      children = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return hierarchy;\n\
    };\n\
    hierarchy.revalue = function(root) {\n\
      revalue(root, 0);\n\
      return root;\n\
    };\n\
    return hierarchy;\n\
  };\n\
  function d3_layout_hierarchyRebind(object, hierarchy) {\n\
    d3.rebind(object, hierarchy, \"sort\", \"children\", \"value\");\n\
    object.nodes = object;\n\
    object.links = d3_layout_hierarchyLinks;\n\
    return object;\n\
  }\n\
  function d3_layout_hierarchyChildren(d) {\n\
    return d.children;\n\
  }\n\
  function d3_layout_hierarchyValue(d) {\n\
    return d.value;\n\
  }\n\
  function d3_layout_hierarchySort(a, b) {\n\
    return b.value - a.value;\n\
  }\n\
  function d3_layout_hierarchyLinks(nodes) {\n\
    return d3.merge(nodes.map(function(parent) {\n\
      return (parent.children || []).map(function(child) {\n\
        return {\n\
          source: parent,\n\
          target: child\n\
        };\n\
      });\n\
    }));\n\
  }\n\
  d3.layout.partition = function() {\n\
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];\n\
    function position(node, x, dx, dy) {\n\
      var children = node.children;\n\
      node.x = x;\n\
      node.y = node.depth * dy;\n\
      node.dx = dx;\n\
      node.dy = dy;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n, c, d;\n\
        dx = node.value ? dx / node.value : 0;\n\
        while (++i < n) {\n\
          position(c = children[i], x, d = c.value * dx, dy);\n\
          x += d;\n\
        }\n\
      }\n\
    }\n\
    function depth(node) {\n\
      var children = node.children, d = 0;\n\
      if (children && (n = children.length)) {\n\
        var i = -1, n;\n\
        while (++i < n) d = Math.max(d, depth(children[i]));\n\
      }\n\
      return 1 + d;\n\
    }\n\
    function partition(d, i) {\n\
      var nodes = hierarchy.call(this, d, i);\n\
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));\n\
      return nodes;\n\
    }\n\
    partition.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return partition;\n\
    };\n\
    return d3_layout_hierarchyRebind(partition, hierarchy);\n\
  };\n\
  d3.layout.pie = function() {\n\
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ;\n\
    function pie(data) {\n\
      var values = data.map(function(d, i) {\n\
        return +value.call(pie, d, i);\n\
      });\n\
      var a = +(typeof startAngle === \"function\" ? startAngle.apply(this, arguments) : startAngle);\n\
      var k = ((typeof endAngle === \"function\" ? endAngle.apply(this, arguments) : endAngle) - a) / d3.sum(values);\n\
      var index = d3.range(data.length);\n\
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {\n\
        return values[j] - values[i];\n\
      } : function(i, j) {\n\
        return sort(data[i], data[j]);\n\
      });\n\
      var arcs = [];\n\
      index.forEach(function(i) {\n\
        var d;\n\
        arcs[i] = {\n\
          data: data[i],\n\
          value: d = values[i],\n\
          startAngle: a,\n\
          endAngle: a += d * k\n\
        };\n\
      });\n\
      return arcs;\n\
    }\n\
    pie.value = function(x) {\n\
      if (!arguments.length) return value;\n\
      value = x;\n\
      return pie;\n\
    };\n\
    pie.sort = function(x) {\n\
      if (!arguments.length) return sort;\n\
      sort = x;\n\
      return pie;\n\
    };\n\
    pie.startAngle = function(x) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = x;\n\
      return pie;\n\
    };\n\
    pie.endAngle = function(x) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = x;\n\
      return pie;\n\
    };\n\
    return pie;\n\
  };\n\
  var d3_layout_pieSortByValue = {};\n\
  d3.layout.stack = function() {\n\
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;\n\
    function stack(data, index) {\n\
      var series = data.map(function(d, i) {\n\
        return values.call(stack, d, i);\n\
      });\n\
      var points = series.map(function(d) {\n\
        return d.map(function(v, i) {\n\
          return [ x.call(stack, v, i), y.call(stack, v, i) ];\n\
        });\n\
      });\n\
      var orders = order.call(stack, points, index);\n\
      series = d3.permute(series, orders);\n\
      points = d3.permute(points, orders);\n\
      var offsets = offset.call(stack, points, index);\n\
      var n = series.length, m = series[0].length, i, j, o;\n\
      for (j = 0; j < m; ++j) {\n\
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);\n\
        for (i = 1; i < n; ++i) {\n\
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);\n\
        }\n\
      }\n\
      return data;\n\
    }\n\
    stack.values = function(x) {\n\
      if (!arguments.length) return values;\n\
      values = x;\n\
      return stack;\n\
    };\n\
    stack.order = function(x) {\n\
      if (!arguments.length) return order;\n\
      order = typeof x === \"function\" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;\n\
      return stack;\n\
    };\n\
    stack.offset = function(x) {\n\
      if (!arguments.length) return offset;\n\
      offset = typeof x === \"function\" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;\n\
      return stack;\n\
    };\n\
    stack.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      return stack;\n\
    };\n\
    stack.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      return stack;\n\
    };\n\
    stack.out = function(z) {\n\
      if (!arguments.length) return out;\n\
      out = z;\n\
      return stack;\n\
    };\n\
    return stack;\n\
  };\n\
  function d3_layout_stackX(d) {\n\
    return d.x;\n\
  }\n\
  function d3_layout_stackY(d) {\n\
    return d.y;\n\
  }\n\
  function d3_layout_stackOut(d, y0, y) {\n\
    d.y0 = y0;\n\
    d.y = y;\n\
  }\n\
  var d3_layout_stackOrders = d3.map({\n\
    \"inside-out\": function(data) {\n\
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {\n\
        return max[a] - max[b];\n\
      }), top = 0, bottom = 0, tops = [], bottoms = [];\n\
      for (i = 0; i < n; ++i) {\n\
        j = index[i];\n\
        if (top < bottom) {\n\
          top += sums[j];\n\
          tops.push(j);\n\
        } else {\n\
          bottom += sums[j];\n\
          bottoms.push(j);\n\
        }\n\
      }\n\
      return bottoms.reverse().concat(tops);\n\
    },\n\
    reverse: function(data) {\n\
      return d3.range(data.length).reverse();\n\
    },\n\
    \"default\": d3_layout_stackOrderDefault\n\
  });\n\
  var d3_layout_stackOffsets = d3.map({\n\
    silhouette: function(data) {\n\
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o > max) max = o;\n\
        sums.push(o);\n\
      }\n\
      for (j = 0; j < m; ++j) {\n\
        y0[j] = (max - sums[j]) / 2;\n\
      }\n\
      return y0;\n\
    },\n\
    wiggle: function(data) {\n\
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];\n\
      y0[0] = o = o0 = 0;\n\
      for (j = 1; j < m; ++j) {\n\
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];\n\
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {\n\
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {\n\
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;\n\
          }\n\
          s2 += s3 * data[i][j][1];\n\
        }\n\
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;\n\
        if (o < o0) o0 = o;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] -= o0;\n\
      return y0;\n\
    },\n\
    expand: function(data) {\n\
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];\n\
      for (j = 0; j < m; ++j) {\n\
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];\n\
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;\n\
      }\n\
      for (j = 0; j < m; ++j) y0[j] = 0;\n\
      return y0;\n\
    },\n\
    zero: d3_layout_stackOffsetZero\n\
  });\n\
  function d3_layout_stackOrderDefault(data) {\n\
    return d3.range(data.length);\n\
  }\n\
  function d3_layout_stackOffsetZero(data) {\n\
    var j = -1, m = data[0].length, y0 = [];\n\
    while (++j < m) y0[j] = 0;\n\
    return y0;\n\
  }\n\
  function d3_layout_stackMaxIndex(array) {\n\
    var i = 1, j = 0, v = array[0][1], k, n = array.length;\n\
    for (;i < n; ++i) {\n\
      if ((k = array[i][1]) > v) {\n\
        j = i;\n\
        v = k;\n\
      }\n\
    }\n\
    return j;\n\
  }\n\
  function d3_layout_stackReduceSum(d) {\n\
    return d.reduce(d3_layout_stackSum, 0);\n\
  }\n\
  function d3_layout_stackSum(p, d) {\n\
    return p + d[1];\n\
  }\n\
  d3.layout.histogram = function() {\n\
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;\n\
    function histogram(data, i) {\n\
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;\n\
      while (++i < m) {\n\
        bin = bins[i] = [];\n\
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);\n\
        bin.y = 0;\n\
      }\n\
      if (m > 0) {\n\
        i = -1;\n\
        while (++i < n) {\n\
          x = values[i];\n\
          if (x >= range[0] && x <= range[1]) {\n\
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];\n\
            bin.y += k;\n\
            bin.push(data[i]);\n\
          }\n\
        }\n\
      }\n\
      return bins;\n\
    }\n\
    histogram.value = function(x) {\n\
      if (!arguments.length) return valuer;\n\
      valuer = x;\n\
      return histogram;\n\
    };\n\
    histogram.range = function(x) {\n\
      if (!arguments.length) return ranger;\n\
      ranger = d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.bins = function(x) {\n\
      if (!arguments.length) return binner;\n\
      binner = typeof x === \"number\" ? function(range) {\n\
        return d3_layout_histogramBinFixed(range, x);\n\
      } : d3_functor(x);\n\
      return histogram;\n\
    };\n\
    histogram.frequency = function(x) {\n\
      if (!arguments.length) return frequency;\n\
      frequency = !!x;\n\
      return histogram;\n\
    };\n\
    return histogram;\n\
  };\n\
  function d3_layout_histogramBinSturges(range, values) {\n\
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));\n\
  }\n\
  function d3_layout_histogramBinFixed(range, n) {\n\
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];\n\
    while (++x <= n) f[x] = m * x + b;\n\
    return f;\n\
  }\n\
  function d3_layout_histogramRange(values) {\n\
    return [ d3.min(values), d3.max(values) ];\n\
  }\n\
  d3.layout.tree = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;\n\
    function tree(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0];\n\
      function firstWalk(node, previousSibling) {\n\
        var children = node.children, layout = node._tree;\n\
        if (children && (n = children.length)) {\n\
          var n, firstChild = children[0], previousChild, ancestor = firstChild, child, i = -1;\n\
          while (++i < n) {\n\
            child = children[i];\n\
            firstWalk(child, previousChild);\n\
            ancestor = apportion(child, previousChild, ancestor);\n\
            previousChild = child;\n\
          }\n\
          d3_layout_treeShift(node);\n\
          var midpoint = .5 * (firstChild._tree.prelim + child._tree.prelim);\n\
          if (previousSibling) {\n\
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);\n\
            layout.mod = layout.prelim - midpoint;\n\
          } else {\n\
            layout.prelim = midpoint;\n\
          }\n\
        } else {\n\
          if (previousSibling) {\n\
            layout.prelim = previousSibling._tree.prelim + separation(node, previousSibling);\n\
          }\n\
        }\n\
      }\n\
      function secondWalk(node, x) {\n\
        node.x = node._tree.prelim + x;\n\
        var children = node.children;\n\
        if (children && (n = children.length)) {\n\
          var i = -1, n;\n\
          x += node._tree.mod;\n\
          while (++i < n) {\n\
            secondWalk(children[i], x);\n\
          }\n\
        }\n\
      }\n\
      function apportion(node, previousSibling, ancestor) {\n\
        if (previousSibling) {\n\
          var vip = node, vop = node, vim = previousSibling, vom = node.parent.children[0], sip = vip._tree.mod, sop = vop._tree.mod, sim = vim._tree.mod, som = vom._tree.mod, shift;\n\
          while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {\n\
            vom = d3_layout_treeLeft(vom);\n\
            vop = d3_layout_treeRight(vop);\n\
            vop._tree.ancestor = node;\n\
            shift = vim._tree.prelim + sim - vip._tree.prelim - sip + separation(vim, vip);\n\
            if (shift > 0) {\n\
              d3_layout_treeMove(d3_layout_treeAncestor(vim, node, ancestor), node, shift);\n\
              sip += shift;\n\
              sop += shift;\n\
            }\n\
            sim += vim._tree.mod;\n\
            sip += vip._tree.mod;\n\
            som += vom._tree.mod;\n\
            sop += vop._tree.mod;\n\
          }\n\
          if (vim && !d3_layout_treeRight(vop)) {\n\
            vop._tree.thread = vim;\n\
            vop._tree.mod += sim - sop;\n\
          }\n\
          if (vip && !d3_layout_treeLeft(vom)) {\n\
            vom._tree.thread = vip;\n\
            vom._tree.mod += sip - som;\n\
            ancestor = node;\n\
          }\n\
        }\n\
        return ancestor;\n\
      }\n\
      d3_layout_treeVisitAfter(root, function(node, previousSibling) {\n\
        node._tree = {\n\
          ancestor: node,\n\
          prelim: 0,\n\
          mod: 0,\n\
          change: 0,\n\
          shift: 0,\n\
          number: previousSibling ? previousSibling._tree.number + 1 : 0\n\
        };\n\
      });\n\
      firstWalk(root);\n\
      secondWalk(root, -root._tree.prelim);\n\
      var left = d3_layout_treeSearch(root, d3_layout_treeLeftmost), right = d3_layout_treeSearch(root, d3_layout_treeRightmost), deep = d3_layout_treeSearch(root, d3_layout_treeDeepest), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2, y1 = deep.depth || 1;\n\
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {\n\
        node.x *= size[0];\n\
        node.y = node.depth * size[1];\n\
        delete node._tree;\n\
      } : function(node) {\n\
        node.x = (node.x - x0) / (x1 - x0) * size[0];\n\
        node.y = node.depth / y1 * size[1];\n\
        delete node._tree;\n\
      });\n\
      return nodes;\n\
    }\n\
    tree.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return tree;\n\
    };\n\
    tree.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null;\n\
      return tree;\n\
    };\n\
    tree.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) != null;\n\
      return tree;\n\
    };\n\
    return d3_layout_hierarchyRebind(tree, hierarchy);\n\
  };\n\
  function d3_layout_treeSeparation(a, b) {\n\
    return a.parent == b.parent ? 1 : 2;\n\
  }\n\
  function d3_layout_treeLeft(node) {\n\
    var children = node.children;\n\
    return children && children.length ? children[0] : node._tree.thread;\n\
  }\n\
  function d3_layout_treeRight(node) {\n\
    var children = node.children, n;\n\
    return children && (n = children.length) ? children[n - 1] : node._tree.thread;\n\
  }\n\
  function d3_layout_treeSearch(node, compare) {\n\
    var children = node.children;\n\
    if (children && (n = children.length)) {\n\
      var child, n, i = -1;\n\
      while (++i < n) {\n\
        if (compare(child = d3_layout_treeSearch(children[i], compare), node) > 0) {\n\
          node = child;\n\
        }\n\
      }\n\
    }\n\
    return node;\n\
  }\n\
  function d3_layout_treeRightmost(a, b) {\n\
    return a.x - b.x;\n\
  }\n\
  function d3_layout_treeLeftmost(a, b) {\n\
    return b.x - a.x;\n\
  }\n\
  function d3_layout_treeDeepest(a, b) {\n\
    return a.depth - b.depth;\n\
  }\n\
  function d3_layout_treeVisitAfter(node, callback) {\n\
    function visit(node, previousSibling) {\n\
      var children = node.children;\n\
      if (children && (n = children.length)) {\n\
        var child, previousChild = null, i = -1, n;\n\
        while (++i < n) {\n\
          child = children[i];\n\
          visit(child, previousChild);\n\
          previousChild = child;\n\
        }\n\
      }\n\
      callback(node, previousSibling);\n\
    }\n\
    visit(node, null);\n\
  }\n\
  function d3_layout_treeShift(node) {\n\
    var shift = 0, change = 0, children = node.children, i = children.length, child;\n\
    while (--i >= 0) {\n\
      child = children[i]._tree;\n\
      child.prelim += shift;\n\
      child.mod += shift;\n\
      shift += child.shift + (change += child.change);\n\
    }\n\
  }\n\
  function d3_layout_treeMove(ancestor, node, shift) {\n\
    ancestor = ancestor._tree;\n\
    node = node._tree;\n\
    var change = shift / (node.number - ancestor.number);\n\
    ancestor.change += change;\n\
    node.change -= change;\n\
    node.shift += shift;\n\
    node.prelim += shift;\n\
    node.mod += shift;\n\
  }\n\
  function d3_layout_treeAncestor(vim, node, ancestor) {\n\
    return vim._tree.ancestor.parent == node.parent ? vim._tree.ancestor : ancestor;\n\
  }\n\
  d3.layout.pack = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;\n\
    function pack(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === \"function\" ? radius : function() {\n\
        return radius;\n\
      };\n\
      root.x = root.y = 0;\n\
      d3_layout_treeVisitAfter(root, function(d) {\n\
        d.r = +r(d.value);\n\
      });\n\
      d3_layout_treeVisitAfter(root, d3_layout_packSiblings);\n\
      if (padding) {\n\
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;\n\
        d3_layout_treeVisitAfter(root, function(d) {\n\
          d.r += dr;\n\
        });\n\
        d3_layout_treeVisitAfter(root, d3_layout_packSiblings);\n\
        d3_layout_treeVisitAfter(root, function(d) {\n\
          d.r -= dr;\n\
        });\n\
      }\n\
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));\n\
      return nodes;\n\
    }\n\
    pack.size = function(_) {\n\
      if (!arguments.length) return size;\n\
      size = _;\n\
      return pack;\n\
    };\n\
    pack.radius = function(_) {\n\
      if (!arguments.length) return radius;\n\
      radius = _ == null || typeof _ === \"function\" ? _ : +_;\n\
      return pack;\n\
    };\n\
    pack.padding = function(_) {\n\
      if (!arguments.length) return padding;\n\
      padding = +_;\n\
      return pack;\n\
    };\n\
    return d3_layout_hierarchyRebind(pack, hierarchy);\n\
  };\n\
  function d3_layout_packSort(a, b) {\n\
    return a.value - b.value;\n\
  }\n\
  function d3_layout_packInsert(a, b) {\n\
    var c = a._pack_next;\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
    b._pack_next = c;\n\
    c._pack_prev = b;\n\
  }\n\
  function d3_layout_packSplice(a, b) {\n\
    a._pack_next = b;\n\
    b._pack_prev = a;\n\
  }\n\
  function d3_layout_packIntersects(a, b) {\n\
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;\n\
    return .999 * dr * dr > dx * dx + dy * dy;\n\
  }\n\
  function d3_layout_packSiblings(node) {\n\
    if (!(nodes = node.children) || !(n = nodes.length)) return;\n\
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;\n\
    function bound(node) {\n\
      xMin = Math.min(node.x - node.r, xMin);\n\
      xMax = Math.max(node.x + node.r, xMax);\n\
      yMin = Math.min(node.y - node.r, yMin);\n\
      yMax = Math.max(node.y + node.r, yMax);\n\
    }\n\
    nodes.forEach(d3_layout_packLink);\n\
    a = nodes[0];\n\
    a.x = -a.r;\n\
    a.y = 0;\n\
    bound(a);\n\
    if (n > 1) {\n\
      b = nodes[1];\n\
      b.x = b.r;\n\
      b.y = 0;\n\
      bound(b);\n\
      if (n > 2) {\n\
        c = nodes[2];\n\
        d3_layout_packPlace(a, b, c);\n\
        bound(c);\n\
        d3_layout_packInsert(a, c);\n\
        a._pack_prev = c;\n\
        d3_layout_packInsert(c, b);\n\
        b = a._pack_next;\n\
        for (i = 3; i < n; i++) {\n\
          d3_layout_packPlace(a, b, c = nodes[i]);\n\
          var isect = 0, s1 = 1, s2 = 1;\n\
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {\n\
            if (d3_layout_packIntersects(j, c)) {\n\
              isect = 1;\n\
              break;\n\
            }\n\
          }\n\
          if (isect == 1) {\n\
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {\n\
              if (d3_layout_packIntersects(k, c)) {\n\
                break;\n\
              }\n\
            }\n\
          }\n\
          if (isect) {\n\
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);\n\
            i--;\n\
          } else {\n\
            d3_layout_packInsert(a, c);\n\
            b = c;\n\
            bound(c);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;\n\
    for (i = 0; i < n; i++) {\n\
      c = nodes[i];\n\
      c.x -= cx;\n\
      c.y -= cy;\n\
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));\n\
    }\n\
    node.r = cr;\n\
    nodes.forEach(d3_layout_packUnlink);\n\
  }\n\
  function d3_layout_packLink(node) {\n\
    node._pack_next = node._pack_prev = node;\n\
  }\n\
  function d3_layout_packUnlink(node) {\n\
    delete node._pack_next;\n\
    delete node._pack_prev;\n\
  }\n\
  function d3_layout_packTransform(node, x, y, k) {\n\
    var children = node.children;\n\
    node.x = x += k * node.x;\n\
    node.y = y += k * node.y;\n\
    node.r *= k;\n\
    if (children) {\n\
      var i = -1, n = children.length;\n\
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);\n\
    }\n\
  }\n\
  function d3_layout_packPlace(a, b, c) {\n\
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;\n\
    if (db && (dx || dy)) {\n\
      var da = b.r + c.r, dc = dx * dx + dy * dy;\n\
      da *= da;\n\
      db *= db;\n\
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);\n\
      c.x = a.x + x * dx + y * dy;\n\
      c.y = a.y + x * dy - y * dx;\n\
    } else {\n\
      c.x = a.x + db;\n\
      c.y = a.y;\n\
    }\n\
  }\n\
  d3.layout.cluster = function() {\n\
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;\n\
    function cluster(d, i) {\n\
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;\n\
      d3_layout_treeVisitAfter(root, function(node) {\n\
        var children = node.children;\n\
        if (children && children.length) {\n\
          node.x = d3_layout_clusterX(children);\n\
          node.y = d3_layout_clusterY(children);\n\
        } else {\n\
          node.x = previousNode ? x += separation(node, previousNode) : 0;\n\
          node.y = 0;\n\
          previousNode = node;\n\
        }\n\
      });\n\
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;\n\
      d3_layout_treeVisitAfter(root, nodeSize ? function(node) {\n\
        node.x = (node.x - root.x) * size[0];\n\
        node.y = (root.y - node.y) * size[1];\n\
      } : function(node) {\n\
        node.x = (node.x - x0) / (x1 - x0) * size[0];\n\
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];\n\
      });\n\
      return nodes;\n\
    }\n\
    cluster.separation = function(x) {\n\
      if (!arguments.length) return separation;\n\
      separation = x;\n\
      return cluster;\n\
    };\n\
    cluster.size = function(x) {\n\
      if (!arguments.length) return nodeSize ? null : size;\n\
      nodeSize = (size = x) == null;\n\
      return cluster;\n\
    };\n\
    cluster.nodeSize = function(x) {\n\
      if (!arguments.length) return nodeSize ? size : null;\n\
      nodeSize = (size = x) != null;\n\
      return cluster;\n\
    };\n\
    return d3_layout_hierarchyRebind(cluster, hierarchy);\n\
  };\n\
  function d3_layout_clusterY(children) {\n\
    return 1 + d3.max(children, function(child) {\n\
      return child.y;\n\
    });\n\
  }\n\
  function d3_layout_clusterX(children) {\n\
    return children.reduce(function(x, child) {\n\
      return x + child.x;\n\
    }, 0) / children.length;\n\
  }\n\
  function d3_layout_clusterLeft(node) {\n\
    var children = node.children;\n\
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;\n\
  }\n\
  function d3_layout_clusterRight(node) {\n\
    var children = node.children, n;\n\
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;\n\
  }\n\
  d3.layout.treemap = function() {\n\
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = \"squarify\", ratio = .5 * (1 + Math.sqrt(5));\n\
    function scale(children, k) {\n\
      var i = -1, n = children.length, child, area;\n\
      while (++i < n) {\n\
        area = (child = children[i]).value * (k < 0 ? 0 : k);\n\
        child.area = isNaN(area) || area <= 0 ? 0 : area;\n\
      }\n\
    }\n\
    function squarify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === \"slice\" ? rect.dx : mode === \"dice\" ? rect.dy : mode === \"slice-dice\" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while ((n = remaining.length) > 0) {\n\
          row.push(child = remaining[n - 1]);\n\
          row.area += child.area;\n\
          if (mode !== \"squarify\" || (score = worst(row, u)) <= best) {\n\
            remaining.pop();\n\
            best = score;\n\
          } else {\n\
            row.area -= row.pop().area;\n\
            position(row, u, rect, false);\n\
            u = Math.min(rect.dx, rect.dy);\n\
            row.length = row.area = 0;\n\
            best = Infinity;\n\
          }\n\
        }\n\
        if (row.length) {\n\
          position(row, u, rect, true);\n\
          row.length = row.area = 0;\n\
        }\n\
        children.forEach(squarify);\n\
      }\n\
    }\n\
    function stickify(node) {\n\
      var children = node.children;\n\
      if (children && children.length) {\n\
        var rect = pad(node), remaining = children.slice(), child, row = [];\n\
        scale(remaining, rect.dx * rect.dy / node.value);\n\
        row.area = 0;\n\
        while (child = remaining.pop()) {\n\
          row.push(child);\n\
          row.area += child.area;\n\
          if (child.z != null) {\n\
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);\n\
            row.length = row.area = 0;\n\
          }\n\
        }\n\
        children.forEach(stickify);\n\
      }\n\
    }\n\
    function worst(row, u) {\n\
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;\n\
      while (++i < n) {\n\
        if (!(r = row[i].area)) continue;\n\
        if (r < rmin) rmin = r;\n\
        if (r > rmax) rmax = r;\n\
      }\n\
      s *= s;\n\
      u *= u;\n\
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;\n\
    }\n\
    function position(row, u, rect, flush) {\n\
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;\n\
      if (u == rect.dx) {\n\
        if (flush || v > rect.dy) v = rect.dy;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dy = v;\n\
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = true;\n\
        o.dx += rect.x + rect.dx - x;\n\
        rect.y += v;\n\
        rect.dy -= v;\n\
      } else {\n\
        if (flush || v > rect.dx) v = rect.dx;\n\
        while (++i < n) {\n\
          o = row[i];\n\
          o.x = x;\n\
          o.y = y;\n\
          o.dx = v;\n\
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);\n\
        }\n\
        o.z = false;\n\
        o.dy += rect.y + rect.dy - y;\n\
        rect.x += v;\n\
        rect.dx -= v;\n\
      }\n\
    }\n\
    function treemap(d) {\n\
      var nodes = stickies || hierarchy(d), root = nodes[0];\n\
      root.x = 0;\n\
      root.y = 0;\n\
      root.dx = size[0];\n\
      root.dy = size[1];\n\
      if (stickies) hierarchy.revalue(root);\n\
      scale([ root ], root.dx * root.dy / root.value);\n\
      (stickies ? stickify : squarify)(root);\n\
      if (sticky) stickies = nodes;\n\
      return nodes;\n\
    }\n\
    treemap.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = x;\n\
      return treemap;\n\
    };\n\
    treemap.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      function padFunction(node) {\n\
        var p = x.call(treemap, node, node.depth);\n\
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === \"number\" ? [ p, p, p, p ] : p);\n\
      }\n\
      function padConstant(node) {\n\
        return d3_layout_treemapPad(node, x);\n\
      }\n\
      var type;\n\
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === \"function\" ? padFunction : type === \"number\" ? (x = [ x, x, x, x ], \n\
      padConstant) : padConstant;\n\
      return treemap;\n\
    };\n\
    treemap.round = function(x) {\n\
      if (!arguments.length) return round != Number;\n\
      round = x ? Math.round : Number;\n\
      return treemap;\n\
    };\n\
    treemap.sticky = function(x) {\n\
      if (!arguments.length) return sticky;\n\
      sticky = x;\n\
      stickies = null;\n\
      return treemap;\n\
    };\n\
    treemap.ratio = function(x) {\n\
      if (!arguments.length) return ratio;\n\
      ratio = x;\n\
      return treemap;\n\
    };\n\
    treemap.mode = function(x) {\n\
      if (!arguments.length) return mode;\n\
      mode = x + \"\";\n\
      return treemap;\n\
    };\n\
    return d3_layout_hierarchyRebind(treemap, hierarchy);\n\
  };\n\
  function d3_layout_treemapPadNull(node) {\n\
    return {\n\
      x: node.x,\n\
      y: node.y,\n\
      dx: node.dx,\n\
      dy: node.dy\n\
    };\n\
  }\n\
  function d3_layout_treemapPad(node, padding) {\n\
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];\n\
    if (dx < 0) {\n\
      x += dx / 2;\n\
      dx = 0;\n\
    }\n\
    if (dy < 0) {\n\
      y += dy / 2;\n\
      dy = 0;\n\
    }\n\
    return {\n\
      x: x,\n\
      y: y,\n\
      dx: dx,\n\
      dy: dy\n\
    };\n\
  }\n\
  d3.random = {\n\
    normal: function(µ, σ) {\n\
      var n = arguments.length;\n\
      if (n < 2) σ = 1;\n\
      if (n < 1) µ = 0;\n\
      return function() {\n\
        var x, y, r;\n\
        do {\n\
          x = Math.random() * 2 - 1;\n\
          y = Math.random() * 2 - 1;\n\
          r = x * x + y * y;\n\
        } while (!r || r > 1);\n\
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);\n\
      };\n\
    },\n\
    logNormal: function() {\n\
      var random = d3.random.normal.apply(d3, arguments);\n\
      return function() {\n\
        return Math.exp(random());\n\
      };\n\
    },\n\
    irwinHall: function(m) {\n\
      return function() {\n\
        for (var s = 0, j = 0; j < m; j++) s += Math.random();\n\
        return s / m;\n\
      };\n\
    }\n\
  };\n\
  d3.scale = {};\n\
  function d3_scaleExtent(domain) {\n\
    var start = domain[0], stop = domain[domain.length - 1];\n\
    return start < stop ? [ start, stop ] : [ stop, start ];\n\
  }\n\
  function d3_scaleRange(scale) {\n\
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());\n\
  }\n\
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {\n\
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);\n\
    return function(x) {\n\
      return i(u(x));\n\
    };\n\
  }\n\
  function d3_scale_nice(domain, nice) {\n\
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;\n\
    if (x1 < x0) {\n\
      dx = i0, i0 = i1, i1 = dx;\n\
      dx = x0, x0 = x1, x1 = dx;\n\
    }\n\
    domain[i0] = nice.floor(x0);\n\
    domain[i1] = nice.ceil(x1);\n\
    return domain;\n\
  }\n\
  function d3_scale_niceStep(step) {\n\
    return step ? {\n\
      floor: function(x) {\n\
        return Math.floor(x / step) * step;\n\
      },\n\
      ceil: function(x) {\n\
        return Math.ceil(x / step) * step;\n\
      }\n\
    } : d3_scale_niceIdentity;\n\
  }\n\
  var d3_scale_niceIdentity = {\n\
    floor: d3_identity,\n\
    ceil: d3_identity\n\
  };\n\
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {\n\
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;\n\
    if (domain[k] < domain[0]) {\n\
      domain = domain.slice().reverse();\n\
      range = range.slice().reverse();\n\
    }\n\
    while (++j <= k) {\n\
      u.push(uninterpolate(domain[j - 1], domain[j]));\n\
      i.push(interpolate(range[j - 1], range[j]));\n\
    }\n\
    return function(x) {\n\
      var j = d3.bisect(domain, x, 1, k) - 1;\n\
      return i[j](u[j](x));\n\
    };\n\
  }\n\
  d3.scale.linear = function() {\n\
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);\n\
  };\n\
  function d3_scale_linear(domain, range, interpolate, clamp) {\n\
    var output, input;\n\
    function rescale() {\n\
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;\n\
      output = linear(domain, range, uninterpolate, interpolate);\n\
      input = linear(range, domain, uninterpolate, d3_interpolate);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      return output(x);\n\
    }\n\
    scale.invert = function(y) {\n\
      return input(y);\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(Number);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.rangeRound = function(x) {\n\
      return scale.range(x).interpolate(d3_interpolateRound);\n\
    };\n\
    scale.clamp = function(x) {\n\
      if (!arguments.length) return clamp;\n\
      clamp = x;\n\
      return rescale();\n\
    };\n\
    scale.interpolate = function(x) {\n\
      if (!arguments.length) return interpolate;\n\
      interpolate = x;\n\
      return rescale();\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      d3_scale_linearNice(domain, m);\n\
      return rescale();\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_linear(domain, range, interpolate, clamp);\n\
    };\n\
    return rescale();\n\
  }\n\
  function d3_scale_linearRebind(scale, linear) {\n\
    return d3.rebind(scale, linear, \"range\", \"rangeRound\", \"interpolate\", \"clamp\");\n\
  }\n\
  function d3_scale_linearNice(domain, m) {\n\
    return d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));\n\
  }\n\
  function d3_scale_linearTickRange(domain, m) {\n\
    if (m == null) m = 10;\n\
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;\n\
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;\n\
    extent[0] = Math.ceil(extent[0] / step) * step;\n\
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;\n\
    extent[2] = step;\n\
    return extent;\n\
  }\n\
  function d3_scale_linearTicks(domain, m) {\n\
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));\n\
  }\n\
  function d3_scale_linearTickFormat(domain, m, format) {\n\
    var range = d3_scale_linearTickRange(domain, m);\n\
    return d3.format(format ? format.replace(d3_format_re, function(a, b, c, d, e, f, g, h, i, j) {\n\
      return [ b, c, d, e, f, g, h, i || \".\" + d3_scale_linearFormatPrecision(j, range), j ].join(\"\");\n\
    }) : \",.\" + d3_scale_linearPrecision(range[2]) + \"f\");\n\
  }\n\
  var d3_scale_linearFormatSignificant = {\n\
    s: 1,\n\
    g: 1,\n\
    p: 1,\n\
    r: 1,\n\
    e: 1\n\
  };\n\
  function d3_scale_linearPrecision(value) {\n\
    return -Math.floor(Math.log(value) / Math.LN10 + .01);\n\
  }\n\
  function d3_scale_linearFormatPrecision(type, range) {\n\
    var p = d3_scale_linearPrecision(range[2]);\n\
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(Math.abs(range[0]), Math.abs(range[1])))) + +(type !== \"e\") : p - (type === \"%\") * 2;\n\
  }\n\
  d3.scale.log = function() {\n\
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);\n\
  };\n\
  function d3_scale_log(linear, base, positive, domain) {\n\
    function log(x) {\n\
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);\n\
    }\n\
    function pow(x) {\n\
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);\n\
    }\n\
    function scale(x) {\n\
      return linear(log(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return pow(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      positive = x[0] >= 0;\n\
      linear.domain((domain = x.map(Number)).map(log));\n\
      return scale;\n\
    };\n\
    scale.base = function(_) {\n\
      if (!arguments.length) return base;\n\
      base = +_;\n\
      linear.domain(domain.map(log));\n\
      return scale;\n\
    };\n\
    scale.nice = function() {\n\
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);\n\
      linear.domain(niced);\n\
      domain = niced.map(pow);\n\
      return scale;\n\
    };\n\
    scale.ticks = function() {\n\
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;\n\
      if (isFinite(j - i)) {\n\
        if (positive) {\n\
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);\n\
          ticks.push(pow(i));\n\
        } else {\n\
          ticks.push(pow(i));\n\
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);\n\
        }\n\
        for (i = 0; ticks[i] < u; i++) {}\n\
        for (j = ticks.length; ticks[j - 1] > v; j--) {}\n\
        ticks = ticks.slice(i, j);\n\
      }\n\
      return ticks;\n\
    };\n\
    scale.tickFormat = function(n, format) {\n\
      if (!arguments.length) return d3_scale_logFormat;\n\
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== \"function\") format = d3.format(format);\n\
      var k = Math.max(.1, n / scale.ticks().length), f = positive ? (e = 1e-12, Math.ceil) : (e = -1e-12, \n\
      Math.floor), e;\n\
      return function(d) {\n\
        return d / pow(f(log(d) + e)) <= k ? format(d) : \"\";\n\
      };\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_log(linear.copy(), base, positive, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  var d3_scale_logFormat = d3.format(\".0e\"), d3_scale_logNiceNegative = {\n\
    floor: function(x) {\n\
      return -Math.ceil(-x);\n\
    },\n\
    ceil: function(x) {\n\
      return -Math.floor(-x);\n\
    }\n\
  };\n\
  d3.scale.pow = function() {\n\
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_pow(linear, exponent, domain) {\n\
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);\n\
    function scale(x) {\n\
      return linear(powp(x));\n\
    }\n\
    scale.invert = function(x) {\n\
      return powb(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      linear.domain((domain = x.map(Number)).map(powp));\n\
      return scale;\n\
    };\n\
    scale.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    scale.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    scale.nice = function(m) {\n\
      return scale.domain(d3_scale_linearNice(domain, m));\n\
    };\n\
    scale.exponent = function(x) {\n\
      if (!arguments.length) return exponent;\n\
      powp = d3_scale_powPow(exponent = x);\n\
      powb = d3_scale_powPow(1 / exponent);\n\
      linear.domain(domain.map(powp));\n\
      return scale;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_pow(linear.copy(), exponent, domain);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_scale_powPow(e) {\n\
    return function(x) {\n\
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);\n\
    };\n\
  }\n\
  d3.scale.sqrt = function() {\n\
    return d3.scale.pow().exponent(.5);\n\
  };\n\
  d3.scale.ordinal = function() {\n\
    return d3_scale_ordinal([], {\n\
      t: \"range\",\n\
      a: [ [] ]\n\
    });\n\
  };\n\
  function d3_scale_ordinal(domain, ranger) {\n\
    var index, range, rangeBand;\n\
    function scale(x) {\n\
      return range[((index.get(x) || ranger.t === \"range\" && index.set(x, domain.push(x))) - 1) % range.length];\n\
    }\n\
    function steps(start, step) {\n\
      return d3.range(domain.length).map(function(i) {\n\
        return start + step * i;\n\
      });\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = [];\n\
      index = new d3_Map();\n\
      var i = -1, n = x.length, xi;\n\
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));\n\
      return scale[ranger.t].apply(scale, ranger.a);\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"range\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangePoints = function(x, padding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      var start = x[0], stop = x[1], step = (stop - start) / (Math.max(1, domain.length - 1) + padding);\n\
      range = steps(domain.length < 2 ? (start + stop) / 2 : start + step * padding / 2, step);\n\
      rangeBand = 0;\n\
      ranger = {\n\
        t: \"rangePoints\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);\n\
      range = steps(start + step * outerPadding, step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = step * (1 - padding);\n\
      ranger = {\n\
        t: \"rangeBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeRoundBands = function(x, padding, outerPadding) {\n\
      if (arguments.length < 2) padding = 0;\n\
      if (arguments.length < 3) outerPadding = padding;\n\
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding)), error = stop - start - (domain.length - padding) * step;\n\
      range = steps(start + Math.round(error / 2), step);\n\
      if (reverse) range.reverse();\n\
      rangeBand = Math.round(step * (1 - padding));\n\
      ranger = {\n\
        t: \"rangeRoundBands\",\n\
        a: arguments\n\
      };\n\
      return scale;\n\
    };\n\
    scale.rangeBand = function() {\n\
      return rangeBand;\n\
    };\n\
    scale.rangeExtent = function() {\n\
      return d3_scaleExtent(ranger.a[0]);\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_ordinal(domain, ranger);\n\
    };\n\
    return scale.domain(domain);\n\
  }\n\
  d3.scale.category10 = function() {\n\
    return d3.scale.ordinal().range(d3_category10);\n\
  };\n\
  d3.scale.category20 = function() {\n\
    return d3.scale.ordinal().range(d3_category20);\n\
  };\n\
  d3.scale.category20b = function() {\n\
    return d3.scale.ordinal().range(d3_category20b);\n\
  };\n\
  d3.scale.category20c = function() {\n\
    return d3.scale.ordinal().range(d3_category20c);\n\
  };\n\
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);\n\
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);\n\
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);\n\
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);\n\
  d3.scale.quantile = function() {\n\
    return d3_scale_quantile([], []);\n\
  };\n\
  function d3_scale_quantile(domain, range) {\n\
    var thresholds;\n\
    function rescale() {\n\
      var k = 0, q = range.length;\n\
      thresholds = [];\n\
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);\n\
      return scale;\n\
    }\n\
    function scale(x) {\n\
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.filter(function(d) {\n\
        return !isNaN(d);\n\
      }).sort(d3.ascending);\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.quantiles = function() {\n\
      return thresholds;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantile(domain, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.quantize = function() {\n\
    return d3_scale_quantize(0, 1, [ 0, 1 ]);\n\
  };\n\
  function d3_scale_quantize(x0, x1, range) {\n\
    var kx, i;\n\
    function scale(x) {\n\
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];\n\
    }\n\
    function rescale() {\n\
      kx = range.length / (x1 - x0);\n\
      i = range.length - 1;\n\
      return scale;\n\
    }\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return [ x0, x1 ];\n\
      x0 = +x[0];\n\
      x1 = +x[x.length - 1];\n\
      return rescale();\n\
    };\n\
    scale.range = function(x) {\n\
      if (!arguments.length) return range;\n\
      range = x;\n\
      return rescale();\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      y = y < 0 ? NaN : y / kx + x0;\n\
      return [ y, y + 1 / kx ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_quantize(x0, x1, range);\n\
    };\n\
    return rescale();\n\
  }\n\
  d3.scale.threshold = function() {\n\
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);\n\
  };\n\
  function d3_scale_threshold(domain, range) {\n\
    function scale(x) {\n\
      if (x <= x) return range[d3.bisect(domain, x)];\n\
    }\n\
    scale.domain = function(_) {\n\
      if (!arguments.length) return domain;\n\
      domain = _;\n\
      return scale;\n\
    };\n\
    scale.range = function(_) {\n\
      if (!arguments.length) return range;\n\
      range = _;\n\
      return scale;\n\
    };\n\
    scale.invertExtent = function(y) {\n\
      y = range.indexOf(y);\n\
      return [ domain[y - 1], domain[y] ];\n\
    };\n\
    scale.copy = function() {\n\
      return d3_scale_threshold(domain, range);\n\
    };\n\
    return scale;\n\
  }\n\
  d3.scale.identity = function() {\n\
    return d3_scale_identity([ 0, 1 ]);\n\
  };\n\
  function d3_scale_identity(domain) {\n\
    function identity(x) {\n\
      return +x;\n\
    }\n\
    identity.invert = identity;\n\
    identity.domain = identity.range = function(x) {\n\
      if (!arguments.length) return domain;\n\
      domain = x.map(identity);\n\
      return identity;\n\
    };\n\
    identity.ticks = function(m) {\n\
      return d3_scale_linearTicks(domain, m);\n\
    };\n\
    identity.tickFormat = function(m, format) {\n\
      return d3_scale_linearTickFormat(domain, m, format);\n\
    };\n\
    identity.copy = function() {\n\
      return d3_scale_identity(domain);\n\
    };\n\
    return identity;\n\
  }\n\
  d3.svg = {};\n\
  d3.svg.arc = function() {\n\
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function arc() {\n\
      var r0 = innerRadius.apply(this, arguments), r1 = outerRadius.apply(this, arguments), a0 = startAngle.apply(this, arguments) + d3_svg_arcOffset, a1 = endAngle.apply(this, arguments) + d3_svg_arcOffset, da = (a1 < a0 && (da = a0, \n\
      a0 = a1, a1 = da), a1 - a0), df = da < π ? \"0\" : \"1\", c0 = Math.cos(a0), s0 = Math.sin(a0), c1 = Math.cos(a1), s1 = Math.sin(a1);\n\
      return da >= d3_svg_arcMax ? r0 ? \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"M0,\" + r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + -r0 + \"A\" + r0 + \",\" + r0 + \" 0 1,0 0,\" + r0 + \"Z\" : \"M0,\" + r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + -r1 + \"A\" + r1 + \",\" + r1 + \" 0 1,1 0,\" + r1 + \"Z\" : r0 ? \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L\" + r0 * c1 + \",\" + r0 * s1 + \"A\" + r0 + \",\" + r0 + \" 0 \" + df + \",0 \" + r0 * c0 + \",\" + r0 * s0 + \"Z\" : \"M\" + r1 * c0 + \",\" + r1 * s0 + \"A\" + r1 + \",\" + r1 + \" 0 \" + df + \",1 \" + r1 * c1 + \",\" + r1 * s1 + \"L0,0\" + \"Z\";\n\
    }\n\
    arc.innerRadius = function(v) {\n\
      if (!arguments.length) return innerRadius;\n\
      innerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.outerRadius = function(v) {\n\
      if (!arguments.length) return outerRadius;\n\
      outerRadius = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return arc;\n\
    };\n\
    arc.centroid = function() {\n\
      var r = (innerRadius.apply(this, arguments) + outerRadius.apply(this, arguments)) / 2, a = (startAngle.apply(this, arguments) + endAngle.apply(this, arguments)) / 2 + d3_svg_arcOffset;\n\
      return [ Math.cos(a) * r, Math.sin(a) * r ];\n\
    };\n\
    return arc;\n\
  };\n\
  var d3_svg_arcOffset = -halfπ, d3_svg_arcMax = τ - ε;\n\
  function d3_svg_arcInnerRadius(d) {\n\
    return d.innerRadius;\n\
  }\n\
  function d3_svg_arcOuterRadius(d) {\n\
    return d.outerRadius;\n\
  }\n\
  function d3_svg_arcStartAngle(d) {\n\
    return d.startAngle;\n\
  }\n\
  function d3_svg_arcEndAngle(d) {\n\
    return d.endAngle;\n\
  }\n\
  function d3_svg_line(projection) {\n\
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;\n\
    function line(data) {\n\
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points), tension));\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);\n\
        } else if (points.length) {\n\
          segment();\n\
          points = [];\n\
        }\n\
      }\n\
      if (points.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    line.x = function(_) {\n\
      if (!arguments.length) return x;\n\
      x = _;\n\
      return line;\n\
    };\n\
    line.y = function(_) {\n\
      if (!arguments.length) return y;\n\
      y = _;\n\
      return line;\n\
    };\n\
    line.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return line;\n\
    };\n\
    line.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      return line;\n\
    };\n\
    line.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return line;\n\
    };\n\
    return line;\n\
  }\n\
  d3.svg.line = function() {\n\
    return d3_svg_line(d3_identity);\n\
  };\n\
  var d3_svg_lineInterpolators = d3.map({\n\
    linear: d3_svg_lineLinear,\n\
    \"linear-closed\": d3_svg_lineLinearClosed,\n\
    step: d3_svg_lineStep,\n\
    \"step-before\": d3_svg_lineStepBefore,\n\
    \"step-after\": d3_svg_lineStepAfter,\n\
    basis: d3_svg_lineBasis,\n\
    \"basis-open\": d3_svg_lineBasisOpen,\n\
    \"basis-closed\": d3_svg_lineBasisClosed,\n\
    bundle: d3_svg_lineBundle,\n\
    cardinal: d3_svg_lineCardinal,\n\
    \"cardinal-open\": d3_svg_lineCardinalOpen,\n\
    \"cardinal-closed\": d3_svg_lineCardinalClosed,\n\
    monotone: d3_svg_lineMonotone\n\
  });\n\
  d3_svg_lineInterpolators.forEach(function(key, value) {\n\
    value.key = key;\n\
    value.closed = /-closed$/.test(key);\n\
  });\n\
  function d3_svg_lineLinear(points) {\n\
    return points.join(\"L\");\n\
  }\n\
  function d3_svg_lineLinearClosed(points) {\n\
    return d3_svg_lineLinear(points) + \"Z\";\n\
  }\n\
  function d3_svg_lineStep(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p[0] + (p = points[i])[0]) / 2, \"V\", p[1]);\n\
    if (n > 1) path.push(\"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepBefore(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"V\", (p = points[i])[1], \"H\", p[0]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineStepAfter(points) {\n\
    var i = 0, n = points.length, p = points[0], path = [ p[0], \",\", p[1] ];\n\
    while (++i < n) path.push(\"H\", (p = points[i])[0], \"V\", p[1]);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineCardinalOpen(points, tension) {\n\
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, points.length - 1), d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineCardinalClosed(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), \n\
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));\n\
  }\n\
  function d3_svg_lineCardinal(points, tension) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));\n\
  }\n\
  function d3_svg_lineHermite(points, tangents) {\n\
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {\n\
      return d3_svg_lineLinear(points);\n\
    }\n\
    var quad = points.length != tangents.length, path = \"\", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;\n\
    if (quad) {\n\
      path += \"Q\" + (p[0] - t0[0] * 2 / 3) + \",\" + (p[1] - t0[1] * 2 / 3) + \",\" + p[0] + \",\" + p[1];\n\
      p0 = points[1];\n\
      pi = 2;\n\
    }\n\
    if (tangents.length > 1) {\n\
      t = tangents[1];\n\
      p = points[pi];\n\
      pi++;\n\
      path += \"C\" + (p0[0] + t0[0]) + \",\" + (p0[1] + t0[1]) + \",\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      for (var i = 2; i < tangents.length; i++, pi++) {\n\
        p = points[pi];\n\
        t = tangents[i];\n\
        path += \"S\" + (p[0] - t[0]) + \",\" + (p[1] - t[1]) + \",\" + p[0] + \",\" + p[1];\n\
      }\n\
    }\n\
    if (quad) {\n\
      var lp = points[pi];\n\
      path += \"Q\" + (p[0] + t[0] * 2 / 3) + \",\" + (p[1] + t[1] * 2 / 3) + \",\" + lp[0] + \",\" + lp[1];\n\
    }\n\
    return path;\n\
  }\n\
  function d3_svg_lineCardinalTangents(points, tension) {\n\
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;\n\
    while (++i < n) {\n\
      p0 = p1;\n\
      p1 = p2;\n\
      p2 = points[i];\n\
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineBasis(points) {\n\
    if (points.length < 3) return d3_svg_lineLinear(points);\n\
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, \",\", y0, \"L\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    points.push(points[n - 1]);\n\
    while (++i <= n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    points.pop();\n\
    path.push(\"L\", pi);\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisOpen(points) {\n\
    if (points.length < 4) return d3_svg_lineLinear(points);\n\
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];\n\
    while (++i < 3) {\n\
      pi = points[i];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + \",\" + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));\n\
    --i;\n\
    while (++i < n) {\n\
      pi = points[i];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBasisClosed(points) {\n\
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];\n\
    while (++i < 4) {\n\
      pi = points[i % n];\n\
      px.push(pi[0]);\n\
      py.push(pi[1]);\n\
    }\n\
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];\n\
    --i;\n\
    while (++i < m) {\n\
      pi = points[i % n];\n\
      px.shift();\n\
      px.push(pi[0]);\n\
      py.shift();\n\
      py.push(pi[1]);\n\
      d3_svg_lineBasisBezier(path, px, py);\n\
    }\n\
    return path.join(\"\");\n\
  }\n\
  function d3_svg_lineBundle(points, tension) {\n\
    var n = points.length - 1;\n\
    if (n) {\n\
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;\n\
      while (++i <= n) {\n\
        p = points[i];\n\
        t = i / n;\n\
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);\n\
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);\n\
      }\n\
    }\n\
    return d3_svg_lineBasis(points);\n\
  }\n\
  function d3_svg_lineDot4(a, b) {\n\
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];\n\
  }\n\
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];\n\
  function d3_svg_lineBasisBezier(path, x, y) {\n\
    path.push(\"C\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), \",\", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));\n\
  }\n\
  function d3_svg_lineSlope(p0, p1) {\n\
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);\n\
  }\n\
  function d3_svg_lineFiniteDifferences(points) {\n\
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);\n\
    while (++i < j) {\n\
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;\n\
    }\n\
    m[i] = d;\n\
    return m;\n\
  }\n\
  function d3_svg_lineMonotoneTangents(points) {\n\
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;\n\
    while (++i < j) {\n\
      d = d3_svg_lineSlope(points[i], points[i + 1]);\n\
      if (abs(d) < ε) {\n\
        m[i] = m[i + 1] = 0;\n\
      } else {\n\
        a = m[i] / d;\n\
        b = m[i + 1] / d;\n\
        s = a * a + b * b;\n\
        if (s > 9) {\n\
          s = d * 3 / Math.sqrt(s);\n\
          m[i] = s * a;\n\
          m[i + 1] = s * b;\n\
        }\n\
      }\n\
    }\n\
    i = -1;\n\
    while (++i <= j) {\n\
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));\n\
      tangents.push([ s || 0, m[i] * s || 0 ]);\n\
    }\n\
    return tangents;\n\
  }\n\
  function d3_svg_lineMonotone(points) {\n\
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));\n\
  }\n\
  d3.svg.line.radial = function() {\n\
    var line = d3_svg_line(d3_svg_lineRadial);\n\
    line.radius = line.x, delete line.x;\n\
    line.angle = line.y, delete line.y;\n\
    return line;\n\
  };\n\
  function d3_svg_lineRadial(points) {\n\
    var point, i = -1, n = points.length, r, a;\n\
    while (++i < n) {\n\
      point = points[i];\n\
      r = point[0];\n\
      a = point[1] + d3_svg_arcOffset;\n\
      point[0] = r * Math.cos(a);\n\
      point[1] = r * Math.sin(a);\n\
    }\n\
    return points;\n\
  }\n\
  function d3_svg_area(projection) {\n\
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = \"L\", tension = .7;\n\
    function area(data) {\n\
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {\n\
        return x;\n\
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {\n\
        return y;\n\
      } : d3_functor(y1), x, y;\n\
      function segment() {\n\
        segments.push(\"M\", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), \"Z\");\n\
      }\n\
      while (++i < n) {\n\
        if (defined.call(this, d = data[i], i)) {\n\
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);\n\
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);\n\
        } else if (points0.length) {\n\
          segment();\n\
          points0 = [];\n\
          points1 = [];\n\
        }\n\
      }\n\
      if (points0.length) segment();\n\
      return segments.length ? segments.join(\"\") : null;\n\
    }\n\
    area.x = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x0 = x1 = _;\n\
      return area;\n\
    };\n\
    area.x0 = function(_) {\n\
      if (!arguments.length) return x0;\n\
      x0 = _;\n\
      return area;\n\
    };\n\
    area.x1 = function(_) {\n\
      if (!arguments.length) return x1;\n\
      x1 = _;\n\
      return area;\n\
    };\n\
    area.y = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y0 = y1 = _;\n\
      return area;\n\
    };\n\
    area.y0 = function(_) {\n\
      if (!arguments.length) return y0;\n\
      y0 = _;\n\
      return area;\n\
    };\n\
    area.y1 = function(_) {\n\
      if (!arguments.length) return y1;\n\
      y1 = _;\n\
      return area;\n\
    };\n\
    area.defined = function(_) {\n\
      if (!arguments.length) return defined;\n\
      defined = _;\n\
      return area;\n\
    };\n\
    area.interpolate = function(_) {\n\
      if (!arguments.length) return interpolateKey;\n\
      if (typeof _ === \"function\") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;\n\
      interpolateReverse = interpolate.reverse || interpolate;\n\
      L = interpolate.closed ? \"M\" : \"L\";\n\
      return area;\n\
    };\n\
    area.tension = function(_) {\n\
      if (!arguments.length) return tension;\n\
      tension = _;\n\
      return area;\n\
    };\n\
    return area;\n\
  }\n\
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;\n\
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;\n\
  d3.svg.area = function() {\n\
    return d3_svg_area(d3_identity);\n\
  };\n\
  d3.svg.area.radial = function() {\n\
    var area = d3_svg_area(d3_svg_lineRadial);\n\
    area.radius = area.x, delete area.x;\n\
    area.innerRadius = area.x0, delete area.x0;\n\
    area.outerRadius = area.x1, delete area.x1;\n\
    area.angle = area.y, delete area.y;\n\
    area.startAngle = area.y0, delete area.y0;\n\
    area.endAngle = area.y1, delete area.y1;\n\
    return area;\n\
  };\n\
  d3.svg.chord = function() {\n\
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;\n\
    function chord(d, i) {\n\
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);\n\
      return \"M\" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + \"Z\";\n\
    }\n\
    function subgroup(self, f, d, i) {\n\
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) + d3_svg_arcOffset, a1 = endAngle.call(self, subgroup, i) + d3_svg_arcOffset;\n\
      return {\n\
        r: r,\n\
        a0: a0,\n\
        a1: a1,\n\
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],\n\
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]\n\
      };\n\
    }\n\
    function equals(a, b) {\n\
      return a.a0 == b.a0 && a.a1 == b.a1;\n\
    }\n\
    function arc(r, p, a) {\n\
      return \"A\" + r + \",\" + r + \" 0 \" + +(a > π) + \",1 \" + p;\n\
    }\n\
    function curve(r0, p0, r1, p1) {\n\
      return \"Q 0,0 \" + p1;\n\
    }\n\
    chord.radius = function(v) {\n\
      if (!arguments.length) return radius;\n\
      radius = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.source = function(v) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.target = function(v) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.startAngle = function(v) {\n\
      if (!arguments.length) return startAngle;\n\
      startAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    chord.endAngle = function(v) {\n\
      if (!arguments.length) return endAngle;\n\
      endAngle = d3_functor(v);\n\
      return chord;\n\
    };\n\
    return chord;\n\
  };\n\
  function d3_svg_chordRadius(d) {\n\
    return d.radius;\n\
  }\n\
  d3.svg.diagonal = function() {\n\
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;\n\
    function diagonal(d, i) {\n\
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {\n\
        x: p0.x,\n\
        y: m\n\
      }, {\n\
        x: p3.x,\n\
        y: m\n\
      }, p3 ];\n\
      p = p.map(projection);\n\
      return \"M\" + p[0] + \"C\" + p[1] + \" \" + p[2] + \" \" + p[3];\n\
    }\n\
    diagonal.source = function(x) {\n\
      if (!arguments.length) return source;\n\
      source = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.target = function(x) {\n\
      if (!arguments.length) return target;\n\
      target = d3_functor(x);\n\
      return diagonal;\n\
    };\n\
    diagonal.projection = function(x) {\n\
      if (!arguments.length) return projection;\n\
      projection = x;\n\
      return diagonal;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalProjection(d) {\n\
    return [ d.x, d.y ];\n\
  }\n\
  d3.svg.diagonal.radial = function() {\n\
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;\n\
    diagonal.projection = function(x) {\n\
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;\n\
    };\n\
    return diagonal;\n\
  };\n\
  function d3_svg_diagonalRadialProjection(projection) {\n\
    return function() {\n\
      var d = projection.apply(this, arguments), r = d[0], a = d[1] + d3_svg_arcOffset;\n\
      return [ r * Math.cos(a), r * Math.sin(a) ];\n\
    };\n\
  }\n\
  d3.svg.symbol = function() {\n\
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;\n\
    function symbol(d, i) {\n\
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));\n\
    }\n\
    symbol.type = function(x) {\n\
      if (!arguments.length) return type;\n\
      type = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    symbol.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = d3_functor(x);\n\
      return symbol;\n\
    };\n\
    return symbol;\n\
  };\n\
  function d3_svg_symbolSize() {\n\
    return 64;\n\
  }\n\
  function d3_svg_symbolType() {\n\
    return \"circle\";\n\
  }\n\
  function d3_svg_symbolCircle(size) {\n\
    var r = Math.sqrt(size / π);\n\
    return \"M0,\" + r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + -r + \"A\" + r + \",\" + r + \" 0 1,1 0,\" + r + \"Z\";\n\
  }\n\
  var d3_svg_symbols = d3.map({\n\
    circle: d3_svg_symbolCircle,\n\
    cross: function(size) {\n\
      var r = Math.sqrt(size / 5) / 2;\n\
      return \"M\" + -3 * r + \",\" + -r + \"H\" + -r + \"V\" + -3 * r + \"H\" + r + \"V\" + -r + \"H\" + 3 * r + \"V\" + r + \"H\" + r + \"V\" + 3 * r + \"H\" + -r + \"V\" + r + \"H\" + -3 * r + \"Z\";\n\
    },\n\
    diamond: function(size) {\n\
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",0\" + \" 0,\" + ry + \" \" + -rx + \",0\" + \"Z\";\n\
    },\n\
    square: function(size) {\n\
      var r = Math.sqrt(size) / 2;\n\
      return \"M\" + -r + \",\" + -r + \"L\" + r + \",\" + -r + \" \" + r + \",\" + r + \" \" + -r + \",\" + r + \"Z\";\n\
    },\n\
    \"triangle-down\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + ry + \"L\" + rx + \",\" + -ry + \" \" + -rx + \",\" + -ry + \"Z\";\n\
    },\n\
    \"triangle-up\": function(size) {\n\
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;\n\
      return \"M0,\" + -ry + \"L\" + rx + \",\" + ry + \" \" + -rx + \",\" + ry + \"Z\";\n\
    }\n\
  });\n\
  d3.svg.symbolTypes = d3_svg_symbols.keys();\n\
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);\n\
  function d3_transition(groups, id) {\n\
    d3_subclass(groups, d3_transitionPrototype);\n\
    groups.id = id;\n\
    return groups;\n\
  }\n\
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;\n\
  d3_transitionPrototype.call = d3_selectionPrototype.call;\n\
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;\n\
  d3_transitionPrototype.node = d3_selectionPrototype.node;\n\
  d3_transitionPrototype.size = d3_selectionPrototype.size;\n\
  d3.transition = function(selection) {\n\
    return arguments.length ? d3_transitionInheritId ? selection.transition() : selection : d3_selectionRoot.transition();\n\
  };\n\
  d3.transition.prototype = d3_transitionPrototype;\n\
  d3_transitionPrototype.select = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnode, node;\n\
    selector = d3_selection_selector(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {\n\
          if (\"__data__\" in node) subnode.__data__ = node.__data__;\n\
          d3_transitionNode(subnode, i, id, node.__transition__[id]);\n\
          subgroup.push(subnode);\n\
        } else {\n\
          subgroup.push(null);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.selectAll = function(selector) {\n\
    var id = this.id, subgroups = [], subgroup, subnodes, node, subnode, transition;\n\
    selector = d3_selection_selectorAll(selector);\n\
    for (var j = -1, m = this.length; ++j < m; ) {\n\
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {\n\
        if (node = group[i]) {\n\
          transition = node.__transition__[id];\n\
          subnodes = selector.call(node, node.__data__, i, j);\n\
          subgroups.push(subgroup = []);\n\
          for (var k = -1, o = subnodes.length; ++k < o; ) {\n\
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, id, transition);\n\
            subgroup.push(subnode);\n\
          }\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id);\n\
  };\n\
  d3_transitionPrototype.filter = function(filter) {\n\
    var subgroups = [], subgroup, group, node;\n\
    if (typeof filter !== \"function\") filter = d3_selection_filter(filter);\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {\n\
          subgroup.push(node);\n\
        }\n\
      }\n\
    }\n\
    return d3_transition(subgroups, this.id);\n\
  };\n\
  d3_transitionPrototype.tween = function(name, tween) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) return this.node().__transition__[id].tween.get(name);\n\
    return d3_selection_each(this, tween == null ? function(node) {\n\
      node.__transition__[id].tween.remove(name);\n\
    } : function(node) {\n\
      node.__transition__[id].tween.set(name, tween);\n\
    });\n\
  };\n\
  function d3_transition_tween(groups, name, value, tween) {\n\
    var id = groups.id;\n\
    return d3_selection_each(groups, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].tween.set(name, tween(value.call(node, node.__data__, i, j)));\n\
    } : (value = tween(value), function(node) {\n\
      node.__transition__[id].tween.set(name, value);\n\
    }));\n\
  }\n\
  d3_transitionPrototype.attr = function(nameNS, value) {\n\
    if (arguments.length < 2) {\n\
      for (value in nameNS) this.attr(value, nameNS[value]);\n\
      return this;\n\
    }\n\
    var interpolate = nameNS == \"transform\" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);\n\
    function attrNull() {\n\
      this.removeAttribute(name);\n\
    }\n\
    function attrNullNS() {\n\
      this.removeAttributeNS(name.space, name.local);\n\
    }\n\
    function attrTween(b) {\n\
      return b == null ? attrNull : (b += \"\", function() {\n\
        var a = this.getAttribute(name), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttribute(name, i(t));\n\
        });\n\
      });\n\
    }\n\
    function attrTweenNS(b) {\n\
      return b == null ? attrNullNS : (b += \"\", function() {\n\
        var a = this.getAttributeNS(name.space, name.local), i;\n\
        return a !== b && (i = interpolate(a, b), function(t) {\n\
          this.setAttributeNS(name.space, name.local, i(t));\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"attr.\" + nameNS, value, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.attrTween = function(nameNS, tween) {\n\
    var name = d3.ns.qualify(nameNS);\n\
    function attrTween(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttribute(name));\n\
      return f && function(t) {\n\
        this.setAttribute(name, f(t));\n\
      };\n\
    }\n\
    function attrTweenNS(d, i) {\n\
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));\n\
      return f && function(t) {\n\
        this.setAttributeNS(name.space, name.local, f(t));\n\
      };\n\
    }\n\
    return this.tween(\"attr.\" + nameNS, name.local ? attrTweenNS : attrTween);\n\
  };\n\
  d3_transitionPrototype.style = function(name, value, priority) {\n\
    var n = arguments.length;\n\
    if (n < 3) {\n\
      if (typeof name !== \"string\") {\n\
        if (n < 2) value = \"\";\n\
        for (priority in name) this.style(priority, name[priority], value);\n\
        return this;\n\
      }\n\
      priority = \"\";\n\
    }\n\
    function styleNull() {\n\
      this.style.removeProperty(name);\n\
    }\n\
    function styleString(b) {\n\
      return b == null ? styleNull : (b += \"\", function() {\n\
        var a = d3_window.getComputedStyle(this, null).getPropertyValue(name), i;\n\
        return a !== b && (i = d3_interpolate(a, b), function(t) {\n\
          this.style.setProperty(name, i(t), priority);\n\
        });\n\
      });\n\
    }\n\
    return d3_transition_tween(this, \"style.\" + name, value, styleString);\n\
  };\n\
  d3_transitionPrototype.styleTween = function(name, tween, priority) {\n\
    if (arguments.length < 3) priority = \"\";\n\
    function styleTween(d, i) {\n\
      var f = tween.call(this, d, i, d3_window.getComputedStyle(this, null).getPropertyValue(name));\n\
      return f && function(t) {\n\
        this.style.setProperty(name, f(t), priority);\n\
      };\n\
    }\n\
    return this.tween(\"style.\" + name, styleTween);\n\
  };\n\
  d3_transitionPrototype.text = function(value) {\n\
    return d3_transition_tween(this, \"text\", value, d3_transition_text);\n\
  };\n\
  function d3_transition_text(b) {\n\
    if (b == null) b = \"\";\n\
    return function() {\n\
      this.textContent = b;\n\
    };\n\
  }\n\
  d3_transitionPrototype.remove = function() {\n\
    return this.each(\"end.transition\", function() {\n\
      var p;\n\
      if (this.__transition__.count < 2 && (p = this.parentNode)) p.removeChild(this);\n\
    });\n\
  };\n\
  d3_transitionPrototype.ease = function(value) {\n\
    var id = this.id;\n\
    if (arguments.length < 1) return this.node().__transition__[id].ease;\n\
    if (typeof value !== \"function\") value = d3.ease.apply(d3, arguments);\n\
    return d3_selection_each(this, function(node) {\n\
      node.__transition__[id].ease = value;\n\
    });\n\
  };\n\
  d3_transitionPrototype.delay = function(value) {\n\
    var id = this.id;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].delay = +value.call(node, node.__data__, i, j);\n\
    } : (value = +value, function(node) {\n\
      node.__transition__[id].delay = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.duration = function(value) {\n\
    var id = this.id;\n\
    return d3_selection_each(this, typeof value === \"function\" ? function(node, i, j) {\n\
      node.__transition__[id].duration = Math.max(1, value.call(node, node.__data__, i, j));\n\
    } : (value = Math.max(1, value), function(node) {\n\
      node.__transition__[id].duration = value;\n\
    }));\n\
  };\n\
  d3_transitionPrototype.each = function(type, listener) {\n\
    var id = this.id;\n\
    if (arguments.length < 2) {\n\
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;\n\
      d3_transitionInheritId = id;\n\
      d3_selection_each(this, function(node, i, j) {\n\
        d3_transitionInherit = node.__transition__[id];\n\
        type.call(node, node.__data__, i, j);\n\
      });\n\
      d3_transitionInherit = inherit;\n\
      d3_transitionInheritId = inheritId;\n\
    } else {\n\
      d3_selection_each(this, function(node) {\n\
        var transition = node.__transition__[id];\n\
        (transition.event || (transition.event = d3.dispatch(\"start\", \"end\"))).on(type, listener);\n\
      });\n\
    }\n\
    return this;\n\
  };\n\
  d3_transitionPrototype.transition = function() {\n\
    var id0 = this.id, id1 = ++d3_transitionId, subgroups = [], subgroup, group, node, transition;\n\
    for (var j = 0, m = this.length; j < m; j++) {\n\
      subgroups.push(subgroup = []);\n\
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {\n\
        if (node = group[i]) {\n\
          transition = Object.create(node.__transition__[id0]);\n\
          transition.delay += transition.duration;\n\
          d3_transitionNode(node, i, id1, transition);\n\
        }\n\
        subgroup.push(node);\n\
      }\n\
    }\n\
    return d3_transition(subgroups, id1);\n\
  };\n\
  function d3_transitionNode(node, i, id, inherit) {\n\
    var lock = node.__transition__ || (node.__transition__ = {\n\
      active: 0,\n\
      count: 0\n\
    }), transition = lock[id];\n\
    if (!transition) {\n\
      var time = inherit.time;\n\
      transition = lock[id] = {\n\
        tween: new d3_Map(),\n\
        time: time,\n\
        ease: inherit.ease,\n\
        delay: inherit.delay,\n\
        duration: inherit.duration\n\
      };\n\
      ++lock.count;\n\
      d3.timer(function(elapsed) {\n\
        var d = node.__data__, ease = transition.ease, delay = transition.delay, duration = transition.duration, timer = d3_timer_active, tweened = [];\n\
        timer.t = delay + time;\n\
        if (delay <= elapsed) return start(elapsed - delay);\n\
        timer.c = start;\n\
        function start(elapsed) {\n\
          if (lock.active > id) return stop();\n\
          lock.active = id;\n\
          transition.event && transition.event.start.call(node, d, i);\n\
          transition.tween.forEach(function(key, value) {\n\
            if (value = value.call(node, d, i)) {\n\
              tweened.push(value);\n\
            }\n\
          });\n\
          d3.timer(function() {\n\
            timer.c = tick(elapsed || 1) ? d3_true : tick;\n\
            return 1;\n\
          }, 0, time);\n\
        }\n\
        function tick(elapsed) {\n\
          if (lock.active !== id) return stop();\n\
          var t = elapsed / duration, e = ease(t), n = tweened.length;\n\
          while (n > 0) {\n\
            tweened[--n].call(node, e);\n\
          }\n\
          if (t >= 1) {\n\
            transition.event && transition.event.end.call(node, d, i);\n\
            return stop();\n\
          }\n\
        }\n\
        function stop() {\n\
          if (--lock.count) delete lock[id]; else delete node.__transition__;\n\
          return 1;\n\
        }\n\
      }, 0, time);\n\
    }\n\
  }\n\
  d3.svg.axis = function() {\n\
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;\n\
    function axis(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this);\n\
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();\n\
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(\".tick\").data(ticks, scale1), tickEnter = tick.enter().insert(\"g\", \".domain\").attr(\"class\", \"tick\").style(\"opacity\", ε), tickExit = d3.transition(tick.exit()).style(\"opacity\", ε).remove(), tickUpdate = d3.transition(tick).style(\"opacity\", 1), tickTransform;\n\
        var range = d3_scaleRange(scale1), path = g.selectAll(\".domain\").data([ 0 ]), pathUpdate = (path.enter().append(\"path\").attr(\"class\", \"domain\"), \n\
        d3.transition(path));\n\
        tickEnter.append(\"line\");\n\
        tickEnter.append(\"text\");\n\
        var lineEnter = tickEnter.select(\"line\"), lineUpdate = tickUpdate.select(\"line\"), text = tick.select(\"text\").text(tickFormat), textEnter = tickEnter.select(\"text\"), textUpdate = tickUpdate.select(\"text\");\n\
        switch (orient) {\n\
         case \"bottom\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", innerTickSize);\n\
            textEnter.attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", Math.max(innerTickSize, 0) + tickPadding);\n\
            text.attr(\"dy\", \".71em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + outerTickSize + \"V0H\" + range[1] + \"V\" + outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"top\":\n\
          {\n\
            tickTransform = d3_svg_axisX;\n\
            lineEnter.attr(\"y2\", -innerTickSize);\n\
            textEnter.attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", 0).attr(\"y2\", -innerTickSize);\n\
            textUpdate.attr(\"x\", 0).attr(\"y\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            text.attr(\"dy\", \"0em\").style(\"text-anchor\", \"middle\");\n\
            pathUpdate.attr(\"d\", \"M\" + range[0] + \",\" + -outerTickSize + \"V0H\" + range[1] + \"V\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"left\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", -innerTickSize);\n\
            textEnter.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding));\n\
            lineUpdate.attr(\"x2\", -innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", -(Math.max(innerTickSize, 0) + tickPadding)).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"end\");\n\
            pathUpdate.attr(\"d\", \"M\" + -outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + -outerTickSize);\n\
            break;\n\
          }\n\
\n\
         case \"right\":\n\
          {\n\
            tickTransform = d3_svg_axisY;\n\
            lineEnter.attr(\"x2\", innerTickSize);\n\
            textEnter.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding);\n\
            lineUpdate.attr(\"x2\", innerTickSize).attr(\"y2\", 0);\n\
            textUpdate.attr(\"x\", Math.max(innerTickSize, 0) + tickPadding).attr(\"y\", 0);\n\
            text.attr(\"dy\", \".32em\").style(\"text-anchor\", \"start\");\n\
            pathUpdate.attr(\"d\", \"M\" + outerTickSize + \",\" + range[0] + \"H0V\" + range[1] + \"H\" + outerTickSize);\n\
            break;\n\
          }\n\
        }\n\
        if (scale1.rangeBand) {\n\
          var x = scale1, dx = x.rangeBand() / 2;\n\
          scale0 = scale1 = function(d) {\n\
            return x(d) + dx;\n\
          };\n\
        } else if (scale0.rangeBand) {\n\
          scale0 = scale1;\n\
        } else {\n\
          tickExit.call(tickTransform, scale1);\n\
        }\n\
        tickEnter.call(tickTransform, scale0);\n\
        tickUpdate.call(tickTransform, scale1);\n\
      });\n\
    }\n\
    axis.scale = function(x) {\n\
      if (!arguments.length) return scale;\n\
      scale = x;\n\
      return axis;\n\
    };\n\
    axis.orient = function(x) {\n\
      if (!arguments.length) return orient;\n\
      orient = x in d3_svg_axisOrients ? x + \"\" : d3_svg_axisDefaultOrient;\n\
      return axis;\n\
    };\n\
    axis.ticks = function() {\n\
      if (!arguments.length) return tickArguments_;\n\
      tickArguments_ = arguments;\n\
      return axis;\n\
    };\n\
    axis.tickValues = function(x) {\n\
      if (!arguments.length) return tickValues;\n\
      tickValues = x;\n\
      return axis;\n\
    };\n\
    axis.tickFormat = function(x) {\n\
      if (!arguments.length) return tickFormat_;\n\
      tickFormat_ = x;\n\
      return axis;\n\
    };\n\
    axis.tickSize = function(x) {\n\
      var n = arguments.length;\n\
      if (!n) return innerTickSize;\n\
      innerTickSize = +x;\n\
      outerTickSize = +arguments[n - 1];\n\
      return axis;\n\
    };\n\
    axis.innerTickSize = function(x) {\n\
      if (!arguments.length) return innerTickSize;\n\
      innerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.outerTickSize = function(x) {\n\
      if (!arguments.length) return outerTickSize;\n\
      outerTickSize = +x;\n\
      return axis;\n\
    };\n\
    axis.tickPadding = function(x) {\n\
      if (!arguments.length) return tickPadding;\n\
      tickPadding = +x;\n\
      return axis;\n\
    };\n\
    axis.tickSubdivide = function() {\n\
      return arguments.length && axis;\n\
    };\n\
    return axis;\n\
  };\n\
  var d3_svg_axisDefaultOrient = \"bottom\", d3_svg_axisOrients = {\n\
    top: 1,\n\
    right: 1,\n\
    bottom: 1,\n\
    left: 1\n\
  };\n\
  function d3_svg_axisX(selection, x) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(\" + x(d) + \",0)\";\n\
    });\n\
  }\n\
  function d3_svg_axisY(selection, y) {\n\
    selection.attr(\"transform\", function(d) {\n\
      return \"translate(0,\" + y(d) + \")\";\n\
    });\n\
  }\n\
  d3.svg.brush = function() {\n\
    var event = d3_eventDispatch(brush, \"brushstart\", \"brush\", \"brushend\"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];\n\
    function brush(g) {\n\
      g.each(function() {\n\
        var g = d3.select(this).style(\"pointer-events\", \"all\").style(\"-webkit-tap-highlight-color\", \"rgba(0,0,0,0)\").on(\"mousedown.brush\", brushstart).on(\"touchstart.brush\", brushstart);\n\
        var background = g.selectAll(\".background\").data([ 0 ]);\n\
        background.enter().append(\"rect\").attr(\"class\", \"background\").style(\"visibility\", \"hidden\").style(\"cursor\", \"crosshair\");\n\
        g.selectAll(\".extent\").data([ 0 ]).enter().append(\"rect\").attr(\"class\", \"extent\").style(\"cursor\", \"move\");\n\
        var resize = g.selectAll(\".resize\").data(resizes, d3_identity);\n\
        resize.exit().remove();\n\
        resize.enter().append(\"g\").attr(\"class\", function(d) {\n\
          return \"resize \" + d;\n\
        }).style(\"cursor\", function(d) {\n\
          return d3_svg_brushCursor[d];\n\
        }).append(\"rect\").attr(\"x\", function(d) {\n\
          return /[ew]$/.test(d) ? -3 : null;\n\
        }).attr(\"y\", function(d) {\n\
          return /^[ns]/.test(d) ? -3 : null;\n\
        }).attr(\"width\", 6).attr(\"height\", 6).style(\"visibility\", \"hidden\");\n\
        resize.style(\"display\", brush.empty() ? \"none\" : null);\n\
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;\n\
        if (x) {\n\
          range = d3_scaleRange(x);\n\
          backgroundUpdate.attr(\"x\", range[0]).attr(\"width\", range[1] - range[0]);\n\
          redrawX(gUpdate);\n\
        }\n\
        if (y) {\n\
          range = d3_scaleRange(y);\n\
          backgroundUpdate.attr(\"y\", range[0]).attr(\"height\", range[1] - range[0]);\n\
          redrawY(gUpdate);\n\
        }\n\
        redraw(gUpdate);\n\
      });\n\
    }\n\
    brush.event = function(g) {\n\
      g.each(function() {\n\
        var event_ = event.of(this, arguments), extent1 = {\n\
          x: xExtent,\n\
          y: yExtent,\n\
          i: xExtentDomain,\n\
          j: yExtentDomain\n\
        }, extent0 = this.__chart__ || extent1;\n\
        this.__chart__ = extent1;\n\
        if (d3_transitionInheritId) {\n\
          d3.select(this).transition().each(\"start.brush\", function() {\n\
            xExtentDomain = extent0.i;\n\
            yExtentDomain = extent0.j;\n\
            xExtent = extent0.x;\n\
            yExtent = extent0.y;\n\
            event_({\n\
              type: \"brushstart\"\n\
            });\n\
          }).tween(\"brush:brush\", function() {\n\
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);\n\
            xExtentDomain = yExtentDomain = null;\n\
            return function(t) {\n\
              xExtent = extent1.x = xi(t);\n\
              yExtent = extent1.y = yi(t);\n\
              event_({\n\
                type: \"brush\",\n\
                mode: \"resize\"\n\
              });\n\
            };\n\
          }).each(\"end.brush\", function() {\n\
            xExtentDomain = extent1.i;\n\
            yExtentDomain = extent1.j;\n\
            event_({\n\
              type: \"brush\",\n\
              mode: \"resize\"\n\
            });\n\
            event_({\n\
              type: \"brushend\"\n\
            });\n\
          });\n\
        } else {\n\
          event_({\n\
            type: \"brushstart\"\n\
          });\n\
          event_({\n\
            type: \"brush\",\n\
            mode: \"resize\"\n\
          });\n\
          event_({\n\
            type: \"brushend\"\n\
          });\n\
        }\n\
      });\n\
    };\n\
    function redraw(g) {\n\
      g.selectAll(\".resize\").attr(\"transform\", function(d) {\n\
        return \"translate(\" + xExtent[+/e$/.test(d)] + \",\" + yExtent[+/^s/.test(d)] + \")\";\n\
      });\n\
    }\n\
    function redrawX(g) {\n\
      g.select(\".extent\").attr(\"x\", xExtent[0]);\n\
      g.selectAll(\".extent,.n>rect,.s>rect\").attr(\"width\", xExtent[1] - xExtent[0]);\n\
    }\n\
    function redrawY(g) {\n\
      g.select(\".extent\").attr(\"y\", yExtent[0]);\n\
      g.selectAll(\".extent,.e>rect,.w>rect\").attr(\"height\", yExtent[1] - yExtent[0]);\n\
    }\n\
    function brushstart() {\n\
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed(\"extent\"), dragRestore = d3_event_dragSuppress(), center, origin = d3.mouse(target), offset;\n\
      var w = d3.select(d3_window).on(\"keydown.brush\", keydown).on(\"keyup.brush\", keyup);\n\
      if (d3.event.changedTouches) {\n\
        w.on(\"touchmove.brush\", brushmove).on(\"touchend.brush\", brushend);\n\
      } else {\n\
        w.on(\"mousemove.brush\", brushmove).on(\"mouseup.brush\", brushend);\n\
      }\n\
      g.interrupt().selectAll(\"*\").interrupt();\n\
      if (dragging) {\n\
        origin[0] = xExtent[0] - origin[0];\n\
        origin[1] = yExtent[0] - origin[1];\n\
      } else if (resizing) {\n\
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);\n\
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];\n\
        origin[0] = xExtent[ex];\n\
        origin[1] = yExtent[ey];\n\
      } else if (d3.event.altKey) center = origin.slice();\n\
      g.style(\"pointer-events\", \"none\").selectAll(\".resize\").style(\"display\", null);\n\
      d3.select(\"body\").style(\"cursor\", eventTarget.style(\"cursor\"));\n\
      event_({\n\
        type: \"brushstart\"\n\
      });\n\
      brushmove();\n\
      function keydown() {\n\
        if (d3.event.keyCode == 32) {\n\
          if (!dragging) {\n\
            center = null;\n\
            origin[0] -= xExtent[1];\n\
            origin[1] -= yExtent[1];\n\
            dragging = 2;\n\
          }\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function keyup() {\n\
        if (d3.event.keyCode == 32 && dragging == 2) {\n\
          origin[0] += xExtent[1];\n\
          origin[1] += yExtent[1];\n\
          dragging = 0;\n\
          d3_eventPreventDefault();\n\
        }\n\
      }\n\
      function brushmove() {\n\
        var point = d3.mouse(target), moved = false;\n\
        if (offset) {\n\
          point[0] += offset[0];\n\
          point[1] += offset[1];\n\
        }\n\
        if (!dragging) {\n\
          if (d3.event.altKey) {\n\
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];\n\
            origin[0] = xExtent[+(point[0] < center[0])];\n\
            origin[1] = yExtent[+(point[1] < center[1])];\n\
          } else center = null;\n\
        }\n\
        if (resizingX && move1(point, x, 0)) {\n\
          redrawX(g);\n\
          moved = true;\n\
        }\n\
        if (resizingY && move1(point, y, 1)) {\n\
          redrawY(g);\n\
          moved = true;\n\
        }\n\
        if (moved) {\n\
          redraw(g);\n\
          event_({\n\
            type: \"brush\",\n\
            mode: dragging ? \"move\" : \"resize\"\n\
          });\n\
        }\n\
      }\n\
      function move1(point, scale, i) {\n\
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;\n\
        if (dragging) {\n\
          r0 -= position;\n\
          r1 -= size + position;\n\
        }\n\
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];\n\
        if (dragging) {\n\
          max = (min += position) + size;\n\
        } else {\n\
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));\n\
          if (position < min) {\n\
            max = min;\n\
            min = position;\n\
          } else {\n\
            max = position;\n\
          }\n\
        }\n\
        if (extent[0] != min || extent[1] != max) {\n\
          if (i) yExtentDomain = null; else xExtentDomain = null;\n\
          extent[0] = min;\n\
          extent[1] = max;\n\
          return true;\n\
        }\n\
      }\n\
      function brushend() {\n\
        brushmove();\n\
        g.style(\"pointer-events\", \"all\").selectAll(\".resize\").style(\"display\", brush.empty() ? \"none\" : null);\n\
        d3.select(\"body\").style(\"cursor\", null);\n\
        w.on(\"mousemove.brush\", null).on(\"mouseup.brush\", null).on(\"touchmove.brush\", null).on(\"touchend.brush\", null).on(\"keydown.brush\", null).on(\"keyup.brush\", null);\n\
        dragRestore();\n\
        event_({\n\
          type: \"brushend\"\n\
        });\n\
      }\n\
    }\n\
    brush.x = function(z) {\n\
      if (!arguments.length) return x;\n\
      x = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.y = function(z) {\n\
      if (!arguments.length) return y;\n\
      y = z;\n\
      resizes = d3_svg_brushResizes[!x << 1 | !y];\n\
      return brush;\n\
    };\n\
    brush.clamp = function(z) {\n\
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;\n\
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;\n\
      return brush;\n\
    };\n\
    brush.extent = function(z) {\n\
      var x0, x1, y0, y1, t;\n\
      if (!arguments.length) {\n\
        if (x) {\n\
          if (xExtentDomain) {\n\
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];\n\
          } else {\n\
            x0 = xExtent[0], x1 = xExtent[1];\n\
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);\n\
            if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
          }\n\
        }\n\
        if (y) {\n\
          if (yExtentDomain) {\n\
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];\n\
          } else {\n\
            y0 = yExtent[0], y1 = yExtent[1];\n\
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);\n\
            if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
          }\n\
        }\n\
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];\n\
      }\n\
      if (x) {\n\
        x0 = z[0], x1 = z[1];\n\
        if (y) x0 = x0[0], x1 = x1[0];\n\
        xExtentDomain = [ x0, x1 ];\n\
        if (x.invert) x0 = x(x0), x1 = x(x1);\n\
        if (x1 < x0) t = x0, x0 = x1, x1 = t;\n\
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];\n\
      }\n\
      if (y) {\n\
        y0 = z[0], y1 = z[1];\n\
        if (x) y0 = y0[1], y1 = y1[1];\n\
        yExtentDomain = [ y0, y1 ];\n\
        if (y.invert) y0 = y(y0), y1 = y(y1);\n\
        if (y1 < y0) t = y0, y0 = y1, y1 = t;\n\
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];\n\
      }\n\
      return brush;\n\
    };\n\
    brush.clear = function() {\n\
      if (!brush.empty()) {\n\
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];\n\
        xExtentDomain = yExtentDomain = null;\n\
      }\n\
      return brush;\n\
    };\n\
    brush.empty = function() {\n\
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];\n\
    };\n\
    return d3.rebind(brush, event, \"on\");\n\
  };\n\
  var d3_svg_brushCursor = {\n\
    n: \"ns-resize\",\n\
    e: \"ew-resize\",\n\
    s: \"ns-resize\",\n\
    w: \"ew-resize\",\n\
    nw: \"nwse-resize\",\n\
    ne: \"nesw-resize\",\n\
    se: \"nwse-resize\",\n\
    sw: \"nesw-resize\"\n\
  };\n\
  var d3_svg_brushResizes = [ [ \"n\", \"e\", \"s\", \"w\", \"nw\", \"ne\", \"se\", \"sw\" ], [ \"e\", \"w\" ], [ \"n\", \"s\" ], [] ];\n\
  var d3_time = d3.time = {}, d3_date = Date, d3_time_daySymbols = [ \"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\" ];\n\
  function d3_date_utc() {\n\
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);\n\
  }\n\
  d3_date_utc.prototype = {\n\
    getDate: function() {\n\
      return this._.getUTCDate();\n\
    },\n\
    getDay: function() {\n\
      return this._.getUTCDay();\n\
    },\n\
    getFullYear: function() {\n\
      return this._.getUTCFullYear();\n\
    },\n\
    getHours: function() {\n\
      return this._.getUTCHours();\n\
    },\n\
    getMilliseconds: function() {\n\
      return this._.getUTCMilliseconds();\n\
    },\n\
    getMinutes: function() {\n\
      return this._.getUTCMinutes();\n\
    },\n\
    getMonth: function() {\n\
      return this._.getUTCMonth();\n\
    },\n\
    getSeconds: function() {\n\
      return this._.getUTCSeconds();\n\
    },\n\
    getTime: function() {\n\
      return this._.getTime();\n\
    },\n\
    getTimezoneOffset: function() {\n\
      return 0;\n\
    },\n\
    valueOf: function() {\n\
      return this._.valueOf();\n\
    },\n\
    setDate: function() {\n\
      d3_time_prototype.setUTCDate.apply(this._, arguments);\n\
    },\n\
    setDay: function() {\n\
      d3_time_prototype.setUTCDay.apply(this._, arguments);\n\
    },\n\
    setFullYear: function() {\n\
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);\n\
    },\n\
    setHours: function() {\n\
      d3_time_prototype.setUTCHours.apply(this._, arguments);\n\
    },\n\
    setMilliseconds: function() {\n\
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);\n\
    },\n\
    setMinutes: function() {\n\
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);\n\
    },\n\
    setMonth: function() {\n\
      d3_time_prototype.setUTCMonth.apply(this._, arguments);\n\
    },\n\
    setSeconds: function() {\n\
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);\n\
    },\n\
    setTime: function() {\n\
      d3_time_prototype.setTime.apply(this._, arguments);\n\
    }\n\
  };\n\
  var d3_time_prototype = Date.prototype;\n\
  var d3_time_formatDateTime = \"%a %b %e %X %Y\", d3_time_formatDate = \"%m/%d/%Y\", d3_time_formatTime = \"%H:%M:%S\";\n\
  var d3_time_days = [ \"Sunday\", \"Monday\", \"Tuesday\", \"Wednesday\", \"Thursday\", \"Friday\", \"Saturday\" ], d3_time_dayAbbreviations = [ \"Sun\", \"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\" ], d3_time_months = [ \"January\", \"February\", \"March\", \"April\", \"May\", \"June\", \"July\", \"August\", \"September\", \"October\", \"November\", \"December\" ], d3_time_monthAbbreviations = [ \"Jan\", \"Feb\", \"Mar\", \"Apr\", \"May\", \"Jun\", \"Jul\", \"Aug\", \"Sep\", \"Oct\", \"Nov\", \"Dec\" ];\n\
  function d3_time_interval(local, step, number) {\n\
    function round(date) {\n\
      var d0 = local(date), d1 = offset(d0, 1);\n\
      return date - d0 < d1 - date ? d0 : d1;\n\
    }\n\
    function ceil(date) {\n\
      step(date = local(new d3_date(date - 1)), 1);\n\
      return date;\n\
    }\n\
    function offset(date, k) {\n\
      step(date = new d3_date(+date), k);\n\
      return date;\n\
    }\n\
    function range(t0, t1, dt) {\n\
      var time = ceil(t0), times = [];\n\
      if (dt > 1) {\n\
        while (time < t1) {\n\
          if (!(number(time) % dt)) times.push(new Date(+time));\n\
          step(time, 1);\n\
        }\n\
      } else {\n\
        while (time < t1) times.push(new Date(+time)), step(time, 1);\n\
      }\n\
      return times;\n\
    }\n\
    function range_utc(t0, t1, dt) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = t0;\n\
        return range(utc, t1, dt);\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    }\n\
    local.floor = local;\n\
    local.round = round;\n\
    local.ceil = ceil;\n\
    local.offset = offset;\n\
    local.range = range;\n\
    var utc = local.utc = d3_time_interval_utc(local);\n\
    utc.floor = utc;\n\
    utc.round = d3_time_interval_utc(round);\n\
    utc.ceil = d3_time_interval_utc(ceil);\n\
    utc.offset = d3_time_interval_utc(offset);\n\
    utc.range = range_utc;\n\
    return local;\n\
  }\n\
  function d3_time_interval_utc(method) {\n\
    return function(date, k) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date_utc();\n\
        utc._ = date;\n\
        return method(utc, k)._;\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    };\n\
  }\n\
  d3_time.year = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setMonth(0, 1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setFullYear(date.getFullYear() + offset);\n\
  }, function(date) {\n\
    return date.getFullYear();\n\
  });\n\
  d3_time.years = d3_time.year.range;\n\
  d3_time.years.utc = d3_time.year.utc.range;\n\
  d3_time.day = d3_time_interval(function(date) {\n\
    var day = new d3_date(2e3, 0);\n\
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());\n\
    return day;\n\
  }, function(date, offset) {\n\
    date.setDate(date.getDate() + offset);\n\
  }, function(date) {\n\
    return date.getDate() - 1;\n\
  });\n\
  d3_time.days = d3_time.day.range;\n\
  d3_time.days.utc = d3_time.day.utc.range;\n\
  d3_time.dayOfYear = function(date) {\n\
    var year = d3_time.year(date);\n\
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);\n\
  };\n\
  d3_time_daySymbols.forEach(function(day, i) {\n\
    day = day.toLowerCase();\n\
    i = 7 - i;\n\
    var interval = d3_time[day] = d3_time_interval(function(date) {\n\
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);\n\
      return date;\n\
    }, function(date, offset) {\n\
      date.setDate(date.getDate() + Math.floor(offset) * 7);\n\
    }, function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);\n\
    });\n\
    d3_time[day + \"s\"] = interval.range;\n\
    d3_time[day + \"s\"].utc = interval.utc.range;\n\
    d3_time[day + \"OfYear\"] = function(date) {\n\
      var day = d3_time.year(date).getDay();\n\
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);\n\
    };\n\
  });\n\
  d3_time.week = d3_time.sunday;\n\
  d3_time.weeks = d3_time.sunday.range;\n\
  d3_time.weeks.utc = d3_time.sunday.utc.range;\n\
  d3_time.weekOfYear = d3_time.sundayOfYear;\n\
  d3_time.format = d3_time_format;\n\
  function d3_time_format(template) {\n\
    var n = template.length;\n\
    function format(date) {\n\
      var string = [], i = -1, j = 0, c, p, f;\n\
      while (++i < n) {\n\
        if (template.charCodeAt(i) === 37) {\n\
          string.push(template.substring(j, i));\n\
          if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);\n\
          if (f = d3_time_formats[c]) c = f(date, p == null ? c === \"e\" ? \" \" : \"0\" : p);\n\
          string.push(c);\n\
          j = i + 1;\n\
        }\n\
      }\n\
      string.push(template.substring(j, i));\n\
      return string.join(\"\");\n\
    }\n\
    format.parse = function(string) {\n\
      var d = {\n\
        y: 1900,\n\
        m: 0,\n\
        d: 1,\n\
        H: 0,\n\
        M: 0,\n\
        S: 0,\n\
        L: 0,\n\
        Z: null\n\
      }, i = d3_time_parse(d, template, string, 0);\n\
      if (i != string.length) return null;\n\
      if (\"p\" in d) d.H = d.H % 12 + d.p * 12;\n\
      var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();\n\
      if (\"j\" in d) date.setFullYear(d.y, 0, d.j); else if (\"w\" in d && (\"W\" in d || \"U\" in d)) {\n\
        date.setFullYear(d.y, 0, 1);\n\
        date.setFullYear(d.y, 0, \"W\" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);\n\
      } else date.setFullYear(d.y, d.m, d.d);\n\
      date.setHours(d.H + Math.floor(d.Z / 100), d.M + d.Z % 100, d.S, d.L);\n\
      return localZ ? date._ : date;\n\
    };\n\
    format.toString = function() {\n\
      return template;\n\
    };\n\
    return format;\n\
  }\n\
  function d3_time_parse(date, template, string, j) {\n\
    var c, p, t, i = 0, n = template.length, m = string.length;\n\
    while (i < n) {\n\
      if (j >= m) return -1;\n\
      c = template.charCodeAt(i++);\n\
      if (c === 37) {\n\
        t = template.charAt(i++);\n\
        p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];\n\
        if (!p || (j = p(date, string, j)) < 0) return -1;\n\
      } else if (c != string.charCodeAt(j++)) {\n\
        return -1;\n\
      }\n\
    }\n\
    return j;\n\
  }\n\
  function d3_time_formatRe(names) {\n\
    return new RegExp(\"^(?:\" + names.map(d3.requote).join(\"|\") + \")\", \"i\");\n\
  }\n\
  function d3_time_formatLookup(names) {\n\
    var map = new d3_Map(), i = -1, n = names.length;\n\
    while (++i < n) map.set(names[i].toLowerCase(), i);\n\
    return map;\n\
  }\n\
  function d3_time_formatPad(value, fill, width) {\n\
    var sign = value < 0 ? \"-\" : \"\", string = (sign ? -value : value) + \"\", length = string.length;\n\
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);\n\
  }\n\
  var d3_time_dayRe = d3_time_formatRe(d3_time_days), d3_time_dayLookup = d3_time_formatLookup(d3_time_days), d3_time_dayAbbrevRe = d3_time_formatRe(d3_time_dayAbbreviations), d3_time_dayAbbrevLookup = d3_time_formatLookup(d3_time_dayAbbreviations), d3_time_monthRe = d3_time_formatRe(d3_time_months), d3_time_monthLookup = d3_time_formatLookup(d3_time_months), d3_time_monthAbbrevRe = d3_time_formatRe(d3_time_monthAbbreviations), d3_time_monthAbbrevLookup = d3_time_formatLookup(d3_time_monthAbbreviations), d3_time_percentRe = /^%/;\n\
  var d3_time_formatPads = {\n\
    \"-\": \"\",\n\
    _: \" \",\n\
    \"0\": \"0\"\n\
  };\n\
  var d3_time_formats = {\n\
    a: function(d) {\n\
      return d3_time_dayAbbreviations[d.getDay()];\n\
    },\n\
    A: function(d) {\n\
      return d3_time_days[d.getDay()];\n\
    },\n\
    b: function(d) {\n\
      return d3_time_monthAbbreviations[d.getMonth()];\n\
    },\n\
    B: function(d) {\n\
      return d3_time_months[d.getMonth()];\n\
    },\n\
    c: d3_time_format(d3_time_formatDateTime),\n\
    d: function(d, p) {\n\
      return d3_time_formatPad(d.getDate(), p, 2);\n\
    },\n\
    e: function(d, p) {\n\
      return d3_time_formatPad(d.getDate(), p, 2);\n\
    },\n\
    H: function(d, p) {\n\
      return d3_time_formatPad(d.getHours(), p, 2);\n\
    },\n\
    I: function(d, p) {\n\
      return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);\n\
    },\n\
    j: function(d, p) {\n\
      return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);\n\
    },\n\
    L: function(d, p) {\n\
      return d3_time_formatPad(d.getMilliseconds(), p, 3);\n\
    },\n\
    m: function(d, p) {\n\
      return d3_time_formatPad(d.getMonth() + 1, p, 2);\n\
    },\n\
    M: function(d, p) {\n\
      return d3_time_formatPad(d.getMinutes(), p, 2);\n\
    },\n\
    p: function(d) {\n\
      return d.getHours() >= 12 ? \"PM\" : \"AM\";\n\
    },\n\
    S: function(d, p) {\n\
      return d3_time_formatPad(d.getSeconds(), p, 2);\n\
    },\n\
    U: function(d, p) {\n\
      return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);\n\
    },\n\
    w: function(d) {\n\
      return d.getDay();\n\
    },\n\
    W: function(d, p) {\n\
      return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);\n\
    },\n\
    x: d3_time_format(d3_time_formatDate),\n\
    X: d3_time_format(d3_time_formatTime),\n\
    y: function(d, p) {\n\
      return d3_time_formatPad(d.getFullYear() % 100, p, 2);\n\
    },\n\
    Y: function(d, p) {\n\
      return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);\n\
    },\n\
    Z: d3_time_zone,\n\
    \"%\": function() {\n\
      return \"%\";\n\
    }\n\
  };\n\
  var d3_time_parsers = {\n\
    a: d3_time_parseWeekdayAbbrev,\n\
    A: d3_time_parseWeekday,\n\
    b: d3_time_parseMonthAbbrev,\n\
    B: d3_time_parseMonth,\n\
    c: d3_time_parseLocaleFull,\n\
    d: d3_time_parseDay,\n\
    e: d3_time_parseDay,\n\
    H: d3_time_parseHour24,\n\
    I: d3_time_parseHour24,\n\
    j: d3_time_parseDayOfYear,\n\
    L: d3_time_parseMilliseconds,\n\
    m: d3_time_parseMonthNumber,\n\
    M: d3_time_parseMinutes,\n\
    p: d3_time_parseAmPm,\n\
    S: d3_time_parseSeconds,\n\
    U: d3_time_parseWeekNumberSunday,\n\
    w: d3_time_parseWeekdayNumber,\n\
    W: d3_time_parseWeekNumberMonday,\n\
    x: d3_time_parseLocaleDate,\n\
    X: d3_time_parseLocaleTime,\n\
    y: d3_time_parseYear,\n\
    Y: d3_time_parseFullYear,\n\
    Z: d3_time_parseZone,\n\
    \"%\": d3_time_parseLiteralPercent\n\
  };\n\
  function d3_time_parseWeekdayAbbrev(date, string, i) {\n\
    d3_time_dayAbbrevRe.lastIndex = 0;\n\
    var n = d3_time_dayAbbrevRe.exec(string.substring(i));\n\
    return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekday(date, string, i) {\n\
    d3_time_dayRe.lastIndex = 0;\n\
    var n = d3_time_dayRe.exec(string.substring(i));\n\
    return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekdayNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 1));\n\
    return n ? (date.w = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberSunday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.U = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseWeekNumberMonday(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i));\n\
    return n ? (date.W = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMonthAbbrev(date, string, i) {\n\
    d3_time_monthAbbrevRe.lastIndex = 0;\n\
    var n = d3_time_monthAbbrevRe.exec(string.substring(i));\n\
    return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMonth(date, string, i) {\n\
    d3_time_monthRe.lastIndex = 0;\n\
    var n = d3_time_monthRe.exec(string.substring(i));\n\
    return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseLocaleFull(date, string, i) {\n\
    return d3_time_parse(date, d3_time_formats.c.toString(), string, i);\n\
  }\n\
  function d3_time_parseLocaleDate(date, string, i) {\n\
    return d3_time_parse(date, d3_time_formats.x.toString(), string, i);\n\
  }\n\
  function d3_time_parseLocaleTime(date, string, i) {\n\
    return d3_time_parse(date, d3_time_formats.X.toString(), string, i);\n\
  }\n\
  function d3_time_parseFullYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 4));\n\
    return n ? (date.y = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseZone(date, string, i) {\n\
    return /^[+-]\\d{4}$/.test(string = string.substring(i, i + 5)) ? (date.Z = +string, \n\
    i + 5) : -1;\n\
  }\n\
  function d3_time_expandYear(d) {\n\
    return d + (d > 68 ? 1900 : 2e3);\n\
  }\n\
  function d3_time_parseMonthNumber(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDay(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.d = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseDayOfYear(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.j = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseHour24(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.H = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMinutes(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.M = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseSeconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 2));\n\
    return n ? (date.S = +n[0], i + n[0].length) : -1;\n\
  }\n\
  function d3_time_parseMilliseconds(date, string, i) {\n\
    d3_time_numberRe.lastIndex = 0;\n\
    var n = d3_time_numberRe.exec(string.substring(i, i + 3));\n\
    return n ? (date.L = +n[0], i + n[0].length) : -1;\n\
  }\n\
  var d3_time_numberRe = /^\\s*\\d+/;\n\
  function d3_time_parseAmPm(date, string, i) {\n\
    var n = d3_time_amPmLookup.get(string.substring(i, i += 2).toLowerCase());\n\
    return n == null ? -1 : (date.p = n, i);\n\
  }\n\
  var d3_time_amPmLookup = d3.map({\n\
    am: 0,\n\
    pm: 1\n\
  });\n\
  function d3_time_zone(d) {\n\
    var z = d.getTimezoneOffset(), zs = z > 0 ? \"-\" : \"+\", zh = ~~(abs(z) / 60), zm = abs(z) % 60;\n\
    return zs + d3_time_formatPad(zh, \"0\", 2) + d3_time_formatPad(zm, \"0\", 2);\n\
  }\n\
  function d3_time_parseLiteralPercent(date, string, i) {\n\
    d3_time_percentRe.lastIndex = 0;\n\
    var n = d3_time_percentRe.exec(string.substring(i, i + 1));\n\
    return n ? i + n[0].length : -1;\n\
  }\n\
  d3_time_format.utc = d3_time_formatUtc;\n\
  function d3_time_formatUtc(template) {\n\
    var local = d3_time_format(template);\n\
    function format(date) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var utc = new d3_date();\n\
        utc._ = date;\n\
        return local(utc);\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    }\n\
    format.parse = function(string) {\n\
      try {\n\
        d3_date = d3_date_utc;\n\
        var date = local.parse(string);\n\
        return date && date._;\n\
      } finally {\n\
        d3_date = Date;\n\
      }\n\
    };\n\
    format.toString = local.toString;\n\
    return format;\n\
  }\n\
  var d3_time_formatIso = d3_time_formatUtc(\"%Y-%m-%dT%H:%M:%S.%LZ\");\n\
  d3_time_format.iso = Date.prototype.toISOString && +new Date(\"2000-01-01T00:00:00.000Z\") ? d3_time_formatIsoNative : d3_time_formatIso;\n\
  function d3_time_formatIsoNative(date) {\n\
    return date.toISOString();\n\
  }\n\
  d3_time_formatIsoNative.parse = function(string) {\n\
    var date = new Date(string);\n\
    return isNaN(date) ? null : date;\n\
  };\n\
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;\n\
  d3_time.second = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 1e3) * 1e3);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);\n\
  }, function(date) {\n\
    return date.getSeconds();\n\
  });\n\
  d3_time.seconds = d3_time.second.range;\n\
  d3_time.seconds.utc = d3_time.second.utc.range;\n\
  d3_time.minute = d3_time_interval(function(date) {\n\
    return new d3_date(Math.floor(date / 6e4) * 6e4);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);\n\
  }, function(date) {\n\
    return date.getMinutes();\n\
  });\n\
  d3_time.minutes = d3_time.minute.range;\n\
  d3_time.minutes.utc = d3_time.minute.utc.range;\n\
  d3_time.hour = d3_time_interval(function(date) {\n\
    var timezone = date.getTimezoneOffset() / 60;\n\
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);\n\
  }, function(date, offset) {\n\
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);\n\
  }, function(date) {\n\
    return date.getHours();\n\
  });\n\
  d3_time.hours = d3_time.hour.range;\n\
  d3_time.hours.utc = d3_time.hour.utc.range;\n\
  d3_time.month = d3_time_interval(function(date) {\n\
    date = d3_time.day(date);\n\
    date.setDate(1);\n\
    return date;\n\
  }, function(date, offset) {\n\
    date.setMonth(date.getMonth() + offset);\n\
  }, function(date) {\n\
    return date.getMonth();\n\
  });\n\
  d3_time.months = d3_time.month.range;\n\
  d3_time.months.utc = d3_time.month.utc.range;\n\
  function d3_time_scale(linear, methods, format) {\n\
    function scale(x) {\n\
      return linear(x);\n\
    }\n\
    scale.invert = function(x) {\n\
      return d3_time_scaleDate(linear.invert(x));\n\
    };\n\
    scale.domain = function(x) {\n\
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);\n\
      linear.domain(x);\n\
      return scale;\n\
    };\n\
    function tickMethod(extent, count) {\n\
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);\n\
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {\n\
        return d / 31536e6;\n\
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];\n\
    }\n\
    scale.nice = function(interval, skip) {\n\
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" && tickMethod(extent, interval);\n\
      if (method) interval = method[0], skip = method[1];\n\
      function skipped(date) {\n\
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;\n\
      }\n\
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {\n\
        floor: function(date) {\n\
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);\n\
          return date;\n\
        },\n\
        ceil: function(date) {\n\
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);\n\
          return date;\n\
        }\n\
      } : interval));\n\
    };\n\
    scale.ticks = function(interval, skip) {\n\
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === \"number\" ? tickMethod(extent, interval) : !interval.range && [ {\n\
        range: interval\n\
      }, skip ];\n\
      if (method) interval = method[0], skip = method[1];\n\
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);\n\
    };\n\
    scale.tickFormat = function() {\n\
      return format;\n\
    };\n\
    scale.copy = function() {\n\
      return d3_time_scale(linear.copy(), methods, format);\n\
    };\n\
    return d3_scale_linearRebind(scale, linear);\n\
  }\n\
  function d3_time_scaleDate(t) {\n\
    return new Date(t);\n\
  }\n\
  function d3_time_scaleFormat(formats) {\n\
    return function(date) {\n\
      var i = formats.length - 1, f = formats[i];\n\
      while (!f[1](date)) f = formats[--i];\n\
      return f[0](date);\n\
    };\n\
  }\n\
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];\n\
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];\n\
  var d3_time_scaleLocalFormats = [ [ d3_time_format(\"%Y\"), d3_true ], [ d3_time_format(\"%B\"), function(d) {\n\
    return d.getMonth();\n\
  } ], [ d3_time_format(\"%b %d\"), function(d) {\n\
    return d.getDate() != 1;\n\
  } ], [ d3_time_format(\"%a %d\"), function(d) {\n\
    return d.getDay() && d.getDate() != 1;\n\
  } ], [ d3_time_format(\"%I %p\"), function(d) {\n\
    return d.getHours();\n\
  } ], [ d3_time_format(\"%I:%M\"), function(d) {\n\
    return d.getMinutes();\n\
  } ], [ d3_time_format(\":%S\"), function(d) {\n\
    return d.getSeconds();\n\
  } ], [ d3_time_format(\".%L\"), function(d) {\n\
    return d.getMilliseconds();\n\
  } ] ];\n\
  var d3_time_scaleLocalFormat = d3_time_scaleFormat(d3_time_scaleLocalFormats);\n\
  d3_time_scaleLocalMethods.year = d3_time.year;\n\
  d3_time.scale = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);\n\
  };\n\
  var d3_time_scaleMilliseconds = {\n\
    range: function(start, stop, step) {\n\
      return d3.range(+start, +stop, step).map(d3_time_scaleDate);\n\
    }\n\
  };\n\
  var d3_time_scaleUTCMethods = d3_time_scaleLocalMethods.map(function(m) {\n\
    return [ m[0].utc, m[1] ];\n\
  });\n\
  var d3_time_scaleUTCFormats = [ [ d3_time_formatUtc(\"%Y\"), d3_true ], [ d3_time_formatUtc(\"%B\"), function(d) {\n\
    return d.getUTCMonth();\n\
  } ], [ d3_time_formatUtc(\"%b %d\"), function(d) {\n\
    return d.getUTCDate() != 1;\n\
  } ], [ d3_time_formatUtc(\"%a %d\"), function(d) {\n\
    return d.getUTCDay() && d.getUTCDate() != 1;\n\
  } ], [ d3_time_formatUtc(\"%I %p\"), function(d) {\n\
    return d.getUTCHours();\n\
  } ], [ d3_time_formatUtc(\"%I:%M\"), function(d) {\n\
    return d.getUTCMinutes();\n\
  } ], [ d3_time_formatUtc(\":%S\"), function(d) {\n\
    return d.getUTCSeconds();\n\
  } ], [ d3_time_formatUtc(\".%L\"), function(d) {\n\
    return d.getUTCMilliseconds();\n\
  } ] ];\n\
  var d3_time_scaleUTCFormat = d3_time_scaleFormat(d3_time_scaleUTCFormats);\n\
  d3_time_scaleUTCMethods.year = d3_time.year.utc;\n\
  d3_time.scale.utc = function() {\n\
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUTCMethods, d3_time_scaleUTCFormat);\n\
  };\n\
  d3.text = d3_xhrType(function(request) {\n\
    return request.responseText;\n\
  });\n\
  d3.json = function(url, callback) {\n\
    return d3_xhr(url, \"application/json\", d3_json, callback);\n\
  };\n\
  function d3_json(request) {\n\
    return JSON.parse(request.responseText);\n\
  }\n\
  d3.html = function(url, callback) {\n\
    return d3_xhr(url, \"text/html\", d3_html, callback);\n\
  };\n\
  function d3_html(request) {\n\
    var range = d3_document.createRange();\n\
    range.selectNode(d3_document.body);\n\
    return range.createContextualFragment(request.responseText);\n\
  }\n\
  d3.xml = d3_xhrType(function(request) {\n\
    return request.responseXML;\n\
  });\n\
  return d3;\n\
}();//@ sourceURL=mbostock-d3/d3.js"
));
require.register("mbostock-d3/index-browserify.js", Function("exports, require, module",
"require(\"./d3\");\n\
module.exports = d3;\n\
(function () { delete this.d3; })(); // unset global\n\
//@ sourceURL=mbostock-d3/index-browserify.js"
));
require.register("rogerz-d3-cloud/d3.layout.cloud.js", Function("exports, require, module",
"// Word cloud layout by Jason Davies, http://www.jasondavies.com/word-cloud/\n\
// Algorithm due to Jonathan Feinberg, http://static.mrfeinberg.com/bv_ch03.pdf\n\
/* jshint quotmark: true */\n\
(function(exports) {\n\
  \"use strict\";\n\
  var d3 = d3 || require(\"d3\");\n\
  var _ = require(\"underscore\");\n\
  function makeCloud() {\n\
    var size = [256, 256],\n\
        text = cloudText,\n\
        font = cloudFont,\n\
        fontSize = cloudFontSize,\n\
        fontStyle = cloudFontNormal,\n\
        fontWeight = cloudFontNormal,\n\
        rotate = cloudRotate,\n\
        padding = cloudPadding,\n\
        spiral = archimedeanSpiral,\n\
        startPos = centerAreaPos,\n\
        words = [],\n\
        images = [],\n\
        timeInterval = Infinity,\n\
        event = d3.dispatch(\"placed\", \"failed\", \"erased\", \"end\"),\n\
        timer = null,\n\
        cloud = {},\n\
        board = zeroArray((size[0] >> 5) * size[1]),\n\
        tags = [],\n\
        bounds = null\n\
        ;\n\
\n\
    cloud.start = function() {\n\
      board = zeroArray((size[0] >> 5) * size[1]);\n\
      bounds = null;\n\
      tags = [];\n\
\n\
      var i = -1;\n\
\n\
      function step() {\n\
        var start = +new Date(),\n\
            d;\n\
        while (+new Date() - start < timeInterval && ++i < images.length && timer) {\n\
          d = images[i];\n\
          cloudSprite(d, cloudContext, images, i);\n\
          if (d.hasPixel) {\n\
            cloudPlace(d);\n\
          }\n\
        }\n\
        if (i >= images.length) {\n\
          cloud.stop();\n\
          event.end(tags, bounds);\n\
        }\n\
      }\n\
\n\
      if (timer) clearInterval(timer);\n\
      timer = setInterval(step, 0);\n\
      cloudPlace(cloud.bgImg);\n\
      step();\n\
\n\
      return cloud;\n\
    };\n\
\n\
    function addTag(d) {\n\
      tags.push(d);\n\
      if (bounds) cloudBounds(bounds, d);\n\
      else bounds = [{x: d.x + d.x0, y: d.y + d.y0}, {x: d.x + d.x1, y: d.y + d.y1}];\n\
\n\
      // Temporary hack\n\
      d.x -= size[0] >> 1;\n\
      d.y -= size[1] >> 1;\n\
    }\n\
\n\
    /**\n\
     * Set background image\n\
     *\n\
     * It must be called before start, otherwise no effect\n\
     */\n\
    cloud.setBgImg = function (d) {\n\
      if (!d) {\n\
        cloud.bgImg = undefined;\n\
        return cloud;\n\
      }\n\
\n\
      if (!d.img) {\n\
        throw new Error(\"images must be preloaded\");\n\
      }\n\
\n\
      _.defaults(d, {\n\
        position: \"fixed\",\n\
        rotate: 0,\n\
        move: false,\n\
        visibility: \"hidden\",\n\
        size: \"autofit\"\n\
      });\n\
\n\
      cloud.bgImg = d;\n\
      return cloud;\n\
    };\n\
\n\
    var generateId = (function() {\n\
      var id = 0;\n\
      return function () {\n\
        return id++;\n\
      };\n\
    })();\n\
\n\
    /**\n\
     * Add new images to cloud\n\
     * @param {object} d - image data\n\
     *\n\
     * d = {\n\
     *   img: DOM element <img>,\n\
     *   position: See below,\n\
     *   move: re-position all existing images except the fixed ones,\n\
     *   x: start x,\n\
     *   y: start y,\n\
     *   rotate: rotate by degree,\n\
     *   visibility: \"hidden\"|\"visible\",\n\
     *   size: \"autofit\"\n\
     * }\n\
     *\n\
     * ## position\n\
     *\n\
     * * \"auto\" - default option, fill the blank\n\
     * * \"fill\" - fill the non-blank area\n\
     * * \"fixed\" - ignore collision detect, e.g. for background\n\
     */\n\
    // Add more images\n\
    cloud.addImg = function (d) {\n\
      var tag = _.clone(d);\n\
      tag.id = generateId();\n\
      // TODO: check image loading\n\
      if (!tag.img) {\n\
        throw new Error(\"<img> should be preloaded before adding\");\n\
      }\n\
      if (tag.size === \"autofit\") {\n\
        if (tag.img.width / size[0] > tag.img.height / size[1]) {\n\
          tag.img.width = size[0];\n\
        } else {\n\
          tag.img.height = size[1];\n\
        }\n\
      }\n\
      tag.rotate = rotate(tag);\n\
      cloudPlace(tag);\n\
    };\n\
\n\
    /**\n\
     * Erase the tag from board\n\
     */\n\
    function cloudErase(tag) {\n\
      if (!tag.sprite) {\n\
        throw new Error(\"No sprite in the tag\");\n\
      }\n\
\n\
      // Undo temporary hack\n\
      tag.x += size[0] >> 1;\n\
      tag.y += size[1] >> 1;\n\
\n\
      var sprite = tag.sprite,\n\
          w = tag.width >> 5,\n\
          sw = size[0] >> 5,\n\
          lx = tag.x - (w << 4),\n\
          sx = lx & 0x7f,\n\
          msx = 32 - sx,\n\
          h = tag.y1 - tag.y0,\n\
          x = (tag.y + tag.y0) * sw + (lx >> 5),\n\
          last;\n\
\n\
      for (var j = 0; j < h; j++) {\n\
        last = 0;\n\
        for (var i = 0; i <= w; i++) {\n\
          board[x + i] &= ~((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0));\n\
        }\n\
        x += sw;\n\
      }\n\
\n\
      event.erased(tags);\n\
    }\n\
\n\
    /**\n\
     * Remove the oldest 'n' images\n\
     *\n\
     * @param n - total images to be removed\n\
     */\n\
    cloud.removeImg = function (n) {\n\
      var removed = tags.slice(0,n);\n\
      tags = tags.slice(n);\n\
      removed.forEach(function (tag) {\n\
        cloudErase(tag);\n\
      });\n\
      return cloud;\n\
    };\n\
\n\
    cloud.stop = function() {\n\
      if (timer) {\n\
        clearInterval(timer);\n\
        timer = null;\n\
      }\n\
      return cloud;\n\
    };\n\
\n\
    cloud.timeInterval = function(x) {\n\
      if (!arguments.length) return timeInterval;\n\
      timeInterval = x === null ? Infinity : x;\n\
      return cloud;\n\
    };\n\
\n\
    // place tag on board without collision of existing tags but collide on rectangle boundry\n\
    // @return true success\n\
    // @return false failed\n\
    function cloudPlace(tag) {\n\
      var perimeter = [{x: 0, y: 0}, {x: size[0], y: size[1]}],\n\
          maxDelta = Math.sqrt(size[0] * size[0] + size[1] * size[1]),\n\
          s = spiral(size),\n\
          dt = Math.random() < 0.5 ? 1 : -1,\n\
          t = -dt,\n\
          dxdy,\n\
          dx,\n\
          dy,\n\
          placed = false;\n\
\n\
      if (!tag.sprite) {\n\
        cloudSprite(tag);\n\
      }\n\
\n\
      startPos(tag, size);\n\
\n\
      if (tag.position === \"fixed\") {\n\
        placed = true;\n\
      } else {\n\
        var startX = tag.x,\n\
            startY = tag.y;\n\
\n\
        placed = false;\n\
\n\
        // Search on spiral for place\n\
        while ((dxdy = s(t += dt))) {\n\
          dx = ~~dxdy[0];\n\
          dy = ~~dxdy[1];\n\
\n\
          if (Math.min(dx, dy) > maxDelta) break;\n\
\n\
          tag.x = startX + dx;\n\
          tag.y = startY + dy;\n\
\n\
          // Out of boundary\n\
          if (tag.x + tag.x0 < 0 || tag.y + tag.y0 < 0 ||\n\
              tag.x + tag.x1 > size[0] || tag.y + tag.y1 > size[1]) continue;\n\
\n\
          // TODO only check for collisions within current bounds.\n\
          if (!bounds || !cloudCollide(tag, board, size[0])) {\n\
            placed = true;\n\
            break;\n\
          }\n\
        }\n\
      }\n\
\n\
      if (placed) {\n\
        var sprite = tag.sprite,\n\
            w = tag.width >> 5,\n\
            sw = size[0] >> 5,\n\
            lx = tag.x - (w << 4),\n\
            sx = lx & 0x7f,\n\
            msx = 32 - sx,\n\
            h = tag.y1 - tag.y0,\n\
            x = (tag.y + tag.y0) * sw + (lx >> 5),\n\
            last;\n\
\n\
        for (var j = 0; j < h; j++) {\n\
          last = 0;\n\
          for (var i = 0; i <= w; i++) {\n\
            board[x + i] |= (last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0);\n\
          }\n\
          x += sw;\n\
        }\n\
\n\
        if (tag.visibility !== \"hidden\") {\n\
          addTag(tag);\n\
        }\n\
\n\
        event.placed(tags, bounds, tag);\n\
        return true;\n\
      } else {\n\
        event.failed(tags, bounds, tag);\n\
        return false;\n\
      }\n\
    }\n\
\n\
    cloud.size = function(x) {\n\
      if (!arguments.length) return size;\n\
      size = [+x[0], +x[1]];\n\
      return cloud;\n\
    };\n\
\n\
    cloud.words = function(x) {\n\
      if (!arguments.length) return words;\n\
      words = x;\n\
      return cloud;\n\
    };\n\
\n\
    cloud.images = function (x) {\n\
      if (!arguments.length) return images;\n\
      images = x;\n\
      return cloud;\n\
    };\n\
\n\
    cloud.font = function(x) {\n\
      if (!arguments.length) return font;\n\
      font = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.fontStyle = function(x) {\n\
      if (!arguments.length) return fontStyle;\n\
      fontStyle = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.fontWeight = function(x) {\n\
      if (!arguments.length) return fontWeight;\n\
      fontWeight = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.rotate = function(x) {\n\
      if (!arguments.length) return rotate;\n\
      rotate = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.text = function(x) {\n\
      if (!arguments.length) return text;\n\
      text = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.spiral = function(x) {\n\
      if (!arguments.length) return spiral;\n\
      spiral = spirals[x + \"\"] || x;\n\
      return cloud;\n\
    };\n\
\n\
    cloud.startPos = function (x) {\n\
      if (!arguments.length) return startPos;\n\
      startPos = startPosOpts[x + \"\"] || x;\n\
      return cloud;\n\
    };\n\
\n\
    cloud.fontSize = function(x) {\n\
      if (!arguments.length) return fontSize;\n\
      fontSize = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    cloud.padding = function(x) {\n\
      if (!arguments.length) return padding;\n\
      padding = d3.functor(x);\n\
      return cloud;\n\
    };\n\
\n\
    return d3.rebind(cloud, event, \"on\");\n\
  }\n\
\n\
  function cloudText(d) {\n\
    return d.text;\n\
  }\n\
\n\
  function cloudFont() {\n\
    return \"serif\";\n\
  }\n\
\n\
  function cloudFontNormal() {\n\
    return \"normal\";\n\
  }\n\
\n\
  function cloudFontSize(d) {\n\
    return Math.sqrt(d.value);\n\
  }\n\
\n\
  function cloudRotate(d) {\n\
    return d.rotate !== undefined ? d.rotate : (~~(Math.random() * 6) - 3) * 30;\n\
  }\n\
\n\
  function cloudPadding() {\n\
    return 1;\n\
  }\n\
\n\
  // stage 1, draw tag on canvas\n\
  //\n\
  // @param d data to draw\n\
  // @param c canvas context\n\
  // @param s context might have dirty stat in looping\n\
  function cloudSpriteStage1(d, c, s) {\n\
    var w, h;\n\
    var stat = s || {\n\
      x: 0,\n\
      y: 0,\n\
      maxh: 0\n\
    };\n\
\n\
    c.save();\n\
\n\
    // TODO: replace with function\n\
    if (\"text\" in d) {\n\
      c.font = d.style + \" \" + d.weight + \" \" + ~~((d.size + 1) / ratio) + \"px \" + d.font;\n\
      w = c.measureText(d.text + \"m\").width * ratio;\n\
      h = (d.size * ratio) << 1;\n\
    } else if (\"img\" in d) {\n\
      w = d.img.width * ratio;\n\
      h = d.img.height * ratio;\n\
    } else {\n\
      throw new Error(\"unsupported data\", d);\n\
    }\n\
\n\
    if (d.rotate) {\n\
      var sr = Math.sin(d.rotate * cloudRadians),\n\
          cr = Math.cos(d.rotate * cloudRadians),\n\
          wcr = w * cr,\n\
          wsr = w * sr,\n\
          hcr = h * cr,\n\
          hsr = h * sr;\n\
      w = (Math.max(Math.abs(wcr + hsr), Math.abs(wcr - hsr)) + 0x1f) >> 5 << 5;\n\
      h = ~~Math.max(Math.abs(wsr + hcr), Math.abs(wsr - hcr));\n\
    } else {\n\
      w = (w + 0x1f) >> 5 << 5;\n\
    }\n\
    if (h > stat.maxh) stat.maxh = h;\n\
    if (stat.x + w >= (cw << 5)) {\n\
      stat.x = 0;\n\
      stat.y += stat.maxh;\n\
      stat.maxh = 0;\n\
    }\n\
    if (stat.y + h >= ch) return false;\n\
    c.translate((stat.x + (w >> 1)) / ratio, (stat.y + (h >> 1)) / ratio);\n\
    if (d.rotate) c.rotate(d.rotate * cloudRadians);\n\
    // TODO: replace with function\n\
    if (\"text\" in d) {\n\
      c.fillText(d.text, 0, 0);\n\
      if (d.padding) {\n\
        c.lineWidth = 2 * d.padding;\n\
        c.strokeText(d.text, 0, 0);\n\
      }\n\
    } else if (\"img\" in d) {\n\
      // TODO: handle padding\n\
      // simulate textAlign: center, textBaseline: alphabetic\n\
      c.drawImage(d.img, -d.img.width * ratio / 2, -d.img.height * ratio / 2, d.img.width * ratio, d.img.height * ratio);\n\
    } else {\n\
      throw new Error(\"unsupported data\", d);\n\
    }\n\
\n\
    c.restore();\n\
\n\
    d.width = w;\n\
    d.height = h;\n\
    d.xoff = stat.x;\n\
    d.yoff = stat.y;\n\
    // offset to center\n\
    d.x1 = w >> 1; // right offset\n\
    d.y1 = h >> 1; // bottom offset\n\
    d.x0 = -d.x1; // left offset\n\
    d.y0 = -d.y1; // top offset\n\
    d.hasPixel = true;\n\
    stat.x += w;\n\
    return true;\n\
  }\n\
\n\
  // sprite stage 2, generate sprite from pixels\n\
  //\n\
  // @param d data\n\
  // @param c canvas context\n\
  // @param pixels canvas image data\n\
  function cloudSpriteStage2(d, pixels) {\n\
    if (!d.hasPixel) return false;\n\
    var w = d.width,\n\
        w32 = w >> 5,\n\
        h = d.y1 - d.y0,\n\
        x,y,\n\
        sprite = [];\n\
    // Zero the buffer\n\
    for (var i = 0; i < h * w32; i++) sprite[i] = 0;\n\
    x = d.xoff;\n\
    if (x === null) return false;\n\
    y = d.yoff;\n\
    var seen = 0,\n\
        seenRow = -1;\n\
    for (var j = 0; j < h; j++) {\n\
      for (i = 0; i < w; i++) {\n\
        var k = w32 * j + (i >> 5),\n\
            // check alpha value for pixel visibility\n\
            m = pixels[(((y + j) * (cw << 5) + (x + i)) << 2) + 3] ? 1 << (31 - (i % 32)) : 0;\n\
        sprite[k] |= m;\n\
        seen |= m;\n\
      }\n\
      if (seen) seenRow = j;\n\
      else {\n\
        d.y0++;\n\
        h--;\n\
        j--;\n\
        y++;\n\
      }\n\
    }\n\
    d.y1 = d.y0 + seenRow;\n\
    d.sprite = sprite.slice(0, (d.y1 - d.y0) * w32);\n\
    return true;\n\
  }\n\
\n\
  // Fetches a monochrome sprite bitmap for the specified text.\n\
  // Load in batches for speed.\n\
  function cloudSprite(d, c, data, di) {\n\
    if (d.sprite) return;\n\
    c = c || cloudCanvas().getContext(\"2d\");\n\
    data = data || [d];\n\
    di = di === undefined ? 0 : di;\n\
\n\
    c.clearRect(0, 0, (cw << 5) / ratio, ch / ratio);\n\
    var stat = {\n\
        x: 0,\n\
        y: 0,\n\
        maxh: 0\n\
    };\n\
    --di;\n\
    while (++di < data.length) {\n\
      d = data[di];\n\
      if (!cloudSpriteStage1(d, c, stat)) {\n\
        break;\n\
      }\n\
    }\n\
\n\
    // Getting image data is expensive so we split sprite into two stages and do this only once\n\
    var pixels = c.getImageData(0, 0, (cw << 5) / ratio, ch / ratio).data;\n\
\n\
    while (--di >= 0) {\n\
      d = data[di];\n\
      cloudSpriteStage2(d, pixels);\n\
    }\n\
  }\n\
\n\
  // Use mask-based collision detection.\n\
  function cloudCollide(tag, board, sw) {\n\
    sw = sw >> 5;\n\
    var sprite = tag.sprite,\n\
        w = tag.width >> 5,\n\
        lx = tag.x - (w << 4),\n\
        sx = lx & 0x7f,\n\
        msx = 32 - sx,\n\
        h = tag.y1 - tag.y0,\n\
        x = (tag.y + tag.y0) * sw + (lx >> 5),\n\
        last;\n\
    for (var j = 0; j < h; j++) {\n\
      last = 0;\n\
      for (var i = 0; i <= w; i++) {\n\
        if (((last << msx) | (i < w ? (last = sprite[j * w + i]) >>> sx : 0))\n\
            & board[x + i]) return true;\n\
      }\n\
      x += sw;\n\
    }\n\
    return false;\n\
  }\n\
\n\
  // Extend cloud bounds with new data\n\
  function cloudBounds(bounds, d) {\n\
    var b0 = bounds[0],\n\
        b1 = bounds[1];\n\
    if (d.x + d.x0 < b0.x) b0.x = d.x + d.x0;\n\
    if (d.y + d.y0 < b0.y) b0.y = d.y + d.y0;\n\
    if (d.x + d.x1 > b1.x) b1.x = d.x + d.x1;\n\
    if (d.y + d.y1 > b1.y) b1.y = d.y + d.y1;\n\
  }\n\
\n\
  function collideRects(a, b) {\n\
    return a.x + a.x1 > b[0].x && a.x + a.x0 < b[1].x && a.y + a.y1 > b[0].y && a.y + a.y0 < b[1].y;\n\
  }\n\
\n\
  function archimedeanSpiral(size) {\n\
    var e = size[0] / size[1];\n\
    return function(t) {\n\
      return [e * (t *= 0.1) * Math.cos(t), t * Math.sin(t)];\n\
    };\n\
  }\n\
\n\
  function rectangularSpiral(size) {\n\
    var dy = 4,\n\
        dx = dy * size[0] / size[1],\n\
        x = 0,\n\
        y = 0;\n\
    return function(t) {\n\
      var sign = t < 0 ? -1 : 1;\n\
      // See triangular numbers: T_n = n * (n + 1) / 2.\n\
      switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {\n\
        case 0:  x += dx; break;\n\
        case 1:  y += dy; break;\n\
        case 2:  x -= dx; break;\n\
        default: y -= dy; break;\n\
      }\n\
      return [x, y];\n\
    };\n\
  }\n\
\n\
  // init symbols position at specified point so it will result in compact layout\n\
  function centerPointPos(d, size) {\n\
    if (d.x === undefined) { d.x = size[0] >> 1;}\n\
    if (d.y === undefined) { d.y = size[1] >> 1;}\n\
  }\n\
\n\
  // init symbols position in a rectangle so it will result in loose layout\n\
  function centerAreaPos(d, size) {\n\
    if (d.x === undefined) { d.x = (size[0] * (Math.random() + 0.5)) >> 1;}\n\
    if (d.y === undefined) { d.y = (size[1] * (Math.random() + 0.5)) >> 1;}\n\
  }\n\
\n\
  // TODO reuse arrays?\n\
  function zeroArray(n) {\n\
    var a = [],\n\
        i = -1;\n\
    while (++i < n) a[i] = 0;\n\
    return a;\n\
  }\n\
\n\
  var cloudRadians = Math.PI / 180,\n\
      cw = 1 << 11 >> 5,\n\
      ch = 1 << 11,\n\
      ratio = 1;\n\
\n\
  function cloudCanvas() {\n\
    var canvas;\n\
    if (typeof document !== \"undefined\") {\n\
      canvas = document.createElement(\"canvas\");\n\
      canvas.width = 1;\n\
      canvas.height = 1;\n\
      ratio = Math.sqrt(canvas.getContext(\"2d\").getImageData(0, 0, 1, 1).data.length >> 2);\n\
      canvas.width = (cw << 5) / ratio;\n\
      canvas.height = ch / ratio;\n\
      // show canvas for debugging\n\
      // document.body.appendChild(canvas);\n\
    } else {\n\
      // node-canvas support\n\
      var Canvas = require(\"canvas\");\n\
      canvas = new Canvas(cw << 5, ch);\n\
    }\n\
    return canvas;\n\
  }\n\
\n\
  var cloudContext = cloudCanvas().getContext(\"2d\"),\n\
      spirals = {\n\
        archimedean: archimedeanSpiral,\n\
        rectangular: rectangularSpiral\n\
      },\n\
      startPosOpts = {\n\
        point: centerPointPos,\n\
        area: centerAreaPos\n\
      };\n\
\n\
  cloudContext.fillStyle = cloudContext.strokeStyle = \"red\";\n\
  cloudContext.textAlign = \"center\";\n\
  cloudContext.textBaseline = \"middle\";\n\
\n\
  exports.cloud = makeCloud;\n\
})(typeof exports === \"undefined\" ? d3.layout || (d3.layout = {}) : exports);\n\
//@ sourceURL=rogerz-d3-cloud/d3.layout.cloud.js"
));
require.register("samsonjs-format/format.js", Function("exports, require, module",
"//\n\
// format - printf-like string formatting for JavaScript\n\
// github.com/samsonjs/format\n\
// @_sjs\n\
//\n\
// Copyright 2010 - 2013 Sami Samhuri <sami@samhuri.net>\n\
//\n\
// MIT License\n\
// http://sjs.mit-license.org\n\
//\n\
\n\
;(function() {\n\
\n\
  //// Export the API\n\
  var namespace;\n\
\n\
  // CommonJS / Node module\n\
  if (typeof module !== 'undefined') {\n\
    namespace = module.exports = format;\n\
  }\n\
\n\
  // Browsers and other environments\n\
  else {\n\
    // Get the global object. Works in ES3, ES5, and ES5 strict mode.\n\
    namespace = (function(){ return this || (1,eval)('this') }());\n\
  }\n\
\n\
  namespace.format = format;\n\
  namespace.vsprintf = vsprintf;\n\
\n\
  if (typeof console !== 'undefined' && typeof console.log === 'function') {\n\
    namespace.printf = printf;\n\
  }\n\
\n\
  function printf(/* ... */) {\n\
    console.log(format.apply(null, arguments));\n\
  }\n\
\n\
  function vsprintf(fmt, replacements) {\n\
    return format.apply(null, [fmt].concat(replacements));\n\
  }\n\
\n\
  function format(fmt) {\n\
    var argIndex = 1 // skip initial format argument\n\
      , args = [].slice.call(arguments)\n\
      , i = 0\n\
      , n = fmt.length\n\
      , result = ''\n\
      , c\n\
      , escaped = false\n\
      , arg\n\
      , precision\n\
      , nextArg = function() { return args[argIndex++]; }\n\
      , slurpNumber = function() {\n\
          var digits = '';\n\
          while (fmt[i].match(/\\d/))\n\
            digits += fmt[i++];\n\
          return digits.length > 0 ? parseInt(digits) : null;\n\
        }\n\
      ;\n\
    for (; i < n; ++i) {\n\
      c = fmt[i];\n\
      if (escaped) {\n\
        escaped = false;\n\
        precision = slurpNumber();\n\
        switch (c) {\n\
        case 'b': // number in binary\n\
          result += parseInt(nextArg(), 10).toString(2);\n\
          break;\n\
        case 'c': // character\n\
          arg = nextArg();\n\
          if (typeof arg === 'string' || arg instanceof String)\n\
            result += arg;\n\
          else\n\
            result += String.fromCharCode(parseInt(arg, 10));\n\
          break;\n\
        case 'd': // number in decimal\n\
          result += parseInt(nextArg(), 10);\n\
          break;\n\
        case 'f': // floating point number\n\
          result += parseFloat(nextArg()).toFixed(precision || 6);\n\
          break;\n\
        case 'o': // number in octal\n\
          result += '0' + parseInt(nextArg(), 10).toString(8);\n\
          break;\n\
        case 's': // string\n\
          result += nextArg();\n\
          break;\n\
        case 'x': // lowercase hexadecimal\n\
          result += '0x' + parseInt(nextArg(), 10).toString(16);\n\
          break;\n\
        case 'X': // uppercase hexadecimal\n\
          result += '0x' + parseInt(nextArg(), 10).toString(16).toUpperCase();\n\
          break;\n\
        default:\n\
          result += c;\n\
          break;\n\
        }\n\
      } else if (c === '%') {\n\
        escaped = true;\n\
      } else {\n\
        result += c;\n\
      }\n\
    }\n\
    return result;\n\
  }\n\
\n\
}());\n\
//@ sourceURL=samsonjs-format/format.js"
));
require.register("jashkenas-underscore/underscore.js", Function("exports, require, module",
"//     Underscore.js 1.5.2\n\
//     http://underscorejs.org\n\
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors\n\
//     Underscore may be freely distributed under the MIT license.\n\
\n\
(function() {\n\
\n\
  // Baseline setup\n\
  // --------------\n\
\n\
  // Establish the root object, `window` in the browser, or `exports` on the server.\n\
  var root = this;\n\
\n\
  // Save the previous value of the `_` variable.\n\
  var previousUnderscore = root._;\n\
\n\
  // Establish the object that gets returned to break out of a loop iteration.\n\
  var breaker = {};\n\
\n\
  // Save bytes in the minified (but not gzipped) version:\n\
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;\n\
\n\
  //use the faster Date.now if available.\n\
  var getTime = (Date.now || function() {\n\
    return new Date().getTime();\n\
  });\n\
\n\
  // Create quick reference variables for speed access to core prototypes.\n\
  var\n\
    push             = ArrayProto.push,\n\
    slice            = ArrayProto.slice,\n\
    concat           = ArrayProto.concat,\n\
    toString         = ObjProto.toString,\n\
    hasOwnProperty   = ObjProto.hasOwnProperty;\n\
\n\
  // All **ECMAScript 5** native function implementations that we hope to use\n\
  // are declared here.\n\
  var\n\
    nativeForEach      = ArrayProto.forEach,\n\
    nativeMap          = ArrayProto.map,\n\
    nativeReduce       = ArrayProto.reduce,\n\
    nativeReduceRight  = ArrayProto.reduceRight,\n\
    nativeFilter       = ArrayProto.filter,\n\
    nativeEvery        = ArrayProto.every,\n\
    nativeSome         = ArrayProto.some,\n\
    nativeIndexOf      = ArrayProto.indexOf,\n\
    nativeLastIndexOf  = ArrayProto.lastIndexOf,\n\
    nativeIsArray      = Array.isArray,\n\
    nativeKeys         = Object.keys,\n\
    nativeBind         = FuncProto.bind;\n\
\n\
  // Create a safe reference to the Underscore object for use below.\n\
  var _ = function(obj) {\n\
    if (obj instanceof _) return obj;\n\
    if (!(this instanceof _)) return new _(obj);\n\
    this._wrapped = obj;\n\
  };\n\
\n\
  // Export the Underscore object for **Node.js**, with\n\
  // backwards-compatibility for the old `require()` API. If we're in\n\
  // the browser, add `_` as a global object via a string identifier,\n\
  // for Closure Compiler \"advanced\" mode.\n\
  if (typeof exports !== 'undefined') {\n\
    if (typeof module !== 'undefined' && module.exports) {\n\
      exports = module.exports = _;\n\
    }\n\
    exports._ = _;\n\
  } else {\n\
    root._ = _;\n\
  }\n\
\n\
  // Current version.\n\
  _.VERSION = '1.5.2';\n\
\n\
  // Collection Functions\n\
  // --------------------\n\
\n\
  // The cornerstone, an `each` implementation, aka `forEach`.\n\
  // Handles objects with the built-in `forEach`, arrays, and raw objects.\n\
  // Delegates to **ECMAScript 5**'s native `forEach` if available.\n\
  var each = _.each = _.forEach = function(obj, iterator, context) {\n\
    if (obj == null) return;\n\
    if (nativeForEach && obj.forEach === nativeForEach) {\n\
      obj.forEach(iterator, context);\n\
    } else if (obj.length === +obj.length) {\n\
      for (var i = 0, length = obj.length; i < length; i++) {\n\
        if (iterator.call(context, obj[i], i, obj) === breaker) return;\n\
      }\n\
    } else {\n\
      var keys = _.keys(obj);\n\
      for (var i = 0, length = keys.length; i < length; i++) {\n\
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;\n\
      }\n\
    }\n\
  };\n\
\n\
  // Return the results of applying the iterator to each element.\n\
  // Delegates to **ECMAScript 5**'s native `map` if available.\n\
  _.map = _.collect = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      results.push(iterator.call(context, value, index, list));\n\
    });\n\
    return results;\n\
  };\n\
\n\
  var reduceError = 'Reduce of empty array with no initial value';\n\
\n\
  // **Reduce** builds up a single result from a list of values, aka `inject`,\n\
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.\n\
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduce && obj.reduce === nativeReduce) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);\n\
    }\n\
    each(obj, function(value, index, list) {\n\
      if (!initial) {\n\
        memo = value;\n\
        initial = true;\n\
      } else {\n\
        memo = iterator.call(context, memo, value, index, list);\n\
      }\n\
    });\n\
    if (!initial) throw new TypeError(reduceError);\n\
    return memo;\n\
  };\n\
\n\
  // The right-associative version of reduce, also known as `foldr`.\n\
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.\n\
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {\n\
    var initial = arguments.length > 2;\n\
    if (obj == null) obj = [];\n\
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {\n\
      if (context) iterator = _.bind(iterator, context);\n\
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);\n\
    }\n\
    var length = obj.length;\n\
    if (length !== +length) {\n\
      var keys = _.keys(obj);\n\
      length = keys.length;\n\
    }\n\
    each(obj, function(value, index, list) {\n\
      index = keys ? keys[--length] : --length;\n\
      if (!initial) {\n\
        memo = obj[index];\n\
        initial = true;\n\
      } else {\n\
        memo = iterator.call(context, memo, obj[index], index, list);\n\
      }\n\
    });\n\
    if (!initial) throw new TypeError(reduceError);\n\
    return memo;\n\
  };\n\
\n\
  // Return the first value which passes a truth test. Aliased as `detect`.\n\
  _.find = _.detect = function(obj, iterator, context) {\n\
    var result;\n\
    any(obj, function(value, index, list) {\n\
      if (iterator.call(context, value, index, list)) {\n\
        result = value;\n\
        return true;\n\
      }\n\
    });\n\
    return result;\n\
  };\n\
\n\
  // Return all the elements that pass a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `filter` if available.\n\
  // Aliased as `select`.\n\
  _.filter = _.select = function(obj, iterator, context) {\n\
    var results = [];\n\
    if (obj == null) return results;\n\
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (iterator.call(context, value, index, list)) results.push(value);\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Return all the elements for which a truth test fails.\n\
  _.reject = function(obj, iterator, context) {\n\
    return _.filter(obj, function(value, index, list) {\n\
      return !iterator.call(context, value, index, list);\n\
    }, context);\n\
  };\n\
\n\
  // Determine whether all of the elements match a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `every` if available.\n\
  // Aliased as `all`.\n\
  _.every = _.all = function(obj, iterator, context) {\n\
    iterator || (iterator = _.identity);\n\
    var result = true;\n\
    if (obj == null) return result;\n\
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if at least one element in the object matches a truth test.\n\
  // Delegates to **ECMAScript 5**'s native `some` if available.\n\
  // Aliased as `any`.\n\
  var any = _.some = _.any = function(obj, iterator, context) {\n\
    iterator || (iterator = _.identity);\n\
    var result = false;\n\
    if (obj == null) return result;\n\
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);\n\
    each(obj, function(value, index, list) {\n\
      if (result || (result = iterator.call(context, value, index, list))) return breaker;\n\
    });\n\
    return !!result;\n\
  };\n\
\n\
  // Determine if the array or object contains a given value (using `===`).\n\
  // Aliased as `include`.\n\
  _.contains = _.include = function(obj, target) {\n\
    if (obj == null) return false;\n\
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;\n\
    return any(obj, function(value) {\n\
      return value === target;\n\
    });\n\
  };\n\
\n\
  // Invoke a method (with arguments) on every item in a collection.\n\
  _.invoke = function(obj, method) {\n\
    var args = slice.call(arguments, 2);\n\
    var isFunc = _.isFunction(method);\n\
    return _.map(obj, function(value) {\n\
      return (isFunc ? method : value[method]).apply(value, args);\n\
    });\n\
  };\n\
\n\
  // Convenience version of a common use case of `map`: fetching a property.\n\
  _.pluck = function(obj, key) {\n\
    return _.map(obj, _.property(key));\n\
  };\n\
\n\
  // Convenience version of a common use case of `filter`: selecting only objects\n\
  // containing specific `key:value` pairs.\n\
  _.where = function(obj, attrs, first) {\n\
    if (_.isEmpty(attrs)) return first ? void 0 : [];\n\
    return _[first ? 'find' : 'filter'](obj, function(value) {\n\
      for (var key in attrs) {\n\
        if (attrs[key] !== value[key]) return false;\n\
      }\n\
      return true;\n\
    });\n\
  };\n\
\n\
  // Convenience version of a common use case of `find`: getting the first object\n\
  // containing specific `key:value` pairs.\n\
  _.findWhere = function(obj, attrs) {\n\
    return _.where(obj, attrs, true);\n\
  };\n\
\n\
  // Return the maximum element or (element-based computation).\n\
  // Can't optimize arrays of integers longer than 65,535 elements.\n\
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)\n\
  _.max = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.max.apply(Math, obj);\n\
    }\n\
    if (!iterator && _.isEmpty(obj)) return -Infinity;\n\
    var result = {computed : -Infinity, value: -Infinity};\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      computed > result.computed && (result = {value : value, computed : computed});\n\
    });\n\
    return result.value;\n\
  };\n\
\n\
  // Return the minimum element (or element-based computation).\n\
  _.min = function(obj, iterator, context) {\n\
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {\n\
      return Math.min.apply(Math, obj);\n\
    }\n\
    if (!iterator && _.isEmpty(obj)) return Infinity;\n\
    var result = {computed : Infinity, value: Infinity};\n\
    each(obj, function(value, index, list) {\n\
      var computed = iterator ? iterator.call(context, value, index, list) : value;\n\
      computed < result.computed && (result = {value : value, computed : computed});\n\
    });\n\
    return result.value;\n\
  };\n\
\n\
  // Shuffle an array, using the modern version of the\n\
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).\n\
  _.shuffle = function(obj) {\n\
    var rand;\n\
    var index = 0;\n\
    var shuffled = [];\n\
    each(obj, function(value) {\n\
      rand = _.random(index++);\n\
      shuffled[index - 1] = shuffled[rand];\n\
      shuffled[rand] = value;\n\
    });\n\
    return shuffled;\n\
  };\n\
\n\
  // Sample **n** random values from a collection.\n\
  // If **n** is not specified, returns a single random element.\n\
  // The internal `guard` argument allows it to work with `map`.\n\
  _.sample = function(obj, n, guard) {\n\
    if (n == null || guard) {\n\
      if (obj.length !== +obj.length) obj = _.values(obj);\n\
      return obj[_.random(obj.length - 1)];\n\
    }\n\
    return _.shuffle(obj).slice(0, Math.max(0, n));\n\
  };\n\
\n\
  // An internal function to generate lookup iterators.\n\
  var lookupIterator = function(value) {\n\
    if (value == null) return _.identity;\n\
    if (_.isFunction(value)) return value;\n\
    return _.property(value);\n\
  };\n\
\n\
  // Sort the object's values by a criterion produced by an iterator.\n\
  _.sortBy = function(obj, iterator, context) {\n\
    iterator = lookupIterator(iterator);\n\
    return _.pluck(_.map(obj, function(value, index, list) {\n\
      return {\n\
        value: value,\n\
        index: index,\n\
        criteria: iterator.call(context, value, index, list)\n\
      };\n\
    }).sort(function(left, right) {\n\
      var a = left.criteria;\n\
      var b = right.criteria;\n\
      if (a !== b) {\n\
        if (a > b || a === void 0) return 1;\n\
        if (a < b || b === void 0) return -1;\n\
      }\n\
      return left.index - right.index;\n\
    }), 'value');\n\
  };\n\
\n\
  // An internal function used for aggregate \"group by\" operations.\n\
  var group = function(behavior) {\n\
    return function(obj, iterator, context) {\n\
      var result = {};\n\
      iterator = lookupIterator(iterator);\n\
      each(obj, function(value, index) {\n\
        var key = iterator.call(context, value, index, obj);\n\
        behavior(result, key, value);\n\
      });\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Groups the object's values by a criterion. Pass either a string attribute\n\
  // to group by, or a function that returns the criterion.\n\
  _.groupBy = group(function(result, key, value) {\n\
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);\n\
  });\n\
\n\
  // Indexes the object's values by a criterion, similar to `groupBy`, but for\n\
  // when you know that your index values will be unique.\n\
  _.indexBy = group(function(result, key, value) {\n\
    result[key] = value;\n\
  });\n\
\n\
  // Counts instances of an object that group by a certain criterion. Pass\n\
  // either a string attribute to count by, or a function that returns the\n\
  // criterion.\n\
  _.countBy = group(function(result, key) {\n\
    _.has(result, key) ? result[key]++ : result[key] = 1;\n\
  });\n\
\n\
  // Use a comparator function to figure out the smallest index at which\n\
  // an object should be inserted so as to maintain order. Uses binary search.\n\
  _.sortedIndex = function(array, obj, iterator, context) {\n\
    iterator = lookupIterator(iterator);\n\
    var value = iterator.call(context, obj);\n\
    var low = 0, high = array.length;\n\
    while (low < high) {\n\
      var mid = (low + high) >>> 1;\n\
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;\n\
    }\n\
    return low;\n\
  };\n\
\n\
  // Safely create a real, live array from anything iterable.\n\
  _.toArray = function(obj) {\n\
    if (!obj) return [];\n\
    if (_.isArray(obj)) return slice.call(obj);\n\
    if (obj.length === +obj.length) return _.map(obj, _.identity);\n\
    return _.values(obj);\n\
  };\n\
\n\
  // Return the number of elements in an object.\n\
  _.size = function(obj) {\n\
    if (obj == null) return 0;\n\
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;\n\
  };\n\
\n\
  // Array Functions\n\
  // ---------------\n\
\n\
  // Get the first element of an array. Passing **n** will return the first N\n\
  // values in the array. Aliased as `head` and `take`. The **guard** check\n\
  // allows it to work with `_.map`.\n\
  _.first = _.head = _.take = function(array, n, guard) {\n\
    if (array == null) return void 0;\n\
    if ((n == null) || guard) return array[0];\n\
    if (n < 0) return [];\n\
    return slice.call(array, 0, n);\n\
  };\n\
\n\
  // Returns everything but the last entry of the array. Especially useful on\n\
  // the arguments object. Passing **n** will return all the values in\n\
  // the array, excluding the last N. The **guard** check allows it to work with\n\
  // `_.map`.\n\
  _.initial = function(array, n, guard) {\n\
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));\n\
  };\n\
\n\
  // Get the last element of an array. Passing **n** will return the last N\n\
  // values in the array. The **guard** check allows it to work with `_.map`.\n\
  _.last = function(array, n, guard) {\n\
    if (array == null) return void 0;\n\
    if ((n == null) || guard) return array[array.length - 1];\n\
    return slice.call(array, Math.max(array.length - n, 0));\n\
  };\n\
\n\
  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.\n\
  // Especially useful on the arguments object. Passing an **n** will return\n\
  // the rest N values in the array. The **guard**\n\
  // check allows it to work with `_.map`.\n\
  _.rest = _.tail = _.drop = function(array, n, guard) {\n\
    return slice.call(array, (n == null) || guard ? 1 : n);\n\
  };\n\
\n\
  // Trim out all falsy values from an array.\n\
  _.compact = function(array) {\n\
    return _.filter(array, _.identity);\n\
  };\n\
\n\
  // Internal implementation of a recursive `flatten` function.\n\
  var flatten = function(input, shallow, output) {\n\
    if (shallow && _.every(input, _.isArray)) {\n\
      return concat.apply(output, input);\n\
    }\n\
    each(input, function(value) {\n\
      if (_.isArray(value) || _.isArguments(value)) {\n\
        shallow ? push.apply(output, value) : flatten(value, shallow, output);\n\
      } else {\n\
        output.push(value);\n\
      }\n\
    });\n\
    return output;\n\
  };\n\
\n\
  // Flatten out an array, either recursively (by default), or just one level.\n\
  _.flatten = function(array, shallow) {\n\
    return flatten(array, shallow, []);\n\
  };\n\
\n\
  // Return a version of the array that does not contain the specified value(s).\n\
  _.without = function(array) {\n\
    return _.difference(array, slice.call(arguments, 1));\n\
  };\n\
\n\
  // Produce a duplicate-free version of the array. If the array has already\n\
  // been sorted, you have the option of using a faster algorithm.\n\
  // Aliased as `unique`.\n\
  _.uniq = _.unique = function(array, isSorted, iterator, context) {\n\
    if (_.isFunction(isSorted)) {\n\
      context = iterator;\n\
      iterator = isSorted;\n\
      isSorted = false;\n\
    }\n\
    var initial = iterator ? _.map(array, iterator, context) : array;\n\
    var results = [];\n\
    var seen = [];\n\
    each(initial, function(value, index) {\n\
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {\n\
        seen.push(value);\n\
        results.push(array[index]);\n\
      }\n\
    });\n\
    return results;\n\
  };\n\
\n\
  // Produce an array that contains the union: each distinct element from all of\n\
  // the passed-in arrays.\n\
  _.union = function() {\n\
    return _.uniq(_.flatten(arguments, true));\n\
  };\n\
\n\
  // Produce an array that contains every item shared between all the\n\
  // passed-in arrays.\n\
  _.intersection = function(array) {\n\
    var rest = slice.call(arguments, 1);\n\
    return _.filter(_.uniq(array), function(item) {\n\
      return _.every(rest, function(other) {\n\
        return _.indexOf(other, item) >= 0;\n\
      });\n\
    });\n\
  };\n\
\n\
  // Take the difference between one array and a number of other arrays.\n\
  // Only the elements present in just the first array will remain.\n\
  _.difference = function(array) {\n\
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    return _.filter(array, function(value){ return !_.contains(rest, value); });\n\
  };\n\
\n\
  // Zip together multiple lists into a single array -- elements that share\n\
  // an index go together.\n\
  _.zip = function() {\n\
    var length = _.max(_.pluck(arguments, \"length\").concat(0));\n\
    var results = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      results[i] = _.pluck(arguments, '' + i);\n\
    }\n\
    return results;\n\
  };\n\
\n\
  // Converts lists into objects. Pass either a single array of `[key, value]`\n\
  // pairs, or two parallel arrays of the same length -- one of keys, and one of\n\
  // the corresponding values.\n\
  _.object = function(list, values) {\n\
    if (list == null) return {};\n\
    var result = {};\n\
    for (var i = 0, length = list.length; i < length; i++) {\n\
      if (values) {\n\
        result[list[i]] = values[i];\n\
      } else {\n\
        result[list[i][0]] = list[i][1];\n\
      }\n\
    }\n\
    return result;\n\
  };\n\
\n\
  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),\n\
  // we need this function. Return the position of the first occurrence of an\n\
  // item in an array, or -1 if the item is not included in the array.\n\
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.\n\
  // If the array is large and already in sort order, pass `true`\n\
  // for **isSorted** to use binary search.\n\
  _.indexOf = function(array, item, isSorted) {\n\
    if (array == null) return -1;\n\
    var i = 0, length = array.length;\n\
    if (isSorted) {\n\
      if (typeof isSorted == 'number') {\n\
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);\n\
      } else {\n\
        i = _.sortedIndex(array, item);\n\
        return array[i] === item ? i : -1;\n\
      }\n\
    }\n\
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);\n\
    for (; i < length; i++) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.\n\
  _.lastIndexOf = function(array, item, from) {\n\
    if (array == null) return -1;\n\
    var hasIndex = from != null;\n\
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {\n\
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);\n\
    }\n\
    var i = (hasIndex ? from : array.length);\n\
    while (i--) if (array[i] === item) return i;\n\
    return -1;\n\
  };\n\
\n\
  // Generate an integer Array containing an arithmetic progression. A port of\n\
  // the native Python `range()` function. See\n\
  // [the Python documentation](http://docs.python.org/library/functions.html#range).\n\
  _.range = function(start, stop, step) {\n\
    if (arguments.length <= 1) {\n\
      stop = start || 0;\n\
      start = 0;\n\
    }\n\
    step = arguments[2] || 1;\n\
\n\
    var length = Math.max(Math.ceil((stop - start) / step), 0);\n\
    var idx = 0;\n\
    var range = new Array(length);\n\
\n\
    while(idx < length) {\n\
      range[idx++] = start;\n\
      start += step;\n\
    }\n\
\n\
    return range;\n\
  };\n\
\n\
  // Function (ahem) Functions\n\
  // ------------------\n\
\n\
  // Reusable constructor function for prototype setting.\n\
  var ctor = function(){};\n\
\n\
  // Create a function bound to a given object (assigning `this`, and arguments,\n\
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if\n\
  // available.\n\
  _.bind = function(func, context) {\n\
    var args, bound;\n\
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));\n\
    if (!_.isFunction(func)) throw new TypeError;\n\
    args = slice.call(arguments, 2);\n\
    return bound = function() {\n\
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));\n\
      ctor.prototype = func.prototype;\n\
      var self = new ctor;\n\
      ctor.prototype = null;\n\
      var result = func.apply(self, args.concat(slice.call(arguments)));\n\
      if (Object(result) === result) return result;\n\
      return self;\n\
    };\n\
  };\n\
\n\
  // Partially apply a function by creating a version that has had some of its\n\
  // arguments pre-filled, without changing its dynamic `this` context.\n\
  _.partial = function(func) {\n\
    var args = slice.call(arguments, 1);\n\
    return function() {\n\
      return func.apply(this, args.concat(slice.call(arguments)));\n\
    };\n\
  };\n\
\n\
  // Bind a number of an object's methods to that object. Remaining arguments\n\
  // are the method names to be bound. Useful for ensuring that all callbacks\n\
  // defined on an object belong to it.\n\
  _.bindAll = function(obj) {\n\
    var funcs = slice.call(arguments, 1);\n\
    if (funcs.length === 0) throw new Error(\"bindAll must be passed function names\");\n\
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });\n\
    return obj;\n\
  };\n\
\n\
  // Memoize an expensive function by storing its results.\n\
  _.memoize = function(func, hasher) {\n\
    var memo = {};\n\
    hasher || (hasher = _.identity);\n\
    return function() {\n\
      var key = hasher.apply(this, arguments);\n\
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));\n\
    };\n\
  };\n\
\n\
  // Delays a function for the given number of milliseconds, and then calls\n\
  // it with the arguments supplied.\n\
  _.delay = function(func, wait) {\n\
    var args = slice.call(arguments, 2);\n\
    return setTimeout(function(){ return func.apply(null, args); }, wait);\n\
  };\n\
\n\
  // Defers a function, scheduling it to run after the current call stack has\n\
  // cleared.\n\
  _.defer = function(func) {\n\
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));\n\
  };\n\
\n\
  // Returns a function, that, when invoked, will only be triggered at most once\n\
  // during a given window of time. Normally, the throttled function will run\n\
  // as much as it can, without ever going more than once per `wait` duration;\n\
  // but if you'd like to disable the execution on the leading edge, pass\n\
  // `{leading: false}`. To disable execution on the trailing edge, ditto.\n\
  _.throttle = function(func, wait, options) {\n\
    var context, args, result;\n\
    var timeout = null;\n\
    var previous = 0;\n\
    options || (options = {});\n\
    var later = function() {\n\
      previous = options.leading === false ? 0 : getTime();\n\
      timeout = null;\n\
      result = func.apply(context, args);\n\
      context = args = null;\n\
    };\n\
    return function() {\n\
      var now = getTime();\n\
      if (!previous && options.leading === false) previous = now;\n\
      var remaining = wait - (now - previous);\n\
      context = this;\n\
      args = arguments;\n\
      if (remaining <= 0) {\n\
        clearTimeout(timeout);\n\
        timeout = null;\n\
        previous = now;\n\
        result = func.apply(context, args);\n\
        context = args = null;\n\
      } else if (!timeout && options.trailing !== false) {\n\
        timeout = setTimeout(later, remaining);\n\
      }\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Returns a function, that, as long as it continues to be invoked, will not\n\
  // be triggered. The function will be called after it stops being called for\n\
  // N milliseconds. If `immediate` is passed, trigger the function on the\n\
  // leading edge, instead of the trailing.\n\
  _.debounce = function(func, wait, immediate) {\n\
    var timeout, args, context, timestamp, result;\n\
    return function() {\n\
      context = this;\n\
      args = arguments;\n\
      timestamp = getTime();\n\
      var later = function() {\n\
        var last = getTime() - timestamp;\n\
        if (last < wait) {\n\
          timeout = setTimeout(later, wait - last);\n\
        } else {\n\
          timeout = null;\n\
          if (!immediate) {\n\
            result = func.apply(context, args);\n\
            context = args = null;\n\
          }\n\
        }\n\
      };\n\
      var callNow = immediate && !timeout;\n\
      if (!timeout) {\n\
        timeout = setTimeout(later, wait);\n\
      }\n\
      if (callNow) {\n\
        result = func.apply(context, args);\n\
        context = args = null;\n\
      }\n\
\n\
      return result;\n\
    };\n\
  };\n\
\n\
  // Returns a function that will be executed at most one time, no matter how\n\
  // often you call it. Useful for lazy initialization.\n\
  _.once = function(func) {\n\
    var ran = false, memo;\n\
    return function() {\n\
      if (ran) return memo;\n\
      ran = true;\n\
      memo = func.apply(this, arguments);\n\
      func = null;\n\
      return memo;\n\
    };\n\
  };\n\
\n\
  // Returns the first function passed as an argument to the second,\n\
  // allowing you to adjust arguments, run code before and after, and\n\
  // conditionally execute the original function.\n\
  _.wrap = function(func, wrapper) {\n\
    return _.partial(wrapper, func);\n\
  };\n\
\n\
  // Returns a function that is the composition of a list of functions, each\n\
  // consuming the return value of the function that follows.\n\
  _.compose = function() {\n\
    var funcs = arguments;\n\
    return function() {\n\
      var args = arguments;\n\
      for (var i = funcs.length - 1; i >= 0; i--) {\n\
        args = [funcs[i].apply(this, args)];\n\
      }\n\
      return args[0];\n\
    };\n\
  };\n\
\n\
  // Returns a function that will only be executed after being called N times.\n\
  _.after = function(times, func) {\n\
    return function() {\n\
      if (--times < 1) {\n\
        return func.apply(this, arguments);\n\
      }\n\
    };\n\
  };\n\
\n\
  // Object Functions\n\
  // ----------------\n\
\n\
  // Retrieve the names of an object's properties.\n\
  // Delegates to **ECMAScript 5**'s native `Object.keys`\n\
  _.keys = nativeKeys || function(obj) {\n\
    if (obj !== Object(obj)) throw new TypeError('Invalid object');\n\
    var keys = [];\n\
    for (var key in obj) if (_.has(obj, key)) keys.push(key);\n\
    return keys;\n\
  };\n\
\n\
  // Retrieve the values of an object's properties.\n\
  _.values = function(obj) {\n\
    var keys = _.keys(obj);\n\
    var length = keys.length;\n\
    var values = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      values[i] = obj[keys[i]];\n\
    }\n\
    return values;\n\
  };\n\
\n\
  // Convert an object into a list of `[key, value]` pairs.\n\
  _.pairs = function(obj) {\n\
    var keys = _.keys(obj);\n\
    var length = keys.length;\n\
    var pairs = new Array(length);\n\
    for (var i = 0; i < length; i++) {\n\
      pairs[i] = [keys[i], obj[keys[i]]];\n\
    }\n\
    return pairs;\n\
  };\n\
\n\
  // Invert the keys and values of an object. The values must be serializable.\n\
  _.invert = function(obj) {\n\
    var result = {};\n\
    var keys = _.keys(obj);\n\
    for (var i = 0, length = keys.length; i < length; i++) {\n\
      result[obj[keys[i]]] = keys[i];\n\
    }\n\
    return result;\n\
  };\n\
\n\
  // Return a sorted list of the function names available on the object.\n\
  // Aliased as `methods`\n\
  _.functions = _.methods = function(obj) {\n\
    var names = [];\n\
    for (var key in obj) {\n\
      if (_.isFunction(obj[key])) names.push(key);\n\
    }\n\
    return names.sort();\n\
  };\n\
\n\
  // Extend a given object with all the properties in passed-in object(s).\n\
  _.extend = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      if (source) {\n\
        for (var prop in source) {\n\
          obj[prop] = source[prop];\n\
        }\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Return a copy of the object only containing the whitelisted properties.\n\
  _.pick = function(obj) {\n\
    var copy = {};\n\
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    each(keys, function(key) {\n\
      if (key in obj) copy[key] = obj[key];\n\
    });\n\
    return copy;\n\
  };\n\
\n\
   // Return a copy of the object without the blacklisted properties.\n\
  _.omit = function(obj) {\n\
    var copy = {};\n\
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));\n\
    for (var key in obj) {\n\
      if (!_.contains(keys, key)) copy[key] = obj[key];\n\
    }\n\
    return copy;\n\
  };\n\
\n\
  // Fill in a given object with default properties.\n\
  _.defaults = function(obj) {\n\
    each(slice.call(arguments, 1), function(source) {\n\
      if (source) {\n\
        for (var prop in source) {\n\
          if (obj[prop] === void 0) obj[prop] = source[prop];\n\
        }\n\
      }\n\
    });\n\
    return obj;\n\
  };\n\
\n\
  // Create a (shallow-cloned) duplicate of an object.\n\
  _.clone = function(obj) {\n\
    if (!_.isObject(obj)) return obj;\n\
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);\n\
  };\n\
\n\
  // Invokes interceptor with the obj, and then returns obj.\n\
  // The primary purpose of this method is to \"tap into\" a method chain, in\n\
  // order to perform operations on intermediate results within the chain.\n\
  _.tap = function(obj, interceptor) {\n\
    interceptor(obj);\n\
    return obj;\n\
  };\n\
\n\
  // Internal recursive comparison function for `isEqual`.\n\
  var eq = function(a, b, aStack, bStack) {\n\
    // Identical objects are equal. `0 === -0`, but they aren't identical.\n\
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).\n\
    if (a === b) return a !== 0 || 1 / a == 1 / b;\n\
    // A strict comparison is necessary because `null == undefined`.\n\
    if (a == null || b == null) return a === b;\n\
    // Unwrap any wrapped objects.\n\
    if (a instanceof _) a = a._wrapped;\n\
    if (b instanceof _) b = b._wrapped;\n\
    // Compare `[[Class]]` names.\n\
    var className = toString.call(a);\n\
    if (className != toString.call(b)) return false;\n\
    switch (className) {\n\
      // Strings, numbers, dates, and booleans are compared by value.\n\
      case '[object String]':\n\
        // Primitives and their corresponding object wrappers are equivalent; thus, `\"5\"` is\n\
        // equivalent to `new String(\"5\")`.\n\
        return a == String(b);\n\
      case '[object Number]':\n\
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for\n\
        // other numeric values.\n\
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);\n\
      case '[object Date]':\n\
      case '[object Boolean]':\n\
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their\n\
        // millisecond representations. Note that invalid dates with millisecond representations\n\
        // of `NaN` are not equivalent.\n\
        return +a == +b;\n\
      // RegExps are compared by their source patterns and flags.\n\
      case '[object RegExp]':\n\
        return a.source == b.source &&\n\
               a.global == b.global &&\n\
               a.multiline == b.multiline &&\n\
               a.ignoreCase == b.ignoreCase;\n\
    }\n\
    if (typeof a != 'object' || typeof b != 'object') return false;\n\
    // Assume equality for cyclic structures. The algorithm for detecting cyclic\n\
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.\n\
    var length = aStack.length;\n\
    while (length--) {\n\
      // Linear search. Performance is inversely proportional to the number of\n\
      // unique nested structures.\n\
      if (aStack[length] == a) return bStack[length] == b;\n\
    }\n\
    // Objects with different constructors are not equivalent, but `Object`s\n\
    // from different frames are.\n\
    var aCtor = a.constructor, bCtor = b.constructor;\n\
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&\n\
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))\n\
                        && ('constructor' in a && 'constructor' in b)) {\n\
      return false;\n\
    }\n\
    // Add the first object to the stack of traversed objects.\n\
    aStack.push(a);\n\
    bStack.push(b);\n\
    var size = 0, result = true;\n\
    // Recursively compare objects and arrays.\n\
    if (className == '[object Array]') {\n\
      // Compare array lengths to determine if a deep comparison is necessary.\n\
      size = a.length;\n\
      result = size == b.length;\n\
      if (result) {\n\
        // Deep compare the contents, ignoring non-numeric properties.\n\
        while (size--) {\n\
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;\n\
        }\n\
      }\n\
    } else {\n\
      // Deep compare objects.\n\
      for (var key in a) {\n\
        if (_.has(a, key)) {\n\
          // Count the expected number of properties.\n\
          size++;\n\
          // Deep compare each member.\n\
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;\n\
        }\n\
      }\n\
      // Ensure that both objects contain the same number of properties.\n\
      if (result) {\n\
        for (key in b) {\n\
          if (_.has(b, key) && !(size--)) break;\n\
        }\n\
        result = !size;\n\
      }\n\
    }\n\
    // Remove the first object from the stack of traversed objects.\n\
    aStack.pop();\n\
    bStack.pop();\n\
    return result;\n\
  };\n\
\n\
  // Perform a deep comparison to check if two objects are equal.\n\
  _.isEqual = function(a, b) {\n\
    return eq(a, b, [], []);\n\
  };\n\
\n\
  // Is a given array, string, or object empty?\n\
  // An \"empty\" object has no enumerable own-properties.\n\
  _.isEmpty = function(obj) {\n\
    if (obj == null) return true;\n\
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;\n\
    for (var key in obj) if (_.has(obj, key)) return false;\n\
    return true;\n\
  };\n\
\n\
  // Is a given value a DOM element?\n\
  _.isElement = function(obj) {\n\
    return !!(obj && obj.nodeType === 1);\n\
  };\n\
\n\
  // Is a given value an array?\n\
  // Delegates to ECMA5's native Array.isArray\n\
  _.isArray = nativeIsArray || function(obj) {\n\
    return toString.call(obj) == '[object Array]';\n\
  };\n\
\n\
  // Is a given variable an object?\n\
  _.isObject = function(obj) {\n\
    return obj === Object(obj);\n\
  };\n\
\n\
  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.\n\
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {\n\
    _['is' + name] = function(obj) {\n\
      return toString.call(obj) == '[object ' + name + ']';\n\
    };\n\
  });\n\
\n\
  // Define a fallback version of the method in browsers (ahem, IE), where\n\
  // there isn't any inspectable \"Arguments\" type.\n\
  if (!_.isArguments(arguments)) {\n\
    _.isArguments = function(obj) {\n\
      return !!(obj && _.has(obj, 'callee'));\n\
    };\n\
  }\n\
\n\
  // Optimize `isFunction` if appropriate.\n\
  if (typeof (/./) !== 'function') {\n\
    _.isFunction = function(obj) {\n\
      return typeof obj === 'function';\n\
    };\n\
  }\n\
\n\
  // Is a given object a finite number?\n\
  _.isFinite = function(obj) {\n\
    return isFinite(obj) && !isNaN(parseFloat(obj));\n\
  };\n\
\n\
  // Is the given value `NaN`? (NaN is the only number which does not equal itself).\n\
  _.isNaN = function(obj) {\n\
    return _.isNumber(obj) && obj != +obj;\n\
  };\n\
\n\
  // Is a given value a boolean?\n\
  _.isBoolean = function(obj) {\n\
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';\n\
  };\n\
\n\
  // Is a given value equal to null?\n\
  _.isNull = function(obj) {\n\
    return obj === null;\n\
  };\n\
\n\
  // Is a given variable undefined?\n\
  _.isUndefined = function(obj) {\n\
    return obj === void 0;\n\
  };\n\
\n\
  // Shortcut function for checking if an object has a given property directly\n\
  // on itself (in other words, not on a prototype).\n\
  _.has = function(obj, key) {\n\
    return hasOwnProperty.call(obj, key);\n\
  };\n\
\n\
  // Utility Functions\n\
  // -----------------\n\
\n\
  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its\n\
  // previous owner. Returns a reference to the Underscore object.\n\
  _.noConflict = function() {\n\
    root._ = previousUnderscore;\n\
    return this;\n\
  };\n\
\n\
  // Keep the identity function around for default iterators.\n\
  _.identity = function(value) {\n\
    return value;\n\
  };\n\
\n\
  _.constant = function(value) {\n\
    return function () {\n\
      return value;\n\
    };\n\
  };\n\
\n\
  _.property = function(key) {\n\
    return function(obj) {\n\
      return obj[key];\n\
    };\n\
  };\n\
\n\
  // Run a function **n** times.\n\
  _.times = function(n, iterator, context) {\n\
    var accum = Array(Math.max(0, n));\n\
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);\n\
    return accum;\n\
  };\n\
\n\
  // Return a random integer between min and max (inclusive).\n\
  _.random = function(min, max) {\n\
    if (max == null) {\n\
      max = min;\n\
      min = 0;\n\
    }\n\
    return min + Math.floor(Math.random() * (max - min + 1));\n\
  };\n\
\n\
  // List of HTML entities for escaping.\n\
  var entityMap = {\n\
    escape: {\n\
      '&': '&amp;',\n\
      '<': '&lt;',\n\
      '>': '&gt;',\n\
      '\"': '&quot;',\n\
      \"'\": '&#x27;'\n\
    }\n\
  };\n\
  entityMap.unescape = _.invert(entityMap.escape);\n\
\n\
  // Regexes containing the keys and values listed immediately above.\n\
  var entityRegexes = {\n\
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),\n\
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')\n\
  };\n\
\n\
  // Functions for escaping and unescaping strings to/from HTML interpolation.\n\
  _.each(['escape', 'unescape'], function(method) {\n\
    _[method] = function(string) {\n\
      if (string == null) return '';\n\
      return ('' + string).replace(entityRegexes[method], function(match) {\n\
        return entityMap[method][match];\n\
      });\n\
    };\n\
  });\n\
\n\
  // If the value of the named `property` is a function then invoke it with the\n\
  // `object` as context; otherwise, return it.\n\
  _.result = function(object, property) {\n\
    if (object == null) return void 0;\n\
    var value = object[property];\n\
    return _.isFunction(value) ? value.call(object) : value;\n\
  };\n\
\n\
  // Add your own custom functions to the Underscore object.\n\
  _.mixin = function(obj) {\n\
    each(_.functions(obj), function(name) {\n\
      var func = _[name] = obj[name];\n\
      _.prototype[name] = function() {\n\
        var args = [this._wrapped];\n\
        push.apply(args, arguments);\n\
        return result.call(this, func.apply(_, args));\n\
      };\n\
    });\n\
  };\n\
\n\
  // Generate a unique integer id (unique within the entire client session).\n\
  // Useful for temporary DOM ids.\n\
  var idCounter = 0;\n\
  _.uniqueId = function(prefix) {\n\
    var id = ++idCounter + '';\n\
    return prefix ? prefix + id : id;\n\
  };\n\
\n\
  // By default, Underscore uses ERB-style template delimiters, change the\n\
  // following template settings to use alternative delimiters.\n\
  _.templateSettings = {\n\
    evaluate    : /<%([\\s\\S]+?)%>/g,\n\
    interpolate : /<%=([\\s\\S]+?)%>/g,\n\
    escape      : /<%-([\\s\\S]+?)%>/g\n\
  };\n\
\n\
  // When customizing `templateSettings`, if you don't want to define an\n\
  // interpolation, evaluation or escaping regex, we need one that is\n\
  // guaranteed not to match.\n\
  var noMatch = /(.)^/;\n\
\n\
  // Certain characters need to be escaped so that they can be put into a\n\
  // string literal.\n\
  var escapes = {\n\
    \"'\":      \"'\",\n\
    '\\\\':     '\\\\',\n\
    '\\r':     'r',\n\
    '\\n\
':     'n',\n\
    '\\t':     't',\n\
    '\\u2028': 'u2028',\n\
    '\\u2029': 'u2029'\n\
  };\n\
\n\
  var escaper = /\\\\|'|\\r|\\n\
|\\t|\\u2028|\\u2029/g;\n\
\n\
  // JavaScript micro-templating, similar to John Resig's implementation.\n\
  // Underscore templating handles arbitrary delimiters, preserves whitespace,\n\
  // and correctly escapes quotes within interpolated code.\n\
  _.template = function(text, data, settings) {\n\
    var render;\n\
    settings = _.defaults({}, settings, _.templateSettings);\n\
\n\
    // Combine delimiters into one regular expression via alternation.\n\
    var matcher = new RegExp([\n\
      (settings.escape || noMatch).source,\n\
      (settings.interpolate || noMatch).source,\n\
      (settings.evaluate || noMatch).source\n\
    ].join('|') + '|$', 'g');\n\
\n\
    // Compile the template source, escaping string literals appropriately.\n\
    var index = 0;\n\
    var source = \"__p+='\";\n\
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {\n\
      source += text.slice(index, offset)\n\
        .replace(escaper, function(match) { return '\\\\' + escapes[match]; });\n\
\n\
      if (escape) {\n\
        source += \"'+\\n\
((__t=(\" + escape + \"))==null?'':_.escape(__t))+\\n\
'\";\n\
      }\n\
      if (interpolate) {\n\
        source += \"'+\\n\
((__t=(\" + interpolate + \"))==null?'':__t)+\\n\
'\";\n\
      }\n\
      if (evaluate) {\n\
        source += \"';\\n\
\" + evaluate + \"\\n\
__p+='\";\n\
      }\n\
      index = offset + match.length;\n\
      return match;\n\
    });\n\
    source += \"';\\n\
\";\n\
\n\
    // If a variable is not specified, place data values in local scope.\n\
    if (!settings.variable) source = 'with(obj||{}){\\n\
' + source + '}\\n\
';\n\
\n\
    source = \"var __t,__p='',__j=Array.prototype.join,\" +\n\
      \"print=function(){__p+=__j.call(arguments,'');};\\n\
\" +\n\
      source + \"return __p;\\n\
\";\n\
\n\
    try {\n\
      render = new Function(settings.variable || 'obj', '_', source);\n\
    } catch (e) {\n\
      e.source = source;\n\
      throw e;\n\
    }\n\
\n\
    if (data) return render(data, _);\n\
    var template = function(data) {\n\
      return render.call(this, data, _);\n\
    };\n\
\n\
    // Provide the compiled function source as a convenience for precompilation.\n\
    template.source = 'function(' + (settings.variable || 'obj') + '){\\n\
' + source + '}';\n\
\n\
    return template;\n\
  };\n\
\n\
  // Add a \"chain\" function, which will delegate to the wrapper.\n\
  _.chain = function(obj) {\n\
    return _(obj).chain();\n\
  };\n\
\n\
  // OOP\n\
  // ---------------\n\
  // If Underscore is called as a function, it returns a wrapped object that\n\
  // can be used OO-style. This wrapper holds altered versions of all the\n\
  // underscore functions. Wrapped objects may be chained.\n\
\n\
  // Helper function to continue chaining intermediate results.\n\
  var result = function(obj) {\n\
    return this._chain ? _(obj).chain() : obj;\n\
  };\n\
\n\
  // Add all of the Underscore functions to the wrapper object.\n\
  _.mixin(_);\n\
\n\
  // Add all mutator Array functions to the wrapper.\n\
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {\n\
    var method = ArrayProto[name];\n\
    _.prototype[name] = function() {\n\
      var obj = this._wrapped;\n\
      method.apply(obj, arguments);\n\
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];\n\
      return result.call(this, obj);\n\
    };\n\
  });\n\
\n\
  // Add all accessor Array functions to the wrapper.\n\
  each(['concat', 'join', 'slice'], function(name) {\n\
    var method = ArrayProto[name];\n\
    _.prototype[name] = function() {\n\
      return result.call(this, method.apply(this._wrapped, arguments));\n\
    };\n\
  });\n\
\n\
  _.extend(_.prototype, {\n\
\n\
    // Start chaining a wrapped Underscore object.\n\
    chain: function() {\n\
      this._chain = true;\n\
      return this;\n\
    },\n\
\n\
    // Extracts the result from a wrapped and chained object.\n\
    value: function() {\n\
      return this._wrapped;\n\
    }\n\
\n\
  });\n\
\n\
  // AMD registration happens at the end for compatibility with AMD loaders\n\
  // that may not enforce next-turn semantics on modules. Even though general\n\
  // practice for AMD registration is to be anonymous, underscore registers\n\
  // as a named module because, like jQuery, it is a base library that is\n\
  // popular enough to be bundled in a third party lib, but not be part of\n\
  // an AMD load request. Those cases could generate an error when an\n\
  // anonymous define() is called outside of a loader request.\n\
  if (typeof define === 'function' && define.amd) {\n\
    define('underscore', [], function() {\n\
      return _;\n\
    });\n\
  }\n\
}).call(this);\n\
//@ sourceURL=jashkenas-underscore/underscore.js"
));
require.register("rogerz-control-panel-for-angular/index.js", Function("exports, require, module",
"module.exports = require('./module.js');\n\
\n\
require('./directives.js');\n\
require('./services.js');//@ sourceURL=rogerz-control-panel-for-angular/index.js"
));
require.register("rogerz-control-panel-for-angular/module.js", Function("exports, require, module",
"exports = module.exports = angular.module('rogerz/controlPanel', []);\n\
//@ sourceURL=rogerz-control-panel-for-angular/module.js"
));
require.register("rogerz-control-panel-for-angular/services.js", Function("exports, require, module",
"require('./module')\n\
  .service('controlPanel', function () {\n\
    var panels = [],\n\
    activeOne;\n\
\n\
    function activate(index) {\n\
      if (activeOne) {\n\
        activeOne.active = false;\n\
      }\n\
      activeOne = panels[index];\n\
      activeOne.active = true;\n\
      return activeOne;\n\
    }\n\
\n\
    function add(name, icon, tpl, ctx) {\n\
      panels.push({\n\
        name: name,\n\
        iconClass: icon,\n\
        template: tpl,\n\
        ctx: ctx,\n\
        active: false\n\
      });\n\
    }\n\
\n\
    function all() {\n\
      return panels;\n\
    }\n\
\n\
    return {\n\
      all: all,\n\
      add: add,\n\
      activate: activate\n\
    };\n\
  });\n\
//@ sourceURL=rogerz-control-panel-for-angular/services.js"
));
require.register("rogerz-control-panel-for-angular/directives.js", Function("exports, require, module",
"require('./module')\n\
  .directive('controlPanel', function () {\n\
\n\
    function controller($scope, controlPanel) {\n\
      $scope.panels = controlPanel.all();\n\
\n\
      $scope.activate = function (index) {\n\
        var activeOne = controlPanel.activate(index);\n\
\n\
        $scope.template = activeOne.template;\n\
        $scope.ctx = activeOne.ctx;\n\
      };\n\
\n\
      $scope.inactive = false;\n\
\n\
      $scope.toggle = function () {\n\
        $scope.inactive = !$scope.inactive;\n\
      };\n\
    }\n\
\n\
    return {\n\
      restrict: 'E',\n\
      controller: ['$scope', 'controlPanel', controller],\n\
      template: require('./template.html')\n\
    };\n\
  })\n\
  .directive('angularBindTemplate', function ($compile) {\n\
    return function (scope, elem, attrs) {\n\
      scope.$watch(attrs.angularBindTemplate, function (newVal, oldVal) {\n\
        if (newVal && newVal !== oldVal) {\n\
          elem.html(newVal);\n\
          $compile(elem.contents())(scope);\n\
        }\n\
      });\n\
    };\n\
  });\n\
//@ sourceURL=rogerz-control-panel-for-angular/directives.js"
));
require.register("component-trim/index.js", Function("exports, require, module",
"\n\
exports = module.exports = trim;\n\
\n\
function trim(str){\n\
  if (str.trim) return str.trim();\n\
  return str.replace(/^\\s*|\\s*$/g, '');\n\
}\n\
\n\
exports.left = function(str){\n\
  if (str.trimLeft) return str.trimLeft();\n\
  return str.replace(/^\\s*/, '');\n\
};\n\
\n\
exports.right = function(str){\n\
  if (str.trimRight) return str.trimRight();\n\
  return str.replace(/\\s*$/, '');\n\
};\n\
//@ sourceURL=component-trim/index.js"
));
require.register("component-querystring/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var trim = require('trim');\n\
\n\
/**\n\
 * Parse the given query `str`.\n\
 *\n\
 * @param {String} str\n\
 * @return {Object}\n\
 * @api public\n\
 */\n\
\n\
exports.parse = function(str){\n\
  if ('string' != typeof str) return {};\n\
\n\
  str = trim(str);\n\
  if ('' == str) return {};\n\
  if ('?' == str.charAt(0)) str = str.slice(1);\n\
\n\
  var obj = {};\n\
  var pairs = str.split('&');\n\
  for (var i = 0; i < pairs.length; i++) {\n\
    var parts = pairs[i].split('=');\n\
    obj[parts[0]] = null == parts[1]\n\
      ? ''\n\
      : decodeURIComponent(parts[1]);\n\
  }\n\
\n\
  return obj;\n\
};\n\
\n\
/**\n\
 * Stringify the given `obj`.\n\
 *\n\
 * @param {Object} obj\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
exports.stringify = function(obj){\n\
  if (!obj) return '';\n\
  var pairs = [];\n\
  for (var key in obj) {\n\
    pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));\n\
  }\n\
  return pairs.join('&');\n\
};\n\
//@ sourceURL=component-querystring/index.js"
));
require.register("rogerz-signature-api-legacy-for-angular/lib/index.js", Function("exports, require, module",
"var _ = require('underscore');\n\
var query = require('querystring');\n\
var format = require('format');\n\
\n\
// jshint camelcase: false\n\
\n\
function SignatureApiProvider () {\n\
  // letsface servers from https://github.com/letsface/signature-cluster/wiki/API\n\
  var config = {\n\
      hosts: []\n\
  };\n\
\n\
  this.hosts = function (hosts) {\n\
    config.hosts = hosts;\n\
  };\n\
\n\
  this.$get = function ($http, $timeout, controlPanel) {\n\
    var defaultOpts = {\n\
      m: 'api',\n\
      a: 'do_e_signature_list',\n\
      c_event_id: 118,\n\
      directory: 1\n\
    };\n\
\n\
    var ctx = {\n\
      server: config.hosts[0].address || 'N/A',\n\
      hosts: config.hosts,\n\
      eventId: 118,\n\
      pollInterval: 1000\n\
    };\n\
\n\
    var stat = {};// service stat such as last_id;\n\
    var server;\n\
    var events = {};\n\
    var init = false;\n\
    var timer;\n\
\n\
    /*\n\
     * List signatures\n\
     *\n\
     * @param {String} host host name\n\
     * @param {Object} opts override default options\n\
     * @param {Function} success callback when success\n\
     * @param {Function} error callback when error\n\
     *\n\
     * Example signatureService.list(successFn, errorFn);\n\
     */\n\
    function list(host, opts, success, error) {\n\
\n\
      if (typeof host === 'object') {\n\
        error = success;\n\
        success = opts;\n\
        opts = host;\n\
        host = undefined;\n\
      } else if (typeof host === 'function') {\n\
        error = opts;\n\
        success = host;\n\
        opts = undefined;\n\
        host = undefined;\n\
      }\n\
\n\
      var server = host || ctx.server;\n\
      if (!server) {\n\
        return;\n\
      }\n\
\n\
      opts = opts || {};\n\
      _.defaults(opts, {'c_event_id': ctx.eventId});\n\
      _.defaults(opts, defaultOpts);\n\
\n\
      var url = format('%s/?%s', server, query.stringify(opts));\n\
\n\
      $http.get(url)\n\
             .error(error || function () {})\n\
             .success(function (data) {\n\
               /*\n\
                *  data format from https://github.com/letsface/signature-cluster/wiki/API\n\
                *\n\
[{\n\
\"id\":\"1241\",\n\
\"orig_filename\":\"signatures/1/1.png\",\n\
\"trans_filename\":\"signatures/1/1.png\",\n\
\"signature\":\"2013-11-09 07:23:56\",\n\
\"directory\":\"1\"\n\
},{\n\
\"id\":\"1242\",\n\
\"orig_filename\":\"signatures/1/2.png\",\n\
\"trans_filename\":\"signatures/1/2.png\",\n\
\"signature\":\"2013-11-09 07:25:28\",\n\
\"directory\":\"1\"\n\
}]\n\
\n\
access url\n\
\n\
http://backend.addr/hphoto/signatures/1/1.png\n\
                */\n\
               // format result for signature cloud\n\
\n\
               data = data.map(function (d) {\n\
                 return {\n\
                   id: d.id,\n\
                   href: format('%s/hphoto/%s', server, d.trans_filename),\n\
                   timestamp: d.signature\n\
                 };\n\
               });\n\
               if (data.length) {\n\
                 stat.lastId = data[data.length - 1].id;\n\
               }\n\
               if (success) {\n\
                 success(data);\n\
               }\n\
             });\n\
    }\n\
\n\
    /* submit signature to backend */\n\
    function add() {\n\
      console.log(\"signature added to backend\");\n\
    }\n\
\n\
    /* get update since last query */\n\
    function update(success, error) {\n\
      var opts = {};\n\
      if (stat.lastId) {\n\
        opts.last_id = stat.lastId;\n\
      }\n\
      return list(opts, success, error);\n\
    }\n\
\n\
    function on(event, fn) {\n\
      events[event] = fn;\n\
    }\n\
\n\
    function poll() {\n\
      if (!init) {\n\
        init = true;\n\
        list(events.data);\n\
      } else {\n\
        update(events.data);\n\
      }\n\
      timer = $timeout(poll, ctx.pollInterval);\n\
    }\n\
\n\
    function reset() {\n\
      init = false;\n\
      $timeout.cancel(timer);\n\
      events = {};\n\
    }\n\
\n\
    function option(opts) {\n\
      _.extend(ctx, opts);\n\
    }\n\
\n\
    controlPanel.add('api', 'glyphicon-signal', require('./panel.html'), ctx);\n\
    reset();\n\
\n\
    return {\n\
      on: on,\n\
      config: option,\n\
      list: list,\n\
      update: update,\n\
      add: add,\n\
      poll: poll,\n\
      reset: reset\n\
    };\n\
  };\n\
}\n\
\n\
exports = module.exports = angular.module('letsface/signatureApiLegacy', [\n\
    require('control-panel-for-angular').name\n\
  ])\n\
  .provider('signatureApi', SignatureApiProvider);\n\
//@ sourceURL=rogerz-signature-api-legacy-for-angular/lib/index.js"
));
require.register("d3-cloud-for-angular/index.js", Function("exports, require, module",
"module.exports = require('./module');\n\
\n\
require('./directives.js');\n\
//@ sourceURL=d3-cloud-for-angular/index.js"
));
require.register("d3-cloud-for-angular/module.js", Function("exports, require, module",
"module.exports = angular.module('rogerz/d3Cloud', [\n\
  require('signature-api-legacy-for-angular').name\n\
]);\n\
//@ sourceURL=d3-cloud-for-angular/module.js"
));
require.register("d3-cloud-for-angular/directives.js", Function("exports, require, module",
"var d3 = require('d3');\n\
var format = require('format').format;\n\
var d3Cloud = require('d3-cloud').cloud;\n\
var _ = require('underscore');\n\
\n\
require('./module')\n\
.directive('d3Cloud', function () {\n\
  function controller($scope, $timeout, controlPanel, signatureApi) {\n\
    /**\n\
     * Format url of built-in images\n\
     */\n\
    function builtInImage(name) {\n\
      return format('build/rogerz-d3-cloud-for-angular/images/%s', name);\n\
    }\n\
\n\
    var opts = $scope.opts = {\n\
      dispSize: [1080, 640],\n\
      imgSize: [64, 32],\n\
      bgImg: require('./images/bg.png'),\n\
      imgLimit: 400,\n\
      blankArea: 0.01,// keep at least 10% blank area\n\
      drawInterval: 2000,\n\
      transPulseWidth: 1,// transition duration / draw interval\n\
      transDuration: function () {return opts.drawInterval * opts.transPulseWidth;}\n\
    };\n\
\n\
    function update(tags, bounds, d) {\n\
      // TODO: remove wrap\n\
      $scope.draw(tags, bounds, d);\n\
      stat.imgPlaced = tags.length;\n\
    }\n\
\n\
    function failed(tags) {\n\
      stat.imgFailed++;\n\
      $scope.$apply(function () {\n\
        opts.imgLimit = Math.floor(tags.length * (1 - opts.blankArea));\n\
      });\n\
    }\n\
\n\
    // TODO: define angular constant\n\
    var cloud = $scope.cloud = d3Cloud().size(opts.dispSize)\n\
                   .spiral('rectangular')\n\
                   .startPos('point')\n\
                   .timeInterval(10)\n\
                   .on('placed', update)\n\
                   .on('failed', failed)\n\
                   .on('erased', function (tags) {stat.imgPlaced = tags.length;});\n\
\n\
    function ImgPool() {\n\
      this.images = [];\n\
    }\n\
\n\
    ImgPool.prototype.random = function () {\n\
      return this.images[Math.floor(Math.random() * this.images.length)];\n\
    };\n\
\n\
    ImgPool.prototype.push = function (image) {\n\
      var self = this;\n\
      var img = new Image();\n\
\n\
\n\
      img.onload = function () {\n\
        self.images.push({\n\
          img: img\n\
        });\n\
      };\n\
\n\
      if(/^https?:\\/\\//.test(image)) {\n\
        img.crossOrigin = 'Anonymous';\n\
      }\n\
      img.src = image;\n\
      img.width = opts.imgSize[0];\n\
      img.height = opts.imgSize[1];\n\
    };\n\
\n\
    ImgPool.prototype.merge = function (images) {\n\
      var self = this;\n\
      images.forEach (function (image) {\n\
        self.push(image.href);\n\
      });\n\
    };\n\
\n\
    ImgPool.prototype.reset = function () {\n\
      this.images = [];\n\
      signatureApi.reset();\n\
    };\n\
\n\
    ImgPool.prototype.getLength = function () {\n\
      return this.images.length;\n\
    };\n\
\n\
    var timers = {};\n\
    var imgPool = new ImgPool();\n\
    var stat = opts.stat = {};\n\
\n\
    /*\n\
     * rest to ready status\n\
     */\n\
    var reset = opts.reset = function reset() {\n\
      _.each(timers,function (d) {\n\
        $timeout.cancel(d);\n\
      });\n\
      timers = {};\n\
      imgPool.reset();\n\
      stat = opts.stat = {\n\
        imgFailed: 0,\n\
        imgPlaced: 0,\n\
        imgInPool: 0\n\
      };\n\
    };\n\
\n\
    function step() {\n\
      if (stat.imgPlaced > opts.imgLimit) {\n\
        cloud.removeImg(stat.imgPlaced - opts.imgLimit);\n\
      } else if (imgPool.getLength()) {\n\
        cloud.addImg(imgPool.random());\n\
      }\n\
      timers.draw = $timeout(step, opts.drawInterval);\n\
    }\n\
\n\
    // start cloud layout\n\
    function start() {\n\
      // TODO: fix the ugly callback for image async loading\n\
      var bg = new Image();\n\
      bg.src = opts.bgImg;\n\
      bg.onload = function () {\n\
        cloud.setBgImg({\n\
          img: bg\n\
        });\n\
        cloud.start();\n\
        step();\n\
      };\n\
    }\n\
\n\
    // run simulation\n\
    opts.simulate = function simulate() {\n\
      reset();\n\
      imgPool.push(require('./images/1.png'));\n\
      imgPool.push(require('./images/2.png'));\n\
      start();\n\
    };\n\
\n\
    // connect to remote server\n\
    opts.connect = function connect() {\n\
      reset();\n\
      signatureApi.on('data', function (data) {\n\
        imgPool.merge(data);\n\
        stat.imgInPool = imgPool.getLength();\n\
      });\n\
      signatureApi.poll();\n\
      start();\n\
    };\n\
\n\
    controlPanel.add('cloud', 'glyphicon-th', require('./panel.html'), opts);\n\
  }\n\
\n\
  return {\n\
    controller: controller,\n\
    scope: {},\n\
    restrict: 'E',\n\
    link: function (scope, elem) {\n\
      var sky = d3.select(elem[0]);// cloud must be in the sky :)\n\
      var opts = scope.opts;\n\
\n\
      scope.$watchCollection('opts.dispSize', function (value) {\n\
        var svg = sky.selectAll('svg').data([value])\n\
                  .attr('width', function (d) { return d[0];})\n\
                  .attr('height', function (d) { return d[1];});\n\
\n\
        svg.enter().append('svg')\n\
        .attr('width', function (d) { return d[0];})\n\
        .attr('height', function (d) { return d[1];});\n\
\n\
        svg.exit()\n\
          .remove();\n\
\n\
        var offset = [value[0] / 2, value[1] / 2];\n\
        var g = svg.selectAll('g').data([offset])\n\
                .attr('transform', function (d) { return format('translate(%s)', d);});\n\
\n\
        g.enter().append('g')\n\
        .attr('transform', function (d) { return format('translate(%s)', d);});\n\
\n\
        g.exit().remove();\n\
      });\n\
\n\
      scope.draw = function (tags, bounds, d) {\n\
        var g = sky.select('svg').select('g');\n\
        var images = g.selectAll('image')\n\
        .data(tags, function (d) { return d.id;});\n\
\n\
        images.exit().transition().duration(opts.transDuration()).style('opacity', 0).remove();\n\
\n\
        images.enter().append('svg:image')\n\
          .attr('xlink:href', function (d) { return d.img.src;})\n\
          .attr('x', function (d) { return -d.img.width / 2;})\n\
          .attr('y', function (d) { return -d.img.height / 2;})\n\
          .attr('width', function (d) { return d.img.width;})\n\
          .attr('height', function (d) { return d.img.height;})\n\
          .attr('transform', format('scale(%f)', opts.dispSize[0] / d.img.width))\n\
        .transition().duration(opts.transDuration())\n\
          .attr('transform', function(d) {\n\
            return 'translate(' + [d.x, d.y] + ')rotate(' + d.rotate + ')';\n\
          });\n\
      };\n\
    }\n\
  };\n\
});//@ sourceURL=d3-cloud-for-angular/directives.js"
));
require.register("d3-cloud-for-angular/images/1.png.js", Function("exports, require, module",
"module.exports = \"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABDgAAAKACAYAAAB5WcitAAAABHNCSVQICAgIfAhkiAAAIABJREFUeJzs3V2s5Vd55/nf47JdDhgIxoPptqE1TUjHBdHkJgy2CzdRp2GkDMqLi26NWhqNNJi3KAllK5mZKJdRpEnGZTLpONBw1VJfEJehR+6Lbjoa0i6XHYWbmSa2UQiR4pcE92A7xjapU+ec/czFXru869TZZ7+tZ738/9+PZGFcp9Z/nf3y/6/1rGc9SwIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIJq7f9Pd99x9kv7Zq90nAAAAAABysNodQDx3n2j5ez0xs2Ml+gMAAAAAQG5X1e4A4rj7a+7uWi2QdZVPfTO6XwAAAAAA5EYGx0C5+66kqzf86xfM7Idy9gcAAAAAgEhkcAxQysLYNLghSdfl6gsAAAAAACUQ4Bim923bQKrbAXTP3e9299254rq77n5b7X4BAAAAyIstKgOz5daUg9iqgi65+4OSfl7SssK5FNcFAAAABoIAx8CseGLKqpj8oSspM+Oclgc2DnrezN4R0CUAAAAAhbBFZXhyBq0IgKEb7n6fpPNaP7ghSTe5+07mLgEAAAAoiADHgLj7ucxNEuBAF1Jw47S2+8xe6+4vZ+oSAAAAAGBT7n7BM6v9OwHLuPunUvHQXD5d+3cCAAAAsD5W6AfE89bfkCSZGZ8RNC3gc+9mRnYbAAAA0BkG8QPh0+0puYMRZHCgWe5+W0RQT5K5+zOZ2wQAAAAQjNX5gXD3C5KO526WlWy0yKenpZxX3D2Mzz4AAADQGQbww3FtQJucKoHmFAhuKLhtAAAAAAEIcAyAu59VwPYUM/uhzG0CW/HXj4IND0CkQAoAAACATrBKOQDu/oqk6zM3+4yZvStzm8DGPM9RsOv4L2Z2U6FrAQAAANgSGRzD8MaANn8roE1gIxWCG5J0XcFrAQAAANjS1bU7gO24+xnFbE/5fOY2gY24+xOSblX5jLPdwtcDAAAAsAW2qHTO3XeUv8Ao21PQhBTcOFHp8i+Y2Y2Vrg0AAABgTWxR6V/E6SlsT0F1lYMbkvSmitcGAAAAsCYCHB1z909FNMv2FNSWam7cWrkbf1v5+gAAAADWwBaVjrn7vvIHqV41M1auUU2lgqJXMDPujwAAAEBHyODoW8QE7IsBbQIraSW4AQAAAKA/TCI65e63SXosd7NmRtALVbj7NyW9r3Y/ZsjgAAAAAPrCZLZfXwpo0wPaBJZKAbtmghuSXqndAQAAAADrIcDRrx8NaPOrAW0Cq3i0dgcO+M+1OwAAAABgPaRgd8rdJ8r8/pGSjxrc/RVJ19fuxwG3m9njtTsBAAAAYHVkcHTI3c+J4BQGwN2fUHvBDRHcAAAAAPpDgKNPPxnQ5ksBbQILpRNTTtTuxyGoRQMAAAB0iABHn64NaPNnAtoEDpWKip6u3Y8Fdmt3AAAAAMD6CHB0xt3PKP/2lD1S8lHYo2p0m5WZHa/dBwAAAADrI8DRn/8xoM0/D2gTOJS7f0/t3nvYngIAAAB0qtVJBha7IaDNjwe0CVwh1d14W+1+HOHF2h0AAAAAsBkCHB1JdQtyp/U721NQQuN1N2b+de0OAAAAANhMk3vgcbh0pGbuUyeeMbN3ZW4TuELamtJy9oabGUFfAAAAoFMM5vvy7oA2zwa0CVymg60pknSxdgcAAAAAbI4Mjo64+0R53zNWrFFEwGc3wqNm9sHanQAAAACwGSa3nQg6HpYVa4Rz9121H9yQpF+r3QEAAAAAmyPA0Y//OaDNbwS0CVySCoteXbsfK9in2C4AAADQtx5WVSHJ3T13m2bG+49Q7r6vPgKpZ83sY7U7AQAAAGBzTHA7ERDgmJjZscxtApek7I3z6uA+Q7APAAAA6F8PK6ujl+pv5PZcQJvAvK+rg+CGpOzZUQAAAADKI8DRh18JaJPjYRHG3T8l6XjtfqzojtodAAAAALC9HlZXR4/jYdEbd39F0vW1+7GCi2bWSyAGAAAAwBGY5ALIKtXeeGPtfqwoIjsKAAAAQAVkcDTO3c9KuitzsxQYRRh3f1rSO2v3YwU7ZnZd7U4AAAAAyIMMjva9P6DNXwxoE5i5pXYHVvTZ2h0AAAAAkA8ZHI1z911JV+dskyMxEcXdH5R0qnY/VkD2BgAAADAwZHC0L/dWkr3M7QHzPlq7AysiewMAAAAYGAIcDXP3M8qfZfPnmdsDJF0qLtrDiSQvmNnna3cCAAAAQF4EONoWker/ewFtApL05dodWIGrnywTAAAAAGugFkPDAupvuJkR1EIId5+o/XvKOTO7s3YnAAAAAOTHZLdtuetvXMzcHiBJcvdPqf3gxoTgBgAAADBcBDgaFVR/4zuZ2wNmHqjdgRVwPDIAAAAwYAQ42vWRgDb/Q0CbgNRH9gaFRQEAAIABa31SMlrufkF5T6Sg/gZCpGyj07X7cRQz414HAAAADByD/kYFFGzcM7NrMrYHSJLcfUfStbX7cYRnzeydtTsBAAAAIBYr+u3KHXz6m8ztATMtB872CG4AAAAA40CAo0Hufjag2Yg2MXJBxXBzcbKWAAAAgPFodWIyau7+tKSsq87UIEAEd39F0vW1+7HAGTO7t3YnAAAAAJTBpLdB7r4r6eqMTU7M7FjG9gBJIbVicqHuBgAAADAybFFpU+5gxEuZ2wNa3p4yIbgBAAAAjA8Bjsa4+6eUf9L4VOb2AEk6VbsDh3BJJ2t3AgAAAEB5BDja8y8C2vy1gDaBm2t34BAPmdnjtTsBAAAAoLwW08tHzd2/J+ltOZs0MwJZyM7dvXYfDnjBzG6s3QkAAAAAdTDxbc9bM7e3n7k9QO5+rnYfDtghuAEAAACMGwGO9uTOqnk5c3uAJP1E7Q7McUk/VbsTAAAAAOoiwNGQoAKjf5y5PUCS3li7A4lLuoO6GwAAAAAIcLTlpwPavC+gTYyYu9+mdur33E9wAwAAAIDUziQFosAo+uDuZyXdVbsfki6a2fHanQAAAADQBgIcDXH3PUnHMja5Z2bXZGwPkLvvSLq2cjf2zezqyn0AAAAA0BBW99uSM7ghUWAUMXIHN9Y9bnaX4AYAAACAgwhwDNsf1+4AkNlrZlY7ewQAAABAgwhwNMLd/zCg2T8KaBMj5u5nApqdrPhzr5rZ9QHXBwAAADAA1OBohLvvK2/AiQKjyM7ddyXl3h6yt0KbO2Z2XebrAgAAABgQJsAAVuLuDyp/nRiJ4AYAAACADCjUB2Apd39C0omIpnV0JhnBDQAAAAArIYOjHbm3C617MgVwqLngRsRn6qg2nyO4AQAAAGBVZHA0wN1vU/4Ax1czt4cRcvdXJM0Ke0bU7Jno8EDrk2b23oDrAQAAABgoiow2wN3PSrorZ5tmxnuLrbj7BUnHK1ya4AYAAACAtbFFpQ3vz9we21OwMXe/rVBw4+Dn1CWdI7gBAAAAYBMEONrwhsztEeDARtJ2qfMqk7nhB/79fjO7s8B1AQAAAAwQAY42vDVzey9lbg8j4O73aRrcKLW9yef+934zu7fQdQEAAAAMEEVG25B7Qvl85vYwcO7+oKZ1YBZ9FvclHct92fTPHWb2eOa2AQAAAIwMAY425A5wPJW5PQzY3DGwR4k4xnhf0p0ENwAAAADkQICjMnc/k7tNMzuVu00M0xrFRLNvWzGz63K3CQAAAGC8qMFR37syt0eBUSzl7ne7+0R1joGVpBcrXRcAAADAQJHBUR9HxKIod/+upJsqd4M6MQAAAACyIsBRX+4jYnczt4cBcfd9bZa5RZ0YAAAAAE1ji0p9uY+IfTVzexiAuS0pTXznqRMDAAAAIDcyOIaHlXFcxt0fkXRSAYVCN8Q2KgAAAADZEeCoL/eKOrUNIEly99skPaL2vucEOAAAAABk10S6OrK6r3YHUJ+7PyjpvNoLbkjUiQEAAAAQoMXJz2i4+5ncbZrZ47nbRD9S1sbXJF1fuy9HoE4MAAAAgOwIcNT1rsztkfo/Yg3W2liEbVQAAAAAsiPAUdf7M7dHgGOk3P0FSTfU7seKKIQLAAAAIDtqcNT1hsztUdtgZNz9XDr+tZfghiT9Ue0OAAAAABie1lPZB83dL0g6nrHJF8zsxoztoVGpiOhd6vA7bGbd9RkAAABA+9iiUtc1mdv7Qeb20JhOiogCAAAAQHEEOOrKvZL9p5nbQ0M6KiJ6FOrEAAAAAAhBDY66ep6oohB3v9vddyV9UHxmAAAAAOBQTJYqcvesq9nUNhged9+TdKx2PzLaM7PcW7MAAAAAgAyOWtz9TO0+oF3u/u0UABtScEOSXq7dAQAAAADDRA2Oet5VuwNok7vvSLq2dj8AAAAAoCdkcNRzU+b2KN7YOXe/z90naiu4sV+7AwAAAACwCjI46rm1dgfQDnd/QdINtfsxxyU9J+kdmdt9PnN7AAAAACCJDI4h2a3dAaxvLmujpeDGnqQ7zOydyn+PeCpzewAAAAAgiQyOmt6Sub1XMreHQO5+m6R/p7YCGy7pKTN7b+2OAAAAAMC6yOCoh5XxkXL3ByWdV1vBjYmkTxLcAAAAANArMjiGg9oGjUtZG1+TdH3tvsxxSX9tZrfU7ggAAAAAbIMMjnpyv/ZPZ24PGc1lbbQU3JhlbRDcAAAAANA9MjgGwszuqd0HXCllbXxd0vHafZnjkr5lZidqdwQAAAAAciGDo4I06cXAufsjmmZttBTcmJ2QQnADAAAAwKAQ4Kjj3szteeb2sAV3v83ddyV9UJLV7k/iks6a2TVm9njtzgAAAABAbmxRGQYCHI1w92ck3ax2AhuS9JKZbXpiS0u/BwAAAAAsRAZHHTfV7gDycvdvu/tE0i1qJygwkfSJLYIbUubfxcxO5WwPAAAAAGbI4Kjj1szt7WZuD2tw9z1Jx2r3Yw5FRAEAAACMDhkcw/Bq7Q6Mkbvf5+6utoIbE1FEFAAAAMAIkcEBbMDdX5C0zdaPCDtmdl3tTgAAAABADWRw1PHWzO39IHN7WCBlbUzUVnDDJd1OcAMAAADAmJHBMQx/WrsDY9Bg1oZLesjMPla7IwAAAABQGxkcwBLufpu776qt4MZrmtbaILgBAAAAACLAUUsrx4hiCXd/RtJ5tZPt5JLOmNn1ZvZ47c4AAAAAQCtambSNTe4Ax32Z2xs9d79P0mm1FYx6ycxayiIBAAAAgGaQwTEArOTnk7ajvCLpHrUT3JhlbRQNbrj7bSWvBwAAAADbIIMDSNz9EUkn1U5gQ6qbtXFv5vYmmdsDAAAAgEvI4CiMVfH2uPvd7r4v6YNqJ7gxkfQJtqQAAAAAwGrI4Cgv96q4Z25vNFKw6bzaCWpI0/fzr83sltodAQAAAICekMHRPwIcG3D3C5IeU1vBjYmkTxLcAAAAAID1kcGBUXH3JyTdqrYCGy7pW2Z2onZHAAAAAKBXZHBgFNz9CXefSDqhtoIbe5LuILgBAAAAANshg6O8D2Vuj5MpjtBoxoY0zdp41MzurN0RAAAAABgCAhz9e7l2B1rUcGBDmgalTprZ47U7AgAAAABDQYCjvGtqd2Co0qkofyjpZrUZ2JCk583sHbU7AQAAAABDQw2O8q6v3YGhcffb3P0FTY98vUVtBjcmkm4nuAEAAAAAMQhwlJd78v2WzO1140Bg4wa1GdhwSc+Z2TG2pGCM3H3P3Sd+uUn6Z9fd76vdRwAAAAwDAY7yck/CR/cedhLYkKSXJH3SzG6p3RGgJHe/29333d0lHdOV31FL/1wt6Z4U9Ngt3U8AAAAMCzU4ynPlnZCP5hQVd/+mpPeq3YDGjEu638zurd2RxrT+vmFLqQ7Of9JmtYauTkc530G2EwAAADZBgKN//1ftDkRLk6Zzmq4Et+4lM7uhdieA0tz9zySd0HaBLJP0mLv/mZn9eJ6eAQAAYCxGt72hAV67Az1x92c03YrSenDDJZ0huHEkMjgGKG0Zu6C82VXvy9QOAAAARoQMjvKY5K3A3Z+QdKv6eL2GmrXxwdodQNtSdtV5BXxP3X3PzHhGAQAAYGVkcJSXdSJgZqdytlebuz+Y9uFvm+pewkTDzto4V7sDaFdkcCM5lq4BAAAArKT1CeTgpFMFsjGzQbyH7v6gpF9QH0E3l/QtMztRuyPR+LxikRSIjH4/J2bW+vY0AAAANKKHySQGLB0nuSvplPr4PF7U9JSHwQc3gEXSd7ZEsIqAGICs3P0+d9919z13f612fwAAeTF4LIwV8amUev51Scdr92VFozz6lc8rDiqUuTHvdo6NBbCNVLD8lmU/ZmY9LLQAAI7AZKMwJoySu78g6a3q5/O3Z2bX1O5EDXxeMa9CcEOSvmJmdxW+JoAB2LBW0LNm9s6gLgEAghGpLsjdz+RuMnN7odz9kTRBukHtBzdc0nM2NcrgBjCv4LYUANiau39C0mNa/751i7vvB3QJAFAAAY6y3pW5vS4CHGm/676mx462PkFySS9pWmdjWTorMArufkH1jhV/e6XrAuhUytz4whZNXOXuO7n6AwAop9aAFSNQ4BjJnFzS30r6Gfb7A1ONfIf/S8VrA+jTYxnauNbdbzezHG3hAHe/TwsW/szsY4W7A2BACHAgREpn7+HzRWDjaK6Mk1t3P2tmp3K1hziNBDck6a8qXx9AR9L4I5dHRbbzxtJz5KuSbtR0PHGVps+UI58rc/W/PP2za2bXBXYVwID0MAFFR9z9QUl3qf6kaBkCG6vJGuBAHxoKbsjM7qndB7TH3e+W9OFD/ugM9/TRyzm2rX4P7EV6btwj6Z9I+mHlee1mwZDjKeixL+l3x3aiHQA0y93Pel7NFMFy99vc/ULm3y/CxN2f9OmDGEu4+37m1/9s7d8JR/Ppd3mS+X3fWO3XA/W5+93u/rKv97mcpH++Xbv/KMfddwNuQ1+p/Xu1yt0fdPdX1/xu5rDv0wU1ALgCGRzYmrs/IelWtb3S4ZK+ZWYnancEaJU3lLmREOAYqfRZ/JI2f7bM/s6P+PT0ruck/TOyOwYvYlz7MwFtdsvdz0n6SUnHK3bjKkmnfLod6U6+1wDmsa+wrPdnbm+Sub21+HRVbV/SCbUzITrIJT1lZlcR3ACWekRtfZe/WrsDKMunGUR7mgbacj1bTNItkh5z91ecDL5BcvdPBTU9+sXANN57NQULT6pucGPe1ZLOk80BYF5LA9nBc/fvSXpbxiZfMLMbM7a3Mnd/RtLNavcz5JIeM7OTtTvSM89fLPYZM8t9XDIy8OlRsK0MWiVJZtbq/QUBAu43Cy8laWJmg5+4pmDOv5f0pvSf5r9TrulCyTfMrPugj7s/qWnGT/amzWyUC4IpcPBRNfZsWOD7ZvaW2p0AUN8ob9jYnLvflyL4t6jd4MZOytgguLG9lzO394bM7SGDFoMbki7W7gDKSFkbE5VbKTdJx9Je/kHW6Eiv6UVNM2HerMNPrjBJxyR9IGXN9O7HandgKNx9z91d0im192xY5M3eUG06APUMfvUC+bj7C5JuqN2PBVzTVZZjtTsC9MTdX1GbA9hfqd0BxHP3+zQ9eaGWH3H3XTO7pmIfstowYHksTWj/zMx+PKBbJUQturS6mJOdu39X0k21+7GFq9x9MtaMGwBT3ACwlE+rZE/UZnDDJT2XMjYIbgBrSAWCr6/dj0NcNLPP1+4EYrn7I5JO1+6HpKvdPXe2WnGeTmrTdgHL9+XqT0nBdVUGX+x4rqZaz8GNGUvb3QCMFBkcWKjBExXmuaS/lfQzVM8G1peCG60W3iV7Y+Aa/Py92d0vmNl1tTuyrty1SzpdAf9S7Q70qoOaapu42t2fMLP31u4IgPJ6e4ChkDRgekxtPvBek3SHmd1AcANYX9oWEFGMLwuyN4YtZW60FNyYOZ62d3TB3b+bMjZyL1b1uAL+jwLbHmQGx1zWRss11bZxIj3rAIwMAQ5cZm47SovZPRclfcLMriewUcwPMrdHhfPK0lGKp9XugPYvancAcdKEo+UC0MfTinaz0nM6ejtBi2OAQ6VsU7aoriFlUH1Bw58HnOZYaGB8hn5jw4rmIvmn1N7EZyLpjJkdN7Mv1u7MyPxp5vYYhFaUBnoPqL3v+Myemb2ndicQo4Pg2swtaQLYlLnAxikxfpsXvT2l9c/rWlJh6RMa2O+1gEl6uHYnAJTFA3LkUmDjgqR/pfY+Dy7prJkdM7N7a3dmpH42c3tjGFC17FG1+x64pDtrd2LI3P3b6fjHiV9ukv57WGZcB8G1g060sl2lVmCj9UyWOT8a3H4vn9kjpaOD99VmYelIN5DFAYxLaxPaocudnv/8pn8xPehe0DRFsbUjIudPRvlY7c6MHPeIgUiTtZbfz6fYehZjbuvhj2iaRXVwwmbpv38gTYAitFrT6SjHa06MGsjY+PsVrrmWlBXUzXaaWtLWsPNq+xkQxUQRWmBUehtsdC0NVHI+XB4ys1Mb9OMJTQsMtvj+vybpnzLRaYO7Py/p7Tmb7LA6f/fSSuwttftxhAnHPMfY4oSNPzOzH8/Uhz31uz2t+D2roder+e+luz8t6Z3R1zGzFsdLK0lHIL+5dj8qG9TYI2XbvV/TcfzBz6ZL2jeza4p3DGjEYL7sWG5uFa/FvZcuCoi26FztDmA76cSKloMbkvSLtTswNClLb5uC0e/LUYciTa6aniQvYSngEG7uVJRWXq9J7Q6soMi9rdctDmlhbezBDWn6Pf527U7kkO5HH9B0DnfYWN40PSbXO9pmBmRFgGME0kD3gtosICpJO2k7CgVEh2+Qx+21Kg1uPli7H0u8YGafT/epc+6+6+77c3Uhvlu7g53KsSXkRAqQbSSlxb9pyz604Ji7PxjVuLvfV+BUlE38y9odOEranlJqTNNVHbD0mXIxzp/3D2t3YBvu/vgGAdBbSgVogZawb7Gs4sGFlJ582J7rFkwknSRjA8gvrTi2nrkxkfTDadB2mGOSbpr78x0zu65M1/qVMjdyOenut617n06fvx5OTFnVXZu8DkdJr9HX1GjRRzM7XbsPS/zmEX/mGs5nby1z25Bxud4/Dx/Y8O8dc/ddtqxgTIjslpX75rpwZfZAenJrN/WJpttRjhHcAMKcr92BJfY0fQatsxp1PPPkfXDSlpCc93yT9PUN/t4jmftRm2l6ClEWKTPmvBoNbqiPbLsbCl6r+YDBXLZui9uQF3FNx4QTxX/menlNrpCh+DML2hgVAhx9u/Gw/5gecC1WrHdJ51Jgg+0oQJCUktra93/eNrUh7IiMj1FLW0Ii9tsfd/dPr9GPZzTMAfVVaevUxvUY0tHs+5ouULT8Hd2t3YGjuPsZlX39Wts+dJm5U1JaOxXvoImmwe0zNnVVGhMeS/9ukj6hPgJsRbj7jjLM11gcwJgQ4OjbVw/+h3T0a4sPuIuS7jCzO2t3BBiylJ7cSpHCw2TZF85g7VD3BLb9uVV+KE20bg7sR20m6Xz6PVeWAhsXJP0rtT/2cjNrcRwx7+4lf557gtzs65ECiveorYCZS3pJ0kOSbrfXHTOza8xsYU0TM/ti0Ikn3QVNUjD12kzNmbt/M1NbQNNaf8gOTdjNNaUm7qtsyuYqXNJZMzvOdhQgViqEeKJ2PxbYV9598ZZqDEGSu78SfIlVB9ml6m7s2QGSdgpcV5r+fvekIrgLT5qaL5iraWCj2UnyAZ+p3YEVvHHg11tqbktKK7WWJpKe0jSgcZWZ3WBmp7YY+z2ZsW/dScGN3FtNWx0fAFkR4BiAudTE1t7P1zTN2vhY7Y4AQ5dOFLirdj+OsOhIu20McRvE2tJAOLyWw7KAkrt/T/HBDdd0AnVFwbxUgPZ2lVupPaZpEdaZydwJQK7p5zOhsua/AAAgAElEQVTicx9pz8w+X7sTR0lBpWWvae7PQFPvobvfrXa2pOzq9bpqJzIuZuWue9JNBsdccCP3566pzzEQpbUJ8dBlv7k2WqneNd1feT1ZG0C8dB94QG3dB+ZNFNQ3sjgklSsou3DMkALtbwu+vkv6zFHPFTN7PKW319jCZOovoDGvl5MWNj1NYivb1F7JKX3XvqD6nzPXNLBxbe66aum1rv37VREY3FBQm0BzWP0qK/eN5b2KuwluwiX9tZm1ki4JjMXX1c594KB9xdYEabneSDh3/7bKvfdHXafEkaL3r5FdcFJtPR9b52aWa69/mDT5W2XsGnFf+LeqXGw0nb5zUnU/1xNJf2lm7wm8xiMBbb4U0GZWwcENYDTI4Cgr5w1rIukfZW5zGy7pkwQ3gLJSgbkW0pQXiX7OtHIPrOXdBa9l7n724H8sdGrPxaMKEx6Usjx6qCXRApd0R+1OrOjLFa996Ml1paQjoGuevjOrqXYsOLghxQSongpoM7fo4EY323SAbRDg6M+eXj+FoJWB/U4qKMXRr0BBqahoy0HFsK0p89KRkaOT6q6Ufg585EAfnlZ8Fs1Gp3qkbI+LAf0ZEte0VlYv20nXud8NZjKXgogRR0CvakeFaqoFbk/5tYA2s0kFY0vUMAIGjy0qfdlTO++ZS9rvZL8uMDgdFBUteb/6B4Wu05qVjm7N7OBpEu8Mvp5vc2SkmR1PdVpaeXa2ZLeHbSkzKZC5zgQw56lNytzWylJwo+ZWvOcKZ+d+KaBNbzmIlwo0l8jEfLnANYDqyODox0TtDNAuarodheAGUEEHRUWldu5Xg5Q+AzW2Jl36zBUo8Jpl60R6VtUoOtqySU/BjWTdLUfZT1IpnS2WtqXUCm7MtqSUzhLMfXqKJL0a0GYW6T4aXaBZkmRmN5S4DlAbAY72zW9JqW2i6ekox9mOAlTVclFRqfBk0sxazmSJ8nCtC7v7mZRBFDnxWnpiypo+J9KzLzGzHovzrhuQifgdfzmgzUO5+xOqty1lVlctfEvKZRedbruMeLZ9ZPmPlJeKRJdaDPi7QtcZDHe/z9330tHfE3ffTUc0o3EtD5AHx93XHVzN9q/Xfp8mkr5S+kGH+lJBwZyTx0mnA+tmpEHvidr9OMJsO0Cp+9ZWWxh65e5F6pss8JKktyg28H7OzO7M2WAH350Sequ5Iamt987MStQVelDSqejrLLq8Kn1G3H1fAfeVEu/ZJjaYF2x8qTE+JzeRgk7v1vLn676ZkanaKN6YNs32W9a+Gbmkb5lZE4MKYOzc/T7FpO/mMtvzXnIwObpV+TTZqzlgjw5uvJo7uCFJZvZed78oaczbK5/qLbiR/FjtDsy4+4uRqf7pPl8rK63apC0dgRtxX9kLaHNrqbZKKZ8ueK1urVnv5lhaaOguYDwGtSfQuNK+pl+umoNXl/RSOhmF4AbQgFRz4bTqZ3Qt4pL+o8oHzs8Xvl4Lak/2oo8x/HBU46nuxFjrcTxrZu+t3Yl1pe1QLY1Xfziq4cr3+WcrBjdu0/QI3AjZg6XbSkGsUtmsr5rZFwpdq0vu/s2UTbPue2KSHnP3bwZ0C1to6YGB6aCrheDGJylEhCCtTs570Hrdjfsl/ePSF41Y6W9ZI5O9yM/h/dGrYSPdJrdjZtEn3kR5oHYHDrD0PYxwXuXv87uSbq/8+Xg0qN29RlfXTxe8VljAeAhScO19Wzaz7d9HZi0PlgfniL12s5So2u/HHiejYF7A8YrsA91ASt2NWt3K4XlJ51Rhz3ire6ujuPuO1i+22IsXzOzGUherXMekpC7rbswUrFOwjh0zuy5ng+mo0CKnacwuqemWpapZPe7+XUk3BTX/qJk19ews/D4z5loi43OAGnMN4UNf357KFuQ7jGsavSe4gYNy3yPGMJnIKq0UnqzdjyPsmdk7JP1chWuPcavBUIMbXjK4IUlp4L9T8pqVhGfFRHH3c7X7sMDxnFkcqaho6eDGJxsIbtymuOCGNxjc+JSkkhnS6x6tPCqpqG2ucelV7t7lfXaImGwUdMgqRAuZG9lXITAc7v68pLfnbJLVhPVEVZU/YLLhNSZmdiwN2v4gc59WUXTFv7ZCn4Vank+BsuLSfviW69ts49mOt6a0/pnPkvWaJvklt6a8ZmbXF7rWkYLf3+aeDwFZsUfZTTWHcAh3f0bSLZmbJYujEa0+NMZgovqZG+cIbmCJVlfPRiE9gKPv077hNXbnHuSfy9ifdfynStetZYgTcGk6KKwS3JAkM7s3BV5fqtWHIJPOgxu3qe1x6tUp82Jbj6jMd9slPdlQcOOCYt/f3whse23ps1KyiGvxmli9SPeW3MENabjP6O60/OAYsk1XS3NxTYMboyrOh43kPpJ0jFsKNpJWlSMewJddRps9kCezlaE0UKi1SvR/VLpucWlwPNTBUxNbsFJx7U9oOPepWoHHXB6u3YEVbFV3KNWfKDHpdU23KjVxik6qQ3E88BI7Zvb5wPY3UfLo316Pgy7lsaB2h/qM7g5vREFpi0oLwY1ui42hrIBiWM2ljLaqQAFE1/RY6nUH15fdQ9z9aUlVVonHVGA0rXZGTghqqbY15SgpoPRzip98bhpkXKb7ouEdFYHd3/R41UIFVJsa97n7E5JORF5CDf2+UpHf+bLLsRV4MXd/QYF1UMY0LmkZX4Cyau8l3VNjN30AV0qBpVaDGwcLFkZnmSwylFX2pVKNkyEGN15tMbghSWb2sRQg+ISk5zT97Ofkkl5T3Pe86wzNVFy0l4nCMXf/9rp/KdWfKKGZcV+hif6Lrfy+c3Jnwx7lKwWv1RV3P6uyRV5RCQGOQtJe+pqFZy6Y2TUN3vQBzElbU0pU099kxfEhM7t39n/c/YzqTULGdC/7zdodCOCSPly7E8uY2RfN7Ja0Inq7pgsF6wQ7ZpmbO5rW+Ljdpq6S9IbsHZ7aG8Cz/vbaHVjTu9f54YL1Rf6slc9CoeCGS/po8DXWkn7vUs9JN7Pix7X3wN2/qfhtQi0eaT1KvUTHu5YeZFH7vVbRfaoq6mCLSnkNp2VfcRpDzb6OKQ204c/ENgZTByoFJf/Bgf/8V/PBwEP+zoPasn7DoqZ7T08PPJVpT9OgQtTrs/KJNQHP1isuofFlbkgN3lcK378/3WDtkSYU2g7GKSqNGNqAqUmVB6ddHxGHughwlFVg0LupQ4+TLjRgONRYAhyF926XMvqge2BNlbNm9rGAdotx91ckRZz0cbukexQTWJKmQYXPLJtgFjgWtrXgxsuS3lziWq09Fwrfv180sxbHD9UVPG76B2b2xgLXwRJdR/l74O47qhPc2Nc0FZbgBtCBtGrZ4uDEFwQ3XqzRmWQ09Tck/VjtDmTm6rw+xLbSBDciuDEZQHDjNkkRE4QdM3s8vT5R9w+T9Psr/NzDig1uHKyTVI2776lQcEPSXxS6zjpK1t747wteqxspwFZivjshuNEOAhyB0oO69CqVa7qCc3UrDzgAK3mgdgcO4ZLuWPBnbynZkQN+t+K1i0k1Tob2nH6UZ5O+HNTuEIoLfkkxk//5I2cjX6erUgbKUSKLHN5/1Naoktx9V+Vqz+2b2XsKXWslhWtvXOS+eqW0FbBUgK2J484x1VQq19BUSDffk3QnNznkwhaVMtJAMPo4ynXNVgKvGCxXrivUfY2BVQ3waFj2Jyts2+ogvhelXpsC361Da0EEb1loZktyqktzT6nLtfjZL7g9vcnfv7b0GTytMu/BS2bG6SwN4QsRJE0ASn3YXdOHKaekILe3Zm7vqcztdS/dK1oLbkjSU0esBH6paE8ud7HitYtJn4tra/cjs1+s3YHaAo8/7f7emlZbI16bZw/5b59V7IkHJ9ME66CoLQuTsQY3tDjLsJq0LaLUInJzv39t6flZKrixT3CjPWRwBCmYvTGRdJLABiIEFGZ6iCPMLtfoCRlHZtpUzjh51Mw+WOnaxQSs9E5Ud1GD7C1dqkmQO4tlECu4QfeVhQU3U4206CDi7bNrB54OIzVyekaBAqoHNVlUt2AB7otmNqQsv62V/gy2VtgWU90/EBtWIprnZnaM4AbQp8AVy23srDARrbXNwMcQ3EhKFqeL5gQ3Lk1wI747NQv+ZpFem4ig6cLaBIUmho+lCZck/XrQNSYjDW4822hwY7/QpV4guHGoP1S5z+Dzha6DNRHgCJBOF4j+cu0PYcUGGLm7anfggENPTLnsB+JS7FdRauBYVVDgq2Yg7dGK125JVCHh3whqt6TfCWp32WteYsvb+fS/t0Q03lBdm5LBjZ1WtuTMc/dnVO7EjtEHjQ9KmY8h37NDXDSzdxS6FtbEBDlG7roF81zTYqKtPNAAbCBtY2spe2PVvcw/Ed2RI/x5xWuX9HO1O5DR5LBii2OTVrcjvu97LazeZxBxvOLEzI6sBZFWwKOPnba0HSbi/f9+QJtrS0VbSwY3jgzE15C+41GTaz/w75zYccCCbZ1R322X9CtBbSMDAhyZzaUihjSv6QpmiwUJAawopWO3VJRq4T71Q9Q85/3jFa9dRGDR2ehJ3CKfq3Td1vz7oHb/JKjdYgKP0/zWij93UrEFR6WYWh9uZjWP65a735a2ZJTaKuGSfqrQtdYVmanmc/97P1vTL5eyHg+rWRU1z31xIIHlwWpp9XAQAooyXmpaB4IbFLZBNIqMxmjsWNiFx8Fe8YN1j4dtctUut8Cis69Kuj6g3aOM4j1bBUfDLtbCa+Puj0jqrb7Pk2b23loXr1BzY51AfFHBnx/X669x1fe8RYWPg5Ua/hzida0MsIck6gtG5gZqIIiWWVppaOm7vFJwI1n15yJ8o+K1S4r4zk0k7ah8gOOzha/XpMAMhcOOP+2Ku59RzGuzVuFVM7szbbPopWijVw5ulH6tmp1UpozMyC0jswDHqwQ3Llf4ONiZp1r8HOJyTF4yClzdPPR4PzI4EC33UWd8Zps7FvbZdQq1FTz++opLD2Glepk02Tsd0PSjmm6Jynns7DJkbySB3/nbex9oB06U135tKmQkbKPa98vdX5b05pKXVKPBDemyU1Mis7f3uZ9eqeBxvJcuOYaxyBDwJuX12wFtunifgEForLDo3gZV6CMLKB+lxEkHLfjFgDZnR+s+FdD2UcjeUOhR0PutTvhWlQIKEbUpdjZ5bdLfuT+gPxGiTuRZKNXb2BXBjUvmTk2Jeq67pocKtFp3pBp336tw2dLPUWyIiXNetwa0WTo6CSBAGsy3Ulj0WTO7ZoO/Vys4U3wwX1r6fGzyniyzVqp+JjsUYLvkF4La/T+D2i3pS4q5p2x8v0jb9Vrf+uPLTofJfsFpoO68ym6vbD24cZ+mp6bsKXZ7erOvQS3u/l2VP02y6rYwrIcAR14Rk5eFle+DT2wBkNfXFLvKs+rPndkgc2O2z7hGgKP4YL6SqMnebwS0uQzZG7o0KQwZZw3kOxGyKLTta5PujzuZ+hOh2MKXu9+XtmCcUvn7f+sT+9l2wqi51ETS7zX+GhSXxiI3Vbh064FPzGklVXoQKuwF40QKhKIGRx7pgfwHgZfY1/LVjJVPSzn0L7vvKCadfJlnzOxdFa5bVNDJOpf2C7v7WUl3zf3ZXsD1JI33e35QYH2JvQ0zsJrh7t+W9CMBTWc5ZaLxehwXzSy0wGdK/4/cerHMD8ys5pHkRzpQj2r+lJOc/qOZfTig3a5VrGPWfc2jMSGDI5M0gcltf/mPAOjA7wW2Pduju+xnNg5uJLVOfvmtStctJj0/Il7fo54hUc9/Vrl06T2NmIR678GN5N0BbWZLIU8Tmc/kaCu3iOBGqq9xzt3308LGMdULbjzbeHDjPr0e3IiabO8R3LiSu7+iepmkBDc60tJRhb373YA2qb8BdC74WNhZhfWj2s8R3JAqDXZHUsvh1yMaXTIRjng/fZPtTwP1O0HtDiWAFPH5ey1nY2b2eXd/j6SWtgN52jJimk6uvyfpnJl9bMlfuiDp4fR//0n632sl/VBqq4VMlVzPqmjzJ12F3Ecl3RnQbtfc/RGVP+p85juVrosNEeDIJ+K15P0B+hdVZFCaDnBLBDdqGUsW2y0BbR5VYT5qe8r5gDZ7FbEC7ZL+eUC7RaXjkCP8au4Gzexed/9ltTMemw9GHNO0FsGpFbeTtr6l+anWn1UHTkKLuo9eIFvgcikj7mSly0/M7D2Vro0NtXLDHoKJ8qb8Ru3pA1BIZJFBLd+a4pI+aWZfzHS94vcjMxv8MyqweOsvHfFnEdXnZ8fRjp67P6GY9/TFgUx8Io5DnkRle5nZNRX3/Y9FltopkdK9ev4wgahTPFrKGGrF76ve9y8iQx/BuFlnklIGc05kVgmYUGQUoSgyup3AQfGyrSlZj9c7pEBlCX9nZm8ofM3i0p7i3Gm3EzO7bPB94D2MCKCPohjsKgLGA1LjR2auI+i+GD5BDioEDOlVM3tT7U4sc+B7HZW9sWNm1wW0260DBV2LX35WqBt94U3LJ/fDmvobQKdSwbZdxR4Lu2hwtaf8E6GI4xyXGcsqVsRWhm8d8Wez/fu5db91Ioe0yhsxtro4kODGOQWMl0qs/qeaNi0fH9ujnU6CG8/o8u911Pzp4eU/Mh4HCrrW8FTFa2MLBDjyqRHgeH/mawKXBOyTHkXQzt3v1rQWQVT6qrT43r1jZtcETIRKnzkflm7ekvQdi3h2fPyIP4/4XO4MYfKdSVQ682eD2i3tJ2t3YEs/pZE8ywroIlshBS1vPvCfo4o0H1ksdkzSUc2nl/5gYBd09LMUDSPAkUHQEbGrpL4NPn0bVeVONx/8oDCtNnxBcUfHHeW5wMHiW4LaXeSoDIQhuTugzUUr/R8KuNbMA4Ft9+bagDZ3BhTwi3h9ihUjTt+tOzSC51mwyOdVbgfrP0RlwZEtcLmvq24phUFkzY0VAY48fjpzezw4gc6kwoKnNX0gl7y3uqb7zyNO4pjJ/ftMjvizIunmjYjYnvKNgDaP4mY2lu1ERwpa7JAGkrYetD1l2XHI2c0FOXZLXndAvh/8vMrmkK0pOuT/Z7nUiJ57S6UjYY9X7sYg7rtjRYAjDyrHAyPm7i9IOqHp4D1qdefQS2t6DGz0wKjkFryLma/VpMBaBIueR1H73F8MardHvx/Q5pDS1iO2p3w/oM2lzOxxM7tWRwdrcaU9MyudEbiRlJF5cGvKnmKe768FtNmlykfCXurGgO67o0SAI48ba3cAQHmpmOgFXX50XKn76uwY2HsLXKtkgGMs2x0+ENDmUcGhqNMffiOo3R6Rtn60iO0p/0tAmytLpxUdFuQgE/dyLun20tk2W5plZM6Lqq31q0Ht9mjdI2EjvmsEnDrHcVd5jOroSwCXCmCd15V7cyOLi166vAodGZl+z9wWHm87hu0OaYUq4vl7VHAoqijeUGpDbCV9T0oXjO1GOqY4ImOp+ufPzI65+3dVvhhzLy6aWe3tBmtJx3cf/LxGHQ2718LnuAXpSNh1Fomi3pMvBrSJgsjg6Ntba3cAGKOUunowuCGVuafumNlVBYtf5c4QOWq1ZUir1Uf5zYA2awSHni18vZZ9KaBNH1CRu48EtNnM58/M3iHpEyJz46BnOgxuPCLp+kP+KGpR+E+C2u2Kuz+o9Y+EjaqHMviFlqEjwNEmHpBAo9JD+LDU1ai9ufNe7ajy/LoGs1q9ghuW/8jaaqTU/laFa7bq3QFtPhbQZi0RBXWb+vyZ2RfN7CpJL9XuSwNc0lkzy30aW6gK9R+Oqps0GikD7q4N/mrEPLaZwCk2xxaVPFx5JzYEOIAGpZNSTiz44+itKftmFlUosgWjOJItfYYiAmEL93CnQfsgtwc0JHt9iaFMfNz9jEb0+TOzG9x9rOM41/R0mQ/1dj9Pk+wHVHbbOZPpqUe1/usetT2lqcApNkOAIw9qcAADl05KWbTyHvWgvdR+xeJstxa6zliKi0a8nssme78ecM2/C2izS0ET+CE5FdAmE8P2XFSHgY05h207jfbPC1+vOaneySaZGFHbU5oMnGI9bFHJI/cNsUSRQgArOuSklIOi7qUu6UzlyvO5C+cdtrI5ij2v7r6jOidt3BJwzS8EtNmriAn8kLY5RHz+ml1lTQGvMbko6RNmdrzX4Ia776p8cGNINXY2ckS9k1VEvF8ETgeCAEffWDFCT7r7vKZjYCeSjiqSlnuL2rzfLnQMbG1jGVREHJMpHVG7JHB7yuADUmv4e7kbNLOIOi3FjXR7VFd1J7awq9cDG92eOpHqatXIaN+vcM1mpGLtm9Y7iap51mzgFOthi8qW0sO7lu4mjOhK7v3fXX1eFxwDe5io3+uimf2vQW2v4y0FrjH4NN3AZ8XOklXAXwq6Ll6XO+tyL3N7NUVsj6pRUBevK3ZMebR0X96kuOXWKmdmVpXGV4cVa19VRKZ764FTrIEMju39dOb2xlqYCu25sXYHanH3ZzQ9waBmUOZXKl57XvSWuWUT9KH4XFC7Dy/58x8NuOYkoM0uBdXf+JvM7dV0c0Cb3WYLdGoi6TlNszWs8DHlYSoVFZ0Z0ha0taTXvfb46jCjzqgZGgIcABb5aub2ugjepbTJiD3j69gZ8ErCwUHNsgl699KALmJ7ipvZx5ZcN3emZuSWrB59JKDNQaRJp89f7nFmD9uj3p+5vZLPTtc0oPGSpIdSQOOYmd3S8zaUBTY5uSMHH8oWtA2d3/Lv7yvmfbszoE1UwhYVAEhScON07X5o2CeKzE+Qj5ygD8jDqlMQ7ZGAa0ojXn08RO56C0NKk/5SQJsXA9rM7Q2Z23tR0v+maTDtZzXNqjO9HvhY997imr6OP0j//ImkvxpJvSdJlwqH11rkXVYUerAyFXON2p7SfVYSXkeAY3sfrd0BANtL1bxPqv7q9KSxFcp9xT0rBj/QS6vYEat1ruW1SyLeN7anXC73ZHZIadIRRyJ/I6DN5qXsiaFlUFSRjiU9qnB46OXN7L2Vrl2Vuz+hduedD9XuAPJii8r2qn5ZR3gcGfrV7BaV9OD9oOoHNyTpK7U7cMDLmdvzuf9dePrHgHxZMZ+rI1ecgoqauqarZ4MPTK2B+huHCDw9JXfxa4xIetZveixpDqO8d6bX/UTtfiwwlkzSUSHA0b+xHEcGhGjswdvig/aHg9q9OJKU0Kh6Ln+55M//96DrStLzgW13I2Xn5J7E/2nm9mqJOD2lh+0paFQDz/pRZm+krb8R2Vy5cCrTABHg2N6rmdtrdpUbGJoGBjwHjWl1Z8h1RiRd+nyFZAWZ2XuW/MibAi7r6dqnAtruUfaaBQN6bSMCe6PcniJptMeJ5tLIs/7Fytcvbq6uWQvZsYv8au0OID8CHNvbrd0BAOtrZMBzmdZWd4JWqE3t1RmJErVqdWQGRdD2AGlaf4Mg/Ov+aeb2BvHauvuOYj5/vxbQZoS3ZG6v5paK7rn7g6r/rHeNrGZfGj+0HtwYUlFnzCHAAWB0WgxuqM3JzZeD2v1WULvNCMzemJjZO5b8zG8GXNc1rTnV4ue0ltwTz6G8thEZB3sdbWnLfcpDyxPEpqUMgrtq90PSix19freWghvn1f5nd9lJZOgUAQ4Ao9JocEOS7qjdgUOE1I9oLVMlSFT2xipFaKNObZHIWpyXe/A+lON3IyY1fxLQZpShBKq61tj2iNFkb3QU3JCk36rdAcQgwNG/D9XuANCLhoMbzRXcjMxACGizKYGv3dIitOlkrcj3LXfdqZ7lfp27L97q7ucimu3s9JS9zO0RMFlTY8GNndae71E6C27ssT1luAhwABiFhoMbkvQrtTtwiKgMhEEP1tMAL+q1W6UI7d1B154dif7HQe1DurF2BzL4QECbvZ2ekvsknEHfM3PbMrgR8VoPvqC21F1wQ5L+vHYHEIcAB4DBazy4sdPaKkIqyjYbpOQe8OXen96ahxWXvbHK1p43Blx73h8Ftz9mP1e7A9tIxW2vXvqD6+vt9JTcmTi9TBiry5C5kfu19pEU1Jakr6ufz6pL+njtTiAOAQ4Ag+bur6jd4IbU5urOLwS23csAaG1pBSui/oW0QvZG2h4Q+vq2Foyrxd3P5m5zAGnsvx7QZm/bU1BJhuDGfsbuRLbZFHe/zd13JR2v3Zc1NLctGHlFRNoBoAnufkFtP3SbOy41ZW/MB79zZ3AMNsAh6Wuqm73xkwHXnjf4+inYSkhRYmCZTDU3Iu7dvxfQZjM63JYy83DtDiAWGRz9y33eOjCTOxW96AOwg+CG1OZxqQezN7IHwtOgaFBSen7uY0NnXlzh+rcp/vPe2yA20ocyt9d1nYXA4rY9vi5PZ26PsfoR3H1H0j3a/vOX/fPb2gJGTh0HN5YW60b/evtQNsfdvy/pTRmbnGi9h9nEzIa+px2VuHvWwaWZFbnndBLccDNrauCaJul/UOBSF82s9fdnLe6+r5iJiEu6Y1k6baE6MzxvEnf/nqS3ZWzyBTPrtsho1D231DMjt16fnb1JmRu5ggiuvPOi5p7xuXQc3JA6v9diNYP84hWWu6BbjzcLoAlpL+hE+QfaEauIS1flK/hc7Q70yN0fUdzz9MUV9wr/WND15/1/Ba7RC7InkzTZuTag6d5OTwmTMmQwJwXkT2dqbk/5x9+rnHrVnYLBjagtkb8R1C4aQoADwCC4+zclPab8D91JQJuS9NGANjeWBouLAkO5AzyvZG6vmjTYOxnVvFb4nKT3rsTz/OcLXKMXuV/vnidDX1LMPfJDAW2Wkvue+S8yt9e1dN99QPk+d9TfWEHKmCmVuRFxjQmFsseBbIEtufvzkt6es0mt976QMowwvaTZuvsziitwlzttVZoeDXtd5ja3siTFfN2tc8s09/tvKp3SE1V7Y6VUWnd/WtI7g/pwCWnyrwvYkvSQmZ3K2F4xKWtu8PfIdQR8PhjrJUEZBLmfcYPbnpKpkOuqcr8fM0+uWLAbnRvUl6+Sc5Wvz3uIUUunfkQFNyLSVjn7Kk0AACAASURBVKXGKngvyd6IcE3Ba4VJA76o4MZK2RtJidMrOEHlcgR7FFpc9BsBbZb0g8zt8XlT6PaI3O0N6njYtA2zVHBDUdchuDEe3DC35O5nJd2Vs0mt+b6wqoYorWdwFCisGLGK0NzKzgoFAvcl5Vw9bO412ETQyvXMSitNBQvDUphtTu57o6TbV6y10pSg4qLd3x/c/WVJb87Z5tjHep0VthzM/TLis7xE7vHGTPf3FayONxpAl9LAOvrUiIiBVFPFRVfM3sg9mbPej4p1913FDbR9jZWmXw/qw0E914hoXqfBjaijiZu6R27oDbU7MECPqo/ghpQ/g6cKd99T2eCGFDc3/U5Qu2gQAQ4Axbj7/RnaiDop5aCo7SmtVfBepRDa1QHXvTegzSLc/duKeU1mHlrjZ0tsT5Gkf1PoOuhH1Fa71u6Rm8heYLL3oPA20oJGT3OWP63dgW2lcVbpui/PKq646HsC2kWjerpZYAGOD0Og3Cv379rmLxeu4B1xf2yqgneqX7LqRD33Z+FDmdsr6UcC256Y2cdW+cGUfVPiu+AtfW5RX5ps3xDQdFP3yE2Z2T0BzXYbFN5G0DaoKy4T3H430iLSvspnyzwp6b8KavsrQe2iUZErUChnq0kj0IMC9TYOini4fyugzW38QsVrR0yOwqUTeyJ9bo2fjdieclgdKAb/OCjqaNjW7pEtubV2B0orFNyQ8n+WmzoGflUV65y8Kunjkh4LaNtXXTTAcJDBAaB5heptzIvanvLxgDY3krI31nkGRNTh+FTmNkOl/t4ceIlXzWydVdq/F9CHw05LeSngOuhbxGR7ndozPch98tBNmdtrWsHgBlQ8Q3bejpm9SXFb3qgfNUIEOLYUcG59LwWUgHAF620cFHFv3GuskOC62RsRq/j/MqDNSL+vwMKikj688g9PV9pyZ2G6Dt9zzQARl6RsuojvwWsBbdaUOzD41sztNanCc9+V//nW1FHwy6TgRsljYGd2zOy6wC1vroYWllAOAY5hGF3aIrq18mc1bQV4THWCfhH3xj8PaHMjG2RvSDEBjtIFzDbm7o8o9pn51JoBsC+F9eRKv1bwWqPUWQHJqDHHrwa1W8vzmdsb/AJYpS0SWxc/71kaD1QLbqR//3LQ9V9rbGEJhRDgGIbIgncYt9xHnb19lR9KR5OVOh3ioKhVxJZWEe7a4O9crYAgh7u/nLvN3NLWlJOBl5hskJofUXvpsJR6Z4B4qNzfhS4KSKbva8REZG8IxUUPyJ35ZO5+LnObzai0RWIvbQscZZ2hlI11SuWDGy/NBTekuPHe0IKmWBFFRoeB9xFRLkh6Y8kLuvuu6q3s70jaD2i3me0pW6aXRwyC3hTQZm6RW1Ok9QqLzuT+Xi7annIx83WGIvfn4Wczt5ddWl1/c1Dz/zao3WrM7JS7554435G5vSa4+4sqvwVn58Ake1QqFG6feXI+oB+45W1ngEFTrIgMjjbtrfnzg09bxGAcOZlNRcVqBexeS4Od6wPabmZ7itrb0mZp+0eT0lapyGflC2sWFi15PKwkfafQdcYud0HKCI8GtTvkUw4iijP3tJ1pqZSxWTq48eTIgxulC7fPPHlItmLUmOSBoHbRAQIceWR/gGVuD2jFocGLisVEZ75vZrPAxmBPT0nZMS3eX062OGhPKdPRW6U2OU4wYuC26HPxewHXGoLcz/1XMreXVfp+Ro0Zh1zENiIDKirQVFR67i/KHIt02CQ7t9YWEiRdes33VWesdcXrHjgmmZjZPQHtohMEOPIY5d49jELu7QNX3HMqnrs+s29mb0l9ORfQjyZqGASdupGLSfpa7U7MS6/X6eDLXNzws1Hqu+Kk+C6U+7nf+nGYfxzU7tCOhj0oIgOqxSD1WubqbZS2KLiR+8Sb5o70nXvNS8/9XNKZBa971JjkK0HtohMEOIaBAAuihE6IK567PvOsmc3/jj8ZcI2Imh6b+OPaHVji+sa2qjyi2M+lm1nrk1rqbyyWuxjxGzK3l026T18b1PyQszekmAwoS1vnupT6fo/KP/dLZG7MNHWkb6pzUeOkFJd0/2HbMNNWy5BrDnjLG1ZEgCOP7qPpwALfi2q44gNXen1F4Z0H/nvEIP7OgDbXkgYSUROUnE6myVRV7v49xWe7bFQs0N3P5u7IEai/sVjujKOWx2OfDWp36NkbShlQEYtQNwdOEEOk7RG7qnNC2rNLPmu5j/Rt4vucXvNZvY0awY1PHlFjapPi2qsYetAUK2jiC4grrHsT4n1ElJAU0lRUrMYDV5o+dO84+NAN2p6iFranqJ86CibpdM16HCnw9rbgy5zb4nPxkaw9Odp/KHit3jydu0F3P5O7zW2l70PUGOPFoHZb82xAmybpgRZrFx3G3R/UdDxRY5vkziGLGQdlnxSnWhfVzL3mNTIFZ+OsLx76h9PgXES/Bh80xWrIPMggFUfM+Vr6uu2ZGe8lsnP3r0j6+YxN7qveEbDSEcfCpVWO3A/c78/qe9SSBjmnavZhA25mxQO3aYvMB4Mvs2dm12z6lwOeNwsvVeM96EnAEaDPmNm7Mre5seD6SLMJUAsB4FBpMvcHgZe4vdXXMX2GvqaY08lWsfJRsAHf51rPsbs1LURds+bWkZ9Jd39FMZ+JktuQ0DAmxRmkKG3Om9hk3fYIcCBKwEO/lufMbGFqbNDE8dO1izQGTojXvk+t276ZFQuGpa0x0VumtprUpcnCY3m7tND+gfo0OCDgu9XUa562E0T159kVVtUHI/g52mSwKGX/3Kp6c42VgxtS2LOyWPApPR/+nab1P2q95kuf24GB0ya/B6iD1Zk89jK3t/aXvre9mEBBLunskuDGGcWcnlI7uPGE4gY6Lym2wPFV7l4khb1QcEOSHt1y8PXb2Xqy3FACm5FyF2Gtmd12mZTNFBZsGVNwI4ncrmCSzqdsverc/cEULKi1DVVaM7iR5C4cLBU4KSbV2ZhoGvy+QfVe8++vuCjxsIKywghuYIYARx4P1+6ApJ+u3QGgQbMiV8sqat8dcO2IfdcrS6sktwZe4qOK30P/1uiio2lrUomK/ntmtm3B2Z/I0pPV9FK3pabsRVhbOB0j3TtOBl6ilZOliimQmWOSTrn7xN0jJupLpcDGvqZbImtmFW8S3JAC6upoeuJN7kVQSZcVbX1M9TPyn1xlO266t9wQ1Ie/DGoXHSLAAWCodnREkasD3hhw/d8KaHMdX1PcoGeSVko+qviV/tNRQQ5331GZAmyuPKfpFDtK1MzuKXWtjkUUYf37AW2uK/SI5Ja24RT2/QLXMElvSIGOIgVI3X0vZRCcUv15xWsbBjck6eNZe/K6YzmDHO5+XwrMP6a6dTak6bPt3Bp1L76suOyN9wS0i07VvhHhcJt8+SNXaoHePGdm162SrpgGgYPanpJSlcOKus3SUNPrG30k2+xklaxBjtReqaNzt92aMsMzuyEpCJQ7wFd1JTZlkEROmnIfx9mNtMJdauuXSXrM3V+OaNzd706BDdd0a1XtDAJpmkWw8XMveHvDMZ+6kIqAriUFNZ5JgaR7VOdklINc0v1rZiZGHRH8maB20akWbkiD0EAhxhfM7MbKfcAANfDZXtfZFbakXJLqVJzI3IeqpyEEn7TxkpldlmIaUGh5kSyFCYPe80VeNbM3bduIu5+VdFeG/qyiqWKXLYs4Ra3W6TWpltcDis38aqbOSA2F7z2XLivpFUn/3TaT+BQU/meSblZ784csp2eUPKVK0g80rePzmqQ/0fTEOkt/9n1Jb9L0udpiYHsW3Lh35b8Q99kf/X0FV2rtBtWtgEngntZbRSHAgRCdBTj+Yt00xaDjYaudnuLu35P0tqDmDx1IFJgYzdv2mNWSE4xsk1V3f1pSqcKMD5lZb0cLVxF00sj9NbYIFZjcVT9VqgUFJ9ELuyDpOU0n1Yv8vC6fWLc6X1h7on1kY2VPqurVRqeVBH7u11rUwji0esPqTsRxcVqvonqWVULgoIKr89vY+HgwVmDXsnAgUTpwoM0GWKX7mHPgHXlk50HFjjbsXTqB6XTmZotngAUHRiXGKJekLYQEELeX9R57qdE+xjy1TCSd3ODZG/WZJ3sDhyLAkUnADXHdAAdfcoRw91cUWM8hg21X9HNnqFQbyAcPzJZWpg/Khll4OU1PyFlaRDatyoUee3mIcxlOTbmkZOp0rQBdryIyOLe5p62rwIR74wD0UHXwXG1d2GeKANRCm55OExmgf9TMPhjQLjrHIKZdBJ/Qiv+3dgeO8OSWwY2zOTuT/D8BbS6VigNG3dNd0mdX+LmfUtkiev8qFW6bHPzDdITerLp/6Wrzr2YObkQUwl2kyhGTncv9mS+2WJE+W9G1XXIV2R2SD6vcvXJoJmZ2VdRnKmUpXvFMGbnntghufEoxz18nuIFFCHDk84PaHQCC/Le1O3AIV56iYu/P0Zl5NR64qfjbzYGXeHGVvfNpwHl/YD8WXtoP0DSoUaO6/05ABk/WFOwlqgToOvdi5vYsbX0p4bxivyN7OYN9Q1HxXtm75wtlK58vcI0ezMZa25x+8ju5OnNA9Alu6BgBjnx2Mre37oCD9xJRfrl2Bw6Y7bvdumK6pLdnaGNerVWf04qbpLikj676w2k/9EtBfWmda5rFklvuQNxRK8f/JvO1xuBfB7QZniLv7juKDW64pF8KbL9r6V55rnY/OuGSPmFm7yhxsRSU2ytxrYblGmtFbMXyTGNADBTbIDIJKF7nWvP9MTPeT4Ro6CSVlesurNRY/poVxU8zKlAccKNaEu6+p4Kp9g2I3BOeu7bJoucL9Tc2FFAjJbQOR6HTIrIc6zx0hQsI9+g1MyteryRtrfiD0tdtxI6kn9r2eRY4DshyLDCGi4FMPqRKAbF2NZ1AZgluJLnvgUXvA6kYWmRwY7JpermZjWnA7pI+E1hnIPdEd1HA8mLm64zJfub2or8/0Sn4ewQ3VpMCWa0sIrTENQ2wVynGmrZlji0bcfaaX5fpeRYR3HBJHw9oF2tw959399919++4+1+mf//x2v2aIcCRz9OZ21t7JSityABDtGdm13ZQqO4bpS5UqDjgL27592/X8AfuszTepTVKtpD7Wb2ove9kvs6Y/E3uBt09ZPuCuz+i+K0p1N1YQ8qcGvuWiHkTTRc0qn6OzOwGjafg6ETTDNksr3nKgInwYgdjwUFy93/s7t9LWd1f0XQL+z+U9F+nf//PqQza/12znxJbVLKKOCpO663iPF9qfyLGpfIWlZA053SCStYAQcltYgXSmrNst0mDnAc0zOfNLLgRVgS00FaCmU8HB2oGKxUFPZ252exHTqfPU3Rh0axHJI+Ju78s6c21+1GRS/rrLYtaZtfQNt0ILulbZpZzm73c/WlJEVlctxPgKMfd/xtJ/5Ok/0HSTWv81QuS3m9m34zo1zJDHHBW00CAI3TPLsar0h7hsJoG0qUCe9fmbLJU/YJ0JGzkADDr75JOeYkshFrLmf+/vbuPtewq7zv+fWY8foOAMTS8GRCCpGCDTKI0CXYU21FtQBWxLTCtWhmLNhBKS0C81IQ0qVIRBdJgh7aBVEigIUqlBhvGJAKMW7AxroWQkrhgXBQgdjzmrfZ4ABtmPPfep3/sfT1nZu7LOffstfbe53w/0hVgM2utuefcfc/+7Wc9q2S4AWWCuM2msv/GfAr04ej8NalwLe88lFk27dbDV7B418vtrAGv73gbaicqBYN9eAS4sFDvqK6vh9CcUraj42o1vcx8FnAp8BrgRXMO9/aI+MP5VzUbP8wM26yvzw1FViHBBRXnWt8DWuyc+9Yoe0S0YUHpp1vXdzlYGwIs2pGIK6XDjdbFFeYA+290oevvYafHxbZbU0pe9xK4pOD4SyEirgB+neXZGrH+O3/3EMMNePRY3/NZnC2Xa8B1EXFKoXDjGsqEQe8vMKaAzDwjM1+dmX8N3A28j/nDDYD3dDDGzBYtiexVgQqONWYLOewqrGIqlWg+DFxco/xwDE9bT5igzlOkYk9gF+TJZPFtKcdM1v1JP5vx98ecCpymBh39PFa6dhSvaFo2mbkfeBrjvmZuJoGDwD8Zy5aDBajkSOD6NkQrN0nmD+n+eFirDDuWmWcAvwpcBlxecKpvRsRzCo5/grH+gA5SgRumWQOO6kdUanlk5o+BUqWBVX7pHjNh96XaaxFR9FjUQiWfx0xBwW1BMPrtKlXDDajymq+z/8acCvVL6eRD/Vh69uhE7fvqVhbr2O1iWyNKa1+Pm4DH9L2WGVXbxl7o95bb8DuSmZcCV1E21DjeFRFxXa3JTMK61fUxcWO8AdCCiojTKFMye7jdjlIt3CikaAf8tmdI6WvC9aU/cE5sVxljqW/VcKNV4/dAGm7Mr/3Z6fp9HfOeRtD27Cm6NcVwo5yIuL09dnt/32vpwCPA60ptjaihfT0eC1zH8H+PJU0wEBXDjVLbU2xcPIfMvDQzP5SZB4B91A03AH6r5mTeQHeoPdLtl7ocktleI5+gqLgOt6oUrxbYcvLuS/+vj4hXdjjeo9qqh7eUGHtC1eaAlU8HmVf1CqNHJ66zNWy1vYHSnDLzfuCJHQ+745/NShVTX4+Inyo4viZk5grjq+Y4DFw01lBjKz01Yd/OCrCvp99Zbk8ZiLZS41KaLShP6Hk534mIp9aazDdLt77b8/xdX1CkjXxlzj+fNM2tSjcRXQhtEND18ZMnTEPl5oDtU7BgHE/Afr2nD4pzPbmfwcOV5lkGHykw5o5K4SeuHSXDjRXDjboi4qT22nkfI7h+ttUDpy7q7/u2MuI8+n8tEvgRTYXMnh6rYkts3em08fki26BS4zX0H25A98H/lgw4uvU/Ox5v1g8l7k1TcRHxwjluTFcWZDtKTZ+nfLXdtX19+GyfyhzuY+4prG+f6quz/z+uNM9LK82z8CLiLZTZprKT01RuoXDPHvfE9ycizqI52eNB+r+5Xpc021CuaYONpbjPaAP7Xe1no2tovgc1XpP1UOO2dv7H9HkSTaHtKelnxq1l5gWZeW1mfpNhhRqTqv6ucItKxwqUE68wfelb8SaH0qTM/Fvgudv934DbI+L8Ckua2hi2qBQ6leF4g9jaNrDmowl8ISJ63fNb6fWn/VCujhQq0X4kIk6ZYQ01yuZtTDsgmfkF4Beov10igSPAlyKiy23ao5eZ1wEvo2nQ3sXnjTWa+4Jv0DyYGNSxukPborfIBrb9ZBpHIuLkWpMNbc/YIpi1b8Z2/OCpwZosTc7M84DP0qS0R4BfiYix9FgYnHZ7wvMLT7M2hHADmuaj7YfBvrvTD6m7/5P7XoB25IN0v61s6g+GFZqKAuw33BiWyXChDbh2U+Yz5BpwCLgH+JRHA2/u+IcebZD/LOAXgdMn/tVPcPT1yvbr+zSfqQDeO5DfSds5s8CYgwpx+jTCUGPSAzUn8+a5YwWeCs9yVKxNeKQpDb2CYxGOhN2p9kPgm6m7jXIN+NiQSmEz8xAw9VP7HfpYRLyi8BxLp9DP77ZVmpWa91otOjLtNfUXaCrCTmH7I9/XP3sGzQmBNzCem2z1oH0o84Guh13m+5rMPAO4gPGGGpM+FxG/UmsyA46OFfhAOkvAYamxNKUCP6v3RsQzuxioUIn78W7tewvGdioFHavA+4b4FLJACHcCf2eUUepneLvXq1Iw+garNyRNKrSlcum2p2TmJcC7gHOZoXJvBK6IiOtqTba0qVhBD3U8nh8+pTK6/ll9WheDZObnKR9uPDT0cAOabSsRsbu9qVul26ZtCZzXnkgwuHCjktW+F7DAipRVb3WyTrs1pfRnhvsMNyRt4HkFxlyK7SmZeW5m/kZmPgjcCPwjFivcuKNmuAHePHeuQII5U08Pn8ZJ0ynRDGven79KjTZHX/KZma8FrqK51j6e5vu12fdsrf36IfDZrhvBllShgmN/RDyj4PhLrVA1xYbNRtvg4/0F5pu04qkpkjZS4JCF0X9W2UpmXkCz7eRS4Nk9L6ekXn5v2GS0e3fRbcBhYCGVcRcwmI7v7d75GqeIvKHw+MW1neOX4clO6Q93v1d4/GX3MN1XY52cmS/eoBfCH1N+a8rgq74k1dc2te3awwXG7E1mPoumn8ZlwIWMu5/GtBL42T4mXthkrEfvLTDmSoExpWX3pa4H3Kp8fJs/91rgNsqHGw9aXq51vheKe3uhcW+b/B9tNVrpz3NfsMGkpE2UaDr8NwXGrKrdevIfMvOvgbuBvcDlLEe48XcRsSsivtzH5FYHFFCgTGuV6S8enZ7kIC2yAj+rP4iIx8+4ho8Cr6D89diTD0amwPtz0sMRUbrXy9Ir2PTzkYg4pUYjWuBwRGx36oakJeX2lMaSVmkcbxX444h4U5+LcItKGTP1zZiCQZQ0DjN1+87MFco8+ThhKsMNHWf0T8dGouvPA+tOLhyArUvgogrzSBqhnVauLorMvJQmzLgQeFGvi+nPw8BfAldHxD19LwYMOCQtt87DyMz8TkQ8ZctJm9MOzupw3i2nYwH6bqhbETGY/jML7qvAC/pexA4lcK1bUyRt4Z0FxryrwJidyMxzaao0LqcJNZbV3cANwIcj4o6e13ICKwMKKFCSOstNmF3OpSmVKu/e7DSV9pSUfwOccApCQbeO4UhYnajgE/oNT+JQGZW2kZTw1Yg4p+9FSBqutsFo1w/MzxtKsDqx7eRCmq0ny7jtZN1BYB9wQ0Ts63sxWzHgKKDAhxkDDqmAzPwu8JOFhn8I2NN+rf/81r7mund+xAoGHHdFRJenfWkLmXkNzQlJY2LPHknbKtFnaLOHRDVk5hkcDTQW/QjXae0D9g491JjkFpUyPk7TNLAPn+hpXml0IuLJBZsA9t3A0b3z41eqf8O/KjCmNhERb8nMNzGiKg7DDUnbacPbrn9H1egtdOyEmZONQZe1j8bx9nG0WuNg34uZlQHHOFhpI5WzymJeC907P34lAo70fdGLjwFjOeHs630vQNIolLim/VGBMY8x0UfjQppeGmrcAVzLSEONSd44F9LjUbEfi4i+qkek0cnMO4FFK9ffHxHP6HsRmk9m3gp03QzU/hs9KVgt1qUHI+LMvhchafgK9N8ocjysfTS2dAfwYWDfUE5A6cIiPrWUpFn8GnAbw7/xmNaK4cbC+O90H3D0ejb9kht6tdiK4YakGXS9lW21q4E8vnVLCxlqTBryL9qxW2NE+22lZRURt2fmI9Q92aSUBDwxZUFExAcy8/0dDpkR8ScdjqcZRMSeAVdxeO2QNLVC/Te+vdM/6LaTbS18qDHJgGM8hviBSFoUbwY+0Pci5pTYd2MRddmH40hH42jn3sAwrzXXe+2QNIMS/Teum/b/2J52cj1NMOv97MbuoGkU+vGIuKPvxdTkTXMhmXk/8MQuh2S618seHNIODPjJ6jTWw4239r0QdSsz/xZ4bhdj9Xn0no4qsG99Xg9ExJP6XoSk8cjMVbqtVN+2/8ZElca/BM7tcO5FslSVGpsZ0i9YSerTncAL+l7EDhhuLLCI+KnMXGH+vc4PdrEedeKXGU7fn8OGG5JmkZkvpvtt+Cf032irNH4Vm4Nux1DjOAYc5dwMWEkhjUREvLCjG8maDDeWQEScNOfJXKs2jxyOtu/PtcBbel5KAhf1vAZJ4/P5AmN+GyAzJ087sTno5r5Gs93RUGMDBhzl/H3H4wXTHxUraQc6uJGsyXBjiURE7HAb1WpE+Lt+YCLirZn5a8DjelpCAufbd0PSDnR6NGz7n4cy8wBWaWxlFfgucE5EHOx7MUM2hPLIhVXgRmmagMMeHNIcMvNe4Ky+17ENw40lNWP/hv0eGTxsBfaxT+NwRJxaeU5JC6KD+5vJP++96ObuptkRcENE7Ot3KePiU52yuux+T8djSdpARDwjM+8Ezu57LZvwyesSi4g9AO12ql2c+Hshaao29tRem2YXEbsrb437QUQ8vtJckhZMZt66kz828d8D72e2cgdNqPHhZTv5pEu+wQoqcCrDNIHJIxFxSodzSkspM38IPLbvdRxnLSLcpiYtmEqVY1b0SJrLDFWEVmlMb1/7dbP9NLrhG66gEkcosf1rtuKTO6kbmXkIGEpg6M2JtMDakwlupftqDvuwSOrEFg9vDTSmdzdwA02g4daTAvyFV9Ya3QYcMcWYf9HhfNJSi4hTB7BdxaoNaQm0285OysyP0hyNePIcwyXwCHCR29kkdaHdnjIZXhhqTG8fzdYTTz2poHZjq2XzG30vQNJ8IuIcYH8PU68ArzPckJZLRFzRbjU9j6a5+LQS+BFwTUTsiohTDTckdejnaK4z61+BPTU2cwfwPpqQOSLi8oh4n+FGHb4hCytwksp221T+dUT8ScdzSuLRxo6lA4dHgP/qCSmSjpeZ123wj+/xeiGphMw8F7gAeA3wop6XM2R301Ro3Exz6onHuPbIgKOwAo1GtxQRvqZSQZn5ZZotK1331zkIXB0RH+xwXEmSpKll5n7gqVjpv531bSc3e+LJsHgzXFhm/j3QdWPATftwGHBI9WTmF4CfAU5jtutpAkeAbwDXGmpIkqQ+ZOYLgP9Msy1uKI3Vh+gWjgYaN/e7FG3Fm+HCMvNa4M1dD8smr50Bh9SP9gSEt9JUdzyl/cenA+unGt0P/HvDDEmS1KfMvBz4HeAf0jyk0Ynu4Oi2k5vddjIe3gxXUGCbigGHJEmSpKlMhBovpHw/sTE6yLHbTmwIOlIeEytJkiRJC8ZQY1v20VhABhx1rNLt9zrY/jQVSZIkSUskM98GvA34SbxXON76tpN99tFYXAYcdfxbwKNbJUmSJHXKUGNTCezFbSdLxR+ASjIzux6SE1+/jAiPdJIkSZIWmKHGphI4DPy3iOj6oAeNgBUc9XS9pWSjsboOUSRJkiQNQGa+D/inGGpMupumQuMGPO1EGHDUVKNnxicKjy9JkiSpksz8c+ASJWGCywAAEVlJREFU4HEYaqy7Bfg4NgfVBgw46lkBTi48x2cKjy9JkiSpkPbkkzcCvwic1vNyhuJujlZo7Ot5LRo4U8BKMvP1wAdKzhERvp6SJEnSiEz003gSHucKcJC2MSjNiSc2B9XUvCGuqECj0WMYcEiSJEnDlpkfBK6kqe7283vDI1zVCbeoSJIkSVIhmfli4A+AnwFOx1ADjlZp7MMjXNUhA47Fsdb3AiRJkqRll5mvBd4MPAsDjUlWaag4A466Sp6kslJoXEmSJEmbyMyP0jQFfQpNDw0Djcb69vwbgddbpaEadvW9gCXzroJjv7ng2JIkSdLSy8zXZuadmflQZq61PfZeCZxF8/B42cONnPgKmjaBLzPcUC3L/gNYXalGozYYlSRJkrqVme8FXoXVGVuZvL85/vuzGhHuGlA1vtnqK7lNRZIkSdIOHRdoeK+0seMDjc3ubdJwQ7X5hqvvTuAFHY9pg1FJkiRpRhMNQX8aKzS2sx5sTPs9OlBqIdJm/AHuQWau0eH33u0pkiRJ0nQy81s0FRp+ht7aZD+N3Tv4s+dHxO2dr0ragk1GexARXX7fVzscS5IkSVoomXlxZt6bmUfaB41PxXBjI+thxmr7FTT3i7OGGwAHDDfUBwOO/jzSxSDua5MkSZKOlZlXZ+aBzFwFPoOnnGxmMtRY76exm52FGpNePuefl3bEH/AedbBV5fyI+N9drUeSJEkaq8y8GrgaOAPvc7aSwA+AxzJ/kLGRwxFxaoFxpW1ZwdGjObeqHDbckCRJ0jKbqNRYA94NPAHDjY0k8D3g7e09yH2UCTegadoq9cIf/gHYQSWHlRuSJElaSpl5MfAh4Ol4P7OVBP4f8J8i4g+P+RcdH3owweoN9cr+DQMQEbsy88vAOWx9ofGCIUmSpKWUmXcCz8Mq9K1sGmo8+n/IPEK5YMjqDfXKxHOgMvN24JyIeFzfa5EkSZL6kJl7gX8G7MF7l82sAfezRagxKTOz0DoeiIgnFRpbmooXCUmSJEmD4RaUqawBXwZ+NyI+Pu0fak+VKVEBkzTb6D0aVr3ygiFJkiSpd5n5XeBJuAVlIwkcAr4IvDEivrKjQcr13rB6Q4NgDw5JkiRJvcjMy4D/AZzc91oGaL2fxucj4oq5B2t6mJQINxJ4eYFxpZlZwSFJkiSpqsz8K+BcrNbYyCpwxSxbT6Zh9YaWgRUckiRJkqrIzPuBM/FB67oEDgKfjYhXFpvE6g0tCRNTSZIkScVk5u9n5uG2guCJLHe4sQY8CNwGnBcRuyLizJLhRuv5hca9z8aiGhIrOCRJkiR1LjN/H/h3LO9D1aTZbvJDCldobLmIctUbAK8qNK60I8ucnkqSJEnqWNtf40Us371GAj8G7gGujYgP9rweoGjvjYyIZQ2vNFBWcEiSJEma25L11xhEdcZ2CldvnF9oXGnHluHiI0mSJKmQJQk2EjgCfIMBVWdsp2D1xkpE7CkwrjQXS4okSZIkzSQzL1vwxqEJrAB3Aa9rm4GeEhFnjyjcKHlyyi8XGFea26JdiCRJkiQV0jYOfRuwm8W8l0jgnoh4dt8LmVfB6o0HIuJJBcaV5mYFhyRJkqQtZeYNmbkKvIOmj9+ihBtrwEHgHdHYtSDhxkcpV73x8gLjSp1YlAuTJEmSpI5l5mFgD4tz35A0ocZ3gNdExE09r6cIqze0rDxFRZIkSdKjMvNi4M+BM/peS0fWQ42vRcQ5fS+mtMz8DlZvaEktShIrSZIkaQ6ZeTXwH1mMio2lCjUmZWYWGtrqDQ2eFRySJEnSEsvMe4GnM/5QA5pQ4/8uW6ixLjNfXGporN7QCNhkVJIkSVoymXn1xDGvZzHucCOB+4BLImL3soYbrc8XGvdARNxeaGypM1ZwSJIkSUsiM+8Ens+4Aw1oQo0V4Lcj4j19L2YI2uqN3SWGxuoNjcTYL2ySJEmSttA2Dd0HnMb4P/8nsBIRJ/e9kKFpw6uzCwxt7w2NhltUJEmSpAXUbkM5AtwInM64w40E7ouIXYYbm3p+gTGt3tCouEVFkiRJWiDtaSjvYvyf9RO4NyKe1fdChi4zX0+ZAOuIvTc0JlZwSJIkSQtgomLj3Yw33EjgCPDutlrDcGM67yo07psKjSsVMeYyNUmSJGnpZeZe4ErG/dk+gQcj4ol9L2SM2tNwOn/9I2LM7yktobEmu5IkSdJSa5uHfooyJ2fUksDfRMTP9r2QscrMaygTbu0vMKZUlImcJEmSNDKZ+XXgOX2vYw5rwB9ExG/2vZCxy8xDwCldDxsRtjPQ6PimlSRJkkYiMy/OzIcZZ7gx2V9jt+HG/DLzxXQfbgDcVWBMqTgrOCRJkqSBa7ej/CUwxiNSE1gBXhUR+/pezCLJzPuBrvuWWL2h0bIHhyRJkjRgmfkV4GzG93DSxqEFtdUbJb63jxQYU6rCZE6SJEkaoHY7yipwDuMKNxI40B7zarhRzm2Fxv2LQuNKxY3pQilJkiQthcz8HHAB4/q87okolWTmEcpU47s9RaPmm1eSJEkakMw8DFzIeMKNNZrGobsMN8rLzN+lXKuBA4XGlSRJkiQti3ZLylqOx2pm3t73922ZZOa5hV/T1/f9d5TmMZZUWJIkSVpYmbkXuJLhfz5P4FsRcVbfC1k2mXku8FeUq8JfiYg9hcaWqnCLiiRJktSjzHwQeDXDDTcSWAXe0W5DMdyoLDPPAG6n7P2bR/hq9IZ6EZUkSZIWXmauALv7XscmEvgW8JqIuKnvxSyzzPwO8OSSU9hcVIugVHMaSZIkSVvIzDWG98AxaZqG/llEXNX3YgSZ+X8oG24A3FV4fKkKUzpJkiSpomyaia4yrHAjgYPASyLiJMONYcjMLwEvLDzNWkScU3gOqQorOCRJkqRKMvNi4EaGE24kcJc3uMOTmZ8Efq7CVB+rMIdUxVAurJIkSdJCG1i4kcAtEXFR3wvRiTLz48BlNeaKiCG8H6VOWMEhSZIkFTagcMNgY+DaI4MvrTTdNyvNI1XR9wVWkiRJWmgDCje+GRHP6XkN2kJm3gM8s9J0qxHhA28tFN/QkiRJUiEDCTdWImJPj/NrCu17pVa4kYYbWkSeoiJJkiSV82n6Czd+DFxiuDF8E0FYlemAN1SaS6qq7zI5SZIkaSFl5hH6qZhO4Dcj4j09zK0dyMw16tybJXB7RJxfYS6pOgMOSZIkqWOZeQB4Qu1pgW9FxFmV59UcKgZhCTwUEY+rMJfUC7eoSJIkSR3KzK/QT7jxEsONcWmDsFrhxorhhhadjWUkSZKkjrRHfJ5dedqDEVE7UNGcMvNe6gVhCVxQaS6pN1ZwSJIkSR1oG0VeSb1t4Al8xHBjfDLzc0Ctaps14Jci4vZK80mSJEmSxiwzV7OetTZQ0chk5t729av1Pnlv339nSZIkSdJIZOaPKt2wrjPcGKE03JAkSZIkDVVm/qDSDWtm5mrff1/tTNYPN/5L339nSZIkSdJIZObFlW5YMzN/1PffVzuThhuSJEmSpCGreNN6b99/V+1M1g839vb9d5b64jGxkiRJ0g5k5hHqnJiyPyKeUWEedax9j9S85/rTiLiq4nzSoHhMrCRJkjSjbI75rHHjargxUm0lRc1w44jhhpZdrTO6JUmSpIWQzQkmN1L+s/SDEXFm4TlUQBtuXEm9+621iNhdaS5psAw4JEmSpBlkc5JJ6UrolYjYU3gOFdBDuHEoIk6rNJc0aPbgkCRJkqaUmQcoH26sGW6MU9sM9qyKU64YbkhH2YNDkiRJmkK7NeWM0tMALy08hwroIdwwCJOOY8AhSZIkTeeTlN12kDSnYNxUcA4V0EO4YRAmbcAtKpIkSdI2Kp2a8lVPwRifzDwMnFxzSuAlBmHSiWwyKkmSJG0jM9co+9nZpqIj025Z+jR1q+LXq3wMwqQNWMEhSZIkbaGt3ii6NcVwY1za98QF1H1gbLghbcOAQ5IkSdraBYXHf0nh8dWhzHwIeEztaTHckLblFhVJkiRpExX6KxyOiFMLjq+OZOYR+ntAfGdEvKCnuaXR8BQVSZIkaXMlw41DhhvDl5l72x4sfYUb+w03pOkYcEiSJEkbyMyvlBw+Ik4rOL7mlJlXt1Ubr6a/yvf9EfGMnuaWRsceHJIkSdLGzi40bmLfjcFqT0fZB5ze81IOG25Is7GCQ5IkSTpOZt5Luaf2X42ImwqNrR1qKzYeBm6k/3DD7UvSDthkVJIkSTpO23OhxGfltYjYXWBc7VBm7gX+OcOobve0FGkOQ/ghliRJkgYjM99JmXAjgd8uMK5m1G5D+RDwdIbz0NdwQ5rTUH6YJUmSpEHIzIeAxxQYejUifMDYo8y8E/hpYDfDuhcy3JA64AVWkiRJOlap/gu/U2hcbWHAoca6BF5iXxZpfkP8AZckSZJ6U6j/RkaEDf4rmNh+8jSa13HI9zyGG1KHvMhKkiRJxypyQ5yZq5l5KDMfyMyrS8yxrDJzb2YeaMOpzwBn0dzrGG5IS2TIP/CSJElSVW2D0d+rOSVwCPhiRFxUcd5Ra6s0/gh4HsOv0tjISkTs6XsR0qKxB4ckSZJ01PMqzxfAacCFmZk0gQc0occDwNcNPhrtca7/gqaXxpgdjIgn9L0IaRGNLemUJEmSimqDhiGaDD++CHw6It7T43qKagONlwM/wXAbhM4igVsMrKRyxn6RkCRJkjo14IBjM+uVH4dpwo87AMZwI91uNfkzmrU/ETiFcW452Y79NqQKFu3CIUmSJM1lhAHHdvK4/3544n//HfC94//ArOFIW23xzE3+9XNpwguAPSxGNca0Evi+W1KkOpblwiJJkiRNpdAxsVo+CfxpRFzV90KkZWGTUUmSJOlYiQGH5uMpKVIPdvW9AEmSJGlgPtn3AjRaCVxiuCH1w2RakiRJOk5mrjD+40hVzxrwzkU+1UYaAys4JEmSpBO9jGObc0obSeDmiNhtuCH1zwoOSZIkaQOZ+Tngwr7XoUFK4JYxHMUrLRMDDkmSJGkTmfkQ8Ji+16HBMNiQBsyAQ5IkSdpCZh7B0weX3Spwq8GGNGz24JAkSZK20J6IsR97ciybBI4A74iIkww3pOGzgkOSJEmaQmbuBa7Ez9CLbg34dkSc1fdCJM3Gi7MkSZI0g8w8BJzS9zrUqQS+D7zb01Ck8TLgkCRJknYgM1dotnz7mXqcDDWkBWMPDkmSJGkH2r4Mu4CbaZpQ2qNj+NaA+2j6auyKiCcYbkiLw7RZkiRJ6khm3gz8PHBq+4/8vN2vpAk1vhYR5/S9GEllWcEhSZIkdSQiLoyI09vqgF3AO4CHaW6yVUcCB4GPtK/DSYYb0nIwUZYkSZIqysyrgTcCZ2KlR1ey/XppRNzU92Ik9cMLqSRJktSzzLwY+C3gXOBxWGm9lfUw4wfAJyLiqp7XI2kgDDgkSZKkAWv7evwD4Nk0x9MGy/M5fr1x6wrwPeB/GWhI2syyXBglSZKkhdJudXkZ8Fya7S4nc7TyY8yf81eBLwCf8oQTSbMY84VPkiRJ0hYmtr6s+/mJ/35S+7WRWe8Ttjsid6X9AjgAfB2apqwzziNJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJkiRJAv4/B0m3k86HgYgAAAAASUVORK5CYII=\"//@ sourceURL=d3-cloud-for-angular/images/1.png.js"
));
require.register("d3-cloud-for-angular/images/2.png.js", Function("exports, require, module",
"module.exports = \"data:image/png;base64,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\"//@ sourceURL=d3-cloud-for-angular/images/2.png.js"
));
require.register("d3-cloud-for-angular/images/bg.png.js", Function("exports, require, module",
"module.exports = \"data:image/png;base64,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\"//@ sourceURL=d3-cloud-for-angular/images/bg.png.js"
));










require.register("rogerz-control-panel-for-angular/template.html", Function("exports, require, module",
"module.exports = '<div id=\"side-bar\" ng-class=\"{inactive: inactive}\">\\n\
  <ul id=\"sb-hot-zone\">\\n\
    <li>\\n\
      <a id=\"sb-toggle\" ng-click=\"toggle()\">\\n\
        <i class=\"glyphicon glyphicon-cog\"></i>\\n\
      </a>\\n\
    </li>\\n\
  </ul>\\n\
  <ul id=\"sb-tabs\">\\n\
    <li ng-repeat=\"panel in panels\">\\n\
      <a ng-click=\"activate($index)\">\\n\
        <ni class=\"glyphicon {{panel.iconClass || \\'glyphicon-cog\\'}}\"></i>\\n\
      </a>\\n\
    </li>\\n\
  </ul>\\n\
</div>\\n\
<div id=\"control-panel\" ng-hide=\"inactive\">\\n\
  <div angular-bind-template=\"template\"></div>\\n\
</div>\\n\
';//@ sourceURL=rogerz-control-panel-for-angular/template.html"
));

require.register("rogerz-signature-api-legacy-for-angular/lib/panel.html", Function("exports, require, module",
"module.exports = '<ul class=\"list-group\">\\n\
  <li class=\"list-group-item\">\\n\
    <label>Server</label>\\n\
    <select ng-model=\"ctx.server\">\\n\
      <option ng-repeat=\"host in ctx.hosts\" value=\"{{host.address}}\">{{host.name}}</option>\\n\
    </select> {{ctx.server}}\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Event ID:</label>\\n\
    <input type=\"text\" ng-model=\"ctx.eventId\"></input>\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Polling interval:</label>\\n\
    <input type=\"range\" min=\"1000\" max=\"10000\" step=\"1000\" ng-model=\"ctx.pollInterval\"></input>{{ctx.pollInterval}}ms\\n\
  </li>\\n\
</ul>\\n\
';//@ sourceURL=rogerz-signature-api-legacy-for-angular/lib/panel.html"
));
require.register("d3-cloud-for-angular/panel.html", Function("exports, require, module",
"module.exports = '<ul class=\"list-group\">\\n\
  <li class=\"list-group-item\">\\n\
    <label>Draw interval:</label>\\n\
    <input type=\"range\" min=\"100\" max=\"5000\" step=\"100\" ng-model=\"ctx.drawInterval\"></input>{{ctx.drawInterval}}ms\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Transition:</label>\\n\
    <input type=\"range\" min=\"0.1\" max=\"2.0\" step=\"0.1\" ng-model=\"ctx.transPulseWidth\"></input>{{ctx.transPulseWidth * ctx.drawInterval}}ms\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Signature width:</label>\\n\
    <input type=\"range\" min=\"20\" max=\"200\" step=\"1\" ng-model=\"ctx.imgSize[0]\"></input>{{ctx.imgSize[0]}}\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Signature height:</label>\\n\
    <input type=\"range\" min=\"20\" max=\"200\" step=\"1\" ng-model=\"ctx.imgSize[1]\"></input>{{ctx.imgSize[1]}}\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Signature limits:</label>\\n\
    <input type=\"range\" min=\"100\" max=\"1000\" step=\"100\" ng-model=\"ctx.imgLimit\"></input>{{ctx.imgLimit}}\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <label>Blank reserved</label>\\n\
    <input type=\"range\" min=\"0.01\" max=\"0.20\" step=\"0.01\" ng-model=\"ctx.blankArea\"></input>{{ctx.blankArea * 100}}%\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <button class=\"btn btn-primary\" ng-click=\"ctx.connect()\">connect</button>\\n\
    <button class=\"btn btn-normal\" ng-click=\"ctx.simulate()\">simulate</button>\\n\
    <button class=\"btn btn-danger\" ng-click=\"ctx.reset()\">reset</button>\\n\
  </li>\\n\
  <li class=\"list-group-item\">\\n\
    <ul>\\n\
      <li>guests: {{ctx.stat.imgInPool || 0}}</li>\\n\
      <li>placed: {{ctx.stat.imgPlaced || 0}}</li>\\n\
      <li>failed: {{ctx.stat.imgFailed}}</li>\\n\
    </ul>\\n\
  </li>\\n\
</ul>\\n\
';//@ sourceURL=d3-cloud-for-angular/panel.html"
));
require.alias("mbostock-d3/d3.js", "d3-cloud-for-angular/deps/d3/d3.js");
require.alias("mbostock-d3/index-browserify.js", "d3-cloud-for-angular/deps/d3/index-browserify.js");
require.alias("mbostock-d3/index-browserify.js", "d3-cloud-for-angular/deps/d3/index.js");
require.alias("mbostock-d3/index-browserify.js", "d3/index.js");
require.alias("mbostock-d3/index-browserify.js", "mbostock-d3/index.js");
require.alias("rogerz-d3-cloud/d3.layout.cloud.js", "d3-cloud-for-angular/deps/d3-cloud/d3.layout.cloud.js");
require.alias("rogerz-d3-cloud/d3.layout.cloud.js", "d3-cloud-for-angular/deps/d3-cloud/index.js");
require.alias("rogerz-d3-cloud/d3.layout.cloud.js", "d3-cloud/index.js");
require.alias("mbostock-d3/d3.js", "rogerz-d3-cloud/deps/d3/d3.js");
require.alias("mbostock-d3/index-browserify.js", "rogerz-d3-cloud/deps/d3/index-browserify.js");
require.alias("mbostock-d3/index-browserify.js", "rogerz-d3-cloud/deps/d3/index.js");
require.alias("mbostock-d3/index-browserify.js", "mbostock-d3/index.js");
require.alias("jashkenas-underscore/underscore.js", "rogerz-d3-cloud/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "rogerz-d3-cloud/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("rogerz-d3-cloud/d3.layout.cloud.js", "rogerz-d3-cloud/index.js");
require.alias("samsonjs-format/format.js", "d3-cloud-for-angular/deps/format/format.js");
require.alias("samsonjs-format/format.js", "d3-cloud-for-angular/deps/format/index.js");
require.alias("samsonjs-format/format.js", "format/index.js");
require.alias("samsonjs-format/format.js", "samsonjs-format/index.js");
require.alias("jashkenas-underscore/underscore.js", "d3-cloud-for-angular/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "d3-cloud-for-angular/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("rogerz-control-panel-for-angular/index.js", "d3-cloud-for-angular/deps/control-panel-for-angular/index.js");
require.alias("rogerz-control-panel-for-angular/module.js", "d3-cloud-for-angular/deps/control-panel-for-angular/module.js");
require.alias("rogerz-control-panel-for-angular/services.js", "d3-cloud-for-angular/deps/control-panel-for-angular/services.js");
require.alias("rogerz-control-panel-for-angular/directives.js", "d3-cloud-for-angular/deps/control-panel-for-angular/directives.js");
require.alias("rogerz-control-panel-for-angular/index.js", "control-panel-for-angular/index.js");

require.alias("rogerz-signature-api-legacy-for-angular/lib/index.js", "d3-cloud-for-angular/deps/signature-api-legacy-for-angular/lib/index.js");
require.alias("rogerz-signature-api-legacy-for-angular/lib/index.js", "d3-cloud-for-angular/deps/signature-api-legacy-for-angular/index.js");
require.alias("rogerz-signature-api-legacy-for-angular/lib/index.js", "signature-api-legacy-for-angular/index.js");
require.alias("jashkenas-underscore/underscore.js", "rogerz-signature-api-legacy-for-angular/deps/underscore/underscore.js");
require.alias("jashkenas-underscore/underscore.js", "rogerz-signature-api-legacy-for-angular/deps/underscore/index.js");
require.alias("jashkenas-underscore/underscore.js", "jashkenas-underscore/index.js");
require.alias("component-querystring/index.js", "rogerz-signature-api-legacy-for-angular/deps/querystring/index.js");
require.alias("component-trim/index.js", "component-querystring/deps/trim/index.js");

require.alias("samsonjs-format/format.js", "rogerz-signature-api-legacy-for-angular/deps/format/format.js");
require.alias("samsonjs-format/format.js", "rogerz-signature-api-legacy-for-angular/deps/format/index.js");
require.alias("samsonjs-format/format.js", "samsonjs-format/index.js");
require.alias("rogerz-control-panel-for-angular/index.js", "rogerz-signature-api-legacy-for-angular/deps/control-panel-for-angular/index.js");
require.alias("rogerz-control-panel-for-angular/module.js", "rogerz-signature-api-legacy-for-angular/deps/control-panel-for-angular/module.js");
require.alias("rogerz-control-panel-for-angular/services.js", "rogerz-signature-api-legacy-for-angular/deps/control-panel-for-angular/services.js");
require.alias("rogerz-control-panel-for-angular/directives.js", "rogerz-signature-api-legacy-for-angular/deps/control-panel-for-angular/directives.js");

require.alias("rogerz-signature-api-legacy-for-angular/lib/index.js", "rogerz-signature-api-legacy-for-angular/index.js");
require.alias("d3-cloud-for-angular/index.js", "d3-cloud-for-angular/index.js");