<template>
	<button class="Download p-[3px] relative" @click="exportLogs">
		<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

		<div
			class="start space-x-3.5 px-5 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
			<img src="/svg/download.svg" alt="">

			<span :class="{ 'animate-pulse': exporting }">
				{{ exporting ? "Exporting" : "Download" }} CSV
			</span>
		</div>
	</button>
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
			// Filesaver
		}
	},

	methods: {
		async exportLogs() {
			const date = new Date().toISOString().split("T")[0];
			this.exporting = true

			try {
				const response = await fetch(`https://intuitiveagents.io/call-logs-csv`, {
					method: "POST",
					body: JSON.stringify({
						agentId: this.agentId,
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

<style></style>