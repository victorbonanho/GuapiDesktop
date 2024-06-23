import React, { useState, useEffect } from "react";
import Switch from "react-switch";
import { LuMoon, LuSun } from "react-icons/lu";

const ThemeSwitch = () => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setChecked(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleChange = (nextChecked) => {
    setChecked(nextChecked);
    const newTheme = nextChecked ? "dark" : "light";
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      offColor="#fff"
      onColor="#4C4C4C"
      offHandleColor="#4C4C4C"
      onHandleColor="#fff"
      uncheckedIcon={
        <div className="flex items-center justify-center h-full">
          <LuMoon className="text-darkBoxBackground text-xl" />
        </div>
      }
      checkedIcon={
        <div className="flex items-center justify-center h-full">
          <LuSun className="text-lightBoxBackground text-xl" />
        </div>
      }
      handleDiameter={22}
      height={30}
      width={57}
      className="react-switch custom-switch"
    />
  );
};

export default ThemeSwitch;
