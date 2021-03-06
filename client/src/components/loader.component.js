import React from "react";

const Loader = () => {
  return (
    <>
      <div className="d-flex justify-content-center loader-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Carregando...</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
