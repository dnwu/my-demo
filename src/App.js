import React, { Component } from 'react';
import { Layout } from 'antd';
import './App.scss';
// import 'antd/lib/date-picker/style/css';
import Main from './pages/Main'
const { Header, Content, Footer } = Layout;


class App extends Component {
  render() {
    return (
      <div className="App">
        <Layout>
          <Header></Header>
          <Content>
            <Main></Main>
          </Content>
          <Footer>react map node mongodb ©2018 Created by dwan</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
