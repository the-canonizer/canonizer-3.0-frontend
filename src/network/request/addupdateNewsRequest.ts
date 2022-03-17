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

    static getcampNewsFeedData() {
     
      return new Request(
        K.Network.URL.GetCampNewsFeeds,
        K.Network.Method.POST,
        {
          "topic_num":45,
          "camp_num":1
        }
       ,
        K.Network.Header.Type.Json,
        {}
      );
    }
    
    static geteditNewsFeedData() {
     
      return new Request(
        K.Network.URL.GetEditNewsFeeds,
        K.Network.Method.POST,
        {
          "topic_num":45,
          "camp_num":1
        }
       ,
        K.Network.Header.Type.Json,
        {}
      );
    }

    static getupdateNewsFeedData(body) {
     
    console.log("body in   -req-  data obj  text => ",body)
    console.log("body in   -req-  data obj  text => ",body.display_text)
    
    console.log("body in   -req-  data obj  link => ",body.link)
    
    console.log("body in   -req-  data obj  => ",body.available_for_child)
      return new Request(
        K.Network.URL.GetUpdateNewsFeeds,
        K.Network.Method.POST,
        {
          "topic_num":45,
          "camp_num":1,
          "display_text":body.display_text,
          "link":body.link,
          "available_for_child":body.available_for_child
      }
       ,
        K.Network.Header.Type.Json,
        {}
      );
    }

  }
  
  