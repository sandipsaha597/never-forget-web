import { add, differenceInSeconds, format } from "date-fns";
import React, { useState, createContext, useEffect } from "react";
import { isAnyNoteActiveFunc, logoInBase64 } from "../util/util";

export const AppContext = createContext<any>({});

export enum EnumSpacedRepetition {
  No = "no",
  Yes = "yes",
}

export default function AppProvider(props: any) {
  const [allNotes, setAllNotes] = useState<IAllNotes[]>([]);
  const [isAnyNoteActive, setIsAnyNoteActive] = useState<boolean | null>(null);

  const [subs, setSubs] = useState<{ id: string; title: string }[]>([
    {
      id: "1341284821",
      title: "English",
    },
    {
      id: "9245184821",
      title: "Math",
    },
    {
      id: "8281951025",
      title: "Geography",
    },
    {
      id: "0150102010",
      title: "History",
    },
    {
      id: "0131561052",
      title: "--None--",
    },
  ]);

  const contextValue = {
    states: {
      allNotes,
      subs,
      isAnyNoteActive,
    },
    constants: {
      rewardMsgTimeoutTime: 2000,
      externalLinkColor: "#296ab3",
    },
    actions: {
      setAllNotes(values: IAllNotes[], save: boolean = true) {
        try {
          if (save && typeof Storage !== "undefined") {
            localStorage.setItem("allNotes", JSON.stringify(values));
          }
          setAllNotes(values);
        } catch (err) {
          alert(err);
          console.log("err", err);
        }
      },
      setSubs(val: { id: string; title: string }[]) {
        saveAndUpdate("subs", setSubs, val);
      },
      setIsAnyNoteActive(val: boolean) {
        saveAndUpdate("isAnyNoteActive", setIsAnyNoteActive, val);
      },
      // setIsRecycleBinEmpty(val: boolean) {
      //   saveAndUpdate("isRecycleBinEmpty", setIsRecycleBinEmpty, val);
      // },
    },
  };

  // localStorage.removeItem("knowSpacedRepetition");
  // localStorage.removeItem("firstNote");
  // localStorage.removeItem("allNotes");
  // closeAllNotifications();
  // localStorage.removeItem("isAnyNoteActive");
  // localStorage.removeItem("isRecycleBinEmpty");
  // localStorage.removeItem("subs");
  // localStorage.removeItem("notifications");

  const retrieveAllNotesDeleteAndRecycleBinStatus = () => {
    if (isAnyNoteActive === null) {
      const storedIsAnyNoteActive = localStorage.getItem("isAnyNoteActive");
      if (
        storedIsAnyNoteActive === "false" ||
        storedIsAnyNoteActive === "true"
      ) {
        setIsAnyNoteActive(JSON.parse(storedIsAnyNoteActive));
      } else {
        isAnyNoteActiveFunc(allNotes, contextValue.actions.setIsAnyNoteActive);
      }
    }
  };
  useEffect(() => {
    setItem(setAllNotes, "allNotes");
    retrieveAllNotesDeleteAndRecycleBinStatus();
    setItem(setSubs, "subs");
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

export const saveAndUpdate = (save: string, update: any, value: any) => {
  try {
    localStorage.setItem(save, JSON.stringify(value));
    update(value);
  } catch (err) {
    alert(err);
    console.log("err", err);
  }
};
export const setItem = (toSet: any, itemName: string) => {
  const value = localStorage.getItem(itemName);
  if (value) {
    if (itemName === "allNotes") {
      const tempValue = JSON.parse(value);
      tempValue.forEach((v: any) => {
        v.show = true;
      });
      toSet(tempValue);
    } else {
      toSet(JSON.parse(value) as any);
    }
  }
};
export const closeAllNotifications = async () => {
  const reg = await navigator.serviceWorker.getRegistration();
  const notifications = await reg?.getNotifications({
    // @ts-ignore
    includeTriggered: true,
  });
  notifications?.forEach((notification) => notification.close());
};

export const scheduleAllNotifications = async (done: any) => {
  try {
    closeAllNotifications();
    const reg = await navigator.serviceWorker.getRegistration();
    const storedAllNotes = JSON.parse(localStorage.getItem("allNotes") || "[]");
    const structuredAllNotes: any = {};

    storedAllNotes.forEach((note: any) => {
      if (note.deleted) return;
      for (let i = note.revisionNumber + 1; i < note.revisions.length; i++) {
        const date = note.revisions[i];
        if (structuredAllNotes[date]) {
          structuredAllNotes[date] =
            structuredAllNotes[date] + "\n" + "🗒️ " + note.title + " 📖";
        } else {
          structuredAllNotes[date] = "🗒️ " + note.title + " 📖";
        }
      }
      // v.revisions.forEach((date: any) => {
      //   if (structuredAllNotes[date]) {
      //     structuredAllNotes[date] =
      //       structuredAllNotes[date] + "\n" + "🗒️ " + v.title + " 📖";
      //   } else {
      //     structuredAllNotes[date] = "🗒️ " + v.title + " 📖";
      //   }
      // });
    });

    for (let i in structuredAllNotes) {
      const trigger =
        differenceInSeconds(add(new Date(i), { hours: 6 }), new Date()) * 1000;
      if (Math.sign(trigger) === 1) {
        reg?.showNotification(
          "Review your notes, so you Never Forget them! 📔",
          {
            tag: format(new Date(i), "dd-MM-yyyy"), // a unique ID
            body: structuredAllNotes[i], // content of the push notification
            // @ts-ignore
            showTrigger: new TimestampTrigger(new Date().getTime() + trigger), // set the time for the push notification
            badge: logoInBase64,
            icon: logoInBase64,
          }
        );
      }
    }

    done("Done!");
  } catch (err) {
    console.log(err);
    done("Please try again using an updated version of chrome");
  }
};
// interfaces

export interface IAllNotes {
  id: string;
  title: string;
  subject: string;
  desc: string;
  pattern: number[];
  revisions: any;
  revisionNumber: number;
  deleted: boolean;
  show: boolean;
}
