import K from "../../constants";
import Request from ".";

const tokenBearer="eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiNDdjOGI5ODg3NTU1MzE4OTliY2U1MjYxY2Q1ZmY4MGVhYTM1NzI2MTU5NzE2YjA3ZjRkOTVhN2U2MzlmNjcyMTNkYTg4NDVhN2M4Mjk4MjAiLCJpYXQiOjE2NTAwMDk2MjQuNDIxMjc3LCJuYmYiOjE2NTAwMDk2MjQuNDIxMjgxLCJleHAiOjE2ODE1NDU2MjQuNDEzODQ1LCJzdWIiOiIzNDEiLCJzY29wZXMiOlsiKiJdfQ.TKgnaQnFWxJcv6iTCOU-ohzRcEjsBB3mb1zjxh5cN3lXNOT0dJTDn9VFKAJjGCHAlXMsk3xKhs4QTA2zC5CtEm8Pekxy4AKtw677c2ZMM850gy2wnUtVdKAK-Y3xJWMVPbfZbuWpCCkRDuN24JLq5tlwZDThf-o8SkBuedlbEmtscKS9CWUcf2SSdeZ9lW2EZfQObzys-FbepejXiw9EYLR-djQrvr0A1iXtPKBnvXtv0YEvA9pxCAlViPEHBrIcD0etMN_GJhgaMxPy1r_wv-67-vLb_QMKuqZ0DP5qICJo8YSZdd4y-3gdQ-QbAgCbn5rEWEQrylISuM2R2yI3OV9l7mX8PhfCRJfO67YjcqzufyZ-lAOXGlku7xEOkBaSxocbR0H1M88CZ6XflgQ8Re03V2264gp-Wa9C3vqP4dtyznnW_8zm9prmoxf24AkEV9UrlhQT3W0l08jbexk4r8_mMomnqrabyu0qYPjro-KoNfQQzE8g_ymtFGz_TTsOMT1RvROv2-nDfyOKznHN1rldvhsmQ6IwCwrYGGnw4jGuiQ6iEPZts0BqpmRhlPLTWiSwfexEsxAOsrAGBhtebKwWTRzib-SZnrI7tlIk7u7LE4SCccSqw_6cOJDzuwbYAiWDh_cQ3x54FTmXvcgFtVAq2fwWZeN1DX_Sk6seOQU"

export default class campNewsRequest extends Request {
  constructor(params) {
    super(params);
  }

  // Define request functions below.

  static addNewsDataRequest(reqBody) {

    return new Request(
      K.Network.URL.AddNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},
      tokenBearer
    );
  }

 

  static getCampNewsData(reqBody) {
    return new Request(
      K.Network.URL.GetCampNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},      tokenBearer
    );
  }
  static getCampEditNewsData(reqBody) {
    return new Request(
      K.Network.URL.GetCampEditNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {},      tokenBearer
    );
  }

  static updateNewsData(reqBody) {
   
    return new Request(
      K.Network.URL.UpdateNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}, tokenBearer
    );
  }

  static deleteNewsData(reqBody) {
    return new Request(
      K.Network.URL.DeleteNewsData,
      K.Network.Method.POST,
      reqBody,
      K.Network.Header.Type.Json,
      {}, tokenBearer
    );
  }
}
