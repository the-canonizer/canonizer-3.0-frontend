import { ChangeEvent, useEffect, useState } from "react";
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
    // const val = event?.target?.value;
    // setOtp({
    //   ...otp,
    //   [name]: val,
    // });

    const { value } = event.target;
    if (value.length <= 1) {
      setOtp({ ...otp, [name]: value });
    }
  };

  const inputFocus = (elmnt) => {
    if (elmnt.key === "Delete" || elmnt.key === "Backspace") {
      const next = elmnt.target.tabIndex - 2;
      if (next > -1) {
        elmnt.target.form.elements[next].focus();
      }
    } else {
      const next = elmnt.target.tabIndex;
      if (next < 6) {
        elmnt.target.form.elements[next].focus();
      }
    }
  };

  // infoicontechnology

  const otpClass =
    "w-[3rem] h-[3rem] m-[0 1rem] text-[2rem] text-center rounded-[4px] border-[1px] border-solid border-[rgba(0, 0, 0, 0.3)] text-canBlack font-normal h-[40px] rounded-md";

  const otpInputs = ["otp1", "otp2", "otp3", "otp4", "otp5", "otp6"];

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
