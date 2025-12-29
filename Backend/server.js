import { server } from "./index.js";
import { Connectmongoos } from "./src/config/mongoos.connection.js";

const PORT=process.env.PORT;


server.listen(PORT,()=>{
    console.log(`Server is Started at PORT ${PORT}`);
    Connectmongoos();
    
})