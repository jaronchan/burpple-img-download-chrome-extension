// Inform the background page that
// this tab is initialized.
chrome.runtime.sendMessage({
  from: "content",
  subject: "init",
});

// Listen for messages from the popup.
chrome.runtime.onMessage.addListener((msg, sender, response) => {
  // First, validate the message's structure.
  if (msg.from === "popup" && msg.subject === "capture") {
    window.scrollTo(0, document.body.scrollHeight);
    // Collect the necessary data.
    // (For your specific requirements `document.querySelectorAll(...)`
    //  should be equivalent to jquery's `$(...)`.)
    setTimeout(() => {
      var photoCard = document.querySelectorAll(".v1Nh3.kIKUG._bz0w");
      var photoLinks = [];

      photoSquares.forEach((element) =>
        photoLinks.push(element.querySelector("a").href)
      );

      var domInfo = {
        photos: photoLinks,
        profile: /.com\/([^']*)\//.exec(location.href)[1],
      };
      response(domInfo);
    }, 3000);
    return true;

    // Directly respond to the sender (popup),
    // through the specified callback.
  }
  if (msg.from === "popup" && msg.subject === "baseInfo") {
    var baseInfo = {
      total: document.querySelector(".profile-page__stats > ul > li")
        .textContent,
      profile: /.com\/([^']*)\//.exec(location.href)[1],
    };

    // Directly respond to the sender (popup),
    // through the specified callback.
    response(baseInfo);
  }
});
