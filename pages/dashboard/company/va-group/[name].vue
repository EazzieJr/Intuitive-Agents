<template>
	<div class="Dashboard">
		<header>
			<div class="Left start !items-end space-x-5">
				<div class="Image w-14 h-14 rounded-full overflow-hidden">
					<img class="w-full h-full object-bottom object-cover"
						:src="`/svg/${agentDetails?.alias?.toLowerCase().split(' ').join('-')}.svg`" alt="">
				</div>
				<h1>
					{{ agentDetails.alias }} - {{ agentDetails.name }}
				</h1>
			</div>

			<div class="Misc between">
				<div class="DataDuration">
					<Durations @fetchData="loadUsers" />
				</div>
				
				<ExportLogs :agentId="agentDetails.id" :agentName="agentDetails.name" />
			</div>

			<div class="Numbers start">
				<SmallTileCard title="Total contacts" icon="total-contacts" :value="stats?.totalContactForAgent || 0" />
				<SmallTileCard title="Total Calls" icon="total-calls" :value="stats?.totalCalledForAgent || 0" />
				<SmallTileCard title="Total Not Called" icon="total-not-called" :value="stats?.totalNotCalledForAgent || 0" />
				<SmallTileCard title="Total Answered: VM/AM" icon="total-answered-vm-am"
					:value="stats?.totalAnsweredByVm || 0" />
				<SmallTileCard title="Total Calls: Failed" icon="total-calls-failed" :value="stats?.totalFailedCalls || 0" />
				<SmallTileCard title="Total Calls Connected" icon="total-answered-contacts"
					:value="stats?.totalAnsweredCalls || 0" />
				<SmallTileCard title="Total calls: Transferred" icon="total-calls-transferred"
					:value="stats?.totalCallsTransffered || 0" />
				<SmallTileCard title="Total Appointments" icon="total-appointments" :value="stats?.totalAppointment || 0" />
			</div>
		</header>

		<div class="Logs">
			<div class="Texts between">
				<h2>
					Call Logs
				</h2>

				<div class="Actions start space-x-2.5">
					<button v-if="search || searchBy == 'tags'"
						class="BatchDelete center py-2.5 w-[160px] rounded-lg bg-red-600 text-white font-medium text-sm"
						@click="batchDelete">
						<span v-if="!batchDeleting">
							Batch delete
						</span>

						<img class="animate-spin duration-1000 py-1 w-4" v-else src="/svg/loading.svg" alt="">
					</button>

					<UDropdown :items="searchItems" :popper="{ placement: 'bottom-start' }">
						<UButton size="lg" color="white" :label="searchBy ? searchBy : 'Search by'"
							trailing-icon="i-heroicons-chevron-down-20-solid" class="capitalize" />
					</UDropdown>

					<div class="Search start" v-if="searchBy == 'contacts'">
						<div class="Input border rounded-lg overflow-hidden">
							<UInput icon="i-heroicons-magnifying-glass-20-solid" size="lg" color="white" placeholder="Search..."
								v-model="search" type="search" @input="searchContact($event)" />
						</div>
					</div>

					<UDropdown v-else-if="searchBy == 'sentiments'" :items="sentiments" :popper="{ placement: 'bottom-start' }">
						<UButton size="lg" color="white" :label="search ? search : 'Select Sentiment'"
							trailing-icon="i-heroicons-chevron-down-20-solid" class="capitalize" />
					</UDropdown>

					<UDropdown v-else-if="searchBy == 'statuses'" :items="statuses" :popper="{ placement: 'bottom-start' }">
						<UButton size="lg" color="white" :label="search ? search : 'Select Status'"
							trailing-icon="i-heroicons-chevron-down-20-solid" class="capitalize" />
					</UDropdown>

					<UDropdown v-else-if="searchBy == 'tags'" :items="tags" class="capitalize"
						:popper="{ placement: 'bottom-start' }">
						<UButton size="lg" color="white" :label="tag ? tag : 'Tag to schedule'"
							trailing-icon="i-heroicons-chevron-down-20-solid" class="!capitalize" />
					</UDropdown>

					<vue-date-picker v-model="date" @update:model-value="searchContactsByDate" mode="date" range
						v-else-if="searchBy == 'dates'"></vue-date-picker>
				</div>
			</div>

			<div class="Tables">
				<Table v-if="useSearchTable" :users="searches" :searching="searching" :query="search" :totalPages="totalPages"
					:page="page" :agentDetails="agentDetails" @paginate="paginate" :fetching="fetching"
					@setTranscript="setTranscript" :searchBy="searchBy" @updateSearch="updateSearch" filter />

				<Table v-else :users="users" :searching="searching" :totalPages="totalPages" :page="page"
					:agentDetails="agentDetails" :currentDuration="currentDuration" @paginate="paginate" :fetching="fetching"
					@setTranscript="setTranscript" @loadUsers="loadUsers" baseTable />
			</div>
		</div>

		<div class="SideDialogue">

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
import fetcher from '@/utils/fetcher'

