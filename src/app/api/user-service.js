const axios = require("axios");
const apiUrl = "http://localhost:4000";

// Function to handle errors
const handleError = (res, error) => {
  if (error.response && error.response.data) {
    res
      .status(error.response.status)
      .json({ error: error.response.data.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default async function handler(req, res) {
  const { method } = req;
  axios.defaults.baseURL = `${apiUrl}/`;
  axios.defaults.headers.common["authorization"] = req.headers.authorization;
  axios.defaults.headers.common["referer"] = req.headers.referer || "";
  switch (method) {
    case "GET":
      try {
        let { action = "" } = req.query;
        const data = req.query;
        const response = await axios.get("users/" + action, { params: data });
        res.status(200).json(response.data);
      } catch (error) {
        handleError(res, error);
      }
      break;

    case "POST":
      try {
        const data = req.body;
        let { action = "" } = data;
        const response = await axios.post("users/" + action, { data: data });
        res.status(201).json(response.data);
      } catch (error) {
        logger.error("Error in users API POST request: %o", error);
        handleError(res, error);
      }
      break;

    case "PUT":
      try {
        const { id, data } = req.body;
        const response = await axios.put(`users/${id}`, { data: data });
        res.status(200).json(response.data);
      } catch (error) {
        handleError(res, error);
      }
      break;

    case "PATCH":
      try {
        let { action = "" } = req.body;
        const { data } = req.body;
        const response = await axios.patch(`users/` + action, { data: data });
        res.status(200).json(response.data);
      } catch (error) {
        handleError(res, error);
      }
      break;

    case "DELETE":
      try {
        const userId = req.body.id;
        const response = await axios.delete(`users/${userId}`);
        res.status(200).json(response.data);
      } catch (error) {
        handleError(res, error);
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
