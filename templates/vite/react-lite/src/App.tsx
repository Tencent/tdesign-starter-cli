import * as React from "react"
import { Button, ConfigProvider, Link, Space } from 'tdesign-react';
import { AddIcon, CloudUploadIcon, DiscountIcon, CloudDownloadIcon, JumpIcon } from 'tdesign-icons-react';
import TDesignLogo from './assets/svg/tdesign-logo.svg';
import ViteLogo from './assets/svg/vite-logo.svg';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider globalConfig={{ classPrefix: 't' }}>
      <Space direction='vertical' style={{ width: '100%', textAlign: 'center' }}>
        <Space>
          <a href="https://tdesign.tencent.com/react/overview" target="_blank">
            <img src={TDesignLogo} className="logo tdesign" alt="TDesign" />
          </a>
          <a href="https://vitejs.dev/" target="_blank">
            <img src={ViteLogo} className="logo vite" alt="Vite" />
          </a>
        </Space>
        <h2>tdesign-react + vite</h2>
        <h3> Welcome to use
          <Link theme="success" href="https://tdesign.tencent.com/react/overview" suffixIcon={<JumpIcon />} target="_blank">
            TDesign-react
          </Link>!
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
