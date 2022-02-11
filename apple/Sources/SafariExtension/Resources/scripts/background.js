(()=>{"use strict";let e;const t="https://omnivore.app",s="https://omnivore.app/api/";function o(e){return new Promise((t=>{browserApi.storage.local.get(e,(s=>{const o=s&&s[e]||null;t(o)}))}))}function n(e){return new Promise((t=>{browserApi.storage.local.set(e,t)}))}function r(e){return new Promise((t=>{browserApi.storage.local.remove(e,t)}))}function a(t){t.setRequestHeader("Content-Type","application/json"),e&&t.setRequestHeader("Authorization",e)}function i(){o("postInstallClickComplete").then((e=>{e&&r("postInstallClickComplete")}))}function l(e){browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{type:"loading",text:"Saving..."}});const o=new XMLHttpRequest,n={BAD_DATA:"Unable to save page",NOT_ALLOWED_TO_PARSE:"Not allowed to parse this article",UNAUTHORIZED:"Please login to Omnivore to authorize this action",UNABLE_TO_FETCH:"Unable to fetch page",PAYLOAD_TOO_LARGE:"This article is too large"};o.onreadystatechange=function(){if(4===o.readyState)if(200===o.status){const{data:s}=JSON.parse(o.response);if("createArticle"in s)if("errorCodes"in s.createArticle){const o={text:n[s.createArticle.errorCodes[0]]||"Unable to save page",type:"error"};"UNAUTHORIZED"===s.createArticle.errorCodes[0]&&(o.errorCode=401,o.url=t,i()),browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:o})}else{const o=s.createArticle.createdArticle,n=s.createArticle.user,r=t+(o.hasContent?`/${n.profile.username}/`+o.slug:"/home");browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Page saved!",link:r,linkText:"View",type:"success"}})}else if("errorCodes"in s.createArticleSavingRequest)browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:n[s.createArticleSavingRequest.errorCodes[0]]||"Unable to save page",type:"error"}});else{const o=s.createArticleSavingRequest.articleSavingRequest,n=t+"/article/sr/"+o.id;browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Page saved!",link:n,linkText:"View",type:"success"}})}}else 400===o.status&&browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Unable to save page",type:"error"}})},browserApi.tabs.sendMessage(e.id,{action:ACTIONS.GetContent},(async n=>{if(!n||"object"!=typeof n)return;const{type:r,pageInfo:l,doc:c,uploadContentObjUrl:p}=n;let d=null;if("pdf"===r&&(d=await function(e,o,n,r){return new Promise((l=>{const c=new XMLHttpRequest;c.onreadystatechange=async function(){if(4===c.readyState){if(200===c.status){const{data:s}=JSON.parse(c.response);if("errorCodes"in s.uploadFileRequest&&"UNAUTHORIZED"===s.uploadFileRequest.errorCodes[0]&&(i(),browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Unable to save page",type:"error",errorCode:401,url:t}})),s.uploadFileRequest&&s.uploadFileRequest.id&&!("errorCodes"in s.uploadFileRequest)){const e=await function({id:e,uploadSignedUrl:t},s,o){return fetch(o).then((e=>e.blob())).then((o=>new Promise((n=>{const r=new XMLHttpRequest;r.open("PUT",t,!0),r.setRequestHeader("Content-Type",s),r.onerror=()=>{n(null)},r.onload=()=>{n({id:e})},r.send(o)}))))}(s.uploadFileRequest,n,r);return URL.revokeObjectURL(r),l(e)}browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Unable to save page",type:"error"}})}else 400===c.status&&browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Unable to save page",type:"error"}});l(!1)}};const p=JSON.stringify({query:"mutation UploadFileRequest($input: UploadFileRequestInput!) {\n        uploadFileRequest(input:$input) {\n          ... on UploadFileRequestError {\n            errorCodes\n          }\n          ... on UploadFileRequestSuccess {\n            id\n            uploadSignedUrl\n          }\n        }\n      }",variables:{input:{url:o,contentType:n}}});c.open("POST",s+"graphql",!0),a(c),c.send(p)}))}(e,encodeURI(e.url),l.contentType,p),!d||!d.id))return void browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{text:"Unable to save page",type:"error"}});const u=c&&c.length||d,g=u?CREATE_ARTICLE_QUERY:CREATE_ARTICLE_SAVING_REQUEST_QUERY,b={url:encodeURI(e.url)};u&&(b.preparedDocument={document:c,pageInfo:l},b.uploadFileId=d&&d.id||null);const A=JSON.stringify({query:g,variables:{input:b}});o.open("POST",s+"graphql",!0),a(o),o.send(A)}))}async function c(e){const t=await o(e+"_saveInProgress");if(!t)return;clearInterval(t);const s=await o(e+"_saveInProgressTimeoutId_"+t);s&&clearTimeout(s)}function p(e){function t(t,s){browserApi.tabs.get(e,(e=>{"complete"!==e.status?(browserApi.tabs.sendMessage(e.id,{action:ACTIONS.ShowMessage,payload:{type:"loading",text:"Page loading..."}}),s&&"function"==typeof s&&s()):(t&&"function"==typeof t&&t(),l(e))}))}c(e),t(null,(()=>{!function(e,t,s,o=1e3,n=10500){const r=setInterval(e,o),a=setTimeout((()=>{clearInterval(r),t()}),n);s&&"function"==typeof s&&s(r,a)}((()=>{t((()=>{c(e)}))}),(()=>{c(e),browserApi.tabs.get(e,(e=>{l(e)}))}),((t,s)=>{const o={};o[e+"_saveInProgress"]=t,o[e+"_saveInProgressTimeoutId_"+t]=s,n(o)}))}))}function d(r){return o("postInstallClickComplete").then((async o=>{if(o)return!0;if(browser.runtime.sendNativeMessage){const t=await browser.runtime.sendNativeMessage("omnivore",{message:ACTIONS.GetAuthToken});t.authToken&&(e=t.authToken)}return new Promise((e=>{const o=new XMLHttpRequest;o.onreadystatechange=function(){if(4===o.readyState&&200===o.status){const{data:s}=JSON.parse(o.response);s.me?(n({postInstallClickComplete:!0}),e(!0)):(browserApi.tabs.sendMessage(r,{action:ACTIONS.ShowMessage,payload:{type:"loading",text:"Loading..."}}),browserApi.tabs.sendMessage(r,{action:ACTIONS.ShowMessage,payload:{text:"",type:"error",errorCode:401,url:t}}),e(null))}};const i=JSON.stringify({query:"{me{id}}"});o.open("POST",s+"graphql",!0),a(o),o.send(i)}))}))}function u(e,t){let s="/images/toolbar/icon";if(ENV_IS_FIREFOX?s+="_firefox":ENV_IS_EDGE&&(s+="_edge"),e||(s+="_inactive"),("boolean"==typeof t?t:window.matchMedia("(prefers-color-scheme: dark)").matches)&&(s+="_dark"),ENV_IS_FIREFOX)return s+".svg";const o=["16","24","32","48"];ENV_IS_EDGE||o.push("19","38");const n={};for(let e=0;e<o.length;e++){const t=o[e];n[t]=s+"-"+t+".png"}return n}function g(e,t,s){browserActionApi.setIcon({path:u(t,s),tabId:e})}function b(e){const t=e&&e.id;t&&g(t,function(e){if("complete"!==e.status)return!1;const t=e.pendingUrl||e.url;return!(!t||!t.startsWith("https://")&&!t.startsWith("http://")||t.startsWith("https://omnivore.app/")&&t.startsWith("https://dev.omnivore.app/"))}(e))}browserApi.tabs.onActivated.addListener((({tabId:e})=>{!function t(){browserApi.tabs.get(e,(function(e){browserApi.runtime.lastError&&setTimeout(t,150),b(e)}))}()})),browserApi.tabs.onUpdated.addListener(((e,t,s)=>{t.status&&s&&s.active&&b(s)})),browserApi.tabs.onRemoved.addListener((e=>{!function(e){new Promise((e=>{browserApi.storage.local.get(null,(t=>{e(t||{})}))})).then((function(t){const s=[],o=Object.keys(t),n=e+"_saveInProgress";for(let e=0;e<o.length;e++){const t=o[e];t.startsWith(n)&&s.push(t)}0!==s.length&&r(s)}))}(e)})),browserActionApi.onClicked.addListener((function(){new Promise((e=>{browserApi.tabs.query({active:!0,currentWindow:!0},(function(t){e(t[0]||null)}))})).then((e=>{browserApi.tabs.sendMessage(e.id,{action:ACTIONS.Ping},(async function(t){if(t&&t.pong)await d(e.id)&&p(e.id);else{const t=browserApi.runtime.getManifest().content_scripts,s=[...t[0].js,...t[1].js];!function(t,s,o){function n(e,t,s){return function(){browserScriptingApi.executeScript(e,t,s)}}let r=async function(){await d(e.id)&&p(e.id)};for(let e=s.length-1;e>=0;--e)r=n(t,{file:s[e]},r);null!==r&&r()}(e.id,s)}}))}))})),browserApi.runtime.onMessage.addListener(((e,t,s)=>{if(e.forwardToTab)return delete e.forwardToTab,void browserApi.tabs.sendRequest(t.tab.id,e);e.action===ACTIONS.RefreshDarkMode&&g(t.tab.id,e.payload.value)})),browserActionApi.setIcon({path:u(!0)})})();