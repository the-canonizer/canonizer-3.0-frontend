import { Fragment } from "react";
import { fireEvent, render, screen } from "src/utils/testUtils";

import SupportRemoveModal from "../";
import messages from "src/messages";

const { labels, placeholders } = messages;

describe("Support remove modal", () => {
  it("render heading and labels", () => {
    render(
      <Fragment>
        <SupportRemoveModal
          onFinish={jest.fn()}
          handleCancel={jest.fn()}
          form={null}
          isAdd={false}
          isOrderChange={false}
        />
      </Fragment>
    );

    const inp = screen.getByPlaceholderText(placeholders.campURL);
    const btn = screen.getByText("Remove");

    expect(screen.getByText(labels.reasonLabel)).toBeInTheDocument();
    expect(screen.getByText("Select reason")).toBeInTheDocument();
    expect(screen.getByText(labels.resonURLLabel)).toBeInTheDocument();
    expect(screen.getByText("Remove")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(inp).toBeInTheDocument();
    expect(inp).toHaveAttribute("type", "text");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
  });

  it("render heading and labels on add", () => {
    render(
      <Fragment>
        <SupportRemoveModal
          onFinish={jest.fn()}
          handleCancel={jest.fn()}
          form={null}
          isAdd={true}
          isOrderChange={false}
        />
      </Fragment>
    );

    const inp = screen.getByPlaceholderText(placeholders.campURL);

    expect(screen.getByText(labels.reasonLabel)).toBeInTheDocument();
    expect(screen.getByText("Select reason")).toBeInTheDocument();
    expect(screen.getByText(labels.resonURLLabel)).toBeInTheDocument();
    expect(inp).toBeInTheDocument();
    expect(inp).toHaveAttribute("type", "text");
  });

  it("render heading and labels on order change", () => {
    render(
      <Fragment>
        <SupportRemoveModal
          onFinish={jest.fn()}
          handleCancel={jest.fn()}
          form={null}
          isAdd={false}
          isOrderChange={true}
        />
      </Fragment>
    );

    const inp = screen.getByPlaceholderText(placeholders.campURL);
    const btn = screen.getByText("Submit");

    expect(screen.getByText(labels.reasonChangeLabel)).toBeInTheDocument();
    expect(screen.getByText("Select reason")).toBeInTheDocument();
    expect(screen.getByText(labels.resonURLLabel)).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(inp).toBeInTheDocument();
    expect(inp).toHaveAttribute("type", "text");
    fireEvent.change(inp, { target: { value: "link" } });
    expect(inp).toHaveValue("link");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
  });
});
