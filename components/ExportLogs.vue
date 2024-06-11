<template>
	<div class="Exp start space-x-2.5">
		<vue-date-picker v-model="date" mode="date" range></vue-date-picker>

		<UDropdown class="shrink-0" :items="items" :popper="{ placement: 'bottom-start' }">
			<button class="Download p-[2px] relative">
				<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

				<div
					class="start space-x-3.5 px-4 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
					<img class="w-5" src="/svg/download.svg" alt="">

					<span class="text-sm" :class="{ 'animate-pulse': exporting }">
						{{ exporting ? "Exporting" : "Download" }} CSV
					</span>
				</div>
			</button>
		</UDropdown>
	</div>
</template>

<script>
import Filesaver from 'file-saver'

export default {
	props: {
		agentId: String,
		agentName: String
	},

	data() {
		return {
			exporting: false,
			items: [
				[{
					label: 'All',
					click: () => {
						this.exportLogs('All')
					}
				}, {
					label: 'Called',
					click: () => {
						this.exportLogs('Called')
					}
				}, {
					label: 'Scheduled',
					click: () => {
						this.exportLogs('', 'Scheduled')
					}
				}], [{
					label: 'Interested',
					click: () => {
						this.exportLogs('', 'Interested')
					}
				}, {
					label: 'Incomplete call',
					Click: () => {
						this.exportLogs('', 'Incomplete call')
					}
				}], [{
					label: 'Voicemail',
					click: () => {
						this.exportLogs('vm')
					}
				}, {
					label: 'Uninterested',
					click: () => {
						this.exportLogs('', 'Uninterested')
					}
				}], [{
					label: 'Not called',
					click: () => {
						this.exportLogs('notCalled')
					}
				}, {
					label: 'Failed',
					click: () => {
						this.exportLogs('Failed')
					}
				}]
			],

			date: []
		}
	},

	methods: {
		async exportLogs(statusOption, sentimentOption) {
			const date = new Date().toISOString().split("T")[0];
			this.exporting = true

			try {
				const response = await fetch(`https://intuitiveagents.io/call-logs-csv`, {
					method: "POST",
					body: JSON.stringify({
						agentId: this.agentId,
						statusOption,
						sentimentOption: sentimentOption ? sentimentOption : null,
						startDate: this.date[0] || "",
						endDate: this.date[1] || "",
						// limit,
					}),
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const logs = await response.text();
				const blob = new Blob([logs], { type: "text/csv;charset=utf-8" });
				Filesaver.saveAs(blob, `logs-${this.agentName}-${date}.csv`);
				this.exporting = false;
			} catch (error) {
				console.error("Error fetching data:", error);
				// Return an empty object or handle the error as needed
				this.users = [];
			}

			// } catch (err) {
			// 	//console.log(err);
			// }
		}
	}
}
</script>

<style lang="postcss" scoped>
.Exp {
}
</style>