import React from "react";
import axios from 'axios';
import { Button, Input,InputNumber, Row, Col, Divider, PageHeader, Layout, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./yandeIndex.css";
import OnePost from "./OnePost";


class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';
    apiUrl2 = 'https://yande.re/post.json';
    attrToShow = ["id", "tags", "source", "width", "height", "file_ext", "file_size", "preview_url", "sample_url", "jpeg_url", "file_url"];

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
            limitSaved: 40,
            page: 1,
            settingChanged: false
        }
    }

    //关键字变更
    handleKeyword(event) {
        //按回车时执行搜索，否则更新state中的关键字
        //※antd不用ref，直接target
        //console.log(event.target.value)
        if (event.keyCode === 13) {
            this.refreshPosts();
        } else {
            this.setState({
                page: 1,
                keyword: event.target.value,
            })
        }
    }

    changeSetting(event) {
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
        let keyword = this.state.keyword;
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
            limitSaved: this.state.limit,
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

    makeMenus() {
        return <>
            <PageHeader className="site-header" title="Yande.re Getter 2" subTitle="总之就是重新做的一个用来抓yande.re图片的工具" >
                <Row>
                    <Col xs={24} md={12} xl={8}>
                        <Input.Group compact>
                            <Input style={{ width: 'calc(100% - 100px)' }} placeholder="在这里输入tags" value={this.state.keyword} ref={this.inputKeyword} onChange={this.handleKeyword} onKeyUp={this.handleKeyword} />
                            <Button type="primary" icon={<SearchOutlined />} onClick={this.refreshPosts}>搜索</Button>
                        </Input.Group>
                    </Col>
                </Row>
                <Divider orientation="left" orientationMargin="0">
                    设置<small>{this.state.settingChanged ? "【未生效】" : ""}</small>
                </Divider>
                <div>※修改后需要重新执行搜索才有效。关键字中指定了rating的情况下覆盖NSFW模式设置项。</div>
                <div>NSFW模式: <input type="checkbox" checked={this.state.nsfw} ref={this.checkNsfw} onChange={this.changeSetting}></input></div>
                <div>每页post数量：<input type="text" value={this.state.limit} ref={this.inputLimit} onChange={this.changeSetting} /></div>
            </PageHeader>
        </>;
    }

    makePageTurner() {
        return <Row style={{ margin: "24px 0" }}>
            <Col xs={24} md={12} xl={8}>
                <Button disabled={this.state.page === 1} onClick={this.changePage.bind(this, this.state.page - 1)} >上一页</Button>
                当前在第 {this.state.page} 页（第{(this.state.page - 1) * this.state.limitSaved + 1}～{this.state.page * this.state.limitSaved}张）
                <Button onClick={this.changePage.bind(this, this.state.page + 1)} >下一页</Button>
                跳转：<input type="text" value={this.state.page} />
            </Col>
        </Row>;
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
            mainpart = <Row gutter={[12, 12]}>{
                this.state.posts.map((post, index) => {
                    //return this.makeOnePost(post);
                    //Each child in a list should have a unique "key" prop.
                    return <OnePost key={post.id} post={post} />
                })
            }</Row>
        }

        return (<Layout className="site-frame">
            {this.makeMenus()}
            {this.makePageTurner()}
            {mainpart}
            {this.makePageTurner()}
        </Layout>);

    }
}

export default YandeIndex;