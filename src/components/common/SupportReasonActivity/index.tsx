import { Fragment } from "react";

import { getProperties } from "src/utils/generalUtility";

function ReasonsActivity({ CurrentItem }: any) {
  return CurrentItem?.log_name === "support" ? (
    <Fragment>
      {getProperties(CurrentItem)?.reason ? (
        <span>Reason:- {getProperties(CurrentItem)?.reason}</span>
      ) : null}
      {getProperties(CurrentItem)?.reason_summary ? (
        <Fragment>
          <br />
          <span>Summary:- {getProperties(CurrentItem)?.reason_summary}</span>
        </Fragment>
      ) : null}
      {getProperties(CurrentItem)?.citation_link ? (
        <Fragment>
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
      ) : null}
    </Fragment>
  ) : null;
}

export default ReasonsActivity;
