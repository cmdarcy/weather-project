const form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", (e) => {
	e.preventDefault();
	const input = document.querySelector(".input-control").value;
	document.querySelector(".input-control").value = "";
});
