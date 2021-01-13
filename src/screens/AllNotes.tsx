import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../AppContext/AppContext";
import { format, sub } from "date-fns";
import { isAnyNoteActiveFunc, isRecycleBinEmptyFunc } from "../util/util";
import Dropdown from "../widgets/Dropdown";
import { schedulePushNotification } from "./AddNote";
import box from "../assets/icons/box.svg";
import calender from "../assets/icons/calendar.svg";
import deleteIcon from "../assets/icons/delete.svg";
import softDeleteIcon from "../assets/icons/soft-delete.svg";
import pencil from "../assets/icons/pencil.svg";
import refresh from "../assets/icons/refresh.svg";
import search from "../assets/icons/magnifiying-glass.svg";
import leftArrow from "../assets/icons/left-arrow.svg";
import restore from "../assets/icons/restore.svg";
import recycleBinIcon from "../assets/icons/recycle-bin.svg";
import logo from "../assets/NFicon2.png";

export default function AllNotes(props: {
  recycleBin?: boolean;
  setEditNoteNumber?: (index: number) => void;
}) {
  const { recycleBin, setEditNoteNumber } = props;
  const [subjectFilterSelected, setSubjectFilterSelected] = useState("All");
  const [searchText, setSearchText] = useState<any>(false);
  const TextInputRef = useRef<any>();
  const {
    states: { allNotes, subs, isAnyNoteActive, isRecycleBinEmpty },
    actions: { setAllNotes, setIsAnyNoteActive, setIsRecycleBinEmpty },
  } = useContext<any>(AppContext);
  const subjectFilterOptions = [
    {
      id: "32324923",
      title: "All",
    },
    ...subs,
  ];

  const deleteNote = (index: any, id: any, note: any, type?: string) => {
    let tempAllNotes = [...allNotes];
    // tempAllNotes = tempAllNotes.filter((v) => v.id !== id);
    if (type === "permanentDelete") {
      tempAllNotes.splice(index, 1);
      setAllNotes(tempAllNotes);
      isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
    } else {
      if (type === "restore") {
        tempAllNotes[index].delete = false;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, false, note.title);
        setIsAnyNoteActive(true);
        isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
      } else {
        tempAllNotes[index].delete = true;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, "delete", "");
        isAnyNoteActiveFunc(allNotes, setIsAnyNoteActive);
        setIsRecycleBinEmpty(false);
      }
    }
  };

  // Empty Recycle bin
  const deleteAll = () => {
    let tempAllNotes = [...allNotes];
    tempAllNotes = tempAllNotes.filter((v) => v.delete !== true);
    setAllNotes(tempAllNotes);
    isRecycleBinEmptyFunc(tempAllNotes, setIsRecycleBinEmpty);
  };

  const filter = (val: any) => {
    const tempAllNotes: any = [...allNotes];
    if (
      val.subject === "All" &&
      (val.searchText === "" || val.searchText === false)
    ) {
      tempAllNotes.forEach((v: any) => {
        v.show = true;
      });
    } else {
      tempAllNotes.forEach((v: any) => {
        const searchText = val.searchText
          ? v.title.toLowerCase().includes(val.searchText.toLowerCase())
          : true;
        if (
          searchText &&
          (val.subject === "All" || v.subject === val.subject)
        ) {
          v.show = true;
        } else {
          v.show = false;
        }
      });
    }
    setAllNotes(tempAllNotes, false);
    setSubjectFilterSelected(val.subject);
    setSearchText(val.searchText);
  };

  useEffect(() => {
    // if (Notification.permission === "granted") {
    //   // alert("we have permission");
    //   const notification = new Notification("permission granted", {
    //     body: "timestamp",
    //     icon: "../assets/NFicon2.png",
    //     // tag: "testing",
    //     // timestamp: Date.now() + 60000 * 2,
    //   });
    // } else if (Notification.permission !== "denied") {
    //   Notification.requestPermission().then((permission) => {
    //     if (permission === "granted") {
    //       const notification = new Notification("permission granted", {
    //         body: "this is body",
    //         icon: require("../assets/NFicon2.png"),
    //       });
    //     }
    //   });
    // }
  }, []);

  return (
    <>
      {(isAnyNoteActive && allNotes.length !== 0) ||
      (recycleBin && allNotes.length !== 0) ? (
        recycleBin && isRecycleBinEmpty ? (
          // <p>Recycle bin is empty</p>
          <NoNotes source={recycleBinIcon} text='Recycle bin is empty' />
        ) : (
          <div
            style={{
              backgroundColor: "#fff",
              position: "relative",
              margin: "0 10px 10px 10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{ marginLeft: 10, position: "relative", zIndex: 1 }}
                >
                  <Dropdown
                    selected={subjectFilterSelected}
                    title='Subject'
                    options={subjectFilterOptions}
                    setSelected={(val) =>
                      filter({ subject: val, searchText: searchText })
                    }
                  />
                </div>
                {recycleBin && (
                  <div
                    style={{
                      marginLeft: 10,
                      backgroundColor: "#d63031",
                      borderRadius: 6,
                    }}
                  >
                    <button
                      style={{ padding: "10px 15px", color: "#fff" }}
                      onMouseDown={deleteAll}
                    >
                      Delete All
                    </button>
                  </div>
                )}
              </div>
              <input
                placeholder='Search...'
                value={searchText ? searchText : ""}
                onChange={(e) =>
                  filter({
                    subject: subjectFilterSelected,
                    searchText: e.target.value,
                  })
                }
                className='addnote-input search'
                style={{
                  background: "transparent",
                  outline: "none",
                  border: "none",
                  borderBottom: "2px solid #000",
                  fontSize: "17px",
                  margin: " 0 10px",
                  padding: "4px",
                  width: "40%",
                  transition: ".4s ease-in-out",
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                flexFlow: "row wrap",
                alignItems: "flex-start",
              }}
            >
              {!recycleBin
                ? allNotes.map((item: any, index: any) =>
                    !item.delete && item.show ? (
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
                        <NoteBox
                          note={item}
                          itemIndex={index}
                          deleteNote={deleteNote}
                          editNote={(index) =>
                            setEditNoteNumber && setEditNoteNumber(index)
                          }
                        />
                      </div>
                    ) : null
                  )
                : allNotes.map((item: any, index: any) =>
                    item.delete && item.show ? (
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
                        <NoteBox
                          note={item}
                          itemIndex={index}
                          deleteNote={deleteNote}
                          recycleBin
                        />
                      </div>
                    ) : null
                  )}
            </div>
          </div>
        )
      ) : (
        <NoNotes />
      )}
      <div
        style={{
          borderRadius: 50,
          position: "absolute",
          bottom: 0,
          right: 10,
          // transform: [{ translateX: -28 }],
        }}
      ></div>
    </>
  );
}

export const NoNotes = (props: { source?: any; text?: string }) => {
  const { source, text } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        height: "calc(100vh - 80px)",
      }}
    >
      <img
        style={{
          width: "20%",
        }}
        src={source ? source : box}
      />
      <p>{text ? text : "No Notes yet"}</p>
    </div>
  );
};

