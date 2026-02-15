import { redirect } from '@sveltejs/kit';
import type { Handle } from '@sveltejs/kit';

if (!process.env.GEMINI_API_KEY && process.env.NODE_ENV === 'production') {
	console.warn('GEMINI_API_KEY not set - live chat will use fallback mode');
}

/**
 * Server hooks for VCP Demo site
 * Includes redirects from retired demo URLs to consolidated demos
 */

// Redirect map: keys include both with and without trailing slash so lookups
// work regardless of whether SvelteKit's trailingSlash normalisation has run.
const RETIRED_DEMO_REDIRECTS: Record<string, string> = {};
const _redirectEntries: [string, string][] = [
	// Old concept demos → new persona wizards
	['/demos/learning/cognitive-load', '/demos/gentian/'],
	['/demos/learning/adaptive-paths', '/demos/gentian/'],
	['/demos/self-modeling/belief-calibration', '/demos/hana/'],
	['/demos/self-modeling/reality-grounding', '/demos/hana/'],
	['/demos/self-modeling/interiora', '/demos/hana/'],
	['/demos/multi-agent/negotiation', '/demos/ren/'],
	['/demos/multi-agent/auction', '/demos/ren/'],
	['/demos/multi-agent/policy-design', '/demos/noor/'],
	['/demos/safety/attention-protection', '/demos/'],
	['/demos/safety/mental-health', '/demos/'],
	['/demos/epistemics', '/demos/hana/'],
	// Old persona demo routes → new wizard routes
	['/professional', '/demos/campion/'],
	['/professional/audit', '/demos/campion/'],
	['/personal', '/demos/gentian/'],
	['/responsibility', '/demos/marta/'],
	// Old concept pages → demos hub
	['/adaptation', '/demos/'],
	['/coordination', '/demos/'],
	['/self-modeling', '/demos/'],
	['/psychosecurity', '/demos/'],
	['/sharing', '/demos/'],
	// Old doc routes → consolidated docs
	['/docs/personas', '/docs/concepts/']
];
for (const [from, to] of _redirectEntries) {
	RETIRED_DEMO_REDIRECTS[from] = to;
	// Also match the trailing-slash variant
	const withSlash = from.endsWith('/') ? from : from + '/';
	const withoutSlash = from.endsWith('/') ? from.slice(0, -1) : from;
	RETIRED_DEMO_REDIRECTS[withSlash] = to;
	RETIRED_DEMO_REDIRECTS[withoutSlash] = to;
}

export const handle: Handle = async ({ event, resolve }) => {
	const redirectTarget = RETIRED_DEMO_REDIRECTS[event.url.pathname];
	if (redirectTarget) {
		redirect(301, redirectTarget);
	}

	const response = await resolve(event);

	// Security headers on all responses
	response.headers.set('X-Frame-Options', 'DENY');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

	return response;
};
