import React from "react";
import Routing from "./utils/Routing";
import BackendConnection from "./components/BackendConnection";

const App = () => {
  return (
    <div>
      <Routing />
      <BackendConnection />
      {/* <DynamicTableForm /> */}
      {/* <DynamicBlock /> */}
      {/* <ImageComp /> */}
      {/* <UploadTemplate /> */}
    </div>
  );
};

export default App;
