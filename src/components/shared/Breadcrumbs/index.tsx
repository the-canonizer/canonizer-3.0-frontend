import { Breadcrumb } from "antd";
import { RightOutlined } from "@ant-design/icons";

const Breadcrumbs = ({
  className = "",
  separator = <RightOutlined className="text-canBlack" />,
  ...props
}: any) => {
  return (
    <Breadcrumb
      className={`text-sm text-canBlack font-normal bg-canGray py-5 px-4 mb-5 rounded-lg ${className}`}
      separator={separator}
      {...props}
    >
      {props?.items?.map(
        (bd: {
          icon?: Element;
          label: string;
          href?: string;
          className?: string;
        }) => (
          <Breadcrumb.Item
            key={bd?.label + bd.href}
            className={`text-canBlack font-semibold ${bd?.className}`}
            {...(bd?.href ? { href: bd.href } : {})}
          >
            {bd?.icon}
            {bd?.label ? <span>{bd?.label}</span> : null}
          </Breadcrumb.Item>
        )
      )}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
