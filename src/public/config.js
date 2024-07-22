const { BASE_URL } = await fetch('/config.js').then(res => res.text()).then(text => eval(text));

window.config = { BASE_URL };