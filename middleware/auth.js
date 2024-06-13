import Cookies from "js-cookie";
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
	// Check for token
	const token = Cookies.get('token');

	console.log('Token:', token);
	if (!token) {
		console.log('No token found:', !token);
		// Redirect to login page
		return navigateTo('/user/signin');
	}
});
