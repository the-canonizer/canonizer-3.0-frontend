class LoadTree {
  static SERVICE_API_PATH = "https://service.canonizer.com/api/v1/tree/get";
  static CSS_URL = "https://canonizer3.canonizer.com/embed/embed.css";
  static API_PATH = "https://api3.canonizer.com/api/v3/embedded-code-tracking";

  static IP_API = "https://api.ipify.org?format=json";

  static async init(params) {
    const { selector, topic_num, camp_num } = params;

    const asofdate = new Date().getTime(),
      algorithm = "blind_popularity";

    const tree = await this.getTree(topic_num, camp_num, asofdate, algorithm);

    const elm = document.querySelector(selector);

    if (elm) elm.innerHTML = tree;

    this.expandParent(elm);
    const session = await sessionStorage.getItem("created_at");
    if (!session) this.saveUserAgent();
  }

  static async getTree(topic_num, camp_num, asofdate, algorithm) {
    const reqBody = {
        topic_num,
        camp_num,
        algorithm,
        asofdate,
        update_all: 1,
        asOf: "default",
        fetch_topic_history: null,
      },
      option = {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

    const res = await fetch(LoadTree.SERVICE_API_PATH, option);
    const resData = await res.json();

    if (res.status === 200) {
      const generatedTree = await this.renderTreeNodes(
        "",
        resData?.data?.at(0),
        camp_num
      );
      const temp = `<html lang="en"><head><link href="https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/css/ionicons.css" rel="stylesheet" type="text/css" /><link rel="preconnect" href="https://fonts.googleapis.com"> <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin> <link href="https://fonts.googleapis.com/css2?family=Asap:wght@400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" type="text/css" href="${LoadTree.CSS_URL}" /></head><body><nav class="tree-nav">${generatedTree}</nav></body></html>`;

      return temp;
    }
    return "Something went wrong!";
  }

  static renderTreeNodes(prevNodes = "", data, camp_num, idx) {
    let sortedData = Object.keys(data)
      .map((key) => [Number(key), data[key]])
      .sort((a, b) => b[1].score - a[1].score);

    let nodes = "",
      index = idx || 0;

    sortedData.forEach((itemWithData) => {
      let item = itemWithData[0];

      if (data[item].children) {
        nodes += `<details class="tree-nav__item ${
          data[item].children?.length == 0 ? "is_empty" : "is-expandable"
        } ${+data[item].camp_id === +camp_num ? "need_parent_expand" : ""}" ${
          index === 0 || +data[item].camp_id === +camp_num ? "open" : ""
        } ><summary class="tree-nav__item-title"><a class="tree-nav__item-title" href="${
          data[item].link
        }" id="camp-${data[item].camp_id}">${
          data[item]?.title
        } <span class="scroe">${parseFloat(data[item].score)?.toFixed(
          2
        )}</span></a></summary>`;
        index++;
        nodes += LoadTree.renderTreeNodes(
          prevNodes,
          data[item].children,
          camp_num,
          index
        );
        nodes += `</details>`;
      } else {
        index++;
        nodes += `<a class="tree-nav__item-title" href="${
          data[item].link
        }" id="camp-${data[item].camp_id}">${
          data[item]?.title
        } <span class="scroe">${parseFloat(data[item].score)?.toFixed(
          2
        )}</span></a>`;
      }
    });

    return nodes;
  }

  static async expandParent(elm) {
    const child = elm.querySelector(".need_parent_expand");

    if (child) {
      let parent = child.parentNode;

      while (parent) {
        if (parent?.tagName?.toLowerCase() === "details") {
          if (!parent.hasAttribute("open")) {
            parent.setAttribute("open", "");
          }
        }
        parent = parent.parentNode;
      }
    }
  }

  static async saveUserAgent() {
    const josnRes = await fetch(LoadTree.IP_API),
      ipRes = await josnRes.json(),
      reqBody = {
        url: window.location.href,
        ip_address: ipRes.ip,
        user_agent: navigator.userAgent,
      },
      option = {
        method: "POST",
        body: JSON.stringify(reqBody),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

    const res = await fetch(LoadTree.API_PATH, option);
    const resData = await res.json();

    if (res.status === 200) {
      sessionStorage.setItem(
        "created_at",
        JSON.stringify(resData.data.created_at)
      );
    }
  }
}
