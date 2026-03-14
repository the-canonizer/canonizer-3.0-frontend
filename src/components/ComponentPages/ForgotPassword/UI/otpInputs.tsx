import React, { ChangeEvent, useEffect, useState, KeyboardEvent } from "react";
import { Input } from "antd";

const Otpinput = ({ label, onChangeOtp, className = "" }) => {
  const [otp, setOtp] = useState({
    otp1: "",
    otp2: "",
    otp3: "",
    otp4: "",
    otp5: "",
    otp6: "",
  });

  useEffect(() => {
    const otpValues = Object.values(otp)?.filter(Boolean)?.join("");
    onChangeOtp(otpValues);
  }, [otp]);

  const handleChange = (name: string, event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (value.length <= 1) {
      setOtp({ ...otp, [name]: value });
      // Focus on the next input field if the input is valid (1 character)
      if (value.length === 1) {
        const nextInput: any =
          event.target.form.elements[event.target.tabIndex + 1];

        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const inputFocus = (event) => {
    if (event.key === "Delete" || event.key === "Backspace") {
      const previous = event.target.tabIndex - 1; // Move to the previous input
      if (previous > 0) {
        event.target.form.elements[previous].focus();
      }
    } else {
      const next = event.target.tabIndex; // Move to the next input
      if (next < 6) {
        event.target.form.elements[next].focus();
      }
    }
  };

  const otpClass =
    "w-[40px] h-[40px] m-[0 1rem] text-xl text-center rounded-[4px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.3)] text-canBlack font-normal rounded-md p-1";

  const otpInputs = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { key } = event;

    if (key === "Backspace" && idx > 0) {
      // Move focus to the previous input box if the current input is empty
      const currentInput = event.target as HTMLInputElement;
      if (currentInput.value === "") {
        const prevInput = document.querySelector(
          `[tabIndex="${idx}"]`
        ) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };
  return (
    <div className={"w-[max-content] mx-auto " + className}>
      <div className="ant-col ant-form-item-label font-medium font-sm">
        <label htmlFor="otpverify_otp" className="ant-form-item-required">
          {label}
        </label>
      </div>
      <div className="flex gap-3 lg:gap-4">
        {otpInputs?.map((otp, idx) => (
          <Input
            key={otp}
            name={otp}
            type="text"
            autoComplete="off"
            className={otpClass}
            value={otp[otp]}
            onChange={(e) => handleChange(otp, e)}
            tabIndex={idx + 1}
            maxLength={1}
            onKeyUp={(e) => inputFocus(e)}
          />
        ))}
      </div>
    </div>
  );
};

export default Otpinput;
