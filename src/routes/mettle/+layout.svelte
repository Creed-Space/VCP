<script lang="ts">
	import { MettleHeader, MettleFooter } from '$lib/components/shared';

	let { children } = $props();
</script>

<MettleHeader />
{@render children()}
<MettleFooter />
