<template>
	<div class="Dashboard">
		<header>
			<h1>
				Dashboard
			</h1>

			<div class="Misc between">
				<div class="Switches start">
					<button class="Switch active">
						Overview
					</button>

					<button class="Switch">
						Analytics
					</button>
				</div>

				<div class="DateFilter start space-x-2">
					<!-- {{ date }} -->
					<!-- <Datepicker v-model="date" /> -->
					<vue-date-picker v-model="date" mode="date"></vue-date-picker>

					<button class="Download p-[2px] relative w-full max-w-[84px]" @click="filterByDate" :disabled="searching">
						<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md" />

						<div
							class="center px-5 py-1.5 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent text-sm">
							<span :class="{ 'animate-pulse': searching }" v-if="!searching">
								Search
							</span>

							<img class="animate-spin duration-1000 py-1 w-3.5" v-else src="/svg/loading.svg" alt="">
						</div>
					</button>
				</div>

				<!-- <button class="Download p-[3px] relative">
					<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

					<div
						class="start space-x-3.5 px-5 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
						<img src="/svg/download.svg" alt="">

						<span>
							Download
						</span>
					</div>
				</button> -->
			</div>

			<div class="Numbers start">
				<SmallTileCard title="Total calls" icon="outgoing" :value="stats?.TotalCalls || 0" />
				<SmallTileCard title="Call answered" icon="user-answered" :value="stats?.TotalAnsweredCall || 0" />
				<SmallTileCard title="Unanswered calls" icon="user-declined" :value="stats?.TotalNotAnsweredCalls || 0" />
			</div>
		</header>

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

							<button @click="transcript = user?.referenceToCallId?.transcript">
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

		<div class="Modal" v-if="transcriptArray.length > 1" @click.self="transcript = ''">
			<div class="Popup">
				<div class="Head">
					<h3>
						Transcript
					</h3>

					<button class="Close" @click="transcript = ''">
						<img src="/svg/close.svg" alt="">
					</button>
				</div>

				<div class="Body" data-lenis-prevent>
					<div class="Scroller">
						<p v-for="(text, index) in transcriptArray" :key="index">
							{{ text }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
// import Datepicker from 'vue3-datepicker'
import moment from "moment-timezone";
export default {
	layout: "dashboard",

	// async asyncData() {
	// 	try {
	// 		const pstDate = moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
	// 		// console.log(pstDate);

	// 		const response = await fetch("https://retell-backend-yy86.onrender.com/get-stats", {
	// 			method: "POST",
	// 			headers: {
	// 				"ContentType: "application / json" // Set the Content-Type header
	// 			},
	// 			body: JSON.stringify({
	// 				agents: [
	// 					"0411eeeb12d17a340941e91a98a766d0",
	// 					"214e92da684138edf44368d371da764c",
	// 					"86f0db493888f1da69b7d46bfaecd360"
	// 				],
	// 				date: pstDate // Pass the PST date in the request body
	// 			})
	// 		});

	// 		if (!response.ok) {
	// 			throw new Error(`HTTP error! Status: ${response.status}`);
	// 		}

	// 		const stats = await response.json(); // Parse the response body as JSON

	// 		return { stats }; // Return the fetched stats as asyncData result
	// 	} catch (error) {
	// 		console.error("Error fetching data:", error);
	// 		// Return an empty object or handle the error as needed
	// 		return { stats: null }; // Return null or default value for stats
	// 	}
	// },

	// asyncData() {
	// 	const pstDate = moment().tz("America/Los_Angeles").format('l');
	// 	// console.log(pstDate);
	// 	try {
	// 		const response = fetch("https://retell-backend-yy86.onrender.com/get-stats", {
	// 			method: "POST",
	// 			body: {
	// 				agents: [
	// 					"0411eeeb12d17a340941e91a98a766d0",
	// 					"214e92da684138edf44368d371da764c",
	// 					"86f0db493888f1da69b7d46bfaecd360"
	// 				],

	// 				// date: 
	// 			}
	// 		})
	// 		// console.log(response)

	// 		return {
	// 			stats: response.data
	// 		}
	// 	} catch (error) {
	// 		console.error(error)
	// 	}
	// },

	// components: {
	// 	Datepicker
	// },

	data() {
		return {
			users: [],

			transcript: "",
			fetching: false,
			searching: true,
			stats: null,
			date: new Date(),
			moment
		}
	},

	computed: {
		transcriptArray() {
			// // console.log("Stuff", this.transcript?.split("\n"));
			return this.transcript?.split("\n")
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
				// // console.log(this.date, pstDate);

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

				// console.log(stats);

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
.Dashboard {
	@apply pt-16 space-y-20;

	header {
		h1 {
			@apply text-4xl font-bold text-black;
		}

		.Misc {
			@apply mt-6;

			.Switches {
				@apply rounded-xl bg-gray-100 p-1;

				.Switch {
					@apply px-4 py-1.5 rounded-lg;

					&.active {
						@apply bg-white text-black;
					}
				}
			}
		}

		.Numbers {
			@apply space-x-6 mt-6;
		}
	}

	.Logs {
		@apply space-y-5;

		.Texts {
			h2 {
				@apply text-2xl font-bold text-black;
			}
		}

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
	}

	.Modal {
		@apply bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center;

		.Popup {
			@apply relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[500px] space-y-5;

			.Head {
				@apply relative w-full;

				h3 {
					@apply font-bold text-2xl text-left
				}

				.Close {
					@apply absolute right-5 top-0 shrink-0;

					img {
						@apply w-5;
					}
				}
			}

			.Body {
				@apply h-[300px] overflow-y-auto w-full;

				.Scroller {
					@apply space-y-2
				}
			}
		}
	}
}
</style>