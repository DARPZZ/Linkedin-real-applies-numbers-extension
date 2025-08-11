const fetchedUrls = new Set();
let weburl = 0
chrome.webRequest.onBeforeSendHeaders.addListener(
  function(details) {
    let csrfTokenHeader = details.requestHeaders.find(h => h.name.toLowerCase() === 'csrf-token');
    let csrfToken = csrfTokenHeader ? csrfTokenHeader.value : null;
    if (!csrfToken) {
      console.log("No csrf-token found in request headers.");
      return;
    }

    if (fetchedUrls.has(details.url)) {
      
      return;
    }
    fetchedUrls.add(details.url);
    fetchLinkedInJob(details.url, details.method, csrfToken);
    return{}
  },
  { urls: ["https://www.linkedin.com/voyager/api/jobs/jobPostings/*"] },
  ["requestHeaders"]
);

async function fetchLinkedInJob(url, method, csrfToken) {
  try {
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'csrf-token': csrfToken,
        'Accept': 'application/json',
      },
      credentials: 'include'
    });
    const data = await response.json();
    let applies  = data.applies
    PlaceValueInStorage(weburl,applies)
    SendDataToContentScript(applies);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    handleUrlChange(changeInfo.url);
  }
});

function handleUrlChange(url) {
  const numbers = url.match(/\d+/g)[0];
  console.log('Handling new URL:', numbers);
  weburl = numbers;
  chrome.storage.session.get(numbers, (result) => {
    console.log("hest:", result[numbers]);
    SendDataToContentScript(result[numbers])
  });

}

function PlaceValueInStorage(key, value) {
    chrome.storage.session.set({ [key]: value }, () => {
        console.log(`Value saved in session storage under key: ${key}`);
    });
}


function SendDataToContentScript(applies) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "open", payload: applies },
    );  
  });
}
