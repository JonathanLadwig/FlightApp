function openNav() {
  document.getElementById("mySidebar").style.width = "30vw";
  document.getElementById("main").style.marginLeft = "30vw";
  document.getElementById("sidebutt").style.color = "rgba(0, 0, 0, 0)";
}

function closeNav() {
  document.getElementById("mySidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.getElementById("sidebutt").style.color = "rgba(0, 0, 0, 1)";
}
