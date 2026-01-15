// ✅ Import JSON trực tiếp
import DataFront from "./data_Front_001.json" with { type: "json" };
import {
  itemVideoBackground,
  itemHeroSection,
  VideoPresets,
  TextPresets,
} from "../../components/ActionOrchestrator/utils/cssUtils/cssUltis.js";
const BEGIN_END_StyleCSs = {
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
  zIndex: 2,
};
const SpaceSound = "SOUNDCHUNG_SpaceSound";
let videoData01 = [];

DataFront.forEach((groupArray) => {
  const colorSets = ["blue", "yellow"];

  //THIET LAP SO OBJ
  let processedGroup = [];

  groupArray.forEach((e, i) => {
    if (i === 0) {
      // push bản chỉnh sửa
      processedGroup.push({
        ...e,
        action: "BEGIN",
        code: SpaceSound,
        timeFixed: 7,
      });

      // push bản nguyên gốc
      processedGroup.push(e);
    } else {
      processedGroup.push(e);
    }
  });
  // processedGroup.push({ action: "END" });

  // LAY KEY MAC DINH ID CLASS CODE timeFixed
  processedGroup = processedGroup.map((e, i) => {
    const obj = { ...e };
    obj.stt = i;
    if (obj.id) {
      obj.IDMark = obj.id;
    }
    obj.ClassMark = (obj.class ? obj.class : "") + " all";

    if (!obj.code) {
      obj.code = SpaceSound;
      obj.timeFixed = 5;
    }

    return obj;
  });
  //TUY CHINH
  let QSAWPX = 0;

  processedGroup.forEach((e, i) => {
    switch (e.action) {
      case "BEGIN":
        e.actions = OBJ_BEGIN(e);
        break; //
      case "Hook":
        e.timePlus = 3;
        e.actions = OBJ_Hook(e);
        break; //
      case "END":
        e.actions = OBJ_END(e);
        break;
      case "DEMNGUOC":
        e.timeFixed = 7;
        e.actions = OBJ_DEMNGUOC(e);
        break;

      case "QSAW":
        let topPX =
          QSAWPX === 1 ? 50 + QSAWPX * 350 + "px" : 50 + QSAWPX * 250 + "px";
        QSAWPX++;
        e.actions = OBJ_QSAW(e, topPX, QSAWPX);
        break;

      case "CHONDAPAN":
        e.actions = OBJ_CHONDAPAN(e);
        break;
      default:
        e.actions = []; // ⭐ Default actions
        break;
    }
  });

  // processedGroup.forEach((e, i) => {
  //   let temOBJ = { ...e };
  //   let actionsSETS = [];
  //   if (e.id) temOBJ.IDMark = e.id;
  //   if (e.class) temOBJ.ClassMark = e.class;

  //   if (i === 0) {
  //     processedGroup[0].code = "SOUNDCHUNG_SpaceSound";
  //     processedGroup[0].timeFixed = 1;
  //     processedGroup[0].actions = [
  //       {
  //         cmd: "typingText",
  //         text: "CAI NÀY",
  //         sound: true,
  //         noTyping: true,
  //         styleCss: hookFollowStyle,
  //       },
  //     ];
  //   }

  //   if (e.action) {
  //     if (e.action === "DEMNGUOC") {
  //       actionsSETS.push({
  //         cmd: "countdown",
  //         countDownFrom: 7,
  //         colorTheme: "orange",
  //         zIndex: 100,
  //         styleCss: { scale: "2", transform: "translateY(300px)" },
  //       });
  //       temOBJ.code = "SOUNDCHUNG_tiktok-dongho";
  //       temOBJ.timeFixed = 7;
  //     }

  //     const hookFollowStyle = {
  //       marginTop: "100px",
  //       padding: "40px 60px",
  //       fontSize: "100px",
  //       fontWeight: "900",
  //       color: "#FFD700",
  //       textAlign: "center",
  //       background: "rgba(0,0,0,0.75)",
  //       borderRadius: "20px",
  //       border: "6px solid #FFD700",
  //       boxShadow: "0 0 20px #FFD700, 0 0 40px rgba(255,215,0,0.6)",
  //       textTransform: "uppercase",
  //       letterSpacing: "2px",
  //     };

  //     if (e.action === "Hook") {
  //       actionsSETS.push({
  //         cmd: "typingText",
  //         text: e.text,
  //         sound: true,
  //         noTyping: false,
  //         styleCss: hookFollowStyle,
  //         imgSource: "CSK_001.png",
  //       });

  //       actionsSETS.push({
  //         cmd: "imageView",
  //         delay: 60,
  //         toID: "hero-container",
  //         img: "CSK_001.png",
  //         imgSize: "600px",
  //         styleCss: {
  //           borderRadius: "50%",
  //           // ⭐ Pulse loop animation
  //           animation: "pulse 2s ease-in-out infinite",
  //         },
  //       });

  //       temOBJ.timeFixed = 4;
  //     }

  //     if (e.action === "FOLLOW") {
  //       actionsSETS.push({
  //         cmd: "typingText",
  //         text: e.text,
  //         sound: true,
  //         noTyping: true,
  //         styleCss: hookFollowStyle,
  //       });
  //       temOBJ.timeFixed = 4;
  //       processedGroup[0].code = "SOUNDCHUNG_SpaceSound";
  //       processedGroup[0].timeFixed = 1;
  //       processedGroup[0].actions = [
  //         {
  //           cmd: "typingText",
  //           text: e.text,
  //           sound: true,
  //           noTyping: true,
  //           styleCss: hookFollowStyle,
  //         },
  //       ];
  //     }

  //     if (e.action === "HINHNEN") {
  //       actionsSETS.push({
  //         cmd: "typingText",
  //         text: e.text,
  //         sound: true,
  //         noTyping: true,
  //         styleCss: hookFollowStyle,
  //       });
  //       temOBJ.timeFixed = 4;
  //     }

  //     if (e.action === "CHONDAPAN") {
  //       actionsSETS.push({
  //         cmd: "actionCssId",
  //         toID: "DUNG",
  //         cssMode: "add",
  //         css: {
  //           backgroundColor: "yellow",
  //           background: "yellow",
  //           color: "black",
  //         },
  //       });
  //     }

  //     if (e.action === "QSAW") {
  //       let topPX =
  //         QSAWPX === 1 ? 50 + QSAWPX * 350 + "px" : 50 + QSAWPX * 250 + "px";
  //       QSAWPX++;

  //       if (QSAWPX === 4) {
  //         actionsSETS.push({
  //           cmd: "actionCssId",
  //           toID: "OPACITY",
  //           cssMode: "replace",
  //           css: {
  //             transform: "scale(1.5) translateX(-200px)",
  //             transition: "transform 3s ease-in-out",
  //           },
  //         });
  //       }

  //       actionsSETS.push({
  //         cmd: "typingText",
  //         text: e.text,
  //         sound: true,
  //         noTyping: true,
  //         ToEndFrame: true,
  //         styleCss: {
  //           position: "absolute",
  //           top: topPX,
  //           fontSize: "60px",
  //           color: "#ffffff",
  //           borderTop: "1px solid black",
  //           borderRadius: "20px",
  //           textAlign: "left",
  //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  //           padding: "20px",
  //           lineHeight: 1.35,
  //           letterSpacing: "0.5px",
  //         },
  //       });
  //     }

  //     if (e.action === "END") {
  //       actionsSETS.push({
  //         cmd: "actionCssClass",
  //         toClass: "AN",
  //         cssMode: "replace",
  //         css: { opacity: 0 },
  //       });
  //       actionsSETS.push({
  //         cmd: "typingText",
  //         text: e.text,
  //         sound: true,
  //         styleCss: {
  //           position: "absolute",
  //           top: "100px",
  //           fontSize: "70px",
  //           borderTop: "1px solid black",
  //           borderRadius: "20px",
  //           textAlign: "left",
  //           background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  //           padding: "20px",
  //           lineHeight: 1.75,
  //           letterSpacing: "0.5px",
  //           color: "#ffffff",
  //         },
  //       });
  //     }
  //   }

  //   temOBJ.actions = actionsSETS;
  //   processedGroup.push(temOBJ);
  // });

  processedGroup = Sort0toN(processedGroup);

  videoData01.push(processedGroup);
});

