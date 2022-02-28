import React from "react";
import { Button, Input, Row, Col, Divider,Card } from 'antd';

class OnePost extends React.Component {
    constructor(props){
        super(props);
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

    // render(){
    //     let post=this.props.post;
    //     return <div style={{ margin: "1em", padding: "1em", minHeight: "160px", backgroundColor: "lightcyan" }}>
    //     <div style={{
    //         float: "right",
    //         width: "150px",
    //         height: "160px",
    //         textAlign: "center",
    //         display: "flex",
    //         alignItems: "center",
    //         justifyContent: "center"
    //     }}><a href={"https://yande.re/post/show/" + post["id"]} target="_blank"><img src={post.preview_url}
    //         key={post.id}
    //         alt={"preview of " + post.id}
    //         style={{ maxWidth: "150px", maxHeight: "150px" }} /></a></div>
    //     <div>ID: {post.id}</div>
    //     <div>Tags: {post.tags}</div>
    //     <div>Rating: {post.rating}</div>
    //     <div>File Size: {post.file_ext} {post.width}*{post.height}</div>
    //     <div>Source: <a href={post.source}>{post.source}</a></div>
    //     <div><a href={post.sample_url}>Download Sample({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</a></div>
    // </div>;
    // }

    render() {
        let post = this.props.post;
        return <Col xs={24} md={12} style={{ minHeight: "160px" }}>
            <Card>
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
            </Card>
        </Col>;
    }
}

export default OnePost;