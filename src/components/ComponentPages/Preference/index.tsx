import { Col, Form, Input, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import messages from "src/messages";
import {
  GetAlgorithmsList,
  GetLanguageList,
  UpdateUserProfileInfo,
} from "src/network/api/userApi";
import { RootState } from "src/store";
import isAuth from "../../../hooks/isUserAuthenticated";
import CustomCheckbox from "src/components/shared/FormInputs/checkbox";
import { setTags } from "src/store/slices/tagsSlice";
import { getAllTags, savePrefTags } from "src/network/api/tagsApi";
import Image from "next/image";
import {
  setDisableButtonForProfileInfo,
  setPostalCodeDisableForProfileInfo,
  setAddForProfileInfo,
  setZipCodeForProfileInfo,
  setGlobalUserProfileDataLanguage,
  setGlobalUserProfileDataAlgo,
} from "src/store/slices/campDetailSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";
import SectionHeading from "../Home/FeaturedTopic/sectionsHeading";
import SecondaryButton from "components/shared/Buttons/SecondaryButton";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import PrimaryButton from "components/shared/Buttons/PrimariButton";

const ProfilePrefrences = () => {
  const [languageList, setLanguageList] = useState([]);
  const [algorithmList, setAlgorithmList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTags, setFilteredTags] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [formVerify] = Form.useForm();

  const { Option } = Select;
  const {
    globalUserProfileData,
    privateList,
    address,
    updateAddress,
    birthdayForProfileInfo,
    globalUserProfileDataLastName,
    globalUserProfileDataLanguage,
    globalUserProfileDataAlgo,
  } = useSelector((state: RootState) => ({
    globalUserProfileData: state.topicDetails.globalUserProfileData,
    privateList: state.topicDetails.privateList,
    address: state.topicDetails.address,
    updateAddress: state.topicDetails.updateAddress,
    birthdayForProfileInfo: state.topicDetails.birthdayForProfileInfo,
    globalUserProfileDataLastName:
      state.topicDetails.globalUserProfileDataLastName,
    globalUserProfileDataLanguage:
      state.topicDetails.globalUserProfileDataLanguage,
    globalUserProfileDataAlgo: state.topicDetails.globalUserProfileDataAlgo,
  }));
  const [selectedLanguage, setSelectedLanguage] = useState(
    globalUserProfileDataLanguage || null
  );
  const [selectedAlgorithmKey, setSelectedAlgorithmKey] = useState(
    globalUserProfileDataAlgo || null
  );
  const [isInitialRender, setIsInitialRender] = useState(true);

  const { tags } = useSelector((state: RootState) => ({
    tags: state?.tag?.tags,
  }));
  const { isUserAuthenticated } = isAuth();
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchLanguageList() {
      try {
        let res = await GetLanguageList();
        if (res !== undefined) {
          setLanguageList(res.data);
        }
      } catch (error) {
        console.error("Error fetching language list:", error);
      }
    }

    async function fetchAlgorithmsList() {
      try {
        let res = await GetAlgorithmsList();
        if (res !== undefined) {
          setAlgorithmList(res.data);
        }
      } catch (error) {
        console.error("Error fetching algorithms list:", error);
      }
    }

    fetchLanguageList();
    fetchAlgorithmsList();
    getAllTags();
  }, [isUserAuthenticated]);

  useEffect(() => {
    // Filter the tags based on the search term
    const filtered = tags.filter((tag) =>
      tag.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTags(filtered);
    const selectedTags = tags.filter((tag) => tag.checked).length;
    setSelectedCount(selectedTags);
  }, [searchTerm, tags]);

  const listOfOption = (optionList, algoOrLang): any => {
    let option = [];
    optionList?.length > 0 &&
      optionList.map((item) => {
        if (algoOrLang == "algorithms") {
          option.push(
            <Option key={item.algorithm_key} value={item.algorithm_key}>
              {item.algorithm_label}
            </Option>
          );
        } else if (algoOrLang == "languages") {
          option.push(
            <Option key={item.id} value={item.name}>
              {item.name}
            </Option>
          );
        }
      });
    return option;
  };

  const onDiscard = () => {
    const resetTags = tags.map((ch) => ({ ...ch, checked: false }));
    dispatch(setTags(resetTags));
  };

  const onChange = (data) => {
    const newTags = tags.map((ch) =>
      ch.id === data.id ? { ...ch, checked: !ch.checked } : ch
    );
    dispatch(setTags(newTags));
  };

  const publicPrivateArray = {
    first_name: "first_name",
    last_name: "last_name",
    email: "email",
    address_1: "address_1",
    address_2: "address_2",
    postal_code: "postal_code",
    city: "city",
    state: "state",
    country: "country",
    birthday: "birthday",
    mobile_carrier: "mobile_carrier",
    phone_number: "phone_number",
  };

  const isPublicOrPrivate = (field_value) => {
    return privateList?.includes(field_value) ? 0 : 1;
  };

  //on update profile click
  const onFinish2 = async (values: any) => {
    let code = values.postal_code;
    dispatch(setDisableButtonForProfileInfo(true));
    dispatch(setPostalCodeDisableForProfileInfo(true));
    //Set Private Public flags
    values.first_name_bit = isPublicOrPrivate(publicPrivateArray.first_name);
    values.last_name_bit = isPublicOrPrivate(publicPrivateArray.last_name);
    values.email_bit = isPublicOrPrivate(publicPrivateArray.email);
    values.address_1_bit = isPublicOrPrivate(publicPrivateArray.address_1);
    values.address_2_bit = isPublicOrPrivate(publicPrivateArray.address_2);
    values.postal_code_bit = isPublicOrPrivate(publicPrivateArray.postal_code);
    values.state_bit = isPublicOrPrivate(publicPrivateArray.state);
    values.country_bit = isPublicOrPrivate(publicPrivateArray.country);
    values.birthday_bit = isPublicOrPrivate(publicPrivateArray.birthday);
    values.city_bit = isPublicOrPrivate(publicPrivateArray.city);
    values.language = selectedLanguage;
    values.first_name = globalUserProfileData;
    values.last_name = globalUserProfileDataLastName;
    values.default_algo = selectedAlgorithmKey;
    values.birthday = birthdayForProfileInfo;
    values.mobile_carrier = formVerify.getFieldValue(
      publicPrivateArray.mobile_carrier
    );
    values.phone_number = formVerify.getFieldValue(
      publicPrivateArray.phone_number
    );
    values.address_1 = address;
    values.postal_code = code;
    values = { ...values, ...updateAddress };
    const userTags = tags.filter((ch) => ch.checked).map((ch) => ch.id);

    // If no tags are selected, exit early
    // if (!userTags.length) {
    //   setLoading(false);
    //   return;
    // }

    // Include tags in values
    values.user_tags = userTags;

    let res = await UpdateUserProfileInfo(values);
    if (res && res.status_code === 200) {
      // setshowSelectedLanguage(res?.data?.language)
      if (!isInitialRender) {
        message.success(res.message);
      }
      if (values?.default_algo) {
        dispatch(
          setFilterCanonizedTopics({
            algorithm: values?.default_algo,
          })
        );
      }
      dispatch(setDisableButtonForProfileInfo(false));
      dispatch(setAddForProfileInfo(false));
      dispatch(setZipCodeForProfileInfo(false));
      dispatch(setGlobalUserProfileDataLanguage(res?.data?.language));
      dispatch(setGlobalUserProfileDataAlgo(res?.data?.default_algo));
    } else {
      dispatch(setDisableButtonForProfileInfo(false));
      dispatch(setAddForProfileInfo(false));
      dispatch(setZipCodeForProfileInfo(false));
    }
  };
  // useEffect(() => {
  //   // Trigger `onFinish2` with the updated form values when the component renders
  //   const callOnFinishOnRender = async () => {
  //     try {
  //       await formVerify.validateFields(); // Validate form first
  //       const values = formVerify.getFieldsValue(); // Get current form values
  //       await onFinish2(values); // Call the onFinish2 function with current values
  //     } catch (error) {
  //       console.error("Error during form validation or function call:", error);
  //     }
  //   };

  //   callOnFinishOnRender(); // Call the function when component renders
  //   setIsInitialRender(false);
  // }, []);
  const handleChangeLanguage = (value) => {
    setSelectedLanguage(value); // Update state with the selected value
  };

  const handleAlgorithmChange = (value) => {
    setSelectedAlgorithmKey(value); // Store the selected algorithm key in state
  };

  return (
    <section>
      <SectionHeading
        title="PREFERENCES"
        icon={null}
        className="lg:mt-0 mt-10 mb-5"
      />
      <Row gutter={30}>
        <Col md={12} sm={24} className="w-full lg:mb-0 mb-5">
          <p className="mb-2 mt-3 text-sm font-normal text-canBlack">
            Language
          </p>
          <Select
            id="selectLanguage"
            size="large"
            placeholder={"Select a language"}
            showSearch
            optionFilterProp="children"
            value={selectedLanguage}
            suffixIcon={
              <Image
                src="/images/caret-icon.svg"
                width={16}
                height={9}
                alt=""
              />
            }
            onChange={handleChangeLanguage}
            className="text-canBlack font-normal  [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack  [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selection-search>input]:!text-base placeholder:!text-base w-full [&_.ant-select-arrow]:!h-full [&_.ant-select-arrow]:!flex [&_.ant-select-arrow]:!items-center [&_.ant-select-arrow]:border-l [&_.ant-select-arrow]:border-canGrey2 [&_.ant-select-arrow]:!pl-2.5 [&_.ant-select-arrow]:!top-1/2 [&_.ant-select-arrow]:!-translate-y-1/2 [&_.ant-select-arrow]:!mt-0 "
          >
            {listOfOption(languageList, "languages")}
          </Select>
        </Col>
        <Col md={12} sm={24} className="w-full">
          <p className="mb-2 mt-3 text-sm font-normal text-canBlack">
            Default Algorithm Preferences
          </p>
          <Select
            id="algorithms"
            size="large"
            placeholder={messages.placeholders.algorithm}
            showSearch
            optionFilterProp="children"
            value={selectedAlgorithmKey}
            suffixIcon={
              <Image
                src="/images/caret-icon.svg"
                width={16}
                height={9}
                alt=""
              />
            }
            // value={}
            onChange={handleAlgorithmChange}
            className="text-canBlack font-normal  [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!outline-none [&_.ant-select-selector]:!shadow-none commonSelectClass [&_.ant-select-arrow]:text-canBlack [&_.ant-select-arrow>svg]:fill-canBlack  [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:!flex [&_.ant-select-selector]:!items-center [&_.ant-select-selection-search>input]:!text-base placeholder:!text-base w-full [&_.ant-select-arrow]:!h-full [&_.ant-select-arrow]:!flex [&_.ant-select-arrow]:!items-center [&_.ant-select-arrow]:border-l [&_.ant-select-arrow]:border-canGrey2 [&_.ant-select-arrow]:!pl-2.5 [&_.ant-select-arrow]:!top-1/2 [&_.ant-select-arrow]:!-translate-y-1/2 [&_.ant-select-arrow]:!mt-0 [&_.ant-select-selection-placeholder]:!text-base  "
          >
            {listOfOption(algorithmList, "algorithms")}
          </Select>
        </Col>
      </Row>

      <hr className="my-10" />

      <div className="lg:mt-0 mt-12">
        <SectionHeading
          title="Topic Tags"
          icon={null}
          className="lg:mb-5 mb-7"
        />
        <div className="flex lg:justify-between lg:items-center mb-5 lg:flex-row flex-col">
          <div className="flex-1 order-2 lg:order-1  ">
            <p className="text-sm font-medium">
              You have set{" "}
              <span className="text-canBlue">{selectedCount} Topic Tags </span>
              as your preference
            </p>
          </div>
          <Input
            placeholder="Search via Topic Tags name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="lg:w-72 w-full h-11 rounded-lg border-canGrey2 lg:mb-0 mb-7 lg:order-0 order-1 placeholder:!text-base placeholder:!text-canBlue placeholder:!font-normal focus:!border-canGrey2 focus:!shadow-none hover:!border-canGrey2 [&_.ant-input-suffix]:border-l [&_.ant-input-suffix]:!border-canGrey2 [&_.ant-input-suffix]:px-2.5 !p-0 [&_.ant-input]:!px-2.5 [&_.ant-input]:rounded-lg  [&_.ant-input-suffix]:!ml-0  "
            suffix={
              <Image
                src="/images/search-icon.svg"
                width={16}
                height={16}
                alt=""
              />
            }
          />
        </div>
      </div>

      <div className="w-full my-4   px-1  focus:overscroll-contain custom-checkbox-preference flex flex-wrap gap-3">
        {filteredTags.length > 0 ? (
          filteredTags.map((ch) => (
            <CustomCheckbox
              id={ch.id}
              key={ch.id}
              onChange={() => onChange(ch)}
              checked={ch.checked}
              className="text-sm"
            >
              {ch.title}
            </CustomCheckbox>
          ))
        ) : (
          <p>No tags found</p>
        )}
      </div>

      <div className="flex justify-center gap-5 mt-10">
        <SecondaryButton
          onClick={onDiscard}
          disabled={loading}
          className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
        >
          Discard <CloseOutlined />
        </SecondaryButton>

        <Form form={formVerify} onFinish={onFinish2}>
          <PrimaryButton
            className="flex gap-2.5 items-center justify-center w-[12.5rem] h-auto"
            loading={loading}
            onClick={async (e) => {
              try {
                await formVerify.validateFields();
                await onFinish2(formVerify.getFieldsValue());
              } catch (error) {}
            }}
          >
            Save <SaveOutlined />
          </PrimaryButton>
        </Form>
      </div>
    </section>
  );
};

export default ProfilePrefrences;
