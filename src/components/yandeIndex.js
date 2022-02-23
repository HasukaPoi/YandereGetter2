import React from "react";
import axios from 'axios';

//参考ruanyf/react-demos 的 demo12 制作。
class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';
    apiUrl2 = 'https://yande.re/post.json';
    attrToShow = ["id", "tags", "source", "width", "height", "file_ext", "file_size", "preview_url", "sample_url", "jpeg_url", "file_url"];

    keyword = "";

    constructor(props) {
        super(props);

        //关键字输入框
        this.inputKeyword = React.createRef();

        this.search = this.search.bind(this);

        this.state = {
            //初期化state，目前还没有东西
            posts: [],
            keyword: "",
            loading: false,
        }
    }

    //执行搜索
    search(event) {
        if (event.keyCode === 13) {
            // this.setState({
            //     keyword: this.inputKeyword.current.value,
            // });
            this.keyword = this.inputKeyword.current.value;
            this.refreshPosts();
        }
    }

    makeApiUrl() {
        let para = "";
        if (this.keyword.trim() !== "") {
            para = para + "?tags=" + encodeURI(this.keyword.trim());
            console.log(para);
        }
        this.apiUrl2 = this.apiUrl + para;
        console.log(this.apiUrl2);
    }

    refreshPosts() {
        this.makeApiUrl();
        this.setState({ loading: true });
        axios({ method: 'get', url: `${this.apiUrl2}` })
            .then(response => {
                console.log(response.data)
                this.setState({
                    loading: false,
                    posts: response.data
                })
            });
    }

    calcFileSize(size) {
        let unit = "kB";
        let num = size / 1024;
        if (num > 1024) {
            num = num / 1024;
            unit = "MB";
        }
        num = Math.round(num * 100) / 100;
        return num + unit;

    }

    makeOnePost(post) {

        return <div style={{ margin: "1em", padding: "1em", minHeight: "160px", backgroundColor: "lightcyan" }}>
            <div style={{
                float: "right",
                width: "150px",
                height: "160px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}><a href={"https://yande.re/post/show/" + post["id"]} target="_blank"><img src={post.preview_url}
                key={post.id}
                alt={"preview of " + post.id}
                style={{ maxWidth: "150px", maxHeight: "150px" }} /></a></div>
            <div>ID: {post.id}</div>
            <div>Tags: {post.tags}</div>
            <div>{post.file_ext} {post.width}*{post.height}</div>
            <div>Source: <a href={post.source}>{post.source}</a></div>
            <div><a href={post.sample_url}>Download Sample({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</a></div>
        </div>;

    }

    makeMenus() {
        return <div style={{ margin: "1em", padding: "1em", backgroundColor: "lightpink" }}>
            <div>Keyword: <input type="text" ref={this.inputKeyword} onKeyUp={this.search}></input></div>
        </div>;
    }

    componentDidMount() {
        this.refreshPosts();
    }

    render() {
        if (this.state.loading) {
            return <div>Loading</div>;
        } else {
            return (<div>
                <h1>yande.re getter 2</h1>
                {this.makeMenus()}
                <div>{
                    this.state.posts.map((post, index) => {
                        return this.makeOnePost(post);
                    })
                }</div>
            </div>);
        }
    }
}

export default YandeIndex;