<template>
	<div class="DashboardLayout">
		<TopNav />

		<nav class="Sidebar">
			<div class="NavContainer">
				<div class="NavHeader start">
					<NuxtLink to="/" class="start">
						<div class="Image">
							<img :src="`/images/companies/${companyName}.png`" alt="">
						</div>

						<span>
							{{ companyName?.split('-').join(' ')}}
						</span>
					</NuxtLink>
				</div>

				<div class="NavLinks">
					<NuxtLink class="NavLink" v-for="company in selectedCompany?.agents" :key="company.name"
						:to="`/dashboard/company/${companyName}/${company.name}`">
					{{ company.alias }}
					</NuxtLink>
				</div>
			</div>
		</nav>

		<div class="Main" data-lenis-prevent>
			<slot />
		</div>
	</div>
</template>

<script>
import Lenis from '@studio-freight/lenis';
import { mapState } from 'pinia'
import { useStore } from '~/store'

export default {
	data() {
		return {
			page: {},
			Lenis,
		}
	},

	computed: {
		...mapState(useStore, ['companies']),

		companyName() {
			const { fullPath } = this.page
			// console.log(fullPath?.split('/')[3])

			return fullPath?.split('/')[3]
		},

		selectedCompany() {
			return this.companies.find((company) => company.name.toLowerCase().split(' ').join('-') === this.companyName)
		}
	},

	watch: {
		'$route'() {
			this.updatePageData()
		}
	},

	methods: {
		initLenis() {
			this.lenis = new Lenis({ duration: 2 })

			this.lenis.on('scroll', (e) => {
				// console.log(e)
			})

			const raf = (time) => {
				this.lenis.raf(time)
				requestAnimationFrame(raf)
			}

			requestAnimationFrame(raf)
		},

		updatePageData() {
			this.page = this.$route
			// console.log(this.$route)
		}
	},

	mounted() {
		this.updatePageData()
	}
}
</script>

<style lang="postcss" scoped>
.DashboardLayout {
	nav.Sidebar {
		@apply h-screen w-[240px] border-r border-[#E6E6E6] fixed top-0 left-0 bottom-0;

		.NavContainer {
			.NavHeader {
				@apply p-5 py-6 border-b border-[#E6E6E6];

				a {
					@apply text-2xl font-bold uppercase space-x-5;

					.Image {
						@apply w-10 h-10 rounded-full overflow-hidden bg-[#FAFAFA] border;

						img {
							@apply w-full h-full object-cover object-center;
						}
					}
				}
			}

			.NavLinks {
				@apply space-y-2.5 p-5 py-10;

				.NavLink {
					@apply rounded-xl block px-2.5 py-2  text-base font-medium text-[#333333];

					&.router-link-exact-active {
						@apply bg-[#F3F4F6]
					}
				}
			}
		}
	}

	.Main {
		@apply px-10 bg-[#FAFAFA] h-[calc(100vh_-_81px)] pb-10 overflow-y-auto ml-[240px];
	}
}
</style>