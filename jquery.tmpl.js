;(function($){
	
	var templateSettings = {
		evaluate    : /<%([\s\S]+?)%>/g,
		interpolate : /<%=([\s\S]+?)%>/g
	};
	var escapes = {
		"'":      "'",
		'\\':     '\\',
		'\r':     'r',
		'\n':     'n',
		'\u2028': 'u2028',
		'\u2029': 'u2029'
	};
	
	var escaper = /\\|'|\r|\n|\u2028|\u2029/g;
	
	var escapeChar = function(match) {
		return '\\' + escapes[match];
	};
	
	var template = function(text) {

		var matcher = RegExp([
		  (templateSettings.interpolate || noMatch).source,
		  (templateSettings.evaluate || noMatch).source
		].join('|') + '|$', 'g');

		var index = 0;
		var source = "__p+='";
		text.replace(matcher, function(match,interpolate, evaluate, offset) {
			source += text.slice(index, offset).replace(escaper, escapeChar);
			index = offset + match.length;
			if (interpolate) {
				source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
			} else if (evaluate) {
				source += "';\n" + evaluate + "\n__p+='";
			}
			return match;
		});
		source += "';\n";

		if (!templateSettings.variable) source = 'with(obj||{}){\n' + source + '}\n';

		source = "var __t,__p='',__j=Array.prototype.join," +
		"print=function(){__p+=__j.call(arguments,'');};\n" +
		source + 'return __p;\n';

		try {
			var render = new Function(templateSettings.variable || 'obj', source);
		} catch (e) {
			e.source = source;
			throw e;
		}

		var template = function(data) {
			return render.call(this, data);
		};

		var argument = templateSettings.variable || 'obj';
		
		template.source = 'function(' + argument + '){\n' + source + '}';

		return template;
	};
	
	$.fn.extend({
		tmpl:function(data){
			var complier = template(this.html());
			var html = complier(data);
			var func = {
				html:function(selector){
					$(selector).html(html);
					return func;
				},
				append:function(selector){
					$(selector).append(html);
					return func;
				}
			};
			return func;
		}
	});
	$.extend({
		template:template
	});

})(jQuery);