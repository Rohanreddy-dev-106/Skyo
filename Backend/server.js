import { server } from "./index.js";
import { Connectmongoos } from "./src/config/mongoos.connection.js";
// import {testRedis} from "./src/Users/user.controller.js"

const PORT=process.env.PORT;


server.listen(PORT,()=>{
    console.log(`Server is Started at PORT ${PORT}`);
    Connectmongoos();
    
})