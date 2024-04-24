<template>
	<div class="DashboardLayout">
		<TopNav />

		<!-- <nav class="Sidebar">
			<div class="NavContainer">
				<div class="NavHeader">
					<NuxtLink to="/">
						VA Group
					</NuxtLink>
				</div>

				<div class="NavLinks">
					<NuxtLink to="/">

					</NuxtLink>

					<NuxtLink to="/">
						VA Group
					</NuxtLink>

					<NuxtLink to="/">
						VA Group
					</NuxtLink>
				</div>
			</div>
		</nav> -->

		<div class="Main" data-lenis-prevent>
			<slot />
		</div>
	</div>
</template>

<script>
import Lenis from '@studio-freight/lenis';

export default {
	data() {
		return {
			Lenis: Lenis
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
		}
	},

	mounted() {
		// this.initLenis()
	}
}
</script>

<style lang="postcss" scoped>
.DashboardLayout {
	nav.Sidebar {
		@apply py-5 h-screen w-[240PX] border-r border-[#E6E6E6];

		.NavContainer {
			.NavHeader {
				@apply p-5 border-b border-[#E6E6E6];

				a {
					@apply text-2xl font-bold uppercase
				}
			}

			.NavLinks {
				@apply p-5 pt-20;
			}
		}
	}

	.Main {
		@apply px-10 bg-[#FAFAFA] h-[calc(100vh_-_81px)] pb-10 overflow-y-auto;
	}
}
</style>