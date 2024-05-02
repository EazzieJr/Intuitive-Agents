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



			<!-- <template> -->
			<!-- <UButton>
					Button
				</UButton> -->
			<!-- <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
					<UButton color="white" label="Options" trailing-icon="i-heroicons-chevron-down-20-solid" />
				</UDropdown> -->
			<!-- </template> -->

			<!-- <button class="Download p-[3px] relative">
				<div class="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />

				<div
					class="start space-x-3.5 px-5 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
					<img src="/svg/download.svg" alt="">

					<span :class="{ 'animate-pulse': exporting }">
						{{ exporting ? "Exporting" : "Download" }} CSV
					</span>
				</div>
			</button> -->
		</div>
	</nav>
</template>

<script>
export default {
	data() {
		return {
			items: [
				[{
					label: 'Reset statuses',
					icon: 'i-heroicons-pencil-square-20-solid',
					shortcuts: ['R'],
					click: () => {
						console.log('Edit')
					}
				}, {
					label: 'Duplicate',
					icon: 'i-heroicons-document-duplicate-20-solid',
					shortcuts: ['D'],
					disabled: true
				}], [{
					label: 'Archive',
					icon: 'i-heroicons-archive-box-20-solid'
				}, {
					label: 'Move',
					icon: 'i-heroicons-arrow-right-circle-20-solid'
				}], [{
					label: 'Delete contacts',
					icon: 'i-heroicons-trash-20-solid',
					// shortcuts: ['⌘', 'D']
				}]
			]
		}
	},

	methods: {

	}
}
</script>

<style lang="postcss" scoped>
.TopNav {
	@apply px-10 py-[21px] border-b border-[#E6E6E6] sticky top-0 bg-white ml-[240px] z-50;

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