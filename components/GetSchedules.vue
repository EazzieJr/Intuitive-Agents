<template>
	<div
		class="SchedularModel bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 center">
		<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
			<h3 class="font-bold text-2xl text-center">Schedules</h3>

			<button class="Close absolute right-5 top-5" @click="closeModal">
				<img src="/svg/close.svg" alt="" />
			</button>

			<div class="w-full mt-5 space-y-5">
				<header class="w-full flex items-center rounded-2xl px-3 py-2.5 bg-[#dbdada] text-sm font-semibold">
					<span class="basis-[10%]">S/N</span>

					<span class="basis-[50%] pl-2.5">Time</span>

					<span class="basis-[30%]">Status</span>

					<span class="basis-[20%]">Action</span>
				</header>

				<div class="Container w-full h-fit max-h-[300px] overflow-auto">
					<div v-if="loading" class="Loading h-[100px] w-full flex items-center justify-center">
						<span class="block animate-pulse duration-500 text-sm font-semibold text-black italic">
							Fetching Schedules...
						</span>
					</div>

					<div class="Schedules">
						<div v-for="(schedule, index) in schedules" :key="index"
							class="Shedule flex items-center px-3 py-2.5 text-xs border-b border-[#dbdada]">
							<span class="basis-[10%]">{{ index + 1 }}</span>

							<span class="basis-[50%] pl-2.5">
								{{ moment(schedule.scheduledTime).calendar() }}
							</span>

							<span class="basis-[30%]">
								<span class="basis-[30%] px-1.5 py-1 rounded-full capitalize font-medium"
									:class="schedule.callstatus === 'Called' ? 'bg-[#ECFDF3] text-[#027A48]' : schedule.callstatus === 'calling' ? 'bg-green-500 text-white animate-pulse' : schedule.callstatus === 'cancelled' ? 'bg-red-300 text-white' : ''">
									{{ schedule.callstatus }}
								</span>
							</span>

							<button
								class="basis-[20%] disabled:bg-opacity-50 bg-red-500 rounded-full py-1 text-white text-xs !w-fit block font-medium"
								@click="endSchedule(schedule.jobId, schedule.callstatus)"
								:disabled="schedule.callstatus === 'Called' || schedule.callstatus === 'cancelled'">
								End
							</button>
						</div>

						<div v-if="!loading && schedules?.length === 0" class="NoSchedule h-[100px] w-full flex items-center justify-center">
							<span class="block text-sm font-semibold text-black">
								No Schedule Available
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from 'moment-timezone';
export default {
	props: {
		agentId: String
	},

	data() {
		return {
			loading: true,
			tempSchedules: [],
			moment
			// schedules: []
		}
	},

	computed: {
		schedules() {
			const filteredData = this.tempSchedules?.filter((schedule) => schedule.agentId === this.agentId);

			console.log("filtered :", filteredData);
			return filteredData;
		}
	},

	methods: {
		async getSchedules() {
			try {
				const response = await fetch(
					"https://intuitiveagents.io/schedules/get",
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json"
						}
					}
				)

				const schedules = await response.json();
				console.log("Schedules: ", schedules);
				this.loading = false
				this.tempSchedules = schedules.result;
			} catch (error) {
				console.log(error)
			}
		},
		
		async endSchedule(jobId, status) {
			try {
				// Use fetch

				const response = await fetch(
					`https://intuitiveagents.io/${status.toLowerCase() === "calling" ? "stop-job" : "cancel-schedule"}`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							jobId
						})
					}
				);

				const schedules = await response.json();
				// const response = await axios.post(
				// 	`https://intuitiveagents.io/${status.toLowerCase() === "calling" ? "stop-job" : "cancel-schedule"
				// 	}`,
				// 	{
				// 		jobId,
				// 	}
				// );


				// console.log(response);
			} catch (error) {
				console.error(error);
			}
		},

		closeModal() {
			this.$emit("closeSchedular")
		}
	},

	mounted() {
		this.getSchedules()
	}
}
</script>

<style></style>