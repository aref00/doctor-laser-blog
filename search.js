/**
 * دکتر لیزر — اسکریپت جستجوی مقالات وبلاگ
 * =========================================
 * - یک input واحد برای جستجو
 * - جستجو فقط در metadata: title, category, slug
 * - اگر input خالی باشد: نمایش latest posts (همان ترتیب blog.js)
 * - نتایج با همان کارت‌های style شده مثل blog.js رندر می‌شوند
 */

(function () {
	"use strict";

	function formatDate(iso) {
		if (!iso) return "";
		var parts = iso.split("-").map(Number);
		var date = new Date(parts[0], parts[1] - 1, parts[2]);
		return date.toLocaleDateString("fa-IR", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	}

	var CARD_VARIANTS = ["card--green", "card--purple", "card--teal", "card--rose"];
	var BADGE_VARIANTS = ["badge--green", "badge--purple"];

	function escapeHtml(str) {
		var s = String(str || "");
		return s
			.replace(/&/g, "&amp;")
			.replace(/</g, "<")
			.replace(/>/g, ">")
			.replace(/"/g, '"')
			.replace(/'/g, "&#39;");
	}

	function buildCard(post, index) {
		var variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
		var badge = BADGE_VARIANTS[index % BADGE_VARIANTS.length];

		var href = "posts/" + escapeHtml(post.slug);
		var image = "posts/" + escapeHtml(post.slug) + "/" + escapeHtml(post.image || "");
		var title = escapeHtml(post.title);
		var category = escapeHtml(post.category);
		var excerpt = escapeHtml(post.excerpt);
		var date = escapeHtml(formatDate(post.isoDate || post.date));
		var readTime = escapeHtml(post.readTime || "");

		return (
			'<article class="post-card ' +
			variant +
			'" role="article">' +
			'<a href="' +
			href +
			'" class="post-card__color-bar" aria-hidden="true" tabindex="-1"></a>' +
			(post.image
				? '<a href="' +
					href +
					'" class="post-card__image-link" aria-label="' +
					title +
					'">' +
					'<img class="post-card__image" src="' +
					image +
					'" alt="' +
					title +
					'" loading="lazy" />' +
					"</a>"
				: "") +
			'<div class="post-card__body">' +
			'<span class="badge ' +
			badge +
			'">' +
			category +
			"</span>" +
			'<h2 class="post-card__title">' +
			'<a href="' +
			href +
			'">' +
			title +
			"</a>" +
			"</h2>" +
			'<p class="post-card__excerpt">' +
			excerpt +
			"</p>" +
			"</div>" +
			'<footer class="post-card__footer">' +
			'<span class="post-card__date">' +
			'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
			'<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>' +
			'<line x1="16" y1="2" x2="16" y2="6"/>' +
			'<line x1="8" y1="2" x2="8" y2="6"/>' +
			'<line x1="3" y1="10" x2="21" y2="10"/>' +
			"</svg>" +
			"<span>" +
			date +
			"</span>" +
			"</span>" +
			(readTime
				? '<span class="post-card__readtime">' +
					'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
					'<circle cx="12" cy="12" r="10"/>' +
					'<polyline points="12 6 12 12 16 14"/>' +
					"</svg>" +
					"<span>" +
					readTime +
					"</span>" +
					"</span>"
				: "") +
			"</footer>" +
			"</article>"
		);
	}

	function renderEmpty(message) {
		var grid = document.getElementById("posts-grid");
		if (!grid) return;
		grid.innerHTML =
			'<div class="posts-empty">' +
			"<p>" +
			escapeHtml(message) +
			"</p>" +
			"</div>";
	}

	function renderPosts(posts) {
		var grid = document.getElementById("posts-grid");
		if (!grid) return;

		grid.innerHTML = posts.map(buildCard).join("\n");
	}

	function getLatestSorted(posts) {
		return posts
			.slice()
			.sort(function (a, b) {
				var dateA = a.isoDate || a.date || "";
				var dateB = b.isoDate || b.date || "";
				return new Date(dateB) - new Date(dateA);
			});
	}

	function normalize(str) {
		return String(str || "")
			.replace(/\s+/g, " ")
			.trim()
			.toLowerCase();
	}

	function filterPosts(posts, query) {
		// جستجو فقط در title, category, slug به صورت simple substring
		var q = normalize(query);
		if (!q) return getLatestSorted(posts);

		return posts.filter(function (post) {
			var title = normalize(post.title);
			var category = normalize(post.category);
			var slug = normalize(post.slug);

			return (
				title.indexOf(q) !== -1 ||
				category.indexOf(q) !== -1 ||
				slug.indexOf(q) !== -1
			);
		});
	}

	function getQueryParam() {
		try {
			var params = new URLSearchParams(window.location.search);
			return params.get("search") || "";
		} catch (e) {
			return "";
		}
	}

	function setQueryParam(nextQuery) {
		var url = new URL(window.location.href);
		var q = String(nextQuery || "").trim();
		if (q) {
			url.searchParams.set("search", q);
		} else {
			url.searchParams.delete("search");
		}
		window.history.replaceState({}, "", url.toString());
	}

	function init() {
		var input = document.getElementById("search-input");
		if (!input) return;

		var posts = window.POSTS;

		if (!posts || !Array.isArray(posts) || posts.length === 0) {
			renderEmpty("هنوز مقاله‌ای منتشر نشده — به زودی برمی‌گردیم!");
			return;
		}

		// رویلود با توجه به ?search=
		var initialQuery = getQueryParam();
		if (initialQuery) input.value = initialQuery;

		function run() {
			var query = input.value || "";
			var qTrimmed = query.trim();
			var result = filterPosts(posts, query);

			if (!qTrimmed) {
				// اگر input خالی بود: latest posts
				result = getLatestSorted(posts);
			}

			if (!result.length) {
				if (qTrimmed) renderEmpty("مقاله‌ای پیدا نشد");
				else renderEmpty("هنوز مقاله‌ای برای نمایش وجود ندارد");
				return;
			}

			// ترتیب جدیدترین اول مثل blog.js
			var latestSorted = getLatestSorted(result);
			renderPosts(latestSorted);
		}

		// Debounce + sync url
		var t;
		input.addEventListener("input", function () {
			clearTimeout(t);
			t = setTimeout(function () {
				setQueryParam(input.value);
				run();
			}, 120);
		});

		// initial render (اگر ?search= داشتیم، input پر شده و run همان را اعمال می‌کند)
		run();
	}

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
})();
