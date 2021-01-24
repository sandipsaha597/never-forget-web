import { logoInBase64 } from "../util/util";

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
      <div style={{ letterSpacing: "1px", margin: "5px 0 16px 0" }}>v1.0.2</div>
    </div>
  );
};
