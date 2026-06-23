import "bootstrap/dist/css/bootstrap.min.css";
import "./Chat.css";
function MsgBox({ msg, currentUser }) {
  // console.log(msg.sender);
  console.log(msg);
  
  return (
    <>
      <div
        className={`msgboxmaindiv d-flex ${msg.personID == currentUser ? "justify-content-end" : "justify-content-start"}`}
      >
        <div className="container text-center m-2 msgContainer">
          <div className="row row-cols-1 msginnercontainer">
            <div
              className={`col ${msg.personID == currentUser ? "owner" : "sender"}`}
            >
              {msg.personID}
            </div>
            <div
              className={`col ${msg.personID == currentUser ? "ownerMsg" : "senderMsg"} `}
            >
              {msg.content}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default MsgBox;
