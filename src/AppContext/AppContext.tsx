import { add, differenceInSeconds, format } from "date-fns";
import React, { useState, createContext, useEffect } from "react";
import {
  isAnyNoteActiveFunc,
  isRecycleBinEmptyFunc,
  logoInBase64,
} from "../util/util";

export const AppContext = createContext<any>({});

export enum EnumSpacedRepetition {
  No = "no",
  Yes = "yes",
}

export function AppProvider(props: any) {
  const [
    knowSpacedRepetition,
    setKnowSpacedRepetition,
  ] = useState<EnumSpacedRepetition>(EnumSpacedRepetition.No);
  const [allNotes, setAllNotes] = useState<IAllNotes[]>([]);
  const [isAnyNoteActive, setIsAnyNoteActive] = useState<boolean | null>(null);
  const [isRecycleBinEmpty, setIsRecycleBinEmpty] = useState<boolean | null>(
    null
  );

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

  // refs

  const contextValue = {
    states: {
      knowSpacedRepetition,
      allNotes,
      subs,
      isAnyNoteActive,
      isRecycleBinEmpty,
    },
    constants: {
      rewardMsgTimeoutTime: 2000,
      mainColor: "#3178c6",
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
      setKnowSpacedRepetition(val: EnumSpacedRepetition) {
        saveAndUpdate("knowSpacedRepetition", setKnowSpacedRepetition, val);
      },
      setIsAnyNoteActive(val: boolean) {
        saveAndUpdate("isAnyNoteActive", setIsAnyNoteActive, val);
      },
      setIsRecycleBinEmpty(val: boolean) {
        saveAndUpdate("isRecycleBinEmpty", setIsRecycleBinEmpty, val);
      },
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

    if (isRecycleBinEmpty === null) {
      const storedIsRecycleBinEmpty = localStorage.getItem("isRecycleBinEmpty");
      if (
        storedIsRecycleBinEmpty === "false" ||
        storedIsRecycleBinEmpty === "true"
      ) {
        setIsRecycleBinEmpty(JSON.parse(storedIsRecycleBinEmpty));
      } else {
        isRecycleBinEmptyFunc(
          allNotes,
          contextValue.actions.setIsRecycleBinEmpty
        );
      }
    }
  };
  useEffect(() => {
    setItem(setAllNotes, "allNotes");
    retrieveAllNotesDeleteAndRecycleBinStatus();
    setItem(setKnowSpacedRepetition, "knowSpacedRepetition");
    setItem(setSubs, "subs");
    // setItem(setNotifications, "notifications");
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

    storedAllNotes.forEach((v: any) => {
      if (v.deleted) return;
      v.revisions.forEach((date: any) => {
        if (structuredAllNotes[date]) {
          structuredAllNotes[date] =
            structuredAllNotes[date] + "\n" + "🗒️ " + v.title + " 📖";
        } else {
          structuredAllNotes[date] = "🗒️ " + v.title + " 📖";
        }
      });
    });

    for (let i in structuredAllNotes) {
      const trigger =
        differenceInSeconds(
          // add(startOfDay(new Date()), { days: 0, hours: 13, minutes: 11 }),
          // add(new Date(note.revisions[0]), { hours: 14, minutes: 18 }),
          add(new Date(i), { hours: 6 }),
          new Date()
        ) * 1000;
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
