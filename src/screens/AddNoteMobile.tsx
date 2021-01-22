import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContext/AppContext";
import Dropdown from "../widgets/Dropdown";
import { add, startOfDay } from "date-fns/esm";
import { v4 as uuidv4 } from "uuid";
import done from "../assets/icons/done.svg";
import leftArrow from "../assets/icons/left-arrow-white.svg";
import { logoInBase64, schedulePushNotification } from "../util/util";
import Modal from "../widgets/Modal";
import { useLocation } from "react-router";

export default function AddNoteMobile(props: {
  editNoteNumber: number;
  setEditNoteNumber: (index: number) => void;
  noteAdded: () => void;
  addNoteActive: boolean;
  setAddNoteActive: any;
}) {
  const {
    editNoteNumber,
    setEditNoteNumber,
    noteAdded,
    addNoteActive,
    setAddNoteActive,
  } = props;
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const pattern = useRef<number[]>([1, 7, 30, 90, 365]).current;
  const [firstNote, setFirstNote] = useState(true);

  const {
    states: { subs, allNotes, isAnyNoteActive },
    actions: { setAllNotes, setIsAnyNoteActive },
    constants: { mainColor },
  } = useContext<any>(AppContext);
  const [selected, setSelected] = useState(subs[0].title);
  const titleInputRef = useRef<any>();

  const chatObj = [
    [
      {
        id: "8899854728",
        text: "That's great!",
        reply: "Thanks",
        executeFunction: () => {
          localStorage.setItem("firstNote", "false");
          setTimeout(() => {
            setFirstNote(false);
          }, 3000);
        },
      },
      {
        id: "7194853255",
        text: "Thanks! And turn on notifications.",
        reply: "You're welcome. Please allow notification permission.",
        executeFunction: () => {
          Notification.requestPermission().then(async (permission) => {
            if (permission === "granted") {
              try {
                const reg = await navigator.serviceWorker.getRegistration();
                reg?.showNotification("Notifications are on 👍", {
                  tag: "SS", // a unique ID
                  body:
                    "If you have revision(s), You'll receive a notification of your revision(s) at 6:00am", // content of the push notification
                  // @ts-ignore
                  showTrigger: new TimestampTrigger(new Date().getTime()), // set the time for the push notification
                  badge: logoInBase64,
                  icon: logoInBase64,
                });
                localStorage.setItem("notifications", JSON.stringify("On"));
              } catch (err) {
                console.log(err);
                alert(
                  "Failed! Please try again using an updated version of chrome."
                );
              }
            } else {
              localStorage.setItem("notifications", JSON.stringify("Off"));
            }
          });
        },
        indent: [
          {
            id: "3841829741",
            text: "👍",
            reply: "👍",
            executeFunction: () => {
              localStorage.setItem("firstNote", "false");
              setTimeout(() => {
                setFirstNote(false);
              }, 3000);
            },
          },
        ],
      },
    ],
  ];
  useEffect(() => {
    setItem(setFirstNote, "firstNote");
    if (
      !isAnyNoteActive &&
      isAnyNoteActive !== null &&
      (location.pathname === "/" || location.pathname === "/all-notes")
    ) {
      setTimeout(() => {
        setAddNoteActive(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    setSelected(subs[0].title);
  }, [subs]);
  const copyOfTempNotes = [...allNotes];
  useEffect(() => {
    if (editNoteNumber !== -1) {
      setTitle(copyOfTempNotes[editNoteNumber].title);
      setDesc(copyOfTempNotes[editNoteNumber].desc);
      setSelected(copyOfTempNotes[editNoteNumber].subject);
      setAddNoteActive(true);
    }
  }, [editNoteNumber]);
  useEffect(() => {
    if (addNoteActive && !firstNote) {
      titleInputRef?.current.focus();
    } else {
      titleInputRef?.current.blur();
    }
  }, [addNoteActive, firstNote]);

  useEffect(() => {
    //esc button
    // BackHandler.addEventListener("hardwareBackPress", () => {
    //   if (isAddNoteOpen.current) {
    //     if (editNoeNumber >= 0) {
    //       setTimeout(() => {
    //         setTitle("");
    //         setDesc("");
    //         setEditNoteNumber(-1);
    //       }, 1000);
    //     }
    //     return true;
    //   }
    // });
  }, [editNoteNumber]);

  const addNote = () => {
    let allRevisions = [startOfDay(new Date())];
    for (let i = 0; i < pattern.length; i++) {
      allRevisions.push(add(startOfDay(new Date()), { days: pattern[i] }));
    }

    const tempAllNotes = [...allNotes];

    // for (let i = 0; i < 1000; i++) {
    const note = {
      id: uuidv4(),
      title: title,
      // title: title + i,
      desc,
      subject: selected,
      pattern,
      revisions: allRevisions,
      revisionNumber: 0,
      deleted: false,
      show: true,
    };
    tempAllNotes.unshift(note);
    // }
    setAllNotes(tempAllNotes);
    setIsAnyNoteActive(true);
    setTimeout(() => {
      noteAdded();
    }, 10);

    schedulePushNotification(note, false, title);

    setTimeout(() => {
      setTitle("");
      setDesc("");
    }, 200);
  };

  const setItem = (toSet: any, itemName: string) => {
    const value = localStorage.getItem(itemName);
    if (value !== "false") {
      toSet(true);
    } else {
      toSet(false);
    }
  };
  const editNote = () => {
    let tempAllNotes = [...allNotes];
    const note = { ...tempAllNotes[editNoteNumber] };
    if (note.title !== title) {
      schedulePushNotification(note, "edit", title);
    }
    tempAllNotes[editNoteNumber].title = title;
    tempAllNotes[editNoteNumber].desc = desc;
    tempAllNotes[editNoteNumber].subject = selected;
    setAllNotes(tempAllNotes);
    setTimeout(() => {
      setTitle("");
      setDesc("");
      setEditNoteNumber(-1);
    }, 200);
  };

  return (
    <div
      style={{
        backgroundColor: mainColor,
        boxSizing: "border-box",
        padding: "10px",
        transition: ".3s ease-in-out",
        overflow: "auto",
        position: "fixed",
        left: addNoteActive ? "0" : "-100%",
        // display: addNoteActive ? "block" : "none",
        height: "100vh",
        width: "100%",
        zIndex: 100,
      }}
    >
      <div
        style={{
          // backgroundColor: "#3178c6",
          boxSizing: "border-box",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          // position: "relative",
          // top: 0,
          transition: ".4s ease-in-out",
          width: "100%",
          zIndex: 100,
        }}
      >
        <button
          style={{ padding: 10 }}
          onMouseDown={() => {
            setAddNoteActive(false);
            if (editNoteNumber >= 0) {
              setTimeout(() => {
                setTitle("");
                setDesc("");
                setEditNoteNumber(-1);
              }, 500);
            }
          }}
        >
          <img style={{ width: "20px" }} src={leftArrow} alt='close' />
        </button>
        <button
          disabled={title.trim() === "" ? true : false || !addNoteActive}
          onMouseDown={() => {
            setAddNoteActive(false);
            if (editNoteNumber >= 0) {
              editNote();
            } else {
              addNote();
            }
          }}
        >
          <img style={{ width: "20px" }} src={done} alt='save note' />
        </button>
      </div>
      <div
        style={
          {
            // padding: "0 100px",
          }
        }
      >
        <h1
          style={{
            color: "white",
            marginTop: 0,
            textAlign: "center",
            fontSize: "35px",
            transition: ".4s ease-in-out",
          }}
        >
          {editNoteNumber !== -1 ? "Edit Note" : "What you learned today?"}
        </h1>
        <input
          onMouseDown={() => setAddNoteActive(true)}
          className='addnote-input'
          style={{
            width: "100%",
            background: "transparent",
            outline: "none",
            border: "none",
            borderBottom: "2px solid #000",
            fontSize: "20px",
          }}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Title'
          value={title}
          ref={titleInputRef}
        />
        <div style={{ display: "flex", alignItems: "center" }}>
          <Dropdown
            title='Subject'
            options={subs}
            selected={selected}
            setSelected={setSelected}
            addInput
            deleteAble
          />
          <div
            style={{
              marginLeft: 10,
              opacity: 0.7,
              display: "flex",
              flexFlow: "column",
            }}
          >
            <span>Pattern: 1-7-30-90-365</span>
            <span style={{ color: "#d00000" }}>
              Custom pattern option coming soon
            </span>
          </div>
        </div>
        <textarea
          style={{
            width: "100%",
            background: "transparent",
            minHeight: 90,
            borderColor: "black",
            fontSize: 20,
            outline: "none",
            border: "none",
            borderBottom: "2px solid #000",
          }}
          onChange={(e) => setDesc(e.target.value)}
          placeholder='Description(optional)...'
          value={desc}
          maxLength={400}
        />
        <p
          style={{
            textAlign: "right",
            color: desc.length < 400 ? "#000" : "#27ae60",
            margin: 0,
          }}
        >
          {desc.length}/400
        </p>
      </div>
      {firstNote && addNoteActive && (
        <div
          style={{
            width: "30%",
            minWidth: "245px",
            position: "absolute",
            bottom: "10%",
            left: "6%",
          }}
        >
          <Modal
            text="I'll remind you to revise it. So you Never Forget what's important to you."
            chatObj={chatObj}
          />
        </div>
      )}
    </div>
  );
}
