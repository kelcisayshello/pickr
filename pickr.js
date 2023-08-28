chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.from === "popup" && message.query === "pickrClicked") {
        setTimeout(() => {
            const eyeDropper = new EyeDropper();

            eyeDropper.open().then(result => {
                chrome.storage.local.get("colorCode", (response) => {
                    if (response.colorCode && response.colorCode.length > 0) {
                        chrome.storage.local.set({ "colorCode": [...response.colorCode, result.sRGBHex] })
                    }
                    else {
                        chrome.storage.local.set({ "colorCode": [result.sRGBHex] })
                    }
                })
            }).catch(e => {
                console.log(e)
            })
        }, 500);
    }
})