console.log(JSON.stringify(videoData01));

export { videoData01 };

function OBJ_BEGIN(e) {
  return [
    {
      cmd: "typingText",
      text: e.text,
      sound: true,
      noTyping: true,
      styleCss: BEGIN_END_StyleCSs,
    },

    VideoPresets.loopingBackground("LoopingVideo001.mp4", {
      id: "IDvideo001", // ⭐ ID cụ thể
      panAnimation: true,
      panAmount: 5,
      panDuration: 150,
    }),
  ];
}
function OBJ_END(e) {
  return [
    {
      cmd: "typingText",
      text: "HÃY FOLLOW TÔI",
      sound: true,
      noTyping: false,
      styleCss: BEGIN_END_StyleCSs,
    },
  ];
}

function OBJ_DEMNGUOC(e) {
  return [
    {
      cmd: "countdown",
      countDownFrom: 7,
      colorTheme: "orange",
      zIndex: 100,
      styleCss: { scale: "2", transform: "translateY(300px)" },
    },
  ];
}

function OBJ_QSAW(e, topPX, QSAWPX) {
  return [
    {
      cmd: "typingText",
      text: e.text,
      sound: true,
      noTyping: true,
      ToEndFrame: true,
      styleCss: {
        position: "absolute",
        top: topPX,
        fontSize: "60px",
        color: "#ffffff",
        borderTop: "1px solid black",
        borderRadius: "20px",
        textAlign: "left",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "20px",
        lineHeight: 1.35,
        letterSpacing: "0.5px",
      },
    },
  ];
}
function OBJ_CHONDAPAN(e) {
  return [
    {
      cmd: "actionCssId",
      toID: "DUNG",
      cssMode: "add",
      css: {
        backgroundColor: "yellow",
        background: "yellow",
        color: "black",
      },
    },
  ];
}
function Sort0toN(processedGroup) {
  return processedGroup
    .map((item, index) => ({ ...item, __idx: index }))
    .sort((a, b) => {
      const sttA = Number(a?.stt ?? 0);
      const sttB = Number(b?.stt ?? 0);
      if (sttA !== sttB) return sttA - sttB;
      return a.__idx - b.__idx; // giữ thứ tự cũ
    })
    .map(({ __idx, ...item }) => item);
}
function OBJ_Hook(e) {
  return [
    {
      cmd: "typingText",
      text: e.text,
      sound: true,
      noTyping: false,
      styleCss: BEGIN_END_StyleCSs,
    },
  ];
}
