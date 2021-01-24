import React, { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Link, useLocation } from "react-router-dom";
import { Route, Routes } from "react-router-dom";

import { AppContext } from "./AppContext/AppContext";
import "./App.css";
import Home from "./screens/Home";
import AddNote from "./screens/AddNote";
import AddNoteMobile from "./screens/AddNoteMobile";
import AllNotes from "./screens/AllNotes";
import Modal from "./widgets/Modal";
import home from "./assets/icons/house.svg";
import notes from "./assets/icons/notes.svg";
import settings from "./assets/icons/settings.svg";
import Settings, { PrivacyPolicy, Credits } from "./screens/Settings";
import plus from "../src/assets/icons/plus.svg";
import { add, differenceInSeconds, startOfDay } from "date-fns";
import { constants, logoInBase64 } from "./util/util";
import NotFound from "./screens/NotFound";
import { LogoAndVersion } from "./widgets/LogoAndVersion";

export default function Main() {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [editNoteNumber, setEditNoteNumber] = useState(-1);
  const [addNoteActive, setAddNoteActive] = useState<boolean>(false);
  const {
    states: { isAnyNoteActive },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem("firstNote") === "false") {
      noNotesNotification(isAnyNoteActive);
    }
  }, [isAnyNoteActive]);

  return (
    <>
      <div className='container'>
        {location.pathname !== "/what-is-spaced-repetition" && (
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <nav className='nav'>
              <div className='menu'>
                <Link
                  className='nav-link'
                  style={{
                    color: location.pathname === "/" ? "blue" : "#000",
                    backgroundColor:
                      location.pathname === "/"
                        ? window.screen.width < 768
                          ? "#e6e6e6"
                          : "#d8d8d8"
                        : "transparent",
                  }}
                  to='/'
                >
                  <img style={{ width: "21px" }} src={home} alt='home' />
                  <span>Home</span>
                </Link>
                <Link
                  className='nav-link'
                  style={{
                    color: location.pathname === "/all-notes" ? "blue" : "#000",
                    backgroundColor:
                      location.pathname === "/all-notes"
                        ? window.screen.width < 768
                          ? "#e6e6e6"
                          : "#d8d8d8"
                        : "transparent",
                  }}
                  to='/all-notes'
                >
                  <img style={{ width: "21px" }} src={notes} alt='all notes' />
                  <span>All Notes</span>
                </Link>
                <Link
                  className='nav-link'
                  style={{
                    color: location.pathname === "/settings" ? "blue" : "#000",
                    backgroundColor:
                      location.pathname === "/settings"
                        ? window.screen.width < 768
                          ? "#e6e6e6"
                          : "#d8d8d8"
                        : "transparent",
                  }}
                  to='/settings'
                >
                  <img
                    style={{ width: "21px" }}
                    src={settings}
                    alt='settings'
                  />
                  <span>Settings</span>
                </Link>
              </div>
              {window.screen.width >= 768 && <LogoAndVersion />}
            </nav>

            <main>
              {window.screen.width >= 768 &&
                (location.pathname === "/" ||
                  location.pathname === "/all-notes") && (
                  <AddNote
                    editNoteNumber={editNoteNumber}
                    setEditNoteNumber={setEditNoteNumber}
                    noteAdded={() => {
                      setRewardMsgShow(true);
                      setTimeout(() => {
                        setRewardMsgShow(false);
                      }, rewardMsgTimeoutTime + 500);
                    }}
                  />
                )}
              <Routes>
                <Route path='/' element={<Home />} />
                <Route
                  path='/all-notes'
                  element={<AllNotes setEditNoteNumber={setEditNoteNumber} />}
                />
                <Route path='/settings' element={<Settings />} />
                <Route path='/recycle-bin' element={<AllNotes recycleBin />} />
                <Route path='/privacy-policy' element={<PrivacyPolicy />} />
                <Route path='/credits' element={<Credits />} />
                <Route path='/*' element={<NotFound />} />
              </Routes>
            </main>
            {window.screen.width < 768 && (
              <>
                <AddNoteMobile
                  editNoteNumber={editNoteNumber}
                  setEditNoteNumber={setEditNoteNumber}
                  noteAdded={() => {
                    setRewardMsgShow(true);
                    setTimeout(() => {
                      setRewardMsgShow(false);
                    }, rewardMsgTimeoutTime + 500);
                  }}
                  addNoteActive={addNoteActive}
                  setAddNoteActive={setAddNoteActive}
                />
                {(window.location.pathname === "/" ||
                  window.location.pathname === "/all-notes") && (
                  <button
                    onMouseDown={() => setAddNoteActive(true)}
                    style={{ position: "fixed", bottom: 50, right: 5 }}
                  >
                    <img style={{ width: "60px" }} src={plus} alt='add' />
                  </button>
                )}
              </>
            )}
          </div>
        )}
        {rewardMsgShow && (
          <Modal
            text={
              constants.rewardMsgs[
                Math.floor(Math.random() * constants.rewardMsgs.length)
              ]
            }
            center
            color={constants.mainColor}
          />
        )}
      </div>
    </>
  );
}

const noNotesNotification = async (isAnyNoteActive: boolean) => {
  if (JSON.parse(localStorage.getItem("notifications") || "") !== "On") {
    return;
  }
  const reg = await navigator.serviceWorker.getRegistration();
  const allNotifications = await reg?.getNotifications({
    // @ts-ignore
    includeTriggered: true,
  });
  const noNotesNotification = allNotifications?.find(
    (v) => v.tag === "SS-EmptyNoteBox"
  );
  if (isAnyNoteActive) {
    noNotesNotification?.close();
  } else if (isAnyNoteActive === false) {
    if (!noNotesNotification) {
      const trigger =
        differenceInSeconds(
          add(startOfDay(new Date()), { days: 1, hours: 6 }),
          new Date()
        ) * 1000;
      if (Notification.permission !== "granted") {
      } else {
        reg?.showNotification("Your Note box is empty 📁", {
          tag: "SS-EmptyNoteBox", // a unique ID
          body: "Add notes so you Never Forget what's important to you!", // content of the push notification
          // @ts-ignore
          showTrigger: new TimestampTrigger(new Date().getTime() + trigger), // set the time for the push notification
          badge: logoInBase64,
          icon: logoInBase64,
        });
      }
    }
  }
};
