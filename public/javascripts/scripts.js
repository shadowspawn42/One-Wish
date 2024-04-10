function openForm() {
    document.getElementById("createWishList").style.display = "block";
  }

function closeForm() {
    document.getElementById("createWishList").style.display = "none";
  }

function share(id) {
  var message = "Here is the link to share:\nlocalhost:3000/wishlist/" + id;
  alert(message);
}