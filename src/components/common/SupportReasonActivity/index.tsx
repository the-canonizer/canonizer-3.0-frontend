import { Fragment } from "react";

import { getProperties } from "src/utils/generalUtility";

function ReasonsActivity({ CurrentItem }) {
  return CurrentItem?.log_name === "support" ? (
    <Fragment>
      <span>Reason:- {getProperties(CurrentItem)?.reason}</span>
      <br />
      <span>Summary:- {getProperties(CurrentItem)?.reason_summary}</span>
      <br />
      <span>
        Citation Link:-{" "}
        <a
          href={getProperties(CurrentItem)?.citation_link}
          target="_blank"
          rel="noreferrer"
        >
          {getProperties(CurrentItem)?.citation_link}
        </a>
      </span>
    </Fragment>
  ) : null;
}

export default ReasonsActivity;
