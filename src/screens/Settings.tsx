import React, { useContext, useEffect, useState } from "react";
import {
  AppContext,
  EnumSpacedRepetition,
  closeAllNotifications,
  scheduleAllNotifications,
  saveAndUpdate,
  setItem,
} from "../AppContext/AppContext";
import AllNotes from "./AllNotes";
import { add, differenceInSeconds, format } from "date-fns";
import Dropdown from "../widgets/Dropdown";
import { Route, Routes, useNavigate } from "react-router";
import { LogoAndVersion } from "../App";
import { logoInBase64, schedulePushNotification } from "../util/util";

export default function Settings() {
  const [page, setPage] = useState<string>("none");
  const [shared, setShared] = useState("none");
  const [
    rescheduleNotificationsProgress,
    setRescheduleNotificationsProgress,
  ] = useState<any>(false);
  const [notifications, setNotifications] = useState<"On" | "Off">("Off");
  const [alertMsg, setAlertMsg] = useState("");
  const {
    actions: { setKnowSpacedRepetition },
  } = useContext<any>(AppContext);

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Settings | Never Forget";

    if (Notification.permission === "granted") {
      setItem(setNotifications, "notifications");
    } else {
      setNotifications("Off");
    }
  }, []);
  console.log("new");
  return (
    <div className='settings'>
      {/* <Box
        heading='Reschedule Notifications'
        desc='Click here if your phone/tab was rebooted/restarted so you can get notifications to review your notes correctly.'
        highlight
        onMouseDown={(val: string) => {
          rescheduleNotifications(setRescheduleNotificationsProgress);
          setPage(val);
        }}
      /> */}
      <Box
        heading='Turn On/Off Notifications'
        desc="This feature is experimental. It may not work as expected in your device. Usually it works fine with Chrome. And we don't spam."
        onMouseDown={(val: string) => {
          if (val === "On" && notifications !== "On") {
            Notification.requestPermission().then((permission) => {
              alert(permission);
              if (permission === "granted") {
                const greeting = new Notification("Notifications are on 👍", {
                  body:
                    "If you have revision(s), You'll receive a notification of your revision(s) at 6:00am",
                  icon: logoInBase64,
                });
                setAlertMsg("Scheduling notifications. Please wait...");
                scheduleAllNotifications(setAlertMsg);
                saveAndUpdate("notifications", setNotifications, "On");
              } else if (permission === "denied") {
                setAlertMsg("You have blocked notification permission");
                saveAndUpdate("notifications", setNotifications, "Off");
              } else if (permission === "default") {
                setAlertMsg(
                  "Please allow notification permission to receive notifications"
                );
                saveAndUpdate("notifications", setNotifications, "Off");
              }
            });
          } else if (val === "Off") {
            closeAllNotifications();
            saveAndUpdate("notifications", setNotifications, "Off");
          }
        }}
        boxInfo={{ notifications: notifications, alertMsg: alertMsg }}
        highlight
      />

      <Box
        heading='Backup'
        desc='Backup your data on google drive or in downloadable CSV or both. So you can switch device and still have your notes and data.'
        comingSoon
      />
      <Box
        heading='Remove Ads'
        desc='Remove ads and have focused and distraction free study sessions.'
        comingSoon
      />
      <Box
        heading='Reminder Time'
        desc='Reminder time of notes are currently fixed at 6:00am. It will be modifiable soon.'
        comingSoon
      />
      <Box
        heading='Recycle Bin'
        desc='Your deleted notes from All Notes will appear here. You can delete them permanently or restore from here.'
        onMouseDown={(val: string) => {
          navigate("/recycle-bin");
        }}
      />
      <Box
        heading='What is Spaced Repetition?'
        onMouseDown={(val: string) => {
          // setKnowSpacedRepetition(EnumSpacedRepetition.No);
          navigate("/what-is-spaced-repetition");
        }}
      />
      {/* Share with 2 people and get 2 months ad free. We won't really track whether you shared our app or not, we'll just trust your words. */}
      <Box
        heading='Contact Us'
        onMouseDown={(val: string) =>
          // Linking.openURL("mailto:sandipsaha564@gmail.com")
          // window.location.href = "mailto:mail@example.org"
          // window.open("mailto:sandipsaha564@gmail.com", "_blank")
          window.open(
            "https://mail.google.com/mail/?view=cm&fs=1&to=sandipsaha564@gmail.com",
            "_blank"
          )
        }
      />
      <Box
        heading='Privacy Policy'
        onMouseDown={(val: string) => {
          navigate("/privacy-policy");
        }}
      />
      <Box
        heading='Credits'
        onMouseDown={(val: string) => {
          navigate("/credits");
        }}
      />
      {window.screen.width < 768 && (
        <div style={{ width: "100vw" }}>
          <LogoAndVersion />
        </div>
      )}
    </div>
  );
}

