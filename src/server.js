const dotenv = require("dotenv");
const app = require("./app");
//Loads the enviromental varibles from the env file
dotenv.config();

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`App running in ${NODE_ENV} mode`);
});


