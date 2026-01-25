// ✅ Import JSON trực tiếp
import DataFront from "./data_Front_001.json" with { type: "json" };
import { VideoPresets } from "../../components/ActionOrchestrator/utils/cssUtils/cssUltis.js";
import { ObjCSS } from "./objCSS.js";
import { CMD } from "../../components/ActionOrchestrator/utils/actionRegistry.js";
import {
  Sort0toN,
  anim,
  keepOnlyActionsCodeTimeFixedStt,
} from "../../components/ActionOrchestrator/utils/dataSupportFuntions.js";

const CMD_Fetch = CMD;

//lay OBJcss
//cach dung  ...getTextCSS(arr[0].textStyle),
// function getTextCSS(style) {
//   if (!style) return {};

//   const key = typeof style === "number"
//     ? `typingText${String(style).padStart(3, "0")}`
//     : `typingText${style}`;

//   return ObjCSS.textCSS[key] || {};
// }

// cách dùng ...getImgCSS(arr[0].imgStyle),
// function getImgCSS(style) {
//   if (!style) return {};
//   const key = `img${String(style).padStart(3, "0")}`;
//   return ObjCSS.imgCSS[key] || {};
// }

//lõi hệ thống
let videoData01 = [];

DataFront.forEach((videoData) => {
  let video = [];
  let group = [];
  let flag = videoData[0].group;
  videoData.forEach((obj) => {
    if (obj.group === flag) {
      group.push(obj);
    } else {
      //them control action o day nhe

      //textStyle và img style phai hard code ở excel để gọi objCss ơ ngoai
      group = group001_type02(group);

      for (let i = 0; i < group.length; i++) {
        video.push(group[i]);
      }
      group = [obj];
      flag = obj.group;
    }
  });
  group = group001_type02(group);
  for (let i = 0; i < group.length; i++) {
    video.push(group[i]);
  }

  videoData01.push(video);
});

console.log(JSON.stringify(keepOnlyActionsCodeTimeFixedStt(videoData01)));
export { videoData01 };

function group001_type02(arr) {
  const uid = `${arr[0].group}_${arr[0].code}`;

  const BG001 = `BG001_${uid}`;
  const div1 = `div1_${uid}`;
  const divA = `divA_${uid}`;
  const divB = `divB_${uid}`;
  const divC = `divC_${uid}`;
  const divD = `divD_${uid}`;
  const textId = `text_${uid}`;

  const obj_001 = {
    actions: [
      {
        cmd: "divAction",
        id: BG001,
        ToEndFrame: true,
        styleCss: {
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
        },
      },
      {
        cmd: CMD_Fetch.imageViewActionToID,
        toID: BG001,
        ToEndFrame: true,
        img: arr[0].backgroundIMG,
        styleCss: {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        },
      },
      {
        cmd: CMD_Fetch.divAction,
        id: div1,
        group: arr[0].group,
        styleCss: {
          position: "absolute",
          height: "100%",
          width: "100%",
          padding: "50px",
        },
      },
      {
        cmd: CMD_Fetch.divAction,
        id: divA,
        toID: div1,
        group: arr[0].group,
        styleCss: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "40%",
          width: "100%",
        },
      },
      {
        cmd: CMD_Fetch.typingText,
        text: arr[0].text,
        id: textId,
        toID: divA,
        group: arr[0].group,
        styleCss: ObjCSS.CSStypingText001,
        // {
        //   fontSize: "96px",
        //   fontWeight: 800,
        //   letterSpacing: "2px",
        //   lineHeight: "1.1",
        //   textTransform: "uppercase",
        //   WebkitTextStroke: "3px #fff",
        //   textShadow: "0 0 20px rgba(255,255,255,0.4)",
        //   animation: "bounceIn 0.5s ease-out forwards",
        // },
      },
      {
        cmd: CMD_Fetch.soundPlayerAction,
        soundSource: "SOUNDCHUNG_tiktokTypingSoundCapcut",
      },
      {
        cmd: CMD_Fetch.divAction,
        id: divB,
        toID: div1,
        group: arr[0].group,
        styleCss: {
          display: "flex", // ⭐
          flexDirection: "row", // ⭐ mặc định
          gap: "20px", // optional
          height: "40%",
          padding: "50px",
        },
      },
      {
        cmd: CMD_Fetch.divAction,
        id: divC,
        toID: divB,
        group: arr[0].group,
        styleCss: {
          flexBasis: "100%",
          flexShrink: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },
      {
        cmd: CMD_Fetch.imageViewActionToID,
        img: arr[0].img,
        toID: divC,
        group: arr[0].group,
        styleCss: {
          width: "600px",
          height: "600px",
          maxWidth: "100%",
          maxHeight: "100%",
          borderRadius: "20%",
        },
      },
      {
        cmd: CMD_Fetch.divAction,
        id: divD,
        toID: divB,
        group: arr[0].group,
        styleCss: {
          height: "auto",
          flexGrow: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        },
      },

      {
        cmd: CMD_Fetch.imageViewActionToID,
        img: arr[1].img,
        toID: divD,
        group: arr[0].group,
        styleCss: {
          width: "600px",
          height: "600px",
          maxWidth: "100%",
          maxHeight: "100%",
        },
      },
    ],
    code: arr[0].code,
    timeFixed: 2,
    stt: 0,
  };
  const obj_002 = {
    actions: [
      {
        cmd: CMD_Fetch.actionCssId,
        toID: textId,
        mode: "replace",
        css: {
          display: "none",
        },
      },
      {
        cmd: CMD_Fetch.typingText,
        text: arr[1].text,
        toID: divA,
        delay: 15,
        group: arr[0].group,
        styleCss: {
          textAlign: "center",
          fontSize: "60px",
          fontWeight: 700,
          WebkitTextStroke: "2px yellow",
          color: "#fff",
        },
      },

      {
        cmd: CMD_Fetch.actionCssId,
        toID: divC,
        mode: "add",
        css: {
          animation: "collapseWidth 1s ease-in-out forwards",
        },
      },
    ],
    code: arr[1].code,
    timeFixed: 5,
    stt: 1,
  };
  let finalSet = [];
  finalSet.push(obj_001);
  finalSet.push(obj_002);
  return finalSet;
}

