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
					<vue-date-picker v-model="date" mode="date" range multi-calendars></vue-date-picker>

					<button class="Download p-[2px] relative w-full max-w-[84px]" @click="filterByDate" :disabled="searching">
						<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md" />

						<div
							class="center px-5 py-1.5 bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent text-sm">
							<span :class="{ 'animate-pulse': searching }" v-if="!searching">
								Search call date
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
			<div class="Texts between">
				<h2>
					Call Logs
				</h2>

				<div class="Actions start space-x-5">
					<div class="Search start">
						<div class="Input border rounded-lg overflow-hidden">
							<UInput icon="i-heroicons-magnifying-glass-20-solid" size="lg" color="white" placeholder="Search for contact..."
								v-model="search" type="search" @input="searchContact($event)" />
							<!-- <template #trailing>
									<UButton class="text-gray-500 dark:text-gray-400 text-xs font-bold" @click="clearSearch">Clear</UButton>
								</template> -->
							<!-- </UInput> -->
						</div>
					</div>
				</div>
			</div>

			<div class="Tables">
				<Table v-if="search == ''" :users="users" :searching="searching" :totalPages="totalPages" :page="page"
					@paginate="paginate" :fetching="fetching" @setTranscript="setTranscript" @loadUsers="loadUsers" />

				<Table v-else :users="searches" :searching="searching" :query="search" :totalPages="totalPages" :page="page"
					@paginate="paginate" :fetching="fetching" @setTranscript="setTranscript" @updateSearch="updateSearch"
					filter />
			</div>
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
					<div class="Recording sticky top-0 bg-white pb-2.5">
						<audio class="w-full bg-opacity-0 appearance-none" controls>
							<source :src="transcript?.recordingUrl" type="audio/wav" />
						</audio>
					</div>

					<p v-if="analyzedTranscript" class="pb-5 sticky top-[64px] bg-white">
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
import fetcher from "~/utils/fetcher";

