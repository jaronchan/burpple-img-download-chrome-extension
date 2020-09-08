// Update the relevant fields with the new data.
window.onload = function () {
  document.getElementById("loading").style.display = "none";
};

var photoIds = [];
var profileName;
var wrapper;
const setDOMInfo = (info) => {
  info.photoInfo.forEach((element) => {
    if (!_.includes(photoIds, element.id)) {
      // photoInfo.push({
      //   id: photoId,
      //   link: photoLink,
      //   place: photoPlace,
      //   address: photoAddress,
      // });
      photoIds.push(element.id);
      // var src = element + "media?size=l";

      var anchor = document.createElement("a");
      anchor.id = element.id;
      anchor.href = element.link;
      anchor.download = "image";
      var img = document.createElement("img");
      img.classList.add("dl");
      img.src = element.link;
      toDataURL(img.src, function (dataURL) {
        img.src = dataURL;
      });
      anchor.appendChild(img);
      wrapper.appendChild(anchor);
    }
  });
  document.getElementById("photos").textContent = photoIds.length;
  document.getElementById("loading").style.display = "none";
};

const setBaseInfo = (info) => {
  profileName = info.profile;
  document.getElementById("title").textContent = info.profile + "'s profile";
  document.getElementById("total").textContent = info.total;
};

// Once the DOM is ready...
window.addEventListener("DOMContentLoaded", () => {
  wrapper = document.getElementById("photo-grid");
  // ...query for the active tab...
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true,
    },
    (tabs) => {
      // ...and send a request for the DOM info...
      chrome.tabs.sendMessage(
        tabs[0].id,
        { from: "popup", subject: "baseInfo" },
        // ...also specifying a callback to be called
        //    from the receiving end (content script).
        setBaseInfo
      );
    }
  );

  document.getElementById("capture").addEventListener("click", () => {
    document.getElementById("loading").style.display = "block";
    // ...query for the active tab...
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        // ...and send a request for the DOM info...
        chrome.tabs.sendMessage(
          tabs[0].id,
          { from: "popup", subject: "capture" },
          // ...also specifying a callback to be called
          //    from the receiving end (content script).
          setDOMInfo
        );
      }
    );
  });

  document.getElementById("dl_all").addEventListener("click", download_all);
});

function download(data) {
  const a = document.createElement("a");

  a.href = "data:application/zip;base64," + data;
  a.setAttribute("download", profileName + "-burpple.zip");
  a.style.display = "none";
  a.addEventListener("click", (e) => e.stopPropagation()); // not relevant for modern browsers
  document.body.appendChild(a);
  setTimeout(() => {
    // setTimeout - not relevant for modern browsers
    a.click();
    document.body.removeChild(a);
  }, 0);
  document.getElementById("loading").style.display = "none";
}

function download_all() {
  document.getElementById("loading").style.display = "block";

  var zip = new JSZip();
  [...document.getElementsByClassName("dl")].forEach((img, i) =>
    zip.file("img" + i + ".jpg", img.src.replace(/data:.*?;base64,/, ""), {
      base64: true,
    })
  );
  zip.generateAsync({ type: "base64" }).then(download);
}

function toDataURL(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("get", url);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var fr = new FileReader();

    fr.onload = function () {
      callback(this.result);
    };

    fr.readAsDataURL(xhr.response); // async call
  };

  xhr.send();
}
