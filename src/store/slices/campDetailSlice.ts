import { createSlice } from "@reduxjs/toolkit";

export const treeSlice = createSlice({
  name: "tree",
  initialState: {
    tree: null,
    newsFeed: null,
    campStatement: null,
    campSupportingTree: null,
    currentTopicRecord: null,
    currentCampRecord: null,
    topic_name: null,
    history: {
      items: [],
      details: {
        ifIamSupporter: null,
        ifSupportDelayed: null,
        ifIAmExplicitSupporter: null,
        topic: null,
        liveCamp: null,
        unarchive_change_submitted: null,
      },
    },
    manageSupportStatusCheck: false,
    openDrawerForDirectSupportedCamp: false,
    openDrawerForManageSupport: false,
    disableSubmitButtonForDirectSupportedCamp: false,
    totalScoreforTreeCard:0,

    openDrawer: false,
    asOfValues: 0,
    clearAlgoFromRefineFilter: "",
    clearScoreFromRefineFilter: 0,
    // openConsensusTreePopup: true,
    manageSupportUrlLink: null,
    CurrentCheckSupportStatus: null,
    globalUserProfileData: "",
    globalUserProfileDataLanguage: "",
    globalUserProfileDataAlgo: "",
    globalUserProfileDataLastName: "",
    globalUserProfileDataEmail: "",
    address: "",
    updateAddress: {},
    userLanguageList: [],
    privateList: [],
    disableButtonForProfileInfo: false,
    postalCodeDisableForProfileInfo: false,
    addForProfileInfo: false,
    zipCodeForProfileInfo: false,
    birthdayForProfileInfo: "",

    currentGetCheckSupportExistsData: {
      camp_num: null,
      is_confirm: null,
      is_delegator: null,
      support_flag: null,
      topic_num: null,
      warning: null,
      remove_camps: [],
      message: null,
      disable_submit: null,
    },
    removedReasons: null,
    changeGoneLive: false,
    siblingCampData: [],
  },
  reducers: {
    setTree: (state, action) => {
      state.tree = action.payload;
    },
    setNewsFeed: (state, action) => {
      state.newsFeed = action.payload;
    },
    setCampStatement: (state, action) => {
      state.campStatement = action.payload;
    },
    setCurrentTopicRecord: (state, action) => {
      state.currentTopicRecord = action.payload;
    },
    setCurrentTopicRecordSubscriptionId: (state, action) => {
      state.currentTopicRecord = {
        ...state.currentTopicRecord,
        topicSubscriptionId: action.payload,
      };
    },
    setCurrentCampRecord: (state, action) => {
      state.currentCampRecord = action.payload;
    },
    setCurrentCampRecordSubscriptionId: (state, action) => {
      state.currentCampRecord = {
        ...state.currentCampRecord,
        subscriptionId: action.payload,
      };
    },
    setCampSupportingTree: (state, action) => {
      state.campSupportingTree = action.payload;
    },
    pushToCampSupportingTree: (state, action) => {
      state.campSupportingTree = [
        ...state.campSupportingTree,
        ...action.payload,
      ];
    },
    setHistory: (state, action) => {
      state.history = action.payload;
    },
    setTopicName: (state, action) => {
      state.topic_name = action.payload;
    },
    pushToCampHistory: (state, action) => {
      state.history = {
        ...state.history,
        items: [...(state?.history?.items || []), ...action.payload],
      };
    },
    setManageSupportStatusCheck: (state, action) => {
      state.manageSupportStatusCheck = action.payload;
    },
    setOpenDrawer: (state, action) => {
      state.openDrawer = action.payload;
    },
    // setOpenConsensusTreePopup: (state, action) => {
    //   state.openConsensusTreePopup = action.payload;
    // },
    setManageSupportUrlLink: (state, action) => {
      state.manageSupportUrlLink = action.payload;
    },
    setCurrentCheckSupportStatus: (state, action) => {
      state.CurrentCheckSupportStatus = action.payload;
    },
    setCheckSupportExistsData: (state, action) => {
      state.currentGetCheckSupportExistsData = {
        camp_num: action.payload.camp_num,
        is_confirm: action.payload.is_confirm,
        is_delegator: action.payload.is_delegator,
        support_flag: action.payload.support_flag,
        topic_num: action.payload.topic_num,
        warning: action.payload.warning,
        remove_camps: action.payload.remove_camps,
        message: action.payload.message,
        disable_submit: action.payload.disable_submit,
      };
    },
    setRemovedReasons: (state, action) => {
      state.removedReasons = action.payload;
    },
    setChangeGoneLive: (state, action) => {
      state.changeGoneLive = action.payload;
    },
    setSiblingCampData: (state, action) => {
      state.siblingCampData = action.payload;
    },
    setAsOfValues: (state, action) => {
      state.asOfValues = action.payload;
    },
    setClearAlgoFromRefineFilter: (state, action) => {
      state.clearAlgoFromRefineFilter = action.payload;
    },
    setClearScoreFromRefineFilter: (state, action) => {
      state.clearScoreFromRefineFilter = action.payload;
    },
    setGlobalUserProfileData: (state, action) => {
      state.globalUserProfileData = action.payload;
    },
    setGlobalUserProfileDataEmail: (state, action) => {
      state.globalUserProfileDataEmail = action.payload;
    },
    setOpenDrawerForDirectSupportedCamp: (state, action) => {
      state.openDrawerForDirectSupportedCamp = action.payload;
    },
    setUserLanguageList: (state, action) => {
      state.userLanguageList = action.payload;
    },
    setPrivateListForProfileInfo: (state, action) => {
      state.privateList = action.payload;
    },
    setAddressForProfileInfo: (state, action) => {
      state.address = action.payload;
    },
    setUpdateAddressForProfileInfo: (state, action) => {
      state.updateAddress = action.payload;
    },
    setDisableButtonForProfileInfo: (state, action) => {
      state.disableButtonForProfileInfo = action.payload;
    },
    setPostalCodeDisableForProfileInfo: (state, action) => {
      state.postalCodeDisableForProfileInfo = action.payload;
    },
    setAddForProfileInfo: (state, action) => {
      state.addForProfileInfo = action.payload;
    },
    setZipCodeForProfileInfo: (state, action) => {
      state.zipCodeForProfileInfo = action.payload;
    },
    setBirthdayForProfileInfo: (state, action) => {
      state.birthdayForProfileInfo = action.payload;
    },
    setGlobalUserProfileDataLastName: (state, action) => {
      state.globalUserProfileDataLastName = action.payload;
    },
    setGlobalUserProfileDataLanguage: (state, action) => {
      state.globalUserProfileDataLanguage = action.payload;
    },
    setGlobalUserProfileDataAlgo: (state, action) => {
      state.globalUserProfileDataAlgo = action.payload;
    },
    setOpenDrawerForManageSupport: (state, action) => {
      state.openDrawerForManageSupport = action.payload;
    },
    setDisableSubmitButtonForDirectSupportedCamp: (state, action) => {
      state.disableSubmitButtonForDirectSupportedCamp = action.payload;
    },
    settotalScoreforTreeCard: (state, action) => {
      state.totalScoreforTreeCard = action.payload;
    },
  },
});

