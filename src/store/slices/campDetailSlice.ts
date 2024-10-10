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
    manageSupportUrlLink: null,
    CurrentCheckSupportStatus: null,
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
  setManageSupportUrlLink,
  setRemovedReasons,
  setChangeGoneLive,
} = treeSlice.actions;

export default treeSlice.reducer;
