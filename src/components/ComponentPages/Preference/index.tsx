import { Button, Col, Form, Input, Row, Select, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import messages from "src/messages";
import { GetAlgorithmsList, GetLanguageList, UpdateUserProfileInfo } from "src/network/api/userApi";
import { RootState } from "src/store";
import isAuth from "../../../hooks/isUserAuthenticated";
import CustomCheckbox from "src/components/shared/FormInputs/preference-checkbox";
import { useRouter } from "next/router";
import { setTags } from "src/store/slices/tagsSlice";
import { getAllTags, savePrefTags } from "src/network/api/tagsApi";
import Image from "next/image";
import {
    setDisableButtonForProfileInfo,
    setPostalCodeDisableForProfileInfo,
    setAddForProfileInfo,
    setZipCodeForProfileInfo,
} from "src/store/slices/campDetailSlice";
import { setFilterCanonizedTopics } from "src/store/slices/filtersSlice";


const ProfilePrefrences = () => {
    const [languageList, setLanguageList] = useState([]);
    const [algorithmList, setAlgorithmList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredTags, setFilteredTags] = useState([]);
    const [selectedCount, setSelectedCount] = useState(0);
    const [formVerify] = Form.useForm();
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [selectedAlgorithmKey, setSelectedAlgorithmKey] = useState(null);

    const { Option } = Select;
    const {
        globalUserProfileData,
        privateList,
        address,
        updateAddress,
        birthdayForProfileInfo,
        globalUserProfileDataLastName,
    } = useSelector((state: RootState) => ({
        globalUserProfileData: state.topicDetails.globalUserProfileData,
        privateList: state.topicDetails.privateList,
        address: state.topicDetails.address,
        updateAddress: state.topicDetails.updateAddress,
        birthdayForProfileInfo: state.topicDetails.birthdayForProfileInfo,
        globalUserProfileDataLastName: state.topicDetails.globalUserProfileDataLastName,

    }));


    const { tags } = useSelector((state: RootState) => ({
        tags: state?.tag?.tags,

    }));
    const { isUserAuthenticated } = isAuth();
    const dispatch = useDispatch();
    const getTags = async () => {
        await getAllTags();
    };

    useEffect(() => {
        getTags();
    }, []);
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
    const onFinish = async (e) => {
        e.preventDefault();
        setLoading(true);

        const userTags = tags.filter((ch) => ch.checked).map((ch) => ch.id);

        try {
            const res = await savePrefTags(userTags);

            if (res.status_code === 200) {
                message.success(res.message);
            }
        } catch (error) {
            message.error("Failed to save tags.");
        } finally {
            setLoading(false);
        }
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
    console.log(globalUserProfileDataLastName, "fgfgfgfgfgfgfgfgfgfg")
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

        let res = await UpdateUserProfileInfo(values);
        if (res && res.status_code === 200) {
            message.success(res.message);
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
        } else {
            dispatch(setDisableButtonForProfileInfo(false));
            dispatch(setAddForProfileInfo(false));
            dispatch(setZipCodeForProfileInfo(false));
        }
    }
    const handleChangeLanguage = (value) => {
        setSelectedLanguage(value); // Update state with the selected value
    };
    const handleAlgorithmChange = (value) => {
        setSelectedAlgorithmKey(value); // Store the selected algorithm key in state

    };
    return (
        <section>

            <h3 className="uppercase text-canBlack font-semibold text-base lg:mt-0 mt-10 mb-5"> PREFERENCES</h3>

            <Row gutter={30}>
                <Col md={12} sm={24} className="w-full lg:mb-0 mb-5">
                    <Form.Item name="language" label={messages.labels.language} className="
    [&_.ant-form-item-row]:!flex-col
    [&_.ant-form-item-row]:!flex
    [&_.ant-form-item-row]:!items-start
    [&_.ant-form-item-row]:!justify-start
    [&_.ant-form-item-control]:!w-full
    [&_.ant-select-selector]:!h-11
    [&_.ant-select-selector]:!rounded-lg
    [&_.ant-select-selector]:!text-canBlack
    [&_.ant-select-selector]:!text-base
    [&_.ant-select-selector]:!font-medium
    [&_.ant-form-item-label>label]:!font-normal
    [&_.ant-form-item-label>label]:!text-canBlack
    [&_.ant-select-selection-search-input]:!h-full
    [&_.ant-select-selector]:!items-center
    [&_.ant-select-selector]:!border-canGrey2
    [&_.ant-select-selector]:!shadow-none
    [&_.ant-select-selector]:focus:!ring-0
    [&_.ant-select-selector]:focus:!border-canGrey2
    [&_.ant-select-selector]:hover:!border-canGrey2
    [&_.ant-select-selector]:hover:!shadow-none
    [&_.ant-select-selector]:active:!ring-0
    [&_.ant-select-selector]:active:!border-canGrey2
    [&_.ant-select-selection-item]:!text-base
    !mb-0">
                        <Select
                            id="selectLanguage"
                            size="large"
                            placeholder="Select a language"

                            showSearch
                            optionFilterProp="children"
                            suffixIcon={
                                <Image src="/images/caret-icon.svg" width={16} height={9} alt="" />
                            }
                            onChange={handleChangeLanguage}
                            className="
                            !border-none
                            !shadow-none
                            !focus:!ring-0
                            !focus:!border-none
                            !hover:!border-none
                            !hover:!shadow-none
                            !active:!ring-0
                            !active:!border-none
                        [&_.ant-select-selection-placeholder]:!font-normal
                        [&_.ant-select-selection-placeholder]:!text-base
                        [&_.ant-select-selection-placeholder]:!text-canLight
                          "
                        >
                            {listOfOption(languageList, "languages")}
                        </Select>
                    </Form.Item>
                </Col>
                <Col md={12} sm={24} className="w-full">
                    <Form.Item
                        name="default_algo"
                        label={messages.labels.chooseAlgorithm}
                        className="
                                    [&_.ant-form-item-row]:!flex-col
                                    [&_.ant-form-item-row]:!flex
                                    [&_.ant-form-item-row]:!items-start
                                    [&_.ant-form-item-row]:!justify-start
                                    [&_.ant-form-item-control]:!w-full
                                    [&_.ant-select-selector]:!h-11
                                    [&_.ant-select-selector]:!rounded-lg
                                    [&_.ant-select-selector]:!text-canBlack
                                    [&_.ant-select-selector]:!text-base
                                    [&_.ant-select-selector]:!font-medium
                                    [&_.ant-form-item-label>label]:!font-normal
                                    [&_.ant-form-item-label>label]:!text-canBlack
                                    [&_.ant-select-selection-search-input]:!h-full
                                    [&_.ant-select-selector]:!items-center
                                    [&_.ant-select-selector]:!border-canGrey2
                                    [&_.ant-select-selector]:!shadow-none
                                    [&_.ant-select-selector]:focus:!ring-0
                                    [&_.ant-select-selector]:focus:!border-canGrey2
                                    [&_.ant-select-selector]:hover:!border-canGrey2
                                    [&_.ant-select-selector]:hover:!shadow-none
                                    [&_.ant-select-selector]:active:!ring-0
                                    [&_.ant-select-selector]:active:!border-canGrey2
                                    [&_.ant-select-selection-item]:!text-base
                                    !mb-0
  "
                    >
                        <Select
                            id="algorithms"
                            size="large"
                            placeholder={messages.placeholders.algorithm}
                            showSearch
                            optionFilterProp="children"
                            suffixIcon={<Image src="/images/caret-icon.svg" width={16} height={9} alt="" />}
                            onChange={handleAlgorithmChange}
                            className="
                            !border-none
                            !shadow-none
                            !focus:!ring-0
                            !focus:!border-none
                            !hover:!border-none
                            !hover:!shadow-none
                            !active:!ring-0
                            !active:!border-none
                            [&_.ant-select-selection-placeholder]:!font-normal
                            [&_.ant-select-selection-placeholder]:!text-base
                          [&_.ant-select-selection-placeholder]:!text-canLight
    "
                        >
                            {listOfOption(algorithmList, "algorithms")}
                        </Select>
                    </Form.Item>

                </Col>
            </Row>
            <Row className="lg:flex hidden">
                <Col md={24} className="w-full">
                    <hr className="my-10" />
                </Col>
            </Row>
            <div className="lg:mt-0 mt-12">
                <h3 className="text-base font-semibold text-canBlack lg:mb-5 mb-7">Topic Tags</h3>
                <div className="flex lg:justify-between lg:items-center mb-5 lg:flex-row flex-col">
                    <div className="flex-1 order-2 lg:order-1  ">
                        <p className="text-base font-medium">You have set <span className="text-canBlue text-base font-medium">{selectedCount} Topic Tags </span>as your preference</p>
                    </div>


                    <Input
                        placeholder="Search via Topic Tags name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="lg:w-72 w-full h-11 rounded-lg border-canGrey2 lg:mb-0 mb-7 lg:order-0 order-1 placeholder:!text-base placeholder:!text-canBlue placeholder:!font-normal focus:!border-canGrey2 focus:!shadow-none hover:!border-canGrey2"
                        suffix={
                            <Image src="/images/search-icon.svg" width={16} height={16} alt="" />
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
                            className=""
                        >
                            {ch.title}
                        </CustomCheckbox>
                    ))
                ) : (
                    <p>No tags found</p>
                )}
            </div>

            <div className="flex justify-center gap-5 mt-10">

                <Button onClick={onDiscard} disabled={loading}

                    className="Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-12 hover:text-canBlack flex gap-2.5 items-center bg-btnBg bg-opacity-10 text-canBlack text-base font-medium rounded-lg border-canBlue justify-center w-[12.5rem] hover:!border-canBlue hover:bg-btnBg active:bg-btnBg active:bg-opacity-10 hover:bg-opacity-10 active:!border-canBlue active:text-canBlue"
                >
                    Discard
                    <Image
                        src="/images/cross-dark.svg"
                        width={16}
                        height={16}
                        alt="no image"
                    />
                </Button>

                <Form
                    form={formVerify}
                    onFinish={onFinish2}

                >

                    <Button
                        className=" Profile_btn ant-btn ant-btn-orange ant-btn-lg py-2.5 px-6 hover:bg-canBlue hover:text-white flex gap-2.5 items-center bg-canBlue text-white text-base font-medium rounded-lg border-none justify-center w-[12.5rem] active:bg-canBlue"
                        type="primary"
                        loading={loading}
                        onClick={async (e) => {
                            try {

                                await formVerify.validateFields();
                                await onFinish2(formVerify.getFieldsValue());


                                await onFinish(e);
                            } catch (error) {

                            }
                        }}
                    >
                        Save
                    </Button></Form>
            </div>
        </section>
    );

}

export default ProfilePrefrences;