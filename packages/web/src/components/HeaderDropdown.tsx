import React from 'react';
import {Dropdown} from 'antd';
import type {DropDownProps} from 'antd/es/dropdown';
import {useEmotionCss} from '@ant-design/use-emotion-css';

export type HeaderDropdownProps = {
    overlayClassName?: string;
    placement?: 'bottomLeft' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight' | 'bottomCenter';
} & Omit<DropDownProps, 'overlay'>;

const HeaderDropdown: React.FC<HeaderDropdownProps> = ({overlayClassName: cls, ...restProps}) => {
    const className = useEmotionCss(({token}) => {
        return {
            [`@media screen and (max-width: ${token.screenXS})`]: {
                width: '100%',
            },
        };
    });
    return <Dropdown overlayClassName={className} {...restProps} />;
};
export default HeaderDropdown;
