<template>
	<div class="SmallTileCard">
		<div class="Top between">
			<p>
				{{ title }}
			</p>

			<img :src="`/svg/${icon}.svg`" alt="">
		</div>

		<div class="Bottom">
			<span>
				{{ value }}
			</span>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		title: String,
		icon: String,
		value: String | Number
	}
}
</script>

<style lang="postcss" scoped>
.SmallTileCard {
	@apply p-5 bg-white rounded-xl border border-gray-200 space-y-3 w-[250px] text-black;

	.Top {
		p {
			@apply text-base font-semibold
		}

		img {
			@apply w-5
		}
	}

	.Bottom {
		span {
			@apply block text-4xl font-bold
		}
	}
}
</style>