import React, { useState, createContext, useEffect, useRef } from "react";
import { v4 as uuidV4 } from "uuid";
import { isAnyNoteActiveFunc, isRecycleBinEmptyFunc } from "../util/util";

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
  const [animations, setAnimations] = useState<"On" | "Off">("On");

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
      animations,
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
      setAnimations(val: "On" | "Off") {
        saveAndUpdate("animations", setAnimations, val);
      },
    },
  };

  const saveAndUpdate = async (save: string, update: any, value: any) => {
    try {
      await localStorage.setItem(save, JSON.stringify(value));
      update(value);
    } catch (err) {
      alert(err);
      console.log("err", err);
    }
  };
  const closeAllNotifications = async () => {
    const reg = await navigator.serviceWorker.getRegistration();
    const notifications = await reg?.getNotifications({
      // @ts-ignore
      includeTriggered: true,
    });
    notifications?.forEach((notification) => notification.close());
  };
  // localStorage.removeItem("knowSpacedRepetition");
  // localStorage.removeItem("firstNote");
  // localStorage.removeItem("allNotes");
  // closeAllNotifications();
  // localStorage.removeItem("isAnyNoteActive");
  // localStorage.removeItem("isRecycleBinEmpty");
  // localStorage.removeItem("subs");
  // localStorage.removeItem("animations");

  // contextValue.actions.setSubs([
  //   "English",
  //   "Math",
  //   "Geography",
  //   "History",
  //   "jalapino",
  //   "HTML",
  //   "--None--",
  // ]);
  const setItem = (toSet: any, itemName: string) => {
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
    setItem(setAnimations, "animations");
  }, []);

  return (
    <AppContext.Provider value={contextValue}>
      {props.children}
    </AppContext.Provider>
  );
}

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
