import DataFront from "./data_Front_001.json" with { type: "json" };

let videoData01 = [];
let QSAWPX = 0;
DataFront.forEach((groupArray) => {
  const colorSets = ["blue", "yellow"];

  let processedGroup = [{}];
  groupArray = groupArray.concat({
    action: "Hook",
    subAction: "End",
    text: "Hãy follow",
    code: "SOUNDCHUNG_SpaceSound",
    imgHook: "CSK_001.png",
  });

  groupArray.forEach((e, i) => {
    let temOBJ = e;

    let actionsSETS = [];

    if (e.id) {
      temOBJ.IDMark = e.id;
    }
    if (e.class) {
      temOBJ.ClassMark = e.class;
    }

    // if (e.tieude) {
    //   actionsSETS.push({
    //     cmd: "typingText",
    //     text: e.tieude,
    //     sound: true,
    //     noTyping: true,
    //     ToEndFrame: true,
    //     styleCss: {
    //       marginTop: "100px",
    //       fontSize: "80px",
    //       color: "yellow",
    //       borderTop: "1px solid black",
    //       textAlign: "center",
    //     },
    //   });
    // }

    if (e.action) {
      if (e.action === "DEMNGUOC") {
        actionsSETS.push({
          cmd: "countdown",
          countDownFrom: 7,
          colorTheme: "orange", // red/blue/green/purple/orange
          zIndex: 100,
          styleCss: { scale: "2", transform: "translateY(300px)" },
        });
        temOBJ.code = "SOUNDCHUNG_tiktok-dongho";
        temOBJ.timeFixed = 7;
      }

      if (e.action === "Hook") {
        actionsSETS.push({
          cmd: "typingText",
          text: e.text,
          sound: true,
          noTyping: e.subAction === "End" ? true : false,
          styleCss: {
            marginTop: "100px",
            padding: "40px 60px",
            fontSize: "100px",
            fontWeight: "900",
            color: "#FFD700", // vàng nổi
            textAlign: "center",
            background: "rgba(0,0,0,0.75)",
            borderRadius: "20px",
            border: "6px solid #FFD700",
            boxShadow: `
    0 0 20px #FFD700,
    0 0 40px rgba(255,215,0,0.6)
  `,
            textTransform: "uppercase",
            letterSpacing: "2px",
          },
        });

        temOBJ.timeFixed = 4;

        processedGroup[0].code = "SOUNDCHUNG_SpaceSound";
        processedGroup[0].timeFixed = 1;
        processedGroup[0].actions = [
          {
            cmd: "typingText",
            text: e.text,
            sound: true,
            noTyping: true,
            styleCss: {
              marginTop: "100px",
              padding: "40px 60px",
              fontSize: "100px",
              fontWeight: "900",
              color: "#FFD700", // vàng nổi
              textAlign: "center",
              background: "rgba(0,0,0,0.75)",
              borderRadius: "20px",
              border: "6px solid #FFD700",
              boxShadow: `
    0 0 20px #FFD700,
    0 0 40px rgba(255,215,0,0.6)
  `,
              textTransform: "uppercase",
              letterSpacing: "2px",
            },
          },
        ];
      }

      if (e.action === "HINHNEN") {
        actionsSETS.push({
          cmd: "typingText",
          text: e.text,
          sound: true,
          noTyping: true,
          styleCss: {
            marginTop: "100px",
            padding: "40px 60px",
            fontSize: "100px",
            fontWeight: "900",
            color: "#FFD700", // vàng nổi
            textAlign: "center",
            background: "rgba(0,0,0,0.75)",
            borderRadius: "20px",
            border: "6px solid #FFD700",
            boxShadow: `
    0 0 20px #FFD700,
    0 0 40px rgba(255,215,0,0.6)
  `,
            textTransform: "uppercase",
            letterSpacing: "2px",
          },
        });

        temOBJ.timeFixed = 4;
      }

      if (e.action === "CHONDAPAN") {
        actionsSETS.push({
          cmd: "actionCssId",
          toID: "DUNG",
          cssMode: "add",
          css: {
            backgroundColor: "yellow",
            background: "yellow",
            color: "black",
          },
        });
      }

      if (e.action === "QSAW") {
        let topPX = 0;
        if (QSAWPX === 1) {
          topPX = 50 + QSAWPX * 350 + "px";
        } else {
          topPX = 50 + QSAWPX * 250 + "px";
        }
        QSAWPX++;

        if (QSAWPX === 4) {
          actionsSETS.push({
            cmd: "actionCssId",
            toID: "OPACITY",
            cssMode: "replace",
            css: {
              transform: "scale(1.5) translateX(-200px)",
              transition: "transform 3s ease-in-out",
            },
          });
        }

        actionsSETS.push({
          cmd: "typingText",
          text: e.text,
          sound: true,
          noTyping: true,
          ToEndFrame: true,
          styleCss: {
            position: "absolute",
            top: topPX,
            fontSize: "60px",
            color: "black",
            borderTop: "1px solid black",
            borderRadius: "20px",
            textAlign: "left",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px",
            lineHeight: 1.35,
            letterSpacing: "0.5px",
            color: "#ffffff",
          },
        });
      }

      if (e.action === "END") {
        actionsSETS.push({
          cmd: "actionCssClass",
          toClass: "AN",
          cssMode: "replace",
          css: {
            opacity: 0,
          },
        });

        actionsSETS.push({
          cmd: "typingText",
          text: e.text,
          sound: true,
          styleCss: {
            position: "absolute",
            top: "100px",
            fontSize: "70px",

            borderTop: "1px solid black",
            borderRadius: "20px",
            textAlign: "left",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "20px",
            lineHeight: 1.75,
            letterSpacing: "0.5px",
            color: "#ffffff",
          },
        });
      }
    }

    temOBJ.actions = actionsSETS;

    processedGroup.push(temOBJ);
  });

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

const STYLE_MODERN_GRADIENT = (topPX) => ({
  position: "absolute",
  top: topPX,
  left: "50%",
  transform: "translateX(-50%)",

  /* Layout */
  width: "90%",
  maxWidth: "860px",

  /* Background – modern gradient + glass */
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",

  /* Typography */
  fontSize: "clamp(32px, 5vw, 56px)", // responsive
  fontWeight: 700,
  color: "#ffffff",
  textAlign: "left",
  lineHeight: 1.35,
  letterSpacing: "0.5px",

  /* Spacing */
  padding: "24px 36px",

  /* Border */
  borderRadius: "22px",
  border: "1.5px solid rgba(255, 255, 255, 0.25)",

  /* Shadow – nổi trên video */
  boxShadow: `
    0 12px 45px rgba(0, 0, 0, 0.45),
    inset 0 0 0 1px rgba(255, 255, 255, 0.08)
  `,

  /* Text shadow – tăng độ đọc */
  textShadow: `
    0 2px 8px rgba(0, 0, 0, 0.45),
    0 0 16px rgba(118, 75, 162, 0.35)
  `,
});
