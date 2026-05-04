/**
 * دکتر لیزر — اسکریپت لیست مقالات وبلاگ
 * window.POSTS را از posts/registry.js می‌خواند و کارت‌ها را در #posts-grid رندر می‌کند.
 */

(function () {
	"use strict";

	/* ── کمک‌های عمومی ───────────────────────────────────────────────── */

	/**
	 * تاریخ ISO را به شکل فارسی نمایش می‌دهد.
	 * @param {string} iso — رشته YYYY-MM-DD
	 * @returns {string}
	 */
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

	// رنگ‌بندی متناوب کارت‌ها
	var CARD_VARIANTS = [
		"card--green",
		"card--purple",
		"card--teal",
		"card--rose",
	];

	// رنگ‌بندی متناوب بج‌ها
	var BADGE_VARIANTS = ["badge--green", "badge--purple"];

	function escapeHtml(str) {
		return String(str)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	/* ── سازنده کارت ─────────────────────────────────────────────────── */

	function buildCard(post, index) {
		var variant = CARD_VARIANTS[index % CARD_VARIANTS.length];
		var badge = BADGE_VARIANTS[index % BADGE_VARIANTS.length];
		var href = "posts/" + escapeHtml(post.slug);
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

	/* ── منوی موبایل ─────────────────────────────────────────────────── */

	function initMobileNav() {
		var toggle = document.getElementById("nav-toggle");
		var menu = document.getElementById("nav-menu");
		if (!toggle || !menu) return;

		toggle.addEventListener("click", function () {
			var isOpen = menu.classList.toggle("nav__menu--open");
			toggle.setAttribute("aria-expanded", String(isOpen));
			toggle.classList.toggle("nav-toggle--open", isOpen);
		});

		// بستن با کلیک خارج از منو
		document.addEventListener("click", function (e) {
			if (!toggle.contains(e.target) && !menu.contains(e.target)) {
				menu.classList.remove("nav__menu--open");
				toggle.setAttribute("aria-expanded", "false");
				toggle.classList.remove("nav-toggle--open");
			}
		});
	}

	/* ── رندر اصلی ───────────────────────────────────────────────────── */

	function render() {
		var grid = document.getElementById("posts-grid");
		if (!grid) return;

		var posts = window.POSTS;

		// حالت fallback — اگر مقاله‌ای تعریف نشده باشد
		if (!posts || !Array.isArray(posts) || posts.length === 0) {
			grid.innerHTML =
				'<div class="posts-empty">' +
				"<p>هنوز مقاله‌ای منتشر نشده — به زودی برمی‌گردیم!</p>" +
				"</div>";
			return;
		}

		// مرتب‌سازی بر اساس isoDate (جدیدترین اول)
		var sorted = posts.slice().sort(function (a, b) {
			var dateA = a.isoDate || a.date || "";
			var dateB = b.isoDate || b.date || "";
			return new Date(dateB) - new Date(dateA);
		});

		grid.innerHTML = sorted.map(buildCard).join("\n");
	}

	/* اجرا پس از آماده شدن DOM */
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", function () {
			render();
			initMobileNav();
		});
	} else {
		render();
		initMobileNav();
	}
})();
