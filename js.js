function unshittify() {
	'use strict';
	var papers = [
		['nrc.nl', ":not(body)[data-article-type],.nmt-item--latest-news,article.vorm__article,li[data-article-type]"],
		['parool.nl', "[data-topic],article#article-content > *,.section__header"],
		['volkskrant.nl',"[data-topic],article#article-content > *,.section__header"],
		['trouw.nl',"[data-topic],article#article-content > *,.section__header"],
		['ad.nl',".ankeiler,li.tile,.article,.comments__list-item"],
		['nos.nl',".ewQaSS,li[class^='sc-'],html:has([content='article']) main,html:has([content='video']) main"],
		['telegraaf.nl',"[data-vr-contentbox],.EditorsChoiceTeaser,.ColumnsTeaser"],
		['demorgen.be',"[data-topic],article#article-content > *,.section__header"],
		['standaard.be',"[data-mht-block] > div,[data-testid='article-teaser-list-item'],[data-mht-block='article-detail__article-body']"],
		['theguardian.com', "li[class^='dcr-'],article[class^='dcr-'],h2[class^='dcr-']"],
		['nytimes.com', ".story-wrapper,a[class*='css-']"],
		['edition.cnn.com','.container_lead-package,.container__item,h1#maincontent,main.article__main'],
		['foxnews.com','article[class*="article"]:not(.article-wrap),.article-wrap .article-header, .article-wrap .article-content, .recommended-item'],
		['washingtonpost.com','[data-feature-id="homepage/story"],[aria-roledescription="slide"],[data-link-group="live-bar"] > li,.page-type--story-default header,.grid-main-standard article,[data-fy-surface="post-recommends-list"] li']
	];
	var words = ['trump','wilders','musk'];
	var i = 0;
	while (i < papers.length) {
		var url = 'https://www.' + papers[i][0];
		var url1 = 'https://' + papers[i][0];
		var qs = document.querySelectorAll(papers[i][1]);
		if( window.location.origin == url || window.location.origin == url1 ) {
			doIt(qs,words);
		}
		i++;
	}


}

unshittify();
setTimeout(function(){unshittify()},500);
setTimeout(function(){unshittify()},1500);

function doIt(para,words) {
	var i = 0;
	while(i < para.length) {
		if(checkWord(para[i],words)) {
			replaceShittyElement(para[i]);
		}
		i++;
	}
}

function replaceShittyElement(para){
	para.innerHTML = '<div></div>';
	para.style.background = 'hsl('+getRandomInt(1,360)+', 50%, 50%)';
	para.style.position = 'relative';
	para.style.overflow = 'hidden';
	para.style.minHeight = '100px';
	para.querySelector('div').style.background = 'hsl('+getRandomInt(1,360)+', 50%, 50%)';
	para.querySelector('div').style.position = 'absolute';
	var w = getRandomInt(10,90);
	var h = getRandomInt(10,90);
	para.querySelector('div').style.width = w + '%';
	para.querySelector('div').style.height = h + '%';
	para.querySelector('div').style.top = getRandomInt(5,(95-h)) + '%';
	para.querySelector('div').style.left = getRandomInt(5,(95-w)) + '%';
}


function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
function checkWord(p,arr) {
	var ll = arr.length;
	var i = 0;
	while (i < ll) {
		if (p.innerText && p.innerText.toLowerCase().includes(arr[i])) {
			return true;
		}
		i++;
	}
}