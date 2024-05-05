<template>
	<div
		class="SchedularModel bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center">
		<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
			<h3 class="font-bold text-2xl text-center">
				Schedule a batch <br />
				call for later
			</h3>

			<button class="Close absolute right-5 top-5" @click="closeModal">
				<img src="/svg/close.svg" alt="" />
			</button>

			<div class="Schedular w-full space-y-5 mt-7">
				<div class="Selectors space-x-2 flex justify-center items-center">
					<!-- <select class="rounded-xl p-2.5 border border-[#C4C4C4] h-fit max-h-[100px] block w-[60px] text-center"
						value={selectedHours} onChange={handleHoursChange}>
						{[...Array(24).keys()].map((hour) => (
						<option key={hour} value={hour}>
							{hour > 9 ? "" : "0"}
							{hour}
						</option>
						))}
					</select> -->
					<USelectMenu size="lg" class="w-28 h-10" v-model="selectedHour" :options="[...Array(24).keys()]" placeholder="Hours" />

					<span class="block">:</span>

					<USelectMenu size="lg" class="w-28 h-10" v-model="selectedMinute" :options="[...Array(60).keys()]" placeholder="Minutes" />
					<!-- <select class="rounded-xl p-2.5 border border-[#C4C4C4] h-fit max-h-[100px] block w-[60px] text-center"
						value={selectedMinutes} onChange={handleMinutesChange}>
						{[...Array(60).keys()].map((minute) => (
						<option key={minute} value={minute}>
							{minute > 9 ? "" : "0"}
							{minute}
						</option>
						))}
					</select> -->

					<UInput size="lg" class="w-28 h-10" v-model="limit" placeholder="Limit" />
				</div>

				<button @click="schedule"
					class="Submit center py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-full" :disabled="loading">
					<span v-if="!loading">
						Schedule
					</span>

					<img class="animate-spin duration-1000 w-5" v-else src="/svg/loading.svg" alt="">
				</button>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		agentId: String,
		fromNumber: String
	},
	
	data() {
		return {
			limit: "",
			selectedHour: 0,
			selectedMinute: 0,
			loading: false
		}
	},

	methods: {
		closeModal() {
			this.$emit("close");
		},

		async schedule() {
			const { agentId, fromNumber, limit, selectedHour, selectedMinute } = this
			this.loading = true
			try {
				const response = await fetch("https://intuitiveagents.io/schedule", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						agentId,
						hour: selectedHour,
						minute: selectedMinute,
						limit,
						fromNumber
					})
				});

				this.loading = false
				this.closeModal()
				console.log(response);
			} catch (err) {
				console.log(err);
			}
		}
	}
}
</script>

<style>

</style>