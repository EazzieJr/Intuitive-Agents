<template>
	<nav class="TopNav">
		<div class="NavContainer between">
			<div class="Left start">
				<div class="Navlinks start">
					<NuxtLink to="/dashboard/home">
						Home
					</NuxtLink>

					<NuxtLink to="/dashboard/home">
						Agents
					</NuxtLink>
				</div>
			</div>

			<div class="More">
				<UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
					<UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
				</UDropdown>
			</div>
		</div>

		<GetSchedules v-if="schedularModal" :agentId="agentId" @closeSchedular="closeSchedular" />

	</nav>
</template>

<script>
import { mapState } from 'pinia'
import { useStore } from '~/store/index'

export default {
	data() {
		return {
			items: [
				[{
					label: 'Schedules',
					icon: 'i-heroicons-clock-20-solid',
					click: () => {
						this.schedularModal = true
						// console.log(this.schedularModal)
					}
				}], [{
					label: 'Reset statuses',
					icon: 'i-heroicons-arrow-path-20-solid',
					shortcuts: ['R'],
					click: () => {
						this.resetStatuses()
					}
				}], [
					{
						label: 'Delete',
						icon: 'i-heroicons-trash-20-solid',
						click: () => this.deleteAllContacts(),
						class: 'hover:text-white hover:fill-current hover:bg-red-500',
						iconClass: 'fill-current'
					}
				]
			],

			// agentId: "",
			schedularModal: false
		}
	},

	computed: {
		...mapState(useStore, ['agentId'])
	},

	methods: {
		async deleteAllContacts() {
			try {
				// USe fetch

				const response = await fetch(`https://intuitiveagents.io/deleteAll`, {
					method: 'PATCH',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						agentId: this.agentId
					})
				});

				if (!response.ok) {
					throw new Error(`HTTP error! Status: ${response.status}`);
				}

			} catch (err) {
				//console.log(err);
			}
		},

		async resetStatuses() {
			try {
				// Use fetch
				const response = await fetch(`https://intuitiveagents.io/users/status/reset`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						agentId: this.agentId
					})
				});
			} catch (err) {
				//console.log(err);
			}
		},

		closeSchedular() {
			this.schedularModal = false
		}
	}
}
</script>

<style lang="postcss" scoped>
.TopNav {
	@apply px-10 py-7 border-b border-[#E6E6E6] sticky top-0 bg-white ml-[240px] z-50;

	.NavContainer {
		@apply flex justify-between items-center;

		.Left {
			@apply space-x-20;

			.Logo {
				a {
					img {
						@apply w-20
					}

					/* @apply font-bold text-2xl; */
				}
			}

			.Navlinks {
				@apply space-x-10;

				a {
					@apply text-base font-medium text-[#676767];

					/* &.router-link-active {
						@apply text-[#000000] underline underline-offset-4 font-bold duration-500;
					} */
				}
			}
		}
	}
}
</style>