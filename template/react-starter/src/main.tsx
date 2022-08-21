import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'tdesign-react';
import 'tdesign-react/es/style/index.css'; // 少量公共样式

const renderApp = () => {
  ReactDOM.render(
    <Button
      block={false}
      ghost={false}
      loading={false}
      shape="rectangle"
      size="medium"
      type="button"
      variant="base"
    >
      确定
    </Button>,
    document.getElementById('app'),
  );
};

renderApp();
