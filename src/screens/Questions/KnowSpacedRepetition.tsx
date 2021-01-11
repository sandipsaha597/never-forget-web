import { add, format } from "date-fns";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AppContext, EnumSpacedRepetition } from "../../AppContext/AppContext";
import Dropdown from "../../widgets/Dropdown";
import Modal from "../../widgets/Modal";
// import Modal from "../../widgets/Modal";

export function KnowSpacedRepetition() {
  const {
    constants: { mainColor },
    actions: { setKnowSpacedRepetition },
  } = useContext<any>(AppContext);
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "45px" }}>
        Do you know what is spaced repetition?
      </h1>
      <div>
        <button
          className='app-btn'
          style={{
            textDecoration: "none",
            color: "#fff",
            background: mainColor,
            padding: "10px 15px",
            border: "none",
            fontSize: "15px",
            margin: "10px",
            cursor: "pointer",
          }}
          onMouseDown={() => navigate("/what-is-spaced-repetition")}
        >
          No, what is it?
        </button>
        <button
          className='app-btn'
          style={{
            textDecoration: "none",
            color: "#fff",
            background: mainColor,
            padding: "10px 15px",
            border: "none",
            fontSize: "15px",
            margin: "10px",
            cursor: "pointer",
          }}
          onMouseDown={() => setKnowSpacedRepetition("Yes")}
        >
          Yes
        </button>
      </div>
    </div>
  );
}

export const VideoScreen = () => {
  const [selected, setSelected] = useState("English");
  const [text, setText] = useState("custom===the guy above===");

  const {
    actions: { setKnowSpacedRepetition },
  } = useContext<any>(AppContext);

  const navigate = useNavigate();

  const chatObj = [
    [
      {
        id: "7194853255",
        text: "Yes, I get it.",
        reply: "Excellent",
        executeFunction: () => {
          setTimeout(() => {
            setKnowSpacedRepetition(true);
            navigate("/");
          }, 1500);
        },
      },
      {
        id: "8193959100",
        text: "No, please explain",
        reply: `It's basically a way of revising effectively. If you study
 something today and don't revise it, you will forget almost
 everything within a week or so(photographic memory excluded).
 Which means all of your hard work, time, energy is wasted.
To prevent this we can use space repetition technique. In this
 amazing technique we revise whatever we wanna remember in a
 spaced manner. Suppose today ${format(
   new Date(),
   "dd-MMM-yyyy"
 )} you studied something so you will \
 revise it tomorrow (${format(add(new Date(), { days: 1 }), "dd-MMM-yyyy")}),
 then after 7 days (${format(
   add(new Date(), { days: 7 }),
   "dd-MMM-yyyy"
 )}), then after 30 days (${format(
          add(new Date(), { days: 30 }),
          "dd-MMM-yyyy"
        )})\
 then after 90 days (${format(add(new Date(), { days: 90 }), "dd-MMM-yyyy")}),\
 then after 365 days (${format(
   add(new Date(), { days: 365 }),
   "dd-MMM-yyyy"
 )}). The pattern here was 1-7-30-90-365. There are other famous patterns like 1-3-7-30-90, 1-3-7-15-30-90 etc as well.\
 Like this the information will store in your long term memory, it will become very easy for you to recall and you will Never Forget what's important for you.\n\
So did you understand what spaced repetition is? It's crucial to use this app correctly.`,
        indent: [
          {
            id: "7194853010",
            text: "Yes",
            reply: "Excellent",
            executeFunction: () => {
              setTimeout(() => {
                setKnowSpacedRepetition(true);
                navigate("/");
              }, 1500);
            },
          },
          {
            id: "7194873955",
            text: "No",
            reply:
              "Please try searching for 'Forgetting curve', 'spaced repetition' and/or 'spacing effect'. Done? So did you\
 understand what spaced repetition is? It's crucial to use this\
 app correctly.",
            indent: [
              {
                id: "9284719402",
                text: "Yes",
                reply: "Excellent",
                executeFunction: () => {
                  setTimeout(() => {
                    setKnowSpacedRepetition(true);
                    navigate("/");
                  }, 1500);
                },
              },
              {
                id: "3135616781",
                text: "No",
                reply:
                  "🤔 🤔 I don't know how else to explain. But no issues come inside.",
                indent: [
                  {
                    id: "9284719402",
                    text: "🚀",
                    reply: "🚀",
                    executeFunction: () => {
                      setTimeout(() => {
                        setKnowSpacedRepetition(true);
                        navigate("/");
                      }, 1500);
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  ];
  return (
    <div style={{ display: "flex", height: "96vh" }}>
      <div style={{ width: "70%" }}>
        {selected === "English" ? (
          <Video url='https://www.youtube-nocookie.com/embed/VkPlQ4gjk8M?start=30&end=152' />
        ) : (
          <Video url='https://www.youtube-nocookie.com/embed/OccJMq7AtSE?start=655&end=920' />
        )}
      </div>
      <div style={{ marginLeft: 10, width: "30%", position: "relative" }}>
        <Dropdown
          title='Switch video language'
          selected={selected}
          setSelected={(val) => {
            setSelected(val);
          }}
          options={[
            { id: "3413449123", title: "English" },
            { id: "3489124389", title: "Hindi" },
          ]}
        />
        <div
          style={
            {
              // overflow: "hidden",
            }
          }
        >
          {selected === "English" ? (
            <Modal text='custom===the guy above===' chatObj={chatObj} scroll />
          ) : (
            <Modal
              text='custom===the guy above hindi==='
              chatObj={chatObj}
              scroll
            />
          )}
        </div>
      </div>
    </div>
  );
};

const Video = (props: { url: string }) => {
  const { url } = props;
  return (
    <iframe
      style={{
        width: "100%",
        height: "32vw",
        border: "none",
      }}
      src={url}
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen'
    ></iframe>
  );
};
