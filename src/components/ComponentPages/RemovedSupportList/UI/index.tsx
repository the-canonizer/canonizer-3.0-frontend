import { Card, Select } from "antd";
import messages from "src/messages";

import styles from "../../SubscriptionsList/UI/SubscriptionsList.module.scss";

import TopicSubscriptionsTab from "./TopicSubscriptionsTab";

function SubscriptionsListUI({
  subscriptionsList,
  onConfirm,
  nickNameList,
  selectedNikname,
  onNickNameChange,
}: any) {
  return (
    <div className={styles.supported_camps}>
      <Card
        className={`${styles.cardBox_tags_wrapper} ${styles.supportedCard}`}
        type="inner"
        size="default"
        style={{ width: "100%" }}
        title={
          <div className={styles.nickname_box}>
            <span className={`${styles.main_card_title} ${styles.labels}`}>
              Select {messages.labels.nickname}
            </span>
            <Select
              size="large"
              className={`${styles.dropdown} ${styles.nickname_dropdown}`}
              defaultValue={null}
              value={selectedNikname}
              onChange={onNickNameChange}
              showSearch
              optionFilterProp="children"
              id="user-nick-name-dropdown"
              data-testid="user-nick-name-dropdown"
            >
              <Select.Option
                id={`name-space-default`}
                key="default-option"
                value={null}
              >
                All
              </Select.Option>
              {nickNameList?.map((nick) => {
                return (
                  <Select.Option
                    id={`name-space-${nick.id}`}
                    key={nick.id}
                    value={nick.value}
                  >
                    {nick.label}
                  </Select.Option>
                );
              })}
            </Select>
          </div>
        }
      >
        <TopicSubscriptionsTab
          onConfirm={onConfirm}
          subscriptionsList={subscriptionsList}
        />
      </Card>
    </div>
  );
}

export default SubscriptionsListUI;
