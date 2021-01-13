import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
import AllNotes from "./screens/AllNotes";
import Modal from "./widgets/Modal";
import home from "./assets/icons/house.svg";
import notes from "./assets/icons/notes.svg";
import settings from "./assets/icons/settings.svg";
import Settings, { PrivacyPolicy, Credits } from "./screens/Settings";

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
  const isAddNoteOpen = useRef(false);
  const {
    states: { knowSpacedRepetition, allNotes, isAnyNoteActive },
    constants: { rewardMsgTimeoutTime },
  } = useContext<any>(AppContext);

  //important
  // useEffect(() => {
  //   if (!isAnyNoteActive && isAnyNoteActive !== null) {
  //     setTimeout(() => {
  //       showAddNote(0);
  //     }, 1000);
  //   }
  // }, [knowSpacedRepetition]);
  useEffect(() => {
    noNotesNotification(isAnyNoteActive);
  }, [isAnyNoteActive]);

  const location = useLocation();
  return (
    <div className='container'>
      <Routes>
        <Route path='/what-is-spaced-repetition' element={<VideoScreen />} />
      </Routes>
      {knowSpacedRepetition === EnumSpacedRepetition.No ? (
        <div>
          <Routes>
            <Route path='/' element={<KnowSpacedRepetition />} />
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
        <>
          <div
            style={{
              display: "flex",
              width: "100%",
            }}
          >
            <div
              className='nav'
              style={{
                width: "20%",
                height: "100vh",
                background: "#e5e5e3",
                position: "sticky",
                top: 0,
                left: 0,
              }}
            >
              <Link
                className='nav-link'
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: location.pathname === "/" ? "blue" : "#000",
                  padding: "10px 20px",
                }}
                to='/'
              >
                <img
                  style={{ width: "21px", marginRight: "10px" }}
                  src={home}
                  alt=''
                />{" "}
                <span>Home</span>
              </Link>
              <Link
                className='nav-link'
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: location.pathname === "/all-notes" ? "blue" : "#000",
                  padding: "10px 20px",
                }}
                to='/all-notes'
              >
                <img
                  style={{ width: "21px", marginRight: "10px" }}
                  src={notes}
                  alt=''
                />
                <span>All Notes</span>
              </Link>
              <Link
                className='nav-link'
                style={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: location.pathname === "/settings" ? "blue" : "#000",
                  padding: "10px 20px",
                }}
                to='/settings'
              >
                <img
                  style={{ width: "21px", marginRight: "10px" }}
                  src={settings}
                  alt=''
                />
                <span>Settings</span>
              </Link>
            </div>
            <div style={{ width: "80%", paddingBottom: "450px" }}>
              {(location.pathname === "/" ||
                location.pathname === "/all-notes") && (
                <AddNote
                  editNoteNumber={editNoteNumber}
                  setEditNoteNumber={() => false}
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
              </Routes>
            </div>
          </div>
          {/* <View
              style={{
                borderRadius: 50,
                position: "absolute",
                bottom: 50,
                right: 10,
                // transform: [{ translateX: -28 }],
              }}
            >
              <TouchableOpacity onPress={() => showAddNote(0)}>
                <Ionicons name='ios-add-circle' size={70} color='#3178c6' />
              </TouchableOpacity>
            </View> */}
          {rewardMsgShow && (
            <Modal
              text={rewardMsgs[Math.floor(Math.random() * rewardMsgs.length)]}
              noChat
              center
              color='#3178c6'
            />
          )}
        </>
      )}
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
      const trigger = differenceInSeconds(
        add(startOfDay(new Date()), { days: 1, hours: 6 }),
        new Date()
      );
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
