/*!
 * jQuery serializeObject
 * http://github.com/macek/jquery-serialize-object
 */
(function e$$0(f, g, a) {
    function c(b, k) {
        if (!g[b]) {
            if (!f[b]) {
                var h = "function" == typeof require && require;
                if (!k && h) return h(b, !0);
                if (d) return d(b, !0);
                throw Error("Cannot find module '" + b + "'");
            }
            h = g[b] = {
                exports: {}
            };
            f[b][0].call(h.exports, function(a) {
                var d = f[b][1][a];
                return c(d ? d : a)
            }, h, h.exports, e$$0, f, g, a)
        }
        return g[b].exports
    }
    for (var d = "function" == typeof require && require, b = 0; b < a.length; b++) c(a[b]);
    return c
})({
    1: [function(e, f, g) {
        e = f.exports = function(a) {
            this._helper = a;
            this._object = {};
            this._pushes = {};
            this._patterns = {
                validate: /^[a-z][a-z0-9_]*(?:\[(?:\d*|[a-z0-9_]+)\])*$/i,
                key: /[a-z0-9_]+|(?=\[\])/gi,
                push: /^$/,
                fixed: /^\d+$/,
                named: /^[a-z0-9_]+$/i
            }
        };
        e.prototype._build = function(a, c, d) {
            a[c] = d;
            return a
        };
        e.prototype._makeObject = function(a, c) {
            for (var d = a.match(this._patterns.key), b; void 0 !== (b = d.pop());) this._patterns.push.test(b) ? (b = this._incrementPush(a.replace(/\[\]$/, "")), c = this._build([], b, c)) : this._patterns.fixed.test(b) ? c = this._build([], b, c) : this._patterns.named.test(b) && (c = this._build({}, b, c));
            return c
        };
        e.prototype._incrementPush =
            function(a) {
                void 0 === this._pushes[a] && (this._pushes[a] = 0);
                return this._pushes[a] ++
            };
        e.prototype.addPair = function(a) {
            if (!this._patterns.validate.test(a.name)) return this;
            a = this._makeObject(a.name, a.value);
            this._object = this._helper.extend(!0, this._object, a);
            return this
        };
        e.prototype.addPairs = function(a) {
            if (!this._helper.isArray(a)) throw Error("formSerializer.addPairs expects an Array");
            a.forEach(this.addPair.bind(this));
            return this
        };
        e.prototype.serialize = function() {
            return this._object
        };
        e.prototype.serializeJSON =
            function() {
                return JSON.stringify(this.serialize())
            }
    }, {}],
    2: [function(e, f, g) {
        f.exports = function(a) {
            if ("function" === typeof a.extend) this.extend = a.extend;
            else throw Error("jQuery is required to use jquery-serialize-object");
            this.isArray = "function" === typeof Array.isArray ? Array.isArray : function(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }
        }
    }, {}],
    3: [function(e, f, g) {
        var a = e("./form-serializer"),
            c = e("./helper");
        (function(d) {
            var b = new c(d || {});
            d.fn.serializeObject = function() {
                var c = d(this);
                return 1 < c.length ? Error("jquery-serialize-object can only serialize one form at a time") : (new a(b)).addPairs(c.serializeArray()).serialize()
            }
        })(jQuery)
    }, {
        "./form-serializer": 1,
        "./helper": 2
    }]
}, {}, [3]);
