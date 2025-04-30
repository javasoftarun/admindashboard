const LoadingSpinner = () => (
    <div
      className="d-flex justify-content-center align-items-center my-4"
      style={{
        width: "100%",
        height: "100px",
      }}
    >
      <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
  
  export default LoadingSpinner;