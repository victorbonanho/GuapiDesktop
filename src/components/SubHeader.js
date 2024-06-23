import React from "react";
import ThemeSwitch from "./ThemeSwitch";

function SubHeader({ title, Icon }) {
  return (
    <div className="bg-purple flex w-full py-3 items-center justify-center">
      <div className="flex w-[90%] justify-between">
        <div className="flex items-center gap-2 text-lightBoxBackground">
          <div className="text-xl">{Icon && <Icon />}</div>
          <h2 className="text-base">{title}</h2>
        </div>
        <div>
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}

export default SubHeader;