const Box = (props: iBox) => {
  const {
    heading,
    desc,
    comingSoon,
    onMouseDown,
    highlight,
    shared,
    setShared,
    boxInfo,
  } = props;
  return (
    <div
      style={{
        padding: "0 8px",
        marginBottom: 10,
        backgroundColor: highlight ? "#27ae60" : "transparent",
        textAlign: "left",
      }}
    >
      {heading === "Turn On/Off Notifications" ? (
        <div
          style={{
            width: "100%",
            padding: "10px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 20,
                  color: highlight ? "#fff" : "#000",
                  margin: 0,
                  fontWeight: "normal",
                }}
              >
                {heading}
              </h3>

              <Dropdown
                title='Notifications'
                options={[
                  { id: "3418704314", title: "On" },
                  { id: "3849189021", title: "Off" },
                ]}
                selected={boxInfo?.notifications}
                setSelected={(val) => onMouseDown(val)}
              />
              {boxInfo?.alertMsg && (
                <p
                  style={{
                    margin: 0,
                    marginBottom: "7px",
                    fontSize: 13,
                    color: "#372f28",
                  }}
                >
                  {boxInfo?.alertMsg}
                </p>
              )}
              {/* {Notification.permission === "granted" && boxInfo.notifications === 'On'
                    ? "Notifications are active."
                    : Notification.permission === "denied" && 
                    ? "You have blocked notification permission."
                    : Notification.permission === "default"
                    ? "Please allow notification permission to receive notifications."
                    : null} */}
            </div>
          </div>
          {desc && (
            <p
              style={{
                color: highlight ? "#fff" : "#000",
                paddingBottom: highlight ? 6 : 0,
                margin: 0,
                textAlign: "left",
              }}
            >
              {desc}
            </p>
          )}
          {comingSoon && (
            <p style={{ color: "red", textAlign: "left", margin: 0 }}>
              coming soon
            </p>
          )}
        </div>
      ) : (
        <button
          disabled={comingSoon}
          onMouseDown={() => onMouseDown(heading)}
          style={{
            width: "100%",
            opacity: comingSoon ? 0.5 : 1,
            padding: "10px 0",
            cursor: comingSoon ? "no-drop" : "pointer",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3
                style={{
                  fontSize: 20,
                  color: highlight ? "#fff" : "#000",
                  margin: 0,
                  fontWeight: "normal",
                }}
              >
                {heading}
              </h3>
            </div>
            {heading === "Reminder Time" && (
              <p style={{ fontSize: 20, margin: 0 }}>6:00 am</p>
            )}
          </div>
          {desc && (
            <p
              style={{
                color: highlight ? "#fff" : "#000",
                paddingBottom: highlight ? 6 : 0,
                margin: 0,
                textAlign: "left",
              }}
            >
              {desc}
            </p>
          )}
          {comingSoon && (
            <p style={{ color: "red", textAlign: "left", margin: 0 }}>
              coming soon
            </p>
          )}
        </button>
      )}
      {/* {heading === "Share" && shared === "I shared" ? (
        <Button
          title='I shared'
          onMouseDown={() => setShared && setShared("I didn't shared")}
        />
      ) : heading === "Share" && shared === "I didn't shared" ? (
        <>
          <p style={{ paddingHorizontal: 20 }}>
            Thanks for supporting us ❤️ Your gift is active 🎁{" "}
          </p>
          <Button
            title="I didn't Shared"
            color='red'
            onMouseDown={() => setShared && setShared("none")}
          />
        </>
      ) : (
        false
      )} */}
    </div>
  );
};

export const PrivacyPolicy = () => {
  useEffect(() => {
    document.title = "Privacy Policy | Never Forget";
  }, []);
  return (
    <div className='info-page'>
      <h1 style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Privacy Policy
      </h1>
      <p>
        Sandip built the Never Forget app as an Ad Supported app. This SERVICE
        is provided by Sandip at no cost and is intended for use as is. This
        page is used to inform visitors regarding my policies with the
        collection, use, and disclosure of Personal Information if anyone
        decided to use my Service. If you choose to use my Service, then you
        agree to the collection and use of information in relation to this
        policy. The Personal Information that I collect is used for providing
        and improving the Service. I will not use or share your information with
        anyone except as described in this Privacy Policy. The terms used in
        this Privacy Policy have the same meanings as in our Terms and
        Conditions, which is accessible at Never Forget unless otherwise defined
        in this Privacy Policy.
      </p>
      <p
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginTop: 15,
        }}
      >
        Information Collection and Use
      </p>
      <p>
        For a better experience, while using our Service, I may require you to
        provide us with certain personally identifiable information. The
        information that I request will be retained on your device and is not
        collected by me in any way. The app does use third party services that
        may collect information used to identify you. Link to privacy policy of
        third party service providers used by the app *
        [AdMob](https://support.google.com/admob/answer/6128543?hl=en)
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Log Data
      </p>
      <p>
        I want to inform you that whenever you use my Service, in a case of an
        error in the app I collect data and information (through third party
        products) on your phone called Log Data. This Log Data may include
        information such as your device Internet Protocol (“IP”) address, device
        name, operating system version, the configuration of the app when
        utilizing my Service, the time and date of your use of the Service, and
        other statistics.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>Cookies</p>
      <p>
        Cookies are files with a small amount of data that are commonly used as
        anonymous unique identifiers. These are sent to your browser from the
        websites that you visit and are stored on your device's internal memory.
        This Service does not use these “cookies” explicitly. However, the app
        may use third party code and libraries that use “cookies” to collect
        information and improve their services. You have the option to either
        accept or refuse these cookies and know when a cookie is being sent to
        your device. If you choose to refuse our cookies, you may not be able to
        use some portions of this Service. **Service Providers** I may employ
        third-party companies and individuals due to the following reasons: * To
        facilitate our Service; * To provide the Service on our behalf; * To
        perform Service-related services; or * To assist us in analyzing how our
        Service is used. I want to inform users of this Service that these third
        parties have access to your Personal Information. The reason is to
        perform the tasks assigned to them on our behalf. However, they are
        obligated not to disclose or use the information for any other purpose.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Security
      </p>
      <p>
        I value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and I cannot guarantee
        its absolute security.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Links to Other Sites
      </p>
      <p>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites are not operated by me. Therefore, I strongly advise you
        to review the Privacy Policy of these websites. I have no control over
        and assume no responsibility for the content, privacy policies, or
        practices of any third-party sites or services.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Children’s Privacy
      </p>
      <p>
        These Services do not address anyone under the age of 13. I do not
        knowingly collect personally identifiable information from children
        under 13. In the case I discover that a child under 13 has provided me
        with personal information, I immediately delete this from our servers.
        If you are a parent or guardian and you are aware that your child has
        provided us with personal information, please contact me so that I will
        be able to do necessary actions.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Changes to This Privacy Policy
      </p>
      <p>
        I may update our Privacy Policy from time to time. Thus, you are advised
        to review this page periodically for any changes. I will notify you of
        any changes by posting the new Privacy Policy on this page.
      </p>
      <p style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Contact Us
      </p>
      <p>
        If you have any questions or suggestions about my Privacy Policy, do not
        hesitate to contact me at sandipsaha564@gmail.com. This privacy policy
        page was created at
        [privacypolicytemplate.net](https://privacypolicytemplate.net) and
        modified/generated by [App Privacy Policy
        Generator](https://app-privacy-policy-generator.nisrulz.com/)
      </p>
    </div>
  );
};

export const Credits = () => {
  useEffect(() => {
    document.title = "Settings | Never Forget";
  }, []);
  return (
    <div className='info-page'>
      <h2 style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>
        Developer
      </h2>
      <p>Sandip Saha</p>
      <h2 style={{ fontSize: 20, fontWeight: "bold", marginTop: 15 }}>Icons</h2>
      <p>Icon made by Vectors Market from www.flaticon.com</p>
      <p>Icon made by Freepik from www.flaticon.com</p>
      <p>Icon made by ultimatearm from www.flaticon.com</p>
      <p>Icon made by Pixelmeetup from www.flaticon.com</p>
      <p>Icon made by Smashicons from www.flaticon.com</p>
      <p>Icon made by Eucalyp from www.flaticon.com</p>
    </div>
  );
};

// const rescheduleNotifications = (setRescheduleNotificationsProgress: any) => {
//   Notifications.getAllScheduledNotificationsAsync().then((allNotifications) => {
//     const allNotificationsLength = allNotifications.length;
//     allNotifications.forEach(async (v, i) => {
//       if (!v.identifier.startsWith("SS")) {
//         const body = v.content.body;
//         const revisionDate = () => {
//           let dateArray = v.identifier.split("-");
//           return new Date(
//             parseInt(dateArray[2]),
//             parseInt(dateArray[1]) - 1,
//             parseInt(dateArray[0])
//           );
//         };
//         const trigger = differenceInSeconds(
//           // add(startOfDay(new Date()), { days: 0, hours: 13, minutes: 11 }),
//           // add(new Date(note.revisions[0]), { hours: 14, minutes: 18 }),
//           add(revisionDate(), { hours: 6 }),
//           new Date()
//         );
//         await Notifications.scheduleNotificationAsync({
//           content: {
//             title: "Review your notes, so you Never Forget them! 📔",
//             body: body ?? "Something went wrong",
//             data: { data: "goes here" },
//           },
//           identifier: format(revisionDate(), "dd-MM-yyyy"),
//           trigger: { seconds: trigger },
//         });

//         if (i + 1 >= allNotificationsLength) {
//           setRescheduleNotificationsProgress(false);
//         } else {
//           setRescheduleNotificationsProgress({
//             index: i + 1,
//             length: allNotificationsLength,
//           });
//         }
//       }
//     });
//   });
// };

// interfaces

interface iBox {
  heading?: string;
  desc?: string;
  comingSoon?: boolean;
  onMouseDown?: any;
  highlight?: boolean;

  shared?: string;
  setShared?: (val: string) => void;

  boxInfo?: any;
}
