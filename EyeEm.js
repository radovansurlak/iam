function saveTags(numberOfPics) {
  let count = {};
  let tags = [];
  let sortedTags = [];
  let [nextButton] = [...document.getElementsByClassName("pview_stage_next")];
  while (numberOfPics--) {
    [...document.querySelectorAll(".g_bubble")].map(tag => {
      tag = tag.innerText.toLowerCase();
      if (count.hasOwnProperty(tag)) {
        count[tag] = count[tag] + 1;
      } else {
        Object.defineProperty(count, tag, {
          value: 1,
          writable: true,
          enumerable: true
        });
      }
      tags.push(tag);
    });
    if (![...document.getElementsByClassName("pview_stage_next")][0]) {
      console.log("no more next button");
      break;
    }
    nextButton.click();
  }
  for (let tag in count) {
    sortedTags.push([tag, count[tag]]);
  }
  sortedTags.sort((a, b) => b[1] - a[1]);
  return sortedTags;
}

saveTags(100);
