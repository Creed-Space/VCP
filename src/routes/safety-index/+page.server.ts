import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Redirect to Creed Space main site - Safety Index is a product page, not a VCP demo
	throw redirect(301, 'https://creed.space/safety-index');
};
