import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import {
  AppProvider,
  AppContext,
  EnumSpacedRepetition,
} from "./AppContext/AppContext";
import "./App.css";
import {
  KnowSpacedRepetition,
  VideoScreen,
} from "./screens/Questions/KnowSpacedRepetition";
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

// import Home from "./screens/Home";
// import AllNotes from "./screens/AllNotes";
// // import {
// //   AppContext,
// //   AppProvider,
// //   EnumSpacedRepetition,
// // } from "./AppContext/AppContext";
// import {
//   KnowSpacedRepetition,
//   VideoScreen,
// } from "./screens/Questions/KnowSpacedRepetition";
// import AddNote from "./screens/AddNote";
// import Modal from "./widgets/Modal";
// import Settings from "./screens/Settings";
import { add, differenceInSeconds, startOfDay } from "date-fns";
import { logoInBase64 } from "./util/util";
import NotFound from "./screens/NotFound";
// import { AppProvider, AppContext, EnumSpacedRepetition } from "./AppContext/AppContext";
export default function App() {
  // if (fontLoaded) {
  return (
    <AppProvider>
      <BrowserRouter>
        <Main />
      </BrowserRouter>
    </AppProvider>
  );
  // } else {
  //   return (
  //     <View>
  //       <AppLoading
  //         startAsync={getFonts}
  //         onFinish={() => setFontLoaded(true)}
  //       />
  //       {/* <Text>hello world!</Text> */}
  //     </View>
  //   );
  // }
}

export const rewardMsgs = [
  "Well Done! 👍",
  "Bravo! 🌟",
  "Keep up the good work! 🔥",
  "Awesome! 👍",
  "Great! 🌟",
  "Hats off! 👍",
  "Way to go! 🚀",
  "You rock! 🎸",
  "Nice going! 🚶",
  "Good job! 💼",
];
// "Congrats",

const Main = () => {
  const [rewardMsgShow, setRewardMsgShow] = useState(false);
  const [editNoteNumber, setEditNoteNumber] = useState(-1);
  const [addNoteActive, setAddNoteActive] = useState<boolean>(false);
  const {
    states: { knowSpacedRepetition, isAnyNoteActive },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path='/what-is-spaced-repetition' element={<VideoScreen />} />
        {/* <Route path='/*' element={<NotFound />} /> */}
      </Routes>
      {knowSpacedRepetition === EnumSpacedRepetition.No ? (
        <div>
          <Routes>
            <Route path='/' element={<KnowSpacedRepetition />} />
            {location.pathname !== "/what-is-spaced-repetition" && (
              <Route path='/*' element={<NotFound />} />
            )}
          </Routes>
        </div>
      ) : (
        // <Stack.Navigator>
        //   <Stack.Screen
        //     name='KnowSpacedRepetition'
        //     component={KnowSpacedRepetition}
        //     options={{ title: "", headerShown: false }}
        //   />
        //   <Stack.Screen
        //     name='VideoScreen'
        //     component={VideoScreen}
        //     options={{ title: "" }}
        //   />
        // </Stack.Navigator>
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
                    <img style={{ width: "21px" }} src={home} alt='' />
                    <span>Home</span>
                  </Link>
                  <Link
                    className='nav-link'
                    style={{
                      color:
                        location.pathname === "/all-notes" ? "blue" : "#000",
                      backgroundColor:
                        location.pathname === "/all-notes"
                          ? window.screen.width < 768
                            ? "#e6e6e6"
                            : "#d8d8d8"
                          : "transparent",
                    }}
                    to='/all-notes'
                  >
                    <img style={{ width: "21px" }} src={notes} alt='' />
                    <span>All Notes</span>
                  </Link>
                  <Link
                    className='nav-link'
                    style={{
                      color:
                        location.pathname === "/settings" ? "blue" : "#000",
                      backgroundColor:
                        location.pathname === "/settings"
                          ? window.screen.width < 768
                            ? "#e6e6e6"
                            : "#d8d8d8"
                          : "transparent",
                    }}
                    to='/settings'
                  >
                    <img style={{ width: "21px" }} src={settings} alt='' />
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
                  <Route
                    path='/recycle-bin'
                    element={<AllNotes recycleBin />}
                  />
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
                  {(location.pathname === "/" ||
                    location.pathname === "/all-notes") && (
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
              text={rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)]}
              center
              color='#3178c6'
            />
          )}
        </div>
      )}
    </>
  );
};

export const LogoAndVersion = () => {
  return (
    <div
      style={{ textAlign: "center", paddingTop: "15px" }}
      className='logo-and-version'
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img src={logoInBase64} alt='Never Forget Logo' />
        <span
          style={{
            fontFamily: "Staatliches, Arial",
            lineHeight: 1,
            marginLeft: "7px",
            marginTop: "9px",
          }}
        >
          Never Forget
        </span>
      </div>
      <div style={{ letterSpacing: "1px", margin: "5px 0 16px 0" }}>v1.0.0</div>
    </div>
  );
};
// fontFamily: "staatliches-regular",

const noNotesNotification = async (isAnyNoteActive: boolean) => {
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
      Notification.requestPermission().then((permission) => {
        if (permission !== "granted") {
          alert("you need to allow push notifications");
        } else {
          reg?.showNotification("Your Note box is empty 📁", {
            tag: "SS-EmptyNoteBox", // a unique ID
            body: "Add notes so you Never Forget what's important to you!", // content of the push notification
            // @ts-ignore
            // showTrigger: new TimestampTrigger(new Date().getTime() + trigger), // set the time for the push notification
            showTrigger: new TimestampTrigger(new Date().getTime() + trigger), // set the time for the push notification
            data: {
              url: window.location.href, // pass the current url to the notification
            },
            badge: "../assets/icons/done.svg",
            icon: "../assets/icons/done.svg",
          });
        }
      });
    }
  }
};
