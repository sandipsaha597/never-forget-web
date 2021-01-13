import {
  add,
  differenceInDays,
  differenceInSeconds,
  isFuture,
  startOfDay,
  sub,
} from "date-fns";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext, IAllNotes } from "../AppContext/AppContext";
import Modal from "../widgets/Modal";
import { rewardMsgs } from "../App";
import fireCracker from "../assets/icons/fire-cracker.svg";
import fireworks from "../assets/icons/fireworks.svg";
import clapping from "../assets/icons/clapping.svg";
import trophy from "../assets/icons/trophy.svg";
import box from "../assets/icons/box.svg";
import refresh from "../assets/icons/refresh.svg";
import rightArrow from "../assets/icons/right-arrow.svg";
import drawCheckMark from "../assets/icons/draw-check-mark.svg";
import { NoNotes } from "./AllNotes";
import AddNote from "./AddNote";

const congratsIcons = [fireCracker, fireworks, clapping, trophy];

const date = { active: false, days: 1, hours: 0 };

// "Congrats",

export default function Home() {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [notesToRevise, setNotesToRevise] = useState<boolean>(true);
  const currentRewardMsg = useRef("Well done");
  const [rewardIcon, setRewardIcon] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    currentRewardMsg.current =
      rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)];
  }, []);

  const {
    states: { allNotes, isAnyNoteActive },
    actions: { setAllNotes },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  useEffect(() => {
    setNotesToRevise(!!haveNotesToRevise(allNotes));
  }, [allNotes]);

  useEffect(() => {
    if (!notesToRevise) {
      setRewardIcon(
        congratsIcons[Math.floor(Math.random() * congratsIcons.length)]
      );
    }
  }, [notesToRevise]);

  const markAsRevised = (itemIndex: number, id: string) => {
    const tempAllNotes = [...allNotes];

    setRewardMsgShow(true);

    setTimeout(() => {
      tempAllNotes[itemIndex].revisionNumber += 1;
      setAllNotes(tempAllNotes);
      setTimeout(() => {
        currentRewardMsg.current =
          rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)];
        setRewardMsgShow(false);
      }, rewardMsgTimeoutTime + 500);
    }, 10);
  };

  const skip = (itemIndex: number) => {
    const tempAllNotes = [...allNotes];
    tempAllNotes[itemIndex].revisions.splice(
      tempAllNotes[itemIndex].revisionNumber + 1,
      1
    );
    setAllNotes(tempAllNotes);
  };

  useEffect(() => {
    const refreshFunc = () => {
      const refreshTime =
        differenceInSeconds(
          add(startOfDay(new Date()), { days: 1 }),
          new Date()
        ) * 1000;
      if (refreshTime > 1000 * 60) {
        setTimeout(() => {
          refreshFunc();
        }, 1000 * 60);
      } else {
        setTimeout(() => {
          setRefreshing(true);
          setTimeout(() => {
            setNotesToRevise(!!haveNotesToRevise(allNotes));
            setTimeout(() => {
              setRefreshing(false);
            }, 1000);
          }, 1000);
        }, refreshTime);
      }
    };
    refreshFunc();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {isAnyNoteActive && allNotes.length !== 0 ? (
        <div
          style={{
            margin: 10,
          }}
        >
          {date.active && (
            <>
              <p>
                {JSON.stringify(
                  sub(new Date(), {
                    days: date.days,
                    hours: date.hours,
                  })
                )}
              </p>
              <p>{JSON.stringify(new Date())}</p>
            </>
          )}
          {notesToRevise ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "flex-start",
                flexFlow: "row wrap",
              }}
            >
              {allNotes.map((item: any, index: any) => {
                return !item.delete &&
                  !isFuture(
                    sub(new Date(item.revisions[item.revisionNumber + 1]), {
                      days: date.days,
                      hours: date.hours,
                    })
                  ) ? (
                  <div
                    key={item.id}
                    style={{
                      border: "2px solid #000",
                      padding: 10,
                      borderRadius: 10,
                      width: "32%",
                      boxSizing: "border-box",
                      marginBottom: 20,
                    }}
                  >
                    <ReviewBox
                      itemIndex={index}
                      disabled={rewardMsgShow}
                      note={item as IAllNotes}
                      markAsRevised={markAsRevised}
                      skip={skip}
                    />
                  </div>
                ) : null;
              })}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <img
                style={{
                  width: "20%",
                }}
                src={rewardIcon}
              />
              <p
                style={{
                  fontSize: 26,
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                Congrats! You have done all your revisions on time!
              </p>
            </div>
          )}

          {rewardMsgShow && (
            <Modal
              text={currentRewardMsg.current}
              noChat
              center
              color='#3178c6'
            />
          )}
        </div>
      ) : (
        <NoNotes />
      )}
      {refreshing && <Refreshing />}
    </div>
  );
}

