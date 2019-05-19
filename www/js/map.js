async function afterMapLoad(data) {
	loadingElement('map');
	updateButtonStatus('map', 'events', 'friends');
	console.log("dane", data);

	$("#customIdMap").text("dupa");
	closeLoading('map');
}