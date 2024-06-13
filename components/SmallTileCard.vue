<template>
	<div class="SmallTileCard">
		<div class="Top between">
			<p>
				{{ title }}
			</p>

			<div class="Image w-10 h-10 overflow-hidden">
				<img :src="`/svg/${icon}.svg`" alt="">
				</div>
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
	@apply p-5 bg-white rounded-xl border border-gray-200 space-y-3 w-[280px] text-black;

	.Top {
		p {
			@apply text-base font-semibold
		}

		img {
			@apply w-full h-full object-cover object-center
		}
	}

	.Bottom {
		span {
			@apply block text-4xl font-bold
		}
	}
}
</style>