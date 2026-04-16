function envoyer(e) {
  e.preventDefault();

  let email = document.getElementById("bar_E2").value;
  let phone = document.getElementById("bar_n").value;
  let date = document.getElementById("bar_D").value;

  localStorage.setItem("email", email);
  localStorage.setItem("phone", phone);
  localStorage.setItem("date", date);

  window.location.href = "prive.html";
}