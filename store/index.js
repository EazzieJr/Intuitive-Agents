import { defineStore } from 'pinia'

export const useStore = defineStore({
	id: 'main',
	state: () => ({
		companies: [
			{
				name: "Va Group",
				agents: [
					// {
					// 	name: "daniel",
					// 	alias: "Virtual Help Desk"
					// },
					{
						name: "Ava",
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
				agents: [
					{
						name: "katherine",
						alias: "Katherine"
					}
				]
			}
		],

		agentDetails: {},
	}),
	// mutations: {
	// 	toggleSignInModal() {
	// 		this.showSignInModal = !this.showSignInModal
	// 	}
	// },
	getters: {
		// Define your store getters here
	},
	actions: {
		// Define your store actions here
		signIn() {
			console.log('signing in')
		}
	},
})
