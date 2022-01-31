import axios from "axios";
import * as React from "react";
import { useEffect } from "react";

interface ITestProps {}

const Test: React.FunctionComponent<ITestProps> = (props) => {
  useEffect(() => {
    // axios.post("http://codedistrictem.com:7010/api/v1/topic/getAll", {
    //   page_number: 1,
    //   page_size: 20,
    //   namespace_id: 1,
    //   asofdate: 1643293846,
    //   algorithm: "blind_popularity",
    //   search: "Hard",
    // });

    axios({
      method: "POST",
      url: "http://codedistrictem.com:7010/api/v1/topic/getAll",
      data: {
        page_number: 1,
        page_size: 20,
        namespace_id: 1,
        asofdate: 1643293846,
        algorithm: "blind_popularity",
        search: "Hard",
      },
      headers: {},
    });
  }, []);
  return <h1>Test</h1>;
};

export default Test;
