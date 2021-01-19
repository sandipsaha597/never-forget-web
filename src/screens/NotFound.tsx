import { useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { AppContext } from "../AppContext/AppContext";
import icon404 from "../assets/icons/error-404.svg";

export default function NotFound() {
  const {
    constants: { mainColor },
  } = useContext<any>(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = "404 Page Not Found | Never Forget";
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <img style={{ width: "20%" }} src={icon404} alt='' />
      <p>Page "{location.pathname}" Not Found</p>
      <button
        className='app-btn'
        style={{
          textDecoration: "none",
          color: "#fff",
          background: mainColor,
          padding: "10px 15px",
          border: "none",
          fontSize: "15px",
          margin: "10px",
          cursor: "pointer",
        }}
        onMouseDown={() => navigate("/")}
      >
        Go to Home page
      </button>
    </div>
  );
}
