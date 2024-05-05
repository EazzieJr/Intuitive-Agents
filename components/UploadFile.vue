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
export default {
	props: {
		agentId: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			uploadedFiles: null
		}
	},

	methods: {
		async uploadFile() {
			const formData = new FormData();
			formData.append("csvFile", this.uploadedFiles);

			try {
				// Use fetch
				const response = await fetch(`https://intuitiveagents.io/upload/${this.agentId}`, {
					method: "POST",
					body: formData
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

				// const response = await axios.post(`https://intuitiveagents.io/upload/${this.agentId}`, formData, {
				// 	headers: {
				// 		"Content-Type": "multipart/form-data",
				// 	},
				// });

				toggleCreateModal();
				setUploadedFiles([]);

				//console.log("Response: ", response);
			} catch (err) {
				//console.log(err);
			}
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