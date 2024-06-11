import Cookie from "js-cookie";

export default defineNuxtRouteMiddleware(async (to, from) => {

	// Check for token
	const token = Cookie.get('token');

	console.log('Token', token);
	if (!token) {
		// Redirect to login page
		return navigateTo('/user/signin');
	}
});