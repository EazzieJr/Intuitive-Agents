<template>
	<div class="Dashboard">
		<header>
			<h1>
				{{ agentDetails.alias }} - {{ agentDetails.name }}
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

				<ExportLogs :agentId="agentDetails.id" :agentName="agentDetails.name" />
			</div>

			<div class="Numbers start">
				<SmallTileCard title="Total contacts" icon="outgoing" :value="stats?.totalContactForAgent || 0" />
				<SmallTileCard title="Called Contacts" icon="user-answered" :value="stats?.totalCalledForAgent || 0" />
				<SmallTileCard title="Not Called" icon="user-declined" :value="stats?.totalNotCalledForAgent || 0" />
			</div>
		</header>

		<div class="Logs">
			<div class="Texts between">
				<h2>
					Call Logs
				</h2>

				<div class="Actions start space-x-5">
					<button v-if="search" class="BatchDelete center py-2.5 w-[160px] rounded-lg bg-red-600 text-white font-medium text-sm" @click="batchDelete">
						<span v-if="!batchDeleting">
							Batch delete
						</span>

						<img class="animate-spin duration-1000 py-1 w-4" v-else src="/svg/loading.svg" alt="">
					</button>

					<div class="Search start">
						<div class="Input border rounded-lg overflow-hidden">
							<UInput icon="i-heroicons-magnifying-glass-20-solid" size="lg" color="white" placeholder="Search..."
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
					:agentDetails="agentDetails" @paginate="paginate" :fetching="fetching" @setTranscript="setTranscript"
					@loadUsers="loadUsers" />

				<Table v-else :users="searches" :searching="searching" :query="search" :totalPages="totalPages" :page="page"
					:agentDetails="agentDetails" @paginate="paginate" :fetching="fetching" @setTranscript="setTranscript"
					@updateSearch="updateSearch" />
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
import { useStore } from '@/store/index'
import Cookie from 'js-cookie'

definePageMeta({
	layout: "dashboard"
})

export default {
	layout: "dashboard",

	data() {
		return {
			users: [],
			searches: [],
			agentDetails: {},
			timerModal: false,
			schedularModal: false,
			batchDeleting: false,

			transcript: {},
			analyzedTranscript: {},
			fetching: false,
			searching: false,
			stats: null,
			date: new Date(),
			totalPages: 0,
			page: 1,
			search: "",
			debounceTimeout: null,
			timeoutId: 0,

			// store: useStore(),
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
		async loadUsers(page) {
			// const { logId1, logId2, logId3 } = logs;
			this.fetching = true;
			try {
				const response = await fetch(`https://intuitiveagents.io/users/${this.agentDetails.id}`, {
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
				if (page) this.page = page;
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
			localStorage.setItem("page", page);
			this.loadUsers(page)
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

		getAgent() {
			const { name } = this.$route.params;

			if (name == "daniel") {
				this.agentDetails = {
					name: "Daniel",
					alias: "Virtual Help Desk",
					id: "86f0db493888f1da69b7d46bfaecd360",
					number: "+17026209498"
				}
			} else if (name == "ethan") {
				this.agentDetails = {
					name: "Ethan",
					alias: "Virtual Team Expert",
					id: "214e92da684138edf44368d371da764c",
					number: "+17252399747"
				}
			} else if (name == "chloe") {
				this.agentDetails = {
					name: "Chloe",
					alias: "Remote Solutions Team",
					id: "0411eeeb12d17a340941e91a98a766d0",
					number: "+17252399297"
				}
			}

			useStore().$patch({
				agentDetails: this.agentDetails
			})
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
					try {
						const response = await fetch(`https://intuitiveagents.io/search`, {
							method: "POST",
							body: JSON.stringify({
								searchTerm: this.search,
								agentId: this.agentDetails.id
							}),
							headers: {
								"Content-Type": "application/json"
							}
						});

						const users = await response.json();
						console.log("Search Response: ", users);
						this.searches = users;
					} catch (error) {
						console.error("Error fetching data:", error);
						this.searches = [];
					}
				}
			}, 1000); // Adjust debounce delay as needed

			// Call the debouncedSearchContact function with the search term from the input event
			debouncedSearchContact(event.target.value);
		},

		updateSearch(data) {
			this.searches = data;
		},

		async batchDelete() {
			this.batchDeleting = true;
			const ids = this.searches.map(user => user._id);

			console.log("Batch Delete: ", ids);
			try {
				const response = await fetch(`https://intuitiveagents.io/batch-delete-users`, {
					method: "POST",
					body: JSON.stringify({
						contactsToDelete: ids
					}),
					headers: {
						"Content-Type": "application/json"
					}
				});

				const users = await response.json();
				console.log("Delete Response: ", users);
				this.loadUsers();
				this.batchDeleting = false;
				this.search = "";
			} catch (error) {
				console.error("Error fetching data:", error);
				this.batchDeleting = false;
			}
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