import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContext/AppContext";
import Dropdown from "../widgets/Dropdown";
import { add, differenceInSeconds, format, startOfDay } from "date-fns/esm";
import { v4 as uuidv4 } from "uuid";
import Modal from "../widgets/Modal";
import done from "../assets/icons/done.svg";
import leftArrow from "../assets/icons/left-arrow.svg";

export default function AddNote(props: {
  editNoteNumber: number;
  setEditNoteNumber: (index: number) => void;
  noteAdded: () => void;
}) {
  const [addNoteActive, setAddNoteActive] = useState<boolean>(false);
  const { editNoteNumber, setEditNoteNumber, noteAdded } = props;
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const pattern = useRef<number[]>([1, 7, 30, 90, 365]).current;
  const [firstNote, setFirstNote] = useState(true);

  const {
    states: { subs, allNotes },
    actions: { setAllNotes, setIsAnyNoteActive },
    constants: { mainColor },
  } = useContext<any>(AppContext);
  const [selected, setSelected] = useState(subs[0].title);

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
        text: "Thanks!",
        reply: "You're welcome",
        executeFunction: () => {
          localStorage.setItem("firstNote", "false");
          setTimeout(() => {
            setFirstNote(false);
          }, 3000);
        },
      },
    ],
  ];

  useEffect(() => {
    setItem(setFirstNote, "firstNote");
  }, []);

  useEffect(() => {
    setSelected(subs[0].title);
  }, [subs]);

  useEffect(() => {
    if (editNoteNumber !== -1) {
      setTitle(allNotes[editNoteNumber].title);
      setDesc(allNotes[editNoteNumber].desc);
      setSelected(allNotes[editNoteNumber].subject);
      setAddNoteActive(true);
    }
  }, [editNoteNumber, allNotes]);

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

    // for (let i = 0; i < 10; i++) {
    const note = {
      id: uuidv4(),
      title: title,
      // title: title + i,
      desc,
      subject: selected,
      pattern,
      revisions: allRevisions,
      revisionNumber: 0,
      delete: false,
      show: true,
    };
    tempAllNotes.unshift(note);
    // }
    setAllNotes(tempAllNotes);
    setIsAnyNoteActive(true);
    setAddNoteActive(false);
    setTimeout(() => {
      noteAdded();
    }, 10);

    // schedulePushNotification(note, false, title);

    setTimeout(() => {
      setTitle("");
      setDesc("");
    }, 200);
  };
  // Notifications.getAllScheduledNotificationsAsync().then((v) => console.log(v));

  // Notifications.cancelAllScheduledNotificationsAsync()
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
      // schedulePushNotification(note, "edit", title);
    }
    tempAllNotes[editNoteNumber].title = title;
    tempAllNotes[editNoteNumber].desc = desc;
    tempAllNotes[editNoteNumber].subject = selected;
    setAllNotes(tempAllNotes);
    setTimeout(() => {
      setAddNoteActive(false);
    }, 10);
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
        height: addNoteActive ? "100vh" : "100px",
        width: "100%",
        boxSizing: "border-box",
        padding: "10px",
        transition: ".4s ease-in-out",
        overflow: "hidden",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: addNoteActive ? "92%" : "100%",
          backgroundColor: "#3178c6",
          height: addNoteActive ? "100px" : "0",
          overflow: "hidden",
          transition: ".4s ease-in-out",
          margin: "auto",
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
          <img style={{ width: "30px" }} src={leftArrow} alt='close' />
        </button>
        <button
          disabled={title.trim() === "" ? true : false}
          onMouseDown={() => {
            if (editNoteNumber >= 0) {
              editNote();
            } else {
              addNote();
            }
          }}
        >
          <img style={{ width: "30px" }} src={done} alt='save note' />
        </button>
      </div>
      <div
        style={{
          padding: "0 100px",
        }}
      >
        <h1
          style={{
            color: "white",
            marginTop: 0,
            textAlign: "center",
            fontSize: addNoteActive ? "54px" : "29px",
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
          }}
        >
          {desc.length}/400
        </p>
      </div>
      {firstNote && addNoteActive && (
        <div
          style={{
            width: "30%",
            position: "absolute",
            bottom: "24px",
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

// export async function schedulePushNotification(
//   note: any,
//   type: string | boolean,
//   title: string
// ) {
//   for (let i = note.revisionNumber + 1; i < note.revisions.length; i++) {
//     // for (let i = note.revisionNumber + 1; i < note.revisionNumber + 2; i++) {
//     Notifications.getAllScheduledNotificationsAsync().then(
//       (allNotifications) => {
//         const revisionDate = new Date(note.revisions[i]);
//         const notificationObj = allNotifications.find(
//           (v) => v.identifier === format(revisionDate, "dd-MM-yyyy")
//         );
//         let body = "raw";
//         if (notificationObj) {
//           if (type === "delete") {
//             if (
//               notificationObj?.content.body?.includes(
//                 "🗒️ " + note.title + " 📖" + "\n"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "🗒️ " + note.title + " 📖" + "\n",
//                 ""
//               );
//             } else if (
//               notificationObj?.content.body?.includes(
//                 "\n" + "🗒️ " + note.title + " 📖"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "\n" + "🗒️ " + note.title + " 📖",
//                 ""
//               );
//             } else if (
//               notificationObj?.content.body?.includes(
//                 "🗒️ " + note.title + " 📖"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "🗒️ " + note.title + " 📖",
//                 ""
//               );
//             }
//           } else if (type === "edit") {
//             if (
//               notificationObj?.content.body?.includes(
//                 "🗒️ " + note.title + " 📖" + "\n"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "🗒️ " + note.title + " 📖" + "\n",
//                 "🗒️ " + title + " 📖" + "\n"
//               );
//             } else if (
//               notificationObj?.content.body?.includes(
//                 "\n" + "🗒️ " + note.title + " 📖"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "\n" + "🗒️ " + note.title + " 📖",
//                 "\n" + "🗒️ " + title + " 📖"
//               );
//             } else if (
//               notificationObj?.content.body?.includes(
//                 "🗒️ " + note.title + " 📖"
//               )
//             ) {
//               body = notificationObj?.content.body?.replace(
//                 "🗒️ " + note.title + " 📖",
//                 "🗒️ " + title + " 📖"
//               );
//             }
//           } else {
//             body = "🗒️ " + title + " 📖" + "\n" + notificationObj.content.body;
//           }
//         } else if (!type) {
//           body = "🗒️ " + title + " 📖";
//         }

//         const trigger =
//           body === ""
//             ? -100
//             : differenceInSeconds(
//                 // add(startOfDay(new Date()), { days: 0, hours: 13, minutes: 11 }),
//                 // add(new Date(note.revisions[0]), { hours: 14, minutes: 18 }),
//                 add(revisionDate, { hours: 6 }),
//                 new Date()
//               );
//         Notifications.scheduleNotificationAsync({
//           content: {
//             title: i + "Rediv your notes, so you Never Forget them! 📔",
//             body: body,
//           },
//           identifier: format(revisionDate, "dd-MM-yyyy"),
//           trigger: { seconds: trigger },
//           // trigger: { seconds: 30 * i },
//         });
//       }
//     );
//   }
// }
