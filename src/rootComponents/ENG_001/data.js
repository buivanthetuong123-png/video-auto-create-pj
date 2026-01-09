import DataFront from "./data_Front_001.json" with { type: "json" };

let videoData01 = [];

DataFront.forEach((groupArray) => {
  let processedGroup = [];

  // Duyệt qua từng cặp đôi (mỗi 2 items có cùng img)
  for (let i = 0; i < groupArray.length; i += 2) {
    const item1 = groupArray[i];
    const item2 = groupArray[i + 1];

    if (item1 && item2) {
      const imgSAME = item1.img; // Lấy img chung của cặp

      // Thêm item đầu tiên của cặp
      processedGroup.push(item1);

      // Chèn countdown vào giữa cặp
      processedGroup.push({
        text: "DEMNGUOC",
        img: imgSAME,
        code: "SOUNDCHUNG_tiktok-dongho",
        timeFixed: 3,
      });
      processedGroup.push({
        text: "",
        img: imgSAME,
        code: "SOUNDCHUNG_SpaceSound",
        timeFixed: 0.2,
      });
      // Thêm item thứ hai của cặp
      item2.timePlus = 1;
      processedGroup.push(item2);

      // Chèn space sound vào cuối cặp
    }
  }

  videoData01.push(processedGroup);
});

// videoData01.forEach((e) => {
//   if (e.length > 1) {
//     // Gắn timePlus = 3 cho phần tử TRƯỚC phần tử cuối
//     e[e.length - 2].timePlus = 3;
//   }

//   if (e.length > 0) {
//     // Xóa phần tử cuối cùng
//     e.pop(); // hoặc e.splice(-1, 1)
//   }
// });

// videoData01.forEach((e) => {
//   if (e.length > 0) {
//     e[e.length - 1].timePlus = 3;
//   }
// });

console.log(JSON.stringify(videoData01));

export { videoData01 };
