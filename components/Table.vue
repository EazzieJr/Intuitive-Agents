<template>
	<div class="Logs">
		<div class="Texts">
			<h2>
				Call Logs
			</h2>
		</div>

		<div class="Table">
			<div class="Header flex items-center grow">
				<div>S/N</div>

				<div>First Name</div>

				<div>Last Name</div>

				<div>Email</div>

				<div>Phone</div>

				<div>Status</div>

				<div>Agent</div>
			</div>

			<div class="Data" data-lenis-prevent>
				<div class="DataContainer">
					<div class="Row start" v-for="(user, index) in users" :key="index">
						<div>
							{{ index + 1 }}
						</div>

						<div>
							{{ user.firstname }}
						</div>

						<div>
							{{ user.lastname }}
						</div>

						<div>
							{{ user.email }}
						</div>

						<div>
							{{ user.phone }}
						</div>

						<div class="start">
							<img :src="`/svg/calls/${user.status}.svg`" alt="">
							<span class="Status active">
								{{ user.status }}
							</span>
						</div>

						<div>
							{{ getAgentName(user.agentId) }}
						</div>

						<button @click="transcript = user?.referenceToCallId">
							<img src="/svg/transcript.svg" alt="">
						</button>
					</div>
				</div>

				<div class="Empty col-center h-[400px]" v-if="searching">
					<img src="/svg/empty.svg" alt="">

					<p>
						{{ searching ? "Fetching logs for " + moment(date).format('ll') : "No data avalaible for " +
						moment(date).format('ll') }}
					</p>
				</div>

				<div class="Empty col-center h-[400px]" v-if="users.length == 0">
					<img src="/svg/empty.svg" alt="">

					<p>
						{{ fetching ? "Fetching table data" : "No data avalaible for " + moment(date).format('ll') }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment-timezone";
export default {
	props: {
		users: {
			type: Array,
			default: () => ([])
		}
	},
	
	data() {
		return {
			users: [],

			transcript: {},
			fetching: false,
			searching: true,
			stats: null,
			date: new Date(),
			moment
		}
	},
	
	computed: {
		transcriptArray() {
			// console.log("Stuff", this.transcript?.split("\n"));
			return this.transcript?.transcript?.split("\n")
		}
	},

	methods: {
		getAgentName(id) {
			if (id == "86f0db493888f1da69b7d46bfaecd360") {
				return "VHD"
			} else if (id == "214e92da684138edf44368d371da764c") {
				return "VTE"
			} else if (id == "0411eeeb12d17a340941e91a98a766d0") {
				return "RST"
			}
		},

		async getStats(searching) {
			if (searching) {
				this.searching = true;
			}

			try {
				const pstDate = this.date ? moment(this.date).tz("America/Los_Angeles").format('YYYY-MM-DD') : moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
				// console.log(this.date, pstDate);

				const response = await fetch("https://retell-backend-yy86.onrender.com/get-stats", {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						date: pstDate
					})
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const stats = await response.json(); // Parse the response body as JSON

				console.log(stats);

				this.stats = stats;
				const logs = {
					logId1: stats?.logId1 || "",
					logId2: stats?.logId2 || "",
					logId3: stats?.logId3 || ""
				}

				this.fetching = true;
				this.loadUsers(pstDate);
				// setTimeout(() => this.refreshNuxtData, 5000)
			} catch (error) {
				console.error("Error fetching data:", error);
				// Return an empty object or handle the error as needed
				this.stats = {};
			}
		},

		async loadUsers(date) {
			// const { logId1, logId2, logId3 } = logs;

			try {
				const response = await fetch("https://retell-backend-yy86.onrender.com/get-metadata", {
					method: "POST",
					body: JSON.stringify({
						date
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				const users = await response.json(); // Parse the response body as JSON

				this.users = users.dailyStats;
				this.fetching = false;
				this.searching = false;
			} catch (error) {
				console.error("Error fetching data:", error);
				// Return an empty object or handle the error as needed
				this.users = [];
			}
		},

		async filterByDate() {
			const searching = true;
			this.getStats(searching)
			// const pstDate = moment(this.date).tz("America/Los_Angeles").format('YYYY-MM-DD');
			// this.loadUsers(pstDate);
		}
	},

	beforeMount() {
		this.getStats(false)
	}
}
</script>

<style lang="postcss" scoped>
.Table {
	@apply rounded-xl border border-gray-200 bg-white overflow-hidden;

	>.Header {
		@apply bg-gray-100 p-4;

		div {
			@apply block;

			&:nth-child(1) {
				@apply basis-[4%];
			}

			&:nth-child(2) {
				@apply basis-[15%];
			}

			&:nth-child(3) {
				@apply basis-[15%];
			}

			&:nth-child(4) {
				@apply basis-[22%];
			}

			&:nth-child(5) {
				@apply basis-[15%];
			}

			&:nth-child(6) {
				@apply basis-[15%];
			}

			&:nth-child(7) {
				@apply basis-[8%];
			}
		}
	}

	.Data {
		.DataContainer {
			@apply overflow-y-scroll h-fit max-h-[500px];

			.Row {
				@apply p-4 border-b border-gray-200;

				div {
					@apply block text-[#09090B] capitalize text-sm;

					&:nth-child(1) {
						@apply basis-[4%];
					}

					&:nth-child(2) {
						@apply basis-[15%];
					}

					&:nth-child(3) {
						@apply basis-[15%];
					}

					&:nth-child(4) {
						@apply basis-[22%];
					}

					&:nth-child(5) {
						@apply basis-[15%];
					}

					&:nth-child(6) {
						@apply basis-[15%] space-x-2 !flex;

						img {
							@apply w-4
						}
					}

					&:nth-child(7) {
						@apply basis-[8%] font-bold;
					}

					&:nth-child(8) {
						@apply basis-[6%];
					}
				}
			}
		}
	}
}
</style>