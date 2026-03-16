import axios from "axios";
import query from "querystring";

export default class PostRequest {
  // static host = "https://app.lotteriahr.mn/";
  static host = "https://app.khangroup.mn/";
  static post(name, param) {
    return axios.post(
      this.host + "get_inPICount.asmx/" + name,
      query.stringify(param),
    );
  }
  static post(name, param, header) {
    return axios.post(
      this.host + "get_inPICount.asmx/" + name,
      query.stringify(param),
      { headers: header },
    );
  }
}
