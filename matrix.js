async function configure() {
	if ("serial" in navigator){
		//To check if Web Serial API is supported
		console.log("serial")

		//Prompt user to select any serial port
		port = await navigator.serial.requestPort();
		console.log(port.getInfo())

		try {
			// Wait for the serial port to open
			await port.open({baudRate: 9600});
			exports.port = port;
		} catch(e){
			console.log(e)
			return;
		}

		if(!textDecoder){
			//grabs all Unit8Array chunks and coverts them to strings
			textDecoder = new TextDecoderStream();
			readableStrtamClosed = port.readable.pipeTo(textDecoder.writable);
			reader = textDecoder.readable.getReader();
		}

		if(!textEncoder){
			//sending text to the device
			textEncoder = new TextEncoderStream();
			WritableStreamClosed = textEncoder.readable.pipeTo(port.writable);
			writer = textEncoder.writable.getWriter();
		}

		redrawAllNotes()
		readLoop()
	}
}

async function readLoop() {
	var command;
	var elID;
	var beatNum;

	while(true) {
		const { value, done } = await reader.read()
		if (done) {
			reader.releaseLock();
			break;
	}
	command = value.split(" ");
	if(command[0] === "bp") {
		elID = converterGridCordsToElId(command);
		if (elID !== "Nan")
			activateNote(elID);
	}
	}
}