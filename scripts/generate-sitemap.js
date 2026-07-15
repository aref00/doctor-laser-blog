/**
 * generate-sitemap-v3.js
 * -----------------------
 * Generates sitemap.xml for the blog using posts/registry.js
 *
 * Output: ./sitemap.xml
 *
 * Usage:
 *   node scripts/generate-sitemap-v3.js
 *
 * Optional:
 *   SITE_URL="https://example.com" node scripts/generate-sitemap-v3.js
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

function readRegistryPosts(registryFilePath) {
	const code = fs.readFileSync(registryFilePath, "utf8");

	const context = { window: {} };
	vm.createContext(context);
	vm.runInContext(code, context);

	const posts = context.window.POSTS;
	if (!Array.isArray(posts)) {
		throw new Error(
			"Expected window.POSTS to be an array in " + registryFilePath
		);
	}

	return posts;
}

function escapeXmlBasic(str) {
	// Sitemap values only need to escape XML special chars.
	// Avoid escaping quotes to prevent tooling issues in this environment.
	return String(str).replace(/&/g, "&amp;").replace(/</g, "<").replace(/>/g, ">");
}

function formatLastMod(post) {
	const iso = post && typeof post.isoDate === "string" ? post.isoDate : "";
	if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
	return undefined;
}

function main() {
	const SITE_URL = process.env.SITE_URL || "https://doctor-laser.ir";
	const BLOG_BASE_PATH = "/blog";

	const registryFilePath = path.join(process.cwd(), "posts", "registry.js");
	const outFilePath = path.join(process.cwd(), "sitemap.xml");

	const posts = readRegistryPosts(registryFilePath);

	const sorted = posts.slice().sort((a, b) => {
		const da =
			a && (a.isoDate || a.date) ? new Date(a.isoDate || a.date) : new Date(0);
		const db =
			b && (b.isoDate || b.date) ? new Date(b.isoDate || b.date) : new Date(0);
		return db - da;
	});

	const urls = [];

	urls.push({
		loc: SITE_URL + BLOG_BASE_PATH + "/",
		lastmod: undefined,
		priority: "1.0",
		changefreq: "weekly",
	});

	urls.push({
		loc: SITE_URL + BLOG_BASE_PATH + "/search.html",
		lastmod: undefined,
		priority: "0.4",
		changefreq: "monthly",
	});

	for (const post of sorted) {
		if (!post || !post.slug) continue;

		urls.push({
			loc: SITE_URL + BLOG_BASE_PATH + "/posts/" + post.slug + "/",
			lastmod: formatLastMod(post),
			priority: "0.6",
			changefreq: "monthly",
		});
	}

	const lines = [];
	lines.push('<?xml version="1.0" encoding="UTF-8"?>');
	lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');

	for (const u of urls) {
		lines.push("  <url>");
		lines.push("    <loc>" + escapeXmlBasic(u.loc) + "</loc>");
		if (u.lastmod) {
			lines.push(
				"    <lastmod>" + escapeXmlBasic(u.lastmod) + "</lastmod>"
			);
		}
		lines.push(
			"    <changefreq>" + escapeXmlBasic(u.changefreq) + "</changefreq>"
		);
		lines.push(
			"    <priority>" + escapeXmlBasic(u.priority) + "</priority>"
		);
		lines.push("  </url>");
	}

	lines.push("</urlset>");

	fs.writeFileSync(outFilePath, lines.join("\n") + "\n", "utf8");
	console.log("Sitemap generated: " + outFilePath + " (" + urls.length + " URLs)");
}

main();
