/**
 * SEO Utility helpers
 */

export function getCanonicalURL(
	pathname: string,
	site: URL | string | undefined,
): URL {
	return new URL(pathname, site);
}

export function getSocialImageURL(
	image: string,
	site: URL | string | undefined,
): URL {
	return new URL(image, site);
}
