import React, { ChangeEvent, useEffect, useState ,KeyboardEvent} from "react";
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

  // const handleChange = (name: string, event: ChangeEvent<HTMLInputElement>) => {
  //   // const val = event?.target?.value;
  //   // setOtp({
  //   //   ...otp,
  //   //   [name]: val,
  //   // });

  //   const { value } = event.target;
  //   if (value.length <= 1) {
  //     setOtp({ ...otp, [name]: value });
  //   }
  // };
  const handleChange = (
    name: string,
    event: ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { value } = event.target;

    if (value.length <= 1) {
      setOtp((prevOtp) => ({
        ...prevOtp,
        [name]: value,
      }));

      // Automatically move focus to the next input box if value is not empty and the next box exists
      if (value && idx < otpInputs.length - 1) {
        const nextInput = document.querySelector(
          `[tabIndex="${idx + 2}"]`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  // const inputFocus = (elmnt) => {
  //   if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
  //     const next = elmnt.target.tabIndex - 1;
  //     if (next > -1) {
  //       elmnt.target.form.elements[next].focus();
  //     }
  //   } else {
  //     const next = elmnt.target.tabIndex;
  //     if (next < 6) {
  //       elmnt.target.form.elements[next].focus();
  //     }
  //   }
  // };

  // infoicontechnology

  const otpClass =
    "w-[3rem] h-[3rem] m-[0 1rem] text-[2rem] text-center rounded-[4px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.3)] text-canBlack font-normal h-[40px] rounded-md";

  const otpInputs = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];
  
  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => {
    const { key } = event;

    if (key === 'Backspace' && idx > 0) {
      // Move focus to the previous input box if the current input is empty
      const currentInput = event.target as HTMLInputElement;
      if (currentInput.value === '') {
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
    <div className={"w-8/12 mx-auto " + className}>
      <div className="ant-col ant-form-item-label font-medium font-sm">
        <label htmlFor="otpverify_otp" className="ant-form-item-required">
          {label}
        </label>
      </div>
      <div className="flex justify-evenly">
      {otpInputs?.map((otp, idx) => (
        <Input
          key={otp}
          name={otp}
          type="text"
          autoComplete="off"
          className={otpClass}
          value={otp[otp]}
          onChange={(e) => handleChange(otp, e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          tabIndex={idx + 1}
          maxLength={1}
        />
      ))}
      </div>
    </div>
  );
};

export default Otpinput;
