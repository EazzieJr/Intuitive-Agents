<template>
	<div class="SmallTileCard cursor-pointer" @click="fetchData(status)">
		<div class="Top between">
			<p>
				{{ title }}
			</p>

			<div class="Image w-8 h-8 overflow-hidden">
				<img :src="`/svg/calls/${icon}.svg`" alt="">
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
import fetcher from "~/utils/fetcher"

export default {
	props: {
		title: String,
		icon: String,
		value: String | Number,
		status: String,
		agentId: String,
		duration: String
	},

	methods: {
		async fetchData(status) {
			this.$toast.open({
				message: `Populating KPI`,
				type: 'info',
				duration: 2000,
				dismissible: true,
				position: 'top'
			});

			console.log(this.duration)
			const response = await fetcher("/user/populate", "POST", {
				agentId: this.agentId,
				status: this.status,
				dateOption: "last-schedule"
			})
			this.$toast.open({
				message: `Populated KPI data`,
				type: 'success',
				duration: 2000,
				dismissible: true,
				position: 'top'
			});
			this.$emit("setUsers", response)

			console.log(response);
		}
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