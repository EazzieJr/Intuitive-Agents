<template>
	<div class="Onboarding center h-screen">
		<div class="Layout mx-auto w-full max-w-[460px] space-y-10 p-12 pt-16 border border-gray-200 rounded-3xl shadow-md bg-[#fafafa]">
			<header class="w-full space-y-2.5">
				<h1 class="font-bold text-4xl text-[#010101]">
					{{ page.title }}
				</h1>

				<p class="text-[#010101]">
					{{ page.hint }}
				</p>
			</header>

			<main>
				<slot />
			</main>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			page: {
				title: null,
				hint: null,
			}
		}
	},

	watch: {
		'$route': {
			immediate: true,
			handler: 'updatePageData'
		}
	},

	methods: {
		updatePageData() {
			this.page = {
				title: this.$route?.meta?.title,
				hint: this.$route?.meta?.hint?.replace(
					`$${this.$route.meta?.hintPlaceholder}`,
					this.$route.query[this.$route.meta?.hintPlaceholder]
				),
				// options: this.$route?.meta?.hintOptions
			}
		},
	},
}
</script>

<style lang="postcss" scoped>
.Onboarding {
	@apply w-full h-screen bg-[#ececec];
}
</style>