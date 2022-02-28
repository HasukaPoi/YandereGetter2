import React from "react";
import axios from 'axios';
import { Button } from 'antd';
import "./yandeIndex.css";
import OnePost from "./OnePost";

class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';
    apiUrl2 = 'https://yande.re/post.json';
    attrToShow = ["id", "tags", "source", "width", "height", "file_ext", "file_size", "preview_url", "sample_url", "jpeg_url", "file_url"];

    //与this.state.keyword 的区别是
    //这个变量里添加了非NSFW模式用的参数rating:s
    //并且不会反映到搜索框中
    keyword = "";

    constructor(props) {
        super(props);

        //关键字输入框
        this.inputKeyword = React.createRef();
        //NSFW模式开关
        this.checkNsfw = React.createRef();

        this.inputLimit = React.createRef();

        //binding
        this.handleKeyword = this.handleKeyword.bind(this);
        this.refreshPosts = this.refreshPosts.bind(this);
        this.changeSetting = this.changeSetting.bind(this);

        this.state = {
            posts: [],
            keyword: "",
            loading: false,
            nsfw: false,
            limit: 40,
            page: 1,
            settingChanged: false
        }
    }

    //执行搜索
    handleKeyword(event) {
        this.setState({
            page: 1,
            keyword: this.inputKeyword.current.value,
        })
        if (event.keyCode === 13) {
            this.keyword = this.inputKeyword.current.value;
            this.refreshPosts();
        }
    }

    changeSetting() {
        this.setState({
            nsfw: this.checkNsfw.current.checked,
            limit: this.inputLimit.current.value,
            settingChanged: true,
        });
    }

    changePage(num) {
        if (num < 1) { return; }
        this.setState({
            page: num
        })
        this.refreshPosts();
    }

    makeApiUrl() {
        let para = "";
        let keyword = this.keyword;
        keyword = keyword.trim();
        if (!keyword.includes("rating") && !this.state.nsfw) {
            keyword = "rating:s " + keyword
        }
        console.log(keyword);
        para = para + "?tags=" + encodeURI(keyword);
        para = para + "&limit=" + this.state.limit;
        para = para + "&page=" + this.state.page;
        this.apiUrl2 = this.apiUrl + para;
        console.log(this.apiUrl2);
    }

    refreshPosts() {
        this.makeApiUrl();
        this.setState({
            loading: true,
            settingChanged: false,
        });
        axios({ method: 'get', url: `${this.apiUrl2}` })
            .then(response => {
                console.log(response.data)
                this.setState({
                    loading: false,
                    posts: response.data
                })
            });
    }

    //TODO Moved toOnePost.js
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

    //TODO Moved toOnePost.js
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
            <div>Rating: {post.rating}</div>
            <div>File Size: {post.file_ext} {post.width}*{post.height}</div>
            <div>Source: <a href={post.source}>{post.source}</a></div>
            <div><a href={post.sample_url}>Download Sample({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</a></div>
        </div>;

    }

    makeMenus() {
        return <div style={{ margin: "1em", padding: "1em", backgroundColor: "lightpink" }}>
            <div>关键字(以空格分隔): <input type="text" value={this.state.keyword} ref={this.inputKeyword} onChange={this.handleKeyword} onKeyUp={this.handleKeyword}></input><button onClick={this.refreshPosts}>搜索</button></div>
            <div>设置{this.state.settingChanged ? "【未生效】" : ""}　※修改后需要重新执行搜索才有效。关键字中指定了rating的情况下覆盖NSFW模式设置项。</div>
            <div>NSFW模式: <input type="checkbox" checked={this.state.nsfw} ref={this.checkNsfw} onChange={this.changeSetting}></input></div>
            <div>每页post数量：<input type="text" value={this.state.limit} ref={this.inputLimit} onChange={this.changeSetting}></input></div>
        </div>;
    }

    makePageTurner() {
        return <div>
            <input type="button" value="上一页" disabled={this.state.page === 1} onClick={this.changePage.bind(this, this.state.page - 1)} />
                当前在第 {this.state.page} 页（第{(this.state.page - 1) * this.state.limit + 1}～{this.state.page * this.state.limit}张）
            <input type="button" value="下一页" onClick={this.changePage.bind(this, this.state.page + 1)} />
            跳转：<input type="text" value={this.state.page} />
        </div>;
    }

    componentDidMount() {
        this.refreshPosts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // if (prevState.page!==this.state.page){
        //     this.refreshPosts();
        // }
    }

    render() {
        let mainpart = <div>Loading...</div>
        if (!this.state.loading) {
            mainpart = <div>{
                this.state.posts.map((post, index) => {
                    //return this.makeOnePost(post);
                    //Each child in a list should have a unique "key" prop.
                    return <OnePost key={post.id} post={post}/>
                })
            }</div>
        }

        return (<div>
            <h1>yande.re getter 2</h1>
            {this.makeMenus()}
            {this.makePageTurner()}
            {mainpart}
            {this.makePageTurner()}
        </div>);

    }
}

export default YandeIndex;