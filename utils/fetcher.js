import Cookies from 'js-cookie';

const token = Cookies.get('token');

const defaultHeaders = {
	'Content-Type': 'application/json',
	Authorization: `Bearer ${token}`
}

const fetcher = async (url, method = 'GET', data = null, headers = defaultHeaders) => {
	if (!token) {
		throw new Error('Unauthorized!');
	}

	// const headers = {
	// 	'Content-Type': 'application/json',
	// 	Authorization: `Bearer ${token}`,
	// }

	try {
		const response = await fetch(`https://intuitiveagents.ai${url}`, {
			method,
			headers,
			body: data && JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Something went wrong!');
		}

		// console.log('Response Data', response);
		return responseData;
	} catch (error) {
		throw new Error(error.message || 'Something went wrong!');
	}
}

export default fetcher;