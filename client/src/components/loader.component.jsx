import React from "react";

// Centered on the screen over a blurred background. The navbar stays usable,
// so the user can leave a page that is taking long to load.
const Loader = () => {
  return (
    <div className="loader-overlay" role="status" aria-live="polite">
      <div className="loader-overlay__box">
        <div className="spinner-border text-primary"></div>
        <span>Carregando...</span>
      </div>
    </div>
  );
};

export default Loader;
