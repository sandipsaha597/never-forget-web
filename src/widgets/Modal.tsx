import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContext/AppContext";

export default function Modal(props: {
  text: string;
  center?: boolean;
  color?: string;
  chatObj?: any;
  scroll?: boolean;
}) {
  const { text, center, color, chatObj, scroll } = props;
  const [chat, setChat] = useState<any>(chatObj);

  const chatModal = useRef<any>();
  useEffect(() => {
    setChat(chatObj);
  }, [text]);

  const {
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  // useEffect(() => {
  //   if (noChat) {
  //     setTimeout(() => {}, rewardMsgTimeoutTime);
  //   }
  // }, []);

  const reply = (clickedObj: any, i1: number, i2: number) => {
    const { id, reply, indent, executeFunction } = clickedObj;
    let tempChat = [...chat];
    tempChat[i1] = tempChat[i1].filter((v: string, i: number) => i === i2);
    tempChat.push([
      {
        id,
        text: reply,
      },
    ]);
    if (indent) {
      tempChat.push(indent);
    }
    setChat(tempChat);

    if (executeFunction) {
      executeFunction();
    }
    if (scroll) {
      setTimeout(() => {
        chatModal?.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 1000);
    }
    if (!!!indent) {
      setTimeout(() => {
        // Animated.timing(bottomValue, {
        //   toValue: 50,
        //   duration: 400,
        //   easing: Easing.ease,
        // }).start();
        // opacityValueFunc();
      }, 2500);
    }
  };

  const opacityValueFunc = () => {
    // Animated.timing(opacityValue, {
    //   toValue: 0,
    //   duration: 400,
    //   easing: Easing.ease,
    // }).start();
  };

  return (
    <div
      className='scroll'
      style={{
        position: center ? "fixed" : "absolute",
        bottom: center ? "50%" : 0,
        left: center ? "50%" : 0,
        transform: center ? "translate(-50%, 0%)" : "translate(0, 0)",
        alignSelf: center ? "center" : "flex-start",
        textAlign: center ? "center" : "left",
        borderRadius: center ? 4 : 0,
        opacity: 1,
        // margin: 10,
        width: center ? "auto" : "100%",
        overflowY: "scroll",
        height: scroll
          ? window.screen.width < 768
            ? "calc(100% - 80px)"
            : "80vh"
          : "auto",
        // flex: 1,
        justifyContent: "flex-end",
        backgroundColor: center ? "transparent" : "#e0e0e0",
        padding: 10,
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          backgroundColor: color ? color : "#2b2b2b",
          padding: "12px 10px",
          marginRight: 10,
          borderRadius: 4,
          maxWidth: center ? "100%" : "93%",
        }}
      >
        {text.startsWith("custom") ? (
          text.includes("===the guy above===") ? (
            <p style={{ color: "#fff", margin: 0 }}>
              The Guy above isn't me. His name is Matty. Their youtube channel:
              <a
                href={
                  "https://www.youtube.com/channel/UCBX_-ls-dXuhFNSWSXcHrTA"
                }
              >
                <p style={{ color: "#fff", marginTop: 0 }}>Matt &amp; Matty</p>
              </a>
              {"\n \n"}
              The YouTube video link: {"\n"}
              <a href={"https://www.youtube.com/watch?v=VkPlQ4gjk8M"}>
                <p style={{ color: "#fff", marginTop: 0 }}>
                  https://www.youtube.com/watch?v={"\n"}VkPlQ4gjk8M
                </p>
              </a>
              {"\n \n"}They explained spaced repetition very well. So did you
              understand what spaced repetition is? It's crucial to use this app
              correctly.
            </p>
          ) : text.includes("===the guy above hindi===") ? (
            <p style={{ color: "#fff", margin: 0 }}>
              The Guy above isn't me. His name is Amit Kakkar. His youtube
              channel:
              <a
                href={
                  "https://www.youtube.com/channel/UCClj0UjhdYaR-WR-RHBVOww"
                }
              >
                <p style={{ color: "#fff", marginTop: 0 }}>
                  AMIT KAKKAR SPEAKS
                </p>
              </a>
              {"\n \n"}
              The YouTube video link: {"\n"}
              <a href={"https://www.youtube.com/watch?v=OccJMq7AtSE"}>
                <p style={{ color: "#fff", marginTop: 0 }}>
                  https://www.youtube.com/watch?v={"\n"}OccJMq7AtSE
                </p>
              </a>
              {"\n"}
              {"\n"}
              He's a physics - gold medalist, B.tech - gold medalist, M.S. IIT
              delhi - gold medalist
              {"\n \n"}
              He explained spaced repetition very well. So did you understand
              what spaced repetition is? It's crucial to use this app correctly.
            </p>
          ) : null
        ) : (
          <span
            style={{ textAlign: center ? "center" : "left", color: "#fff" }}
          >
            {text}
          </span>
        )}
      </div>

      {chatObj &&
        chat.map((v: any, i1: number) => {
          const isReply = i1 % 2 === 0;
          return (
            <div
              ref={chatModal}
              key={i1}
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: isReply ? "flex-end" : "flex-start",
                maxWidth: isReply ? "100%" : "93%",
              }}
            >
              {v.map((j: any, i2: number) => (
                <div
                  // activeOpacity={isReply && i1 === chat.length - 1 ? 0.7 : 1}
                  key={j.id}
                  onMouseDown={(e) =>
                    isReply && i1 === chat.length - 1 ? reply(j, i1, i2) : {}
                  }
                  className={isReply && i1 === chat.length - 1 ? "app-btn" : ""}
                  style={{
                    backgroundColor: isReply ? "#3178c6" : "#2b2b2b",
                    padding: isReply ? 10 : "12px 10px",
                    marginTop: 10,
                    cursor:
                      isReply && i1 === chat.length - 1 ? "pointer" : "normal",
                    marginLeft: isReply ? 10 : 0,
                    borderRadius: 4,
                    color: "#fff",
                  }}
                >
                  {/* <p style={{ color: isReply ? "#ededed" : "#fff" }}> */}
                  {j.text}
                  {/* </p> */}
                </div>
              ))}
            </div>
          );
        })}
    </div>
  );
}