export const {
  setTree,
  setTopicName,
  setNewsFeed,
  setCampStatement,
  setCampSupportingTree,
  pushToCampSupportingTree,
  setCurrentTopicRecord,
  setCurrentCampRecord,
  setHistory,
  setCurrentTopicRecordSubscriptionId,
  setCurrentCampRecordSubscriptionId,
  pushToCampHistory,
  setCurrentCheckSupportStatus,
  setCheckSupportExistsData,
  setManageSupportStatusCheck,
  setOpenDrawer,
  setManageSupportUrlLink,
  setRemovedReasons,
  setChangeGoneLive,
  setSiblingCampData,
  setAsOfValues,
  setClearAlgoFromRefineFilter,
  setClearScoreFromRefineFilter,
  setGlobalUserProfileData,
  setGlobalUserProfileDataEmail,
  setOpenDrawerForDirectSupportedCamp,
  setUserLanguageList,
  setPrivateListForProfileInfo,
  setAddressForProfileInfo,
  setUpdateAddressForProfileInfo,
  setDisableButtonForProfileInfo,
  setPostalCodeDisableForProfileInfo,
  setAddForProfileInfo,
  setZipCodeForProfileInfo,
  setBirthdayForProfileInfo,
  setGlobalUserProfileDataLastName,
  setGlobalUserProfileDataLanguage,
  setGlobalUserProfileDataAlgo,
  setOpenDrawerForManageSupport,
  setDisableSubmitButtonForDirectSupportedCamp,
  settotalScoreforTreeCard
  // setOpenConsensusTreePopup,
} = treeSlice.actions;

export default treeSlice.reducer;
