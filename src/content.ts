let applies = ""
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "open") {
    applies = request.payload;
  }
});
function GetAdvatiseNumberOfApplies() {
    let spans = document.getElementsByClassName("tvm__text tvm__text--low-emphasis");
    for (const element of spans) {
        let text = element.textContent.trim();
        if (text.includes("100")) {
            element.textContent = applies + " personer klikkede på Ansøg";
        }
    }
}

function GetAdvatiseNumberOfAppliesAuto() {
    const observer = new MutationObserver(() => {
       GetAdvatiseNumberOfApplies();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
GetAdvatiseNumberOfAppliesAuto();
