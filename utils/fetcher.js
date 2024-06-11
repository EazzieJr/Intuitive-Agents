import Cookies from 'js-cookie';

const fetcher = async (url, method = 'GET', data = null) => {
	const token = Cookies.get('token');

	if (!token) {
		throw new Error('Unauthorized!');
	}

	const headers = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`,
	}

	try {
		const response = await fetch(`https://intuitiveagents.io${url}`, {
			method,
			headers,
			body: data && JSON.stringify(data),
		});

		const responseData = await response.json();

		if (!response.ok) {
			throw new Error(responseData.message || 'Something went wrong!');
		}

		console.log('Response Data', response);
		return responseData;
	} catch (error) {
		throw new Error(error.message || 'Something went wrong!');
	}
}

export default fetcher;