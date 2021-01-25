import React, { useEffect, useState, lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { EnumSpacedRepetition, setItem } from "./AppContext/AppContext";
import "./App.css";
// import Main from "./Main";
import KnowSpacedRepetition from "./screens/Questions/KnowSpacedRepetition";
import VideoScreen from "./screens/VideoScreen";

const AppProvider = lazy(() => import("./AppContext/AppContext"));
const Main = lazy(() => import("./Main"));
// const Video = lazy(() => import("./screens/VideoScreen"));
const NotFound = lazy(() => import("./screens/NotFound"));
export default function App() {
  const location = useLocation();
  const [
    knowSpacedRepetition,
    setKnowSpacedRepetition,
  ] = useState<EnumSpacedRepetition>(EnumSpacedRepetition.No);
  useEffect(() => {
    setItem(setKnowSpacedRepetition, "knowSpacedRepetition");
  }, []);

  return (
    <>
      {knowSpacedRepetition === EnumSpacedRepetition.No ? (
        <div>
          <Routes>
            <Route
              path='/'
              element={
                <KnowSpacedRepetition
                  setKnowSpacedRepetition={(val: any) =>
                    import("./AppContext/AppContext").then((context) => {
                      context.saveAndUpdate(
                        "knowSpacedRepetition",
                        setKnowSpacedRepetition,
                        val
                      );
                    })
                  }
                />
              }
            />

            {location.pathname !== "/what-is-spaced-repetition" && (
              <Route
                path='/*'
                element={
                  <Suspense fallback={<div>404 page</div>}>
                    <NotFound />
                  </Suspense>
                }
              />
            )}
          </Routes>
        </div>
      ) : (
        <Suspense fallback={<div>Loading...</div>}>
          <AppProvider>
            <Main />
          </AppProvider>
        </Suspense>
      )}

      <Routes>
        <Route
          path='/what-is-spaced-repetition'
          element={
            <VideoScreen
              setKnowSpacedRepetition={(val: any) =>
                import("./AppContext/AppContext").then((context) => {
                  context.saveAndUpdate(
                    "knowSpacedRepetition",
                    setKnowSpacedRepetition,
                    val
                  );
                })
              }
            />
          }
        />
      </Routes>
    </>
  );
}
