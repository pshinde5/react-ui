import React from "react";

export interface SettingInterface {
    baId?: string;
}

const baContext = React.createContext<SettingInterface>({});

export default baContext