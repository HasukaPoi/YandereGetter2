import "./OnePost.css";
import React from "react";
import { Col, Card, Collapse } from 'antd';

class OnePost extends React.Component {

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

    render() {
        let post = this.props.post;
        if (typeof (this.props.postStyle) === "undefined" || this.props.postStyle == 1) {
            return (
                <Col xs={24} md={12} xl={8} style={{ minHeight: "160px" }}>
                    <Card>
                        <div style={{
                            float: "right",
                            width: "150px",
                            height: "160px",
                            textAlign: "center",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}><a href={"https://yande.re/post/show/" + post["id"]} target="_blank" rel="noreferrer"><img src={post.preview_url}
                            key={post.id}
                            alt={"preview of " + post.id}
                            style={{ maxWidth: "150px", maxHeight: "150px" }} /></a></div>
                        <div>ID: {post.id}</div>
                        <div>Tags: {post.tags}</div>
                        <div>Rating: {post.rating}</div>
                        <div>File Size: {post.file_ext} {post.width}*{post.height}</div>
                        <div><a href={post.sample_url}>Sample<small>({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</small></a></div>
                        <div><a href={post.file_url}>Original<small>({this.calcFileSize(post.file_size)} {post.width}*{post.height})</small></a></div>
                    </Card>
                </Col>
            );
        } else return (
            <Col xs={12} sm={8} md={6} xl={4} style={{ minHeight: "160px" }}>
                <Card>
                    <div style={{
                        textAlign: "center",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}><a href={"https://yande.re/post/show/" + post["id"]} target="_blank" rel="noreferrer"><img src={post.preview_url}
                        key={post.id}
                        alt={"preview of " + post.id}
                        style={{maxHeight: "200px" , maxWidth:"100%" }} /></a></div>
                    <Collapse ghost>
                        <Collapse.Panel header={"ID:" + post.id + " " + post.rating} key="1"> 
                            <p>{post.tags}</p>
                        </Collapse.Panel>
                    </Collapse>
                    <div>Source: <small><a href={post.source}>{post.source}</a></small></div>
                    <div><a href={post.sample_url}>Sample<small>({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</small></a></div>
                    <div><a href={post.file_url}>Original<small>({this.calcFileSize(post.file_size)} {post.width}*{post.height} {post.file_ext})</small></a></div>
                </Card>
            </Col>
        );
    }
}

export default OnePost; 