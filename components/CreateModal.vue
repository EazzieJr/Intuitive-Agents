<template>
	<div class="CreateModal bg-black bg-opacity-20 fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center"
		@click.self="closeModal">
		<div class="Popup relative rounded-3xl bg-white p-5 lg:p-7 flex flex-col items-center w-full max-w-[400px]">
			<h3 class="font-bold text-2xl">
				Create a new contact
			</h3>

			<button class="Close absolute right-5 top-5" @click="closeModal">
				<img src="/svg/close.svg" alt="" />
			</button>

			<form @submit.prevent action="" class="w-full mt-6">
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
		</div>
	</div>
</template>

<script>
import { mapState } from 'pinia'
import { useStore } from '~/store/index'
import fetcher from '~/utils/fetcher'

export default {
	props: {
		agentId: {
			type: String,
			required: true
		}
	},

	data() {
		return {
			user: {
				firstName: "",
				lastName: "",
				email: "",
				phone: ""
			},

			updating: false
		}
	},

	computed: {
		...mapState(useStore, ["agentDetails"])
	},

	methods: {
		async createUser(e) {
			this.updating = true;
			try {
				// Use fetch
				//// console.log("Latest log: ", this.user, this.agentId);
				const response = await fetcher(`/users/create`, 'POST', {
					firstname: this.user.firstName,
					email: this.user.email,
					lastname: this.user.lastName,
					phone: this.user.phone,
					agentId: this.agentId,
				});

				// if (!response.ok) {
				// 	throw new Error(`HTTP error! Status: ${response.status}`);
				// }

				// this.$emit("userCreated");
				this.updating = false;
				this.closeModal();
			} catch (err) {
				//// console.log(err);
			}
		},

		closeModal() {
			this.$emit("closeModal");
		}
	},

	mounted() {
		// // console.log("Agent ID: ", this.agentId);
		// // console.log("Agent Details 2: ", this.agentDetails);
	}
}
</script>

<style></style>