# e-drawer

> 儿童绘本编辑器

### 更新记录
2018-10-28
<p>1、统一数据结构</p>
<p>2、h5阅读器简单展示</p>
<p>3、字号行高和组件高度的关系调整</p>
<p>4、全局地图，各种缩放比例转换</p>
 
2018-10-20
<p>1、组件间通讯使用的是message bus；</p>
<p>2、数据结构由集合改成多维链式数据；</p>

###TODO LIST
- [x] 分离数据操作和dom操作【数据操作在vue页面内执行，所有组件相关的dom操作转移drawerTools.js中】
- [x] 组件及画布的缩放适配
- [ ] 组件解析与组合【影响的是拖拽改变大小相关】
- [ ] 组件的旋转
- [ ] 组件的悬停提示信息
- [ ] 时间轴编辑器
- [ ] 操作历史回退
- [ ] 鼠标缩放事件

### 数据说明
> 组件是一个js对象，绘本数据是一个对象集合
```javascript
// 一个组件的数据格式，是一个用指针组成的多维链式结构，解析可以来 utils_mcfdata.js 方法集合
{
  '000002': {
    id: '000002', // id标识
    type: 1, // 组件类型 1-文字组件
    alisa: 'ASSET_FONT',
    previwer: '', // 预览图片地址
    template: `<div class="asset-continer__root">
              <div class="asset-container__wraper">
                <div class="asset-font__root">
                  <div class="asset-font__content">双击修改文字</div>
                </div>
              </div>
            </div>`, // html字符串
    content: 'HELLO 番茄号',
    style: {
      root: { // 限用属性【宽高、位置、边框、背景颜色】
        width: '100px',
        height: '18px',
        display: 'inline-block',
        cursor: 'move',
        position: 'absolute',
        left: '120px',
        top: '120px',
        zIndex: 1
      },
      content: { // 限用属性【变换属性】
        'color': '#f00',
        'fontFamily': 'Microsoft YaHei UI',
        'fontSize': '12px',
        lineHeight: '18px',
        letterSpacing: 0
      }
    }, // style 样式对象
    prev: null,
    next: null,
    parent: null,
    children: null
  }
}
```
```javascript
// 一个电子绘本书籍是一个对象集合的数据格式，每个对象的结构和组件的数据结构类似
[
    {
        "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6": {
            "id": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "type": 0,
            "alisa": "ASSET_CONTAINER",
            "previwer": "",
            "template": "<div class='asset-continer__root'></div>",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "400px",
                    "backgroundColor": "rgba(255, 255, 255, 0.5)",
                    "transform": "scaleX(1)",
                    "zIndex": 1
                }
            },
            "prev": null,
            "next": null,
            "parent": null,
            "children": [
                "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
                "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
                "ID_a3169f69-df6d-477f-afbc-de7c891893d6"
            ]
        },
        "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999": {
            "id": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "content": "../../static/images/default_img.jpg",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "288.135593220339px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "0px",
                    "top": "55.932203389830505px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51": {
            "id": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "330.3030303030303px",
                    "height": "61.36363636363636px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "34.848484848484844px",
                    "top": "133.69318644205728px",
                    "zIndex": 3
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "40.90909090909091px",
                    "lineHeight": "72px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "textAlign": "center"
                }
            },
            "prev": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "next": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_a3169f69-df6d-477f-afbc-de7c891893d6": {
            "id": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "封面",
            "style": {
                "root": {
                    "width": "37.878787878787875px",
                    "height": "11.363636363636363px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "369.6969696969697px",
                    "top": "379.905303048365px",
                    "zIndex": 4
                },
                "content": {
                    "color": "rgba(0, 0, 0, 0.73)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "7.575757575757575px",
                    "lineHeight": "12px",
                    "letterSpacing": "0px"
                }
            },
            "prev": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        }
    },
    {
        "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6": {
            "id": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "type": 0,
            "alisa": "ASSET_CONTAINER",
            "previwer": "",
            "template": "<div class='asset-continer__root'></div>",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "400px",
                    "backgroundColor": "rgba(255, 255, 255, 0.5)",
                    "transform": "scaleX(1)",
                    "zIndex": 1
                }
            },
            "prev": null,
            "next": null,
            "parent": null,
            "children": [
                "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
                "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
                "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
                "ID_9014bd4a-be5e-440b-8595-654a2fb1440c"
            ]
        },
        "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999": {
            "id": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "content": "../../static/images/default_img.jpg",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "288.135593220339px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "0px",
                    "top": "55.92802799109256px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51": {
            "id": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "123.48484848484848px",
                    "height": "18px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "4.545454545454545px",
                    "top": "7.935610684481533px",
                    "zIndex": 3
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "12px",
                    "lineHeight": "18px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "textAlign": "left"
                }
            },
            "prev": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "next": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_a3169f69-df6d-477f-afbc-de7c891893d6": {
            "id": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "第 1 页",
            "style": {
                "root": {
                    "width": "37.878787878787875px",
                    "height": "15px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "365.9090909090909px",
                    "top": "379.9053076541785px",
                    "zIndex": 4
                },
                "content": {
                    "color": "rgba(0, 0, 0, 0.73)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "7.575757575757575px",
                    "lineHeight": "12px",
                    "letterSpacing": "0px",
                    "opacity": 1
                }
            },
            "prev": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "next": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_9014bd4a-be5e-440b-8595-654a2fb1440c": {
            "id": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "从前有个可爱的小姑娘，谁见了都喜欢，但最喜欢她的是她的外婆，简直是她要什么就给她什么。一次，外婆送给小姑娘一顶用丝绒做的小红帽，戴在她的头上正好合适。从此，姑娘再也不愿意戴任何别的帽子，于是大家便叫她“小红帽”。",
            "style": {
                "root": {
                    "width": "380.3030303030303px",
                    "height": "108px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "12.121212121212121px",
                    "top": "217.02651977539062px",
                    "zIndex": 5
                },
                "content": {
                    "color": "rgba(132, 129, 129, 0.96)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "18px",
                    "lineHeight": "27px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "fontWeight": "bold"
                }
            },
            "prev": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        }
    },
    {
        "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6": {
            "id": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "type": 0,
            "alisa": "ASSET_CONTAINER",
            "previwer": "",
            "template": "<div class='asset-continer__root'></div>",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "400px",
                    "backgroundColor": "rgba(255, 255, 255, 0.5)",
                    "transform": "scaleX(1)",
                    "zIndex": 1
                }
            },
            "prev": null,
            "next": null,
            "parent": null,
            "children": [
                "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
                "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
                "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
                "ID_d65e28d8-9ae1-424d-86a2-e94c3e4902cd",
                "ID_9f4d1b7a-c397-4905-8586-ad138cd0d555"
            ]
        },
        "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999": {
            "id": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "content": "../../static/images/default_img.jpg",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "288.135593220339px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "0px",
                    "top": "55.92802799109256px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51": {
            "id": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "123.48484848484848px",
                    "height": "18px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "4.545454545454545px",
                    "top": "7.935610684481533px",
                    "zIndex": 3
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "12px",
                    "lineHeight": "18px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "textAlign": "left"
                }
            },
            "prev": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "next": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_a3169f69-df6d-477f-afbc-de7c891893d6": {
            "id": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "第 1 页",
            "style": {
                "root": {
                    "width": "37.878787878787875px",
                    "height": "15px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "365.9090909090909px",
                    "top": "379.9053076541785px",
                    "zIndex": 4
                },
                "content": {
                    "color": "rgba(0, 0, 0, 0.73)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "7.575757575757575px",
                    "lineHeight": "12px",
                    "letterSpacing": "0px",
                    "opacity": 1
                }
            },
            "prev": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "next": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_9014bd4a-be5e-440b-8595-654a2fb1440c": {
            "id": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "从前有个可爱的小姑娘，谁见了都喜欢，但最喜欢她的是她的外婆，简直是她要什么就给她什么。一次，外婆送给小姑娘一顶用丝绒做的小红帽，戴在她的头上正好合适。从此，姑娘再也不愿意戴任何别的帽子，于是大家便叫她“小红帽”。",
            "style": {
                "root": {
                    "width": "380.3030303030303px",
                    "height": "108px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "12.121212121212121px",
                    "top": "217.02651977539062px",
                    "zIndex": 5
                },
                "content": {
                    "color": "rgba(132, 129, 129, 0.96)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "18px",
                    "lineHeight": "27px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "fontWeight": "bold"
                }
            },
            "prev": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_1b638b03-8cb0-4a73-b429-b916256f9798": {
            "id": "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "style": {
                "root": {
                    "width": "228.03030303030303px",
                    "height": "165.15151515151516px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "27.27272727272727px",
                    "top": "55.160984848484844px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": [],
            "content": "/static/img/banner.e459d26.jpg"
        },
        "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99": {
            "id": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "type": 3,
            "alisa": "ASSET_SHAPE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-shape__root\">\n <div class=\"asset-shape__content\"></div>\n </div>\n </div>\n </div>",
            "style": {
                "root": {
                    "display": "inline-block",
                    "cursor": "move",
                    "width": "400px",
                    "height": "400.75757575757575px",
                    "position": "absolute",
                    "left": "0.7575757575757576px",
                    "top": "0.7575757575757576px",
                    "zIndex": 1
                },
                "content": {
                    "width": 400,
                    "height": 400.75757575757575,
                    "opacity": 1,
                    "backgroundColor": "rgba(0, 0, 0, 0.27)",
                    "borderTopWidth": "0px",
                    "borderRightWidth": "0px",
                    "borderBottomWidth": "0px",
                    "borderLeftWidth": "0px",
                    "borderTopColor": "#f0f",
                    "borderRightColor": "#f0f",
                    "borderBottomColor": "#f0f",
                    "borderLeftColor": "#f0f",
                    "borderStyle": "dashed",
                    "borderTopLeftRadius": "0px",
                    "borderTopRightRadius": "100px",
                    "borderBottomLeftRadius": "100px",
                    "borderBottomRightRadius": "0px"
                }
            },
            "prev": "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
            "next": "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13": {
            "id": "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "18px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "8.333333333333332px",
                    "top": "6.420459169330019px",
                    "zIndex": 2
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "12px",
                    "lineHeight": "18px",
                    "letterSpacing": "0px",
                    "opacity": 1
                }
            },
            "prev": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "next": "ID_d65e28d8-9ae1-424d-86a2-e94c3e4902cd",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_d65e28d8-9ae1-424d-86a2-e94c3e4902cd": {
            "id": "ID_d65e28d8-9ae1-424d-86a2-e94c3e4902cd",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "<div><span style=\"font-size: 15.84px;\">一天，妈妈对小红帽说：“来，小红帽，这里有一块蛋糕和一瓶葡萄酒，快给外婆送去，外婆生病了，身子很虚弱，吃了这些就会好一些的。趁着现在天还没有黑，赶紧动身吧。在路上要好好走，不要跑，也不要离开大路，否则你会摔跤的，那样外婆就什么也吃不上了。到外婆家的时候，别忘了说‘早上好’，也不要一进屋就东瞧西瞅。”</span></div><div><span style=\"font-size: 15.84px;\">“我会小心的。”小红帽对妈妈说，并且还和妈妈拉手作保证。</span></div>",
            "style": {
                "root": {
                    "width": "374.24242424242425px",
                    "height": "108px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "13.636363636363635px",
                    "top": "247.3295500784209px",
                    "zIndex": 3
                },
                "content": {
                    "color": "rgba(120, 118, 118, 1)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "12px",
                    "lineHeight": "18px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "fontWeight": "bold"
                }
            },
            "prev": "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
            "next": "ID_9f4d1b7a-c397-4905-8586-ad138cd0d555",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_9f4d1b7a-c397-4905-8586-ad138cd0d555": {
            "id": "ID_9f4d1b7a-c397-4905-8586-ad138cd0d555",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "第 2 页",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "14px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "358.3333333333333px",
                    "top": "379.14773189660275px",
                    "zIndex": 4
                },
                "content": {
                    "color": "rgba(0, 0, 0, 1)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "7px",
                    "lineHeight": "10.5px",
                    "letterSpacing": "0px",
                    "opacity": 1
                }
            },
            "prev": "ID_d65e28d8-9ae1-424d-86a2-e94c3e4902cd",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        }
    },
    {
        "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6": {
            "id": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "type": 0,
            "alisa": "ASSET_CONTAINER",
            "previwer": "",
            "template": "<div class='asset-continer__root'></div>",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "400px",
                    "backgroundColor": "rgba(255, 255, 255, 0.5)",
                    "transform": "scaleX(1)",
                    "zIndex": 1
                }
            },
            "prev": null,
            "next": null,
            "parent": null,
            "children": [
                "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
                "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
                "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13"
            ]
        },
        "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999": {
            "id": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "content": "../../static/images/default_img.jpg",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "288.135593220339px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "0px",
                    "top": "55.92802799109256px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51": {
            "id": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "123.48484848484848px",
                    "height": "18px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "4.545454545454545px",
                    "top": "7.935610684481533px",
                    "zIndex": 3
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "12px",
                    "lineHeight": "18px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "textAlign": "left"
                }
            },
            "prev": "ID_c4713b56-6c6f-4c8e-ad37-8676b25f7999",
            "next": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_a3169f69-df6d-477f-afbc-de7c891893d6": {
            "id": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "第 1 页",
            "style": {
                "root": {
                    "width": "37.878787878787875px",
                    "height": "15px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "365.9090909090909px",
                    "top": "379.9053076541785px",
                    "zIndex": 4
                },
                "content": {
                    "color": "rgba(0, 0, 0, 0.73)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "7.575757575757575px",
                    "lineHeight": "12px",
                    "letterSpacing": "0px",
                    "opacity": 1
                }
            },
            "prev": "ID_c5ad96b8-35d1-49fd-85de-c8d8a1bc2b51",
            "next": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_9014bd4a-be5e-440b-8595-654a2fb1440c": {
            "id": "ID_9014bd4a-be5e-440b-8595-654a2fb1440c",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "从前有个可爱的小姑娘，谁见了都喜欢，但最喜欢她的是她的外婆，简直是她要什么就给她什么。一次，外婆送给小姑娘一顶用丝绒做的小红帽，戴在她的头上正好合适。从此，姑娘再也不愿意戴任何别的帽子，于是大家便叫她“小红帽”。",
            "style": {
                "root": {
                    "width": "380.3030303030303px",
                    "height": "108px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "12.121212121212121px",
                    "top": "217.02651977539062px",
                    "zIndex": 5
                },
                "content": {
                    "color": "rgba(132, 129, 129, 0.96)",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "18px",
                    "lineHeight": "27px",
                    "letterSpacing": "0px",
                    "opacity": 1,
                    "fontWeight": "bold"
                }
            },
            "prev": "ID_a3169f69-df6d-477f-afbc-de7c891893d6",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_1b638b03-8cb0-4a73-b429-b916256f9798": {
            "id": "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
            "type": 2,
            "alisa": "ASSET_IMAGE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-image__root\">\n <div class=\"asset-image__content\">\n <img src=\"\" alt=\"\" style=\"width: 100%; display: block;\"/>\n </div>\n </div>\n </div>\n </div>",
            "style": {
                "root": {
                    "width": "228.03030303030303px",
                    "height": "165.15151515151516px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "15.15151515151515px",
                    "top": "22.585227272727273px",
                    "zIndex": 2
                },
                "content": {
                    "opacity": 1
                }
            },
            "prev": null,
            "next": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99": {
            "id": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "type": 3,
            "alisa": "ASSET_SHAPE",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-shape__root\">\n <div class=\"asset-shape__content\"></div>\n </div>\n </div>\n </div>",
            "style": {
                "root": {
                    "display": "inline-block",
                    "cursor": "move",
                    "width": "400px",
                    "height": "400.75757575757575px",
                    "position": "absolute",
                    "left": "0px",
                    "top": "0px",
                    "zIndex": 1
                },
                "content": {
                    "width": 400,
                    "height": 400.75757575757575,
                    "opacity": 1,
                    "backgroundColor": "rgba(0, 0, 0, 0.27)",
                    "borderTopWidth": "0px",
                    "borderRightWidth": "0px",
                    "borderBottomWidth": "0px",
                    "borderLeftWidth": "0px",
                    "borderTopColor": "#f0f",
                    "borderRightColor": "#f0f",
                    "borderBottomColor": "#f0f",
                    "borderLeftColor": "#f0f",
                    "borderStyle": "dashed",
                    "borderTopLeftRadius": "0px",
                    "borderTopRightRadius": "100px",
                    "borderBottomLeftRadius": "100px",
                    "borderBottomRightRadius": "0px"
                }
            },
            "prev": "ID_1b638b03-8cb0-4a73-b429-b916256f9798",
            "next": "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        },
        "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13": {
            "id": "ID_67c7fa76-db20-4285-9757-ac5a4f2f3e13",
            "type": 1,
            "alisa": "ASSET_FONT",
            "previwer": "",
            "template": "<div class=\"asset-continer__root\">\n <div class=\"asset-container__wraper\">\n <div class=\"asset-font__root\">\n <div class=\"asset-font__content\">双击修改文字</div>\n </div>\n </div>\n </div>",
            "content": "小红帽的故事",
            "style": {
                "root": {
                    "width": "400px",
                    "height": "94px",
                    "display": "inline-block",
                    "cursor": "move",
                    "position": "absolute",
                    "left": "0px",
                    "top": "164px",
                    "zIndex": 2
                },
                "content": {
                    "color": "#f00",
                    "fontFamily": "Microsoft YaHei UI",
                    "fontSize": "48px",
                    "lineHeight": "72px",
                    "letterSpacing": "0px"
                }
            },
            "prev": "ID_1b3de40c-f2fa-47a0-ae9f-16ffa51aea99",
            "next": null,
            "parent": "ROOT_564a0437-51c9-46ca-b62d-710bb20369b6",
            "children": []
        }
    }
]
```


## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
