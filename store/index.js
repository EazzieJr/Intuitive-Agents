import { defineStore } from 'pinia'

export const useStore = defineStore({
	id: 'main',
	state: () => ({
		companies: [
			{
				name: "Va Group",
				agents: [
					{
						name: "olivia",
						alias: "Virtual Team Expert"
					},
					{
						name: "chloe",
						alias: "Arrow Roofing Services"
					}
				]
			},


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
			// console.log('signing in')
		}
	},
})
