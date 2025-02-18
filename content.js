const bookmarkimgUrl = chrome.runtime.getURL("assets/bookmark.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY";

// window.addEventListener("load", addbookmarkbutton);

const observer= new MutationObserver(()=>{
    addbookmarkbutton();
})

observer.observe(document.body,{childList: true, subtree:true});

addbookmarkbutton();

function ProblemsPage(){
     return window.location.pathname.startsWith('/problems/');
}

function addbookmarkbutton() {
    console.log("triggering");
    if(!ProblemsPage() || document.getElementById("add-bookmark-button")) return;

    const bookmarkbutton = document.createElement("img");
    bookmarkbutton.id = "add-bookmark-button";
    bookmarkbutton.src = bookmarkimgUrl;
    bookmarkbutton.style.height = "30px";
    bookmarkbutton.style.width = "30px";

    const askdoubt = document.getElementsByClassName("coding_ask_doubt_button__FjwXJ")[0];
    
    if (askdoubt) {
            askdoubt.parentNode.insertAdjacentElement("afterend", bookmarkbutton);
        }
     bookmarkbutton.addEventListener("click", addnewbookmarkhandler);
}

async function addnewbookmarkhandler() {
    const currentbookmark = await getcurrentbookmark();
    const azurl = window.location.href;
    const uniqueId = extractProblemId(azurl);
    const problemname = document.getElementsByClassName("Header_resource_heading__cpRp1")[0].textContent;

    // Prevent adding duplicate bookmarks
    if (currentbookmark.some((bookmark) => bookmark.id === uniqueId)) return;

    const bookmarkobj = {
        id: uniqueId,
        name: problemname,
        url: azurl,
    };

    const updatedbookmarks = [...currentbookmark, bookmarkobj];

    chrome.storage.sync.set({ [AZ_PROBLEM_KEY]: updatedbookmarks }, () => {
        console.log("Updated bookmarks to ", updatedbookmarks);
    });
}

function extractProblemId(url) {
    const startIndex = url.indexOf("problems/") + "problems/".length;
    const endIndex = url.indexOf("?", startIndex);
    return endIndex === -1 ? url.substring(startIndex) : url.substring(startIndex, endIndex);
}

function getcurrentbookmark() {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {
            resolve(results[AZ_PROBLEM_KEY] || []);
        });
    });
}
