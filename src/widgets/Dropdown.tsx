import { useState, useContext } from "react";
import { AppContext } from "../AppContext/AppContext";
import { v4 as uuidV4 } from "uuid";
import arrowDown from "../assets/icons/arrow-down-sign-to-navigate.svg";
import deleteSimple from "../assets/icons/delete-simple.svg";
import add from "../assets/icons/plus-green.svg";

export default function Dropdown(props: {
  title: string;
  options: {
    id: string;
    title: string;
  }[];
  selected: string;
  setSelected: (val: string) => void;
  addInput?: boolean;
  deleteAble?: boolean;
}) {
  const { title, options, selected, setSelected, addInput, deleteAble } = props;
  const [addSubtext, setAddSubtext] = useState<string>("");
  const [dropdown, setDropdown] = useState<"Open" | "Close">("Close");

  const {
    actions: { setSubs },
  } = useContext<any>(AppContext);

  return (
    <div style={{ display: "flex", position: "relative" }}>
      <button
        className='btn-focus-none'
        style={{
          display: "flex",
          padding: 10,
          marginTop: 10,
          marginBottom: 10,
          margin: "10px 10px 10px 0",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 10,
          border: "2px solid #000",
          fontFamily: "'Roboto', Arial",
          cursor: "pointer",
          minWidth: "92px",
        }}
        onMouseDown={() =>
          setDropdown((prev) => (prev === "Open" ? "Close" : "Open"))
        }
      >
        {title}: {selected}{" "}
        <img
          style={{ width: "13px", marginLeft: "6px" }}
          src={arrowDown}
          alt='arrowDown'
        />
      </button>

      <div
        className='scroll'
        style={{
          maxHeight: dropdown === "Open" ? "200px" : "0px",
          transition: "0.4s ease-in-out",
          position: "absolute",
          top: 60,
          zIndex: 30,
          backgroundColor: "#fff",
          width: 200,
          overflow: "auto",
          borderRadius: 10,
          border: dropdown === "Open" ? "2px solid #000" : "0px solid #000",
        }}
      >
        {addInput && (
          <div style={{ display: "flex", alignItems: "center", padding: 10 }}>
            <input
              style={{
                width: "100%",
                background: "transparent",
                outline: "none",
                border: "none",
                borderBottom: "2px solid #000",
                marginRight: 10,
              }}
              onChange={(e) => setAddSubtext(e.target.value)}
              placeholder='Add Subject'
              value={addSubtext}
            />
            <button
              style={{ opacity: addSubtext.trim() === "" ? 0.4 : 1 }}
              disabled={addSubtext.trim() === "" ? true : false}
              onMouseDown={() => {
                let tempSubs = [...options] as any;
                tempSubs.unshift({
                  id: uuidV4(),
                  title: addSubtext,
                });
                setSubs(tempSubs);
                setAddSubtext("");
              }}
            >
              <img style={{ width: "24px" }} src={add} alt='add' />
            </button>
          </div>
        )}
        {options.map((v: any, i: number) => (
          <div
            key={v.id}
            style={{
              display: "flex",
              alignItems: "center",
              textAlign: "left",
            }}
          >
            <span
              className='btn-focus-none dropdown-btn'
              style={{
                display: "inline-block",
                padding: 10,
                background: "transparent",
                border: "none",
                width: "100%",
                cursor: "pointer",
                transition: "0.4s",
              }}
              onMouseDown={() => {
                setSelected(v.title);
                setDropdown("Close");
              }}
            >
              {v.title}
            </span>
            {deleteAble && v.title !== "--None--" && (
              <div>
                <button
                  style={{ padding: 7 }}
                  onMouseDown={() => {
                    let tempSubs = [...options];
                    tempSubs = tempSubs.filter((j: any) => j.id !== v.id);
                    setSubs(tempSubs);
                  }}
                >
                  <img
                    style={{ width: "24px" }}
                    src={deleteSimple}
                    alt='delete'
                  />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
