import BaContext from "./../context/baContext";
import React from "react";

const withActivity = (Component: any, hRef: string) => (<BaContext.Provider value={{baId: hRef}}>
    <Component hRef={hRef}/>
</BaContext.Provider>
)

export default withActivity
