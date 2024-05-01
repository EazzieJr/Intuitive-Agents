<template>
	<div class="Table">
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
						<img :src="`/svg/calls/${user.status}.svg`" alt="">
						<span class="Status active">
							{{ user.status }}
						</span>
					</div>

					<div class="!flex start">
						<button @click="setTranscript(user)" class="w-10 h-10 rounded-lg center">
							<img class="w-5" src="/svg/transcript.svg" alt="">
						</button>

						<button
							class="Call w-10 h-10 rounded-lg text-sm font-medium text-white flex items-center justify-center duration-300 hover:bg-green-200"
							@click=phoneContact(user)>
							<img class="w-5" src="/svg/phone.svg" alt="" />
						</button>

						<button
							class="Call w-10 h-10 rounded-lg text-sm font-medium text-white flex items-center justify-center duration-300 hover:bg-yellow-100"
							@click="toggleCreateModal('update', user)">
							<img class="w-5" src="/svg/edit.svg" alt="" />
						</button>

						<button
							class="Call w-10 h-10 rounded-lg text-sm font-medium text-white flex items-center justify-center duration-300 hover:bg-red-200"
							@click="deleteContact(client)">
							<img class="w-5" src="/svg/delete.svg" alt="" />
						</button>
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

		<div class="Pagination between" v-if="users.length > 0">
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
			v-if="modalOpened">
			<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
				<h3 class="font-bold text-2xl">
					{{ formType === "create" ? "Create a new contact" : formType === "upload" ? "Upload CSV file" : "Update contact details" }}
				</h3>

				<button class="Close absolute right-5 top-5" onClick={closeModal}>
					<img src="/svg/close.svg" alt="" />
				</button>

				<form action="" class="w-full mt-6" v-if="formType === 'create'">
					<div class="Inputs space-y-5">
						<div class="Input">
							<input type="text" value={firstName} onInput={handleFirstNameChange} placeholder="First Name" />
						</div>

						<div class="Input">
							<input type="text" value={lastName} onInput={handleLastNameChange} placeholder="Last Name" />
						</div>
						<div class="Input">
							<input type="email" value={email} onInput={handleEmailChange} placeholder="Email Address" />
						</div>

						<div class="Input">
							<input type="phone" value={phone} onInput={handlePhoneChange} placeholder="Phone Number" />
						</div>
					</div>

					<button onClick={createUser}
						class="Submit py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-full mt-10">
						Create
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

				<form action="" class="w-full mt-6" v-else>
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

		toggleCreateModal(formType, user) {
			if (formType) {
				this.formType = formType;
			}

			if (client) {
				const { _id, phone, firstname, lastname, email } = user;

				this.user = {
					id: _id,
					firstname,
					lastname,
					email,
					phone
				}
			}

			this.modalOpened = !this.modalOpened;
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
		},

		async updateContact() {
			try {
				const response = await axios.patch(`https://intuitiveagents.io/users/update`, {
					id,
					fields: {
						firstname: firstName,
						lastname: lastName,
						email: email,
						phone: phone,
					},
				});

				this.loadUsers(this.page);

				toggleCreateModal();

				//console.log("Response: ", response);
			} catch (err) {
				//console.log(err);
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
				@apply basis-[15%];
			}

			&:nth-child(7) {
				@apply basis-[16%];
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
						@apply basis-[15%] space-x-2 !flex;

						img {
							@apply w-4
						}
					}

					&:nth-child(7) {
						@apply basis-[16%] font-bold;
					}

					&:nth-child(8) {
						@apply basis-[6%];
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