/*
 * Underscore.js mixin plugin
 * 
 * Require : underscore.js, moment.js
 * Author : Nuntawat C.
 */
_.mixin({

	compactObject : function(o) {
		_.each(o, function(v, k) {
			if (v !== 0) {
				if (!v)
					delete o[k];
			}
		});
		return o;
	},

	nullToEmpty : function(s) {
		if (!s && s!==0) {
			s = '';
		}
		return s;
	},

	toHttpGetUrl : function(url, objParams) {
		url += '?d='+moment().valueOf();
		
		_.compactObject(objParams);
		_.each(objParams, function(v, k) {
			url += '&'+k+'='+encodeURIComponent(v);
		});
		
		return url;
	},
	
	isBlank : function(val) {
		if (val === undefined || val === null || val === '') {
			return true;
		}
		else {
			return false;
		}
	},

	toDateTimeStr : function(d, f) {
		if (!d) {
			return '';
		}
		
		var w;
		if (f) {
			w = moment(d, f);
		} else {
			w = moment(d);
		}
		
		return w.format("DD/MM/YYYY HH:mm:ss");
	},
	
	toDateStr : function(d, f) {
		if (!d) {
			return '';
		}
		
		var w;
		if (f) {
			w = moment(d, f);
		} else {
			w = moment(d);
		}
		
		return w.format("DD/MM/YYYY");
	},
	
	getShowing : function(pageNumber, limit, total) {
		var showing = {};
		
		showing.start = ((pageNumber-1)*limit)+1;
		if (showing.start > total) {
			showing.start = total;
		}
		showing.end = pageNumber*limit;
		if (showing.end > total) {
			showing.end = total;
		}
		showing.total = total;
		
		return showing;
	}
});
