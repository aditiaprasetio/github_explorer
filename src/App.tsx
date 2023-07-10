import React from 'react';
import './App.css';
import {ConfigProvider, Layout, Space} from 'antd';
import MainApp from './screens';
import { Content } from 'antd/es/layout/layout';
import Title from 'antd/es/typography/Title';

function App() {
  return (
    <ConfigProvider>
      <Layout>
        <Content className="site-content">
          <Title level={3} style={{ textAlign: 'center' }}>
            GitHub Repositories Explorer
          </Title>
          <MainApp />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
