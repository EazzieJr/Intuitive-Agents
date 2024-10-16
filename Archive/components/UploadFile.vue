<template>
	<div class="CreateModal bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
		@click.self="closeModal">
		<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
			<h3 class="font-bold text-2xl">
				Upload CSV file
			</h3>

			<button class="Close absolute right-5 top-5" @click="closeModal">
				<img src="/svg/close.svg" alt="" />
			</button>

			<div class="UploadFile w-full mt-6">
				<div
					class="FIleDrop bg-[#FCFCFD] h-[180px] rounded-lg border border-dashed border-border-2 border-spacing-2 cursor-pointer w-full flex justify-center items-center"
					@click="openFileInput" @dragover="handleDragOver" @drop="handleDrop">
					<p class="text-sm text-[#718096] text-center">
						Drag and drop assets here <br /> or
						<span class="text-[#282c34] font-semibold">upload</span> from your computer
					</p>
				</div>

				<div class="mt-5">
					<div class="Input border rounded-lg overflow-hidden">
						<UInput size="lg" color="white" placeholder="Add Tag" v-model="day" type="text" />
					</div>
					<!-- <UDropdown :items="days" :popper="{ placement: 'bottom-start' }">
						<UButton class="capitalize" size="lg" color="white" :label="day ? day : 'Select Day'"
							trailing-icon="i-heroicons-chevron-down-20-solid" />
					</UDropdown> -->
				</div>
				<!-- <UInput class="mt-5" size="lg" color="white" placeholder="Input day tag" v-model="day" type="text" /> -->

				<div class="OtherDeats flex justify-between items-center mt-5 space-x-5">
					<p class="text-[#282c34] text-xs">
						File:
						<span class="font-semibold text-[#718096]">
							{{ uploadedFiles?.name || "No file selected" }}
						</span>
					</p>

					<button @click="uploadFile"
						class=" Upload py-3 px-5 rounded-lg text-sm font-medium bg-black text-white w-[160px]">
						Upload
					</button>
				</div>

				<input accept=".csv" type="file" name="file" id="file" class="hidden" @change="handleFileUpload" />
			</div>
		</div>
	</div>
</template>

<script>
import Cookies from "js-cookie";

export default {
	props: {
		agentId: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			uploadedFiles: null,
			day: "",
			days: [[
				{
					label: "Monday",
					click: () => {
						this.day = "Monday";
					}
				},

				{
					label: "Tuesday",
					click: () => {
						this.day = "Tuesday";
					}
				},

				{
					label: "Wednesday",
					click: () => {
						this.day = "Wednesday";
					}
				}]
			]
		}
	},

	methods: {
		async uploadFile() {
			const formData = new FormData();
			// console.log("Form Data: ", formData)
			// console.log(Object.fromEntries(formData.entries()));
			formData.append("csvFile", this.uploadedFiles);
			// formData.append('day', this.day)

			// console.log("Input File: ", this.uploadedFiles)

			const response = await fetch(`https://intuitiveagents.ai/upload/${this.agentId}?tag=${this.day.toLowerCase()}`, {
				method: "POST",
				body: formData,
				headers: {
					"Authorization": `Bearer ${Cookies.get("token")}`
				}
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Something went wrong");
			} else {
				this.$emit("closeModal");
				this.uploadedFiles = null;
			}

			// try {
			// 	// Use fetch

			// 	if (!response.ok) {
			// 		throw new Error(`HTTP error! Status: ${response.status}`);
			// 	}

			// 	// const response = await axios.post(`https://intuitiveagents.ai/upload/${this.agentId}`, formData, {
			// 	// 	headers: {
			// 	// 		"Content-Type": "multipart/form-data",
			// 	// 	},
			// 	// });

			// 	toggleCreateModal();
			// 	setUploadedFiles([]);

			// 	//console.log("Response: ", response);
			// } catch (err) {
			// 	//console.log(err);
			// }
		},

		handleFileUpload(event) {
			const files = event.target.files[0];

			if (files) {
				this.uploadedFiles = files;
			}
		},

		openFileInput() {
			const fileInputRef = document.getElementById("file");
			fileInputRef?.click();
		},

		handleDrop(event) {
			event.preventDefault();
			this.uploadedFiles = event.dataTransfer.files[0]
		},

		handleDragOver(event) {
			event.preventDefault();
		},

		closeModal() {
			this.$emit("closeModal");
		}
	}
}
</script>

<style></style>