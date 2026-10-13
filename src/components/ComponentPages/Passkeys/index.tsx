import { Fragment, useEffect, useState } from "react";
import {
  Button,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Popconfirm,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, KeyOutlined, PlusOutlined } from "@ant-design/icons";
import moment from "moment";

import messages from "src/messages";
import {
  deletePasskey,
  getPasskeys,
  passkeyRegisterOptions,
  passkeyRegisterVerify,
} from "src/network/api/userApi";
import {
  getPasskeyErrorMessage,
  isWebAuthnSupported,
  loadWebAuthn,
} from "src/utils/passkey";
import { openNotificationWithIcon } from "components/common/notification/notificationBar";
import isAuth from "src/hooks/isUserAuthenticated";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import PrimaryButton from "components/shared/Buttons/PrimariButton";
import CustomSpinner from "components/shared/CustomSpinner";

const { Text } = Typography;
const { passkey: copy } = messages;

type Passkey = {
  id: string | number;
  label: string | null;
  created_at: string;
  last_used_at: string | null;
};

const formatDate = (date: string | null) =>
  date ? moment(date).format("MMM D, YYYY h:mm A") : copy.never;

function Passkeys() {
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [registering, setRegistering] = useState(false);

  const [form] = Form.useForm();
  const { isUserAuthenticated } = isAuth();

  const fetchPasskeys = async () => {
    setLoading(true);
    try {
      const res = await getPasskeys();
      if (res?.status_code === 200) setPasskeys(res.data || []);
    } catch (error) {
      openNotificationWithIcon(
        getPasskeyErrorMessage(error, copy.errors.loadFailed)
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    isWebAuthnSupported().then(setIsSupported);
  }, []);

  useEffect(() => {
    if (isUserAuthenticated) fetchPasskeys();
  }, [isUserAuthenticated]);

  const openLabelModal = () => {
    form.resetFields();
    setIsLabelModalOpen(true);
  };

  const onRegister = async ({ label }: { label?: string }) => {
    setRegistering(true);
    try {
      const optionsRes = await passkeyRegisterOptions();
      const { startRegistration } = await loadWebAuthn();
      const credential = await startRegistration(optionsRes?.data);

      const trimmed = label?.trim();
      const res = await passkeyRegisterVerify({
        credential,
        ...(trimmed ? { label: trimmed } : {}),
      });

      if (res?.status_code === 200) {
        message.success(copy.registered);
        setIsLabelModalOpen(false);
        fetchPasskeys();
      }
    } catch (error) {
      openNotificationWithIcon(
        getPasskeyErrorMessage(error, copy.errors.registerFailed)
      );
    } finally {
      setRegistering(false);
    }
  };

  const onRemove = async (id: Passkey["id"]) => {
    try {
      const res = await deletePasskey(id);
      if (res?.status_code === 200) {
        message.success(res.message || copy.removed);
        setPasskeys((list) => list.filter((p) => p.id !== id));
      }
    } catch (error) {
      openNotificationWithIcon(
        getPasskeyErrorMessage(error, copy.errors.removeFailed)
      );
    }
  };

  return (
    <Fragment>
      <section id="passkeys-section" aria-label={copy.sectionTitle}>
        <SectionHeading
          title={copy.sectionTitle}
          icon={null}
          className="!mb-2"
        />
        <Text className="block text-sm text-canBlack opacity-80 mb-5">
          {copy.sectionDescription}
        </Text>

        {isSupported ? (
          <PrimaryButton
            className="h-[40px] text-sm rounded-lg flex items-center justify-center gap-2 mb-6"
            onClick={openLabelModal}
            id="passkey-register-btn"
            data-testid="passkey-register-btn"
          >
            <PlusOutlined aria-hidden="true" /> {copy.register}
          </PrimaryButton>
        ) : (
          <Text
            className="block text-sm text-canRed mb-6"
            role="status"
            id="passkey-not-supported"
          >
            {copy.notSupported}
          </Text>
        )}

        <CustomSpinner spinning={loading}>
          <List
            className="border border-canGrey2 rounded-xl"
            dataSource={passkeys}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={copy.empty}
                />
              ),
            }}
            renderItem={(item) => (
              <List.Item
                key={item.id}
                className="!px-4 flex flex-col sm:flex-row !items-start sm:!items-center gap-3"
                data-testid="passkey-item"
                actions={[
                  <Popconfirm
                    key="remove"
                    title={copy.removeConfirm}
                    onConfirm={() => onRemove(item.id)}
                    okText={copy.yes}
                    cancelText={copy.no}
                  >
                    <Button
                      type="link"
                      danger
                      className="text-canDarkRed font-semibold flex items-center gap-2 !px-0"
                      aria-label={`${copy.remove} ${
                        item.label || copy.unnamed
                      }`}
                      data-testid="passkey-remove-btn"
                    >
                      <DeleteOutlined aria-hidden="true" /> {copy.remove}
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <KeyOutlined
                      aria-hidden="true"
                      className="text-xl text-canBlue"
                    />
                  }
                  title={
                    <Text className="text-base font-medium text-canBlack">
                      {item.label || copy.unnamed}
                    </Text>
                  }
                  description={
                    <dl className="flex flex-col sm:flex-row sm:gap-6 text-sm m-0">
                      <div className="flex gap-1">
                        <dt>{copy.colCreated}:</dt>
                        <dd className="m-0">{formatDate(item.created_at)}</dd>
                      </div>
                      <div className="flex gap-1">
                        <dt>{copy.colLastUsed}:</dt>
                        <dd className="m-0">{formatDate(item.last_used_at)}</dd>
                      </div>
                    </dl>
                  }
                />
              </List.Item>
            )}
          />
        </CustomSpinner>
      </section>

      <Modal
        title={copy.labelPromptTitle}
        visible={isLabelModalOpen}
        onCancel={() => !registering && setIsLabelModalOpen(false)}
        okText={copy.continue}
        cancelText={copy.cancel}
        onOk={() => form.submit()}
        confirmLoading={registering}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={onRegister}>
          <Text className="block text-sm mb-4">{copy.labelPromptHint}</Text>
          <Form.Item name="label" label={copy.labelField}>
            <Input
              id="passkey-label-input"
              placeholder={copy.labelPlaceholder}
              maxLength={100}
              autoFocus
            />
          </Form.Item>
        </Form>
      </Modal>
    </Fragment>
  );
}

export default Passkeys;
