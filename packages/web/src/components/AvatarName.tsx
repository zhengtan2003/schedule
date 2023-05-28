import {useModel} from "@umijs/max";
import React from "react";

const AvatarName = () => {
    const {initialState} = useModel('@@initialState');
    const {currentUser} = initialState || {};
    return <span className="anticon">{currentUser?.name}</span>;
};
export default AvatarName;