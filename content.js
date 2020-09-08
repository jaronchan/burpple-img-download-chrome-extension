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
    var photoCards = document.querySelectorAll(".food.card.feed-item");
    var photoInfo = [];

    photoCards.forEach((element) => {
      var photoWrapper = element.querySelector(".food-image");
      var photoId = /\/f\/([^']*)/.exec(
        photoWrapper.querySelector("a").href
      )[1];

      console.log(photoId);
      var photoLink = /([^']*)\?/.exec(
        photoWrapper.querySelector("img").src
      )[1];
      console.log(photoLink);

      var photoPlace = element.querySelector(".card-item-set--link-title")
        .textContent;
      var photoAddress = element.querySelector(".card-item-set--link-subtitle")
        .textContent;

      console.log(photoPlace.trim());
      console.log(photoAddress.trim());

      photoInfo.push({
        id: photoId,
        link: photoLink,
        place: photoPlace,
        address: photoAddress,
      });
    });

    var domInfo = {
      photoInfo: photoInfo,
    };
    response(domInfo);

    // Directly respond to the sender (popup),
    // through the specified callback.
  }
  if (msg.from === "popup" && msg.subject === "baseInfo") {
    var baseInfo = {
      total: document.querySelector(".profile-page__stats > ul > li")
        .textContent,
      profile: /.com\/@([^']*)\//.exec(location.href)[1],
    };

    // Directly respond to the sender (popup),
    // through the specified callback.
    response(baseInfo);
  }
});
