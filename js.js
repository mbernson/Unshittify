(() => {
	'use strict';

	// [hostname without www., selector for the news items on that site]
	const papers = [
		['nrc.nl', ":not(body)[data-article-type],.nmt-item--latest-news,article.vorm__article,li[data-article-type]"],
		['parool.nl', "[data-topic],article#article-content > *,.section__header"],
		['volkskrant.nl',"[data-topic],article#article-content > *,.section__header"],
		['trouw.nl',"[data-topic],article#article-content > *,.section__header"],
		['ad.nl',".ankeiler,li.tile,.article,.comments__list-item"],
		['nos.nl',".ewQaSS,li[class^='sc-'],html:has([content='article']) main,html:has([content='video']) main"],
		['nu.nl',".contentlist__item,[data-gtm='article']"],
		['telegraaf.nl',"[data-vr-contentbox],.EditorsChoiceTeaser,.ColumnsTeaser"],
		['demorgen.be',"[data-topic],article#article-content > *,.section__header"],
		['standaard.be',"[data-mht-block] > div,[data-testid='article-teaser-list-item'],[data-mht-block='article-detail__article-body']"],
		['theguardian.com', "li[class^='dcr-'],article[class^='dcr-'],h2[class^='dcr-']"],
		['nytimes.com', ".story-wrapper,a[class*='css-']"],
		['edition.cnn.com','.container_lead-package,.container__item,h1#maincontent,main.article__main'],
		['foxnews.com','article[class*="article"]:not(.article-wrap),.article-wrap .article-header, .article-wrap .article-content, .recommended-item'],
		['washingtonpost.com','[data-feature-id="homepage/story"],[aria-roledescription="slide"],[data-link-group="live-bar"] > li,.page-type--story-default header,.grid-main-standard article,[data-fy-surface="post-recommends-list"] li']
	];
	// Whole words only, so "muskiet" is left alone. The optional s catches Dutch possessives like "Trumps".
	const words = /\b(trump|wilders|musk)s?\b/i;

	const paper = papers.find(([host]) => host === location.hostname.replace(/^www\./, ''));
	if (!paper) return;
	const selector = paper[1];

	// Covers the item with a coloured block (styled in unshittify.css). The page's own
	// markup is left in place, so sites that re-render it don't break.
	function cover(item) {
		const w = random(10, 90), h = random(10, 90);
		item.style.setProperty('--unshittify-outer', `hsl(${random(1, 360)}, 50%, 50%)`);
		item.style.setProperty('--unshittify-inner', `hsl(${random(1, 360)}, 50%, 50%)`);
		item.style.setProperty('--unshittify-width', w + '%');
		item.style.setProperty('--unshittify-height', h + '%');
		item.style.setProperty('--unshittify-top', random(5, 95 - h) + '%');
		item.style.setProperty('--unshittify-left', random(5, 95 - w) + '%');
		item.dataset.unshittified = '';
		item.inert = true;
	}

	function check(item) {
		if (!item.closest('[data-unshittified]') && words.test(item.textContent)) cover(item);
	}

	// The items in and around a changed node. A change inside an item can be the text
	// that only now makes it mention a name, so the item's ancestors count as well.
	function itemsAround(node) {
		const el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
		if (!el) return [];
		const items = [...el.querySelectorAll(selector)];
		for (let item = el.closest(selector); item; item = item.parentElement?.closest(selector)) items.push(item);
		return items;
	}

	// Changes are collected and handled once per frame, before the page is painted.
	const changed = new Set();
	function queue(node) {
		if (!changed.size) requestAnimationFrame(scan);
		changed.add(node);
	}
	function scan() {
		const items = new Set();
		changed.forEach(node => itemsAround(node).forEach(item => items.add(item)));
		changed.clear();
		items.forEach(check);
	}

	// The script runs at document_start, so this sees every item as it is parsed or added later.
	new MutationObserver(records => records.forEach(record => {
		if (record.type === 'characterData') queue(record.target);
		record.addedNodes.forEach(queue);
	})).observe(document.documentElement, {childList: true, subtree: true, characterData: true});
	queue(document.documentElement);

	function random(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();
