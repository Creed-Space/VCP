<script lang="ts">
	// Redirect handled by +page.server.ts (301 → creed.space/safety-index)
	// This page only renders if the server redirect somehow fails
	import { goto } from '$app/navigation';

	$effect(() => {
		goto('https://creed.space/safety-index', { replaceState: true });
	});
</script>

<div class="container" style="padding: 4rem 0; text-align: center;">
	<p>Redirecting to Creed Space Safety Index...</p>
	<p style="margin-top: 1rem;">
		<a href="https://creed.space/safety-index">Click here if not redirected</a>
	</p>
</div>