definePageMeta({
	layout: "dashboard",
	middleware: "auth"
})

export default {
	data() {
		return {
			users: [],
			searches: [],
			agentDetails: {},
			timerModal: false,
			schedularModal: false,
			batchDeleting: false,
			currentDuration: "last-schedule",

			transcript: {},
			analyzedTranscript: {},
			fetching: false,
			searching: false,
			stats: null,
			date: [],
			totalPages: 0,
			page: 1,
			search: "",
			debounceTimeout: null,
			timeoutId: 0,
			searchBy: '',
			tag: "",
			tags: [[]],
			searchItems: [
				[{
					label: 'Contacts',
					click: () => {
						this.searchBy = 'contacts'
					}
				}, {
					label: 'Dates',
					click: () => {
						this.searchBy = 'dates'
					}
				}], [{
					label: 'Sentiments',
					click: () => {
						this.searchBy = 'sentiments'
						// console.log("Sentiments: ", this.searchBy);
					}
				}, {
					label: 'Statuses',
					click: () => {
						this.searchBy = 'statuses'
					}
				}], [{
					label: "Tags",
					click: () => {
						this.searchBy = 'tags'
					}
				}]
			],

			sentiment: "",
			sentimentOptions: [
				[
					{
						label: 'Scheduled',
						click: () => {
							this.sentiment = 'scheduled'
						}
					},
					{
						label: 'Interested',
						click: () => {
							this.sentiment = 'interested'
						}
					},

					{
						label: 'Uninterested',
						click: () => {
							this.sentiment = 'uninterested'
						}
					},

					{
						label: 'Incomplete call',
						click: () => {
							this.sentiment = 'incomplete-call'
						}
					},

					{
						label: 'Call back',
						click: () => {
							this.sentiment = 'call-back'
						}
					},

					{
						label: 'Voicemail',
						click: () => {
							this.sentiment = 'voicemail'
						}
					}
				]
			],

			sentiments: [
				[
					{
						label: 'Scheduled',
						click: () => {
							this.search = 'scheduled'
							this.searchBySentiment()
						}
					},
					{
						label: 'Interested',
						click: () => {
							this.search = 'interested'
							this.searchBySentiment()
						}
					},

					{
						label: 'Uninterested',
						click: () => {
							this.search = 'uninterested'
							this.searchBySentiment()
						}
					},

					{
						label: 'Incomplete call',
						click: () => {
							this.search = 'incomplete-call'
							this.searchBySentiment()
						}
					},

					{
						label: 'Call back',
						click: () => {
							this.search = 'call-back'
							this.searchBySentiment()
						}
					},

					{
						label: 'Voicemail',
						click: () => {
							this.search = 'voicemail'
							this.searchBySentiment()
						}
					}
				]
			],

			statuses: [
				[
					{
						label: 'Call connected',
						click: () => {
							this.search = 'call-connected'
							this.searchByStatuses()
						}
					},

					{
						label: 'Call failed',
						click: () => {
							this.search = 'call-failed'
							this.searchByStatuses()
						}
					},

					{
						label: 'Call transferred',
						click: () => {
							this.search = 'call-transferred'
							this.searchByStatuses()
						}
					},

					{
						label: 'Call answered',
						click: () => {
							this.search = 'call-answered'
							this.searchByStatuses()
						}
					},

					{
						label: 'Called-NA-VM',
						click: () => {
							this.search = 'called-na-vm'
							this.searchByStatuses()``
						}
					},

					{
						label: 'Not Called',
						click: () => {
							this.search = 'not-called'
							this.searchByStatuses()
						}
					}
				]
			],
			moment
		}
	},

	computed: {
		transcriptArray() {
			// // console.log("Stuff", this.transcript?.split("\n"));
			return this.transcript?.transcript?.split("\n")
		},

		useSearchTable() {
			return this.search !== '' || this.tag !== '' || this.searches.length > 0
		}
	},

	watch: {
		fetching(val) {
			// console.log("Fetching: ", val);
		},

		searches() {
			// console.log("From Name: ", this.searches)
		},

		searchBy() {
			this.search = "";

			// console.log("Search By: ", this.searchBy);

			if (this.searchBy === 'tags') {
				this.getTags()
			}
		}
	},

	methods: {
		async loadUsers(page, duration) {
			this.fetching = true;
			this.currentDuration = duration;

			console.log("Page: ", duration);

			if (duration) {
				this.$toast.open({
					message: `Fetching data for ${duration}...`,
					type: 'info',
					duration: 5000,
					dismissible: true,
					position: 'top'
				});
			}

			const response = await fetcher(`/users/${this.agentDetails.id}`, "POST", {
				limit: 100,
				dateOption: duration ? duration : "last-schedule",
				page: page ? page : this.page
			});

			if (duration) {
				this.$toast.open({
					message: `Fetched data for ${duration}...`,
					type: 'success',
					duration: 5000,
					dismissible: true,
					position: 'top'
				});
			}

			this.users = response.result.contacts;
			this.totalPages = response.result.totalPages;
			this.stats = {
				totalContactForAgent: response.result.totalContactForAgent,
				totalCalledForAgent: response.result.totalCalls,
				totalNotCalledForAgent: response.result.totalNotCalledForAgent,
				totalFailedCalls: response.result.totalFailedCalls,
				totalAnsweredByVm: response.result.totalAnsweredByVm,
				totalAnsweredCalls: response.result.totalAnsweredCalls,
				totalCallsTransffered: response.result.totalCallsTransffered,
				totalAppointment: response.result.totalAppointment,
			}

			if (page) this.page = page;
			this.fetching = false;
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

		closeTranscript() {
			this.transcript = {};
			this.analyzedTranscript = "";
		},

		getAgent() {
			const { name } = this.$route.params;

			if (name == "daniel") {
				this.agentDetails = {
					name: "Chloe",
					alias: "Global Strategic Alliance",
					id: "agent_06e79f76e9952c7f4ec72f82f6",
					number: "+19843422762"
				}
			} else if (name == "olivia") {
				this.agentDetails = {
					name: "Olivia",
					alias: "Virtual Team Expert",
					id: "214e92da684138edf44368d371da764c",
					number: "+17026209498"
				}
			} else if (name == "chloe") {
				this.agentDetails = {
					name: "Chloe",
					alias: "Arrow Roofing Services",
					id: "agent_7cc8f816b0fd2c020037ec31b5",
					number: "+17347498637"
				}
			}

			useStore().$patch({
				agentDetails: this.agentDetails
			})
		},

		debounce(func, delay) {
			// console.log("Debounce", this.timeoutId);
			// timeoutId;
			return (...args) => {
				const context = this;
				// console.log("Before", this.timeoutId);
				clearTimeout(this.timeoutId);
				this.timeoutId = setTimeout(() => {
					func.apply(context, args);
				}, delay);
				// console.log("After", this.timeoutId);
			};
		},

		async searchContact(event) {
			// Debounce the searchContact method with a delay of 500 milliseconds
			const debouncedSearchContact = this.debounce(async (searchTerm) => {
				this.search = searchTerm;

				if (this.search !== '') {
					this.$toast.open({
						message: `Searching by ${this.searchBy} - ${this.search}`,
						type: 'info',
						duration: 5000,
						dismissible: true,
						position: 'top'
					});
				}

				if (this.search === '') {
					this.searches = []
					this.loadUsers();
					return;
				} else if (this.searchBy === 'dates') {
					// console.log("Dates: ", this.date);
					const response = await fetcher(`/search`, "POST", {
						// searchTerm: this.search,
						startDate: this.date[0],
						endDate: this.date[1],
						agentId: this.agentDetails.id
					});

					// console.log("Search Response: ", response);
					this.searches = response;
				} else if (this.searchBy === 'sentiments') {

					// this.$toast.info(`Searching by Sentiments - ${this.search}`, {
					// 	timeout: 5000,
					// 	position: 'top-center',
					// })

					const response = await fetcher(`/search`, "POST", {
						searchTerm: "",
						agentId: this.agentDetails.id,
						sentimentOption: this.search
					});

					// console.log("Search Response: ", response);
					this.searches = response;
				} else if (this.searchBy === 'statuses') {
					const response = await fetcher(`/search`, "POST", {
						searchTerm: "",
						agentId: this.agentDetails.id,
						statusOption: this.search
					});

					// console.log("Search Response: ", response);
					this.searches = response;
				} else {
					const searchItemChars = this.search.split(" ")
					if (searchItemChars[searchItemChars.length - 1] == '') {
						// // console.log("fake")
						return
					} else {
						// // console.log("Actual")

						const response = await fetcher(`/search`, "POST", {
							searchTerm: this.search,
							agentId: this.agentDetails.id
						});

						// console.log("Search Response: ", response);
						this.searches = response;


						// try {
						// 	const response = await fetch(`https://intuitiveagents.io/search`, {
						// 		method: "POST",
						// 		body: JSON.stringify({
						// 			searchTerm: this.search,
						// 			agentId: this.agentDetails.id
						// 		}),
						// 		headers: {
						// 			"Content-Type": "application/json"
						// 		}
						// 	});

						// 	const users = await response.json();
						// 	// console.log("Search Response: ", users);
						// 	this.searches = users;
						// } catch (error) {
						// 	console.error("Error fetching data:", error);
						// 	this.searches = [];
						// }
					}
				}
			}, 1000); // Adjust debounce delay as needed

			// Call the debouncedSearchContact function with the search term from the input event
			debouncedSearchContact(event.target.value);
		},

		async searchContactsByDate() {
			this.$toast.open({
				message: `Searching by Dates - ${this.search}`,
				type: 'info',
				duration: 5000,
				dismissible: true,
				position: 'top'
			});

			try {
				// Ensure dates and agentId are available
				if (!this.date || !this.date[0] || !this.date[1]) {
					throw new Error("Start date and end date are required.");
				}
				if (!this.agentDetails || !this.agentDetails.id) {
					throw new Error("Agent ID is required.");
				}

				// Log dates for debugging
				// console.log("Dates: ", this.date[0], this.date[1]);

				// Perform the search request
				const response = await fetcher(`/search`, "POST", {
					startDate: this.date[0],
					endDate: this.date[1],
					agentId: this.agentDetails.id
				});

				// Log the response for debugging
				// console.log("Search Response: ", response);

				// Update searches state with the response
				this.searches = response;

			} catch (error) {
				console.error("Error during search: ", error);

				// Show error toast notification
				this.$toast.open({
					message: `Error: ${error.message}`,
					type: 'error',
					duration: 5000,
					dismissible: true,
					position: 'top'
				});
			}
		},

		async searchBySentiment() {
			this.$toast.open({
				message: `Searching by Sentiments - ${this.search}`,
				type: 'info',
				duration: 5000,
				dismissible: true,
				position: 'top'
			});

			const response = await fetcher(`/search`, "POST", {
				searchTerm: "",
				agentId: this.agentDetails.id,
				sentimentOption: this.search
			});

			// console.log("Search Response: ", response);
			this.searches = response;
		},

		async searchByStatuses() {
			this.$toast.open({
				message: `Searching by Statuses - ${this.search}`,
				type: 'info',
				duration: 5000,
				dismissible: true,
				position: 'top'
			});

			const response = await fetcher(`/search`, "POST", {
				searchTerm: "",
				agentId: this.agentDetails.id,
				statusOption: this.search
			});

			// console.log("Search Response: ", response);
			this.searches = response;
		},

		updateSearch(data) {
			this.searches = data;
		},

		async batchDelete() {
			this.batchDeleting = true;
			const ids = this.searches.map(user => user._id);

			try {
				const response = await fetcher("/batch-delete-users", "POST", { contactsToDelete: ids })

				this.$toast.open({
					message: 'Batch deletee successful',
					type: 'success',
					duration: 2000,
					dismissible: true,
					position: 'top'
				})
				
				this.loadUsers();
				this.batchDeleting = false;
				this.search = "";
				this.searches = []
			} catch (error) {
				this.batchDeleting = false

				this.$toast.open({
					message: 'A problem occured, try again later.',
					type: 'error',
					duration: 2000,
					dismissible: true,
					position: 'top'
				})
			}
		},

		setTranscript(data) {
			this.transcript = data;
			this.analyzedTranscript = data.analyzedTranscript;
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
			@apply gap-6 mt-6 flex-wrap;
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
			@apply rounded-xl border border-gray-200 bg-white;

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

	.SideDialogue {
		@apply fixed inset-y-0 right-0 w-[500px] bg-white
	}
}
</style>