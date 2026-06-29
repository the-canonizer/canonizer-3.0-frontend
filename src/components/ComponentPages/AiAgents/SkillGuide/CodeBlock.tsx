import { useState } from "react";
import { Tooltip } from "antd";
import { CopyOutlined, CheckOutlined } from "@ant-design/icons";

import styles from "./skillGuide.module.scss";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

const CodeBlock = ({ code, lang }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available — silently ignore
    }
  };

  return (
    <div className={styles.codeBlock}>
      <div className={styles.codeHeader}>
        <span className={styles.codeLang}>{lang || "code"}</span>
        <Tooltip title={copied ? "Copied!" : "Copy"}>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={onCopy}
            aria-label="Copy code"
          >
            {copied ? <CheckOutlined /> : <CopyOutlined />}
          </button>
        </Tooltip>
      </div>
      <pre className={styles.pre}>
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
