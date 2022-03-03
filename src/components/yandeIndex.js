import React from "react";
import axios from 'axios';
import { Button, Input,InputNumber, Row, Col, Divider, PageHeader, Layout, Space,Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import "./yandeIndex.css";
import OnePost from "./OnePost";


class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';
    apiUrl2 = 'https://yande.re/post.json';
    attrToShow = ["id", "tags", "source", "width", "height", "file_ext", "file_size", "preview_url", "sample_url", "jpeg_url", "file_url"];

    setting={};

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
        this.changeSetting2 = this.changeSetting2.bind(this);
        this.changePage=this.changePage.bind(this)
        this.pagePrev=this.pagePrev.bind(this);
        this.pageNext=this.pageNext.bind(this);

        this.state = {
            posts: [],
            keyword: "",
            loading: false,
            nsfw: false,
            limit: 40,
            limitSaved: 40,
            page: 1,
            settingChanged: false,
        }

        this.copySetting();
    }

    copySetting(){
        this.setting=JSON.parse(JSON.stringify(this.state));
        //
    }

    //关键字变更
    handleKeyword(e) {
        //按回车时执行搜索，否则更新state中的关键字
        //※antd不用ref，直接target
        //console.log(event.target.value)
        if (typeof (e) === "object") {
            //console.log(e);
            if (e.keyCode === 13) {
                this.setState({page:1})
                this.refreshPosts();
            } else {
                //this.setting.keyword = e.target.value;
                this.setState({keyword:e.target.value});
            }
        }else if (e==="search"){
            this.setState({page:1});
            this.refreshPosts();
        }
    }

    changeSetting2(arg1, arg2) {
        //Input: event
        //InputNumber: value, event
        //Switch: value, event
        // console.log(arg1);
        // console.log(arg2);
        let id;
        let value;
        if (typeof (arg1) === "object") {
            id = arg1.target.id;
            value = arg1.target.value;
        } else {
            id = arg2.target.id;
            if (id === "") {
                //Switch的时候也许触发的不一样
                id = arg2.target.parentNode.id;
            }

            value = arg1;
        }
        this.setState(state => {
            try {
                id = id.split("-")[1];
                state[id] = value;
                state.settingChanged = true;
            } catch (err) {

            } finally {
                return state;
            }
        })
    }

    changePage(arg1) {
        //console.log(arg1);
        if (typeof (arg1) === "object") {
            //传入Object表示触发的是onPressEnter事件
            this.refreshPosts();
        } else {
            if (arg1 < 1) { return; }
            this.setState({
                page: arg1
            })
        }
    }

    pagePrev() {
        this.setState(state => {
            return {
                page: state.page - 1 < 1 ? 1 : state.page - 1,
            }
        })
        this.refreshPosts();
    }

    pageNext() {
        this.setState(state => {
            return {
                page: state.page + 1,
            }
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

    refreshPosts(event) {
        this.setState({settingChanged:false});
        this.makeApiUrl();
        this.setState({
            loading: true,
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
                            <Input style={{ width: 'calc(100% - 100px)' }} placeholder="在这里输入tags" value={this.state.keyword} onChange={this.handleKeyword} onKeyUp={this.handleKeyword} />
                            <Button id="button-search" type="primary" icon={<SearchOutlined />} onClick={()=>{this.handleKeyword("search")}}>搜索</Button>
                        </Input.Group>
                    </Col>
                </Row>
                <Divider orientation="left" orientationMargin="0">
                    设置<small>{this.state.settingChanged ? "【未生效】" : ""}</small>
                </Divider>
                <div>※修改后需要重新执行搜索才有效。关键字中指定了rating的情况下覆盖NSFW模式设置项。</div>
                <div>NSFW模式: <Switch id="setting-nsfw" checked={this.state.nsfw} onChange={this.changeSetting2} /></div>
                <div>每页post数量：<Input id="setting-limit" style={{ width: '50px' }} value={this.state.limit} onChange={this.changeSetting2} /></div>
            </PageHeader>
        </>;
    }

    makePageTurner() {
        return <Row style={{ margin: "24px 12px" }}>
            <Col xs={24} md={12} xl={8}>
                <Button disabled={this.setting.page === 1} onClick={()=>{
                    this.changePage(this.state.page-1)
                    this.refreshPosts();
                    }} >上一页</Button>
                <span style={{margin:"0 12px"}}>当前在第 {this.setting.page} 页（第{(this.setting.page - 1) * this.setting.limit + 1}～{this.setting.page * this.setting.limit}张）</span>
                <Button onClick={()=>{
                    this.changePage(this.state.page+1)
                    this.refreshPosts();
                    }} >下一页</Button>
                跳转：<InputNumber style={{ width: '75px' }} value={this.state.page} onChange={this.changePage} onPressEnter={this.changePage} />
            </Col>
        </Row>;
    }

    componentDidMount() {
        this.refreshPosts();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.copySetting();
    }

    render() {
        let mainpart = <div>Loading...</div>
        if (!this.state.loading) {
            mainpart = <div style={{margin:"0 12px"}}><Row gutter={[12, 12]} >{
                this.state.posts.map((post, index) => {
                    //return this.makeOnePost(post);
                    //Each child in a list should have a unique "key" prop.
                    return <OnePost key={post.id} post={post} />
                })
            }</Row></div>
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