const Refreshing = () => {
  const [count, setCount] = useState(3);

  useEffect(() => {
    setTimeout(() => {
      setCount(2);
    }, 1000);

    setTimeout(() => {
      setCount(1);
    }, 2000);

    setTimeout(() => {
      setCount(0);
    }, 3000);
  }, []);
  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,.4)",
        position: "absolute",
        top: 0,
        left: 0,
        display: "flex",
        flexFlow: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <p style={{ fontSize: 20 }}>Refreshing...</p>
      <p style={{ fontSize: 160, margin: 0 }}>{count}</p>
    </div>
  );
};

const ReviewBox = (props: {
  note: IAllNotes;
  markAsRevised: (itemIndex: number, id: string) => void;
  skip: (itemIndex: number, id: string) => void;
  disabled: boolean;
  itemIndex: any;
}) => {
  const { note, markAsRevised, skip, disabled, itemIndex } = props;
  const differenceInDaysConst = differenceInDays(
    new Date(),
    sub(new Date(note.revisions[note.revisionNumber + 1]), {
      days: date.days,
      hours: date.hours,
    })
  );
  return (
    <>
      <h2 style={{ fontSize: "30px", margin: 0 }}>{note.title}</h2>
      {differenceInDaysConst > 0 ? (
        <p
          style={{
            marginBottom: 3,
            color: "#e74c3c",
          }}
        >
          {differenceInDaysConst} {differenceInDaysConst > 1 ? "days" : "day"}{" "}
          ago
        </p>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        {note.subject !== "--None--" && (
          <span
            style={{
              borderRadius: 50,
              backgroundColor: "#b2bec3",
              padding: "5px 13px",
              marginRight: 10,
            }}
          >
            {note.subject}
          </span>
        )}
        <img
          style={{ width: "30px", margin: "0 0 6px 0" }}
          src={refresh}
          alt='time revised'
        />
        <span style={{ fontSize: 16, marginLeft: 4 }}>
          {note.revisionNumber}
        </span>
      </div>
      {note.desc.trim() !== "" && (
        <p style={{ fontSize: 20, marginBottom: 10 }}>{note.desc}</p>
      )}
      <div
        style={{ display: "flex", width: "100%", justifyContent: "flex-end" }}
      >
        <div style={{ display: "flex" }}>
          <div style={{ marginRight: 15 }}>
            <button
              style={{
                backgroundColor: disabled ? "#34495e" : "#e74c3c",
                paddingLeft: 10,
              }}
              disabled={disabled}
              onMouseDown={() => skip(itemIndex, note.id)}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#ededed" }}>Skip</span>
                {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
                <img style={{ width: "30px" }} src={rightArrow} />
                {/* <Image source={require("../assets/icons/draw-check-mark.png")} /> */}
              </div>
            </button>
          </div>
          <button
            disabled={disabled}
            onMouseDown={() => markAsRevised(itemIndex, note.id)}
          >
            {/* <p style={{marginRight: 10, fontSize: 20}} >Mark as read</p> */}
            <img style={{ width: "30px" }} src={drawCheckMark} />
          </button>
        </div>
      </div>
    </>
  );
};

const haveNotesToRevise = (allNotes: any) =>
  allNotes.find((v: any) => {
    return (
      !v.delete &&
      !isFuture(
        sub(new Date(v.revisions[v.revisionNumber + 1]), {
          days: date.days,
          hours: date.hours,
        })
      )
    );
  });
