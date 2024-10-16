<template>
	<div class="Login">
		<form @submit.prevent="login">
			<div class="Inputs">
				<div class="Input">
					<label for="username">Username</label>
					<input type="test" id="username" v-model="user.username" placeholder="Admin" required />
				</div>

				<div class="Input">
					<label for="password">Password</label>
					<input type="password" id="password" v-model="user.password" placeholder="Password" required />
				</div>
			</div>

			<button class="Download p-[4px] relative w-full">
				<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

				<div
					class="center space-x-3.5 px-4 py-3  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent w-full">
					<img v-if="loggingIn" class="w-6 animate-spin" src="/svg/loading.svg" alt="">

					<span class="text-base" v-else>
						Login
					</span>
				</div>
			</button>
		</form>
	</div>
</template>

<script>
import Cookies from 'js-cookie'

definePageMeta({
	layout: "onboarding",
	title: "Admin Login",
	hint: "Enter your credentials to access the admin dashboard.",
})

export default {
	data() {
		return {
			user: {
				username: null,
				password: null,
			},

			loggingIn: false
		}
	},

	methods: {
		async login() {
			this.loggingIn = true

			try {
				const response = await fetch('https://intuitiveagents.ai/admin/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(this.user)
				})

				const { payload } = await response.json()

				console.log(payload)
				Cookies.set('token', payload.token, { expires: 3 })
				this.$toast.open({
					message: payload.message,
					type: 'success',
					duration: 3000,
					dismissible: true,
					position: 'top'
				});


				this.$router.push('/')
				this.loggingIn = false
			} catch (error) {
				this.loggingIn = false
				console.log(error)
				// this.$toast.error(error.response.data.message)
			}
		}
	}
}
</script>

<style lang="postcss" scoped>
form {
	@apply space-y-10;

	.Inputs {
		@apply space-y-5;

		.Input {
			@apply space-y-2.5;

			label {
				@apply block text-sm font-semibold text-[#374151];
			}

			input {
				@apply rounded-lg border border-gray-300 p-3 w-full leading-none;
			}
		}
	}
}
</style>