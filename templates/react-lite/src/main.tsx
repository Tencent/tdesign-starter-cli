import React from 'react';
import ReactDOM from 'react-dom';
import { Button, ConfigProvider, Space } from 'tdesign-react';

import { AddIcon, CloudUploadIcon, DiscountIcon, CloudDownloadIcon } from 'tdesign-icons-react';
import TDesignLogo from '../assets/svg/assets-t-logo.svg?component';
import 'tdesign-react/es/style/index.css';

ReactDOM.render(
  <ConfigProvider globalConfig={{ classPrefix: 't' }}>
    <Space direction='vertical' style={{ width: '100%', textAlign: 'center' }}>
      <TDesignLogo />
      <h3> Welcome to use TDesign! </h3>
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
  </ConfigProvider>,
  document.getElementById('app'),
);

// 如果需要修改包括classPrefix或修改具体组件的design token等功能， 请使用esm版本
// 以下为esm版本使用方式

// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Button, ConfigProvider, Space } from 'tdesign-react/esm';
// import TDesignLogo from '../assets/svg/assets-t-logo.svg?component';

// import { AddIcon, CloudUploadIcon, DiscountIcon, CloudDownloadIcon } from 'tdesign-icons-react';

// import 'tdesign-react/esm/style/index.js';

// ReactDOM.render(
//   <ConfigProvider globalConfig={{ classPrefix: 't' }}>
//     <Space direction='vertical' style={{ width: '100%', textAlign: 'center' }}>
//       <TDesignLogo />
//       <h3> Welcome to use TDesign! </h3>
//       <Space>
//         <Button theme='primary' icon={<AddIcon />}>
//           新建
//         </Button>
//         <Button variant='outline' icon={<CloudUploadIcon />}>
//           上传文件
//         </Button>
//         <Button shape='circle' theme='primary' icon={<DiscountIcon />}></Button>
//         <Button shape='circle' theme='primary' icon={<CloudDownloadIcon />}></Button>
//         <Button variant='outline'> 搜索 </Button>
//       </Space>
//     </Space>
//   </ConfigProvider>,
//   document.getElementById('app'),
// );