// function group001_type02(arr) {
//   const obj_001 = {
//     actions: [
//       {
//         cmd: "divAction",
//         id: "BG001",
//         ToEndFrame: true,
//         styleCss: {
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           left: 0,
//           right: 0,
//         },
//       },
//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         toID: "BG001",
//         ToEndFrame: true,
//         img: arr[0].backgroundIMG,
//         styleCss: {
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//         },
//       },
//       {
//         cmd: CMD_Fetch.divAction,
//         id: "div1",
//         group: arr[0].group,
//         styleCss: {
//           position: "absolute",
//           height: "100%",
//           width: "100%",
//           padding: "50px",
//         },
//       },
//       {
//         cmd: CMD_Fetch.divAction,
//         id: "divA",
//         toID: "div1",
//         group: arr[0].group,
//         styleCss: {
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           height: "40%",
//           width: "100%",
//         },
//       },
//       {
//         cmd: CMD_Fetch.typingText,
//         text: arr[0].text,
//         id: "text",
//         toID: "divA",
//         group: arr[0].group,
//         styleCss: {
//           fontSize: "96px",
//           fontWeight: 800,
//           letterSpacing: "2px",
//           lineHeight: "1.1",
//           textTransform: "uppercase",
//           WebkitTextStroke: "3px #fff",
//           textShadow: "0 0 20px rgba(255,255,255,0.4)",
//           animation: "bounceIn 0.5s ease-out forwards",
//         },
//       },
//       {
//         cmd: CMD_Fetch.soundPlayerAction,
//         soundSource: "SOUNDCHUNG_tiktokTypingSoundCapcut",
//       },
//       {
//         cmd: CMD_Fetch.divAction,
//         id: "divB",
//         toID: "div1",
//         group: arr[0].group,
//         styleCss: {
//           display: "flex", // ⭐
//           flexDirection: "row", // ⭐ mặc định
//           gap: "20px", // optional
//           height: "40%",
//           padding: "50px",
//         },
//       },
//       {
//         cmd: CMD_Fetch.divAction,
//         id: "divC",
//         toID: "divB",
//         group: arr[0].group,
//         styleCss: {
//           flexBasis: "100%",
//           flexShrink: 0,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         },
//       },
//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         img: arr[0].img,
//         toID: "divC",
//         group: arr[0].group,
//         styleCss: {
//           width: "600px",
//           height: "600px",
//           maxWidth: "100%",
//           maxHeight: "100%",
//           borderRadius: "20%",
//         },
//       },
//       {
//         cmd: CMD_Fetch.divAction,
//         id: "divD",
//         toID: "divB",
//         group: arr[0].group,
//         styleCss: {
//           height: "auto",
//           flexGrow: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//         },
//       },

//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         img: arr[1].img,
//         toID: "divD",
//         group: arr[0].group,
//         styleCss: {
//           width: "600px",
//           height: "600px",
//           maxWidth: "100%",
//           maxHeight: "100%",
//         },
//       },
//     ],
//     code: arr[0].code,
//     timeFixed: 2,
//     stt: 0,
//   };
//   const obj_002 = {
//     actions: [
//       {
//         cmd: CMD_Fetch.actionCssId,
//         toID: "text",
//         mode: "replace",
//         css: {
//           display: "none",
//         },
//       },
//       {
//         cmd: CMD_Fetch.typingText,
//         text: arr[1].text,
//         toID: "divA",
//         delay: 15,
//         group: arr[0].group,
//         styleCss: {
//           textAlign: "center",
//           fontSize: "60px",
//           fontWeight: 700,
//           WebkitTextStroke: "2px yellow",
//           color: "#fff",
//         },
//       },

