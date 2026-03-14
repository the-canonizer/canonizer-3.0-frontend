import { useRouter } from "next/router";

import HeadContent from "./headContent";

type HeadContentComponentProps = {
  componentName: string;
  metaContent: any;
  canonical: string;
};

const HeadContentAndPermissionComponent = ({
  componentName,
  metaContent,
  canonical,
  ...rest
}: HeadContentComponentProps) => {
  const router = useRouter();
  const pageRoute = process.env.NEXT_PUBLIC_BASE_URL + router?.asPath;

  return (
    <HeadContent
      title={metaContent?.title}
      description={metaContent?.description}
      route={pageRoute}
      author={metaContent?.author}
      componentName={componentName}
      canonical={canonical}
      {...rest}
    />
  );
};

export default HeadContentAndPermissionComponent;
