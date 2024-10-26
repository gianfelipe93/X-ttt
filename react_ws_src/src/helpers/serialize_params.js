const serialize_params = function (obj) {
	return Object.keys(obj).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])).join('&')
}

export default serialize_params