import React from "react";
import axios from 'axios';

//参考ruanyf/react-demos 的 demo12 制作。
class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';
    attrToShow = ["id", "tags", "source", "width", "height", "file_ext", "file_size", "preview_url", "sample_url", "jpeg_url", "file_url"];

    constructor(props) {
        super(props);

        this.state = {
            //初期化state，目前还没有东西
            posts: [],
        }
    }

    refreshPosts() {
        axios({ method: 'get', url: `${this.apiUrl}` })
            .then(response => {
                console.log(response.data)
                this.setState({
                    posts: response.data
                })
            });
    }

    componentDidMount() {
        this.refreshPosts();
    }

    makeOnePost(post) {


        return <div style={{ margin: "1em", minHeight: "160px", backgroundColor: "lightcyan" }}>
            <div style={{
                float: "right",
                width: "150px",
                height: "160px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}><img src={post["preview_url"]}
                key={post["id"]}
                alt={"preview of " + post["id"]}
                style={{ maxWidth: "150px", maxHeight: "150px" }} /></div>
            <div>ID: {post["id"]}</div>
            <div>Tags: {post["tags"]}</div>
            <div>Source: <a href={post["source"]}>{post["source"]}</a></div>

        </div>;
    }



    render() {
        return (<div>
            <h1>yande.re getter 2</h1>
            <div>{
                this.state.posts.map((post, index) => {
                    return this.makeOnePost(post);
                })
            }</div>
        </div>)
    }
}

export default YandeIndex;