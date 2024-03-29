import NetworkCall from "../networkCall";
import EventLine from "../request/eventLineRequest";
import { store } from "../../store";
import { setTopicName } from "../../store/slices/campDetailSlice";

export const getEventLineApi = async (reqBody) => {
  try {
    const eventLineData = await NetworkCall.fetch(
      EventLine.getEventLine(reqBody),
      false
    );
    if (eventLineData?.code == 200) {
      store.dispatch(
        setTopicName(
          eventLineData?.data[
            Object.keys(eventLineData?.data).sort()[
              Object.keys(eventLineData?.data).length - 1
            ]
          ]?.payload_response[0]?.title
        )
      );
    }
    return eventLineData.data;
  } catch (error) {
    return error;
  }
};
