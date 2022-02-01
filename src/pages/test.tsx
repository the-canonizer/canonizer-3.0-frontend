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
  return (
    <form method="get" action="https://www.google.com/custom" target="_top">
      <div className="input-group search-panel">
        <table>
          <tbody>
            <tr>
              <td className="radio radio-primary">
                <input
                  type="radio"
                  name="sitesearch"
                  // defaultValue="false"
                  defaultChecked
                  id="ss0"
                />
                <label htmlFor="ss0" title="Search the Web">
                  Web
                </label>
              </td>
              <td className="radio radio-primary">
                <input
                  type="radio"
                  name="sitesearch"
                  defaultValue="canonizer.com"
                  id="ss1"
                  defaultChecked
                />
                <label htmlFor="ss1" title="Search canonizer.com">
                  Canonizer.com
                </label>
              </td>
            </tr>
          </tbody>
        </table>
        <input
          type="hidden"
          name="search_param"
          defaultValue="all"
          id="search_param"
        />
        <input
          type="text"
          className="form-control search"
          name="q"
          id="sbi"
          placeholder="Google Search for..."
        />
        <input type="submit" name="sa" defaultValue="Search" id="sbb" />
        <input
          type="hidden"
          name="client"
          defaultValue="pub-6646446076038181"
        />
        <input type="hidden" name="forid" defaultValue={1} />
        <input type="hidden" name="ie" defaultValue="ISO-8859-1" />
        <input type="hidden" name="oe" defaultValue="ISO-8859-1" />
        <input
          type="hidden"
          name="cof"
          defaultValue="GALT:#0066CC;GL:1;DIV:#999999;VLC:336633;AH:center;BGC:FFFFFF;LBGC:FF9900;ALC:0066CC;LC:0066CC;T:000000;GFNT:666666;GIMP:666666;LH:43;LW:220;L:https://canonizer.com/images/CANONIZER.PNG;S:https://;FORID:1"
        />
        <input type="hidden" name="hl" defaultValue="en" />
      </div>
    </form>
  );
};

export default Test;
