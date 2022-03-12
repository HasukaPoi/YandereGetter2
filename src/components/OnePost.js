import "./OnePost.css";
import React from "react";
import { Col, Card, Popover } from 'antd';

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

    changeRating(r) {
        switch (r.toLowerCase()) {
            case "e":
                return <span style={{ color: "red" }}>Explicit</span>;
            case "q":
                return <span style={{ color: "orange" }}>Questionable</span>;
            case "s":
                return <span style={{ color: "green" }}>Safe</span>;
            default:
                return r;
        }
    }

    makeTagsNotTooLong(post) {
        return <div style={{ maxWidth: "400px" }}>
            {post.tags}
        </div>;
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
            <div className="yandere-card" >
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "150px"
                }}><a href={"https://yande.re/post/show/" + post["id"]} target="_blank" rel="noreferrer">
                        <img src={post.preview_url}
                            key={post.id}
                            alt={"preview of " + post.id}
                            className="preview"
                            style={{ maxHeight: "150px", maxWidth: "150px" }} />
                    </a>
                </div>

                <div><span>{post.id}</span>&nbsp;{this.changeRating(post.rating)}</div>

                <div>
                    <Popover content={this.makeTagsNotTooLong(post)}><div className="singleline">{post.tags}</div></Popover>
                </div>


                <div>
                    <Popover content={post.source}><a href={post.source}>See Source</a></Popover>
                </div>
                <div><a href={post.sample_url}>Sample<small>({this.calcFileSize(post.sample_file_size)} {post.sample_width}*{post.sample_height})</small></a></div>
                <div><a href={post.file_url}>Original<small>({this.calcFileSize(post.file_size)} {post.width}*{post.height} {post.file_ext})</small></a></div>
            </div>
        );
    }
}

export default OnePost; 