import { Fragment } from "react";
import { cleanup, render, screen } from "src/utils/testUtils";

import GoogleADS from "../";

afterEach(cleanup);

describe("GoogleADS", () => {
  it("render heading and labels", () => {
    const { container } = render(
      <Fragment>
        <GoogleADS ad_slot={undefined} />
      </Fragment>
    );

    expect(container?.firstChild?.classList?.contains("adsbygoogle")).toBe(
      true
    );
  });
});
