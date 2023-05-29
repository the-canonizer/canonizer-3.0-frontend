// api.js
import fetch from 'isomorphic-unfetch';

export async function fetchMetadata() {
  const url = "http://codedistrictem.com:7020/api/v3/meta-tags";
  const requestOptions = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIyIiwianRpIjoiOGM3YzhjZmYwMGUwODkzZDgzY2NjYTZiODJkMzJjNzNkMGVhNDg3ODA2ODcxMTAyMjcxZmNiOWRiOTdjNDAzMDc2MTU1MzA4MDMzY2E5MGEiLCJpYXQiOjE2ODQ4NTA3NzMuMjM4MDAzLCJuYmYiOjE2ODQ4NTA3NzMuMjM4MDA5LCJleHAiOjE3MTY0NzMxNzMuMjM0MjIyLCJzdWIiOiIiLCJzY29wZXMiOlsiKiJdfQ.LghBuYGOanAx5gpGmjlgPfMPMiTRoV-f2yzmONWRLxGbX6TqREbEJaFhj9u-rprpeqhvDV0W288fDLFdBfC3O-BYUUvdghpYJHaUZxAdfGsoll8Rybkq5VYXEyCjjl_D8Wud5W2aoifQ0fBc1OXEjZod-rf1NCfFR2Vg9ly-J_EwjdnBVsH7MYpwulXQYXz7WD4iMBriD35YhggRDLW80azqrLEqi_HOnmYH-o0Lu8Glc170h2MNo7yLbAp2x0_6of7h7JZIR4FVnLC7BPXJXV699vM1i3gXgKjHAVdowBoDI7Xhml9c7xThGrbACZwhGDT6mJzY1y7QloZKRP1HUM-nfn33Tyawq6MGqmvoH0jQy34vmMBp6Qp5myI2JiUk4fGVGfXhbTQUnIx8D6ppeyXJdiDeJNmOdDA1D8XMGyTfgTuj7T714now0ImPShOkoOwwhnmEFFL360bRWk0bKW4Puvc0Vq2f6DXaQHohsQQMmePb7ogSLVC6z4mU4cRqakcj-GlnDrBG6HMk6PU8s2gA1BAW0TXnVf1AnQVLmxBJPmf6INnwdwMKM_TChOQrDxYreJ4hZ8Rc6HxuJeBBhXuejHuWbe2cUWqDGCRpT0T_4W8Jet_EA0UFOrvGttIbN4ZlSol4suva6z-dSbwk2PXgFDLNvzg6FBW07dw7IfM",
    },
    body: JSON.stringify({
      "page_name": "home",
      "keys": {
        "topic_num": 904,
        "camp_num": 1,
        "forum_num": 93
      }
    }),
    redirect: 'follow'
  };

  const response = await fetch(url, requestOptions);
  const data = await response.json();

  return {
    title: `${data?.data?.title} | OK`,
    description: data?.data?.description,
  };
}
