import React, { useEffect, useState } from "react";
import {
  closeAllNotifications,
  scheduleAllNotifications,
  saveAndUpdate,
  setItem,
} from "../AppContext/AppContext";
import Dropdown from "../widgets/Dropdown";
import { useNavigate } from "react-router";
import { LogoAndVersion } from "../App";
import { logoInBase64 } from "../util/util";
import fbLogo from "../assets/icons/facebook.svg";

export default function Settings() {
  const [notifications, setNotifications] = useState<"On" | "Off">("Off");
  const [alertMsg, setAlertMsg] = useState("");

  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Settings | Never Forget";

    if (Notification.permission === "granted") {
      setItem(setNotifications, "notifications");
    } else {
      setNotifications("Off");
    }
  }, []);
  return (
    <div className='settings'>
      <Box
        heading='Turn On/Off Notifications'
        desc="This feature is experimental. It may not work as expected in your device. Usually it works fine with Chrome. And we don't spam."
        onMouseDown={(val: string) => {
          if (val === "On" && notifications !== "On") {
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
                  setAlertMsg("Scheduling notifications. Please wait...");
                  scheduleAllNotifications(setAlertMsg);
                  saveAndUpdate("notifications", setNotifications, "On");
                } catch (err) {
                  alert(
                    "Failed! Please try again using an updated version of chrome."
                  );
                  setAlertMsg(
                    "Failed! Please try again using an updated version of chrome."
                  );
                }
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
          navigate("/what-is-spaced-repetition");
        }}
      />
      {/* Share with 2 people and get 2 months ad free. We won't really track whether you shared our app or not, we'll just trust your words. */}
      <Box
        heading='Contact Us'
        desc='sandipsaha564@gmail.com'
        onMouseDown={(val: string) => {
          if (window.screen.width < 992) {
            window.open("mailto:sandipsaha564@gmail.com", "_blank");
          } else {
            window.open(
              "https://mail.google.com/mail/?view=cm&fs=1&to=sandipsaha564@gmail.com",
              "_blank"
            );
          }
        }}
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

      <div style={{ display: "flex", alignItems: "center" }}>
        <a
          href='https://www.facebook.com/www.neverforgetanything/'
          target='_blank'
        >
          <img
            style={{ width: 30, marginLeft: 10 }}
            src={fbLogo}
            alt='Facebook page'
          />
        </a>
        <span style={{ marginLeft: 10, marginBottom: 5 }}>
          neverforgetanything
        </span>
      </div>
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
    // shared,
    // setShared,
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
              {desc}kk
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
              {desc}ll
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

    window.scrollTo(0, 0);
  }, []);
  return (
    <div className='info-page'>
      <h2
        style={{ fontSize: 20, fontWeight: "bold", margin: 0, marginTop: 15 }}
      >
        Privacy Policy
      </h2>
      <p style={{ margin: "7px 0" }}>
        Sandip Saha built the Never Forget app as an Ad Supported app. This
        SERVICE is provided by Sandip at no cost and is intended for use as is.
        This page is used to inform visitors regarding my policies with the
        collection, use, and disclosure of Personal Information if anyone
        decided to use my Service. Never Forget does not collect any information
        from the user. But Never Forget use Google analytics and they may
        collect data as needed.{" "}
        <a href='https://policies.google.com/privacy?hl=en-US'>
          Google's privacy policy
        </a>
      </p>
      <h2
        style={{ fontSize: 20, fontWeight: "bold", margin: 0, marginTop: 15 }}
      >
        Security
      </h2>
      <p style={{ margin: "7px 0" }}>
        I value your trust in providing us your Personal Information, thus we
        are striving to use commercially acceptable means of protecting it. But
        remember that no method of transmission over the internet, or method of
        electronic storage is 100% secure and reliable, and I cannot guarantee
        its absolute security.
      </p>
      <h2
        style={{ fontSize: 20, fontWeight: "bold", margin: 0, marginTop: 15 }}
      >
        Links to Other Sites
      </h2>
      <p style={{ margin: "7px 0" }}>
        This Service may contain links to other sites. If you click on a
        third-party link, you will be directed to that site. Note that these
        external sites are not operated by me. Therefore, I strongly advise you
        to review the Privacy Policy of these websites. I have no control over
        and assume no responsibility for the content, privacy policies, or
        practices of any third-party sites or services.
      </p>
      <h2
        style={{ fontSize: 20, fontWeight: "bold", margin: 0, marginTop: 15 }}
      >
        Changes to This Privacy Policy
      </h2>
      <p style={{ margin: "7px 0" }}>
        I may update our Privacy Policy from time to time. Thus, you are advised
        to review this page periodically for any changes. I will notify you of
        any changes by posting the new Privacy Policy on this page.
      </p>
      <h2
        style={{ fontSize: 20, fontWeight: "bold", margin: 0, marginTop: 15 }}
      >
        Contact Us
      </h2>
      <p style={{ margin: "7px 0" }}>
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
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/freepik' title='Freepik'>
          Freepik
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/free-icon/calendar_425868?term=calender&page=2&position=48&related_item_id=425868'
          title='Vectors Market'
        >
          Vectors Market
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/authors/roundicons'
          title='Roundicons'
        >
          Roundicons
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/authors/pixelmeetup'
          title='Pixelmeetup'
        >
          Pixelmeetup
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/google' title='Google'>
          Google
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/authors/vectors-market'
          title='Vectors Market'
        >
          Vectors Market
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/srip' title='srip'>
          srip
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/eucalyp' title='Eucalyp'>
          Eucalyp
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/authors/smashicons'
          title='Smashicons'
        >
          Smashicons
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/monkik' title='monkik'>
          monkik
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a href='https://www.flaticon.com/authors/bqlqn' title='bqlqn'>
          bqlqn
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
      <div>
        Icons made by{" "}
        <a
          href='https://www.flaticon.com/authors/pixel-perfect'
          title='Pixel perfect'
        >
          Pixel perfect
        </a>{" "}
        from{" "}
        <a href='https://www.flaticon.com/' title='Flaticon'>
          www.flaticon.com
        </a>
      </div>
    </div>
  );
};

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
