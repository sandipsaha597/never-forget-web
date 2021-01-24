import { useEffect } from "react";
import { useNavigate } from "react-router";
import { constants } from "../../util/util";

export default function KnowSpacedRepetition(props: {
  setKnowSpacedRepetition: any;
}) {
  const { setKnowSpacedRepetition } = props;
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Never Forget";
  }, []);
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <h1 className='ques-h1'>Do you know what is spaced repetition?</h1>
      <div>
        <button
          className='app-btn'
          style={{
            textDecoration: "none",
            color: "#fff",
            background: constants.mainColor,
            padding: "10px 15px",
            border: "none",
            fontSize: "15px",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => navigate("/what-is-spaced-repetition")}
        >
          No, what is it?
        </button>
        <button
          className='app-btn'
          style={{
            textDecoration: "none",
            color: "#fff",
            background: constants.mainColor,
            padding: "10px 15px",
            border: "none",
            fontSize: "15px",
            margin: "10px",
            cursor: "pointer",
          }}
          onClick={() => setKnowSpacedRepetition("Yes")}
        >
          Yes
        </button>
      </div>
    </div>
  );
}
