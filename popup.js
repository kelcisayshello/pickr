window.addEventListener('DOMContentLoaded', () => {
    const pickrContainer = document.getElementById("pickrContainer");
    const pickrButtonContainer = document.getElementById("pickrButtonContainer");
    const palette = document.getElementById("palette");

    const action = (color, msg) => {
        const actionLabel = document.createElement("p")
        actionLabel.setAttribute("class", "actionLabel")
        actionLabel.style.backgroundColor = color
        actionLabel.innerText = msg
        pickrContainer.appendChild(actionLabel)

        // action item disappears after allotted time, higher = longer
        setTimeout(() => {
            pickrContainer.removeChild(actionLabel)
        }, 1600)
    }

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tab = tabs[0]

        if (tab.url === undefined || tab.url.indexOf('chrome') == 0) {
            pickrButtonContainer.innerHTML = 'Pickr currently does not support access to <i>Chrome</i> pages.'
        } else if (tab.url.indexOf('file') === 0) {
            pickrButtonContainer.innerHTML = 'Pickr currently does not support access to <i>this</i> kind of page.'
        } else {
            const button = document.createElement("button")
            button.setAttribute("id", "pickrButton")
            button.innerText = "Pick a color"

            button.addEventListener("click", () => {
                if (!window.EyeDropper) {
                    action("#F9BC60", 'Sorry, your browser does not support the Pickr Chrome Extension.')
                    return
                }

                chrome.tabs.sendMessage(
                    tabs[0].id, { from: "popup", query: "pickrClicked" }
                );

                window.close()
            })

            pickrButtonContainer.appendChild(button)
        }
    });

    chrome.storage.local.get("colorCode", (response) => {

        if (response.colorCode && response.colorCode.length > 0) {
            response.colorCode.forEach(hexCode => {
                const colorBlock = document.createElement("li")
                colorBlock.innerText = hexCode
                colorBlock.style.backgroundColor = hexCode
                colorBlock.addEventListener("click", () => {
                    navigator.clipboard.writeText(hexCode);
                    action("#004643", "✅ color code has been copied!")
                })

                palette.appendChild(colorBlock)
            })

            const clearPalette = document.createElement("button")
            clearPalette.innerText = "Clear palette"
            clearPalette.setAttribute("id", "clearButton")
            clearPalette.addEventListener("click", () => {
                let ans = confirm("🎨 Are you sure you'd like to reset your palette? This action cannot be undone.")

                if (ans) {
                    chrome.storage.local.remove("colorCode")
                }

                window.close()
            })

            pickrContainer.appendChild(clearPalette)
        }

    })

})
