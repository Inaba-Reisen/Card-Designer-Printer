const resource_1 = {

    "layout": {
        "html": `
<div id="title" class="title">new title</div>
<div id="content" class="content">new content</div>`,

        "css": `
.title {
    font-weight: bolder;
    color: white;
}
.content{
    color: white;
}`,

        "background": `${bkg1}`
    },

    "name": "resource_1",

    "attrs": ["title", "content"],

    "content": [{
            "title": "the タイトル　です ね",
            "content": "the content of 1"
        }, {
            "title": "the 2",
            "content": "the content of 2"
        },
        {
            "title": "the 3",
            "content": "the content of 3"
        }
    ]
}