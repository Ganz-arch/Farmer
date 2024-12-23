const dotenv = require("dotenv");
const app = require("./app");
//Loads the enviromental varibles from the env file
dotenv.config();

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


