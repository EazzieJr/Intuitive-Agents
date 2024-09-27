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
					<USelectMenu size="lg" class="w-28 h-10" v-model="selectedHour" :options="[...Array(24).keys()]"
						placeholder="Hours" />

					<span class="block">:</span>

					<USelectMenu size="lg" class="w-28 h-10" v-model="selectedMinute" :options="[...Array(60).keys()]"
						placeholder="Minutes" />
					<UInput size="lg" class="w-28 h-10" v-model="limit" placeholder="Limit" />
				</div>

				<div class="Tag">
					<!-- <div class="Input border rounded-lg overflow-hidden">
						<UInput size="lg" color="white" placeholder="Tag to call"
							v-model="tag" type="text" />
					</div> -->
					<UDropdown :items="tags" class="capitalize" :popper="{ placement: 'bottom-start' }">
						<UButton size="lg" color="white" :label="tag ? tag : 'Tag to schedule'"
							trailing-icon="i-heroicons-chevron-down-20-solid" class="!capitalize" />
					</UDropdown>
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
import fetcher from "@/utils/fetcher";

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
			loading: false,
			tag: "",
			tags: [[]]
		}
	},

	methods: {
		closeModal() {
			this.$emit("close");
		},

		async schedule() {
			const { agentId, fromNumber, limit, selectedHour, selectedMinute, tag } = this
			this.loading = true

			const response = await fetcher("/schedule", "POST", {
				agentId, tag,
				hour: selectedHour,
				minute: selectedMinute,
				limit,
				fromNumber
			})

			this.$toast.open({
				message: `Scheduled successfully`,
				type: 'success',
				duration: 5000,
				dismissible: true,
				position: 'top'
			});

			this.loading = false
			this.closeModal()
			//// console.log(response)		

			// try {
			// 	const response = await fetch("https://intuitiveagents.io/schedule", {
			// 		method: "POST",
			// 		headers: {
			// 			"Content-Type": "application/json"
			// 		},
			// 		body: JSON.stringify({
			// 			agentId,
			// 			hour: selectedHour,
			// 			minute: selectedMinute,
			// 			limit,
			// 			fromNumber
			// 		})
			// 	});

			// 	this.loading = false
			// 	this.closeModal()
			// 	// console.log(response);
			// } catch (err) {
			// 	// console.log(err);
			// }
		},

		async getTags() {
			this.$toast.open({
				message: `Fetching tags...`,
				type: 'info',
				duration: 2000,
				dismissible: true,
				position: 'top'
			});

			const response = await fetcher("/get-tags", "POST", {
				agentId: this.agentDetails.id
			})
			// this.tags = response
			this.$toast.open({
				message: `Fetched tags successfully`,
				type: 'success',
				duration: 2000,
				dismissible: true,
				position: 'top'
			});


			response.payload.forEach(tag => {
				const tagExists = this.tags[0].some(existingTag => existingTag.label === tag);

				if (tagExists) {
					console.log("Tag already exists, returning");
					return; // Skip if the tag already exists
				}
				this.tags[0].push({
					label: tag,
					click: async () => {
						this.tag = tag
						this.fetching = true

						this.$toast.open({
							message: `Searching by Tag - ${this.tag}`,
							type: 'info',
							duration: 10000,
							dismissible: true,
							position: 'top'
						});

						const searchResponse = await fetcher(`/search`, "POST", {
							searchTerm: "",
							agentId: this.agentDetails.id,
							tag
						});

						this.$toast.open({
							message: `Search by Tag - ${this.tag} successful`,
							type: 'success',
							duration: 2000,
							dismissible: true,
							position: 'top'
						});

						// console.log("Search Response: ", searchResponse);
						this.searches = searchResponse;
					}
				})
			})
		}
	},

	mounted() {
		this.getTags()
	}
}
</script>

<style></style>