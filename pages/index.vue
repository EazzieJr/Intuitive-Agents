<template>
	<div class="Home">
		<nav class="fixed top-10 left-10">
			<div class="Logo bg-white">
				<img class="w-40" src="/svg/intuitive-logo.svg" alt="">
			</div>
		</nav>

		<header class="col-center">
			<div class="Text">
				<h1 class="w-fit">Welcome to Intuitive Agents</h1>

				<p class="text-sm text-center text-[#676767]">Pick a company you'd like to access.</p>
			</div>

			<div class="Links center">
				<NuxtLink
					:to="company?.link ? company.link : `/dashboard/company/${company.name.toLowerCase().split(' ').join('-')}/${company.agents[0].name}`"
					class="Link" v-for="company in store.companies" :key="company.name">
					<div class="Image">
						<img :src="`/images/companies/${company.name.toLowerCase().split(' ').join('-')}.png`" alt="">
					</div>

					<span class="Name">
						{{ company.name }}
					</span>

					<p>
						{{ company.agents.length }} Agent{{ company.agents.length > 1 ? 's' : '' }}
					</p>
				</NuxtLink>
			</div>
		</header>
	</div>
</template>

<script>
import { useStore } from '@/store/index'
definePageMeta({
	layout: "default",
	middleware: "auth"
})

export default {
	data() {
		return {
			store: useStore(),
			companies: [
				{
					name: "Va Group",
					agents: [
						// {
						// 	name: "daniel",
						// 	alias: "Virtual Help Desk"
						// },
						{
							name: "olivia",
							alias: "Virtual Team Expert"
						},
						// {
						// 	name: "chloe",
						// 	alias: "Remote Solutions Team"
						// }
					]
				},

				{
					name: "Be + well",
					link: "/dashboard/company/be-well/katherine",
					agents: [
						{
							name: "katherine",
							alias: "Katherine"
						}
					]
				}
			]
		}
	},

	mounted() {
		// this.store.dispatch('setCompanies', this.companies)
	}
}
</script>

<style lang="postcss" scoped>
.Home {
	@apply h-screen w-full bg-white;

	header {
		@apply w-full h-full space-y-10;

		.Text {
			@apply w-fit space-y-3;

			h1 {
				@apply text-4xl text-[#020202] font-bold
			}
		}

		.Links {
			@apply space-x-5;

			.Link {
				@apply w-64 h-fit p-5 bg-white rounded-2xl hover:shadow-md border duration-300;

				.Image {
					@apply w-16 h-16 rounded-full overflow-hidden bg-[#FAFAFA] border;

					img {
						@apply w-full h-full object-cover object-center;
					}
				}

				span {
					@apply text-2xl font-bold text-[#020202] mt-3 mb-2.5 block uppercase;
				}

				p {
					@apply text-sm text-[#676767];
				}
			}
		}
	}
}
</style>