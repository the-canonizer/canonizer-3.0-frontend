import K from "../../constants";
import Request from "."

export default class addNewsRequest extends Request {
    constructor(params) {
      super(params);
    }
  
    // Define request functions below.
  
    static getTopicDetails(body) {
     
      return new Request(
        K.Network.URL,
        K.Network.Method.POST,
       {      },
        K.Network.Header.Type.Json,
        {}
      );
    }
  }
  
  