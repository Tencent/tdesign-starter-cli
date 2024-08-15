import * as React from "react"
import { Button, ConfigProvider, Link, Space } from 'tdesign-react';
import { AddIcon, CloudUploadIcon, DiscountIcon, CloudDownloadIcon, JumpIcon } from 'tdesign-icons-react';
import TDesignLogo from './assets/svg/tdesign-logo.svg';
import WebpackLogo from './assets/svg/webpack-logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider globalConfig={{ classPrefix: 't' }}>
      <Space direction='vertical' style={{ width: '100%', textAlign: 'center' }}>
        <Space>
          <a href="https://tdesign.tencent.com/react/overview" target="_blank" rel="noreferrer">
            <img src={TDesignLogo} className="logo tdesign" alt="TDesign" />
          </a>
          <a href="https://webpack.js.org/" target="_blank" rel="noreferrer">
            <img src={WebpackLogo} className="logo webpack" alt="Webpack" />
          </a>
        </Space>
        <h2> Welcome to use
          <Link size="large" theme="primary" href="https://tdesign.tencent.com/react/overview" suffixIcon={<JumpIcon />} target="_blank">
            TDesign-react
          </Link>
          +
          <Link size="large" theme="primary" href="https://webpack.js.org/" suffixIcon={<JumpIcon />} target="_blank">
            Webpack
          </Link>
          !
        </h2>
        <h3>
          Experience it quickly using the
          <Link theme="warning" href="https://tdesign.tencent.com/starter/react/" suffixIcon={<JumpIcon />} target="_blank">
            TDesign Starter
          </Link>
          page template.
        </h3>

        <Space>
          <Button theme='primary' icon={<AddIcon />}>
            新建
          </Button>
          <Button variant='outline' icon={<CloudUploadIcon />}>
            上传文件
          </Button>
          <Button shape='circle' theme='primary' icon={<DiscountIcon />}></Button>
          <Button shape='circle' theme='primary' icon={<CloudDownloadIcon />}></Button>
          <Button variant='outline'> 搜索 </Button>
        </Space>
      </Space>
    </ConfigProvider>
  )
}
export default App
