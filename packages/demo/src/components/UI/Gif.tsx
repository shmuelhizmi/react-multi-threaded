import React from "react";
import { UIComponentProps, AsUIComponent } from "react-multi-threaded";

const Gif = (props: UIComponentProps<{ url: string }>) => {
  return (
    <div>
      <img src={props.url} />
    </div>
  );

}

export default AsUIComponent(Gif);
