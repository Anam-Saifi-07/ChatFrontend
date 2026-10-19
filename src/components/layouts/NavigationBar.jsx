import { useNavigate } from "react-router";
import styles from "../layouts/NavigationBar.module.css";
function NavigationBar(params) {
  const tabs = [
    {id:"home",name:"home"},
    {id:"person",name:"person"},
    {id:"room",name:"room"},
    {id:"profile",name:"profile"}
  ];
  const navigate=useNavigate();
   function handleBtn(param) {
     if (param == "profile") {
       navigate('/profile');
     } else if (param == "home") {
       navigate('/home');
     } else if (param == "room") {
       navigate('/room');
     } else {
       navigate('/person');
    }
  }
    return (
      <>
        <div
          className={`btn-group btn-group-toggle ${styles.centreToggle}`}
          data-toggle="buttons"
        >
          <label className="btn  active">
            <button className={`${styles.btn}`} onClick={handleBtn(tabs[0].id)}>{tabs[0].name}</button>
          </label>
          <label className="btn ">
            <button className={`${styles.btn}`} onClick={handleBtn(tabs[1].id)}>
              {tabs[1].name}
            </button>
          </label>
          <label className="btn ">
            <button className={`${styles.btn}`} onClick={handleBtn(tabs[2].id)}>
              {tabs[2].name}
            </button>
          </label>
          <label className="btn ">
            <button className={`${styles.btn}`} onClick={handleBtn(tabs[3].id)}>
              {tabs[3].name}
            </button>
          </label>
        </div>
      </>
    );
}
export default NavigationBar;