export default {
	layout: "dashboard",

	// async asyncData() {
	// 	try {
	// 		const pstDate = moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
	// 		console.log(pstDate);

	// 		const response = await fetch("https://intuitiveagents.io/get-stats", {
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
	// 	console.log(pstDate);
	// 	try {
	// 		const response = fetch("https://intuitiveagents.io/get-stats", {
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
	// 		console.log(response)

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

			analyzedTranscript: "",
			transcript: {},
			fetching: false,
			searching: true,
			stats: null,
			searches: [],
			date: [],
			timeoutId: 0,
			page: 1,
			totalPages: 0,
			search: "",
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

			// console.log("Fetcher: ", fetcher)

			const currentDate = moment().tz("America/Los_Angeles").format('YYYY-MM-DD');
			const startDate = this.date[0] ? moment(this.date[0]).tz("America/Los_Angeles").format('YYYY-MM-DD') : currentDate;
			const endDate = this.date[1] ? moment(this.date[1]).tz("America/Los_Angeles").format('YYYY-MM-DD') : currentDate;

			const response = await fetcher('/get-stats', "POST", {
				startDate,
				endDate,
				agentIds: ["214e92da684138edf44368d371da764c"]
			});

			this.stats = response;
				this.loadUsers(startDate, endDate);

			// try {
			// 	const response = await fetch("https://intuitiveagents.io/get-stats", {
			// 		method: "POST",
			// 		headers: {
			// 			"Content-Type": "application/json"
			// 		},
			// 		body: JSON.stringify({
			// 			startDate,
			// 			endDate,
			// 		})
			// 	});

			// 	if (!response.ok) {
			// 		throw new Error(`HTTP error! Status: ${response.status}`);
			// 	}

			// 	const stats = await response.json(); // Parse the response body as JSON

			// 	console.log(stats);

			// 	this.stats = stats;
			// 	const logs = {
			// 		logId1: stats?.logId1 || "",
			// 		logId2: stats?.logId2 || "",
			// 		logId3: stats?.logId3 || ""
			// 	}

			// 	this.fetching = true;
			// 	this.loadUsers(startDate, endDate);
			// 	// setTimeout(() => this.refreshNuxtData, 5000)
			// } catch (error) {
			// 	console.error("Error fetching data:", error);
			// 	// Return an empty object or handle the error as needed
			// 	this.stats = {};
			// }
		},

		async loadUsers(startDate, endDate, page) {
			// const { logId1, logId2, logId3 } = logs;

			// User fetchers
			const response = await fetcher('/get-metadata', "POST", {
				limit: 100,
				page: page ? page : this.page,
				startDate,
				endDate
			});

			console.log("Response: ", response);

			this.users = response.dailyStats;
			this.fetching = false;
			this.searching = false;
			this.page = page == undefined ? 1 : page;
			this.totalPages = response.totalPages;

			
			// try {
			// 	const response = await fetch("https://intuitiveagents.io/get-metadata", {
			// 		method: "POST",
			// 		body: JSON.stringify({
			// 			limit: 100,
			// 			page: page ? page : this.page,
			// 			startDate,
			// 			endDate
			// 		}),
			// 		headers: {
			// 			"Content-Type": "application/json"
			// 		}
			// 	});

			// 	if (!response.ok) {
			// 		throw new Error(`HTTP error! Status: ${response.status}`);
			// 	}

			// 	const users = await response.json(); // Parse the response body as JSON

			// 	this.users = users.dailyStats;
			// 	this.fetching = false;
			// 	this.searching = false;
			// 	this.page = page == undefined ? 1 : page;
			// 	this.totalPages = users.totalPages;
			// } catch (error) {
			// 	console.error("Error fetching data:", error);
			// 	// Return an empty object or handle the error as needed
			// 	this.users = [];
			// }
		},

		async filterByDate() {
			const searching = true;
			this.getStats(searching)
			// const pstDate = moment(this.date).tz("America/Los_Angeles").format('YYYY-MM-DD');
			// this.loadUsers(pstDate);
		},

		debounce(func, delay) {
			console.log("Debounce", this.timeoutId);
			// timeoutId;
			return (...args) => {
				const context = this;
				console.log("Before", this.timeoutId);
				clearTimeout(this.timeoutId);
				this.timeoutId = setTimeout(() => {
					func.apply(context, args);
				}, delay);
				console.log("After", this.timeoutId);
			};
		},

		async searchContact(event) {
			// Debounce the searchContact method with a delay of 500 milliseconds
			const debouncedSearchContact = this.debounce(async (searchTerm) => {
				this.search = searchTerm;
				if (this.search === '') {
					this.searches = []
					this.loadUsers();
					return;
				} else {

					const response = await fetcher('/search-va-group', "POST", {
						searchTerm
					});

					this.searches = response;
					// try {
					// 	const response = await fetch(`https://intuitiveagents.io/search-va-group`, {
					// 		method: "POST",
					// 		body: JSON.stringify({
					// 			searchTerm: this.search,
					// 			// agentId: this.agentDetails.id
					// 		}),
					// 		headers: {
					// 			"Content-Type": "application/json"
					// 		}
					// 	});

					// 	const users = await response.json();
					// 	console.log("Search Response: ", users);
					// 	this.searches = users;
					// } catch (error) {
					// 	console.error("Error fetching data:", error);
					// 	this.searches = [];

					// }
				}
			}, 1000); // Adjust debounce delay as needed

			// Call the debouncedSearchContact function with the search term from the input event
			debouncedSearchContact(event.target.value);
		},

		async setTranscript(transcript, analyzedTranscript) {
			this.transcript = transcript;

			try {
				const sent = await fetch(`https://intuitiveagents.io/review-transcript`, {
					method: "POST",
					body: JSON.stringify({
						transcript: transcript.transcript
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});

				const data = await sent.json();
				// console.log("Sentiment: ", data.result.message.content);
				this.analyzedTranscript = data.result.message.content;
			} catch (error) {
				console.error("Error fetching data:", error);
				// Return an empty object or handle the error as needed
				this.analyzedTranscript = "";
			}
		},

		closeTranscript() {
			this.transcript = {};
			this.analyzedTranscript = "";
		},

		updateSearch(data) {
			this.searches = data;
		},

		paginate(page) {
			const dates = this.date;
			const startDate = dates[0]
			const endDate = dates[1]
			// this.page = page;
			localStorage.setItem("page", page);
			this.loadUsers(startDate, endDate, page)
		}
	},

	beforeMount() {
		const startDate = new Date();
		const endDate = new Date();
		// this.date = [startDazte, endDate];
		this.getStats(false)
		// console.log("Mount date: ", this.date)
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