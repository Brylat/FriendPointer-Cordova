async function afterEventLoad(data) {
	loadingElement('events');
	updateButtonStatus('events', 'friends', 'map');
    console.log("dane", data);

    $("#customIdEvent").text("dupa");
	closeLoading('events');
}