import { Typography } from "antd";
import moment from "moment";
import Link from "next/link";
import styles from "../campHistory.module.scss";
import { useRouter } from "next/router";
import { capitalizeFirstLetter } from "src/utils/generalUtility";

const { Title } = Typography;

const HistoryComparison = ({ campStatement, topicNamespaceId }: any) => {
    const router = useRouter();
    const historyOf = router?.query?.from;

    const covertToTime = (unixTime) => moment(unixTime * 1000).format("DD MMMM YYYY, hh:mm:ss A");

    const validUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    };

    const topicName = router?.query?.routes[0]
    const topic_name = topicName.split('-').slice(1).join(' ');

    return (
        <>
            {historyOf === "topic" || historyOf === "camp" ? (
                <p className="mb-2.5">
                    {capitalizeFirstLetter(historyOf)} Name:{" "}
                    <span>
                        {historyOf === "topic" ? topic_name : campStatement?.value}
                    </span>
                </p>
            ) : null}

            <Title level={5} className="font-semibold mb-2.5">
                Updates
            </Title>
            <div>
                {historyOf === "topic" && (
                    <>
                        <p>
                            Canon: <span>{campStatement?.namespace && campStatement?.namespace.replace(/[^a-zA-Z0-9\s]/g, ' ')}</span>
                        </p>
                        <p>
                            Edit summary: <span>{campStatement?.note}</span>
                        </p>
                    </>
                )}
                {historyOf === "camp" && (
                    <>
                        <p>
                            Edit summary: <span>{campStatement?.note}</span>
                        </p>
                        <p>
                            Keywords: <span>{campStatement?.key_words}</span>
                        </p>
                        <p>
                            Camp about URL:{" "}

                            <span>
                                {validUrl(campStatement?.camp_about_url) ? (
                                    <Link href={campStatement?.camp_about_url || ""}>
                                        <a>{campStatement?.camp_about_url}</a>
                                    </Link>
                                ) : null}
                            </span>

                        </p>
                        <p>
                            Camp about Nickname:{" "}
                            <span>
                                <Link
                                    href={`/user/supports/${campStatement?.camp_about_nick_id || ""}?canon=${topicNamespaceId || ""}`}
                                    passHref
                                >
                                    <a>{campStatement?.camp_about_nick_name}</a>
                                </Link>
                            </span>
                        </p>
                        <p>
                            Submitter nickname:{" "}
                            <span>
                                <Link
                                    href={{
                                        pathname: `/user/supports/${campStatement?.submitter_nick_id || ""}`,
                                        query: {
                                            canon: topicNamespaceId || "",
                                        },
                                    }}
                                    passHref
                                >
                                    <a>{campStatement?.submitter_nick_name}</a>
                                </Link>
                            </span>
                        </p>
                        <p>
                            Disable additional sub-camps:{" "}
                            <span>{campStatement?.is_disabled === 1 ? "Yes" : "No"}</span>
                        </p>
                        <p>
                            Single level Camps only:{" "}
                            <span>{campStatement?.is_one_level === 1 ? "Yes" : "No"}</span>
                        </p>
                        <p>
                            Camp archived: <span>{campStatement?.is_archive === 1 ? "Yes" : "No"}</span>
                        </p>
                    </>
                )}
                {historyOf === "statement" && (
                    <>
                        <p>
                            Edit reason: <span>{"static"}</span>
                        </p>
                    </>
                )}
                {(historyOf === "statement" || historyOf === "topic") && (
                    <p>
                        Submitted by:{" "}
                        <span>
                            <Link
                                href={{
                                    pathname: `/user/supports/${campStatement?.submitter_nick_id || ""}`,
                                    query: {
                                        canon: topicNamespaceId || "",
                                    },
                                }}
                                passHref
                            >
                                <a>{campStatement?.submitter_nick_name}</a>
                            </Link>
                        </span>
                    </p>
                )}
                <p>
                    Submitted on: <span>{covertToTime(campStatement?.submit_time)}</span>
                </p>
                <p>
                    Going live on: <span>{covertToTime(campStatement?.go_live_time)}</span>
                </p>
            </div>
        </>
    );
};

export default HistoryComparison;