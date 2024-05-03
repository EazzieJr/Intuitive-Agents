<template>
	<div class="Table overflow-hidden">
		<div class="Header flex items-center grow">
			<div>S/N</div>

			<div>First Name</div>

			<div>Last Name</div>

			<div>Email</div>

			<div>Phone</div>

			<div>Status</div>

			<div>Actions</div>
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
						<img :src="`/svg/calls/${user.status.split(' ').join('-')}.svg`" alt="">
						<span class="Status active">
							{{ user.status }}
						</span>
					</div>

					<div class="!flex start">
						<UDropdown :items="dropdownItems(user)" mode=hover
							:popper="{ offsetDistance: 0, placement: 'bottom-start' }">
							<UButton color="white" label="Actions" trailing-icon="i-heroicons-chevron-down-20-solid" />
						</UDropdown>
					</div>
				</div>
			</div>

			<div class="Empty col-center h-[400px]" v-if="users.length == 0">
				<img src="/svg/empty.svg" alt="">

				<p>
					{{ fetching ? "Fetching table data" : "No Available Contact on this agent" }}
				</p>
			</div>
		</div>

		<div class="Pagination between" v-if="users.length > 0 && !filter">
			<button class="Previous" @click="paginate(page - 1)" :disabled="page == 1 || fetching">
				<span>
					Previous
				</span>
			</button>

			<div>
				<span class="" v-if="!fetching">
					{{ page }} of {{ totalPages }}
				</span>

				<img class="animate-spin duration-1000 py-1 w-6" v-else src="/svg/loading-dark.svg" alt="">
			</div>

			<button class="Next" @click="paginate(page + 1)" :disabled="page == pages || fetching">
				<span>
					Next
				</span>
			</button>
		</div>

		<div class="CreateModal bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
			v-if="modalOpened" @click.self="closeModal">
			<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
				<h3 class="font-bold text-2xl">
					{{ formType === "create" ?
					"Create a new contact" :
					formType === "upload" ?
					"Upload CSV file" :
					"Update contact details" }}
				</h3>

				<button class="Close absolute right-5 top-5" @click="closeModal">
					<img src="/svg/close.svg" alt="" />
				</button>

				<form @submit.prevent action="" class="w-full mt-6" v-if="formType === 'create'">
					<div class="Inputs space-y-5">
						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="text" v-model="user.firstName"
								placeholder="First Name" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="text" v-model="user.lastName"
								placeholder="Last Name" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="email" v-model="user.email"
								placeholder="Email Address" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="phone" v-model="user.phone"
								placeholder="Phone Number" />
						</div>
					</div>

					<button @click="createUser"
						class="Submit center py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-full mt-10">
						<span v-if="!updating">
							Create
						</span>

						<img class="animate-spin duration-1000 py-1 w-6" v-else src="/svg/loading.svg" alt="">
					</button>
				</form>

				<div class="UploadFile w-full mt-6" v-else-if="formType === 'upload'">
					<div
						class="FIleDrop bg-[#FCFCFD] h-[180px] rounded-lg border border-dashed border-border-2 border-spacing-2 cursor-pointer w-full flex justify-center items-center"
						onClick={openFileInput} onDragOver={handleDragOver} onDrop={handleDrop}>
						<p class="text-sm text-[#718096] text-center">
							Drag and drop assets here <br /> or{" "}
							<span class="text-[#282c34] font-semibold">upload</span> from your computer
						</p>
					</div>

					<div class="OtherDeats flex justify-between items-center mt-5 space-x-5">
						<p class="text-[#282c34] text-xs">
							File:{" "}
							<span class="font-semibold text-[#718096]">
								{uploadedFiles?.name || "No file selected"}
							</span>
						</p>

						<button onClick={uploadFile}
							class="Upload py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-[160px]">
							Upload
						</button>
					</div>

					<input accept=".csv" type="file" name="file" id="file" class="hidden" onChange={handleFileUpload} />
				</div>

				<form @submit.prevent action="" class="w-full mt-6 " v-else>
					<div class="Inputs space-y-5">
						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="text" v-model="user.firstName"
								placeholder="First Name" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="text" v-model="user.lastName"
								placeholder="Last Name" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="email" v-model="user.email"
								placeholder="Email Address" />
						</div>

						<div class="Input border rounded-lg overflow-hidden">
							<input class=" py-3 px-2.5 focus:outline-none w-full" type="phone" v-model="user.phone"
								placeholder="Phone Number" />
						</div>
					</div>

					<button @click="updateContact"
						class="Submit py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-full mt-10">
						Update
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script>
import moment from "moment-timezone";
export default {
	props: {
		users: {
			type: Array
		},
		searching: {
			type: Boolean,
			default: true
		},
		totalPages: {
			type: Number,
		},
		page: {
			type: Number,
		},
		fetching: {
			type: Boolean,
			// default: true
		},
		agentDetails: {
			type: Object
		},
		filter: {
			type: Boolean
		}
	},

	data() {
		return {
			user: {
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				id: ""
			},
			formType: "",
			stats: null,
			date: new Date(),
			tempPage: this.page,
			modalOpened: false,
			updating: false,
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
		dropdownItems(user) {
			return [
				[{
					label: 'Call',
					icon: 'i-heroicons-phone-20-solid',
					click: () => this.callContact(user)
				}, {
					label: 'Transcript',
					icon: 'i-heroicons-document-text-20-solid',
					click: () => this.setTranscript(user)
				}],
				[{
					label: 'Edit',
					icon: 'i-heroicons-pencil-square-20-solid',
					click: () => this.toggleCreateModal('update', user)
				},],
				[
					{
						label: 'Delete',
						icon: 'i-heroicons-trash-20-solid',
						click: () => this.deleteContact(user),
						class: 'hover:text-white hover:fill-current hover:bg-red-500',
						iconClass: 'fill-current'
					}
				]
				// Add more items as needed
			];
		},

		toggleCreateModal(formType, user) {
			if (formType) {
				this.formType = formType;
			}

			if (user) {
				const { _id, phone, firstname, lastname, email } = user;

				this.user = {
					id: _id,
					firstName: firstname,
					lastName: lastname,
					email,
					phone
				}
			}

			this.modalOpened = !this.modalOpened;
		},

		loadUsers(page) {
			this.$emit("loadUsers", page)
		},

		async filterByDate() {
			const searching = true;
			this.getStats(searching)
			// const pstDate = moment(this.date).tz("America/Los_Angeles").format('YYYY-MM-DD');
			// this.loadUsers(pstDate);
		},

		async updateContact() {
			const {email, firstName, lastName, phone, id} = this.user
			try {
				const response = await fetch(`https://intuitiveagents.io/users/update`, {
					method: "PATCH",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						id,
						fields: {
							firstname: firstName,
							lastname: lastName,
							email,
							phone,
						}
					})
				});

				this.loadUsers(this.page);

				this.toggleCreateModal();

				//console.log("Response: ", response);
			} catch (err) {
				//console.log(err);
			}
		},

		async callContact(user) {
			const { _id, phone } = user;
			try {
				// Use fetch
				const response = await fetch(`https://intuitiveagents.io/create-phone-call/${this.agentDetails.id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						fromNumber: this.agentDetails.number,
						toNumber: phone,
						userId: _id,
					})
				});
				
				// const response = await axios.post(`https://intuitiveagents.io/create-phone-call/${this.agentDetails.id}`, {
				// 	fromNumber: "+17257268989",
				// 	toNumber: phone,
				// 	userId: _id,
				// });

				//console.log("Response: ", response);
			} catch (err) {
				//console.log(err);
			}
		},

		async createUser() {
			const { email, firstName, lastName, phone } = this.user
			this.updating = true;
			try {
				const response = await fetch(`https://intuitiveagents.io/users/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						firstname: firstName,
						lastname: lastName,
						email,
						phone,
						agentId: this.agentDetails.id
					})
				});

				this.loadUsers(this.page);

				this.updating = false;
				this.toggleCreateModal();
				this.user = {
					firstName: "",
					lastName: "",
					email: "",
					phone: "",
					id: ""
				}

				//console.log("Response: ", response);
			} catch (err) {
				//console.log(err);
			}
		},

		async deleteContact(user) {
			try {
				const response = await fetch(`https://intuitiveagents.io/users/delete`, {
					method: "PATCH",
					body: JSON.stringify({
						id: user._id
					}),
					headers: {
						"Content-Type": "application/json"
					}
				})
			} catch (err) {
				console.log(err);
			}
		},

		paginate(page) {
			console.log(page);
			this.$emit("paginate", page)
		},

		setTranscript(user) {
			const transcript = user.referenceToCallId
			const analyzedTranscript = user.analyzedTranscript
			this.$emit("setTranscript", transcript, analyzedTranscript)
		},

		closeModal() {
			this.modalOpened = false;
			this.user = {
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				id: ""
			}
		}
	},

	beforeMount() {
		// this.getStats(false)
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
				@apply basis-[12%];
			}

			&:nth-child(3) {
				@apply basis-[12%];
			}

			&:nth-child(4) {
				@apply basis-[28%];
			}

			&:nth-child(5) {
				@apply basis-[15%];
			}

			&:nth-child(6) {
				@apply basis-[17%];
			}

			&:nth-child(7) {
				@apply basis-[12%];
			}
		}
	}

	.Data {
		.DataContainer {
			@apply overflow-y-scroll h-fit max-h-[500px];

			&::-webkit-scrollbar {
				display: none;
			}

			.Row {
				@apply p-4 border-b border-gray-200;

				div {
					@apply block text-[#09090B] capitalize text-sm;

					&:nth-child(1) {
						@apply basis-[4%];
					}

					&:nth-child(2) {
						@apply basis-[12%];
					}

					&:nth-child(3) {
						@apply basis-[12%];
					}

					&:nth-child(4) {
						@apply basis-[28%];
					}

					&:nth-child(5) {
						@apply basis-[15%];
					}

					&:nth-child(6) {
						@apply basis-[17%] space-x-2 !flex;

						img {
							@apply w-4
						}
					}

					&:nth-child(7) {
						@apply basis-[12%] font-bold;
					}
				}
			}
		}
	}

	.Pagination {
		@apply px-5 pt-2.5 xl:pt-3 pb-3.5 xl:pb-4;

		button {
			@apply border border-gray-200 py-2 px-3 xl:px-3.5 rounded-lg text-[#344054] text-sm leading-5
		}

		span {
			@apply block text-[#344054] text-sm leading-5
		}
	}
}
</style>