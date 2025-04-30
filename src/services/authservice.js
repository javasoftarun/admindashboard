export const login = async (email, password) => {
    try {
      const response = await fetch("https://your-backend-api.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
  
      return await response.json(); // Return the response data
    } catch (err) {
      console.error("Error during login:", err.message);
      throw err; // Re-throw the error for the caller to handle
    }
  };