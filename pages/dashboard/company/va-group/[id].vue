<template>
	<div class="Dashboard">
		<header>
			<h1>
				Virtual help desk - DANIEL
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

				<ExportLogs agentId="86f0db493888f1da69b7d46bfaecd360" agentName="Daniel" />

				<!-- <div class="DateFilter start space-x-2">
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
				</div> -->

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
				<SmallTileCard title="Total contacts" icon="outgoing" :value="stats?.totalContactForAgent || 0" />
				<SmallTileCard title="Called Contacts" icon="user-answered" :value="stats?.totalCalledForAgent || 0" />
				<SmallTileCard title="Not Called" icon="user-declined" :value="stats?.totalNotCalledForAgent || 0" />
			</div>
		</header>

		<div class="Logs">
			<div class="Texts">
				<h2>
					Call Logs
				</h2>
			</div>

			<Table :users="users" :searching="searching" :totalPages="totalPages" :page="page" @paginate="paginate"
				:fetching="fetching" @setTranscript="setTranscript" @loadUsers="loadUsers" />
		</div>

		<div class="Modal" v-if="transcriptArray?.length > 1" @click.self="closeTranscript">
			<div class="Popup">
				<div class="Head">
					<h3>
						Transcript
					</h3>

					<button class="Close" @click="closeTranscript">
						<img src="/svg/close.svg" alt="">
					</button>
				</div>

				<div class="Body" data-lenis-prevent>
					<div class="Recording sticky top-0 bg-white mb-5">
						<audio class="w-full bg-opacity-0 appearance-none" controls>
							<source :src="transcript?.recordingUrl" type="audio/wav" />
						</audio>
					</div>

					<p v-if="analyzedTranscript" class="pb-5 sticky top-[74px]">
						<span class="font-semibold">Call Sentiment:</span> {{ analyzedTranscript }}
					</p>

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

definePageMeta({
	layout: "dashboard"
})

export default {
	layout: "dashboard",
	data() {
		return {
			users: [],

			transcript: {},
			analyzedTranscript: {},
			fetching: false,
			searching: false,
			stats: null,
			date: new Date(),
			totalPages: 0,
			page: 1,
			moment
		}
	},

	computed: {
		transcriptArray() {
			// console.log("Stuff", this.transcript?.split("\n"));
			return this.transcript?.transcript?.split("\n")
		},
	},

	watch: {
		fetching(val) {
			console.log("Fetching: ", val);
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

		async loadUsers(page) {
			// const { logId1, logId2, logId3 } = logs;
			this.fetching = true;
			try {
				const response = await fetch(`https://intuitiveagents.io/users/86f0db493888f1da69b7d46bfaecd360`, {
					method: "POST",
					body: JSON.stringify({
						limit: 100,
						page: page ? page : this.page
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
					return this.users = [];
				}

				const users = await response.json(); // Parse the response body as JSON
				console.log("Response: ", users.result.contacts);

				this.users = users.result.contacts;
				this.totalPages = users.result.totalPages;
				this.stats = {
					totalContactForAgent: users.result.totalContactForAgent,
					totalCalledForAgent: users.result.totalCalledForAgent,
					totalNotCalledForAgent: users.result.totalNotCalledForAgent
				}
				if(page) this.page = page;
				// console.log("Total Pages: ", this.totalPages);
				this.fetching = false;
				// this.searching = false;
			} catch (error) {
				console.error("Error fetching data:", error);
				// Return an empty object or handle the error as needed
				this.users = [];
			}

			// setInterval(() => {
			// 	this.loadUsers()
			// }, 15000);
		},

		async filterByDate() {
			const searching = true;
			this.getStats(searching)
			// const pstDate = moment(this.date).tz("America/Los_Angeles").format('YYYY-MM-DD');
			// this.loadUsers(pstDate);
		},

		paginate(page) {
			// this.page = page;
			this.loadUsers(page)
		},

		setTranscript(transcript, analyzedTranscript) {
			this.transcript = transcript;
			this.analyzedTranscript = analyzedTranscript;
		},

		closeTranscript() {
			this.transcript = {};
			this.analyzedTranscript = "";
		},

		getAgent() {
			const { id } = this.$route.params;
			console.log("Params: ", params);
		}
	},

	beforeMount() {
		this.getAgent()
	},

	mounted() {
		this.loadUsers()
		// this.getStats(false)
	}
}
</script>

<style lang="postcss" scoped>
.Dashboard {
	@apply pt-10 space-y-20;

	header {
		h1 {
			@apply text-2xl font-bold text-black capitalize;
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
			@apply relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[540px] space-y-5;

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