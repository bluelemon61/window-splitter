import Blue from "./Blue";
import ErrorBox from "./ErrorBox";
import Green from "./Green";
import Red from "./Red";

const boxList: {[key: string]: () => JSX.Element} = {
  blue: Blue,
  error: ErrorBox,
  green: Green,
  red: Red,
}

export default boxList;