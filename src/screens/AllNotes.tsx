import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppContext, saveAndUpdate } from "../AppContext/AppContext";
import { format } from "date-fns";
import { Masonry } from "masonic";

import {
  constants,
  isAnyNoteActiveFunc,
  isRecycleBinEmptyFunc,
  schedulePushNotification,
} from "../util/util";
import Dropdown from "../widgets/Dropdown";

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
import { useLocation } from "react-router";
export let placeholderArray = [
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
  { placeholder: true },
];

const screenWidth = window.screen.width;

if (window.screen.width < 768) {
  placeholderArray = placeholderArray.slice(0, 15);
}
export default function AllNotes(props: {
  recycleBin?: boolean;
  setEditNoteNumber?: (index: number) => void;
}) {
  const { recycleBin, setEditNoteNumber } = props;
  const [subjectFilterSelected, setSubjectFilterSelected] = useState("All");
  const [searchText, setSearchText] = useState<any>(false);
  const [notesToShow, setNotesToShow] = useState<any>([]);
  const [isRecycleBinEmpty, setIsRecycleBinEmpty] = useState<boolean | null>(
    null
  );
  const {
    states: { allNotes, subs, isAnyNoteActive },
    actions: { setAllNotes, setIsAnyNoteActive },
  } = useContext<any>(AppContext);
  const searchInputRef = useRef<any>();
  const subjectFilterOptions = [
    {
      id: "32324923",
      title: "All",
    },
    ...subs,
  ];
  const sNU = (val: any) => {
    saveAndUpdate("isRecycleBinEmpty", setIsRecycleBinEmpty, val);
  };
  const retrieveIsRecycleBinEmptyStatus = useCallback(() => {
    if (isRecycleBinEmpty === null) {
      const storedIsRecycleBinEmpty = localStorage.getItem("isRecycleBinEmpty");
      if (
        storedIsRecycleBinEmpty === "false" ||
        storedIsRecycleBinEmpty === "true"
      ) {
        setIsRecycleBinEmpty(JSON.parse(storedIsRecycleBinEmpty));
      } else {
        isRecycleBinEmptyFunc(allNotes, sNU);
      }
    }
  }, []);

  useEffect(() => {
    retrieveIsRecycleBinEmptyStatus();
  }, []);
  useEffect(() => {
    document.title = recycleBin
      ? "Recycle Bin | Never Forget"
      : "All Notes | Never Forget";
  }, [recycleBin]);
  useEffect(() => {
    const tempNotesToShow: any = [];

    allNotes.forEach((v: any, i: any) => {
      v.index = i;
      if (recycleBin) {
        if (v.deleted && v.show) {
          tempNotesToShow.push(v);
        }
      } else {
        if (!v.deleted && v.show) {
          tempNotesToShow.push(v);
        }
      }
    });

    tempNotesToShow.push(...placeholderArray);
    setNotesToShow(tempNotesToShow);
  }, [recycleBin, allNotes]);

  const deleteNote = (index: any, id: any, note: any, type?: string) => {
    let tempAllNotes = [...allNotes];
    if (type === "permanentDelete") {
      tempAllNotes[index].deleted = false;
      tempAllNotes.splice(index, 1);
      setAllNotes(tempAllNotes);
      isRecycleBinEmptyFunc(tempAllNotes, sNU);
    } else {
      if (type === "restore") {
        tempAllNotes[index].deleted = false;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, false, note.title);
        setIsAnyNoteActive(true);
        isRecycleBinEmptyFunc(tempAllNotes, sNU);
      } else {
        tempAllNotes[index].deleted = true;
        setAllNotes(tempAllNotes);
        schedulePushNotification(note, "delete", "");
        isAnyNoteActiveFunc(tempAllNotes, setIsAnyNoteActive);
        sNU(false);
      }
    }
  };

  const deleteAll = () => {
    let tempAllNotes = [...allNotes];
    tempAllNotes = tempAllNotes.filter((v) => v.deleted !== true);
    setAllNotes(tempAllNotes);
    isRecycleBinEmptyFunc(tempAllNotes, sNU);
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
        } else if (!v.deleted) {
          v.show = false;
        }
      });
    }
    setAllNotes(tempAllNotes, false);
    setSubjectFilterSelected(val.subject);
    setSearchText(val.searchText);
  };

  useEffect(() => {
    if (searchText === "" || searchText) {
      searchInputRef?.current?.focus();
    } else {
      searchInputRef?.current?.blur();
    }
  }, [searchText]);

  return (
    <>
      {(isAnyNoteActive && allNotes.length !== 0) ||
      (recycleBin && allNotes.length !== 0) ? (
        recycleBin && isRecycleBinEmpty ? (
          <NoNotes source={recycleBinIcon} text='Recycle bin is empty' />
        ) : (
          <div
            className='all-notes-wrapper'
            style={{
              backgroundColor: "#fff",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: recycleBin || window.screen.width < 768 ? 0 : "100px",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                zIndex: 2,
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

              {screenWidth > 768 ? (
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
              ) : (
                <>
                  <div
                    style={{
                      boxSizing: "border-box",
                      position: "fixed",
                      top: searchText || searchText === "" ? 0 : -54,
                      backgroundColor: constants.mainColor,
                      width: "100%",
                      padding: "13px 7px",
                      display: "flex",
                      alignItems: "center",
                      zIndex: 2,
                      transition: ".3s ease-in-out",
                    }}
                  >
                    <button
                      onClick={() => {
                        filter({
                          subject: subjectFilterSelected,
                          searchText: false,
                        });
                      }}
                    >
                      <img
                        style={{ width: "20px" }}
                        src={leftArrow}
                        alt='close'
                      />

                      {/* <AntDesign name='arrowleft' size={24} color='black' /> */}
                    </button>
                    <input
                      ref={searchInputRef}
                      placeholder='Search...'
                      value={searchText ? searchText : ""}
                      onChange={(e) =>
                        filter({
                          subject: subjectFilterSelected,
                          searchText: e.target.value,
                        })
                      }
                      className='addnote-mobile-input search'
                      style={{
                        width: "80%",
                        background: "transparent",
                        outline: "none",
                        border: "none",
                        padding: "4px",
                        paddingBottom: "5px",
                      }}
                    />
                  </div>
                  <button
                    onMouseDown={() => setSearchText("")}
                    style={{ marginRight: 10 }}
                  >
                    <img style={{ width: "20px" }} src={search} alt='search' />
                  </button>
                </>
              )}
            </div>
            {!recycleBin ? (
              <Masonry
                className='masonry'
                // Provides the data for our grid items
                items={notesToShow}
                // Sets the minimum column width to 172px
                columnWidth={260}
                // Pre-renders 5 windows worth of content
                overscanBy={2}
                // This is the grid item component
                render={(props: any) =>
                  !props.data.placeholder ? (
                    <NoteBox
                      itemIndex={props.data.index}
                      editNote={(index) =>
                        setEditNoteNumber && setEditNoteNumber(index)
                      }
                      deleteNote={deleteNote}
                      {...props}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    >
                      placeholder
                    </div>
                  )
                }
              />
            ) : (
              <Masonry
                // Provides the data for our grid items
                items={notesToShow}
                // Sets the minimum column width to 172px
                columnWidth={260}
                // Pre-renders 5 windows worth of content
                overscanBy={2}
                // This is the grid item component
                render={(props: any) =>
                  !props.data.placeholder ? (
                    <NoteBox
                      recycleBin
                      itemIndex={props.data.index}
                      deleteNote={deleteNote}
                      {...props}
                    />
                  ) : (
                    <div
                      style={{
                        height: "200px",
                        opacity: 0,
                        pointerEvents: "none",
                      }}
                    >
                      placeholder
                    </div>
                  )
                }
              />
            )}
          </div>
        )
      ) : (
        <NoNotes />
      )}
    </>
  );
}

export const NoNotes = (props: { source?: any; text?: string }) => {
  const { source, text } = props;
  const location = useLocation();
  return (
    <div
      className='no-notes'
      style={{
        height:
          window.screen.width < 768
            ? "calc(100vh - 33px)"
            : `calc(100vh - ${
                location.pathname === "/recycle-bin" ? "0px" : "150px"
              })`,
      }}
    >
      <img src={source ? source : box} alt='empty' />
      <p>{text ? text : "No Notes yet"}</p>
    </div>
  );
};

const NoteBox = (props: {
  data: any;
  itemIndex: number;
  deleteNote: (index: any, id: any, note: any, type?: string) => void;
  editNote?: (index: number) => void;
  recycleBin?: boolean;
}) => {
  const { data: note, itemIndex, deleteNote, editNote, recycleBin } = props;
  return (
    <div
      key={note.id}
      style={{
        border: "2px solid #000",
        padding: 10,
        borderRadius: 10,
        margin: 10,
      }}
    >
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
          alt='date'
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
            wordBreak: "break-word",
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
            <img style={{ width: "30px" }} src={pencil} alt='edit' />
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
            <img
              style={{ height: 32, width: 32 }}
              src={restore}
              alt='restore'
            />
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
            <img style={{ width: "30px" }} src={deleteIcon} alt='delete' />
          ) : (
            <img
              style={{ width: "30px" }}
              src={softDeleteIcon}
              alt='soft delete'
            />
          )}
        </button>
      </div>
    </div>
  );
};
