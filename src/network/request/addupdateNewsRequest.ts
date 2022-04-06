import K from "../../constants";
import Request from "."

export default class addNewsRequest extends Request {
    constructor(params) {
      super(params);
    }
  
    // Define request functions below.
  
    static getAddNewsrequest(body) {
      
     console.log(" -------------------------body in req od add  news ",body.topic_num,body.camp_num,body.available_for_child,body.link,body.display_text )
  //    {
  //     "topic_num":12,
  //     "camp_num":1,
  //     "available_for_child":1,
  //     "link":"facebook.com",
  //     "display_text":"any text"
  // }
      return new Request(
        K.Network.URL.GetAddNewsFeeds,
        K.Network.Method.POST,
       {  
        "topic_num":body.topic_num,
        "camp_num":body.camp_num,
        "available_for_child":body.available_for_child,
        "link":body.link,
        "display_text":body.display_text
        },
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
    
    static geteditNewsFeedData(body) {
     console.log("body in req ", body.topic_num, body.camp_num )
      return new Request(
        K.Network.URL.GetEditNewsFeeds,
        K.Network.Method.POST,
        {
          "topic_num":body.topic_num,
          "camp_num":body.camp_num
        }
       ,
        K.Network.Header.Type.Json,
        {}
      );
    }

    static getupdateNewsFeedData(body) {
   
      return new Request(
        K.Network.URL.GetUpdateNewsFeeds,
        K.Network.Method.POST,
        {
          "topic_num":body.topic_num,
          "camp_num":body.camp_num,
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
  
  