const NoteBox = (props: {
  note: any;
  itemIndex: number;
  deleteNote: (index: any, id: any, note: any, type?: string) => void;
  editNote?: (index: number) => void;
  recycleBin?: boolean;
}) => {
  const { note, itemIndex, deleteNote, editNote, recycleBin } = props;
  return (
    <>
      <h2 style={{ fontSize: 30, margin: "0 0 6px 0" }}>{note.title}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
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
        <img style={{ width: "30px" }} src={refresh} alt='time revised' />
        <span style={{ fontSize: 16, marginLeft: 4 }}>
          {note.revisionNumber}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <img
          style={{ width: 40, height: 38, marginRight: 10 }}
          src={calender}
        />
        <div style={{ display: "flex", flexFlow: "column" }}>
          <span>{format(new Date(note.revisions[0]), "dd-MMM-yyyy")}</span>
          <span>
            Next revision:{" "}
            {format(
              new Date(note.revisions[note.revisionNumber + 1]),
              "dd-MMM-yyyy"
            )}
          </span>
        </div>
      </div>

      {note.desc.trim() !== "" && (
        <p
          style={{
            fontSize: 20,
            marginBottom: 10,
          }}
        >
          {note.desc}
        </p>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        {editNote ? (
          <button
            onMouseDown={() => {
              editNote && editNote(itemIndex);
            }}
          >
            <img style={{ width: "30px" }} src={pencil} />
          </button>
        ) : (
          <button
            onMouseDown={() => deleteNote(itemIndex, note.id, note, "restore")}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#27ae60",
              padding: "5px 10px",
            }}
          >
            <span style={{ color: "#fff", paddingRight: 6 }}>Restore</span>
            <img style={{ height: 32, width: 32 }} src={restore} />
          </button>
        )}
        <button
          style={{ alignSelf: "flex-end", marginLeft: 10 }}
          onMouseDown={() => {
            if (recycleBin) {
              deleteNote(itemIndex, note.id, note, "permanentDelete");
            } else {
              deleteNote(itemIndex, note.id, note);
            }
          }}
        >
          {recycleBin ? (
            <img style={{ width: "30px" }} src={deleteIcon} />
          ) : (
            <img style={{ width: "30px" }} src={softDeleteIcon} />
          )}
        </button>
      </div>
    </>
  );
};
