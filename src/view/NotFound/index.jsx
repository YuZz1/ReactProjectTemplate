
// react
import React from "react";
// lib
import { Result, Button } from "antd";
// style
import './index.less';
// config
// script & methods & public
// store
// controller
// interface && type
// other

function NotFound() {

  const goBack = () => {
    window.history.back();
  };

  return (
    <div
      className="notfound-center"
    >
      <Result
        status="404"
        title="404"
        subTitle="Sorry, 你要访问的页面并不存在"
        extra={
          <Button type="primary" onClick={goBack}>
            Back
          </Button>
        }
      />
    </div>
  );
}

export default NotFound;
