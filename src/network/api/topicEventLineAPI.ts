import NetworkCall from "../networkCall";
import EventLine from "../request/eventLineRequest";

import { mockData } from "../../components/ComponentPages/TimeLine/mockData";

export const getEventLineApi = async (reqBody) => {
  try {
    const eventLineData = await NetworkCall.fetch(
      EventLine.getEventLine(reqBody),
      false
    );

    return eventLineData?.data;
    // return mockData
  } catch (error) {
    // return mockData
  }
};
