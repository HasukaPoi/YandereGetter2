import React from "react";
import axios from 'axios';

//参考ruanyf/react-demos 的 demo12 制作。
class YandeIndex extends React.Component {
    apiUrl = 'https://yande.re/post.json';

    constructor(props) {
        super(props);

        this.state = {
            //初期化state，目前还没有东西
            posts: []
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

    render() {
        return (<div>
            <h1>yande.re getter 2</h1>
            <div>{
                this.state.posts.map((post,index)=>{
                    let str="";
                    for(let key in post){
                        str+= key+" : "+post[key]+" , "
                    }
                    return <div>{str}</div>;
                })
            }</div>
        </div>)
    }
}

export default YandeIndex;