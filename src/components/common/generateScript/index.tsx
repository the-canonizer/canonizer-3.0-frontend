import { Fragment, useEffect, useState } from "react";
import { Button, Modal, message } from "antd";

import styles from "./generate.module.scss";

import messages from "src/messages";
import { useRouter } from "next/router";

const { labels } = messages;

export default function GenerateModal({ topic_num, camp_num }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [path, setPath] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setPath(window?.location?.origin);
  }, []);

  const onCopy = () => {
    try {
      const copyText = document.getElementById(
        "script_for_generate_tree"
      )! as any;

      if (navigator.clipboard) {
        navigator.clipboard
          .writeText(copyText.innerText)
          .then(() => {
            // navigator.clipboard.readText().then((text) => {
            //   if (text === copyText.innerText) {
            message.success(labels.copied_success);
            //   } else {
            // message.error("Error: Text was not copied.");
            //   }
            // });
          })
          .catch(() => {
            message.error(labels.copied_error);
          });
      }
    } catch (error) {
      message.error(error.message || "Something went wrong!");
    }

    // handleCancel();
  };

  return (
    <Fragment>
      <Button
        type="primary"
        onClick={showModal}
        id="generate-script-btn"
        data-testid="generate-btn"
        className={`${styles.generate_btn}`}
      >
        Get Embed Code
      </Button>
      <Modal
        title="Copy Script"
        open={isModalOpen}
        footer={
          <Fragment>
            <div className={styles.btn_box}>
              <Button
                type="primary"
                htmlType="button"
                size={"large"}
                className={`${styles.cancel_btn}`}
                onClick={handleCancel}
                id="cancel-btn"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                size={"large"}
                className={`${styles.submit_btn}`}
                data-testid="btn"
                id="crate-camp-btn"
                onClick={onCopy}
              >
                Copy
              </Button>
            </div>
          </Fragment>
        }
        onOk={handleOk}
        onCancel={handleCancel}
        className={`${styles.script_modal}`}
      >
        <pre>
          <code id="script_for_generate_tree">
            {`<div id="embedHere">Loading...</div>
<script src="${path}/embed/embed.js" type="text/javascript" charset="utf-8"></script>
<script type="text/javascript" charset="utf-8">
    LoadTree.init({ selector: "#embedHere", topic_num: ${topic_num}, camp_num: ${camp_num} });
</script>`}
          </code>
        </pre>
      </Modal>
    </Fragment>
  );
}