//       {
//         cmd: CMD_Fetch.actionCssId,
//         toID: "divC",
//         mode: "add",
//         css: {
//           animation: "collapseWidth 1s ease-in-out forwards",
//         },
//       },
//     ],
//     code: arr[1].code,
//     timeFixed: 5,
//     stt: 1,
//   };
//   let finalSet = [];
//   finalSet.push(obj_001);
//   finalSet.push(obj_002);
//   return finalSet;
// }

//type2
// function group001_type02(arr) {
//   const obj_001 = {
//     actions: [
//       {
//         cmd: "divAction",
//         id: "BG001",
//         ToEndFrame: true,
//         styleCss: {
//           position: "absolute",
//           top: 0,
//           bottom: 0,
//           left: 0,
//           right: 0,
//         },
//       },
//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         toID: "BG001",
//         ToEndFrame: true,
//         img: arr[0].backgroundIMG,
//         styleCss: {
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: "100%",
//           height: "100%",
//           objectFit: "cover",
//         },
//       },
//       {
//         cmd: "divAction",
//         id: "DIV001",
//         group: arr[0].group,
//         styleCss: {
//           position: "absolute",
//           zIndex: "10",
//           height: "1920px",
//           width: "100%",
//           display: "flex",
//           flexDirection: "column",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: "40px",
//         },
//       },

//       {
//         cmd: "divAction",
//         id: "DIV-D",
//         group: arr[0].group,
//         toID: "DIV001",
//         styleCss: {
//           zIndex: "10",
//           width: "100%",
//           textAlign: "center",
//           opacity: 0.9,
//         },
//       },
//       {
//         cmd: "divAction",
//         id: "DIV-A",
//         toID: "DIV001",
//         group: arr[0].group,
//         styleCss: {
//           zIndex: "10",
//           width: "100%",
//           overflow: "hidden",
//           textAlign: "center",
//         },
//       },
//       {
//         cmd: "divAction",
//         id: "DIV-B",
//         group: arr[0].group,
//         toID: "DIV001",
//         styleCss: {
//           zIndex: "10",
//           width: "100%",
//           overflow: "hidden",
//           textAlign: "center",
//         },
//       },
//       {
//         cmd: "divAction",
//         id: "DIV-C",
//         group: arr[0].group,
//         toID: "DIV001",
//         styleCss: {
//           zIndex: "10",
//           width: "100%",
//           overflow: "hidden",
//           textAlign: "center",
//         },
//       },
//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         img: arr[0].img,
//         toID: "DIV-C",
//         group: arr[0].group,
//         styleCss: {
//           zIndex: "10",
//           width: "680px",
//           height: "680px",
//           borderRadius: "48px",
//           objectFit: "cover",
//           boxShadow: "0 40px 80px rgba(0,0,0,0.35)",
//         },
//       },
//       {
//         cmd: CMD_Fetch.typingText,
//         toID: "DIV-B",
//         text: arr[0].text,
//         styleCss: {
//           fontSize: "96px",
//           fontWeight: "900",
//           color: "#ffffff",
//           WebkitTextStroke: "4px #00ff88",
//           textStroke: "4px #00ff88",
//           letterSpacing: "2px",
//           lineHeight: "1.1",
//           textShadow: "0 12px 30px rgba(0,0,0,0.45)", // 👈 dễ đọc
//           marginTop: "40px",
//         },
//         group: arr[0].group,
//       },
//       {
//         cmd: "soundPlayerAction",
//         soundSource: "SOUNDCHUNG_tiktokTypingSoundCapcut",
//       },
//     ],
//     code: arr[0].code,
//     timeFixed: 2,
//     stt: 0,
//   };
//   const obj_002 = {
//     actions: [
//       {
//         cmd: CMD_Fetch.imageViewActionToID,
//         toID: "DIV-A",
//         img: arr[1].img,
//         styleCss: {
//           zIndex: "10",
//           width: "500px",
//           height: "500px",
//           transformOrigin: "50% 50%",
//           animation: "wobbleZoom 1s ease-out",
//           marginBottom: "50px",
//         },
//         group: arr[0].group,
//       },

//       {
//         cmd: CMD_Fetch.typingTextActionToID,
//         toID: "DIV-D",
//         text: arr[1].text,
//         styleCss: {
//           fontSize: "50px",
//           color: "#ffe066",
//           fontWeight: "800",
//           letterSpacing: "1px",
//           textShadow: "0 6px 20px rgba(0,0,0,0.35)",
//         },
//         group: arr[0].group,
//       },
//       {
//         cmd: CMD_Fetch.actionCssId,
//         toID: "DIV-B",
//         cssMode: "replace",
//         css: {
//           height: "0px",
//         },
//       },
//       {
//         cmd: CMD_Fetch.actionCssId,
//         toID: "DIV-C",
//         cssMode: "add",
//         css: {
//           scale: "0.6",
//           transition: "scale 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
//         },
//       },
//     ],
//     code: arr[1].code,
//     timeFixed: 5,
//     stt: 1,
//   };
//   let finalSet = [];
//   finalSet.push(obj_001);
//   finalSet.push(obj_002);
//   return finalSet;
// }
