// Tweet Size Template Engine
// See: http://mir.aculo.us/2011/03/09/little-helpers-a-tweet-sized-javascript-templating-engine/
/* function tweetTpl(s,d) {
	for(var p in d)
		s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
	return s;
} */

window.tweetTpl = function(s,d) {
	for(var p in d)
		s=s.replace(new RegExp('{'+p+'}','g'), d[p]);
	return s;
};