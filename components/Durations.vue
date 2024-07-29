<template>
	<div class="Durations">
		<button v-for="duration in durations" :key="duration.value" class="Duration"
			:class="{ 'selected': selectedDuration == duration.value }" @click="selectDuration(duration.value)">
			{{ duration.title }}
		</button>
	</div>
</template>

<script>
export default {
	data() {
		return {
			durations: [
				{
					title: "Last schedule",
					value: "last schedule"
				},

				{
					title: "24 hours",
					value: "today"
				},

				{
					title: "7 days",
					value: "week"
				},

				{
					title: "1 month",
					value: "month"
				},

				{
					title: "Total",
					value: "total"
				}
			],

			selectedDuration: "week",

		}
	},

	methods: {
		selectDuration(value) {
			this.selectedDuration = value;

			this.fetchData(value);
		},

		fetchData(value) {
			this.$emit('fetchData', 1, value);
		}
	}
}
</script>

<style lang="postcss" scoped>
.Durations {
	@apply border border-gray-200 flex divide-x divide-gray-200 overflow-hidden rounded-lg w-fit;
	box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);

	button {
		@apply text-xs xl:text-base !leading-[142%] text-[#344054] font-medium py-2 xl:py-2.5 px-3.5 xl:px-4;

		&.selected {
			@apply text-[#1D2939] bg-[#F3F4F6]
		}
	}
}
</style>