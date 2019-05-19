async function afterFriendsLoad(data) {
	loadingElement('friends');
	updateButtonStatus('friends', 'events', 'map');
	console.log("dane", data);

	$("#customIdFriend").text("dupa");
	closeLoading('friends');
}